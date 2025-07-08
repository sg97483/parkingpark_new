import storage from '@react-native-firebase/storage';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Keyboard, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppModal from '~components/app-modal';
import CustomBoxSelectButton from '~components/commons/custom-box-select-button';
import CustomButton from '~components/commons/custom-button';
import CustomInput, {CustomInputRefs} from '~components/commons/custom-input';
import SelectBox from '~components/commons/select-box';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import AttachImage from '~components/driver-register/attach-image';
import AttachImage2 from '~components/driver-register/attach-image';
import BottomSheetPostcode, {
  ModalBottomPostcodeRefs,
} from '~components/driver-register/bottom-sheet-postcode';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import Spinner from '~components/spinner';
import {IS_IOS, PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ImageProps} from '~constants/types';
import {userHook} from '~hooks/userHook';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheMyDriverInfo} from '~reducers/userReducer';
import {
  useDriverLicenseUpdateMutation,
  useLazyReadMyDriverQuery,
  useUpdateDriverAuthMutation,
  useUpdateLicenseImageMutation,
  useUpdateProfileImageMutation,
} from '~services/userServices';
import {useAppDispatch} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

import axios from 'axios';
import RNFS from 'react-native-fs';

const license_types = ['2종보통', '1종보통', '1종대형'];

const DriverLicenseRegistration = (props: RootStackScreenProps<'DriverLicenseRegistration'>) => {
  const text = strings.driver_register;

  const {navigation} = props;

  const dispatch = useAppDispatch();

  const {myDriverInfo, userID, CMemberID} = userHook();

  const [updateDriverAuth] = useUpdateDriverAuthMutation();
  const [updateDriverLicense] = useDriverLicenseUpdateMutation();
  const [updateLicenseImage] = useUpdateLicenseImageMutation();
  const [updateProfileImage] = useUpdateProfileImageMutation();
  const [getDriverProfile] = useLazyReadMyDriverQuery();

  // image picker
  const [imgLicense, setImgLicense] = useState<string>(myDriverInfo?.licenseImageUrl || '');
  const [document, setDocument] = useState<string>(myDriverInfo?.profileImageUrl || '');
  const imgPickerRefs = useRef<ImagePickerModalRefs>(null);
  const chooseLicense = useRef<boolean>();
  const [selectLicenseType, setSelectLicenseType] = useState<string>(
    myDriverInfo?.licenseKind || license_types[0],
  );

  const [selectedLicenseNumber, setSelectedLicenseNumber] = useState<string>(
    myDriverInfo?.licenseAuthNum?.slice(0, 2) || '',
  );
  const [licenseAuthNumber, setLicenseAuthNumber] = useState<string>(
    (myDriverInfo?.licenseAuthNum?.slice(
      2,
      myDriverInfo?.licenseAuthNum?.length as number,
    ) as string) || '',
  );
  const [licenseEndDate, setLicenseEndDate] = useState<string>(myDriverInfo?.licenseEndDate || '');
  const [licenseNum, setLicenseNum] = useState<string>(myDriverInfo?.licenseNum || '');
  const [jumin, setJumin] = useState<string>(myDriverInfo?.jumin || '');
  const [focusJumin, setFocusJumin] = useState<boolean>(false);

  const inputLicenseEndDate = useRef<CustomInputRefs>(null);
  const inputSerialNumber = useRef<CustomInputRefs>(null);

  // disable
  const disable = useMemo(
    () =>
      !(
        imgLicense?.length > 0 &&
        document?.length > 0 &&
        selectedLicenseNumber?.length > 0 &&
        selectLicenseType?.length > 0 &&
        licenseAuthNumber?.length > 0 &&
        licenseEndDate?.length > 0 &&
        licenseNum?.length > 0 &&
        jumin?.length > 0
      ),
    [
      imgLicense,
      document,
      selectedLicenseNumber,
      selectLicenseType,
      licenseAuthNumber,
      licenseEndDate,
      licenseNum,
      jumin,
    ],
  );

  const modalPostcodeRef = useRef<ModalBottomPostcodeRefs>(null);

  const handleSelectLicenseNumber = useCallback((item: string) => {
    setSelectedLicenseNumber(item);
  }, []);

  const isUrlFirebaseStorage = useMemo(() => {
    const license = imgLicense?.includes('https://firebasestorage.googleapis.com');
    const profile = document?.includes('https://firebasestorage.googleapis.com');

    return license && profile;
  }, [imgLicense, document]);

  // handle submit
  const handleOnSubmit = async () => {
    Spinner.show();

    updateDriverAuth({authYN: 'N', memberId: userID?.toString()})
      .unwrap()
      .then(res => {});

    updateDriverLicense({
      memberId: userID?.toString(),
      licenseAuthNum: selectedLicenseNumber + licenseAuthNumber,
      licenseEndDate: licenseEndDate,
      licenseKind: selectLicenseType,
      licenseNum: licenseNum,
      jumin: jumin,
    })
      .unwrap()
      .then(async res => {
        if (!isUrlFirebaseStorage) {
          Promise.all([
            handleUploadImageFirebase(imgLicense, 'License'),
            handleUploadImageFirebase(document, 'Profile'),
          ]).then(async res => {
            const licenseUrl = res[0];

            const profileUrl = res[1];

            // update license image
            await updateLicenseImage({
              licenseImageUrl: licenseUrl,
              c_memberId: CMemberID?.toString(),
            })
              .unwrap()
              .then(res => {});

            // update profile image
            await updateProfileImage({
              c_memberId: CMemberID?.toString(),
              profileImageUrl: profileUrl,
            })
              .unwrap()
              .then(res => {})
              .finally(async () => {
                await getDriverProfile({
                  memberId: userID?.toString(),
                })
                  .unwrap()
                  .then(res => {
                    console.log(
                      '🚀 ~ file: driver-license-registration.tsx:196 ~ handleOnSubmit ~ res:',
                      res?.licenseImageUrl,
                    );
                    dispatch(cacheMyDriverInfo(res));
                  })
                  .finally(() => {
                    navigation.goBack();
                    Spinner.hide();
                  });
              });
          });
        } else {
          // cache driver profile
          await getDriverProfile({
            memberId: userID?.toString(),
          })
            .unwrap()
            .then(res => {
              console.log(
                '🚀 ~ file: driver-license-registration.tsx:196 ~ handleOnSubmit ~ res:',
                res?.licenseImageUrl,
              );
              dispatch(cacheMyDriverInfo(res));
            })
            .finally(() => {
              navigation.goBack();
              Spinner.hide();
            });
        }
      });
  };

  // handle upload image
  const handleUploadImage = async (image: ImageProps) => {
    if (chooseLicense.current) {
      setImgLicense(image.uri);

      // 이미지 OCR 서비스 호출
      if (image) {
        try {
          const clientSecret = 'eXBhZ2hTWWdndE52RHVoVmdJV1BUWHVaSWloUXFtSEU=';
          const url =
            'https://3f9n62n7xr.apigw.ntruss.com/custom/v1/28300/8d1609fd4ee1bdfa032f70b90a0e63a88a55eae37111019ba3ef8377cae0d23d/document/id-card';

          // 이미지 파일 이름 추출
          const imageName = image.uri.split('/').pop(); // 파일 이름 추출
          const imageData = await RNFS.readFile(image.uri, 'base64'); // 이미지 파일의 내용을 비동기적으로 읽어옴

          console.log('이미지이름:', imageName); // 주소를 콘솔에 출력

          const response = await axios.post(
            url,
            {
              version: 'V2',
              requestId: 'uuid',
              timestamp: new Date().getTime(),
              images: [
                {
                  format: 'jpg',
                  data: imageData, // 이미지 파일 내용을 전송
                  name: 'demo',
                },
              ],
            },
            {
              headers: {
                'X-OCR-SECRET': clientSecret,
                'Content-Type': 'application/json; charset=utf-8',
              },
            },
          );

          console.log('이미지이름2:', imageName); // 주소를 콘솔에 출력

          //$license_kind = trim($response_obj->images[0]->idCard->result->dl->type[0]->text);
          //$license_number = trim($response_obj->images[0]->idCard->result->dl->num[0]->text);
          //$resident_registration_number = str_replace('-', '', $response_obj->images[0]->idCard->result->dl->personalNum[0]->text);
          //$renew_end_date = str_replace(' ', '', $response_obj->images[0]->idCard->result->dl->renewEndDate[0]->text);
          //$serial_number = trim($response_obj->images[0]->idCard->result->dl->code[0]->text);

          // OCR 응답에서 주소 추출하여 상태 업데이트
          const license_kind = response.data?.images[0]?.idCard?.result?.dl?.type[0]?.text || '';
          const license_number = response.data?.images[0]?.idCard?.result?.dl?.num[0]?.text || '';
          //const resident_registration_number = response.data?.images[0]?.idCard?.result?.dl?.personalNum[0]?.text || '';
          const resident_registration_number =
            response.data?.images[0]?.idCard?.result?.dl?.personalNum[0]?.text.replace(/-/g, '') ||
            '';

          const renew_end_date =
            response.data?.images[0]?.idCard?.result?.dl?.renewEndDate[0]?.text || '';
          const serial_number = response.data?.images[0]?.idCard?.result?.dl?.code[0]?.text || '';

          const license_number_full =
            response.data?.images[0]?.idCard?.result?.dl?.num[0]?.text || ''; // 전체 라이선스 번호
          const license_number_short = license_number_full.substring(0, 2); // 앞에 두 자리만 추출
          const license_number_rest = license_number_full.substring(3);
          //const license_number_rest = license_number_full.substring(2).replace(/-/g, ''); // 앞 두 자리를 제외한 나머지 값 추출 후 '-' 제거

          console.log('라이선스 번호 (전체):', license_number_full);
          console.log('라이선스 번호 (앞 두 자리만):', license_number_short);
          console.log('라이선스 번호 (앞 두 자리를 제외한 나머지):', license_number_rest);

          let [resident_registration_number_first, resident_registration_number_second] =
            resident_registration_number.split('-');

          console.log('주민등록번호 (앞 6자리):', resident_registration_number_first);
          console.log('주민등록번호 (뒷 7자리):', resident_registration_number_second);

          //if (license_kind) {
          //  setSelectLicenseType(license_kind);
          //  console.log('면허증종류:', license_kind); // 주소를 콘솔에 출력
          //}

          if (license_number_short) {
            setSelectedLicenseNumber(license_number_short); // 변수의 값을 변경
            console.log('면허앞번호:', license_number_short); // 주소를 콘솔에 출력
          }

          if (license_number_rest) {
            setLicenseNum(license_number_rest);
            console.log('면허뒷번호:', license_number_rest); // 주소를 콘솔에 출력
          }

          if (resident_registration_number) {
            setJumin(resident_registration_number);
            console.log('주민번호:', resident_registration_number); // 주소를 콘솔에 출력
          }

          //if (resident_registration_number_first) {
          //  setJumin(resident_registration_number_first);
          //  console.log('주민번호앞번호:', resident_registration_number_first); // 주소를 콘솔에 출력
          //}

          //if (resident_registration_number_second) {
          //  setJumin(resident_registration_number_second);
          //  console.log('주민번호뒷번호:', resident_registration_number_second); // 주소를 콘솔에 출력
          //}

          if (renew_end_date) {
            setLicenseEndDate(renew_end_date);
            console.log('면허만료일:', renew_end_date); // 주소를 콘솔에 출력
          }

          if (serial_number) {
            setLicenseAuthNumber(serial_number);
            console.log('일련번호:', serial_number); // 주소를 콘솔에 출력
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    } else {
      setDocument(image.uri);
    }
  };

  // handle upload firebase storage
  const handleUploadImageFirebase = async (image: string, baseUrl: string) => {
    const isUrlFirebaseStorage =
      baseUrl === 'License'
        ? imgLicense?.includes('https://firebasestorage.googleapis.com')
        : document?.includes('https://firebasestorage.googleapis.com');

    const img = baseUrl === 'License' ? imgLicense : document;

    if (img) {
      if (isUrlFirebaseStorage) {
        if (baseUrl === 'License') {
          return imgLicense;
        } else {
          return document;
        }
      } else {
        const url = IS_IOS ? image?.replace('file://', '') : image;
        const storageImg = storage().ref(`/${baseUrl}/${userID}`);
        await storageImg.putFile(url as string);
        return await storageImg.getDownloadURL();
      }
    } else {
      return '';
    }
  };

  return (
    <FixedContainer edges={['top', 'bottom']}>
      <CustomHeader
        text={text.sign_up_driver_license}
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

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        style={{paddingTop: heightScale1(5)}}
        showsVerticalScrollIndicator={false}>
        <PaddingHorizontalWrapper containerStyles={{gap: widthScale1(10)}} forDriveMe>
          <CustomText
            string={'드라이버 승인을 위해\n운전면허를 등록해주세요'}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_8}
            color={colors.menuTextColor}
            textStyle={{marginTop: heightScale1(10)}}
            lineHeight={heightScale1(30)}
            forDriveMe
          />

          <CustomText
            string={
              '이미지 등록후 입력란 데이터가 자동으로 등록됩니다.\n정보가 정확하지 않으면 직접 수정해주세요'
            }
            family={FONT_FAMILY.REGULAR}
            size={FONT.CAPTION_6}
            textStyle={{textAlign: 'left'}}
            color={colors.grayText}
            lineHeight={fontSize1(20)}
            forDriveMe
          />

          {/* attach image */}
          <AttachImage2
            textAttachment={'면허증 앞면이 모두 나오도록 등록해주세요.'}
            onPress={() => {
              chooseLicense.current = true;
              Keyboard.dismiss();

              imgPickerRefs.current?.show();
            }}
            image={imgLicense}
            title={''}
          />

          <CustomText
            string={text.license_type}
            size={FONT.CAPTION_6}
            family={FONT_FAMILY.MEDIUM}
            color={colors.menuTextColor}
            lineHeight={fontSize1(20)}
            forDriveMe
          />
          <HStack style={{gap: widthScale1(10)}}>
            {license_types.map((item, index) => (
              <CustomBoxSelectButton
                key={index}
                text={item}
                onSelected={() => setSelectLicenseType(item)}
                selected={selectLicenseType === item ? true : false}
              />
            ))}
          </HStack>
        </PaddingHorizontalWrapper>

        <PaddingHorizontalWrapper containerStyles={{marginBottom: heightScale1(60)}} forDriveMe>
          <HStack
            style={{
              alignItems: 'flex-end',
              marginTop: heightScale1(20),
            }}>
            <SelectBox
              title={text.license_number}
              value={selectedLicenseNumber}
              onPress={() => {
                Keyboard.dismiss();
                modalPostcodeRef.current?.show();
              }}
              placeholderText={text.postCode}
              containerStyle={{minWidth: IS_IOS ? widthScale1(116) : widthScale1(115)}}
            />
            {/*
            <PostcodeInsuranceInput
              value={licenseAuthNumber}
              onChange={setLicenseAuthNumber}
              containerStyle={{marginLeft: widthScale1(10), flex: 1}}
              onPressKeyDone={() => {
                setFocusJumin(true);
              }}
            />*/}

            <CustomInput
              ref={inputSerialNumber}
              title={''}
              value={licenseNum}
              placeholder="00-000000-00"
              onChangeText={setLicenseNum}
              style={{marginLeft: heightScale1(10), flex: 1}}
            />
          </HStack>

          <View style={{marginTop: heightScale1(20)}}>
            <CustomInput
              maxLength={14}
              title={text.permanent_registration_number}
              placeholder="000000-0000000"
              value={jumin}
              onChangeText={setJumin}
              onSubmitEditing={() => {
                inputSerialNumber.current?.focusInput();
              }}
            />
          </View>

          {/* menu postcode */}

          {/*
          <MenuPostcodeInput
            title={text.permanent_registration_number}
            containerStyle={{marginTop: heightScale1(20)}}
            value={jumin}
            onChange={setJumin}
            isAutoFocused={focusJumin}
            onPressKeyDone={() => {
              setFocusJumin(false);
              inputLicenseEndDate.current?.focusInput();
            }}
          />*/}

          <View style={{marginTop: heightScale1(20)}}>
            <CustomInput
              ref={inputLicenseEndDate}
              maxLength={10}
              title={'면허만료일'}
              placeholder="0000-00-00"
              value={licenseEndDate}
              onChangeText={setLicenseEndDate}
              mask={[/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
              keyboardType="number-pad"
              onSubmitEditing={() => {
                inputSerialNumber.current?.focusInput();
              }}
            />
          </View>

          {/* serial number */}
          <CustomInput
            ref={inputSerialNumber}
            title={'일련번호'}
            placeholder="영문과 숫자 6자리 입력"
            value={licenseAuthNumber}
            onChangeText={setLicenseAuthNumber}
            style={{marginTop: heightScale1(20)}}
            maxLength={6}
          />

          {/* background image registration */}
          <AttachImage
            title={text.image_background_registration}
            containerStyle={{marginTop: heightScale1(20)}}
            textAttachment={'본인 인증을 위한 사진을 등록해주세요.'}
            onPress={() => {
              chooseLicense.current = false;
              Keyboard.dismiss();

              imgPickerRefs.current?.show();
            }}
            image={document}
          />
        </PaddingHorizontalWrapper>
      </KeyboardAwareScrollView>

      <PaddingHorizontalWrapper containerStyles={{marginVertical: PADDING1 / 2}}>
        <CustomButton
          buttonHeight={58}
          onPress={handleOnSubmit}
          text={'등록하기'}
          disabled={disable}
        />
      </PaddingHorizontalWrapper>

      <BottomSheetPostcode
        ref={modalPostcodeRef}
        selected={selectedLicenseNumber}
        onSelected={handleSelectLicenseNumber}
      />

      <ImagePickerModal ref={imgPickerRefs} onImage={handleUploadImage} />
    </FixedContainer>
  );
};

export default DriverLicenseRegistration;
