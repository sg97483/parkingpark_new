import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';

const IconExclamation = ({onPress}: {onPress?: () => void}) => {
  return (
    <View style={styles.view}>
      <Icon name="exclamation" size={widthScale(14)} color={colors.grayText1} />
    </View>
  );
};

export default memo(IconExclamation);
const styles = StyleSheet.create({
  view: {
    borderRadius: 100,
    borderWidth: widthScale(2),
    borderColor: colors.grayText1,
    width: widthScale(20),
    height: widthScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
