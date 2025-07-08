import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import TitleTextinput from '~components/register-car-insurance-information/title-textinput';
import CustomText from '~components/custom-text';
import {heightScale, widthScale} from '~styles/scaling-utils';
import RadioButtonGroup, {
  RadioButtonRef,
} from '~components/register-car-insurance-information/radio-button-group';
import ButtonImage from '~components/setting-passenger/button-image';
import Button from '~components/button';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import {ImageProps} from '~constants/types';
import {strings} from '~constants/strings';
import ModalChooseDriverInsurance, {
  RefChooseDriverInsurance,
} from '~components/register-car-insurance-information/modal-choose-driver-insurance';
import {useAppSelector} from '~store/storeHooks';
import {
  useDriverInsurUpdateMutation,
  useReadMyDriverMutation,
  useUpdateImageUserMutation,
} from '~services/userServices';
import {clearCharacter, uploadImage} from '~utils/index';
import {colors} from '~styles/colors';
import Spinner from '~components/spinner';
import {RootStackScreenProps} from '~navigators/stack';
import {showMessage} from 'react-native-flash-message';

const RegisterCarInsuranceInformation = (
  props: RootStackScreenProps<'RegisterCarInsuranceInformation'>,
) => {
  const {navigation, route} = props;
  const userToken = useAppSelector(state => state?.userReducer?.userToken);
  const [carInsurance, setCarInsurance] = useState('');
  const [insuranceEnd, setInsuranceEnd] = useState('');
  const [amountIndemnity, setAmountIndemnity] = useState<string | number>('');
  const [photoInsurance, setPhotoInsurance] = useState<ImageProps>();
  const [isShowDriverInsurance, setIsShowDriverInsurance] = useState(false);
  const [driverInsurance, setDriverInsurance] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const imagePickerModalRef = useRef<ImagePickerModalRefs>(null);
  const radioButtonRef = useRef<RadioButtonRef>(null);
  const modalChooseDriverInsuranceRef = useRef<RefChooseDriverInsurance>(null);
  const carInsuranceRef = useRef<RefChooseDriverInsurance>(null);

  const [readMyDriver] = useReadMyDriverMutation();
  const [driverInsurUpdate] = useDriverInsurUpdateMutation();
  const [updateImageUser] = useUpdateImageUserMutation();

  useEffect(() => {
    setDisableSubmit(!carInsurance || !insuranceEnd || !amountIndemnity);
  }, [carInsurance, insuranceEnd, amountIndemnity]);

  useEffect(() => {
    setIsLoading(true);
    readMyDriver({memberId: userToken?.id + ''})
      .unwrap()
      .then(res => {
        setCarInsurance(res.insurCompany);
        setInsuranceEnd(res.insurEndDate);
        setAmountIndemnity(clearCharacter(res?.insurPropertyAmt, ','));
        setDriverInsurance(res?.insurDriverName);
        setSubscriptionStatus(res.insurPersonalAmt == 'Y');
        setIsShowDriverInsurance(res.insurDriverYN == 'Y');
        setPhotoInsurance({uri: res?.insurImageUrl} as any);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const setImageToLib = (img: ImageProps) => {
    setPhotoInsurance(img);
  };

  const onChangeTextAmount = (text: any) => {
    if (!text) {
      setAmountIndemnity('');
      return;
    }
    setAmountIndemnity(text?.replaceAll(',', ''));
  };

  const onPressChooseHaveDriverInsurance = (item: string) => {
    const text = strings.register_car_insurance_information.subscription_status[0];
    if (item === text) {
      setIsShowDriverInsurance(true);
      modalChooseDriverInsuranceRef.current?.show();
    } else {
      setIsShowDriverInsurance(false);
    }
  };

  const chooseItemDriverInsurance = (text: string) => {
    switch (text) {
      case '1억':
        return setAmountIndemnity('100000000');
      case '2억':
        return setAmountIndemnity('200000000');
      case '3억':
        return setAmountIndemnity('300000000');
      case '5억':
        return setAmountIndemnity('500000000');
      case '10억':
        return setAmountIndemnity('1000000000');
      default:
        return setAmountIndemnity('100000000');
    }
  };

  const onPressSubmit = async () => {
    Spinner.show();
    await driverInsurUpdate({
      insurDriverYN: isShowDriverInsurance ? 'Y' : 'N',
      insurPersonalAmt: subscriptionStatus ? 'Y' : 'N',
      insurDriverName: isShowDriverInsurance ? driverInsurance : ' 미가입',
      memberId: userToken?.id?.toString(),
      insurCompany: carInsurance,
      insurEndDate: insuranceEnd,
      insurPropertyAmt: amountIndemnity.toString(),
    })
      .unwrap()
      .then(async isSuccess => {
        if (isSuccess) {
          showMessage({message: '저장 성공'});
        }
        if (isSuccess && photoInsurance?.fileName) {
          await uploadImage(photoInsurance?.uri!, 'Insurance', userToken?.id!, url => {
            updateImageUser({
              url: 'sDriver/updateDriverImageInsur',
              c_memberId: userToken.id?.toString(),
              insurImageUrl: url,
            })
              .unwrap()
              .then(res => {
                if (res) {
                  showMessage({
                    message: '이미지 저장완료. 업로드지연시간으로 즉시 확인 안될수있음.',
                  });
                } else {
                  showMessage({message: '이미지 등록에 실패하였습니다..'});
                }
                navigation.goBack();
                Spinner.hide();
              });
          });
        } else {
          Spinner.hide();
          navigation.goBack();
        }
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
      <CustomHeader text={strings.register_car_insurance_information.title} />
      <ScrollView>
        <TitleTextinput
          onPress={() => carInsuranceRef.current?.show()}
          title={strings.register_car_insurance_information.car_insurance_company}
          value={carInsurance}
          placeholder={strings.register_car_insurance_information.car_insurance_company_placeholder}
        />
        <TitleTextinput
          title={'보험종료일'}
          value={insuranceEnd}
          placeholder={'직접 입력해주세요. ex) 20241225'}
          onChangeText={setInsuranceEnd}
        />
        <CustomText string="[종합보험 가입 여부]" textStyle={styles.textTitle} />
        <TitleTextinput
          isFormatNumber
          title={'대물 배상 금액'}
          value={amountIndemnity}
          placeholder={'직접 입력해주세요.'}
          onChangeText={onChangeTextAmount}
          onPress={() => {}}
        />

        <RadioButtonGroup
          style={styles.radioButtonGroup}
          ref={radioButtonRef}
          data={strings.register_car_insurance_information.arr_amount_of_indemnity}
          onPressItem={chooseItemDriverInsurance}
        />

        <CustomText string="대인 배상Ⅱ 가입여부" textStyle={styles.textTitle} />
        <View style={styles.viewRadio}>
          <RadioButtonGroup
            chooseData={subscriptionStatus ? 0 : 1}
            style={styles.radioButtonGroup}
            ref={radioButtonRef}
            data={strings.register_car_insurance_information.subscription_status}
          />
        </View>
        <CustomText string="운전자 보험 가입 여부" textStyle={styles.textTitle} />
        <View style={styles.viewRadio}>
          <RadioButtonGroup
            onPressItem={onPressChooseHaveDriverInsurance}
            style={styles.radioButtonGroup}
            data={strings.register_car_insurance_information.subscription_status}
            chooseData={isShowDriverInsurance ? 0 : 1}
          />
        </View>
        {isShowDriverInsurance && (
          <TitleTextinput
            onPress={modalChooseDriverInsuranceRef.current?.show}
            isFormatNumber
            title={'운전자 보험 입력'}
            placeholder={'선택 해주세요.'}
            value={driverInsurance}
          />
        )}
        <CustomText string="보험증 사진첨부 *" textStyle={styles.textTitle2} />

        <ButtonImage
          style={styles.img}
          onPress={() => imagePickerModalRef.current?.show()}
          text={'보험증 사진(필수)'}
          uri={photoInsurance?.uri!}
        />
      </ScrollView>

      <Button
        disable={disableSubmit}
        text="저장"
        onPress={onPressSubmit}
        color={disableSubmit ? colors.gray : undefined}
        borderColor={disableSubmit ? colors.gray : undefined}
      />

      <ImagePickerModal ref={imagePickerModalRef} onImage={setImageToLib} />
      <ModalChooseDriverInsurance
        chooseItem={setDriverInsurance}
        ref={modalChooseDriverInsuranceRef}
      />
      <ModalChooseDriverInsurance chooseItem={setCarInsurance} ref={carInsuranceRef} />
    </FixedContainer>
  );
};

export default RegisterCarInsuranceInformation;

const styles = StyleSheet.create({
  textTitle: {
    marginHorizontal: widthScale(10),
    marginTop: heightScale(25),
  },
  textTitle2: {
    marginHorizontal: widthScale(50),
    marginTop: heightScale(20),
  },
  radioButtonGroup: {
    marginHorizontal: widthScale(10),
    marginTop: heightScale(5),
  },
  viewRadio: {
    width: '40%',
  },
  img: {
    width: widthScale(300),
    height: heightScale(200),
    alignSelf: 'center',
    marginBottom: heightScale(30),
  },
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});
