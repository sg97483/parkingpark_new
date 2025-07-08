import React, {ReactNode, memo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import CustomBoxSelectButton from './commons/custom-box-select-button';
import CustomInput from './commons/custom-input';
import CustomText from './custom-text';
import HStack from './h-stack';

interface Props {
  title?: string;
  data: string[];
  onPress: (item: string) => void;
  selected: string;
  containerStyle?: StyleProp<ViewStyle>;
  icon?: ReactNode;
  isInput?: boolean;
  textValue?: string;
  onChangeText?: (value: string) => void;
  placeholderTextInput?: string;
}

const MenuTextBoxRadius: React.FC<Props> = memo(props => {
  const {
    title,
    data,
    onPress,
    selected,
    containerStyle,
    icon,
    isInput,
    onChangeText,
    textValue,
    placeholderTextInput,
  } = props;

  return (
    <View style={[styles.containerStyles, containerStyle]}>
      {title ? (
        <CustomText
          string={title as string}
          family={FONT_FAMILY.MEDIUM}
          size={FONT.CAPTION_7}
          color={colors.menuTextColor}
          lineHeight={heightScale1(22)}
        />
      ) : null}

      {isInput ? (
        <CustomInput
          value={textValue as string}
          onChangeText={value => {
            if (onChangeText) {
              onChangeText(value);
            }
          }}
          style={{gap: 0}}
          placeholder={placeholderTextInput}
          keyboardType="number-pad"
        />
      ) : null}

      <HStack style={{flexWrap: 'wrap', gap: widthScale1(10)}}>
        {data &&
          data?.map((item, index) => (
            <CustomBoxSelectButton
              text={item}
              key={index}
              onSelected={() => onPress(item)}
              selected={item === selected}
            />
          ))}
      </HStack>
    </View>
  );
});

export default MenuTextBoxRadius;

const styles = StyleSheet.create({
  containerStyles: {
    gap: heightScale1(10),
  },
});
