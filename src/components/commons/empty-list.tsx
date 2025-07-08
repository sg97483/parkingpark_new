import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';

interface Props {
  text: string;
  top?: number | string;
}
const EmptyList = (props: Props) => {
  const {text, top = '50%'} = props;

  return (
    <View
      style={[
        styles.containerStyle,
        {paddingTop: typeof top === 'string' ? (`${top}` as any) : top},
      ]}>
      <CustomText
        string={text}
        family={FONT_FAMILY.MEDIUM}
        color={colors.grayText}
        forDriveMe
        size={FONT.CAPTION_7}
        textStyle={{textAlign: 'center'}}
        lineHeight={heightScale1(22)}
      />
    </View>
  );
};

export default memo(EmptyList);

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: 'center',
  },
});
