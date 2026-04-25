import React, {useCallback, useMemo, useState} from 'react';
import {DeviceEventEmitter, StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppModal from '~components/app-modal';
import CustomButton from '~components/commons/custom-button';
import CustomInput from '~components/commons/custom-input';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheIsInitialAddNewCar} from '~reducers/userReducer';
import {
  useAddNewCarMutation,
  useGetMyRegisterdCarQuery,
  useUpdateCarUserMutation,
  useUpdateDriverAuthMutation,
} from '~services/userServices';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';
import {isValidCarNumber} from '~utils/isValidCarNumber';

const VehicleRegistration = (props: RootStackScreenProps<'VehicleRegistration'>) => {
  const {navigation, route} = props;
  const isAddNewCar = route?.params?.isAddNewCar;
  console.log('🚀 ~ VehicleRegistration ~ isAddNewCar:', isAddNewCar);
  const dispatch = useAppDispatch();
  const isInitialAddNewCar = useAppSelector(state => state.userReducer.isInitialAddCar);

  const text = strings.driver_register;
  const {userID, user, userToken} = userHook();
  const normalizeCarNumber = (value?: string | null) => `${value ?? ''}`.replace(/\s+/g, '');
  const [updateCarInfo, {isLoading}] = useUpdateCarUserMutation();
  const [updateDriverAuth] = useUpdateDriverAuthMutation();
  const [addNewCar, {isLoading: isAddingNewCar}] = useAddNewCarMutation();
  const {
    data: listCarRegistered,
    refetch,
    isUninitialized,
  } = useGetMyRegisterdCarQuery({
    memberId: userID as number,
  });
  const [carColor, setCarColor] = useState<string>(isAddNewCar ? '' : (user?.carColor ?? ''));
  const [carModel, setCarModel] = useState<string>(isAddNewCar ? '' : (user?.carModel ?? ''));
  const [carCompany, setCarCompany] = useState(
    isAddNewCar ? '' : (user?.carCompany?.trim()?.length as number) > 0 ? user?.carCompany : '',
  );
  const [carNumber, setCarNumber] = useState<string>(
    isAddNewCar ? '' : normalizeCarNumber(user?.carNumber),
  );
  const [carYear, setCarYear] = useState<string>(isAddNewCar ? '' : (user?.carYear ?? ''));
  const carNumberNormalized = useMemo(() => normalizeCarNumber(carNumber), [carNumber]);
  const carNumberInvalid = useMemo(() => {
    if (!carNumberNormalized) return false;
    return !isValidCarNumber(carNumberNormalized);
  }, [carNumberNormalized]);

  const disabled = useMemo(() => {
    return !!carModel && !!carNumberNormalized && !carNumberInvalid && !!carYear;
  }, [carModel, carNumberNormalized, carNumberInvalid, carYear]);

  const handleOnSubmit = async () => {
    if (carNumberInvalid) {
      AppModal.show({
        title: '차량번호 확인',
        content: '차량번호 형식이 올바르지 않습니다.\n예) 12가3456 / 123가4567',
      });
      return;
    }
    await updateDriverAuth({authYN: 'N', memberId: userID?.toString()});

    updateCarInfo({
      carColor: carColor,
      carModel: carModel,
      carCompany: carCompany,
      carNumber: carNumberNormalized,
      carYear: carYear,
      id: userToken?.id,
      pwd: userToken?.password,
    })
      .unwrap()
      .then(async res => {
        if (
          carModel &&
          carNumber &&
          carYear &&
          isInitialAddNewCar &&
          listCarRegistered?.length === 0
        ) {
          handleAddNewCar();
          dispatch(cacheIsInitialAddNewCar(false));
        }

        DeviceEventEmitter.emit(EMIT_EVENT.UPDATED_USER);
        navigation.goBack();
      });
  };

  const handleAddNewCar = useCallback(async () => {
    if (carNumberInvalid) {
      AppModal.show({
        title: '차량번호 확인',
        content: '차량번호 형식이 올바르지 않습니다.\n예) 12가3456 / 123가4567',
      });
      return;
    }
    await addNewCar({
      carColor: carColor,
      carModel: carModel,
      carCompany: carCompany,
      carNumber: carNumberNormalized,
      carYear: carYear,
      memberId: userToken?.id,
    }).unwrap();

    // 차량번호관리(목록) 화면에서 "대표차량 변경" 팝업을 재사용해 자동으로 띄우기 위한 이벤트
    DeviceEventEmitter.emit(EMIT_EVENT.PROMPT_SET_DEFAULT_CAR, {
      carNumber: carNumberNormalized,
    });

    // 다른 화면들의 차량 정보 갱신 트리거
    DeviceEventEmitter.emit(EMIT_EVENT.UPDATED_USER);
    DeviceEventEmitter.emit(EMIT_EVENT.UPDATED_CAR);
    if (isAddNewCar) {
      navigation.goBack();
    }
  }, [
    addNewCar,
    carColor,
    carCompany,
    carModel,
    carNumberInvalid,
    carNumberNormalized,
    carYear,
    isAddNewCar,
    navigation,
    userToken?.id,
  ]);

  return (
    <FixedContainer>
      <CustomHeader
        text={text.car_information_registration}
        onPressBack={() => {
          if (!isAddNewCar) {
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
        contentContainerStyle={{paddingTop: PADDING1}}>
        <PaddingHorizontalWrapper containerStyles={{gap: heightScale1(30)}} forDriveMe>
          <CustomInput
            title={text.number_car}
            onChangeText={value => setCarNumber(normalizeCarNumber(value))}
            value={carNumber}
            placeholder="11가1111"
            maxLength={10}
          />
          {carNumberInvalid ? (
            <CustomText
              forDriveMe
              size={FONT.CAPTION_2}
              family={FONT_FAMILY.SEMI_BOLD}
              color={colors.red1}
              string="차량번호 형식이 올바르지 않습니다. 예) 12가3456 / 123가4567"
            />
          ) : null}

          <CustomInput
            title={text.card_sample}
            onChangeText={setCarModel}
            value={carModel}
            placeholder="ex)아반떼"
            maxLength={10}
          />

          <CustomInput
            title={text.car_year}
            onChangeText={setCarYear}
            value={carYear}
            placeholder="ex)2021"
            maxLength={4}
            keyboardType="number-pad"
          />

          <CustomInput
            title={text.car_color}
            onChangeText={setCarColor}
            value={carColor}
            placeholder="ex)화이트"
            maxLength={10}
          />

          <CustomInput
            title={text.production}
            onChangeText={setCarCompany}
            value={carCompany as string}
            placeholder="ex)기아"
            maxLength={10}
          />
        </PaddingHorizontalWrapper>
      </KeyboardAwareScrollView>

      <CustomButton
        text={text.register}
        onPress={isAddNewCar ? handleAddNewCar : handleOnSubmit}
        disabled={!disabled}
        buttonHeight={58}
        buttonStyle={styles.submitButtonStyle}
        isLoading={isLoading || isAddingNewCar}
      />
    </FixedContainer>
  );
};

export default VehicleRegistration;

const styles = StyleSheet.create({
  submitButtonStyle: {
    marginBottom: PADDING1 / 2,
    marginTop: heightScale1(10),
    marginHorizontal: PADDING1,
  },
});
