import { Alert, Platform } from 'react-native';
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
import RNFS, { readFile } from 'react-native-fs';



export const calculateFinalPos = (x: number, y: number, containerWidth: number, containerHeight: number) => {

  //_ distance from all corners
  const distances = {
    topLeft: Math.sqrt(x ** 2 + y ** 2),
    topRight: Math.sqrt((containerWidth - x) ** 2 + y ** 2),
    bottomLeft: Math.sqrt(x ** 2 + (containerHeight - y) ** 2),
    bottomRight: Math.sqrt((containerWidth - x) ** 2 + (containerHeight - y) ** 2),
  };

  type TDirections = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

  const closestCorner = (Object.keys(distances) as TDirections[]).reduce((a, b) => distances[a] < distances[b] ? a : b);

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

export const peerConstraints = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};
export const sessionConstraints = {
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true,
    VoiceActivityDetection: true,
  },
};




export const uploadToCloudinary = async (fileUri: string, CLOUD_NAME: string, UPLOAD_PRESET: string) => {

  try {
    const fileData = await readFile(fileUri, 'base64');

    // Create form data
    const formData = new FormData();
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('file', `data:image/jpeg;base64,${fileData}`);
    formData.append('tags', 'mobile_upload');

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const data = await response.json();

    if (data.secure_url) {
      console.log('Upload successful: ', data.secure_url);
      return data.secure_url;
    }
    return null;
  } catch (error) {
    Alert.alert('Upload Failed', 'Error uploading image to Cloudinary');
    console.error('Upload error:', error);
    return null;
  }
};