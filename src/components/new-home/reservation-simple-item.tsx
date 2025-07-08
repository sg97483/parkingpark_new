import {StyleSheet, TouchableOpacity, View, Platform} from 'react-native'; // 🚩 Platform import 추가
import React, {memo} from 'react';
import {PaymentHistoryProps} from '~constants/types';
import HStack from '~components/h-stack';
import CustomText from '~components/custom-text';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {PADDING} from '~constants/constant';
import {colors} from '~styles/colors';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {getDayName} from '~utils/hourUtils';
import moment from 'moment';
import {getNumberWithCommas} from '~utils/numberUtils';
import {strings} from '~constants/strings';

interface Props {
  item: PaymentHistoryProps;
  onItemPress: () => void;
}

const ReservationSimpleItem: React.FC<Props> = memo(props => {
  const {item, onItemPress} = props;

  const totalAmount = Number(item?.amt) + Number(item?.usePoint) + Number(item?.usePointSklent);

  // 🚩 [수정] 불필요한 View를 제거하고 HStack에 직접 통합된 스타일을 적용합니다.
  return (
    <HStack style={styles.container}>
      <View style={styles.leftContainer}>
        <CustomText
          string={`${moment(item?.authDate, 'YYMMDDHHmmss').format('YY.MM.DD')} (${getDayName(
            moment(item?.authDate, 'YYMMDDHHmmss').valueOf(),
          )})`}
          color={colors.darkGray}
        />
        <CustomText
          string={item?.parkNm}
          family={FONT_FAMILY.BOLD}
          textStyle={{
            marginVertical: PADDING / 4,
          }}
        />
        <CustomText string={item?.TotalTicketType} />
        <CustomText string={item?.agCarNumber} color={colors.darkGray} />
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity style={styles.buttonWrpper} onPress={onItemPress}>
          <CustomText string="예약" color={colors.white} />
        </TouchableOpacity>
        <CustomText
          string={`${getNumberWithCommas(totalAmount)}${strings?.general_text?.won}`}
          family={FONT_FAMILY.BOLD}
          size={FONT.BODY}
        />
      </View>
    </HStack>
  );
});

export default ReservationSimpleItem;

const styles = StyleSheet.create({
  // 🚩 [수정] shadowContainer와 contentWrapper를 합친 새로운 container 스타일
  container: {
    // 기존 contentWrapper 스타일
    backgroundColor: colors.white,
    padding: PADDING,
    borderRadius: widthScale(8),
    alignItems: 'flex-start',
    // 기존 shadowContainer 스타일
    marginBottom: PADDING,
    // 플랫폼별 분기 스타일
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
      },
      android: {
        elevation: 4,
        borderColor: '#E0E0E0', // 안드로이드 렌더링 보장을 위한 얇은 테두리
        borderWidth: 1,
      },
    }),
  },
  leftContainer: {
    flex: 1,
    marginRight: PADDING / 2,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  buttonWrpper: {
    backgroundColor: colors.red1,
    width: widthScale(60),
    minHeight: heightScale(35),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: PADDING / 3,
    borderRadius: widthScale(4),
  },
});
