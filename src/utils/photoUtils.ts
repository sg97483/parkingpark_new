import {Linking} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import AppModal from '~components/app-modal';
import {IS_ANDROID, IS_IOS} from '~constants/constant';
import {TYPE_IMAGE} from '~constants/enum';
import {ImageProps} from '~constants/types';
import DeviceInfo from 'react-native-device-info';

const CAMERA_QUALITY = 0.2;
const TIMEOUT_VALUE = 200;

export const handleOpenCamera = async () => {
  try {
    const cameraPermissionResult = await request(
      IS_ANDROID ? PERMISSIONS?.ANDROID?.CAMERA : PERMISSIONS?.IOS?.CAMERA,
    );

    if (cameraPermissionResult !== RESULTS.GRANTED) {
      AppModal.show({
        title: '카메라 접근 권한이 차단되었습니다.',
        content: '설정에서 액세스를 허용하시겠습니까?',
        textNo: '취소',
        textYes: '설정으로 가기',
        isTwoButton: true,
        yesFunc() {
          Linking.openSettings();
        },
      });
      return;
    }

    const cameraResult = await launchCamera({
      mediaType: 'photo',
      cameraType: 'back',
      quality: CAMERA_QUALITY,
    });

    if (cameraResult?.assets && cameraResult?.assets?.length > 0) {
      const asset = cameraResult?.assets[0];
      const typeSplit = asset.type?.split('/');
      const currentType = typeSplit ? typeSplit[1] : '';
      const {fileName, height, width, uri} = asset;

      const returnImage = {
        fileName,
        height,
        width,
        uri,
        type: currentType === 'jpeg' ? TYPE_IMAGE.jpeg : TYPE_IMAGE.png,
      } as ImageProps;

      await new Promise(resolve => setTimeout(resolve, TIMEOUT_VALUE));

      return returnImage;
    }

    return undefined;
  } catch (error) {
    console.error('Error in handleOpenCamera:', error);
    throw error;
  }
};

export const handleOpenPhotoLibrary = async () => {
  try {
    const apiLevel = DeviceInfo.getApiLevelSync();

    const cameraPermissionResult = await request(
      IS_ANDROID && apiLevel >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : IS_IOS
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    );

    if (cameraPermissionResult !== RESULTS.GRANTED) {
      AppModal.show({
        title: '사진 라이브라리 접근 권한이 차단되었습니다.',
        content: '설정에서 액세스를 허용하시겠습니까?',
        textNo: '취소',
        textYes: '설정으로 가기',
        isTwoButton: true,
        yesFunc() {
          Linking.openSettings();
        },
      });
      return;
    }

    const cameraResult = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: CAMERA_QUALITY,
    });

    if (cameraResult?.assets && cameraResult?.assets?.length > 0) {
      const asset = cameraResult?.assets[0];
      const typeSplit = asset.type?.split('/');
      const currentType = typeSplit ? typeSplit[1] : '';
      const {fileName, height, width, uri} = asset;

      const returnImage = {
        fileName,
        height,
        width,
        uri,
        type: currentType === 'jpeg' ? TYPE_IMAGE.jpeg : TYPE_IMAGE.png,
      } as ImageProps;

      await new Promise(resolve => setTimeout(resolve, TIMEOUT_VALUE));

      return returnImage;
    }

    return undefined;
  } catch (error) {
    console.error('Error in handleOpenPhotoLibrary:', error);
    throw error;
  }
};
