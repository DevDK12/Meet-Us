import { Image, View } from 'react-native'
import HomeHeader from '../components/home/HomeHeader'
import { navigate } from '../utils/NavigationUtils'
import JoinButton from '../components/ui/JoinButton'
import CustomText from '../components/ui/CustomText'
import { screenHeight, screenWidth } from '../utils/Constants'
import { Colors } from 'react-native/Libraries/NewAppScreen'


const HomeScreen = () => {

    const handleNavigation = () => {
        navigate('JoinMeetScreen');
    }

    return (
        <View className='container'>
            <HomeHeader />

            <View
                className='flex-1 items-center '
            >
                <Image
                    source={require('../assets/images/bg.png')}
                    style={{
                        width: screenWidth * 0.5,
                        height: screenHeight * 0.3,
                        resizeMode: 'contain',
                        alignSelf: 'center',
                        margin: 15,
                        marginTop: screenHeight * 0.1,
                    }}
                />
                <CustomText
                    fontFamily='OpenSans-Medium'
                    fontSize={15}
                    style={{
                        textAlign: 'center',
                        color: Colors.text,
                    }}
                >
                    Video calls and meetings for everyone
                </CustomText>
                <CustomText
                    fontFamily='OpenSans-Medium'
                    fontSize={12}
                    style={{
                        textAlign: 'center',
                        color: Colors.text,
                        opacity: 0.6,
                        marginTop: 5,
                        width: '93%',
                        alignSelf: 'center',
                    }}
                >
                    Connect, collaborate, and celebrate from anywhere with Meet Us
                </CustomText>
            </View>

            <JoinButton onPress={handleNavigation} />
        </View>
    )
}
export default HomeScreen