import { MediaStream } from 'react-native-webrtc';
import { create } from 'zustand';



export interface IParticipant {
    userId: string,
    name: string,
    micOn: boolean,
    videoOn: boolean,
    mediaStream: MediaStream | null,
    photo: string | null,
    speaking?: boolean,
}



interface ILiveMeetState {
    sessionId: string | null,
    participants: IParticipant[],
    micOn: boolean,
    videoOn: boolean,
    addMeetSessionId: (sessionId: string) => void,
    removeMeetSessionId: () => void,
    addParticipant: (participant: IParticipant) => void,
    removeParticipant: (participantId: string) => void,
    updateParticipant: (participant: IParticipant) => void,
    toggle: (type: 'mic' | 'video') => void,
    clear: () => void,
    setRemoteMediaStream: (participantId: string, remoteStream: MediaStream) => void,
}




export const useLiveMeetStore = create<ILiveMeetState>()(
    (set, get) => ({
        sessionId: null,
        participants: [],
        micOn: false,
        videoOn: false,

        clear: () => set({
            sessionId: null,
            participants: [],
        }),

        addMeetSessionId: (sessionId) => set({ sessionId }),

        removeMeetSessionId: () => set({ sessionId: null }),

        addParticipant: (participant) => {
            const { participants } = get();
            set({ participants: [...participants, participant] })
        },

        removeParticipant: (participantId) => {
            const { participants } = get();
            set({
                participants: participants.filter(p => p.userId !== participantId)
            })
        },

        updateParticipant: (updateParticipant) => {
            const { participants } = get();
            set({
                participants: participants.map(p => p.userId === updateParticipant.userId ? {
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

        setRemoteMediaStream: (participantId, remoteStream) => {
            const { participants } = get();
            const updatedParticipants = participants.map(p => p.userId === participantId ? {
                ...p,
                mediaStream: remoteStream,
            } : p);
            // if(!participants.some(p => p.userId === participantId)){
            //     updatedParticipants.push({id: participantId, streamURL});
            // }
            set({ participants: updatedParticipants });
        },
    }),


)