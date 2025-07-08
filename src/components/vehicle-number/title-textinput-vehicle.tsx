import {StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import CustomText from '~components/custom-text';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';

interface Props {
  title: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  underlineColor?: string;
}

const TitleTextInputVehicle = ({
  title,
  placeholder,
  value,
  onChangeText,
  underlineColor,
}: Props) => {
  return (
    <View style={styles.view}>
      <View style={styles.viewTitle}>
        <CustomText string={title} family={FONT_FAMILY.SEMI_BOLD} size={FONT.TITLE_3} />
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[
          styles.textInput,
          {
            color: underlineColor || colors.black,
            borderBottomColor: underlineColor || colors.darkGray,
            borderBottomWidth: 1,
          },
        ]}
        placeholderTextColor={colors.grayText}
      />
    </View>
  );
};

export default TitleTextInputVehicle;

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: widthScale(10),
    marginTop: heightScale(25),
  },
  viewTitle: {
    marginRight: widthScale(10),
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: heightScale(5),
  },
  textInput: {
    flex: 1,
    textAlign: 'right',
    fontSize: widthScale(18),
  },
});
