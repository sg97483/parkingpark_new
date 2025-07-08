import React, {memo} from 'react';
import {ScrollView} from 'react-native';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import InfoCar from '~components/route-to-stopover-registration-completed/info-car';
import VehicleInformation from '~components/route-to-stopover-registration-completed/vehicle-information';
import {PADDING1} from '~constants/constant';
import {IS_ACTIVE} from '~constants/enum';
import {RootStackScreenProps} from '~navigators/stack';
import {heightScale1} from '~styles/scaling-utils';

const DriverProfileCarInformation = memo(
  (props: RootStackScreenProps<'DriverProfileCarInformation'>) => {
    const {navigation, route} = props;
    const {authYN, carColor, carImages, carModel, carNumber, carYear} =
      route?.params?.carInfomation;

    console.log('🚀 ~ route?.params?.carInfomation:', route?.params?.carInfomation);

    return (
      <FixedContainer edges={['top']}>
        <CustomHeader text="차량정보" />

        <ScrollView
          contentContainerStyle={{
            paddingTop: PADDING1,
            gap: heightScale1(40),
          }}
          showsVerticalScrollIndicator={false}>
          <InfoCar
            isLock={authYN === IS_ACTIVE.NO}
            carNumber={carNumber}
            vehicleModel={carModel}
            vehicleColor={carColor}
            vehicleYear={carYear}
          />

          <VehicleInformation carImages={carImages} isLock={authYN === IS_ACTIVE.NO} />
        </ScrollView>
      </FixedContainer>
    );
  },
);

export default DriverProfileCarInformation;
