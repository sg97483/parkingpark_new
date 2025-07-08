import React, {memo, useCallback} from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {FONT, FONT_FAMILY, GENDER} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  selectedGender: GENDER;
  onGenderPress: (value: GENDER) => void;
}

const GenderSelector: React.FC<Props> = memo(props => {
  const {onGenderPress, selectedGender} = props;

  const focusButtonStyle = useCallback(
    (value: GENDER): StyleProp<ViewStyle> => {
      const isFocused = value === selectedGender;

      return {
        backgroundColor: isFocused ? colors.primary : colors.white,
        borderWidth: 1,
        borderColor: isFocused ? colors.primary : colors.disableButton,
      };
    },
    [selectedGender],
  );

  const textColor = useCallback(
    (value: GENDER): string => {
      const isFocused = value === selectedGender;

      return isFocused ? colors.white : colors.lineCancel;
    },
    [selectedGender],
  );

  return (
    <View style={styles.containerStyle}>
      <CustomText string="성별" forDriveMe family={FONT_FAMILY.MEDIUM} />
      <HStack style={styles.contentStyle}>
        {/* Female */}
        <Pressable
          onPress={() => onGenderPress(GENDER.FEMALE)}
          style={[styles.buttonStyle, focusButtonStyle(GENDER.FEMALE)]}>
          <CustomText
            string="여성"
            forDriveMe
            size={FONT.SUB_HEAD}
            family={FONT_FAMILY.SEMI_BOLD}
            color={textColor(GENDER.FEMALE)}
          />
        </Pressable>

        {/* Male */}
        <Pressable
          onPress={() => onGenderPress(GENDER.MALE)}
          style={[styles.buttonStyle, focusButtonStyle(GENDER.MALE)]}>
          <CustomText
            string="남성"
            forDriveMe
            size={FONT.SUB_HEAD}
            family={FONT_FAMILY.SEMI_BOLD}
            color={textColor(GENDER.MALE)}
          />
        </Pressable>
      </HStack>
    </View>
  );
});

export default GenderSelector;

const styles = StyleSheet.create({
  containerStyle: {
    gap: heightScale1(10),
  },
  contentStyle: {
    gap: widthScale1(10),
  },
  buttonStyle: {
    minHeight: heightScale1(48),
    borderRadius: scale1(8),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
