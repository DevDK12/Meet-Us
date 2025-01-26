import { View, SafeAreaView, ScrollView, Image, TouchableOpacity, Share, Platform } from 'react-native'
import AppBar from '../components/ui/AppBar'
import CustomText from '../components/ui/CustomText'
import { Info, Mic, MicOff, MonitorUp, Share2, Shield, Video, VideoOff } from 'lucide-react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import MeetIconBtn from '../components/prepare_meet/MeetIconBtn'
import { useState } from 'react'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { navigate } from '../utils/NavigationUtils'


const PrepareMeetScreen = () => {

    const [isMicOn, setIsMicOn] = useState(true)
    const [isVideoOn, setIsVideoOn] = useState(true)

    const toggleLocal = (type: 'mic' | 'video') => {
        if (type === 'mic') {
            setIsMicOn(!isMicOn)
        } else {
            setIsVideoOn(!isVideoOn)
        }
    }

    const handleMeetStart = () => {
        navigate('LiveMeetScreen');
    }

    return (
        <View className='flex-1 bg-white'>
            <SafeAreaView />
            <AppBar className='p-4 py-5' />
            <ScrollView
                contentContainerClassName='flex-1 px-4'
            >
                <View
                    className='border-b-[1px] border-[#ccc] pb-5 items-center'
                >

                    <CustomText
                        fontSize={18}
                        fontFamily='Roboto-Regular'
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        s0b-t5c-ty5
                    </CustomText>
                    <View
                        className='w-[130px] h-[240px] my-5 bg-[#111] rounded-2xl overflow-hidden justify-center items-center self-center'
                    >
                        <Image
                            source={require('../assets/images/bg.png')}
                            className='w-[40px] h-[40px] rounded-full self-center'
                        />

                        <View className='flex-row justify-center gap-2 absolute bottom-2 w-full mt-2'>
                            <MeetIconBtn
                                icon={isMicOn ? <Mic size={RFValue(12)} color={'#fff'} /> : <MicOff size={RFValue(12)} color={'#fff'} />}
                                onPress={() => toggleLocal('mic')}
                            />
                            <MeetIconBtn
                                icon={isVideoOn ? <Video size={RFValue(12)} color={'#fff'} /> : <VideoOff size={RFValue(12)} color={'#fff'} />}
                                onPress={() => toggleLocal('video')}
                            />

                        </View>
                    </View>
                    <TouchableOpacity
                        className='border-[1px] border-[#ccc] p-[10px] m-[10px] rounded-lg flex-row justify-center items-center gap-2 self-center '
                    >
                        <MonitorUp size={RFValue(14)} color={Colors.primary} />
                        <CustomText
                            fontSize={11}
                            fontFamily='OpenSans-Medium'
                            style={{
                                textAlign: 'center',
                            }}
                        >
                            Share Screen
                        </CustomText>
                    </TouchableOpacity>

                    <CustomText
                        fontSize={12}
                        fontFamily='OpenSans-Regular'
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        No one is in the call yet.
                    </CustomText>
                </View>


                <View className='p-[12px] py-[25px]'>
                    <View className='flex-row items-center justify-between mb-[15px]'>
                        <Info size={RFValue(14)} color={Colors.text} />
                        <CustomText
                            fontSize={12}
                            fontFamily='Roboto-Medium'
                            style={{
                                textAlign: 'left',
                                width: '80%',
                            }}
                        >
                            Joining Information
                        </CustomText>
                        <Share2 size={RFValue(14)} color={Colors.text} />
                    </View>
                    <View className='ml-[38px] mb-[20px]'>
                        <CustomText
                            fontSize={11}
                            fontFamily='Roboto-Regular'
                        >
                            Meeting Link
                        </CustomText>
                        <CustomText
                            fontSize={11}
                            fontFamily='Roboto-Regular'
                        >
                            meet.google.com/s0b-t5c-ty5
                        </CustomText>
                    </View>
                    <View className='flex-row items-center justify-between mb-[20px]'>
                        <Shield size={RFValue(14)} color={Colors.text} />
                        <CustomText
                            fontSize={12}
                            fontFamily='Roboto-Medium'
                            style={{
                                textAlign: 'left',
                                width: '80%',
                            }}
                        >
                            Encryption
                        </CustomText>
                        <Share2 style={{ opacity: 0 }} size={RFValue(14)} color={Colors.text} />
                    </View>
                </View>
            </ScrollView>
            <View
                className='bg-[#ebedf5] pt-[10px] absolute bottom-0 items-center'
                style={{
                    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
                    width: '100%',
                }}
            >
                <TouchableOpacity
                    className='bg-[#007AFF] p-[10px] mb-8 rounded-lg items-center justify-center'
                    style={{
                        width: '20%',
                    }}
                    onPress={handleMeetStart}
                >
                    <CustomText
                        fontSize={12}
                        fontFamily='OpenSans-Bold'
                        color='white'
                    >
                        Join
                    </CustomText>
                </TouchableOpacity>
                <CustomText fontSize={10} fontFamily='OpenSans-Regular'>
                    Joining as
                </CustomText>
                <CustomText fontSize={10} fontFamily='OpenSans-Regular'>
                    Dev Kumar
                </CustomText>
            </View>
        </View>
    )
}
export default PrepareMeetScreen