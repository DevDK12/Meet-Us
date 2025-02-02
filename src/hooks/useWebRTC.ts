import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../services/api/SocketProvider";
import { IParticipant, useLiveMeetStore } from "../services/meetStore";
import { useUserStore } from "../services/userStore";
import { mediaDevices, MediaStream } from "react-native-webrtc";




export const useWebRTC = () => {
    const { emit, on, off } = useSocket();

    const { user } = useUserStore();

    const {
        participants,
        sessionId,
        addParticipant,
        micOn,
        videoOn,
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


    useEffect(() => {
        emit('current-room', { sessionId: sessionId! });
        on('all-participants', handleGetAllParticipants);
        on('new-participant', handleNewParticipant);
        on('participant-left', handleParticipantLeft);
        on('participant-update', handleParticipantUpdate);

        return () => {
            localStream?.getTracks().forEach(track => track.stop());
            emit('hang-up', { sessionId: sessionId!, userId: user?.id });
            clear();
            off('new-participant');
            off('participant-left');
            off('participant-update');
        }
    }, []);


    //_ Avoiding race condition
    //* Both new participant && all participants event can be fired at the same time
    //* Hence we fetch Latest state so both get consistent data not stale data
    const handleNewParticipant = (newParticipant: IParticipant) => {
        if (newParticipant.userId === user?.id) return;
        const currentParticipants = participantsRef.current;

        if (!currentParticipants.some(p => p.userId === newParticipant.userId)) {
            addParticipant(newParticipant);
        }
    };

    const handleGetAllParticipants = (allParticipants: IParticipant[]) => {
        const currentParticipants = participantsRef.current;

        const otherParticipants = allParticipants.filter(p => p.userId !== user?.id);
        const newParticipants = otherParticipants.filter(
            p => !currentParticipants.some(existing => existing.userId === p.userId)
        );

        newParticipants.forEach(addParticipant);
        off('all-participants');
    };

    const handleParticipantLeft = (userId: string) => {
        removeParticipant(userId);
    }

    const handleParticipantUpdate = (updatedParticipant: IParticipant) => {
        updateParticipant(updatedParticipant);
    }



    return {
        localStream,
        participants,
        sessionId,
        toggleMic,
        toggleVideo,
        switchCamera,
    }
}