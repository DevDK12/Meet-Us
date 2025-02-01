import { Platform } from 'react-native';
import {
  launchImageLibrary,
  Asset,
  ImagePickerResponse
} from 'react-native-image-picker';
import {
  requestMultiple,
  PERMISSIONS,
  RESULTS,
  request,
  Permission,
} from 'react-native-permissions';


export const calculateFinalPos = (x: number, y: number, containerWidth: number, containerHeight: number) => {

  //_ distance from all corners
  const distances = {
    topLeft: Math.sqrt(x ** 2 + y ** 2),
    topRight: Math.sqrt((containerWidth - x) ** 2 + y ** 2),
    bottomLeft: Math.sqrt(x ** 2 + (containerHeight - y) ** 2),
    bottomRight: Math.sqrt((containerWidth - x) ** 2 + (containerHeight - y) ** 2),
  };

  type TDirections = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  const closestCorner = Object.keys(distances).reduce((a, b) => distances[a] < distances[b] ? a : b) as TDirections;

  let finalX = 0;
  let finalY = 0;

  switch (closestCorner) {
    case 'topLeft':
      finalX = 10;
      finalY = 10;
      break;
    case 'topRight':
      finalX = containerWidth - containerWidth * 0.24 - 10;
      finalY = 10;
      break;
    case 'bottomLeft':
      finalX = 10;
      finalY = containerHeight - containerHeight * 0.26 - 20;
      break;
    case 'bottomRight':
      finalX = containerWidth - containerWidth * 0.24 - 10;
      finalY = containerHeight - containerHeight * 0.26 - 20;
      break;
  }

  return { finalX, finalY };
}

const logPermissionStatus = (permission: string, status: string) => {
  if (status === RESULTS.GRANTED) {
    console.log(`${permission} PERMISSION GRANTED ✅`);
  } else if (status === RESULTS.DENIED) {
    console.log(`${permission} PERMISSION DENIED ❌`);
  } else if (status === RESULTS.BLOCKED) {
    console.log(`${permission} PERMISSION BLOCKED 🚫`);
  } else {
    console.log(`${permission} PERMISSION STATUS: ${status}`);
  }
};

export const requestPermissions = async () => {
  try {
    const permissionsToRequest =
      Platform.OS === 'ios'
        ? [
          PERMISSIONS.IOS.CAMERA,
          PERMISSIONS.IOS.MICROPHONE,
          PERMISSIONS.IOS.PHOTO_LIBRARY,
        ]
        : [
          PERMISSIONS.ANDROID.CAMERA,
          PERMISSIONS.ANDROID.RECORD_AUDIO,
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ];

    const results = await requestMultiple(permissionsToRequest);

    for (const [permission, status] of Object.entries(results)) {
      logPermissionStatus(permission, status);
    }

    const isCameraGranted =
      Platform.OS === 'ios'
        ? results[PERMISSIONS.IOS.CAMERA] === 'granted'
        : results[PERMISSIONS.ANDROID.CAMERA] === 'granted';

    const isMicrophoneGranted =
      Platform.OS === 'ios'
        ? results[PERMISSIONS.IOS.MICROPHONE] === 'granted'
        : results[PERMISSIONS.ANDROID.RECORD_AUDIO] === 'granted';

    const isPhotoLibraryGranted =
      Platform.OS === 'ios'
        ? results[PERMISSIONS.IOS.PHOTO_LIBRARY] === 'granted'
        : results[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === 'granted';

    return { isCameraGranted, isMicrophoneGranted, isPhotoLibraryGranted };
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return { isCameraGranted: false, isMicrophoneGranted: false };
  }
};


export const requestPermission = async (permission: string, iosPermission: Permission, androidPermission: Permission) => {
  try {
    const permissionToRequest = Platform.OS === 'ios' ? iosPermission : androidPermission;

    const status = await request(permissionToRequest);

    logPermissionStatus(permissionToRequest, status);

    return status === 'granted';
  } catch (error) {
    console.error(`Error requesting ${permission.toLowerCase()} permission:`, error);
    return false;
  }
};

export const requestCameraPermission = async () => requestPermission('Camera', PERMISSIONS.IOS.CAMERA, PERMISSIONS.ANDROID.CAMERA);

export const requestPhotoLibraryPermission = async () => requestPermission('Photo Library', PERMISSIONS.IOS.PHOTO_LIBRARY, PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);



export const requestMicrophonePermission = async () => requestPermission('Microphone', PERMISSIONS.IOS.MICROPHONE, PERMISSIONS.ANDROID.RECORD_AUDIO);


export type TOnMediaPickedUp = (image: Asset) => void;
export const pickImage = (onMediaPickedUp: TOnMediaPickedUp) => {
  launchImageLibrary(
    {
      mediaType: 'photo',
      quality: 1,
      includeBase64: false,
    },
    (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const { assets } = response;
        if (assets && assets.length > 0) {
          const selectedImage = assets[0];
          onMediaPickedUp(selectedImage);
        }
      }
    },
  );
};



export const addHyphens = (str: string) => {
  return str?.replace(/(.{3})(?=.)/g, '$1-');
};

export const removeHyphens = (str: string) => {
  return str?.replace(/-/g, '');
};
