import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {asyncComponent} from 'react-async-component';
import CustomTopTabItem from '~components/commons/custom-top-tab-item';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import LoadingComponent from '~components/loading-component';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';

const Tab = createMaterialTopTabNavigator();

const AsyncDriverRoute = asyncComponent({
  resolve: () =>
    new Promise<any>(resolve => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          return resolve(import('./driver-route'));
        }, 500);
      });
    }),
  LoadingComponent: () => {
    return <LoadingComponent />;
  },
});

const AsyncPassengerRoute = asyncComponent({
  resolve: () =>
    new Promise<any>(resolve => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          return resolve(import('./passenger-route'));
        }, 500);
      });
    }),
  LoadingComponent: () => {
    return <LoadingComponent />;
  },
});

const MyRoute = (props: RootStackScreenProps<'MyRoute'>) => {
  const {navigation} = props;

  return (
    <FixedContainer>
      <CustomHeader text="나의 출퇴근 경로" />

      <Tab.Navigator
        screenOptions={{
          lazy: true,
        }}
        sceneContainerStyle={{
          backgroundColor: colors.white,
        }}
        tabBar={props => <CustomTopTabItem {...props} />}>
        <Tab.Screen name="드라이버" component={AsyncDriverRoute} />
        <Tab.Screen name="탑승객" component={AsyncPassengerRoute} />
      </Tab.Navigator>
    </FixedContainer>
  );
};

export default MyRoute;
