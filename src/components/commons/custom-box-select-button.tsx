import React, {memo} from 'react';
import {Pressable, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import CustomText from '~components/custom-text';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  selected?: boolean;
  text: string;
  onSelected?: () => void;
  style?: StyleProp<ViewStyle>;
  darkText?: boolean;
  outLine?: boolean;
}

const CustomBoxSelectButton: React.FC<Props> = memo(props => {
  const {selected, text, onSelected, style, darkText = false, outLine = false} = props;

  return (
    <Pressable
      onPress={onSelected}
      style={[
        styles.container,
        {
          backgroundColor:
            outLine && selected ? colors.white : selected ? colors.heavyGray : colors.white,
          borderColor:
            outLine && selected
              ? colors.primary
              : selected
                ? colors.heavyGray
                : colors.disableButton,
        },
        style,
      ]}>
      <CustomText
        forDriveMe
        string={text}
        family={FONT_FAMILY.MEDIUM}
        lineHeight={heightScale1(20)}
        color={
          selected && outLine
            ? colors.primary
            : darkText
              ? colors.menuTextColor
              : selected
                ? colors.white
                : colors.lineCancel
        }
      />
    </Pressable>
  );
});

export default CustomBoxSelectButton;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: widthScale1(14),
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: heightScale1(32),
    borderWidth: 1,
    paddingVertical: heightScale1(6),
  },
});
