import {StyleSheet, View} from 'react-native';
import React from 'react';
import CustomText from '~components/custom-text';
import {FONT_FAMILY} from '~constants/enum';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {PADDING} from '~constants/constant';
import {colors} from '~styles/colors';
interface Props {
  title: string;
  money: string;
  main?: boolean;
}
const TitleMoney = ({money, title, main}: Props) => {
  if (main) {
    return (
      <View style={styles.viewMain}>
        <CustomText string={title} family={FONT_FAMILY.BOLD} />
        <CustomText string={money} family={FONT_FAMILY.BOLD} />
      </View>
    );
  }

  return (
    <View style={styles.view}>
      <CustomText string={title} family={FONT_FAMILY.SEMI_BOLD} />
      <CustomText string={money} family={FONT_FAMILY.SEMI_BOLD} />
    </View>
  );
};

export default TitleMoney;

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: heightScale(15),
  },
  viewMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: PADDING,
    borderRadius: widthScale(8),
    backgroundColor: colors.gray,
  },
});
