import {StyleSheet} from 'react-native';
import React, {useRef} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {strings} from '~constants/strings';
import {ScrollView} from 'react-native';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import MenuCarNumber from '~components/driver-register/menu-car-number';
import {heightScale, widthScale} from '~styles/scaling-utils';
import Button from '~components/button';
import {colors} from '~styles/colors';
import Plus from '~/assets/svgs/Plus';
import {ROUTE_KEY} from '~navigators/router';
import ModalConfirm, {ModalConfirmRefs} from '~components/modal-confirm';

const CarNumberManagement = (props: RootStackScreenProps<'CarNumberManagement'>) => {
  const {navigation, route} = props;

  const modalConfirmRef = useRef<ModalConfirmRefs>(null);

  // hanle navigate to vehicle registration
  const navToCarInformationRegistration = () => {
    navigation.navigate(ROUTE_KEY.VehicleRegistration);
  };

  return (
    <FixedContainer edges={['top', 'bottom']}>
      <CustomHeader
        text={strings.driver_register.car_number_management}
        onPressBack={() => modalConfirmRef.current?.show()}
      />

      <ScrollView style={{paddingTop: heightScale(20)}}>
        <PaddingHorizontalWrapper>
          <MenuCarNumber />
        </PaddingHorizontalWrapper>
      </ScrollView>

      <PaddingHorizontalWrapper containerStyles={{marginTop: 'auto'}}>
        <Button
          onPress={() => navigation.navigate(ROUTE_KEY.DriverRegister)}
          text={strings.driver_register.sign_up_your_car}
          style={{paddingVertical: heightScale(18), borderRadius: widthScale(8)}}
        />
        <Button
          onPress={() => navigation.navigate(ROUTE_KEY.VehicleRegistration)}
          text={strings.driver_register.sign_up_new_car}
          style={styles.btnAdd}
          textColor={colors.lineCancel}
          iconContent={<Plus width={widthScale(16.5)} height={heightScale(16.5)} />}
          textStyle={{paddingLeft: widthScale(4)}}
        />
      </PaddingHorizontalWrapper>

      <ModalConfirm ref={modalConfirmRef} onConfirm={navToCarInformationRegistration} />
    </FixedContainer>
  );
};

export default CarNumberManagement;

const styles = StyleSheet.create({
  btnAdd: {
    paddingVertical: heightScale(18),
    borderRadius: widthScale(8),
    flexDirection: 'row',
    marginTop: heightScale(10),
    backgroundColor: colors.white,
    borderColor: colors.disableButton,
  },
});
