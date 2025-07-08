import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import CustomText from '~components/custom-text';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {FONT, FONT_FAMILY} from '~constants/enum';

interface Props {}

const CarPoolRouteRealtimeItem: React.FC<Props> = memo(props => {
  const {} = props;

  return (
    <View>
      <View style={styles.proposal}>
        <CustomText
          string="실시간 추천"
          family={FONT_FAMILY.SEMI_BOLD}
          color={colors.greenInteraction}
          textStyle={{fontSize: widthScale(11)}}
        />
      </View>
      <View style={styles.routeBox}>
        <View>
          <CustomText
            string="출발지"
            family={FONT_FAMILY.LIGHT}
            color={colors.lineCancel}
            size={FONT.CAPTION_6}
          />
          <View style={styles.viewCenter} />
          <CustomText
            string="출발지"
            family={FONT_FAMILY.LIGHT}
            color={colors.lineCancel}
            size={FONT.CAPTION_6}
          />
        </View>

        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <View style={styles.dot} />
          <View style={styles.line} />
          <View style={styles.dotBlack} />
        </View>

        <View>
          <CustomText string="출발지" color={colors.black} size={FONT.CAPTION_6} />
          <View style={styles.viewCenter} />
          <CustomText string="출발지" color={colors.black} size={FONT.CAPTION_6} />
        </View>
      </View>
    </View>
  );
});

export default CarPoolRouteRealtimeItem;

const styles = StyleSheet.create({
  proposal: {
    paddingHorizontal: widthScale(6),
    paddingVertical: heightScale(4),
    backgroundColor: colors.verificationSuccess,
    borderRadius: widthScale(4),
    alignSelf: 'flex-start',
  },
  routeBox: {
    marginTop: heightScale(10),
    flexDirection: 'row',
    backgroundColor: colors.policy,
    paddingHorizontal: widthScale(16),
    paddingVertical: heightScale(14),
    borderRadius: widthScale(8),
  },
  dot: {
    width: widthScale(9),
    height: heightScale(9),
    borderColor: colors.heavyGray,
    borderRadius: widthScale(999),
    backgroundColor: colors.white,
    borderWidth: 1,
    marginHorizontal: widthScale(10),
  },
  dotBlack: {
    width: widthScale(9),
    height: heightScale(9),
    borderRadius: widthScale(999),
    backgroundColor: colors.heavyGray,
    borderWidth: 1,
    marginHorizontal: widthScale(10),
  },
  viewCenter: {
    height: heightScale(8),
  },
  line: {
    height: heightScale(18),
    width: 1,
    backgroundColor: colors.heavyGray,
  },
});
