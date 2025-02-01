import { MMKV } from 'react-native-mmkv';


export const storage = new MMKV({
    id: 'user_storage',
    encryptionKey: 'my_encryption_key',
});



export type TMmkvStorage = {
    setItem: (key: string, value: string) => void;
    getItem: (key: string) => string | null;
    removeItem: (key: string) => void;
}

export const mmkvStorage: TMmkvStorage = {
    setItem: (key, value) => {
        storage.set(key, value);
    },
    getItem: (key) => {
        const value = storage.getString(key);
        return value ?? null;
    },
    removeItem: (key) => {
        storage.delete(key);
    }
}