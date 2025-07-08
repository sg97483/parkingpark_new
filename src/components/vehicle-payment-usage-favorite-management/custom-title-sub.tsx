import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {scale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

interface CustomTitleSubProps {
  title: string;
  subTitle: string;
}
const CustomTitleSub = (props: CustomTitleSubProps) => {
  const {title, subTitle} = props;
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subText}>{subTitle}</Text>
    </View>
  );
};

export default React.memo(CustomTitleSub);

const styles = StyleSheet.create({
  dotIcon: {
    width: scale1(4),
    height: scale1(4),
  },
  subText: {
    fontFamily: FONT_FAMILY.MEDIUM,
    fontSize: fontSize1(14),
    color: colors.grayText,
  },
  title: {
    fontFamily: FONT_FAMILY.MEDIUM,
    fontSize: fontSize1(16),
    color: colors.menuTextColor,
    marginBottom: scale1(4),
  },
});
