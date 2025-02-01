import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import { navigationRef } from '../utils/NavigationUtils';
import HomeScreen from '../screens/HomeScreen';
import PrepareMeetScreen from '../screens/PrepareMeetScreen';
import JoinMeetScreen from '../screens/JoinMeetScreen';
import LiveMeetScreen from '../screens/LiveMeetScreen';
import { SocketProvider } from '../services/api/SocketProvider';

const Stack = createNativeStackNavigator();


const Navigation = () => {
    return (
        <SocketProvider>
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator
                    initialRouteName='SplashScreen'
                    screenOptions={{
                        headerShown: false
                    }}
                >
                    <Stack.Screen name='SplashScreen' component={SplashScreen} />
                    <Stack.Screen name='HomeScreen' component={HomeScreen} />
                    <Stack.Screen name='PrepareMeetScreen' component={PrepareMeetScreen} />
                    <Stack.Screen name='JoinMeetScreen' component={JoinMeetScreen} />
                    <Stack.Screen name='LiveMeetScreen' component={LiveMeetScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </SocketProvider>

    )
}
export default Navigation