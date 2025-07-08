import React, {memo, useCallback, useMemo, useState} from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Icons} from '~/assets/svgs';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {widthScale1} from '~styles/scaling-utils';
import CustomText from '../custom-text';

interface Props {
  type?: 'PRIMARY' | 'SECONDARY';
  isChecked?: boolean;
  onPress?: () => void;
  isCircle?: boolean;
  text?: string;
  style?: StyleProp<ViewStyle>;
  disablePressColor?: boolean;
}

const CustomCheckbox = (props: Props) => {
  const {
    type = 'PRIMARY',
    isChecked,
    onPress,
    isCircle,
    text,
    style,
    disablePressColor = false,
  } = props;

  const [pressed, setPressed] = useState(false);

  const onPressIn = useCallback(() => setPressed(true), []);
  const onPressOut = useCallback(() => setPressed(false), []);

  const IconBoxChecked = isCircle ? Icons.BoxCheckedCircle : Icons.BoxChecked;
  const IconBoxDefault = isCircle ? Icons.BoxCheckCircleDefault : Icons.BoxCheckDefault;

  const stroke = useMemo(
    () => (pressed ? (type === 'PRIMARY' ? colors.primary : colors.black) : undefined),
    [type, pressed],
  );

  const colorText = useMemo(() => {
    if (pressed) {
      return colors.grayText2;
    } else {
      return isChecked ? colors.black : colors.grayText;
    }
  }, [isChecked, pressed]);

  const Icon = useMemo(() => {
    if (pressed) {
      return <IconBoxDefault stroke={colors.primary} />;
    } else {
      return isChecked ? <IconBoxChecked stroke={stroke} /> : <IconBoxDefault stroke={stroke} />;
    }
  }, [isChecked, stroke, pressed, isCircle, IconBoxDefault]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={disablePressColor ? () => {} : onPressIn}
      onPressOut={disablePressColor ? () => {} : onPressOut}
      style={style}>
      <View style={styles.container}>
        {Icon}

        {!!text && (
          <CustomText
            color={colorText}
            forDriveMe
            string={text}
            family={FONT_FAMILY.MEDIUM}
            size={FONT.CAPTION_6}
            numberOfLines={1}
          />
        )}
      </View>
    </Pressable>
  );
};

export default memo(CustomCheckbox);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthScale1(4),
  },
});
