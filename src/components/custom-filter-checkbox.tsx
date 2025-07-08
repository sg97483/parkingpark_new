import React, {memo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle, TouchableWithoutFeedback} from 'react-native';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {widthScale} from '~styles/scaling-utils';
import CustomText from './custom-text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  text: string;
  onPress: () => void;
  isChecked: boolean;
  isDisable?: boolean;
  style?: StyleProp<ViewStyle>;
  colorTextNotCheck?: string;
}

const CustomFilterCheckBox = (props: Props) => {
  const {
    onPress,
    text,
    isChecked,
    isDisable = false,
    style,
    colorTextNotCheck = colors.grayText,
  } = props;

  return (
    <TouchableWithoutFeedback disabled={isDisable} onPress={onPress}>
      <View style={[styles.view, style]}>
        <View
          style={[
            {
              backgroundColor: isChecked ? colors.redSwitch : colors.white,
              borderWidth: widthScale(2),
              borderColor: isDisable
                ? '#F4F4F4'
                : isChecked
                  ? colors.redSwitch
                  : colors.grayCheckBox, // 비활성화 시 테두리 색상 변경
            },
            styles.tick,
          ]}>
          {isChecked && (
            <Icon name="check" size={widthScale(15)} color={colors.white} /> // 체크 아이콘 색상 변경 없음
          )}
        </View>
        <CustomText
          size={FONT.CAPTION_7}
          string={text}
          textStyle={styles.text}
          family={FONT_FAMILY.MEDIUM}
          color={isDisable ? '#DFDFDF' : isChecked ? colors.black : colorTextNotCheck}
          forDriveMe
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default memo(CustomFilterCheckBox);

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    alignItems: 'center', // 중앙 정렬을 위해 추가
  },
  tick: {
    borderRadius: widthScale(3),
    width: widthScale(20),
    height: widthScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginLeft: widthScale(7),
  },
});
