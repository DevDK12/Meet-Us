import { ChevronLeft, EllipsisVertical } from 'lucide-react-native'
import { View } from 'react-native'
import CustomText from './CustomText'
import { RFValue } from 'react-native-responsive-fontsize'
import { goBack } from '../../utils/NavigationUtils'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { FC } from 'react'



type AppBarProps = {
    title?: string,
    onBackPress?: () => void,
    onMorePress?: () => void,
    className?: string
}

const AppBar: FC<AppBarProps> = ({ className = '', title, onBackPress = goBack, onMorePress = () => { } }) => {

    return (
        <View className={`flex-row justify-between items-center py-1 ${className}`}>
            <ChevronLeft
                size={RFValue(18)}
                onPress={onBackPress}
                color={Colors.text}
            />
            {title &&
                <CustomText
                    fontSize={15}
                    fontFamily='Roboto-Medium'
                    style={{ opacity: 0.8 }}
                >
                    {title}
                </CustomText>
            }
            <EllipsisVertical
                onPress={onMorePress}
                size={RFValue(18)}
                color={Colors.text}
            />
        </View>
    )
}
export default AppBar