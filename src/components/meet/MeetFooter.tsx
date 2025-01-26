import { Hand, Mic, MicOff, MoreVertical, PhoneOff, Video, VideoOff } from 'lucide-react-native'
import { View, TouchableOpacity, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { RFValue } from 'react-native-responsive-fontsize'
import { goBack } from '../../utils/NavigationUtils'
import { useState } from 'react'



const MeetFooter = () => {

    const [mic, setMic] = useState(false);
    const [video, setVideo] = useState(false);

    const getIconStyle = (isActive: boolean) => ({
        backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : '#FFFFFF',
    });

    const getIconColor = (isActive: boolean) => isActive ? 'white' : 'black';


    return (
        <LinearGradient
            colors={['#000', 'rgba(0,0,0,0.7)', 'transparent'].reverse()}
            className='w-full  justify-center items-center'
        >
            <View
                className='flex-row justify-center items-center gap-6 w-full px-[20px]'
                style={{
                    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
                }}
            >
                <TouchableOpacity
                    className='bg-[#ff0000] p-[14px] rounded-full'
                    onPress={() => goBack()}
                >
                    <PhoneOff color={'white'} size={RFValue(16)} />
                </TouchableOpacity>
                <TouchableOpacity
                    className='p-[12px] rounded-full'
                    style={getIconStyle(video)}
                    onPress={() => setVideo(!video)}
                >
                    {video ? <Video color={getIconColor(video)} size={RFValue(14)} /> : <VideoOff color={getIconColor(video)} size={RFValue(14)} />}
                </TouchableOpacity>
                <TouchableOpacity
                    className='p-[12px] rounded-full'
                    style={getIconStyle(mic)}
                    onPress={() => setMic(!mic)}
                >
                    {mic ? <Mic color={getIconColor(mic)} size={RFValue(14)} /> : <MicOff color={getIconColor(mic)} size={RFValue(14)} />}
                </TouchableOpacity>
                <TouchableOpacity
                    className='bg-[rgba(255,255,255,0.1)] p-[12px] rounded-full'
                >
                    <Hand color={'white'} size={RFValue(14)} />
                </TouchableOpacity>
                <TouchableOpacity
                    className='bg-[rgba(255,255,255,0.1)] p-[12px] rounded-full'
                >
                    <MoreVertical color={'white'} size={RFValue(14)} />
                </TouchableOpacity>
            </View>
        </LinearGradient>
    )
}
export default MeetFooter