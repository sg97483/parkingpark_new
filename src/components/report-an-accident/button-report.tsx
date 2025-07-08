import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import CustomText from '~components/custom-text';
import {heightScale} from '~styles/scaling-utils';
import {Icons} from '~/assets/svgs';
import {PADDING} from '~constants/constant';
import {colors} from '~styles/colors';

interface Props {
  text: string;
  onPress: () => void;
}
const ButtonReport = (props: Props) => {
  const {text, onPress} = props;

  return (
    <View>
      <TouchableOpacity style={styles.view} onPress={onPress}>
        <CustomText string={text} />
        <Icons.ChevronRight />
      </TouchableOpacity>
      <View style={styles.line} />
    </View>
  );
};

export default memo(ButtonReport);
const styles = StyleSheet.create({
  view: {
    paddingVertical: heightScale(22),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: colors.policy,
  },
});
