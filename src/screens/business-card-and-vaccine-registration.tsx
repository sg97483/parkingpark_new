import storage from '@react-native-firebase/storage';
import React, {useEffect, useMemo, useRef, useState} from 'react';

import axios from 'axios';
import RNFS from 'react-native-fs';

import {
  BackHandler,
  DeviceEventEmitter,
  Keyboard,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Icons} from '~/assets/svgs';
import AppModal from '~components/app-modal';
import BottomSheetListOccupation from '~components/business-card-and-vaccine-registration/bottom-sheet-list-occupation';
import CustomButton from '~components/commons/custom-button';
import CustomInput from '~components/commons/custom-input';
import LineButton from '~components/commons/line-button';
import SelectBox from '~components/commons/select-box';
import ViewCardImage from '~components/commons/view-card-image';
import ViewCardImage2 from '~components/commons/view-card-image';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import Spinner from '~components/spinner';
import {IS_IOS, PADDING1, URL_COVID_GUIDE} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheMyDriverInfo} from '~reducers/userReducer';
import {useLazyGetMyRiderRoadQuery, useReadMyCarpoolInfoQuery} from '~services/carpoolServices';
import {
  useLazyReadMyDriverQuery,
  useReadMyDriverQuery,
  useUpdateCMemberInfoMutation,
  useUpdateDriverAuthMutation,
  useUpdateDriverImageBCMutation,
  useUpdateDriverImageRiderMutation,
  useUpdateDriverImageVCMutation,
  useUpdateMemberAuthMutation,
} from '~services/userServices';
import {useAppDispatch} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

const text = strings.business_card_and_vaccine_registration;

const BusinessCardAndVaccineRegistration = (
  props: RootStackScreenProps<'BusinessCardAndVaccineRegistration'>,
) => {
  const {navigation, route} = props;
  const isDriver = route.params?.isDriver;
  const {CMemberID, userID, myDriverInfo, user} = userHook();

  const dispatch = useAppDispatch();

  // api
  const [updateMemberAuth] = useUpdateMemberAuthMutation();
  const [updateDriverImageBc] = useUpdateDriverImageBCMutation();
  const [updateDriverImageVc] = useUpdateDriverImageVCMutation();
  const {data: dataDriver, refetch} = useReadMyDriverQuery({memberId: userID?.toString()});
  const [readMyDriver] = useLazyReadMyDriverQuery();
  const [updateDriverAuth] = useUpdateDriverAuthMutation();
  const [updateCMemberInfo] = useUpdateCMemberInfoMutation();
  const [updateDriverImageRider] = useUpdateDriverImageRiderMutation();
  const {data, isSuccess} = useReadMyCarpoolInfoQuery({memberId: userID as number});
  const [roadRider] = useLazyGetMyRiderRoadQuery();
  const bottomSheetListOccupationRef = useRef<any>(null);
  const imagePickerRef = useRef<ImagePickerModalRefs>(null);
  const chooseImageAuth = useRef<boolean>();
  const [occupation, setOccupation] = useState('');
  const [cardAuthentication, setCardAuthentication] = useState<any>(
    myDriverInfo?.bcImageUrl ? {uri: myDriverInfo?.bcImageUrl} : null,
  );
  const [vaccination, setVaccination] = useState<any>(
    myDriverInfo?.vaccineImageUrl ? {uri: myDriverInfo?.vaccineImageUrl} : null,
  );
  const [detailOccupation, setDetailOccupation] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');

  useEffect(() => {
    console.log('refetch data');
    dispatch(cacheMyDriverInfo(dataDriver as any));
  }, [refetch]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      setCompanyAddress(data?.coAddress && data?.coAddress !== 'null' ? data?.coAddress : '');
      setCompanyName(data?.coName && data?.coName !== 'null' ? data?.coName : '');
      setDetailOccupation(data?.job && data?.job !== 'null' ? data?.job : '');
      setOccupation(data?.jobType && data?.jobType !== 'null' ? data?.jobType : '');
    }
  }, [data, isSuccess]);

  const handleCancel = (haveIn: boolean, haveOut: boolean) => {
    if (haveIn && haveOut) {
      navigation.navigate(ROUTE_KEY.ParkingParkHome, {selectedTab: 1});
    } else {
      if (!haveIn && !haveOut) {
        navigation.navigate(ROUTE_KEY.DriverCommunicationRegistration, {isPassenger: true});
        return;
      }

      if (haveIn) {
        if (!haveOut) {
          navigation.replace(ROUTE_KEY.WayToWorkRegistration1, {isReturnRoute: true});
        }
      } else {
        navigation.replace(ROUTE_KEY.WayToWorkRegistration1, {isReturnRoute: false});
      }
    }
  };

  const disable = useMemo(
    () =>
      !occupation || !detailOccupation || !companyName || !companyAddress || !cardAuthentication,
    [cardAuthentication, occupation, detailOccupation, companyName, companyAddress],
  );
  const isVaccineUrlFirebaseStorage = useMemo(() => {
    const vaccine = vaccination?.uri?.includes('https://firebasestorage.googleapis.com');

    return vaccine;
  }, [vaccination]);

  const isCardAuthUrlFirebaseStorage = useMemo(() => {
    const cardAuth = cardAuthentication?.uri?.includes('https://firebasestorage.googleapis.com');

    return cardAuth;
  }, [cardAuthentication]);

  const uploadImage = async () => {
    if (isDriver) {
      if (cardAuthentication && !isCardAuthUrlFirebaseStorage) {
        const bcImageUrl = await uploadImageCardAuth();

        await updateDriverImageBc({
          c_memberId: CMemberID?.toString(),
          bcImageUrl: bcImageUrl,
        })
          .unwrap()
          .then(res => {});
      }

      if (vaccination && !isVaccineUrlFirebaseStorage) {
        const vaccineImageUrl = await uploadImageVaccine();

        await updateDriverImageVc({
          c_memberId: CMemberID?.toString(),
          vaccineImageUrl: vaccineImageUrl,
        })
          .unwrap()
          .then(() => {});
      }
    } else {
      await Promise.all([uploadImageCardAuth(), uploadImageVaccine()]).then(res => {
        const bcImageUrl = res[0];
        const vaccineImageUrl = res[1];

        updateDriverImageRider({
          c_memberId: CMemberID?.toString(),
          bcImageUrl: bcImageUrl,
          vaccineImageUrl: vaccineImageUrl,
        }).unwrap();
      });
    }
  };

  const uploadImageCardAuth = async () => {
    if (cardAuthentication) {
      if (isCardAuthUrlFirebaseStorage) {
        return cardAuthentication?.uri;
      } else {
        const mBitmap7 = IS_IOS
          ? cardAuthentication?.uri.replace('file://', '')
          : cardAuthentication?.uri;
        const storageRef7 = storage().ref(`Bc/${userID}`);
        await storageRef7.putFile(mBitmap7!);
        return await storageRef7.getDownloadURL();
      }
    } else {
      return '';
    }
  };

  const uploadImageVaccine = async () => {
    if (vaccination) {
      if (isVaccineUrlFirebaseStorage) {
        return vaccination?.uri;
      } else {
        const mBitmap6 = IS_IOS ? vaccination?.uri.replace('file://', '') : vaccination?.uri;
        const urlVc = `Vaccine/${userID}`;
        const storageRef6 = storage().ref(urlVc as string);
        await storageRef6.putFile(mBitmap6!);

        updateMemberAuth({authYN: 'A', memberId: userID?.toString()}).unwrap();
        return await storageRef6.getDownloadURL();
      }
    }
    return vaccination?.uri;
  };

  const onPressRegister = () => {
    Spinner.show();
    Promise.all([updateDataInfo(), uploadImage()]).finally(async () => {
      if (isDriver) {
        await updateDriverAuth({authYN: 'N', memberId: userID?.toString()}).unwrap();
        await readMyDriver({memberId: userID?.toString()})
          .unwrap()
          .then(res => {
            dispatch(cacheMyDriverInfo(res as any));
          })
          .finally(() => navigation.goBack());
      } else {
        await roadRider({memberId: userID!, id: CMemberID!}).then(({data}) => {
          const haveIn = !!(data?.startPlaceIn && data?.endPlaceIn);
          const haveOut = !!(data?.startPlaceOut && data?.endPlaceOut);
          handleCancel(haveIn, haveOut);
        });
      }
      Spinner.hide();
    });
  };

  const updateDataInfo = () => {
    updateCMemberInfo({
      memberId: userID,
      jobType: occupation,
      job: detailOccupation,
      coName: companyName,
      coAddress: companyAddress,
    })
      .unwrap()
      .then()
      .finally(() => {
        DeviceEventEmitter.emit(EMIT_EVENT.REFETCH_DATA_CARPOOL);
      });
  };

  return (
    <FixedContainer>
      <CustomHeader
        text={text.title}
        rightContent={
          !isDriver ? (
            <LineButton
              onPress={() => {
                roadRider({memberId: userID!, id: CMemberID!}).then(({data}) => {
                  const haveIn = !!(data?.startPlaceIn && data?.endPlaceIn);
                  const haveOut = !!(data?.startPlaceOut && data?.endPlaceOut);
                  handleCancel(haveIn, haveOut);
                });
              }}
              text={text.cancel}
            />
          ) : null
        }
        onPressBack={() => {
          if (isDriver) {
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
          } else {
            navigation.goBack();
          }
        }}
      />

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.view}>
        <CustomText
          string={'명함 인증을 위해 \n명함 이미지를 등록해주세요.'}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_8}
          color={colors.menuTextColor}
          textStyle={{marginTop: heightScale1(1)}}
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

        <ViewCardImage2
          onPress={() => {
            chooseImageAuth.current = true;
            Keyboard.dismiss();
            imagePickerRef.current?.show();
          }}
          title={''}
          content="명함을 등록해주세요."
          sourceImage={cardAuthentication}
        />

        <SelectBox
          title={text.occupation}
          value={occupation}
          placeholderText={text.placeholder_occupation}
          onPress={() => {
            Keyboard.dismiss();
            bottomSheetListOccupationRef.current?.show();
          }}
        />

        <CustomInput
          title={text.detail}
          onChangeText={setDetailOccupation}
          value={detailOccupation}
          placeholder={text.placeholder_detail}
        />

        <CustomInput
          onChangeText={setCompanyName}
          value={companyName}
          title={text.company_name}
          placeholder={text.placeholder_company_name}
        />

        <CustomInput
          onChangeText={setCompanyAddress}
          value={companyAddress}
          title={text.company_address}
          placeholder={text.placeholder_company_address}
        />

        <View style={{gap: heightScale1(10)}}>
          <ViewCardImage
            onPress={() => {
              chooseImageAuth.current = false;
              Keyboard.dismiss();
              imagePickerRef.current?.show();
            }}
            title="코로나 백신접종 증명서(선택)"
            subTitle="COOV앱내 공유버튼을 이용하여 접종확인카드 캡쳐하여 첨부 부탁드립니다."
            content="코로나 접종 카드 확인서를 등록해주세요."
            sourceImage={vaccination}
          />

          <Pressable onPress={() => Linking.openURL(URL_COVID_GUIDE)} style={styles.buttonQuestion}>
            <Icons.QuestionBorder />
            <CustomText
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText}
              string="첨부방법확인"
              lineHeight={heightScale1(20)}
            />
          </Pressable>
        </View>
      </KeyboardAwareScrollView>

      <CustomButton
        type="PRIMARY"
        disabled={disable}
        text={'등록하기'}
        buttonHeight={58}
        onPress={onPressRegister}
        buttonStyle={styles.confirmButtonStyle}
      />

      <BottomSheetListOccupation
        tick={occupation}
        onPressChoose={setOccupation}
        ref={bottomSheetListOccupationRef}
      />

      <ImagePickerModal
        ref={imagePickerRef}
        onImage={async image => {
          if (chooseImageAuth.current) {
            setCardAuthentication(image);

            // 이미지 OCR 서비스 호출

            if (image) {
              try {
                const clientSecret = 'emx1ZU5PWld2aHBVTWZ2c0doUlVFWFRrc2VaV2tycE8=';
                const url =
                  'https://3f9n62n7xr.apigw.ntruss.com/custom/v1/28370/e31aa57dc20b3bf6a6f5d2897a496f13702241b0d5c0298e0a96ac3abbb34df9/document/name-card';

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

                // OCR 응답에서 주소 추출하여 상태 업데이트
                const address = response.data?.images[0]?.nameCard?.result?.address[0]?.text || '';
                const department =
                  response.data?.images[0]?.nameCard?.result?.department[0]?.text || '';
                const position =
                  response.data?.images[0]?.nameCard?.result?.position[0]?.text || '';
                const bc_company =
                  response.data?.images[0]?.nameCard?.result?.company[0]?.text || '';

                if (address) {
                  setCompanyAddress(address);
                  console.log('회사주소:', address); // 주소를 콘솔에 출력
                }

                if (department) {
                  const combinedOccupation = `${department} / ${position}`;
                  setDetailOccupation(combinedOccupation);
                  console.log('직업파트:', combinedOccupation); // 주소를 콘솔에 출력
                }
                if (bc_company) {
                  setCompanyName(bc_company);
                  console.log('회사명:', bc_company); // 주소를 콘솔에 출력
                }
              } catch (error) {
                console.error('Error:', error);
              }
            }
          } else {
            setVaccination(image);
          }
        }}
      />
    </FixedContainer>
  );
};

export default BusinessCardAndVaccineRegistration;

const styles = StyleSheet.create({
  viewCancel: {
    borderBottomColor: colors.lineCancel,
    borderBottomWidth: 1,
    paddingBottom: heightScale1(1.2),
    marginRight: widthScale1(10),
  },
  view: {
    paddingHorizontal: PADDING1,
    paddingTop: heightScale1(10),
    gap: heightScale1(10),
    paddingBottom: heightScale1(38),
  },
  buttonQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: widthScale1(2),
  },
  confirmButtonStyle: {
    marginHorizontal: PADDING1,
    marginBottom: PADDING1 / 2,
    marginTop: heightScale1(10),
  },
});
