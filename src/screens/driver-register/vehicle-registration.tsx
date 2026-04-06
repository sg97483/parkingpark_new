import React, {useCallback, useMemo, useState} from 'react';
import {DeviceEventEmitter, StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppModal from '~components/app-modal';
import CustomButton from '~components/commons/custom-button';
import CustomInput from '~components/commons/custom-input';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {EMIT_EVENT} from '~constants/enum';
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
import {heightScale1} from '~styles/scaling-utils';

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
  const disabled = useMemo(
    () => !!carModel && !!carNumber && !!carYear,
    [carModel, carNumber, carYear],
  );

  const handleOnSubmit = async () => {
    await updateDriverAuth({authYN: 'N', memberId: userID?.toString()});

    updateCarInfo({
      carColor: carColor,
      carModel: carModel,
      carCompany: carCompany,
      carNumber: normalizeCarNumber(carNumber),
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
    await addNewCar({
      carColor: carColor,
      carModel: carModel,
      carCompany: carCompany,
      carNumber: normalizeCarNumber(carNumber),
      carYear: carYear,
      memberId: userToken?.id,
    });
    if (isAddNewCar) {
      navigation.goBack();
    }
  }, [carColor, carModel, carCompany, carNumber, carYear, userToken?.id]);

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
