import React, {memo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale, scale, widthScale} from '~styles/scaling-utils';
import {dayjs} from '~utils/dayjsUtil';

interface Props {
  date: string;
  style?: StyleProp<ViewStyle>;
}
const ReservationConfirm = (props: Props) => {
  const {date, style} = props;

  return (
    <View style={[styles.view, style]}>
      <View style={styles.view1}>
        <View style={styles.viewBlack}>
          <CustomText
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_4}
            string={'퇴근길'}
            color={colors.white}
          />
        </View>
        <CustomText
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.BODY}
          string={dayjs(date).format('YYYY.MM.DD(월)')}
        />
      </View>

      <View style={styles.viewCenter}>
        <View style={styles.viewTime}>
          <CustomText
            textStyle={styles.text20}
            size={FONT.CAPTION_6}
            color={colors.lineCancel}
            string={'07:30'}
          />

          <View>
            <CustomText
              textStyle={styles.viewArrival}
              size={FONT.CAPTION_4}
              family={FONT_FAMILY.SEMI_BOLD}
              color={colors.lineCancel}
              string={'예상도착'}
            />
            <CustomText
              textStyle={styles.text20}
              size={FONT.CAPTION_6}
              color={colors.lineCancel}
              string={'08:08'}
            />
          </View>
        </View>

        <View style={styles.viewLine}>
          <View style={styles.border} />
          <View style={styles.line} />
          <View style={styles.borderBlack} />
        </View>

        <View style={styles.view2}>
          <CustomText textStyle={styles.text20} size={FONT.CAPTION_6} string={'출발지'} />
          <CustomText textStyle={styles.text20To} size={FONT.CAPTION_6} string={'도착지'} />
        </View>
      </View>

      <View style={styles.viewBottom}>
        <CustomText
          string="결제금액"
          color={colors.blackGray}
          size={FONT.BODY}
          family={FONT_FAMILY.SEMI_BOLD}
        />
        <CustomText string={`${'13,000'}원`} size={FONT.CAPTION_8} family={FONT_FAMILY.SEMI_BOLD} />
      </View>
    </View>
  );
};

export default memo(ReservationConfirm);
const styles = StyleSheet.create({
  viewCenter: {flexDirection: 'row', marginTop: heightScale(20)},
  view2: {justifyContent: 'space-between'},
  view1: {flexDirection: 'row', alignItems: 'center'},
  text20: {lineHeight: heightScale(20)},
  text20To: {lineHeight: heightScale(20), marginBottom: heightScale(2)},
  border: {
    width: widthScale(9),
    height: widthScale(9),
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 100,
  },
  borderBlack: {
    width: widthScale(9),
    height: widthScale(9),
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 100,
    backgroundColor: colors.black,
  },
  line: {height: heightScale(25), width: 1, backgroundColor: colors.black},
  viewLine: {alignItems: 'center', marginTop: scale(6), marginRight: widthScale(10)},
  viewBlack: {
    backgroundColor: colors.black,
    width: widthScale(45),
    height: heightScale(27),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginRight: widthScale(10),
  },
  view: {
    backgroundColor: colors.policy,
    padding: widthScale(20),
    borderRadius: 10,
  },
  viewTime: {
    marginRight: widthScale(10),
    justifyContent: 'space-between',
  },
  viewArrival: {
    lineHeight: heightScale(13),
    marginTop: heightScale(8),
  },
  viewBottom: {
    flexDirection: 'row',
    marginTop: heightScale(20),
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
});
