import React, {memo} from 'react';
import {StyleSheet, TextInput, TextInputProps, View} from 'react-native';
import CustomText from '~components/custom-text';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

interface Props {}

const ViewInputAboutMe = (props: Props & TextInputProps) => {
  const {value, ...rest} = props;

  return (
    <View style={styles.viewAll}>
      <View style={styles.view}>
        <TextInput value={value} style={styles.input} multiline {...rest} />
      </View>
      <CustomText
        color={colors.disableButton}
        textStyle={{marginTop: heightScale1(5), textAlign: 'right', marginRight: widthScale1(4)}}
        string={`${value?.length || 0}/50`}
      />
    </View>
  );
};

export default memo(ViewInputAboutMe);
const styles = StyleSheet.create({
  view: {
    height: heightScale1(110),
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.disableButton,
    padding: widthScale1(15),
  },
  input: {
    padding: 0,
    height: heightScale1(30),
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: scale1(14),
  },
  viewAll: {
    marginTop: heightScale1(10),
  },
});
