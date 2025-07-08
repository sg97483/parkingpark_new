import {useNavigation} from '@react-navigation/native';
import React, {memo, useMemo} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {FONT_FAMILY} from '~constants/enum';
import {CarInsuranceInfo} from '~constants/types';
import {UseRootStackNavigation} from '~navigators/stack';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {getNumberWithCommas} from '~utils/numberUtils';

interface Props {
  driverInfo: CarInsuranceInfo | undefined;
  isLoading: boolean;
}

const SettlementMethod = memo((props: Props) => {
  const {driverInfo, isLoading} = props;
  const navigation = useNavigation<UseRootStackNavigation>();
  const userInfo = useAppSelector(state => state?.userReducer?.user);
  const mCharge = Number(userInfo?.chargeMoney) || 0;

  let mChargeSum = 0;
  if (userInfo?.usePointSumSklent) {
    mChargeSum = Number(userInfo?.usePointSumSklent);
  }

  let cancelCharge = 0;
  if (userInfo?.cancelPointSklent) {
    cancelCharge = Number(userInfo?.cancelPointSklent);
  }

  const userCharge = mCharge - mChargeSum + cancelCharge || 0;

  const calValue = useMemo(() => driverInfo?.calYN, [driverInfo?.calYN]);

  if (isLoading) {
    return (
      <View style={styles.loadingView}>
        <ActivityIndicator />
      </View>
    );
  }

  //   Credit card
  if (calValue === 'M') {
    return (
      <HStack>
        <View style={{flex: 1, gap: heightScale1(6)}}>
          <HStack style={styles.methodViewStyle}>
            <CustomText string="현재 정산 수단" forDriveMe family={FONT_FAMILY.SEMI_BOLD} />
          </HStack>
          <HStack style={{gap: widthScale1(4)}}>
            <Icons.Wallet width={widthScale1(16)} height={widthScale1(17)} />
            <CustomText string="계좌" forDriveMe family={FONT_FAMILY.MEDIUM} />
            <CustomText
              string={driverInfo?.bankName ?? ''}
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText}
            />
            <CustomText
              string={driverInfo?.bankNum ?? ''}
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText}
            />
          </HStack>
        </View>

        {/*<CustomButton
          text="변경하기"
          buttonHeight={38}
          borderRadiusValue={6}
          type="TERTIARY"
          outLine
          buttonStyle={styles.changeMethodButtonStyle}
          onPress={() => {
            navigation.navigate(ROUTE_KEY.DriverPaymentRegistration, {isEditPaymentMethod: true});
          }}
          textSize={FONT.CAPTION_6}
        />*/}
      </HStack>
    );
  }

  // In app
  if (calValue === 'C') {
    return (
      <HStack>
        <View style={{flex: 1, gap: heightScale1(6)}}>
          <HStack style={styles.methodViewStyle}>
            <CustomText string="현재 정산 수단" forDriveMe family={FONT_FAMILY.SEMI_BOLD} />
          </HStack>
          <HStack style={{gap: widthScale1(4)}}>
            <Icons.Coin width={widthScale1(16)} height={widthScale1(16)} />
            <CustomText string="충전금" forDriveMe family={FONT_FAMILY.MEDIUM} />
            <CustomText
              string="잔액"
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText}
            />
            <CustomText
              string={`${getNumberWithCommas(userCharge)}원`}
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText}
            />
          </HStack>
        </View>

        {/*<CustomButton
          text="변경하기"
          buttonHeight={38}
          borderRadiusValue={6}
          type="TERTIARY"
          outLine
          buttonStyle={styles.changeMethodButtonStyle}
          onPress={() => {
            navigation.navigate(ROUTE_KEY.DriverPaymentRegistration, {isEditPaymentMethod: true});
          }}
          textSize={FONT.CAPTION_6}
        />*/}
      </HStack>
    );
  }

  return null;
});

export default SettlementMethod;

const styles = StyleSheet.create({
  methodViewStyle: {
    gap: widthScale1(4),
  },
  changeMethodButtonStyle: {
    paddingHorizontal: widthScale1(10),
    minWidth: widthScale1(69),
  },
  loadingView: {
    minHeight: heightScale1(46),
    justifyContent: 'center',
  },
});
