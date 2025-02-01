import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from '../config';
import { Alert } from 'react-native';


type TCreateSessionResponse = {
    sessionId: string;
}
export const createSession = async () => {
    try {
        const response: AxiosResponse<TCreateSessionResponse> = await axios.post(`${BASE_URL}/create-session`);
        return response?.data?.sessionId;
    } catch (error) {
        console.error('Error creating session:', error);
        Alert.alert('Error creating session');
        return null;
    }
}

type TCheckSessionResponse = {
    isAlive: boolean;
}
export const checkSession = async (sessionId: string) => {
    try {
        const res: AxiosResponse<TCheckSessionResponse> = await axios.get(`${BASE_URL}/is-alive?sessionId=${sessionId}`);
        return res?.data?.isAlive;
    }
    catch (error) {
        console.error('Error checking session:', error);
        Alert.alert('Error checking session');
        return false;
    }
}