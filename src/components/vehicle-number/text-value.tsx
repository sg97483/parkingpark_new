import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import CustomText from '~components/custom-text';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  onPressNext?: () => void;
  textTitle: string;
  textValue?: string;
  valueComponent?: React.ReactElement;
}

const TextValue = ({onPressNext, textTitle, textValue, valueComponent}: Props) => {
  if (onPressNext) {
    return (
      <TouchableOpacity onPress={onPressNext} style={styles.view}>
        <CustomText string={textTitle} family={FONT_FAMILY.SEMI_BOLD} size={FONT.TITLE_3} />
        <Icon name="chevron-right" size={widthScale(30)} color={colors.red} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.view}>
      <CustomText string={textTitle} family={FONT_FAMILY.SEMI_BOLD} size={FONT.TITLE_3} />
      {valueComponent || (
        <CustomText
          string={textValue!}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.TITLE_3}
          color={colors.grayText}
        />
      )}
    </View>
  );
};

export default TextValue;

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: widthScale(40),
    marginTop: heightScale(50),
  },
});
