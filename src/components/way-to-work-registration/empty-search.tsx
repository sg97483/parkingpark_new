import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';

const EmptySearch = ({noneShow}: {noneShow?: boolean}) => {
  if (noneShow) {
    return <></>;
  }
  return (
    <View style={styles.viewEmpty}>
      <CustomText
        size={FONT.CAPTION_6}
        family={FONT_FAMILY.MEDIUM}
        color={colors.grayText}
        forDriveMe
        string="해당 주소가 없습니다. 다른 위치를 선택해주세요."
      />
    </View>
  );
};

export default memo(EmptySearch);

const styles = StyleSheet.create({
  viewEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: heightScale1(140),
  },
});
