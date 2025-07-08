import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {ICONS} from '~/assets/images-path';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING_HEIGHT} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {heightScale, widthScale} from '~styles/scaling-utils';

const RequestChangeAddNotification = () => {
  return (
    <HStack style={styles.wrapper}>
      <Image source={ICONS.warning} style={styles.warning} resizeMode="contain" />

      <View style={{flex: 1, marginLeft: widthScale(5)}}>
        <CustomText
          string={strings.request_change_and_cancel_add.first_notification}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION}
        />
        <CustomText
          string={strings.request_change_and_cancel_add.second_notification}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION}
          textStyle={{marginTop: heightScale(20)}}
        />
        <CustomText
          string={strings.request_change_and_cancel_add.third_notification}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION}
          textStyle={{marginTop: heightScale(5)}}
        />
      </View>
    </HStack>
  );
};

export default RequestChangeAddNotification;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: PADDING_HEIGHT * 2,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  warning: {
    width: widthScale(20),
    height: heightScale(20),
  },
});
