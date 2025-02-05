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
        removeRemoteMediaStream,
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
        try {
            if (!localStream) throw new Error('Local Stream not found');
            localStream.getAudioTracks().forEach(track => track.enabled = !micOn)
            toggle('mic')
            emit('toggle-mute', { sessionId: sessionId!, userId: user?.id });
        }
        catch (e) {
            console.error('Error toggling mic : ', e);
        }

    }
    const toggleVideo = () => {
        try {
            if (!localStream) throw new Error('Local Stream not found');
            localStream.getVideoTracks().forEach(track => track.enabled = !videoOn)
            toggle('video')
            emit('toggle-video', { sessionId: sessionId!, userId: user?.id });
        }
        catch (e) {
            console.error('Error toggling Video : ', e);
        }
    }
    const switchCamera = () => {
        try {
            if (!localStream) throw new Error('Local Stream not found');
            localStream?.getVideoTracks().forEach(track => track._switchCamera());
        } catch (error) {
            console.error("Camera switch failed:", error);
        }
    }


    const stopAllTracks = (stream: MediaStream) => {
        stream.getTracks().forEach(track => track.stop());
    };
    const closePeerConnection = (userId: string) => {
        const pc = peerConnections.current.get(userId);
        if (pc) {
            pc.ontrack = null;
            pc.onicecandidate = null;
            pc.close();
            peerConnections.current.delete(userId);
            pendingCandidates.current.delete(userId);
            removeRemoteMediaStream(userId); // *** Clean remote media state
        }
    };




    const createPeerConnection = (userId: string) => {
        const pc = new RTCPeerConnection(peerConstraints);

        pc.ontrack = (event: RTCTrackEvent<any>) => {
            // if (!isMounted.current) return;
            const remoteStream = new MediaStream();
            event.streams[0].getTracks().forEach((track: MediaStreamTrack) => {
                remoteStream.addTrack(track);
            });

            console.log('✅ Valid Remote Stream:', remoteStream.toURL());
            console.log('🎤 Audio Tracks:', remoteStream.getAudioTracks());
            console.log('📹 Video Tracks:', remoteStream.getVideoTracks());

            setRemoteMediaStream(userId, remoteStream);
        };

        pc.onupdatetrack = (event: RTCTrackEvent<any>) => {
            // Update remoteStream if the video track changes
            setRemoteMediaStream(userId, event.streams[0]);
        };


        pc.onicecandidate = (event: RTCIceCandidateEvent<any>) => {
            const iceCandidate = event.candidate;
            if (iceCandidate) {
                emit('send-ice-candidate', {
                    sessionId: sessionId!,
                    sender: user?.id,
                    receiver: userId,
                    candidate: iceCandidate,
                });
            }
        };

        return pc;
    };





    const startLocalStream = useCallback(async () => {
        try {
            const mediaStream = await mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setLocalStream(mediaStream);
            localStreamRef.current = mediaStream;
        } catch (error) {
            console.log('Error getting user media', error);
        }
    }, []);

    useEffect(() => {
        startLocalStream();
        return () => {

            if (localStreamRef.current) {
                console.log("🔴🔴🔴🔴 Cleaning Local Stream now 🔴🔴🔴🔴");
                stopAllTracks(localStreamRef.current);
                setLocalStream(null);
                localStreamRef.current = null;
            }
        }
    }, [startLocalStream]);



    const establishPeerConnections = async () => {
        const otherParticipants = [...participantsRef.current];

        otherParticipants.forEach(async streamUser => {
            if (!peerConnections.current.has(streamUser?.userId)) {

                const pc = createPeerConnection(streamUser?.userId);

                peerConnections.current.set(streamUser?.userId, pc);


                try {
                    if (localStreamRef.current === null) throw new Error('Local Stream not found');
                    localStreamRef.current.getTracks().forEach(track => {
                        pc.addTrack(track, localStreamRef.current!);
                    });


                    //_ Create offer and send to participant
                    const offerDescription = await pc.createOffer();
                    await pc.setLocalDescription(offerDescription);
                    emit('send-offer', {
                        sessionId: sessionId!,
                        sender: user?.id,
                        receiver: streamUser?.userId,
                        offer: offerDescription,
                    });
                } catch (error) {
                    console.error('Error creating or sending offer', error);
                    closePeerConnection(streamUser?.userId);

                }

            }


        });
    };

    const joiningStream = useCallback(async () => {
        await establishPeerConnections();
    }, [establishPeerConnections]);

    useEffect(() => {
        if (localStreamRef.current) {
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
            let pc = peerConnections.current.get(sender);
            if (!pc) {
                pc = createPeerConnection(sender);

                peerConnections.current.set(sender, pc);

                const pending = pendingCandidates.current.get(sender) || [];
                await Promise.all(pending.map(c => pc!.addIceCandidate(new RTCIceCandidate(c))));
                pendingCandidates.current.delete(sender);


                if (localStreamRef.current === null) throw new Error('Local Stream not found');
                localStreamRef.current.getTracks().forEach(track => {
                    pc!.addTrack(track, localStreamRef.current!);
                });
            }

            await pc.setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

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
            console.error('Error receiving answer', error);
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

        const pc = peerConnections.current.get(sender);
        if (pc) {
            pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.warn('Error adding ice candidate', e));
        }
        else {
            const pending = pendingCandidates.current.get(sender) || [];
            pendingCandidates.current.set(sender, [...pending, candidate]);
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


            peerConnections.current.forEach((_, userId) => closePeerConnection(userId));
            peerConnections.current.clear();
            pendingCandidates.current.clear();
        };
    }, [handleGetAllParticipants, handleNewParticipant, handleParticipantLeft, handleParticipantUpdate, handleReceiveOffer, handleReceiveAnswer, handleReceiveIceCandidate]);


    return {
        localStream,
        participants,
        sessionId,
        toggleMic,
        toggleVideo,
        switchCamera,
    }
}