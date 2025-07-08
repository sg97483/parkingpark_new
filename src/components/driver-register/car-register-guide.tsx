import React, {memo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import CustomText from '~components/custom-text';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

interface Props {
  content: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const CarRegisterGuide: React.FC<Props> = memo(props => {
  const {content, containerStyle} = props;
  const text = strings.driver_register;

  return (
    <PaddingHorizontalWrapper containerStyles={[styles.container, containerStyle]} forDriveMe>
      <View style={{minHeight: heightScale1(75)}}>
        <CustomText
          string={content}
          family={FONT_FAMILY.REGULAR}
          size={FONT.CAPTION_6}
          color={colors.grayText2}
          textStyle={{paddingTop: widthScale1(5)}}
          lineHeight={fontSize1(20)}
          forDriveMe
        />
      </View>
    </PaddingHorizontalWrapper>
  );
});

export default CarRegisterGuide;

const styles = StyleSheet.create({
  container: {
    marginTop: widthScale1(20),
    backgroundColor: colors.white,
    paddingVertical: heightScale1(16),
    borderRadius: scale1(8),
  },
});
