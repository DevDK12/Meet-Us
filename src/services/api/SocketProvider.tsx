import { createContext, FC, useContext, useEffect, useRef } from "react";
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from "../config";
import { RTCIceCandidate, RTCPeerConnection } from "react-native-webrtc";


type TEvent = 'connect'
    | 'disconnect'
    | 'error'
    | 'message'
    | 'prepare-session'
    | 'session-info'
    | 'join-session'
    | 'new-participant'
    | 'current-room'
    | 'all-participants'
    | 'send-offer'
    | 'receive-offer'
    | 'send-answer'
    | 'receive-answer'
    | 'send-ice-candidate'
    | 'receive-ice-candidate'
    | 'toggle-mute'
    | 'toggle-video'
    | 'participant-update'
    | 'participant-left'
    | 'send-emoji'
    | 'emoji-update'
    | 'send-chat'
    | 'receive-chat'
    | 'hang-up'


type TPayload = {
    sessionId?: string,
    userId?: string,
    name?: string,
    photo?: string,
    micOn?: boolean,
    videoOn?: boolean,
    sender?: string,
    receiver?: string,
    candidate?: RTCIceCandidate,
    offer?: any,
    answer?: any,
}
export interface ISocketContext {
    socket: Socket | null,
    initializeSocket: () => void,
    emit: (event: TEvent, data: TPayload) => void,
    on: (event: TEvent, cb: (...args: any[]) => void) => void,
    off: (event: TEvent) => void,
    disconnect: () => void,
    removeListener: (listnerName: string) => void,
}
const SocketContext = createContext<ISocketContext | null>(null);


type SocketProviderProps = {
    children: React.ReactNode
}
export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
    const socket = useRef<Socket | null>(null);

    useEffect(() => {
        socket.current = io(SOCKET_URL, {
            transports: ['websocket'],
        });
        return () => {
            socket?.current?.disconnect();
        }
    }, []);

    const emit = (event: TEvent, data: any) => {
        socket?.current?.emit(event, data);
    }

    const on = (event: TEvent, cb: (...args: any[]) => void) => {
        socket?.current?.on(event, cb);
    }

    const off = (event: TEvent) => {
        socket?.current?.off(event);
    }

    const disconnect = () => {
        if (socket?.current) {
            socket.current?.disconnect();
            socket.current = null;
        }
    }

    const removeListener = (listnerName: string) => {
        socket?.current?.removeListener(listnerName);
    }


    return (
        <SocketContext.Provider value={{
            socket: socket.current,
            initializeSocket: () => { },
            emit,
            on,
            off,
            disconnect,
            removeListener,
        }}>
            {children}
        </SocketContext.Provider>
    )
}


export const useSocket = () => {
    const socketServices = useContext(SocketContext);
    if (!socketServices) {
        throw new Error('useSocket must be used within a SocketProvider');
    };
    return socketServices;
}