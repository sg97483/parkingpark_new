import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {memo} from 'react';
import {asyncComponent} from 'react-async-component';
import CustomTopTabItem from '~components/commons/custom-top-tab-item';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import LoadingComponent from '~components/loading-component';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';

const Tab = createMaterialTopTabNavigator();

const AsyncFavoriteParking = asyncComponent({
  resolve: () =>
    new Promise<any>(resolve => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          return resolve(import('./favorite-parking'));
        }, 500);
      });
    }),
  LoadingComponent: () => {
    return <LoadingComponent />;
  },
});

const AsyncFavoriteDriver = asyncComponent({
  resolve: () =>
    new Promise<any>(resolve => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          return resolve(import('./favorite-driver'));
        }, 500);
      });
    }),
  LoadingComponent: () => {
    return <LoadingComponent />;
  },
});

const AsyncFavoritePassenger = asyncComponent({
  resolve: () =>
    new Promise<any>(resolve => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          return resolve(import('./favorite-passenger'));
        }, 500);
      });
    }),
  LoadingComponent: () => {
    return <LoadingComponent />;
  },
});

const Favorites = memo((props: RootStackScreenProps<'Favorites'>) => {
  return (
    <FixedContainer>
      <CustomHeader text="즐겨찾기" />

      <Tab.Navigator
        tabBar={props => <CustomTopTabItem {...props} />}
        screenOptions={{
          lazy: true,
        }}
        sceneContainerStyle={{
          backgroundColor: colors.white,
        }}>
        <Tab.Screen name="주차" component={AsyncFavoriteParking} />
        <Tab.Screen name="드라이버" component={AsyncFavoriteDriver} />
        <Tab.Screen name="탑승객" component={AsyncFavoritePassenger} />
      </Tab.Navigator>
    </FixedContainer>
  );
});

export default Favorites;
