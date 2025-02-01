import { Video } from 'lucide-react-native'
import { View, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { navigate } from '../utils/NavigationUtils'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import CustomText from '../components/ui/CustomText'
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native'
import { useEffect, useState } from 'react'
import AppBar from '../components/ui/AppBar'
import { checkSession, createSession } from '../services/api/sessionApi'
import { useUserStore } from '../services/userStore'
import { useLiveMeetStore } from '../services/meetStore'
import { addHyphens, removeHyphens } from '../utils/Helpers'

const JoinMeetScreen = () => {

    const { addSession, removeSession } = useUserStore();

    const { addMeetSessionId, removeMeetSessionId } = useLiveMeetStore();

    const [meetCode, setMeetCode] = useState('');

    const handleMeetCode = (code: string) => {
        const cleanedCode = removeHyphens(code);
        const hypenedCode = addHyphens(cleanedCode);
        setMeetCode(hypenedCode);
    }

    const createNewMeet = async () => {
        const sessionId = await createSession();
        if (sessionId) {
            console.log('Session created successfully:', sessionId);
            addSession(sessionId);
            addMeetSessionId(sessionId);
            navigate('PrepareMeetScreen');
        }
    }

    const joinViaSessionId = async (id: string) => {
        id = removeHyphens(id);
        const isSession = await checkSession(id);
        if (isSession) {
            console.log('Session found:', id);
            addSession(id);
            addMeetSessionId(id);
            navigate('PrepareMeetScreen');


        } else {
            console.log('Session not found:', id);
            removeSession(id);
            removeMeetSessionId();
            Alert.alert('Session not found', 'Please enter a valid session code');
        }
    }

    return (
        <View className='flex-1 p-4 bg-white'>
            <SafeAreaView />

            <AppBar
                title='Join Meet'
            />

            <LinearGradient
                colors={['#007AFF', '#a6cbff']}
                className='w-full h-[80px] items-center justify-center  my-8'
                style={{
                    borderRadius: 15,
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <TouchableOpacity
                    onPress={createNewMeet}
                    className='w-full h-full flex-row items-center justify-center gap-4 '
                >
                    <Video size={RFValue(22)} color={'#fff'} />
                    <CustomText
                        fontSize={15}
                        fontFamily='Roboto-Medium'
                        style={{ color: Colors.white }}
                    >
                        Create New Meet
                    </CustomText>
                </TouchableOpacity>
            </LinearGradient>

            <Text className='text-[#888] text-center my-2 ' style={{
                fontSize: RFValue(12),
            }}>OR</Text>

            <View className='mt-[20px]'>
                <CustomText
                    fontSize={12}
                    fontFamily='OpenSans-Regular'
                    style={{
                        color: '#333',
                        marginBottom: 5
                    }}
                >
                    Enter the code provided by the meeting organiser
                </CustomText>
                <TextInput
                    className='border-2 border-[#ccc] rounded-md p-3 mt-[10px] text-[#333] bg-[#f9f9f9]'
                    style={{
                        fontSize: RFValue(12),
                        fontFamily: 'OpenSans-Regular',
                    }}
                    value={meetCode}
                    onChangeText={handleMeetCode}
                    onSubmitEditing={() => joinViaSessionId(meetCode)}
                    placeholder='Example: abc-mnop-xyz'
                    placeholderTextColor={'#888'}
                    returnKeyLabel='Join'
                    returnKeyType='join'
                />

                <CustomText
                    fontSize={10}
                    fontFamily='OpenSans-Regular'
                    color={'#666'}
                    style={{
                        lineHeight: 15,
                        marginTop: 10
                    }}
                >
                    Note: This meeting is secured with Cloud encryption but not end to end encryption
                    <CustomText
                        fontSize={10}
                        fontFamily='OpenSans-Regular'
                        color='#007AFF'
                        style={{
                            textDecorationLine: 'underline',
                        }}
                    >Learn More</CustomText>
                </CustomText>

            </View>
        </View>
    )
}
export default JoinMeetScreen