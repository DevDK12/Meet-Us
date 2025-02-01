import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './storage';

export type TUser = {
    id: string;
    name: string;
    profilePhotoUrl: string;
}
interface IUserState {
    user: TUser | null;
    sessions: string[];
    setUser: (user: TUser) => void;
    addSession: (sessionId: string) => void;
    removeSession: (sessionId: string) => void;
    clear: () => void;
}


export const useUserStore = create<IUserState>()(
    persist(
        (set, get) => ({
            user: null,
            sessions: [],
            setUser: (user) => set({ user }),
            addSession: (sessionId) => {
                const { sessions } = get();
                const existingSessionIndex = sessions.findIndex(s => s === sessionId);
                if (existingSessionIndex === -1) {
                    set({ sessions: [sessionId, ...sessions] });
                }
            },
            removeSession: (sessionId) => {
                const { sessions } = get();
                const updatedSessions = sessions.filter(s => s !== sessionId);
                set({ sessions: updatedSessions });
            },
            clear: () => set({ user: null, sessions: [] }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => mmkvStorage),
        },
        //_ Custom storage engine mmkvStorage pre configured 
    ),
)