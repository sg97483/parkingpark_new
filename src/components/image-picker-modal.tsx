import {BottomSheetBackdropProps, BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {forwardRef, useCallback, useImperativeHandle, useRef} from 'react';
import {Alert, Linking, Pressable, StatusBar, StyleSheet} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {Icons} from '~/assets/svgs';
import {IS_ANDROID, IS_IOS, PADDING1} from '~constants/constant';
import {FONT_FAMILY, TYPE_IMAGE} from '~constants/enum';
import {ImageProps} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import AppModal from './app-modal';
import CustomBackdrop from './custom-backdrop';
import CustomText from './custom-text';
import HStack from './h-stack';

interface Props {
  onImage: (value: ImageProps) => void;
}

export interface ImagePickerModalRefs {
  show: () => void;
  hide: () => void;
}

const ImagePickerModal = forwardRef((props: Props, ref) => {
  const {onImage} = props;
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const show = () => {
    bottomSheetRef?.current?.present();
  };

  const hide = () => {
    bottomSheetRef?.current?.close();
  };

  useImperativeHandle(ref, () => ({show, hide}), []);

  const handleLaunchCamera = async () => {
    const result = await request(
      IS_ANDROID ? PERMISSIONS?.ANDROID?.CAMERA : PERMISSIONS?.IOS?.CAMERA,
    );

    if (result === RESULTS.GRANTED) {
      launchCamera({mediaType: 'photo', cameraType: 'back', quality: 0.2})
        .then(res => {
          if (res?.assets) {
            hide();
            let typeSplit = res?.assets[0]?.type?.split('/');
            let currentType = typeSplit ? typeSplit[1] : '';
            setTimeout(() => {
              onImage &&
                onImage({
                  fileName: res?.assets[0]?.fileName as string,
                  height: res?.assets[0]?.height as number,
                  width: res?.assets[0]?.width as number,
                  uri: res?.assets[0]?.uri as string,
                  type: currentType === 'jpeg' ? TYPE_IMAGE.jpeg : TYPE_IMAGE.png,
                });
            }, 200);
          }
        })
        .catch(error => Alert.alert(error));
    } else {
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
    }
  };

  const handleChooseImage = async () => {
    const apiLevel = DeviceInfo.getApiLevelSync();

    const result = await request(
      IS_ANDROID && apiLevel >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : IS_IOS
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    );

    if (result == RESULTS.GRANTED) {
      launchImageLibrary({mediaType: 'photo', selectionLimit: 1, quality: 0.2})
        .then(res => {
          if (res?.assets) {
            hide();
            onImage &&
              onImage({
                fileName: res.assets[0]?.fileName as string,
                height: res?.assets[0]?.height as number,
                width: res?.assets[0]?.width as number,
                uri: res?.assets[0]?.uri as string,
                type: 'image/jpg',
              });
          }
        })
        .catch(error => Alert.alert(error));
    } else {
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
    }
  };

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => {
    return <CustomBackdrop {...props} onPressBackdrop={hide} />;
  }, []);

  return (
    <BottomSheetModal
      handleComponent={() => null}
      index={0}
      ref={bottomSheetRef}
      backdropComponent={renderBackdrop}
      enableDynamicSizing>
      <BottomSheetView style={[styles.content, {paddingBottom: heightScale1(52)}]}>
        <StatusBar backgroundColor={colors.transparent} />
        <HStack style={styles.wrapper}>
          {/* Camera */}
          <Pressable style={styles.button} onPress={handleLaunchCamera}>
            <Icons.Camera />
            <CustomText forDriveMe string="카메라" lineHeight={20} family={FONT_FAMILY.MEDIUM} />
          </Pressable>

          {/* Library */}
          <Pressable style={styles.button} onPress={handleChooseImage}>
            <Icons.Library />
            <CustomText forDriveMe string="앨범" lineHeight={20} family={FONT_FAMILY.MEDIUM} />
          </Pressable>
        </HStack>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default ImagePickerModal;

const styles = StyleSheet.create({
  container: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: colors.white,
    paddingHorizontal: PADDING1,
    paddingTop: PADDING1,
    borderTopLeftRadius: scale1(16),
    borderTopRightRadius: scale1(16),
  },
  wrapper: {
    gap: widthScale1(10),
  },
  button: {
    backgroundColor: colors.policy,
    minHeight: heightScale1(96),
    borderRadius: scale1(8),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    hap: heightScale1(4),
  },
});
