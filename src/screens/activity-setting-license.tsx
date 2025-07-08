import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import {strings} from '~constants/strings';
import TitleTextinput from '~components/register-car-insurance-information/title-textinput';
import {heightScale, widthScale} from '~styles/scaling-utils';
import ButtonTitle from '~components/activity_setting_license/button-title';
import {IMAGES} from '~/assets/images-path';
import Button from '~components/button';
import {
  useDriverLicenseUpdateMutation,
  useReadMyDriverNameMutation,
  useUpdateImageUserMutation,
} from '~services/userServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {showMessage} from 'react-native-flash-message';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import {ImageProps} from '~constants/types';
import {uploadImage} from '~utils/index';
import {RootStackScreenProps} from '~navigators/stack';
import Spinner from '~components/spinner';

let isImageProfile = false;
const ActivitySettingLicense = (props: RootStackScreenProps<'ActivitySettingLicense'>) => {
  const {navigation, route} = props;
  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const [isLoading, setIsLoading] = useState(true);
  const [licenseNum, setLicenseNum] = useState('');
  const [licenseRank, setLicenseRank] = useState('');
  const [licenseDate, setLicenseDate] = useState('');
  const [licenseVerification, setLicenseVerification] = useState('');
  const [licenseImagePhoto, setLicenseImagePhoto] = useState<ImageProps>();
  const [profileImagePhoto, setProfileImagePhoto] = useState<ImageProps>();
  const chooseImageRef = useRef<ImagePickerModalRefs>(null);

  const [readMyDriver] = useReadMyDriverNameMutation();
  const [driverLicenseUpdate] = useDriverLicenseUpdateMutation();
  const [updateImageUser] = useUpdateImageUserMutation();

  const disableSubmit = useMemo(
    () => !licenseNum || !licenseRank || !licenseDate || !licenseVerification,
    [licenseNum, licenseDate, licenseRank, licenseVerification],
  );

  useEffect(() => {
    setIsLoading(true);
    readMyDriver({memberId: userToken?.id + ''})
      .unwrap()
      .then(res => {
        setLicenseImagePhoto({uri: res.licenseImageUrl} as ImageProps);
        setProfileImagePhoto({uri: res.profileImageUrl} as ImageProps);
        setLicenseNum(res.licenseNum);
        setLicenseDate(res.licenseEndDate);
        setLicenseRank(res.licenseKind);
        setLicenseVerification(res.licenseAuthNum);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const chooseImageToLib = (image: ImageProps) =>
    isImageProfile ? setLicenseImagePhoto(image) : setProfileImagePhoto(image);

  const onPressSubmit = () => {
    if (disableSubmit) {
      showMessage({message: '빈칸이 존재합니다.'});
      return;
    }

    driverLicenseUpdate({
      memberId: userToken?.id?.toString()!,
      licenseNum: licenseNum,
      licenseKind: licenseRank,
      licenseEndDate: licenseDate,
      licenseAuthNum: licenseVerification,
    })
      .unwrap()
      .then(async isSuccess => {
        if (isSuccess) {
          showMessage({message: '저장 성공'});
          // upload image:
          if (licenseImagePhoto?.fileName) {
            await uploadImage(
              licenseImagePhoto.uri,
              'License',
              userToken.id!,
              async url =>
                await pushImageUser({
                  url: 'sDriver/updateDriverImageLicense',
                  c_memberId: userToken.id,
                  licenseImageUrl: url,
                }),
            );
          }
          if (profileImagePhoto?.fileName) {
            await uploadImage(
              profileImagePhoto.uri,
              'License',
              userToken.id!,
              async url =>
                await pushImageUser({
                  url: 'sDriver/updateDriverImageProfile',
                  c_memberId: userToken.id,
                  licenseImageUrl: url,
                }),
            );
          }
        }
      });
  };
  const pushImageUser = async (body: any) => {
    await updateImageUser(body)
      .unwrap()
      .then(res => {
        if (res) {
          showMessage({
            message: '이미지 저장완료. 업로드지연시간으로 즉시 확인 안될수있음.',
          });
        } else {
          showMessage({
            message: '이미지 등록에 실패하였습니다..',
          });
        }
        navigation.goBack();
        Spinner.hide();
      });
  };

  if (isLoading) {
    return (
      <View style={styles.view}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FixedContainer>
      <CustomHeader text={strings.activity_setting_license.title} />
      <ScrollView>
        <TitleTextinput
          title="면허번호"
          placeholder="직접 입력해주세요."
          value={licenseNum}
          onChangeText={setLicenseNum}
        />
        <TitleTextinput
          title="면허종류"
          placeholder="직접 입력해주세요."
          value={licenseRank}
          onChangeText={setLicenseRank}
        />
        <TitleTextinput
          inputType={'numeric'}
          title="면허갱신 마감일"
          placeholder="직접 입력해주세요. ex) 20241225"
          value={licenseDate}
          onChangeText={setLicenseDate}
        />
        <TitleTextinput
          value={licenseVerification}
          title="면허 인증번호"
          placeholder="직접 입력해주세요."
          onChangeText={setLicenseVerification}
        />
        <ButtonTitle
          textContent="면허증 사진(필수)"
          title="[참고]"
          uriPath={IMAGES.license}
          style={styles.buttonImage}
        />
        <ButtonTitle
          uri={licenseImagePhoto?.uri}
          textContent="면허증 사진(필수)"
          title="면허증 사진첨부"
          important
          style={styles.buttonImage2}
          titleContent={'면허증 앞면이 모두 나오도록 등록해주세요.'}
          onPress={() => {
            isImageProfile = true;
            chooseImageRef.current?.show();
          }}
        />
        <ButtonTitle
          uri={profileImagePhoto?.uri}
          textContent="면허증 사진(필수)"
          title="프로필"
          important
          style={styles.buttonImage2}
          titleContent={'상대방이 알아 볼 수 있는 사진을 등록해주세요.'}
          onPress={() => {
            isImageProfile = false;
            chooseImageRef.current?.show();
          }}
        />
      </ScrollView>
      <Button disable={disableSubmit} text="저장" onPress={onPressSubmit} />
      <ImagePickerModal ref={chooseImageRef} onImage={chooseImageToLib} />
    </FixedContainer>
  );
};

export default ActivitySettingLicense;

const styles = StyleSheet.create({
  buttonImage: {
    marginHorizontal: widthScale(10),
    marginTop: heightScale(25),
  },
  buttonImage2: {
    marginHorizontal: widthScale(25),
    marginTop: heightScale(10),
  },
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});
