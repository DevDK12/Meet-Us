import { Alert, FlatList, RefreshControl, TouchableOpacity, View } from 'react-native'
import HomeHeader from '../components/home/HomeHeader'
import { navigate } from '../utils/NavigationUtils'
import JoinButton from '../components/ui/JoinButton'
import CustomText from '../components/ui/CustomText'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { useUserStore } from '../services/userStore'
import EmptyHome from '../components/home/EmptyHome'
import { Calendar } from 'lucide-react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { addHyphens } from '../utils/Helpers'
import { checkSession } from '../services/api/sessionApi'
import { useCallback, useState } from 'react'
import { useLiveMeetStore } from '../services/meetStore'


const HomeScreen = () => {
    const { user, sessions, removeSession } = useUserStore();
    const { addMeetSessionId, removeMeetSessionId } = useLiveMeetStore();


    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        //_ Remove invalid sessions
        for (let session of sessions) {
            const isSession = await checkSession(session);
            if (!isSession) removeSession(session);
        }
        useUserStore.persist.rehydrate();
        setRefreshing(false);
    }, []);



    const handleNavigation = () => {
        if (!user?.name) {
            Alert.alert('Enter your details first to join the meeting');
            return;
        }
        navigate('JoinMeetScreen');
    }


    const joinViaSessionId = async (id: string) => {
        const isSession = await checkSession(id);
        if (isSession) {
            console.log('Session found:', id);
            addMeetSessionId(id);
            navigate('PrepareMeetScreen');


        } else {
            console.log('Session not found:', id);
            removeSession(id);
            removeMeetSessionId();
            Alert.alert('Session not found', 'Please enter a valid session code');
        }
    }

    const renderSessionItem = ({ item }: { item: string }) => {
        return (
            <View
                className='flex-row items-center bg-white p-4 my-2 mx-1 rounded-md'
                style={{
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 1, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 16,
                }}
            >
                <Calendar size={RFValue(20)} color={Colors.icon} />
                <View className='flex-1 mx-2'>
                    <CustomText
                        fontSize={14}
                        fontFamily='Roboto-Medium'
                        color={Colors.text}
                    >
                        {addHyphens(item)}
                    </CustomText>
                    <CustomText fontSize={12} color={Colors.text} fontFamily='Roboto-Regular' style={{ opacity: 0.7 }}>Just join and enjoy party!</CustomText>
                </View>
                <TouchableOpacity
                    className='bg-[#0957D0] py-1 px-2 rounded-md'
                    onPress={() => joinViaSessionId(item)}
                >
                    <CustomText fontSize={12} color={Colors.white} fontFamily='Roboto-Medium'>Join</CustomText>
                </TouchableOpacity>
            </View>
        )
    }


    return (
        <View className='container'>
            <HomeHeader />
            <FlatList
                data={sessions}
                keyExtractor={item => item}
                contentContainerClassName='p-5'
                renderItem={renderSessionItem}
                ListEmptyComponent={EmptyHome}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
            <JoinButton onPress={handleNavigation} />

        </View>
    )
}




export default HomeScreen