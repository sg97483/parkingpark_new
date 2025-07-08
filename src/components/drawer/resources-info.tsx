import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ICONS} from '~/assets/images-path';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {CouponProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {getNumberWithCommas} from '~utils/numberUtils';

interface Props {
  couponData: CouponProps[];
}

interface IPropsItem {
  icon: ImageSourcePropType;
  title: string;
  value: string;
  unit: string;
  style?: ViewStyle;
  onPress: () => void;
}

const RowItem = (props: IPropsItem) => {
  const {icon, title, value, unit, style, onPress} = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <HStack style={[{flex: 1, justifyContent: 'space-between'}, style]}>
        <HStack style={{flex: 1}}>
          <Image source={icon} style={styles.icon} resizeMode="contain" />
          <CustomText
            string={title}
            textStyle={{marginLeft: PADDING / 2, flex: 1}}
            family={FONT_FAMILY.SEMI_BOLD}
          />
        </HStack>

        <HStack>
          <CustomText
            string={value}
            textStyle={{marginRight: widthScale(2)}}
            color={colors.red}
            family={FONT_FAMILY.BOLD}
          />
          <CustomText
            string={unit}
            family={FONT_FAMILY.SEMI_BOLD}
            textStyle={{marginRight: widthScale(5)}}
          />
          <Icon name="chevron-right" size={widthScale(25)} color={colors.black} />
        </HStack>
      </HStack>
    </TouchableOpacity>
  );
};

const ResourcesInfo: React.FC<Props> = memo(props => {
  const {couponData} = props;

  const navigation: UseRootStackNavigation = useNavigation();

  const userData = useAppSelector(state => state?.userReducer?.user);

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const mCharge = Number(userData?.chargeMoney) || 0;

  let mChargeSum = 0;
  if (userData?.usePointSumSklent) {
    mChargeSum = Number(userData?.usePointSumSklent);
  }

  const mPoint = Number(userData?.mpoint) || 0;
  let usePoint = 0;
  if (userData?.usePointSum) {
    usePoint = Number(userData?.usePointSum);
  }

  let cancelCharge = 0;
  if (userData?.cancelPointSklent) {
    cancelCharge = Number(userData?.cancelPointSklent);
  }

  let cancelPoint = 0;
  if (userData?.cancelPoint) {
    cancelPoint = Number(userData?.cancelPoint);
  }

  const userCharge = mCharge - mChargeSum + cancelCharge || 0;
  const userPoint = mPoint - usePoint + cancelPoint;
  return (
    <View style={styles.container}>
      <RowItem
        icon={ICONS.monetization_on}
        title={strings.drawer.charge}
        value={getNumberWithCommas(userCharge)}
        unit={strings.general_text.won}
        onPress={() => {
          if (!userToken?.id || !userToken?.password) {
            navigation.navigate(ROUTE_KEY.Login);
            showMessage({
              message: strings?.general_text?.login_first,
            });
          } else {
            navigation.navigate(ROUTE_KEY.ChargeManagement);
          }
        }}
      />
      <RowItem
        icon={ICONS.group}
        title={strings.drawer.reserves}
        value={getNumberWithCommas(userPoint)}
        unit={strings.general_text.won}
        style={{marginTop: PADDING / 1.5}}
        onPress={() => {
          if (!userToken?.id || !userToken?.password) {
            navigation.navigate(ROUTE_KEY.Login);
            showMessage({
              message: strings?.general_text?.login_first,
            });
          } else {
            navigation.navigate(ROUTE_KEY.PointManagement);
          }
        }}
      />
      <RowItem
        icon={ICONS.local_activity}
        title={strings.drawer.coupon_box}
        value={couponData?.length ? `${couponData?.length}` : '0'}
        unit={'매'}
        style={{marginTop: PADDING / 1.5}}
        onPress={() => {
          if (!userToken?.id || !userToken?.password) {
            navigation.navigate(ROUTE_KEY.Login);
            showMessage({
              message: strings?.general_text?.login_first,
            });
          } else {
            navigation.navigate(ROUTE_KEY.CouponBox);
          }
        }}
      />
    </View>
  );
});

export default ResourcesInfo;

const styles = StyleSheet.create({
  container: {
    paddingVertical: PADDING,
    marginTop: PADDING / 2,
  },
  icon: {
    width: widthScale(25),
    height: heightScale(25),
    tintColor: colors.black,
    marginLeft: widthScale(5),
  },
});
