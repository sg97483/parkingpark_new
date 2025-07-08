import {useNavigation} from '@react-navigation/native';
import React, {memo, useMemo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {PADDING1} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useGetListCouponQuery} from '~services/couponServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {getNumberWithCommas} from '~utils/numberUtils';

const MyCoupon: React.FC = memo(() => {
  const navigation = useNavigation<UseRootStackNavigation>();

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const {data: couponData} = useGetListCouponQuery({
    id: userToken?.id,
    pass: userToken?.password,
  });

  const userData = useAppSelector(state => state?.userReducer?.user);

  const mCharge = useMemo(() => {
    return Number(userData?.chargeMoney) || 0;
  }, [userData?.chargeMoney]);

  const mChargeSum = useMemo(() => {
    return Number(userData?.usePointSumSklent) || 0;
  }, [userData?.usePointSumSklent]);

  const mPoint = useMemo(() => {
    return Number(userData?.mpoint) || 0;
  }, [userData?.mpoint]);

  const usePoint = useMemo(() => {
    return Number(userData?.usePointSum) || 0;
  }, [userData?.usePointSum]);

  const cancelCharge = useMemo(() => {
    return Number(userData?.cancelPointSklent) || 0;
  }, [userData?.cancelPointSklent]);

  const cancelPoint = useMemo(() => {
    return Number(userData?.cancelPoint) || 0;
  }, [userData?.cancelPoint]);

  const userCharge = useMemo(() => {
    return mCharge - mChargeSum + cancelCharge;
  }, [mCharge, mChargeSum, cancelCharge]);

  const userPoint = useMemo(() => {
    return mPoint - usePoint + cancelPoint;
  }, [mPoint, usePoint, cancelPoint]);

  const isLogined = useMemo(() => {
    return userToken?.id && userToken?.password;
  }, [userToken]);

  return (
    <View style={styles.containerStyle}>
      <Pressable
        onPress={() => {
          if (!isLogined) {
            navigation.navigate(ROUTE_KEY.Login);
            showMessage({
              message: strings?.general_text?.login_first,
            });
          } else {
            navigation.navigate(ROUTE_KEY.ChargeManagement);
          }
        }}
        style={styles.menuWrapperStyle}>
        <Text style={styles.titleTextStylle}>충전금</Text>
        <Text numberOfLines={1} style={styles.valueTextStyle}>
          {!isLogined ? '-' : getNumberWithCommas(userCharge)}
          {strings.general_text.won}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          if (!isLogined) {
            navigation.navigate(ROUTE_KEY.Login);
            showMessage({
              message: strings?.general_text?.login_first,
            });
          } else {
            navigation.navigate(ROUTE_KEY.PointManagement);
          }
        }}
        style={[
          styles.menuWrapperStyle,
          {
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: colors.grayCheckBox,
          },
        ]}>
        <Text style={styles.titleTextStylle}>적립금</Text>
        <Text numberOfLines={1} style={styles.valueTextStyle}>
          {!isLogined ? '-' : getNumberWithCommas(userPoint)}
          {strings.general_text.won}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          if (!isLogined) {
            navigation.navigate(ROUTE_KEY.Login);
            showMessage({
              message: strings?.general_text?.login_first,
            });
          } else {
            navigation.navigate(ROUTE_KEY.CouponBox);
          }
        }}
        style={styles.menuWrapperStyle}>
        <Text style={styles.titleTextStylle}>쿠폰</Text>
        <Text numberOfLines={1} style={styles.valueTextStyle}>
          {!isLogined ? '-' : couponData?.length ? `${couponData?.length}` : '0'}장
        </Text>
      </Pressable>
    </View>
  );
});

export default MyCoupon;

const styles = StyleSheet.create({
  containerStyle: {
    marginHorizontal: PADDING1,
    marginBottom: heightScale1(10),
    paddingVertical: PADDING1,
    paddingHorizontal: widthScale1(10),
    backgroundColor: colors.lightGray,
    borderRadius: scale1(8),
    flexDirection: 'row',
  },
  menuWrapperStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleTextStylle: {
    fontFamily: FONT_FAMILY.MEDIUM,
    fontSize: fontSize1(13),
    color: colors.grayText,
    marginBottom: heightScale1(4),
  },
  valueTextStyle: {
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    fontSize: fontSize1(16),
    color: colors.menuTextColor,
  },
});
