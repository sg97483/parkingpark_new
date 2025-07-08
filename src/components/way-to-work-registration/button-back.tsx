import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {Icons} from '~/assets/svgs';
import {colors} from '~styles/colors';
import {widthScale1} from '~styles/scaling-utils';

interface Props {
  style?: StyleProp<ViewStyle>;
  handleBack?: () => void;
}

const ButtonBack = (props: Props) => {
  const {style, handleBack} = props;

  const navigation = useNavigation();

  return (
    <View style={style}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          handleBack?.();
          navigation.goBack();
        }}
        style={styles.button}>
        <Icons.ChevronLeft />
      </TouchableOpacity>
    </View>
  );
};

export default memo(ButtonBack);
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.white,
    width: widthScale1(40),
    height: widthScale1(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    shadowOffset: {height: 2, width: 0},
    shadowRadius: 8,
    shadowOpacity: 0.05,
    shadowColor: colors.shadowColor,
    elevation: 5,
  },
});
