import {StyleSheet, View, ViewStyle} from 'react-native';
import React, {memo} from 'react';
import HStack from '~components/h-stack';
import {heightScale, widthScale} from '~styles/scaling-utils';
import CustomText from '~components/custom-text';
import {colors} from '~styles/colors';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {PADDING} from '~constants/constant';

interface Props {
  title: string;
  content: React.ReactNode;
  titleColor?: string;
  pinkColor?: boolean;
  isLastIndex?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  noPadding?: boolean;
}

const UsageHistoryMenuText: React.FC<Props> = memo(props => {
  const {content, title, titleColor, pinkColor, isLastIndex, style, contentStyle, noPadding} =
    props;
  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: noPadding ? 0 : PADDING,
      }}>
      <HStack
        style={[
          styles.container,
          {
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderBottomWidth: isLastIndex ? 1 : 0,
            borderColor: pinkColor ? colors.pink2 : colors.grayText,
          },
        ]}>
        <View
          style={[
            styles.titleWrapper,
            {
              backgroundColor: pinkColor ? `${colors.pink2}90` : colors.gray,
              borderColor: pinkColor ? colors.pink2 : colors.grayText,
            },
          ]}>
          <CustomText
            size={FONT.CAPTION}
            string={title}
            family={FONT_FAMILY.SEMI_BOLD}
            textStyle={{
              textAlign: 'center',
            }}
            color={titleColor}
          />
        </View>

        <View style={[styles.content, contentStyle]}>{content}</View>
      </HStack>
    </View>
  );
});

export default UsageHistoryMenuText;

const styles = StyleSheet.create({
  container: {
    minHeight: heightScale(45),
  },
  titleWrapper: {
    flex: 3,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
  },
  content: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
    margin: widthScale(3),
  },
});
