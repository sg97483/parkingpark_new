import React, {memo} from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import ChevronDown from '~/assets/svgs/ChevronDown';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import CustomText from './custom-text';

interface Props {
  onPress: () => void;
  text: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const MenuTextDropDown: React.FC<Props> = memo(props => {
  const {onPress, text, containerStyle} = props;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, containerStyle]}>
      <CustomText
        string={text}
        size={FONT.CAPTION_6}
        family={FONT_FAMILY.MEDIUM}
        color={colors.lineCancel}
        textStyle={{paddingRight: widthScale(2)}}
      />
      <ChevronDown />
    </TouchableOpacity>
  );
});

export default MenuTextDropDown;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: widthScale(14),
    paddingVertical: heightScale(6),
    borderRadius: widthScale(200),
    borderWidth: 1,
    borderColor: colors.disableButton,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
