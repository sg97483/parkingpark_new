import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import CustomButton from '~components/commons/custom-button';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import MenuTextBoxRadius from '~components/menu-text-border-radius';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheMyDriverInfo} from '~reducers/userReducer';
import {
  useLazyReadMyDriverQuery,
  useUpdateDriverAuthMutation,
  useUpdateDriverStyleMutation,
} from '~services/userServices';
import {useAppDispatch} from '~store/storeHooks';
import {heightScale1} from '~styles/scaling-utils';
import {sleep} from '~utils/index';

const DriverFavoriteRegistration = (props: RootStackScreenProps<'DriverFavoriteRegistration'>) => {
  const text = strings.driver_register;
  const {navigation, route} = props;
  const dispatch = useAppDispatch();
  const {myDriverInfo, user, userID} = userHook();
  const [updateDriverAuth] = useUpdateDriverAuthMutation();

  const isDriverRoute = route.params?.isDriverRoute;

  const onStyles = (str: string) => {
    switch (str) {
      case 'A':
        return 0;
      case 'B':
        return 1;
      case 'C':
        return 2;
      case 'D':
        return 3;
      default:
        return 4;
    }
  };
  const listStyle = useCallback(() => {
    let number = [];
    let arr = myDriverInfo?.style as string;

    for (let index = 0; index < (arr.length as number); index++) {
      const str = onStyles(arr[index]);
      number.push(str);
    }

    const sGender = strings.driver_register.gender_data[number[0]];
    const sDrive = strings.driver_register.style_into_car_data[number[1]];
    const sGoPlane = strings.driver_register.go_plane_data[number[2]];
    const sRoutineDriver = strings.driver_register.routine_driver_data[number[3]];

    const arrStyle = [sGender, sDrive, sGoPlane, sRoutineDriver];

    return arrStyle;
  }, [myDriverInfo]);

  const initialArr = myDriverInfo?.style ? listStyle() : '';

  const [gender, setGender] = useState<string>(initialArr[0] || text.gender_data[0]);
  const [styleDriver, setStyleDriver] = useState<string>(
    initialArr[1] || text.style_into_car_data[0],
  );
  const [goPlane, setGoPlane] = useState<string>(initialArr[2] || text.go_plane_data[0]);
  const [routineDriver, setRoutineDriver] = useState<string>(
    initialArr[3] || text.routine_driver_data[0],
  );

  const [updateDriverStyle, {isLoading}] = useUpdateDriverStyleMutation();
  const [getDriverProfile] = useLazyReadMyDriverQuery();

  const selectStyle = (list: string[], style: string) => {
    const index = list.indexOf(style);

    switch (index) {
      case 1:
        return 'B';
      case 2:
        return 'C';
      case 3:
        return 'D';
      case 4:
        return 'E';
      default:
        return 'A';
    }
  };

  const handleSubmit = async () => {
    const sGender = selectStyle(text.gender_data, gender);
    const sDrive = selectStyle(text.style_into_car_data, styleDriver);
    const sGoPlane = selectStyle(text.go_plane_data, goPlane);
    const sRoutineDriver = selectStyle(text.routine_driver_data, routineDriver);

    const styles = sGender + sDrive + sGoPlane + sRoutineDriver;

    //if (!isDriverRoute) {
    //  updateDriverAuth({authYN: 'N', memberId: userID?.toString()}).unwrap();
    //}

    updateDriverStyle({
      memberId: myDriverInfo?.memberId?.toString(),
      style: styles,
    })
      .unwrap()
      .then(res => {
        getDriverProfile({
          memberId: user?.id.toString(),
        })
          .unwrap()
          .then(res => {
            dispatch(cacheMyDriverInfo(res));
          });
      })
      .finally(async () => {
        navigation.goBack();
        await sleep(200);
      });
  };

  return (
    <FixedContainer edges={['top', 'bottom']}>
      <CustomHeader text={'카풀 옵션 선택'} onPressBack={handleSubmit} />

      <ScrollView style={{paddingTop: heightScale1(20)}}>
        <PaddingHorizontalWrapper containerStyles={{gap: heightScale1(40)}}>
          <MenuTextBoxRadius
            data={text.gender_data}
            title={text.gender}
            onPress={setGender}
            selected={gender}
          />
          <MenuTextBoxRadius
            data={text.style_into_car_data}
            title={text.style_into_car}
            onPress={setStyleDriver}
            selected={styleDriver}
          />
          <MenuTextBoxRadius
            data={text.go_plane_data}
            title={text.go_plane}
            onPress={setGoPlane}
            selected={goPlane}
          />
          <MenuTextBoxRadius
            data={text.routine_driver_data}
            title={text.routine_driver}
            onPress={setRoutineDriver}
            selected={routineDriver}
          />
        </PaddingHorizontalWrapper>
      </ScrollView>

      <CustomButton
        buttonStyle={styles.submitButtonStyle}
        text={'등록하기'}
        onPress={handleSubmit}
        buttonHeight={58}
        isLoading={isLoading}
      />
    </FixedContainer>
  );
};

export default DriverFavoriteRegistration;

const styles = StyleSheet.create({
  submitButtonStyle: {
    marginHorizontal: PADDING1,
    marginBottom: PADDING1 / 2,
    marginTop: heightScale1(10),
  },
});
