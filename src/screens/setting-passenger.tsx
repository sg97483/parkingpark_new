import React, {useEffect, useRef, useState} from 'react';
import {View, Image, TouchableOpacity, StyleSheet, ScrollView, Linking} from 'react-native';
import {ICONS} from '~/assets/images-path';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {useAppSelector} from '~store/storeHooks';
import {ImageProps} from '~constants/types';
import ButtonImage from '~components/setting-passenger/button-image';
import {sleep, uploadImage} from '~utils/index';
import {useReadMyDriverMutation, useUpdateImageUserMutation} from '~services/userServices';
import {showMessage} from 'react-native-flash-message';
import Spinner from '~components/spinner';
let isTop = true;

const SettingPassengerActivity = () => {
  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const [img1, setImg1] = useState<ImageProps>();
  const [img2, setImg2] = useState<ImageProps>();
  const imagePickerModalRef = useRef<ImagePickerModalRefs>(null);
  const [updateImageUser] = useUpdateImageUserMutation();
  const [readMyDriver] = useReadMyDriverMutation();

  const onPressCheckAttachment = async () => {
    const url = 'http://cafe.wisemobile.kr/imobile/covid_guide.php';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  useEffect(() => {
    Spinner.show();
    readMyDriver({memberId: userToken?.id + ''})
      .unwrap()
      .then(res => {
        setImg1({uri: res.vaccineImageUrl} as ImageProps);
        setImg2({uri: res.bcImageUrl} as ImageProps);
        Spinner.hide();
      })
      .catch(Spinner.hide);
  }, []);

  const setImageToLib = (img: ImageProps) => (isTop ? setImg1(img) : setImg2(img));

  const upLoadImageButton = async () => {
    Spinner.show();
    if (img1?.fileName) {
      await uploadImage(img1.uri, 'Vaccine', userToken?.id!, async url => {
        updateImageUser({
          url: 'sDriver/updateDriverImageVc',
          c_memberId: userToken.id?.toString(),
          vaccineImageUrl: url,
        })
          .unwrap()
          .then(res => {
            Spinner.hide();
            if (res) {
              showMessage({
                message: '이미지 저장완료. 업로드지연시간으로 즉시 확인 안될수있음.',
              });
            } else {
              showMessage({message: '이미지 등록에 실패하였습니다..'});
            }
          });
      });
    }
    await sleep(100);
    if (img2?.fileName) {
      await uploadImage(img2.uri, 'Bc', userToken?.id!, async url => {
        console.log(url);

        updateImageUser({
          url: 'sDriver/updateDriverImageBc',
          c_memberId: userToken.id?.toString(),
          bcImageUrl: url,
        })
          .unwrap()
          .then(res => {
            Spinner.hide();
            if (res) {
              showMessage({
                message: '이미지 저장완료. 업로드지연시간으로 즉시 확인 안될수있음.',
              });
            } else {
              showMessage({message: '이미지 등록에 실패하였습니다..'});
            }
          });
      });
    }
    Spinner.hide();
  };

  return (
    <FixedContainer>
      <CustomHeader text="증빙자료 등록" headerTextStyle={styles.textHeader} />
      <ScrollView style={{margin: 20}}>
        <View style={styles.viewTop}>
          <CustomText string="코로나 백신접종 증명서 " family={FONT_FAMILY.SEMI_BOLD} />
          <Image source={ICONS.btn_greencar_off} style={styles.dot} />
          <TouchableOpacity onPress={onPressCheckAttachment}>
            <CustomText
              string={'(첨부방법 확인)'}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.CAPTION_4}
              color={colors.red1}
            />
          </TouchableOpacity>
        </View>
        <CustomText
          string="COOV앱내 공유버튼 이용하여 접종확인카드 캡쳐하여 첨부 부탁드립니다."
          color={colors.grayText}
        />
        <ButtonImage
          onPress={() => {
            isTop = true;
            imagePickerModalRef?.current?.show?.();
          }}
          text={'백신 접종 증명서(필수)'}
          uri={img1?.uri!}
        />
        <CustomText string="직장명함(선택)" family={FONT_FAMILY.SEMI_BOLD} />
        <ButtonImage
          onPress={() => {
            isTop = false;
            imagePickerModalRef?.current?.show?.();
          }}
          text={'명함 사진(선택)'}
          uri={img2?.uri!}
        />
      </ScrollView>
      <TouchableOpacity onPress={upLoadImageButton} style={styles.buttonBottom}>
        <CustomText string="신청" family={FONT_FAMILY.SEMI_BOLD} color={colors.white} />
      </TouchableOpacity>
      <ImagePickerModal ref={imagePickerModalRef} onImage={setImageToLib} />
    </FixedContainer>
  );
};

export default SettingPassengerActivity;
const styles = StyleSheet.create({
  textHeader: {
    textAlign: 'center',
    marginLeft: -widthScale(20),
  },
  viewTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: heightScale(10),
  },
  dot: {
    width: widthScale(5),
    height: widthScale(5),
    marginRight: widthScale(5),
    tintColor: colors.redButton,
    marginTop: heightScale(5),
  },

  buttonBottom: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: colors.redButton,
    width: '100%',
    height: heightScale(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
