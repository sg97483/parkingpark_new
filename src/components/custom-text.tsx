import React, {memo} from 'react';
import {StyleProp, Text, TextProps, TextStyle} from 'react-native';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {fontSize, fontSize1} from '~styles/typography';

interface Props {
  string: string;
  color?: string;
  size?: FONT;
  family?: FONT_FAMILY;
  textStyle?: StyleProp<TextStyle>;
  lineHeight?: number;
  forDriveMe?: boolean;
}

export const getFontSize = (size: FONT): number => {
  switch (size) {
    case FONT.LARGE_TITLE:
      return 35;

    case FONT.TITLE_1:
      return 28;

    case FONT.TITLE_2:
      return 23;

    case FONT.TITLE_3:
      return 21;

    case FONT.BODY:
      return 18;

    case FONT.SUB_HEAD:
      return 15;

    case FONT.SUB_HEAD_2:
      return 17;

    case FONT.CAPTION:
      return 13;

    case FONT.CAPTION_2:
      return 12;

    case FONT.CAPTION_4:
      return 11;

    case FONT.CAPTION_3:
      return 10;

    case FONT.CAPTION_5:
      return 9;

    case FONT.CAPTION_6:
      return 14;

    case FONT.CAPTION_7:
      return 16;

    case FONT.CAPTION_8:
      return 20;

    case FONT.CAPTION_9:
      return 22;

    case FONT.CAPTION_10:
      return 24;

    case FONT.CAPTION_11:
      return 26;

    case FONT.LOGO_TITLE:
      return 39;

    default:
      return 13;
  }
};

const CustomText: React.FC<Props & TextProps> = memo(props => {
  const {
    string = '',
    color = colors.menuTextColor,
    size = FONT.CAPTION_6,
    family = FONT_FAMILY.REGULAR,
    textStyle,
    lineHeight,
    forDriveMe,
    ...rest
  } = props;

  return (
    <Text
      style={[
        {
          color: color,
          fontSize: forDriveMe ? fontSize1(getFontSize(size)) : fontSize(getFontSize(size)),
          fontFamily: family,
          lineHeight: lineHeight,
        },
        textStyle,
      ]}
      allowFontScaling={false}
      {...rest}>
      {string}
    </Text>
  );
});

export default CustomText;
