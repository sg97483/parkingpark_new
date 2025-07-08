import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {memo, useCallback} from 'react';
import {View} from 'react-native';
import DrawerContent from '~components/drawer/drawer-content';
import Home from '~screens/home';
import {ROUTE_KEY} from './router';
import QuickActionMenuDiet from '~components/home/quick-action-menu-diet';

const Drawer = createDrawerNavigator();

const ParkingParkHome = memo(() => {
  const renderDrawer = useCallback(() => {
    return <DrawerContent />;
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}>
      <Drawer.Navigator
        screenOptions={{
          drawerType: 'front',
          drawerStyle: {
            width: '90%',
          },
        }}
        drawerContent={renderDrawer}>
        <Drawer.Screen
          name={ROUTE_KEY.Home}
          component={Home}
          options={{
            headerShown: false,
          }}
        />
      </Drawer.Navigator>

      {/* Quick Action menu  <QuickActionMenu />*/}
      <QuickActionMenuDiet />
    </View>
  );
});

export default ParkingParkHome;
