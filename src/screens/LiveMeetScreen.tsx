import { View } from 'react-native'
import MeetHeader from '../components/meet/MeetHeader'
import UserMeetBox from '../components/meet/UserMeetBox'
import MeetFooter from '../components/meet/MeetFooter';
import { useContainerDimensions } from '../hooks/useContainerDimensions';
import EmptyMeetContainer from '../components/meet/EmptyMeetContainer';
import { peopleData } from '../utils/dummyData';
import PeoplesContainer from '../components/meet/PeoplesContainer';


const LiveMeetScreen = () => {

    const { containerDimensions, onContainerLayout } = useContainerDimensions();

    return (
        <View className='flex-1 bg-[#121212]'>
            <MeetHeader
                switchCamera={() => { }}
            />

            <View
                className='flex-1'
                onLayout={onContainerLayout}
            >
                {containerDimensions && (
                    <UserMeetBox
                        containerDimensions={containerDimensions}
                    />
                )}

                {
                    peopleData.length > 0 ?
                        (
                            <PeoplesContainer
                                people={peopleData}
                                containerDimensions={containerDimensions}
                            />
                        )
                        : (
                            <EmptyMeetContainer />
                        )
                }

            </View>

            <MeetFooter />
        </View>
    )
}
export default LiveMeetScreen