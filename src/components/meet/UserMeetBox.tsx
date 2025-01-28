import { TContainerDimensions } from '../../hooks/useContainerDimensions'
import { FC, useRef } from 'react';
import { Animated, PanResponder, View } from 'react-native';
import CustomText from '../ui/CustomText';
import { EllipsisVertical } from 'lucide-react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { calculateFinalPos } from '../../utils/Helpers';


type UserMeetBoxProps = {
    containerDimensions: TContainerDimensions;
}
const UserMeetBox: FC<UserMeetBoxProps> = ({ containerDimensions }) => {
    const user = { name: 'Dev Kumar', id: '1' };
    const { width: containerWidth, height: containerHeight } = containerDimensions;


    const pan = useRef<Animated.ValueXY>(new Animated.ValueXY({
        x: containerWidth - containerWidth * 0.24 - 10,
        y: containerHeight - containerHeight * 0.26 - 20,
    })).current;



    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {

                //* pan.x_value contains absolute x value
                //* pan.setOffset sets absolute x to x.offset as offset to make them absolute from (0,0)
                pan.setOffset({
                    x: pan.x._value,
                    y: pan.y._value
                });

                //* Then sets offset x to 0
                pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y, }], {
                // useNativeDriver: true,
                useNativeDriver: false,
            }),
            onPanResponderRelease: (evt, gestureState) => {
                pan.flattenOffset();
                //* provides absolute x,y values in x._value, y._value

                const { dx, dy } = gestureState;
                //* dx,dy stores total offset from pan start to pan end, not needed here

                const draggedToX = pan.x._value;
                const draggedToY = pan.y._value;

                //* restrictedX  ==  draggedToX  (-  [0, containerWidth * 0.76])
                const restrictedX = Math.min(
                    Math.max(draggedToX, 0),
                    containerWidth - containerWidth * 0.24,
                );
                const restrictedY = Math.min(
                    Math.max(draggedToY, 0),
                    containerHeight - containerHeight * 0.18,
                );

                const { finalX, finalY } = calculateFinalPos(restrictedX, restrictedY, containerWidth, containerHeight);

                Animated.spring(pan, {
                    toValue: { x: finalX, y: finalY },
                    useNativeDriver: true,
                }).start();
            }
        })
    ).current



    return (
        <Animated.View
            className='bg-[#202020] rounded-[10px]  absolute justify-center items-center overflow-hidden'
            {...panResponder.panHandlers}
            style={
                [{
                    width: '24%',
                    height: '22%',
                    zIndex: 99,
                    elevation: 10,
                    shadowOffset: { width: 1, height: 1 },
                    shadowOpacity: 0.6,
                    shadowRadius: 16,
                    shadowColor: '#000',
                },
                {
                    transform: [{
                        translateX: pan.x,
                    }, {
                        translateY: pan.y,
                    }]
                }
                ]}
        >
            <View
                className='bg-[#ff5100] justify-center items-center rounded-full w-10 h-10'
            >
                <CustomText
                    color='white'
                    fontSize={14}
                >
                    {user?.name?.charAt(0)}
                </CustomText>
            </View>
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


    );
}
export default UserMeetBox