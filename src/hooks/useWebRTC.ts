import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../services/api/SocketProvider";
import { IParticipant, useLiveMeetStore } from "../services/meetStore";
import { useUserStore } from "../services/userStore";
import { mediaDevices, MediaStream, MediaStreamTrack, RTCIceCandidate, RTCPeerConnection, RTCSessionDescription } from "react-native-webrtc";
import { peerConstraints } from "../utils/Helpers";
import RTCTrackEvent from "react-native-webrtc/lib/typescript/RTCTrackEvent";
import RTCIceCandidateEvent from "react-native-webrtc/lib/typescript/RTCIceCandidateEvent";
import { RTCSessionDescriptionInit } from "react-native-webrtc/lib/typescript/RTCSessionDescription";




export const useWebRTC = () => {
    const { emit, on, off } = useSocket();

    const { user } = useUserStore();

    const {
        participants,
        sessionId,
        micOn,
        videoOn,
        setRemoteMediaStream,
        addParticipant,
        toggle,
        removeParticipant,
        updateParticipant,
        clear,

    } = useLiveMeetStore();


    //_ Ref to fetch latest state 
    //* We can't use state in useEffect dependency to fetch latest state
    //* Instead use useState's alternative useRef that don't re-render but updates the value
    const participantsRef = useRef<IParticipant[]>([]);

    //_ Hydrate / Sync Zustand state 
    useEffect(() => {
        participantsRef.current = participants;
    }, [participants]);


    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    useEffect(() => {
        localStreamRef.current = localStream;
    }, [localStream]);


    // map -> id , RTCPeerConnection 
    const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());

    // map -> id , RTCIceCandidate[]
    //* To store pending candidates for participant's peerConnection that is not yet created
    const pendingCandidates = useRef<Map<string, RTCIceCandidate[]>>(new Map());

    const toggleMic = () => {
        if (localStream) {
            localStream?.getAudioTracks().forEach(track => track.enabled = !micOn
            )
        }
        toggle('mic');
        emit('toggle-mute', { sessionId: sessionId!, userId: user?.id });
    }
    const toggleVideo = () => {
        if (localStream) {
            localStream?.getVideoTracks().forEach(track => track.enabled = !videoOn
            )
        }
        toggle('video');
        emit('toggle-video', { sessionId: sessionId!, userId: user?.id });
    }
    const switchCamera = () => {
        if (localStream) {
            localStream?.getVideoTracks().forEach(track => track._switchCamera()
            )
        }
    }

    const startLocalStream = useCallback(async () => {
        try {
            const mediaStream = await mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setLocalStream(mediaStream);
        } catch (error) {
            console.log('Error getting user media', error);
        }
    }, []);

    useEffect(() => {
        startLocalStream();
        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => {
                    track.stop();
                });
            }
        }
    }, [startLocalStream]);



    const establishPeerConnections = async () => {
        participantsRef.current?.forEach(async streamUser => {
            if (!peerConnections.current.has(streamUser?.userId)) {

                const peerConnection = new RTCPeerConnection(peerConstraints);

                peerConnections.current.set(streamUser?.userId, peerConnection);


                peerConnection.ontrack = (event: RTCTrackEvent<any>) => {
                    const remoteStream = new MediaStream();
                    event.streams[0].getTracks().forEach((track: MediaStreamTrack) => {
                        remoteStream.addTrack(track);
                    });
                    console.log('RECEIVING REMOTE STREAM', remoteStream.toURL());
                    setRemoteMediaStream(streamUser?.userId, remoteStream);
                };




                peerConnection.onicecandidate = (event: RTCIceCandidateEvent<any>) => {
                    const iceCandidate = event.candidate;
                    if (iceCandidate) {
                        emit('send-ice-candidate', {
                            sessionId: sessionId!,
                            sender: user?.id,
                            receiver: streamUser?.userId,
                            candidate: iceCandidate,
                        });
                    }
                };



                localStream?.getTracks().forEach(track => {
                    peerConnection.addTrack(track, localStream!);
                });

                //_ Create offer and send to participant
                try {
                    const offerDescription = await peerConnection.createOffer();
                    await peerConnection.setLocalDescription(offerDescription);
                    emit('send-offer', {
                        sessionId: sessionId!,
                        sender: user?.id,
                        receiver: streamUser?.userId,
                        offer: offerDescription,
                    });
                } catch (error) {
                    console.error('Error creating or sending offer', error);
                }

            }


        });
    };

    const joiningStream = useCallback(async () => {
        await establishPeerConnections();
    }, [establishPeerConnections]);

    useEffect(() => {
        if (localStream) {
            joiningStream();
        }
    }, [joiningStream]);




    //_ Avoiding race condition
    //* Both new participant && all participants event can be fired at the same time
    //* Hence we fetch Latest state so both get consistent data not stale data
    const handleNewParticipant = useCallback((newParticipant: IParticipant) => {
        if (newParticipant.userId === user?.id) return;
        const currentParticipants = participantsRef.current;

        if (!currentParticipants.some(p => p.userId === newParticipant.userId)) {
            addParticipant(newParticipant);
        }
    }, []);

    const handleGetAllParticipants = useCallback((allParticipants: IParticipant[]) => {
        const currentParticipants = participantsRef.current;

        const otherParticipants = allParticipants.filter(p => p.userId !== user?.id);
        const newParticipants = otherParticipants.filter(
            p => !currentParticipants.some(existing => existing.userId === p.userId)
        );

        newParticipants.forEach(addParticipant);
        off('all-participants');
    }, []);

    const handleParticipantLeft = useCallback((userId: string) => {
        removeParticipant(userId);
    }, []);

    const handleParticipantUpdate = useCallback((updatedParticipant: IParticipant) => {
        updateParticipant(updatedParticipant);
    }, []);





    const handleReceiveOffer = useCallback(async ({ sender, receiver, offer }: {
        sender: string,
        receiver: string,
        offer: RTCSessionDescriptionInit
    }) => {
        if (receiver !== user?.id) return;

        try {
            let peerConnection = peerConnections.current.get(sender);
            if (!peerConnection) {
                peerConnection = new RTCPeerConnection(peerConstraints);
                peerConnections.current.set(sender, peerConnection);

                peerConnection.ontrack = (event: RTCTrackEvent<any>) => {
                    const remoteStream = new MediaStream();
                    event.streams[0].getTracks().forEach((track: MediaStreamTrack) => {
                        remoteStream.addTrack(track);

                        console.log('RECEIVING REMOTE STREAM🔥', remoteStream.toURL());
                    });
                    setRemoteMediaStream(sender, remoteStream);
                };

                peerConnection.onicecandidate = (event: RTCIceCandidateEvent<any>) => {
                    const iceCandidate = event.candidate;
                    if (iceCandidate) {
                        emit('send-ice-candidate', {
                            sessionId: sessionId!,
                            sender: receiver,
                            receiver: sender,
                            candidate: iceCandidate,
                        });
                    }
                };

                if (pendingCandidates.current.get(sender)) {
                    pendingCandidates.current.get(sender)?.forEach(candidate => {
                        if (!peerConnection) {
                            console.log('🛑🛑🛑🛑 Peer Connection not found🛑🛑🛑🛑');
                        }
                        peerConnection!.addIceCandidate(new RTCIceCandidate(candidate));
                    });
                    pendingCandidates.current.delete(sender);
                }
            }


            localStream?.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream!);
            });



            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            emit('send-answer', {
                sessionId: sessionId!,
                sender: receiver,
                receiver: sender,
                answer,
            });
        }
        catch (error) {
            console.error('Error creating or sending answer', error);
        }
    }, [peerConstraints]);


    const handleReceiveAnswer = useCallback(async ({
        sender,
        receiver,
        answer,
    }: {
        sender: string,
        receiver: string,
        answer: RTCSessionDescriptionInit,
    }) => {
        if (receiver !== user?.id) return;

        try {
            const peerConnection = peerConnections.current.get(sender);
            if (peerConnection) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            }
        } catch (error) {
            console.log('Error receiving answer', error);
        }
    }, []);


    const handleReceiveIceCandidate = useCallback(({
        sender, receiver, candidate
    }: {
        sender: string,
        receiver: string,
        candidate: RTCIceCandidate,
    }) => {
        if (receiver !== user?.id) return;

        const peerConnection = peerConnections.current.get(sender);
        if (peerConnection) {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
        else {
            if (!pendingCandidates.current.get(sender)) {
                pendingCandidates.current.set(sender, []);
            }
            pendingCandidates.current.get(sender)?.push(candidate);
        }
    }, []);




    useEffect(() => {
        const setupListeners = () => {
            if (!localStreamRef.current) {
                console.warn("❗ Waiting for local stream before setting up event listeners...");
            }
            else {
                console.log("🎥 Local stream ready, setting up event listeners");

                emit('current-room', { sessionId: sessionId! });
                on('all-participants', handleGetAllParticipants);
                on('new-participant', handleNewParticipant);
                on('participant-left', handleParticipantLeft);
                on('participant-update', handleParticipantUpdate);

                on('receive-offer', handleReceiveOffer);
                on('receive-answer', handleReceiveAnswer);
                on('receive-ice-candidate', handleReceiveIceCandidate);
            }

        };

        const waitForLocalStream = setInterval(() => {
            if (localStreamRef.current) {
                clearInterval(waitForLocalStream);
                setupListeners();
            }
        }, 100);

        return () => {
            console.log("🔴 Cleaning up event listeners");
            clear();

            emit('hang-up', { sessionId: sessionId!, userId: user?.id });
            off('new-participant');
            off('participant-left');
            off('participant-update');

            off('receive-offer');
            off('receive-answer');
            off('receive-ice-candidate');
        };
    }, [handleGetAllParticipants, handleNewParticipant, handleParticipantLeft, handleParticipantUpdate, handleReceiveOffer, handleReceiveAnswer, handleReceiveIceCandidate]);


    useEffect(() => {
        return () => {
            if (localStreamRef.current) {
                console.log("🔴🔴🔴🔴 Cleaning Local Stream now 🔴🔴🔴🔴");
                localStreamRef.current.getTracks().forEach(track => {
                    track.stop(); // Stop each track properly
                });
                localStreamRef.current = null;
            }
            peerConnections.current.forEach((pc) => pc.close());
            peerConnections.current.clear();
            pendingCandidates.current.clear();
        }
    }, [])



    return {
        localStream,
        participants,
        sessionId,
        toggleMic,
        toggleVideo,
        switchCamera,
    }
}