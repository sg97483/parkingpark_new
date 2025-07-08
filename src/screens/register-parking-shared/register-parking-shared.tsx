import {useKeyboard} from '@react-native-community/hooks';
import React, {memo, useRef, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {IMAGES} from '~/assets/images-path';
import CustomButton from '~components/commons/custom-button';
import CustomInput from '~components/commons/custom-input';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import RegisterParkingSharedImageList from '~components/register-parking-shared/register-parking-shared-image-list';
import RegisterParkingSharedModal, {
  RegisParkingSharedMapRef,
} from '~components/register-parking-shared/register-parking-shared-map-modal';
import Spinner from '~components/spinner';
import {PADDING, PADDING1, PADDING_HEIGHT} from '~constants/constant';
import {strings} from '~constants/strings';
import {ImageProps, RegisterParkingSharedProps, UpdateImageSharedProps} from '~constants/types';
import {RootStackScreenProps} from '~navigators/stack';
import {useUpdateShareImageMutation, useWritePublicMutation} from '~services/parkingServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, heightScale1, widthScale} from '~styles/scaling-utils';
import {fontSize} from '~styles/typography';
import {isEmpty} from '~utils/index';

const RegisterParkingShared = memo((props: RootStackScreenProps<'RegisterParkingShared'>) => {
  const keyboard = useKeyboard();
  const {navigation} = props;

  const regisParkingSharedMapRef = useRef<RegisParkingSharedMapRef>(null);

  const currentLocation = useAppSelector(state => state?.coordinateReducer?.userCordinate);

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [space, setSpace] = useState<string>('');
  const [amt, setAmt] = useState<string>('');
  const [runtime, setRuntime] = useState<string>('');
  const [sellTime, setSellTime] = useState<string>('');
  const [pnum, setPnum] = useState<string>('');

  const [image1, setImage1] = useState<ImageProps | null>(null);
  const [image2, setImage2] = useState<ImageProps | null>(null);
  const [image3, setImage3] = useState<ImageProps | null>(null);
  const [image4, setImage4] = useState<ImageProps | null>(null);

  const [writePublic] = useWritePublicMutation();
  const [updateShareImage] = useUpdateShareImageMutation();

  const onSave = () => {
    let body: RegisterParkingSharedProps;
    let reqMemberId = userToken?.id ? userToken?.id?.toString() : null;
    body = {
      sMemberId: reqMemberId,
      sGarageName: '주차장명',
      sGarageInfo: description,
      sGarageAddress: address,
      sGaragePay: amt,
      sShareSpace: space,
      sGTime: runtime,
      sGDay: sellTime,
      pNum: pnum,
    };

    if (isEmpty(body.sMemberId)) {
      showMessage({
        message: strings?.register_parking_shared?.invalid_member_id,
      });
      return;
    }
    if (isEmpty(address)) {
      showMessage({
        message: strings?.register_parking_shared?.invalid_address,
      });
      return;
    }
    if (isEmpty(amt)) {
      showMessage({
        message: strings?.register_parking_shared?.invalid_amt,
      });
      return;
    }
    if (isEmpty(space)) {
      showMessage({
        message: strings?.register_parking_shared?.invalid_amt,
      });
      return;
    }
    if (isEmpty(sellTime)) {
      showMessage({
        message: strings?.register_parking_shared?.invalid_sellTime,
      });
      return;
    }

    if (image1 === null && image2 === null && image3 === null && image4 === null) {
      Spinner.show();
      writePublic(body)
        .unwrap()
        .then(res => {
          if (res?.statusCode === '200') {
            navigation.goBack();
          }
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          Spinner.hide();
        });
    } else {
      Spinner.show();
      writePublic(body)
        .unwrap()
        .then(async res => {
          if (res?.statusCode === '200' && res?.bbsId) {
            const body: UpdateImageSharedProps = {
              bbsId: res?.bbsId,
              sMemberId: reqMemberId,
              carImage1: image1 ? image1 : null,
              carImage2: image2 ? image2 : null,
              carImage3: image3 ? image3 : null,
              carImage4: image4 ? image4 : null,
            };
            await updateShareImage(body)
              .unwrap()
              .then(res => {
                if (res?.statusCode === '200') {
                  navigation.goBack();
                }
              });
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          Spinner.hide();
        });
    }
  };

  return (
    <FixedContainer>
      <CustomHeader text={strings.register_parking_shared.title} />

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={{paddingTop: PADDING1}}>
        <PaddingHorizontalWrapper containerStyles={{gap: heightScale1(25)}} forDriveMe>
          <Image
            source={IMAGES.shared_banner_title}
            style={styles.shared_banner}
            resizeMode="contain"
            resizeMethod="resize"
          />

          <CustomInput
            title={strings.register_parking_shared.description}
            onChangeText={setDescription}
            value={description}
            placeholder={strings.register_parking_shared.place_holder_desc}
            maxLength={200}
          />

          <CustomInput
            title={strings.register_parking_shared.address}
            onChangeText={setAddress}
            value={address}
            placeholder={strings.register_parking_shared.place_holder_address}
            maxLength={200}
          />

          <CustomInput
            title={strings.register_parking_shared.rate}
            onChangeText={setAmt}
            value={amt}
            placeholder={strings.register_parking_shared.place_holder_rate}
            maxLength={200}
          />

          <CustomInput
            title={strings.register_parking_shared.num_of_parking}
            onChangeText={setSpace}
            value={space}
            placeholder={strings.register_parking_shared.place_holder_num_parking}
            maxLength={3}
            keyboardType="number-pad"
          />

          <CustomInput
            title={strings.register_parking_shared.operating_time}
            onChangeText={setRuntime}
            value={runtime}
            placeholder={strings.register_parking_shared.place_holder_example_time}
          />

          <CustomInput
            title={strings.register_parking_shared.sales_day}
            onChangeText={setSellTime}
            value={sellTime}
            placeholder={strings.register_parking_shared.place_holder_sale_day}
          />

          <CustomInput
            title={strings.register_parking_shared.phone_number}
            onChangeText={setPnum}
            value={pnum}
            placeholder={strings.register_parking_shared.place_holder_phone_number}
            maxLength={11}
            keyboardType="number-pad"
          />

          <View>
            <CustomText
              string={strings.register_parking_shared.rule_upload_photo}
              textStyle={styles.customTextStyle}
            />
            <CustomText
              string={strings.register_parking_shared.rule_upload_subtitle}
              textStyle={styles.subtitleTextStyle}
            />
            <RegisterParkingSharedImageList
              image1={image1}
              image2={image2}
              image3={image3}
              image4={image4}
              setImage1={setImage1}
              setImage2={setImage2}
              setImage3={setImage3}
              setImage4={setImage4}
              style={{marginTop: PADDING_HEIGHT / 2}}
            />
          </View>
        </PaddingHorizontalWrapper>
      </KeyboardAwareScrollView>

      <PaddingHorizontalWrapper
        containerStyles={{marginTop: heightScale(35), marginBottom: 30}}
        forDriveMe>
        <CustomButton text="신청하기" buttonHeight={58} onPress={onSave} />
      </PaddingHorizontalWrapper>

      <RegisterParkingSharedModal ref={regisParkingSharedMapRef} />
    </FixedContainer>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    height: heightScale(50),
  },
  title: {
    flex: 1,
  },
  textInput: {
    width: '100%',
    minHeight: heightScale(40),
    fontSize: fontSize(12),
  },
  btnPmonth: {
    width: widthScale(40),
    height: heightScale(40),
  },
  inputBorder: {
    flex: 1,
    marginRight: widthScale(5),
    borderColor: colors.gray,
    borderWidth: 1,
    fontSize: fontSize(12),
    height: '100%',
    paddingLeft: widthScale(5),
  },
  cellStyle: {
    paddingHorizontal: widthScale(5),
    paddingVertical: heightScale(2),
  },
  footer: {},
  content: {
    flex: 1,
    paddingHorizontal: PADDING / 2,
  },
  button: {
    width: widthScale(150),
    height: heightScale(40),
    borderRadius: widthScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  shared_banner: {
    width: '100%', // 가로를 부모 뷰에 맞춤
    height: undefined,
    aspectRatio: 669 / 151, // 이미지의 가로 세로 비율 설정
  },
  customTextStyle: {
    fontFamily: 'Pretendard', // Pretendard 폰트 적용
    fontSize: 14, // 14px 폰트 사이즈
    fontWeight: '500', // Medium(500) 폰트 굵기
    lineHeight: 19.6, // 19.6px 라인 높이
    textAlign: 'left', // 텍스트 중앙 정렬
  },
  subtitleTextStyle: {
    fontFamily: 'Pretendard', // Pretendard 폰트 적용
    fontSize: 14, // 14px 폰트 사이즈
    fontWeight: '500', // Medium(500) 폰트 굵기
    lineHeight: 19.6, // 19.6px 라인 높이
    textAlign: 'left', // 텍스트 왼쪽 정렬
    color: '#6F6F6F', // 텍스트 색상 설정
  },
});

export default RegisterParkingShared;
