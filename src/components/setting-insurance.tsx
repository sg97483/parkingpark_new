import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import CustomText from './custom-text';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import {ICONS} from '~/assets/images-path';
import {FONT, FONT_FAMILY} from '~constants/enum';

interface Props {
  title: string;
  onPress: () => void;
  isCheck?: boolean;
  isApproved?: boolean;
}
const SettingInsurance = ({onPress, title, isCheck, isApproved}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.view, {borderColor: isCheck ? colors.green : colors.darkGray}]}>
      <CustomText
        size={FONT.BODY}
        string={title}
        family={FONT_FAMILY.SEMI_BOLD}
        color={isCheck ? colors.green : colors.grayText1}
      />
      <View style={styles.viewSmall}>
        {isApproved ? (
          <CustomText
            size={FONT.BODY}
            string="승인완료"
            family={FONT_FAMILY.SEMI_BOLD}
            color={colors.blue}
          />
        ) : (
          <View />
        )}
        <Image
          source={isCheck ? ICONS.btn_green_checked : ICONS.btn_add_gray_dotted}
          style={styles.icon}
          resizeMode={'contain'}
        />
      </View>
    </TouchableOpacity>
  );
};

export default SettingInsurance;

const styles = StyleSheet.create({
  view: {
    borderRadius: widthScale(12),
    borderWidth: widthScale(1.5),
    paddingHorizontal: widthScale(12),
    paddingVertical: heightScale(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: heightScale(15),
  },
  icon: {
    width: widthScale(25),
    height: widthScale(25),
  },
  viewSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    width: widthScale(120),
    justifyContent: 'space-between',
  },
});
