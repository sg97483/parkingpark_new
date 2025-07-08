import React, {memo} from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  text: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  isChecked?: boolean;
  disable?: boolean;
}

const ItemCheckTerm = (props: Props) => {
  const {text, onPress, style, isChecked, disable} = props;

  return (
    <Pressable disabled={disable} onPress={onPress} style={[styles.view, style]}>
      <View style={styles.view1}>
        <Icons.Check
          width={widthScale1(25)}
          height={widthScale1(25)}
          stroke={isChecked ? colors.black : colors.borderColorF}
        />

        <CustomText
          forDriveMe
          string={text}
          color={isChecked ? colors.black : colors.grayText}
          family={FONT_FAMILY.MEDIUM}
        />
      </View>

      <Icons.IconRight width={widthScale1(17)} height={widthScale1(17)} />
    </Pressable>
  );
};

export default memo(ItemCheckTerm);

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: heightScale1(40),
    paddingHorizontal: widthScale1(10),
  },
  view1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthScale1(4),
  },
});
