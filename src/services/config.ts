import { HOST } from '@env';

// export const BASE_URL = `http://192.168.1.4:3000/api/v1`;
// export const SOCKET_URL = `ws://192.168.1.4:3000`;
export const BASE_URL = `https://${HOST}/api/v1`;
export const SOCKET_URL = `ws://${HOST}`;


export const CLOUD_NAME = process.env.CLOUD_NAME;
export const UPLOAD_PRESET = process.env.PRESET;