import {StyleSheet, StyleProp, ViewStyle, Pressable} from 'react-native';
import React, {ReactNode, memo} from 'react';
import CustomText from './custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import {fontSize1} from '~styles/typography';

interface Props {
  item: string;
  containerStyle?: StyleProp<ViewStyle>;
  onPress: (item: string) => void;
  select: string;
  disabled?: boolean;
  icon?: ReactNode;
}

const TextBorderRadius: React.FC<Props> = memo(props => {
  const {item, onPress, containerStyle, select, disabled, icon} = props;

  return (
    <Pressable
      style={[
        styles.container,
        select === item ? {backgroundColor: colors.heavyGray, borderColor: colors.heavyGray} : {},
        containerStyle,
      ]}
      onPress={() => onPress(item)}
      disabled={disabled}>
      <CustomText
        string={item}
        family={FONT_FAMILY.MEDIUM}
        size={FONT.CAPTION_6}
        color={select === item ? colors.white : colors.lineCancel}
        textStyle={[select === item ? {borderColor: colors.heavyGray} : {}]}
        lineHeight={fontSize1(20)}
      />
      {icon || null}
    </Pressable>
  );
});

export default TextBorderRadius;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: widthScale(14),
    paddingVertical: widthScale(6),
    borderColor: colors.disableButton,
    borderWidth: 1,
    borderRadius: widthScale(200),
    flexDirection: 'row',
    alignItems: 'center',
  },
});
