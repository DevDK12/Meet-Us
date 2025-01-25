import { Video } from 'lucide-react-native'
import { Platform, TouchableOpacity } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import CustomText from './CustomText'
import { FC } from 'react'


type JoinButtonProps = {
    onPress: () => void
}
const JoinButton : FC<JoinButtonProps> = ({onPress}) => {
    return (
        <TouchableOpacity
                onPress={onPress}
                className={`p-4 bg-primary rounded-2xl absolute right-[20px] ${Platform.OS === 'ios' ? 'bottom-[50px]' : 'bottom-[30px]' } flex-row justify-center align-center gap-2`}
            >   
                <Video size={RFValue(14)}   color={'#fff'} />
                <CustomText
                    fontSize={14}
                    fontFamily='Roboto-Medium'
                    style={{
                        color: '#fff',
                    }}
                >
                    Join
                </CustomText>
            </TouchableOpacity>
    )
}
export default JoinButton