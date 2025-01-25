import { View, Text, Image } from 'react-native'
import { screenHeight, screenWidth } from '../utils/Constants'
import { useEffect } from 'react'
import { navigate } from '../utils/NavigationUtils'


const SplashScreen = () => {

    useEffect(()=>{
        const timer = setTimeout(()=>{
            navigate('HomeScreen');
        }, 1200);

        return () => clearTimeout(timer)
    }, [])

    return (
        <View className='bg-white flex-1 items-center justify-center'>
            <Image 
                source={require('../assets/images/g.png')}
                style={{
                    width: screenWidth * 0.7, 
                    height: screenHeight * 0.7,
                    resizeMode: 'contain'
                }}
            >

            </Image>
        </View>
    )
}
export default SplashScreen