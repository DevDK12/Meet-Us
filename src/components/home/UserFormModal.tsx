import { FC, useEffect, useState } from 'react'
import { View, Modal, TextInput, TouchableOpacity, Alert, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import CustomText from '../ui/CustomText'
import { RFValue } from 'react-native-responsive-fontsize'
import { pickImage } from '../../utils/Helpers'
import { ImageUp } from 'lucide-react-native'
import { useUserStore } from '../../services/userStore'
import { v4 as uuidv4 } from 'uuid'
import 'react-native-get-random-values';

type UserFormModalProps = {
    isVisible: boolean
    onClose: () => void
}
const UserFormModal: FC<UserFormModalProps> = ({ isVisible, onClose }) => {


    const [name, setName] = useState('');
    const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);

    const { user, setUser } = useUserStore();

    useEffect(() => {
        if (isVisible) {
            const oldName = user?.name;
            const oldProfilePhotoUrl = user?.profilePhotoUrl;
            setName(oldName || '');
            setProfilePhotoUrl(oldProfilePhotoUrl || '');
        }
    }, [isVisible])


    const handleSave = () => {
        if (!name || !profilePhotoUrl) {
            Alert.alert('Enter your name and profile photo');
            return;
        }
        setUser({
            id: uuidv4(),
            name,
            profilePhotoUrl,
        })
        onClose();
    }

    const handleImageUpload = async () => {
        // await requestPhotoLibraryPermission();
        pickImage((image) => {
            console.log('image', image)
            if (image.uri)
                setProfilePhotoUrl(image.uri);
        })
    }

    return (
        <Modal
            visible={isVisible}
            onRequestClose={onClose}
            onDismiss={onClose}
            animationType='slide'
            transparent={true}

        >
            <View
                className='flex-1 justify-end bg-black/50'
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className='flex-1'
                >

                    <ScrollView
                        contentContainerClassName='grow justify-end'
                    >

                        <View className='bg-white p-5 rounded-t-3xl'>
                            <CustomText
                                fontSize={18}
                                fontFamily='OpenSans-Medium'
                                style={{
                                    marginBottom: 15,
                                    fontWeight: 'bold',
                                }}
                            >
                                Enter your details
                            </CustomText>

                            <TouchableOpacity
                                onPress={handleImageUpload}
                                className='w-[100px] h-[100px] self-center rounded-full  border-4 border-[#ccc] mb-4'
                            >
                                {
                                    profilePhotoUrl && (
                                        <Image
                                            source={{ uri: profilePhotoUrl }}
                                            className='w-full h-full rounded-full'
                                        />
                                    )
                                }
                                <View className='absolute inset-0 bg-[#cccccc40]  rounded-full items-center justify-center p-2'>
                                    <ImageUp color={'#cccccc90'} size={30} />
                                </View>
                            </TouchableOpacity>
                            <TextInput
                                placeholder='Enter your name'
                                className='h-[50px] border-2 border-[#ccc] rounded-md px-4 mb-[15px]'
                                style={{ fontFamily: 'OpenSans-Regular', fontSize: RFValue(12) }}
                                value={name}
                                onChangeText={setName}
                                placeholderTextColor={'#ccc'}
                            />

                            <View className='flex-row justify-between'>
                                <TouchableOpacity
                                    className='flex-1 bg-primary py-4 mx-2 rounded-3xl items-center '
                                    onPress={handleSave}
                                >
                                    <CustomText
                                        fontFamily='OpenSans-Medium'
                                        style={{ color: 'white', fontWeight: 'bold' }}
                                    >
                                        Save
                                    </CustomText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className='flex-1 bg-[#FF5A5F] py-4 mx-2 rounded-3xl items-center '
                                    onPress={onClose}
                                >
                                    <CustomText
                                        fontFamily='OpenSans-Medium'
                                        style={{ color: 'white', fontWeight: 'bold' }}
                                    >
                                        Cancel
                                    </CustomText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>


            </View>
        </Modal>
    )
}
export default UserFormModal