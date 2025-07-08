import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import {colors} from '~styles/colors';
import {widthScale} from '~styles/scaling-utils';

const VerificationCompleted = () => {
  return (
    <View style={styles.view}>
      <Icons.TickVerificationCompleted />
      <CustomText textStyle={styles.text} color={'#0AA765'} string="인증완료" />
    </View>
  );
};

export default memo(VerificationCompleted);
const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.verificationSuccess,
    padding: widthScale(4),
    borderRadius: 4,
    marginLeft: widthScale(4),
  },
  text: {
    marginRight: widthScale(2),
  },
});
