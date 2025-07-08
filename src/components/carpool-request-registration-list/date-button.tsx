import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  text?: string;
  placeholder: string;
  onPress?: () => void;
  disable?: boolean;
}
const DateButton = (props: Props) => {
  const {text, placeholder, onPress, disable} = props;

  return (
    <TouchableOpacity disabled={disable} onPress={onPress} style={styles.view}>
      <CustomText
        family={FONT_FAMILY.MEDIUM}
        forDriveMe
        color={text ? colors.black : colors.disableButton}
        size={FONT.CAPTION_7}
        string={text || placeholder}
      />
      <Icons.Date />
    </TouchableOpacity>
  );
};

export default memo(DateButton);
const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    height: heightScale1(48),
    width: widthScale1(150),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.disableButton,
    paddingHorizontal: widthScale1(16),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
