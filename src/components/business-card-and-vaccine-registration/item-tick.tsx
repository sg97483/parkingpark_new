import React, {memo} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  onPress?: () => void;
  text: string;
  isChecked?: boolean;
}

const ItemTick = (props: Props) => {
  const {onPress, text, isChecked} = props;

  return (
    <Pressable onPress={onPress} style={styles.viewItem}>
      <CustomText
        forDriveMe
        color={isChecked ? colors.redSwitch : colors.black}
        size={FONT.CAPTION_7}
        string={text}
        textStyle={styles.text}
        family={FONT_FAMILY.MEDIUM}
      />
      {isChecked && <Icons.Check width={widthScale1(24)} height={widthScale1(24)} />}
    </Pressable>
  );
};

export default memo(ItemTick);

const styles = StyleSheet.create({
  viewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: heightScale1(50),
  },
  text: {
    lineHeight: heightScale1(25),
  },
});
