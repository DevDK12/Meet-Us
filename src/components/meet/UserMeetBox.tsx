import { TContainerDimensions } from '../../hooks/useContainerDimensions'
import { FC } from 'react';
import { Image, View } from 'react-native';
import CustomText from '../ui/CustomText';
import { EllipsisVertical } from 'lucide-react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { calculateFinalPos } from '../../utils/Helpers';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { MediaStream, RTCView } from 'react-native-webrtc';
import { useUserStore } from '../../services/userStore';
import { useLiveMeetStore } from '../../services/meetStore';



function clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
}

type UserMeetBoxProps = {
    containerDimensions: TContainerDimensions,
    mediaStream: MediaStream | null,
}
const UserMeetBox: FC<UserMeetBoxProps> = ({ containerDimensions, mediaStream }) => {
    const { user } = useUserStore();
    const { videoOn } = useLiveMeetStore();

    const { width: containerWidth, height: containerHeight } = containerDimensions;

    const initialX = containerWidth - containerWidth * 0.24 - 10;
    const initialY = containerHeight - containerHeight * 0.22 - 10;
    const maxX = containerWidth - containerWidth * 0.24;
    const maxY = containerHeight - containerHeight * 0.18;

    const translationX = useSharedValue(initialX);
    const translationY = useSharedValue(initialY);
    const prevX = useSharedValue(0);
    const prevY = useSharedValue(0);


    const animatedStyles = useAnimatedStyle(() => ({
        transform: [
            { translateX: translationX.value },
            { translateY: translationY.value },
        ],
    }));

    const pan = Gesture.Pan()
        .minDistance(1)
        .onStart(() => {
            prevX.value = translationX.value;
            prevY.value = translationY.value;
        })
        .onUpdate((event) => {
            translationX.value = clamp(
                prevX.value + event.translationX,
                -30,
                maxX + 30
            );
            translationY.value = clamp(
                prevY.value + event.translationY,
                -30,
                maxY + 30
            );
        })
        .onEnd((event) => {
            const draggedToX = prevX.value + event.translationX;
            const draggedToY = prevY.value + event.translationY;

            const restrictedX = clamp(draggedToX, 0, maxX);
            const restrictedY = clamp(draggedToY, 0, maxY);
            const { finalX, finalY } = calculateFinalPos(restrictedX, restrictedY, containerWidth, containerHeight);

            translationX.value = withSpring(finalX);
            translationY.value = withSpring(finalY);
        })
        .runOnJS(true);


    return (
        <GestureDetector gesture={pan} >

            <Animated.View
                className='bg-[#202020] rounded-[10px]  absolute justify-center items-center overflow-hidden'
                style={
                    [{
                        width: '24%',
                        height: '22%',
                        zIndex: 99,
                        elevation: 6,
                        shadowOffset: { width: 1, height: 1 },
                        shadowOpacity: 0.6,
                        shadowRadius: 16,
                        shadowColor: '#000',
                    },
                        animatedStyles,
                    ]}
            >
                {
                    mediaStream && videoOn ? <RTCView
                        streamURL={mediaStream?.toURL()}
                        style={{ width: '100%', height: '100%', zIndex: 99 }}
                        mirror={true}
                        objectFit='cover'
                    /> :
                        <View
                            className='bg-[#ff5100] justify-center items-center rounded-full w-10 h-10'
                        >
                            {
                                user?.profilePhotoUrl ? (
                                    <Image
                                        source={{ uri: user?.profilePhotoUrl }}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: 50,
                                        }}
                                    />
                                ) : <CustomText
                                    color='white'
                                    fontSize={14}
                                >
                                    {user?.name?.charAt(0)}
                                </CustomText>
                            }

                        </View>
                }

                <CustomText
                    color='white'
                    fontSize={10}
                    style={{
                        position: 'absolute',
                        bottom: 5,
                        left: 5,
                        zIndex: 99,
                        fontWeight: '600',
                    }}
                >
                    You
                </CustomText>
                <View
                    className='absolute bottom-2 right-1'
                >
                    <EllipsisVertical color="#fff" size={RFValue(14)} />
                </View>
            </Animated.View>
        </GestureDetector>


    );
}
export default UserMeetBox