import { View } from 'react-native'
import MeetHeader from '../components/meet/MeetHeader'
import UserMeetBox from '../components/meet/UserMeetBox'
import MeetFooter from '../components/meet/MeetFooter';
import { useContainerDimensions } from '../hooks/useContainerDimensions';
import EmptyMeetContainer from '../components/meet/EmptyMeetContainer';
import PeoplesContainer from '../components/meet/PeoplesContainer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useWebRTC } from '../hooks/useWebRTC';

const LiveMeetScreen = () => {


    const {
        localStream,
        participants,
        toggleMic,
        toggleVideo,
        switchCamera
    } = useWebRTC();



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
                                people={participants}
                                containerDimensions={containerDimensions}
                            />
                        )
                        : (
                            <EmptyMeetContainer />
                        )
                }

            </GestureHandlerRootView>

            <MeetFooter
                handleMicToggle={toggleMic}
                handleVideoToggle={toggleVideo}
            />
        </View>
    )
}
export default LiveMeetScreen