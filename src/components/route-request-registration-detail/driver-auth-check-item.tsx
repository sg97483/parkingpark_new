import {StyleSheet} from 'react-native';
import React, {memo} from 'react';
import HStack from '~components/h-stack';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import {heightScale1} from '~styles/scaling-utils';
import {FONT_FAMILY} from '~constants/enum';

interface Props {
  text: string;
}

const DriverAuthCheckItem: React.FC<Props> = memo(props => {
  const {text} = props;
  return (
    <HStack style={styles.driverAuthCheckViewStyle}>
      <Icons.Check />
      <CustomText forDriveMe string={text} family={FONT_FAMILY.MEDIUM} />
    </HStack>
  );
});
export default DriverAuthCheckItem;

const styles = StyleSheet.create({
  driverAuthCheckViewStyle: {
    gap: heightScale1(4),
    minHeight: heightScale1(20),
  },
});
