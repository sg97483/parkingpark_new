import React, {memo, useMemo} from 'react';
import {Pressable, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, scale1} from '~styles/scaling-utils';

interface Props {
  text: string;
  type?: 'NORMAL' | 'WARNING';
  onPress?: () => void;
  hideChevron?: boolean;
}

const PageButton: React.FC<Props> = memo(props => {
  const {text = '', type = 'NORMAL', hideChevron = false, onPress} = props;

  const buttonStyle = useMemo((): StyleProp<ViewStyle> => {
    switch (type) {
      case 'NORMAL':
        return {
          backgroundColor: colors.policy,
        };

      case 'WARNING':
        return {
          backgroundColor: colors.white,
          borderWidth: 1,
          borderColor: colors.primary,
        };

      default:
        return {};
    }
  }, [type]);

  const textColor = useMemo((): string => {
    switch (type) {
      case 'NORMAL':
        return colors.grayText2;

      case 'WARNING':
        return colors.primary;

      default:
        return colors.grayText2;
    }
  }, [type]);

  return (
    <Pressable onPress={onPress} style={[styles.containerStyle, buttonStyle]}>
      <HStack style={styles.contentStyle}>
        <CustomText
          string={text}
          numberOfLines={1}
          forDriveMe
          family={FONT_FAMILY.MEDIUM}
          color={textColor}
        />

        {hideChevron ? null : <Icons.ChevronRight width={16} height={16} stroke={textColor} />}
      </HStack>
    </Pressable>
  );
});

export default PageButton;

const styles = StyleSheet.create({
  contentStyle: {
    justifyContent: 'space-between',
    paddingHorizontal: PADDING1,
  },
  containerStyle: {
    minHeight: heightScale1(52),
    justifyContent: 'center',
    borderRadius: scale1(4),
  },
});
