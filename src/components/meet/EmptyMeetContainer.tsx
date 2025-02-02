import { TouchableOpacity, View } from 'react-native'
import CustomText from '../ui/CustomText'
import { Clipboard, Share } from 'lucide-react-native'
import { RFValue } from 'react-native-responsive-fontsize';
import { addHyphens } from '../../utils/Helpers';
import { useLiveMeetStore } from '../../services/meetStore';
import { goBack } from '../../utils/NavigationUtils';



const EmptyMeetContainer = () => {

    const { sessionId } = useLiveMeetStore();

    if (!sessionId) {
        goBack();
        return null;
    }
    return (
        <View
            className='flex-[0.7] justify-center items-start px-5'
        >
            <CustomText
                color='white'
                fontFamily='OpenSans-SemiBold'
                fontSize={12}
                style={{
                    marginBottom: 8,
                }
                }
            >
                You're the only one here
            </CustomText >
            <CustomText
                color='#aaaaaa'
                fontFamily='OpenSans-Regular'
                fontSize={12}
                style={{
                    textAlign: 'left',
                    marginBottom: 24,
                }}
            >
                Share this meeting link with others that you want in the meeting.
            </CustomText>

            <View
                className='flex-row items-center bg-[#292929] rounded-sm w-[90%] p-[14px] mb-5'
            >
                <CustomText
                    color='white'
                    fontFamily='OpenSans-SemiBold'
                    fontSize={14}
                    style={{
                        marginBottom: 8,
                        flex: 1,
                    }}
                >
                    meet.meetus.com/{addHyphens(sessionId)}
                </CustomText>
                <TouchableOpacity
                    className='ml-[10px]'
                >
                    <Clipboard size={RFValue(20)} color={'white'} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                className='flex-row items-center bg-[#95c9ff] rounded-full py-3 px-5'
            >
                <Share size={RFValue(20)} color={'black'} />
                <CustomText
                    fontFamily='OpenSans-SemiBold'
                    fontSize={11}
                    color='black'
                    style={{
                        marginLeft: 8,
                    }}
                >
                    Share Invite
                </CustomText>
            </TouchableOpacity>
        </View >
    )
}
export default EmptyMeetContainer