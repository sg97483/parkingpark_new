import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {memo, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import CustomTopTabItem from '~components/commons/custom-top-tab-item';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import {PADDING1} from '~constants/constant';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';
import DriverUsageHistory from './driver-usage-history';
import ParkingUsageHistory from './parking-usage-history';
import PassengerUsageHistory from './passenger-usage-history';

const Tab = createMaterialTopTabNavigator();

const UsageHistory = memo((props: RootStackScreenProps<'UsageHistory'>) => {
  const {navigation, route} = props;
  const focusTab = route?.params?.focusTab;

  const getInitialRoute = useMemo(() => {
    switch (focusTab) {
      case 1:
        return '주차';
      case 2:
        return '탑승객';
      case 3:
        return '드라이버';
      default:
        return '주차';
    }
  }, [focusTab]);

  return (
    <FixedContainer>
      <CustomHeader text="이용내역" />

      <Tab.Navigator
        initialRouteName={getInitialRoute}
        sceneContainerStyle={styles.containerStyle}
        tabBar={props => <CustomTopTabItem {...props} />}>
        <Tab.Screen name="주차" component={ParkingUsageHistory} />
        <Tab.Screen name="탑승객" component={PassengerUsageHistory} />
        <Tab.Screen name="드라이버" component={DriverUsageHistory} />
      </Tab.Navigator>
    </FixedContainer>
  );
});

export default UsageHistory;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: colors.white,
  },
  tabBarWrapperStyle: {
    paddingHorizontal: PADDING1,
  },
  tabBarStyle: {
    minHeight: heightScale1(44),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderBottomWidth: heightScale1(2),
  },
});
