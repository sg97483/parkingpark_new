import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import CustomSwitch from '~components/custom-switch';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface SettingSwitchProps {
  title: string;
  subTitle: string;
  onPress: () => void;
  hideButton?: boolean;
  isOn?: boolean;
}

const SettingSwitch = (props: SettingSwitchProps) => {
  const {subTitle, title, onPress, hideButton, isOn} = props;

  return (
    <Pressable onPress={onPress}>
      <HStack style={styles.container}>
        <View style={{gap: heightScale1(4), flex: 1}}>
          <CustomText
            lineHeight={heightScale1(20)}
            forDriveMe
            family={FONT_FAMILY.SEMI_BOLD}
            string={title}
          />
          <CustomText
            lineHeight={heightScale1(20)}
            forDriveMe
            color={colors.grayText}
            numberOfLines={1}
            string={subTitle}
          />
        </View>

        {!hideButton && <CustomSwitch isOn={!!isOn} onPress={onPress} />}
      </HStack>
    </Pressable>
  );
};

export default React.memo(SettingSwitch);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    minHeight: heightScale1(44),
    gap: widthScale1(6),
  },
});
