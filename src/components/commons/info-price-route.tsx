import React, {memo, useMemo} from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {getNumberWithCommas} from '~utils/numberUtils';

interface Props {
  price: string;
  originalPrice?: string | undefined;
  soPrice?: string;
  hideChevron?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  isUsageHistory?: boolean;
  completePayment?: boolean;
  carpoolPrice?: boolean;
  cancelPayment?: boolean;
  driverCarpoolHistory?: boolean;
  penaltyCarpool?: boolean;
  isRegistrationCompleted?: boolean;
  type?: 'FOR_DRIVER' | 'FOR_PASSENGER';
}

const InfoPriceRoute = (props: Props) => {
  const {
    price,
    soPrice,
    hideChevron,
    style,
    onPress,
    isRegistrationCompleted,
    isUsageHistory = false,
    originalPrice,
    completePayment,
    carpoolPrice,
    cancelPayment,
    driverCarpoolHistory,
    type,
    penaltyCarpool,
  } = props;

  // price 값 확인
  console.log(price);

  const textPrice = useMemo(() => {
    if (penaltyCarpool) {
      return '패널티금액';
    }
    if (cancelPayment) {
      return '취소수수료';
    }
    if (carpoolPrice) {
      return '카풀 결제금액';
    }

    if (isRegistrationCompleted) {
      return '카풀요청 금액';
    }

    if (completePayment || driverCarpoolHistory) {
      if (type === 'FOR_PASSENGER') {
        return '카풀금액';
      }
      return '정산금액';
    }

    if (soPrice) {
      return '도착지까지 카풀요청금액';
    }
    if (isUsageHistory) {
      return '결제금액';
    }

    return '카풀 요청금액';
  }, [
    cancelPayment,
    carpoolPrice,
    completePayment,
    soPrice,
    isUsageHistory,
    type,
    penaltyCarpool,
    driverCarpoolHistory,
    isRegistrationCompleted,
  ]);

  return (
    <Pressable onPress={onPress}>
      <HStack style={[styles.containerStyle, style]}>
        <View
          style={{
            gap: heightScale1(4),
          }}>
          {/* stop over price */}
          {!!Number(soPrice) && (
            <HStack style={styles.menuStyle}>
              <CustomText
                family={FONT_FAMILY.MEDIUM}
                forDriveMe
                color={colors.grayText}
                string="경유지까지 카풀요청금액"
              />
              <CustomText
                forDriveMe
                family={FONT_FAMILY.SEMI_BOLD}
                size={FONT.CAPTION_8}
                string={`${getNumberWithCommas(soPrice)}원`}
              />
            </HStack>
          )}

          {/* price */}
          <HStack style={styles.menuStyle}>
            {originalPrice ? (
              <CustomText
                string={`${getNumberWithCommas(originalPrice)}`}
                forDriveMe
                family={FONT_FAMILY.MEDIUM}
                textStyle={{
                  textDecorationLine: 'line-through',
                }}
                color={colors.lineCancel}
              />
            ) : (
              <CustomText
                family={FONT_FAMILY.MEDIUM}
                forDriveMe
                color={colors.grayText}
                string={textPrice}
              />
            )}

            <CustomText
              forDriveMe
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.CAPTION_8}
              string={`${getNumberWithCommas(price)}원`}
            />
          </HStack>
        </View>

        {hideChevron ? null : (
          <Icons.ChevronRight width={widthScale1(16)} height={widthScale1(16)} />
        )}
      </HStack>
    </Pressable>
  );
};

export default memo(InfoPriceRoute);

const styles = StyleSheet.create({
  containerStyle: {
    gap: widthScale1(6),
    alignSelf: 'flex-end',
  },
  menuStyle: {
    gap: widthScale1(8),
    alignSelf: 'flex-end',
  },
});
