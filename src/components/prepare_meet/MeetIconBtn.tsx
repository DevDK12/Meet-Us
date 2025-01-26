import { FC, ReactNode } from 'react'
import { TouchableOpacity } from 'react-native'


type MeetIconBtnProps = {
    onPress: () => void,
    icon: ReactNode
}
const MeetIconBtn: FC<MeetIconBtnProps> = ({ onPress, icon }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className='mx-[10px] bg-[#2E3030] p-1 rounded-full'
        >
            {/* <Mic size={RFValue(12)} color={'#fff'} /> */}
            {icon}
        </TouchableOpacity>
    )
}
export default MeetIconBtn