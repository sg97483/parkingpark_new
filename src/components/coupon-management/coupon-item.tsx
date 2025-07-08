import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING} from '~constants/constant';
import {FONT, FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import {strings} from '~constants/strings';
import {CouponProps} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {getNumberWithCommas} from '~utils/numberUtils';

interface Props {
  item: CouponProps;
}

const CouponItem: React.FC<Props> = memo(props => {
  const {item} = props;

  const getCouponStatus = () => {
    const scoupon = item?.c_number?.substring(0, 2);

    if (item?.c_check === IS_ACTIVE.YES) {
      if (scoupon === 'TM') {
        return '등록완료(개인정보관리 확인가능)';
      } else {
        return '사용완료';
      }
    }

    return '사용가능';
  };

  return (
    <View style={styles.container}>
      <HStack>
        <View style={{flex: 1}}>
          <HStack style={styles.content}>
            <View style={styles.labalWrapper}>
              <CustomText
                string="쿠폰명"
                color={colors.darkGray}
                family={FONT_FAMILY.SEMI_BOLD}
                size={FONT.CAPTION}
              />
            </View>
            <CustomText string={item?.c_name} family={FONT_FAMILY.SEMI_BOLD} />
          </HStack>
          <HStack style={styles.content}>
            <View style={styles.labalWrapper}>
              <CustomText
                string="쿠폰번호"
                color={colors.darkGray}
                family={FONT_FAMILY.SEMI_BOLD}
                size={FONT.CAPTION}
              />
            </View>
            <CustomText string={item?.c_number} family={FONT_FAMILY.BOLD} />
          </HStack>
          <HStack style={styles.content}>
            <View style={styles.labalWrapper}>
              <CustomText
                string="할인금액"
                color={colors.darkGray}
                family={FONT_FAMILY.SEMI_BOLD}
                size={FONT.CAPTION}
              />
            </View>
            <CustomText
              string={`${getNumberWithCommas(Number(item?.c_price))}${strings?.general_text?.won}`}
              family={FONT_FAMILY.BOLD}
            />
          </HStack>
          <HStack>
            <View style={styles.labalWrapper}>
              <CustomText
                string="쿠폰상태"
                color={colors.darkGray}
                family={FONT_FAMILY.SEMI_BOLD}
                size={FONT.CAPTION}
              />
            </View>
            <CustomText string={getCouponStatus()} family={FONT_FAMILY.BOLD} />
          </HStack>
        </View>
      </HStack>

      <View
        style={[
          styles.redView,
          {
            backgroundColor: item?.c_check === IS_ACTIVE.YES ? `${colors.heavyGray}90` : colors.red,
          },
        ]}
      />
    </View>
  );
});

export default CouponItem;

const styles = StyleSheet.create({
  container: {
    minHeight: heightScale(130),
    marginHorizontal: PADDING,
    marginTop: PADDING,
    justifyContent: 'center',
    paddingHorizontal: PADDING + widthScale(5),
    paddingVertical: PADDING / 2,
    backgroundColor: colors.white,
    borderRadius: PADDING / 2,
    // overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  labalWrapper: {
    minWidth: widthScale(60),
  },
  content: {
    marginBottom: heightScale(5),
  },
  redView: {
    backgroundColor: 'red',
    position: 'absolute',
    right: -1,
    top: 0,
    bottom: 0,
    width: widthScale(20),
    borderTopRightRadius: PADDING / 2,
    borderBottomRightRadius: PADDING / 2,
  },
});
