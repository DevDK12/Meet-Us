import { Hand, Mic, MicOff, MoreVertical, PhoneOff, Video, VideoOff } from 'lucide-react-native'
import { View, TouchableOpacity, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { RFValue } from 'react-native-responsive-fontsize'
import { goBack } from '../../utils/NavigationUtils'
import { FC, useState } from 'react'
import { useLiveMeetStore } from '../../services/meetStore'


export type MeetFooterProps = {

    handleVideoToggle: () => void,
    handleMicToggle: () => void,
}
const MeetFooter: FC<MeetFooterProps> = ({ handleVideoToggle, handleMicToggle }) => {

    const { micOn, videoOn } = useLiveMeetStore();

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
                    style={getIconStyle(videoOn)}
                    onPress={handleVideoToggle}
                >
                    {videoOn ? <Video color={getIconColor(videoOn)} size={RFValue(14)} /> : <VideoOff color={getIconColor(videoOn)} size={RFValue(14)} />}
                </TouchableOpacity>
                <TouchableOpacity
                    className='p-[12px] rounded-full'
                    style={getIconStyle(micOn)}
                    onPress={handleMicToggle}
                >
                    {micOn ? <Mic color={getIconColor(micOn)} size={RFValue(14)} /> : <MicOff color={getIconColor(micOn)} size={RFValue(14)} />}
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