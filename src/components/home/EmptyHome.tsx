import { View, Image } from 'react-native'
import { screenHeight, screenWidth } from '../../utils/Constants'
import CustomText from '../ui/CustomText'
import { Colors } from 'react-native/Libraries/NewAppScreen'

import bg from '../../assets/images/bg.png'

const EmptyHome = () => {
    return (
        <View
            className='flex-1 items-center '
        >
            <Image
                source={bg}
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
    )
}
export default EmptyHome