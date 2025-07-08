import {Pressable, StyleProp, StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import CustomText from './custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import ChevronDown from '~/assets/svgs/ChevronDown';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {ViewStyle} from 'react-native';
import {fontSize1} from '~styles/typography';

interface Props {
  title?: string;
  textContent: string;
  containerStyle?: StyleProp<ViewStyle>;
  onPress: () => void;
  textContentColor?: string;
  contentStyle?: StyleProp<ViewStyle>;
  iconColor?: string;
}

const MenuTitleDropdown: React.FC<Props> = memo(props => {
  const {title, textContent, onPress, containerStyle, textContentColor, contentStyle, iconColor} =
    props;

  return (
    <View style={containerStyle}>
      {title ? (
        <CustomText
          string={title as string}
          family={FONT_FAMILY.MEDIUM}
          size={FONT.CAPTION_6}
          color={colors.black}
          textStyle={{paddingBottom: heightScale1(10)}}
          lineHeight={fontSize1(20)}
        />
      ) : null}

      <Pressable style={[styles.content, contentStyle]} onPress={onPress}>
        <CustomText
          string={textContent}
          family={FONT_FAMILY.MEDIUM}
          size={FONT.CAPTION_6}
          color={textContentColor || colors.disableButton}
          textStyle={{paddingRight: widthScale1(15)}}
          lineHeight={fontSize1(20)}
        />

        <ChevronDown stroke={iconColor} />
      </Pressable>
    </View>
  );
});

export default MenuTitleDropdown;

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: widthScale1(16),
    paddingVertical: widthScale1(12),
    borderColor: colors.disableButton,
    borderWidth: 1,
    borderRadius: widthScale1(8),
    minHeight: heightScale1(48),
  },
});
