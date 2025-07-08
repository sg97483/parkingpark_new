import React, {memo} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ParkingInfoSharingTab from '~components/parking-info-sharing/parking-info-sharing-tab';
import ParkingInfoSharingAllTab from '~components/parking-info-sharing/parking-info-sharing-all-tab';
import ParkingInfoSharingLocationTab from '~components/parking-info-sharing/parking-info-sharing-location-tab';
import ParkingInfoSharingReviewTab from '~components/parking-info-sharing/parking-info-sharing-review-tab';
import ParkingInfoSharingProfileTab from '~components/parking-info-sharing/parking-info-sharing-profile-tab';

const Tab = createMaterialTopTabNavigator();

const ParkingInfoSharing = memo((props: RootStackScreenProps<'ParkingInfoSharing'>) => {
  return (
    <FixedContainer>
      <CustomHeader text="주차장 정보 공유" />
      <Tab.Navigator
        screenOptions={{
          lazy: true,
          swipeEnabled: false,
        }}
        tabBar={props => <ParkingInfoSharingTab tabProps={props} />}>
        <Tab.Screen name="ALL" component={ParkingInfoSharingAllTab} />
        <Tab.Screen name="LOCATION" component={ParkingInfoSharingLocationTab} />
        <Tab.Screen name="REVIEW" component={ParkingInfoSharingReviewTab} />
        <Tab.Screen name="PROFILE" component={ParkingInfoSharingProfileTab} />
      </Tab.Navigator>
    </FixedContainer>
  );
});

export default ParkingInfoSharing;
