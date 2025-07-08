import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import React, {memo} from 'react';
import {PADDING} from '~constants/constant';
import CustomText from '~components/custom-text';
import {FONT} from '~constants/enum';
import {heightScale1 as heightScale, widthScale1 as widthScale} from '~styles/scaling-utils';
import Button from '~components/button';
import {colors} from '~styles/colors';

interface Props {
  isChecked: boolean;
  numberCard: string;
  name: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const ViewCard = (props: Props) => {
  const {isChecked, name, numberCard, onPress, style} = props;

  return (
    <View
      style={[
        styles.view,
        style,
        {borderColor: isChecked ? colors.redButton : colors.grayCheckBox},
      ]}>
      <View style={{justifyContent: 'space-between', flex: 1}}>
        <CustomText string={numberCard} size={FONT.CAPTION_7} />
        <CustomText string={name} size={FONT.CAPTION_6} />
      </View>
      <Button
        borderColor={isChecked ? undefined : colors.disableButton}
        color={isChecked ? undefined : colors.white}
        textColor={isChecked ? colors.white : colors.lineCancel}
        onPress={onPress!}
        text="선택"
        style={styles.button}
      />
    </View>
  );
};

export default memo(ViewCard);
const styles = StyleSheet.create({
  view: {
    borderRadius: 8,
    borderWidth: 1,
    padding: PADDING,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    width: widthScale(45),
    height: heightScale(40),
    borderRadius: 8,
  },
});
