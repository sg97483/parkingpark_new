import storage from '@react-native-firebase/storage';
import React, {useMemo, useRef, useState} from 'react';
import {Linking, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import AppModal from '~components/app-modal';
import CustomButton from '~components/commons/custom-button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import UploadImage from '~components/driver-register/upload-image';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import Spinner from '~components/spinner';
import {IS_IOS, PADDING, PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ImageProps} from '~constants/types';
import {userHook} from '~hooks/userHook';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheMyDriverInfo} from '~reducers/userReducer';
import {
  useLazyReadMyDriverQuery,
  useUpdateCarImagesMutation,
  useUpdateDriverAuthMutation,
} from '~services/userServices';
import {useAppDispatch} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

const CarPhotoRegistration = (props: RootStackScreenProps<'CarPhotoRegistration'>) => {
  const text = strings.driver_register;
  const {navigation, route} = props;

  const {myDriverInfo, user, userID, CMemberID} = userHook();

  const [updateDriverAuth] = useUpdateDriverAuthMutation();

  const dispatch = useAppDispatch();

  // images picker
  const imgPickerRef = useRef<ImagePickerModalRefs>(null);
  const [indexImage, setIndexImage] = useState<number>(0);

  const [frontImg, setFrontImg] = useState<string>((myDriverInfo?.carImageUrl as string) || '');
  const [backImg, setBackImg] = useState<string>((myDriverInfo?.carImageUrl2 as string) || '');
  const [besideImg, setBesideImg] = useState<string>((myDriverInfo?.carImageUrl3 as string) || '');
  const [insideImg, setInsideImg] = useState<string>((myDriverInfo?.carImageUrl4 as string) || '');

  const [updateCarImages] = useUpdateCarImagesMutation();
  const [getDriverInfo] = useLazyReadMyDriverQuery();

  // handle upload image
  const handleUploadImage = async (index: number) => {
    let bitMap = '';
    let isUrlFirebaseStorage = false;

    switch (index) {
      case 0:
        bitMap = IS_IOS ? frontImg?.replace('file://', '') : frontImg;
        isUrlFirebaseStorage = frontImg?.includes('https://firebasestorage.googleapis.com');
        break;
      case 1:
        bitMap = IS_IOS ? backImg?.replace('file://', '') : backImg;
        isUrlFirebaseStorage = backImg?.includes('https://firebasestorage.googleapis.com');

        break;
      case 2:
        bitMap = IS_IOS ? besideImg?.replace('file://', '') : besideImg;
        isUrlFirebaseStorage = besideImg?.includes('https://firebasestorage.googleapis.com');

        break;
      case 3:
        bitMap = IS_IOS ? insideImg?.replace('file://', '') : insideImg;
        isUrlFirebaseStorage = insideImg?.includes('https://firebasestorage.googleapis.com');

        break;
      default:
        break;
    }

    if (bitMap) {
      if (isUrlFirebaseStorage) {
        switch (index) {
          case 0:
            return frontImg;
          case 1:
            return backImg;
          case 2:
            return besideImg;
          case 3:
            return insideImg;
          default:
            break;
        }
      } else {
        const storageImage = storage().ref(`/CarNum${index === 0 ? '' : index}/${userID}`);

        // put file
        await storageImage.putFile(bitMap as string);
        const a = await storageImage.getDownloadURL();

        return await storageImage.getDownloadURL();
      }
    } else {
      return '';
    }
  };

  const handleImagePicker = async (image: ImageProps) => {
    if (indexImage === 0) {
      setFrontImg(image.uri);
    } else if (indexImage === 1) {
      setBackImg(image.uri);
    } else if (indexImage === 2) {
      setBesideImg(image.uri);
    } else {
      setInsideImg(image.uri);
    }
  };

  const isUrlFirebaseStorage = useMemo(() => {
    const front = frontImg?.includes('https://firebasestorage.googleapis.com');
    const back = backImg?.includes('https://firebasestorage.googleapis.com');
    const inside = insideImg?.includes('https://firebasestorage.googleapis.com');
    const beside = besideImg?.includes('https://firebasestorage.googleapis.com');

    return front && back && inside && beside;
  }, [frontImg, backImg, insideImg, besideImg]);

  const handleCompleteUploadImg = async () => {
    Spinner.show();

    updateDriverAuth({authYN: 'N', memberId: userID?.toString()})
      .unwrap()
      .then(res => {});

    if (isUrlFirebaseStorage) {
      navigation.goBack();
      Spinner.hide();
      return;
    }

    Promise.all([
      handleUploadImage(0),
      handleUploadImage(1),
      handleUploadImage(2),
      handleUploadImage(3),
    ]).then(res => {
      console.log(res[0]);
      console.log(res[1]);
      console.log(res[2]);
      console.log(res[3]);
      updateCarImages({
        c_memberId: CMemberID?.toString(),
        carImageUrl: res[0],
        carImageUrl2: res[1],
        carImageUrl3: res[2],
        carImageUrl4: res[3],
      })
        .unwrap()
        .then(async res => {
          getDriverInfo({
            memberId: user?.id.toString(),
          })
            .unwrap()
            .then(res => {
              dispatch(cacheMyDriverInfo(res));
            });
        })
        .catch(err => {
          console.log(
            '🚀 ~ file: car-photo-registration.tsx:130 ~ handleCompleteUploadImg ~ err:',
            err,
          );
        })
        .finally(() => {
          navigation.goBack();
          Spinner.hide();
        });
    });
  };

  return (
    <FixedContainer edges={['top', 'bottom']}>
      <CustomHeader
        text=""
        onPressBack={() => {
          AppModal.show({
            title: '정말 나가시겠습니까?',
            content: '입력된 내용은 저장되지 않습니다.',
            isTwoButton: true,
            textYes: '확인',
            textNo: '취소',
            yesFunc() {
              navigation.goBack();
            },
          });
        }}
      />

      <ScrollView
        contentContainerStyle={{paddingVertical: PADDING1}}
        showsVerticalScrollIndicator={false}>
        <PaddingHorizontalWrapper forDriveMe>
          <CustomText
            string={'자동차 번호판이 나오도록\n차량사진을 등록해주세요!'}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_8}
            color={colors.menuTextColor}
            lineHeight={heightScale1(28)}
            forDriveMe
          />

          <TouchableOpacity
            onPress={() => {
              Linking.openURL('http://pf.kakao.com/_HKZxgG/chat');
            }}>
            <View style={styles.boxText}>
              <CustomText
                string={
                  '해당화면에서 증빙자료 제출에 어려움이 있으실\n경우 파킹박 파킹박 드라이버 QUICK 등록 서비스\n를 통해 빠르고 간편하게 신청 가능하십니다.'
                }
                family={FONT_FAMILY.MEDIUM}
                color={colors.grayText2}
                lineHeight={heightScale1(20)}
                forDriveMe
              />
              <Icons.ChevronRight
                stroke={colors.lineCancel}
                width={widthScale1(16)}
                height={widthScale1(16)}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.boxUpload}>
            <HStack style={{justifyContent: 'space-between'}}>
              <UploadImage
                image={frontImg}
                title={text.car_front}
                onPress={() => {
                  imgPickerRef.current?.show();
                  setIndexImage(0);
                }}
              />

              <UploadImage
                image={backImg}
                title={text.car_back}
                onPress={() => {
                  imgPickerRef.current?.show();
                  setIndexImage(1);
                }}
              />
            </HStack>
            <HStack style={{justifyContent: 'space-between'}}>
              <UploadImage
                image={besideImg}
                title={text.car_side}
                onPress={() => {
                  imgPickerRef.current?.show();
                  setIndexImage(2);
                }}
              />
              <UploadImage
                image={insideImg}
                title={text.car_inside}
                onPress={() => {
                  {
                    imgPickerRef.current?.show();
                    setIndexImage(3);
                  }
                }}
              />
            </HStack>
          </View>
        </PaddingHorizontalWrapper>
      </ScrollView>

      <CustomButton
        text={text.register}
        onPress={handleCompleteUploadImg}
        disabled={frontImg && backImg && besideImg && insideImg ? false : true}
        buttonHeight={58}
        buttonStyle={styles.submitButtonStyle}
      />

      <ImagePickerModal ref={imgPickerRef} onImage={handleImagePicker} />
    </FixedContainer>
  );
};

export default CarPhotoRegistration;

const styles = StyleSheet.create({
  boxText: {
    backgroundColor: colors.policy,
    paddingHorizontal: PADDING,
    paddingVertical: heightScale1(16),
    marginTop: heightScale1(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: scale1(4),
  },
  boxUpload: {
    marginTop: heightScale1(20),
    gap: PADDING1,
  },
  submitButtonStyle: {
    marginHorizontal: PADDING1,
    marginBottom: PADDING1 / 2,
    marginTop: heightScale1(10),
  },
});
