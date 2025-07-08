import storage from '@react-native-firebase/storage';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {BackHandler, Keyboard, KeyboardAvoidingView, ScrollView, View} from 'react-native';
import AppModal from '~components/app-modal';
import CustomButton from '~components/commons/custom-button';
import CustomInput from '~components/commons/custom-input';
import SelectBox from '~components/commons/select-box';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import AttachImage from '~components/driver-register/attach-image';
import BottomInsuranceCompany, {
  ModalInsuranceCompanyRefs,
} from '~components/driver-register/bottom-insurance-company';
import FixedContainer from '~components/fixed-container';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import MenuTextBoxRadius from '~components/menu-text-border-radius';
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
  useDriverInsurUpdateMutation,
  useLazyReadMyDriverQuery,
  useUpdateDriverAuthMutation,
  useUpdateDriverInsuranceImageMutation,
} from '~services/userServices';
import {useAppDispatch} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {getNumberWithCommas, getStringWithoutCommas} from '~utils/numberUtils';

const DriverInsuranceRegistration = (
  props: RootStackScreenProps<'DriverInsuranceRegistration'>,
) => {
  const {navigation} = props;
  const text = strings.register_car_insurance_information;

  const dispatch = useAppDispatch();
  const {myDriverInfo, userID, CMemberID} = userHook();
  const [updateDriverInsurance] = useDriverInsurUpdateMutation();
  const [updateDriverInsuranceImage] = useUpdateDriverInsuranceImageMutation();
  const [updateDriverAuth] = useUpdateDriverAuthMutation();

  const [textAmount, setTextAmount] = useState<string>(myDriverInfo?.insurPropertyAmt || '');

  const reverseAmountProperty = useMemo(() => {
    switch (textAmount) {
      case '100000000':
        return '1억';
      case '200000000':
        return '2억';
      case '300000000':
        return '3억';
      case '500000000':
        return '5억';
      case '1000000000':
        return '10억';
      default:
        return '';
    }
  }, [textAmount]);

  const [selectAmount, setSelectAmount] = useState<string>(reverseAmountProperty);
  useEffect(() => {
    setSelectAmount(reverseAmountProperty);
  }, [reverseAmountProperty]);

  const [selectedSub, setSelectedSub] = useState<string>(
    myDriverInfo?.insurDriverYN
      ? myDriverInfo?.insurDriverYN === 'Y'
        ? text.subscription_status[0]
        : text.subscription_status[1]
      : text.subscription_status[0],
  );

  const [selectedStatus, setSelectedStatus] = useState<string>(
    myDriverInfo?.insurPersonalAmt
      ? myDriverInfo?.insurPersonalAmt === 'Y'
        ? text.subscription_status[0]
        : text.subscription_status[1]
      : text.subscription_status[0],
  );

  // convert status yes or no
  const statusYorN = useCallback(
    (text: string) => {
      switch (text) {
        case '가입':
          return 'Y';
        default:
          return 'N';
      }
    },
    [selectedStatus, selectedSub],
  );
  // selected insurance company
  const [selectedInsuranceCompany, setInsuranceCompany] = useState<string>(
    myDriverInfo?.insurCompany || '',
  );

  const [expiredDate, setExpiredDate] = useState<string>(
    (myDriverInfo?.insurEndDate as string) || '',
  );

  const bottomInsuranceCompanyRefs = useRef<ModalInsuranceCompanyRefs>(null);

  // back handler - android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });

    return () => backHandler.remove();
  }, []);

  // image picker refs
  const imgPickerRefs = useRef<ImagePickerModalRefs>(null);
  const [imgInsurance, setImgInsurance] = useState<string>(myDriverInfo?.insurImageUrl || '');
  const [readMyDriverInfo] = useLazyReadMyDriverQuery();

  const amountProperty = useCallback(
    (text: string) => {
      switch (text) {
        case '1억':
          return '100000000';
        case '2억':
          return '200000000';
        case '3억':
          return '300000000';
        case '5억':
          return '500000000';
        case '10억':
          return '1000000000';
        default:
          return text;
      }
    },
    [selectAmount],
  );

  const disable = useMemo(
    () => !!imgInsurance && !!expiredDate && !!selectedInsuranceCompany && !!textAmount,
    [
      imgInsurance,
      expiredDate,
      selectAmount,
      selectedSub,
      selectedStatus,
      selectedInsuranceCompany,
      textAmount,
    ],
  );

  const handleSelectedAmount = (item: string) => {
    setSelectAmount(item);
    setTextAmount(amountProperty(item));
  };

  const handleSelectedSubscription = (item: string) => {
    setSelectedSub(item);
  };

  const handleSelectedStatus = (item: string) => {
    setSelectedStatus(item);
  };

  // HANDLE UPLOAD IMAGE
  const handleUploadImage = async () => {
    if (imgInsurance) {
      const url = IS_IOS ? imgInsurance?.replace('file://', '') : imgInsurance;

      const storageImg = storage().ref(`/Insurance/${userID}`);

      await storageImg.putFile(url as string);

      return await storageImg.getDownloadURL();
    } else {
      return '';
    }
  };

  const isUrlFirebaseStorage = useMemo(() => {
    const insurance = imgInsurance?.includes('https://firebasestorage.googleapis.com');

    return insurance;
  }, [imgInsurance]);

  // handle on Submit
  const handleOnSubmit = async () => {
    Spinner.show();

    updateDriverAuth({authYN: 'N', memberId: userID?.toString()})
      .unwrap()
      .then(res => {});

    updateDriverInsurance({
      memberId: userID?.toString(),
      insurCompany: selectedInsuranceCompany,
      insurEndDate: expiredDate,
      insurPropertyAmt: amountProperty(textAmount),
      insurPersonalAmt: statusYorN(selectedStatus),
      insurDriverYN: statusYorN(selectedSub),
    })
      .unwrap()
      .then(async res => {
        if (!isUrlFirebaseStorage) {
          const insuranceUrl = await handleUploadImage();
          await updateDriverInsuranceImage({
            c_memberId: CMemberID?.toString(),
            insurImageUrl: insuranceUrl,
          })
            .unwrap()
            .then(res => {
              console.log('🚀 ~ file: driver-insurance-registration.tsx:123 ~ .then ~ res:', res);
            });
        }

        // update driver profile
        readMyDriverInfo({
          memberId: userID?.toString(),
        })
          .unwrap()
          .then(res => {
            dispatch(cacheMyDriverInfo(res));
          })
          .finally(() => {
            Spinner.hide();
            navigation.goBack();
          });
      });
  };

  return (
    <FixedContainer edges={['top', 'bottom']}>
      <CustomHeader
        text={text.title}
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

      <KeyboardAvoidingView style={{flex: 1}} behavior={IS_IOS ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false}>
          <PaddingHorizontalWrapper containerStyles={{marginBottom: heightScale1(38)}} forDriveMe>
            <SelectBox
              title={strings.driver_register.car_insurance_company}
              value={selectedInsuranceCompany}
              placeholderText="보험사를 선택해주세요."
              onPress={() => {
                Keyboard.dismiss();
                bottomInsuranceCompanyRefs.current?.show();
              }}
            />

            <View style={{marginTop: heightScale1(20)}}>
              <CustomInput
                title={strings.driver_register.expired_insurance_date}
                placeholder="0000-00-00"
                value={expiredDate}
                onChangeText={setExpiredDate}
                mask={[/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>

            <View style={{marginTop: heightScale1(40)}}>
              <CustomText
                string={strings.driver_register.insurance_registration}
                family={FONT_FAMILY.SEMI_BOLD}
                size={FONT.CAPTION_8}
                color={colors.menuTextColor}
                lineHeight={fontSize1(25)}
              />

              <MenuTextBoxRadius
                data={text.arr_amount_of_indemnity}
                title={strings.driver_register.property_compensation_amount}
                onPress={handleSelectedAmount}
                selected={selectAmount}
                containerStyle={{marginTop: heightScale1(30)}}
                isInput
                textValue={getNumberWithCommas(textAmount)}
                placeholderTextInput="대물 배상 금액을 입력해주세요."
                onChangeText={value => {
                  const oriText = getStringWithoutCommas(value);
                  setTextAmount(oriText);
                }}
              />

              <MenuTextBoxRadius
                data={text.subscription_status}
                title={strings.driver_register.status_private_insurance}
                onPress={handleSelectedStatus}
                selected={selectedStatus}
                containerStyle={{marginTop: heightScale1(30)}}
              />

              <MenuTextBoxRadius
                data={text.subscription_status}
                title={strings.driver_register.insurance_driver_history}
                onPress={handleSelectedSubscription}
                selected={selectedSub}
                containerStyle={{marginTop: heightScale1(30)}}
              />

              <AttachImage
                title={strings.driver_register.attach_insurance_card}
                textAttachment="보험증 사진을 첨부해주세요."
                containerStyle={{marginTop: heightScale1(30)}}
                onPress={() => {
                  Keyboard.dismiss();
                  imgPickerRefs.current?.show();
                }}
                image={imgInsurance}
              />
            </View>
          </PaddingHorizontalWrapper>
        </ScrollView>

        <PaddingHorizontalWrapper containerStyles={{marginVertical: PADDING1 / 2}} forDriveMe>
          <CustomButton
            text={'등록하기'}
            onPress={handleOnSubmit}
            buttonHeight={58}
            disabled={!disable}
          />
        </PaddingHorizontalWrapper>
      </KeyboardAvoidingView>

      <BottomInsuranceCompany
        ref={bottomInsuranceCompanyRefs}
        onSelected={name => setInsuranceCompany(name)}
      />

      <ImagePickerModal
        ref={imgPickerRefs}
        onImage={(image: ImageProps) => setImgInsurance(image.uri)}
      />
    </FixedContainer>
  );
};

export default DriverInsuranceRegistration;
