import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {memo, useCallback} from 'react';
import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';
import HStack from '~components/h-stack';
import {ICONS} from '~/assets/images-path';
import {width} from '~constants/constant';
import {heightScale} from '~styles/scaling-utils';
import {ROUTE_KEY} from '~navigators/router';
import {useAppSelector} from '~store/storeHooks';
import {showMessage} from 'react-native-flash-message';

interface Props {
  tabProps: MaterialTopTabBarProps;
}

const ParkingInfoSharingTab: React.FC<Props> = memo(props => {
  const {tabProps} = props;
  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const {descriptors, navigation, state} = tabProps;

  const getTabIcon = useCallback((index: number, focusIndex: number) => {
    const isFocused = index === focusIndex;

    switch (index) {
      case 0:
        if (isFocused) {
          return ICONS.review_tap1_ov;
        } else {
          return ICONS.review_tap1_off;
        }
      case 1:
        if (isFocused) {
          return ICONS.review_tap2_ov;
        } else {
          return ICONS.review_tap2_off;
        }
      case 2:
        if (isFocused) {
          return ICONS.review_tap3_ov;
        } else {
          return ICONS.review_tap3_off;
        }
      default:
        if (isFocused) {
          return ICONS.review_tap4_ov;
        } else {
          return ICONS.review_tap4_off;
        }
    }
  }, []);

  return (
    <HStack>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];

        const onPress = (index: number) => {
          if (index === 3) {
            if (!userToken || !userToken.password) {
              showMessage({
                message: '로그인이 필요합니다.',
              });
              navigation.navigate(ROUTE_KEY.Login);
            } else {
              navigation.navigate(ROUTE_KEY.ProfileManagement);
            }
          } else {
            navigation.navigate({name: route.name, merge: true} as any);
          }
        };

        return (
          <TouchableOpacity testID={options.tabBarTestID} onPress={() => onPress(index)}>
            <Image
              source={getTabIcon(index, state.index)}
              style={styles.tabIcon}
              resizeMode="stretch"
            />
          </TouchableOpacity>
        );
      })}
    </HStack>
  );
});

export default ParkingInfoSharingTab;

const styles = StyleSheet.create({
  tabIcon: {
    width: width / 4,
    height: heightScale(43),
  },
});
