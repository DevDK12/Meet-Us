import { View } from 'react-native'
import MeetHeader from '../components/meet/MeetHeader'
import UserMeetBox from '../components/meet/UserMeetBox'
import MeetFooter from '../components/meet/MeetFooter';
import { useContainerDimensions } from '../hooks/useContainerDimensions';
import EmptyMeetContainer from '../components/meet/EmptyMeetContainer';
import { peopleData } from '../utils/dummyData';
import PeoplesContainer from '../components/meet/PeoplesContainer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLiveMeetStore } from '../services/meetStore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { mediaDevices, MediaStream, RTCPeerConnection } from 'react-native-webrtc';
import { useSocket } from '../services/api/SocketProvider';
import { useUserStore } from '../services/userStore';
import { goBack } from '../utils/NavigationUtils';

const LiveMeetScreen = () => {

    const { user } = useUserStore();
    const {
        participants,
        sessionId,
        addMeetSessionId,
        addParticipant,
        micOn,
        videoOn,
        toggle,
        removeParticipant,
        updateParticipant

    } = useLiveMeetStore();

    const { emit } = useSocket();


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



    const { containerDimensions, onContainerLayout } = useContainerDimensions();

    return (
        <View
            style={{ backgroundColor: '#121212', flex: 1 }}
        >
            <MeetHeader
                switchCamera={switchCamera}
            />

            <GestureHandlerRootView
                style={{ flex: 1 }}
                onLayout={onContainerLayout}
            >
                {containerDimensions && (
                    <UserMeetBox
                        containerDimensions={containerDimensions}
                        mediaStream={localStream!}

                    />
                )}

                {
                    participants?.length > 0 ?
                        (
                            <PeoplesContainer
                                people={peopleData}
                                containerDimensions={containerDimensions}
                            />
                        )
                        : (
                            <EmptyMeetContainer
                                sessionId={sessionId!}
                            />
                        )
                }

            </GestureHandlerRootView>

            <MeetFooter
                handleHangUp={() => {
                    emit('hang-up', { sessionId: sessionId!, userId: user?.id });
                    goBack();
                }}
                handleMicToggle={toggleMic}
                handleVideoToggle={toggleVideo}
            />
        </View>
    )
}
export default LiveMeetScreen