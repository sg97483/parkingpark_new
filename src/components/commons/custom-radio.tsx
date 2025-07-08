import React, {memo, useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import CustomText from '../custom-text';

interface Props {
  type?: 'PRIMARY' | 'SECONDARY';
  isChecked?: boolean;
  text?: string;
  onPress?: () => void;
}

const CustomRadio = (props: Props) => {
  const {type = 'PRIMARY', isChecked, text, onPress} = props;

  const colorText = useMemo(
    () => (isChecked ? colors.menuTextColor : colors.grayText),
    [isChecked],
  );

  const colorIcon = useMemo(() => (type === 'PRIMARY' ? colors.primary : colors.heavyGray), [type]);

  const IconChecked = isChecked ? Icons.RadioChecked : Icons.RadioDefault;

  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <IconChecked stroke={colorIcon} />

        <CustomText
          color={colorText}
          forDriveMe
          string={text!}
          family={FONT_FAMILY.MEDIUM}
          size={FONT.CAPTION_7}
          lineHeight={heightScale1(22)}
        />
      </View>
    </Pressable>
  );
};

export default memo(CustomRadio);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthScale1(4),
  },
});
