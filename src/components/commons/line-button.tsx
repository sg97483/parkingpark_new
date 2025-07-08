import {Pressable} from 'react-native';
import React, {memo} from 'react';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';
import Divider from '~components/divider';

interface Props {
  text: string;
  onPress: () => void;
  fontSize?: FONT;
  buttonColor?: string;
}

const LineButton: React.FC<Props> = memo(props => {
  const {onPress, text, fontSize = FONT.CAPTION_6, buttonColor = colors.lineCancel} = props;

  return (
    <Pressable onPress={onPress}>
      <CustomText
        color={buttonColor}
        size={fontSize}
        string={text}
        forDriveMe
        family={FONT_FAMILY.MEDIUM}
        lineHeight={heightScale1(20)}
      />
      <Divider
        style={{
          backgroundColor: buttonColor,
          height: 1,
        }}
      />
    </Pressable>
  );
});

export default LineButton;
