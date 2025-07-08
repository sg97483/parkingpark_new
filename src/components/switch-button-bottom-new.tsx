import React, {useEffect, useState} from 'react';
import {View, Animated, StyleSheet, ViewStyle, Platform, Dimensions} from 'react-native';
import {PADDING} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale} from '~styles/scaling-utils';
import CustomSwitch from './custom-switch';
import CustomText from './custom-text';

interface Props {
  title: string;
  children?: React.ReactElement;
  isOn: boolean;
  onPressSwitch: () => void;
  heightContent?: number;
  style?: ViewStyle;
  isDisable?: boolean;
}

// 디바이스의 가로 해상도를 가져옵니다.
const windowWidth = Dimensions.get('window').width;

// 아이패드인 경우에만 height 값을 90으로 설정합니다.
const isIPad = Platform.OS === 'ios' && windowWidth >= 768; // iPad의 가로 해상도는 일반적으로 768 이상입니다.

const SwitchButtonBottomNew = ({
  title,
  children,
  isOn,
  onPressSwitch,
  heightContent,
  style,
  isDisable = false,
}: Props) => {
  const dropdownHeight = useState(new Animated.Value(0))[0];
  useEffect(() => {
    if (children) {
      toggleDropdown(isOn);
    }
  }, [isOn]);

  const toggleDropdown = (isOn: boolean) =>
    Animated.timing(dropdownHeight, {
      toValue: isOn ? heightContent || 100 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

  return (
    <View style={style}>
      <View style={styles.view}>
        <CustomText
          string={title}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_7}
          color={colors.menuTextColor}
          forDriveMe
        />
        <CustomSwitch onPress={onPressSwitch} isOn={isOn} isDisable={isDisable} />
      </View>
      <Animated.View
        style={{
          height: dropdownHeight,
          overflow: 'hidden',
          marginHorizontal: -PADDING / 2,
        }}>
        {children}
      </Animated.View>
    </View>
  );
};

export default SwitchButtonBottomNew;

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: isIPad ? 150 : heightScale(60), // 아이패드인 경우 150, 그 외에는 heightScale(70)을 사용합니다.
    backgroundColor: colors.white,
    alignItems: 'center',
    // padding: PADDING,
    // borderRadius: widthScale(8),
    marginVertical: heightScale(5),

    // shadowColor: colors.darkGray,
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.32,
    // shadowRadius: 5.46,
    // elevation: 9,
  },
});
