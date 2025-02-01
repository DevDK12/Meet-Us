import { View, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import { CircleUser, Menu } from 'lucide-react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import CustomText from '../ui/CustomText';
import { navigate } from '../../utils/NavigationUtils';
import { useUserStore } from '../../services/userStore';
import UserFormModal from './UserFormModal';
import { useEffect, useState } from 'react';

const HomeHeader = () => {

    const [isModalVisible, setIsModalVisible] = useState(false);

    const { user } = useUserStore();


    useEffect(() => {
        const checkUserName = () => {
            if (!user?.name) {
                setIsModalVisible(true);
            }
        }
        checkUserName();
    }, [])

    const handleNavigation = () => {
        if (!user?.name) {
            setIsModalVisible(true);
            return;
        }
        navigate('JoinMeetScreen');
    }


    return (
        <>
            <SafeAreaView />
            <View
                className='flex-row items-center justify-between rounded-xl p-[10px] bg-white '
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 1, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 4,
                }}
            >
                <Menu
                    size={RFValue(20)}
                    color={Colors.text}
                />
                <TouchableOpacity
                    className='w-[80%]'
                    onPress={handleNavigation}
                >
                    <CustomText
                        fontFamily='OpenSans-Regular'
                        style={{
                            color: Colors.text,
                            opacity: 0.6,
                        }}
                    >
                        Enter a meeting code
                    </CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setIsModalVisible(true)}
                >
                    {
                        user?.profilePhotoUrl ?

                            <View className='rounded-full h-[30px] w-[30px]'>
                                <Image
                                    source={{ uri: user.profilePhotoUrl }}
                                    className='w-full h-full rounded-full'
                                />
                            </View>
                            :
                            <CircleUser
                                size={RFValue(20)}
                                color={Colors.primary}
                            />
                    }
                </TouchableOpacity>

            </View>
            <UserFormModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            />
        </>
    )
}
export default HomeHeader