import { ChevronLeft, EllipsisVertical, Video } from 'lucide-react-native'
import { View, SafeAreaView, TouchableOpacity, TextInput } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { goBack, navigate } from '../utils/NavigationUtils'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import CustomText from '../components/ui/CustomText'
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native'
import { useState } from 'react'

const JoinMeetScreen = () => {

    const [meetCode, setMeetCode] = useState('')

    const createNewMeet = () => {
        navigate('PrepareMeetScreen');
    }

    return (
        <View className='flex-1 p-4 bg-white'>
            <SafeAreaView />

            <View className='flex-row justify-between items-center py-1'>
                <ChevronLeft
                    size={RFValue(18)}
                    onPress={() => goBack()}
                    color={Colors.text}
                />
                <CustomText
                    fontSize={15}
                    fontFamily='Roboto-Medium'
                    style={{ opacity: 0.8 }}
                >
                    Join Meet
                </CustomText>
                <EllipsisVertical
                    size={RFValue(18)}
                    color={Colors.text}
                />
            </View>

            <LinearGradient
                colors={['#007AFF', '#a6cbff']}
                className='w-full h-[80px] items-center justify-center  my-8'
                style={{
                    borderRadius: 15,
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <TouchableOpacity
                    onPress={createNewMeet}
                    className='w-full h-full flex-row items-center justify-center gap-4 '
                >
                    <Video size={RFValue(22)} color={'#fff'} />
                    <CustomText
                        fontSize={15}
                        fontFamily='Roboto-Medium'
                        style={{ color: Colors.white }}
                    >
                        Create New Meet
                    </CustomText>
                </TouchableOpacity>
            </LinearGradient>

            <Text className='text-[#888] text-center my-2 ' style={{
                fontSize: RFValue(12),
            }}>OR</Text>

            <View className='mt-[20px]'>
                <CustomText
                    fontSize={12}
                    fontFamily='OpenSans-Regular'
                    style={{
                        color: '#333',
                        marginBottom: 5
                    }}
                >
                    Enter the code provided by the meeting organiser
                </CustomText>
                <TextInput
                    className='border-2 border-[#ccc] rounded-md p-3 mt-[10px] text-[#333] bg-[#f9f9f9]'
                    style={{
                        fontSize: RFValue(12),
                        fontFamily: 'OpenSans-Regular',
                    }}
                    value={meetCode}
                    onChangeText={setMeetCode}
                    onSubmitEditing={() => { }}
                    placeholder='Example: abc-mnop-xyz'
                    placeholderTextColor={'#888'}
                    returnKeyLabel='Join'
                    returnKeyType='join'
                />

                <CustomText
                    fontSize={10}
                    fontFamily='OpenSans-Regular'
                    color={'#666'}
                    style={{
                        lineHeight: 15,
                        marginTop: 10
                    }}
                >
                    Note: This meeting is secured with Cloud encryption but not end to end encryption
                    <CustomText
                        fontSize={10}
                        fontFamily='OpenSans-Regular'
                        color='#007AFF'
                        style={{
                            textDecorationLine: 'underline',
                        }}
                    >Learn More</CustomText>
                </CustomText>

            </View>
        </View>
    )
}
export default JoinMeetScreen