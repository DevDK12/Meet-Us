import { View, Image, TouchableOpacity } from 'react-native'
import { TContainerDimensions } from '../../hooks/useContainerDimensions';
import { FC } from 'react';
import CustomText from '../ui/CustomText';
import { EllipsisVertical, MicOff } from 'lucide-react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { RTCView } from 'react-native-webrtc';
import { IParticipant } from '../../services/meetStore';


type PeoplesContainerProps = {
    people: IParticipant[];
    containerDimensions: TContainerDimensions | null;
}

const PeoplesContainer: FC<PeoplesContainerProps> = ({ people, containerDimensions }) => {

    const maxVisibleUsers = 8;
    const visiblePeople = people.slice(0, maxVisibleUsers);
    const othersCount = people?.length > maxVisibleUsers ? people?.length - maxVisibleUsers : 0;

    const gridStyle = containerDimensions ? getGridStyle(visiblePeople.length, containerDimensions.width, containerDimensions.height) : {};

    return (
        <View
            className='flex-1 flex-row flex-wrap bg-[#121212] justify-center '
        >
            {
                visiblePeople?.map((person, index) => {
                    return (
                        <View
                            key={index}
                            className='justify-center items-center rounded-[10px] bg-[#2e3030] overflow-hidden mx-1 my-1 border-[#95c9ff]'
                            style={[
                                // person?.speaking ? { borderWidth: 3, } : null,
                                person?.micOn ? { borderWidth: 3, } : null,
                                Array.isArray(gridStyle) ? gridStyle[index] : gridStyle,
                            ]}
                        >
                            {person?.videoOn && person?.mediaStream?.toURL() ?
                                <RTCView
                                    mirror={true}
                                    objectFit='cover'
                                    streamURL={person?.mediaStream?.toURL()}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                /> :
                                <View
                                    className='bg-[#ff5100] justify-center items-center '
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 60,
                                    }}
                                >
                                    {person?.photo ? (
                                        <Image
                                            source={{ uri: person?.photo }}
                                            style={{ width: 60, height: 60, borderRadius: 60 }}
                                        />
                                    ) : (
                                        <CustomText
                                            color='white'
                                            fontSize={14}
                                        >{person?.name?.charAt(0)}</CustomText>
                                    )}

                                </View>
                            }

                            <CustomText
                                color='white'
                                fontSize={10}
                                style={{
                                    position: 'absolute',
                                    bottom: 5,
                                    left: 5,
                                    fontWeight: '600',
                                    zIndex: 4,
                                }}
                            >
                                {person?.name}
                            </CustomText>
                            {!person?.micOn && (
                                <View
                                    className='absolute top-2 right-2 bg-[#000] rounded-full p-1'
                                >
                                    <MicOff color={'#fff'} size={RFValue(10)} />
                                </View>
                            )}
                            <View
                                className='absolute bottom-2 right-1 z-[2]'
                            >
                                <EllipsisVertical size={RFValue(12)} color={'#fff'}
                                />
                            </View>
                            {othersCount > 0 && index == visiblePeople?.length - 1 && (
                                <TouchableOpacity
                                    className='justify-center items-center absolute bottom-1 right-4 z-[2] bg-[#000] rounded-full px-[10px] py-[5px]'
                                    activeOpacity={0.8}
                                >
                                    <CustomText
                                        color='white'
                                        fontSize={10}
                                        style={{
                                            fontWeight: '500',
                                        }}
                                    >
                                        {othersCount} others
                                    </CustomText>
                                </TouchableOpacity>
                            )
                            }
                        </View>
                    )
                })
            }
        </View>
    )
}

type TDimension = {
    width: number | string;
    height: number | string;
}
const getGridStyle = (count: number, containerWidth: number, containerHeight: number): Array<TDimension> | TDimension | {} => {
    if (!containerWidth || !containerHeight) return {};

    switch (count) {
        case 1:
            return {
                width: '82%',
                height: '98%',
            };
        case 2:
            return {
                width: '82%',
                height: '48%',
            };
        case 3:
            return [
                {
                    width: '82%',
                    height: containerHeight * 0.5,
                },
                {
                    width: '40%',
                    height: containerHeight * 0.46,
                },
                {
                    width: '40%',
                    height: containerHeight * 0.46,
                }
            ];
        case 4:
            return {
                width: '40%',
                height: containerHeight * 0.46,
            };
        case 5:
            return [
                {
                    width: containerWidth * 0.82,
                    height: containerHeight * 0.31,
                },
                {
                    width: containerWidth * 0.4,
                    height: containerHeight * 0.31,
                },
                {
                    width: containerWidth * 0.4,
                    height: containerHeight * 0.31,
                },
                {
                    width: containerWidth * 0.4,
                    height: containerHeight * 0.31,
                },
                {
                    width: containerWidth * 0.4,
                    height: containerHeight * 0.31,
                }
            ];
        case 6:
            return {
                width: containerWidth / 2 - 40,
                height: containerHeight / 3 - 15,
            };
        default: {
            const maxCols = 2;
            const maxRows = 4;

            const itemWidth = containerWidth / maxCols - 40;
            const itemHeight = containerHeight / maxRows - 10;

            return {
                width: itemWidth,
                height: itemHeight,
            }
        }
    }
}


export default PeoplesContainer;


