import { View, Text, SafeAreaView, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { SwitchCamera, Volume1, Volume2, VolumeOff } from 'lucide-react-native'
import { FC, useState } from 'react'
import { useLiveMeetStore } from '../../services/meetStore'
import { addHyphens } from '../../utils/Helpers'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'


type MeetHeaderProps = {
    switchCamera: () => void;
}

const MeetHeader: FC<MeetHeaderProps> = ({ switchCamera }) => {

    const [volumeLevel, setVolumeLevel] = useState(2);
    //* 0 : mute , 1 : headset, 2 : speaker

    const rotation = useSharedValue(0);

    const handleCameraSwitch = () => {
        if (rotation.value === 0) {
            rotation.value = withTiming(180, { duration: 700 });
        } else {
            rotation.value = withTiming(0, { duration: 500 });
        }
        switchCamera();
    }

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotateY: `${rotation.value}deg` }],
        };
    });


    const { sessionId } = useLiveMeetStore();


    return (
        <LinearGradient
            colors={['#000', 'rgba(0,0,0,0.7)', 'transparent']}
            className='w-full'
        >
            <SafeAreaView />
            <View className='flex-row justify-between items-center px-4 pb-8'
                style={{ paddingBottom: Platform.OS === 'ios' ? 0 : 10 }}>
                <Text className='text-white text-lg font-bold'>{addHyphens(sessionId!)}</Text>
                <View className='flex-row items-center gap-6'>
                    <Animated.View
                        style={[animatedStyle]}
                    >
                        <SwitchCamera onPress={handleCameraSwitch} color={'white'} size={24} />
                    </Animated.View>
                    {
                        volumeLevel === 0
                            ?
                            <VolumeOff onPress={() => setVolumeLevel(1)} color={'white'} size={24} />
                            :
                            volumeLevel === 1
                                ?
                                <Volume1 onPress={() => setVolumeLevel(2)} color={'white'} size={24} />
                                :
                                <Volume2 onPress={() => setVolumeLevel(0)} color={'white'} size={24} />
                    }
                </View>
            </View>
        </LinearGradient>
    )
}
export default MeetHeader