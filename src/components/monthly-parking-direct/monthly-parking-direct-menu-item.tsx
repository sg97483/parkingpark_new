import {StyleSheet, View} from 'react-native';
import React, {memo, ReactNode} from 'react';
import HStack from '~components/h-stack';
import CustomText from '~components/custom-text';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {FONT_FAMILY} from '~constants/enum';

interface Props {
  title: string;
  value: string;
  rightContent?: ReactNode;
}

const MonthlyParkingDirectMenuItem: React.FC<Props> = memo(props => {
  const {title, value, rightContent} = props;
  return (
    <HStack style={styles.container}>
      <View style={styles.leftContentWrapper}>
        <CustomText string={title} family={FONT_FAMILY.SEMI_BOLD} />
      </View>
      <View style={{flex: 1}}>
        <CustomText string={value} />
      </View>

      {rightContent}
    </HStack>
  );
});

export default MonthlyParkingDirectMenuItem;

const styles = StyleSheet.create({
  container: {
    minHeight: heightScale(50),
    alignItems: 'flex-start',
  },
  leftContentWrapper: {
    width: widthScale(90),
  },
});
