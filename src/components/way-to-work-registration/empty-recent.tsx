import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';

const EmptyRecent = () => {
  return (
    <View style={styles.viewEmpty}>
      <CustomText
        size={FONT.CAPTION_6}
        family={FONT_FAMILY.MEDIUM}
        color={colors.grayText}
        forDriveMe
        string="최근 검색 내역이 없습니다."
      />
    </View>
  );
};

export default memo(EmptyRecent);

const styles = StyleSheet.create({
  viewEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: heightScale1(140),
  },
});
