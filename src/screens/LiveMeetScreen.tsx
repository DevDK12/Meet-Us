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

const LiveMeetScreen = () => {
    const { sessionId, participants } = useLiveMeetStore();

    const { containerDimensions, onContainerLayout } = useContainerDimensions();

    return (
        <View
            style={{ backgroundColor: '#121212', flex: 1 }}
        >
            <MeetHeader
                switchCamera={() => { }}
            />

            <GestureHandlerRootView
                style={{ flex: 1 }}
                onLayout={onContainerLayout}
            >
                {containerDimensions && (
                    <UserMeetBox
                        containerDimensions={containerDimensions}

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

            <MeetFooter />
        </View>
    )
}
export default LiveMeetScreen