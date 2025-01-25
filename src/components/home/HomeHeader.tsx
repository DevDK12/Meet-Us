import { View, SafeAreaView, TouchableOpacity } from 'react-native'
import { CircleUser, Menu } from 'lucide-react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import CustomText from '../ui/CustomText';
import { navigate } from '../../utils/NavigationUtils';

const HomeHeader = () => {

    const handleNavigation = () => {
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
                <CircleUser
                    size={RFValue(20)}
                    color={Colors.primary}
                />
            </View>
        </>
    )
}
export default HomeHeader