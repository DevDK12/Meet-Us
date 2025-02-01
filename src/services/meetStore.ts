import { create } from 'zustand';



export interface IParticipant {
    id: string,
    name: string,
    micOn: boolean,
    videoOn: boolean,
    streamURL: string,
}



interface ILiveMeetState {
    sessionId: string | null,
    participants: IParticipant[],
    micOn: boolean,
    videoOn: boolean,
    addMeetSessionId: (sessionId: string) => void,
    removeMeetSessionId: () => void,
    addParticipant: (participant: IParticipant) => void,
    removeParticipant: (participant: IParticipant) => void,
    updateParticipant: (participant: IParticipant) => void,
    toggle: (type: 'mic' | 'video') => void,
}




export const useLiveMeetStore = create<ILiveMeetState>()(
    (set, get) => ({
        sessionId: null,
        participants: [],
        micOn: false,
        videoOn: false,


        addMeetSessionId: (sessionId) => set({ sessionId }),

        removeMeetSessionId: () => set({ sessionId: null }),

        addParticipant: (participant) => {
            const { participants } = get();
            set({ participants: [...participants, participant] })
        },

        removeParticipant: (participant) => {
            const { participants } = get();
            set({
                participants: participants.filter(p => p.id !== participant.id)
            })
        },

        updateParticipant: (updateParticipant) => {
            const { participants } = get();
            set({
                participants: participants.map(p => p.id === updateParticipant.id ? {
                    ...p,
                    micOn: updateParticipant.micOn,
                    videoOn: updateParticipant.videoOn,
                }
                    : p)
            })
        },

        toggle: (type) => {
            if (type === 'mic') {
                set({ micOn: !get().micOn });
            } else {
                set(state => ({ videoOn: !state.videoOn }));
            }
        },


    }),


)