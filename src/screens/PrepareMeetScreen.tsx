import { View, SafeAreaView, ScrollView, Image, TouchableOpacity, Platform } from 'react-native'
import AppBar from '../components/ui/AppBar'
import CustomText from '../components/ui/CustomText'
import { Info, Mic, MicOff, MonitorUp, Share2, Shield, Video, VideoOff } from 'lucide-react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import MeetIconBtn from '../components/prepare_meet/MeetIconBtn'
import { useCallback, useEffect, useState } from 'react'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { navigate } from '../utils/NavigationUtils'
import { useLiveMeetStore } from '../services/meetStore'
import { addHyphens, requestPermissions } from '../utils/Helpers'
import { MediaStream, mediaDevices, RTCView } from 'react-native-webrtc';
import { useUserStore } from '../services/userStore'


const PrepareMeetScreen = () => {

    const { user } = useUserStore();
    const { sessionId, micOn, videoOn, toggle } = useLiveMeetStore();

    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);


    const toggleLocal = (type: 'mic' | 'video') => {
        if (type === 'mic') {
            toggle('mic')
            toggleAudioTrack(!micOn);
        } else {
            toggle('video')
            toggleVideoTrack(!videoOn);
        }
    }
    const toggleAudioTrack = (isOn: boolean) => {
        if (mediaStream) {
            const audioTrack = mediaStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = isOn;
            }
        }
    }
    const toggleVideoTrack = (isOn: boolean) => {
        if (mediaStream) {
            const videoTrack = mediaStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = isOn;
            }
        }
    }

    const fetchMediaDevices = useCallback(async (isAudioGranted: boolean, isVideoGranted: boolean) => {
        try {
            const stream = await mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setMediaStream(stream);
            const audioTrack = stream.getAudioTracks()[0];
            const videoTrack = stream.getVideoTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = isAudioGranted;
            }
            if (videoTrack) {
                videoTrack.enabled = isVideoGranted;
            }

        } catch (error) {
            console.log('Error getting user media', error);
        }
    }, []);


    const fetchPermissionsAndSetTracks = useCallback(async () => {
        const result = await requestPermissions();
        if (result.isCameraGranted) {
            toggleLocal('video');
        }
        if (result.isMicrophoneGranted) {
            toggleLocal('mic');
        }
        fetchMediaDevices(result.isMicrophoneGranted, result.isCameraGranted);

    }, [fetchMediaDevices])



    useEffect(() => {
        fetchPermissionsAndSetTracks();
    }, [fetchPermissionsAndSetTracks])



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
                        {addHyphens(sessionId!)}
                    </CustomText>
                    <View
                        className='w-[130px] h-[240px] my-5 bg-[#111] rounded-2xl overflow-hidden justify-center items-center self-center'
                    >

                        {mediaStream && videoOn ? <RTCView
                            streamURL={mediaStream?.toURL()}
                            style={{ width: '100%', height: '100%' }}
                            mirror={true}
                            objectFit='cover'
                        />
                            :
                            <Image
                                source={{ uri: user?.profilePhotoUrl }}
                                className='w-[40px] h-[40px] rounded-full self-center'
                            />
                        }

                        <View className='flex-row justify-center gap-2 absolute bottom-2 w-full mt-2'>
                            <MeetIconBtn
                                icon={micOn ? <Mic size={RFValue(12)} color={'#fff'} /> : <MicOff size={RFValue(12)} color={'#fff'} />}
                                onPress={() => toggleLocal('mic')}
                            />
                            <MeetIconBtn
                                icon={videoOn ? <Video size={RFValue(12)} color={'#fff'} /> : <VideoOff size={RFValue(12)} color={'#fff'} />}
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