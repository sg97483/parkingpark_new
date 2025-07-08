import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  onStartDatePress?: () => void;
  onEndDatePress?: () => void;
  type?: 'ONE_YEAR' | 'TWO_WEEKS';
  startDateValue: string | undefined;
  endDateValue: string | undefined;
}

const DateFilter: React.FC<Props> = memo(props => {
  const {onEndDatePress, onStartDatePress, type = 'ONE_YEAR', endDateValue, startDateValue} = props;

  return (
    <View style={styles.containerStyle}>
      <CustomText forDriveMe family={FONT_FAMILY.MEDIUM} size={FONT.CAPTION_7} string="조회기간" />
      <CustomText
        forDriveMe
        color={colors.lineCancel}
        string={
          type === 'ONE_YEAR'
            ? '최대 1년전 내역부터 월단위로만 조회가 가능합니다.'
            : '최대 2주까지 조회 가능합니다.'
        }
      />
      <HStack
        style={{
          gap: widthScale1(8),
        }}>
        <Pressable
          onPress={onStartDatePress}
          style={[
            styles.buttonWrapperStyle,
            {
              borderColor: colors.disableButton,
            },
          ]}>
          <CustomText
            textStyle={styles.dateTextStyle}
            forDriveMe
            family={FONT_FAMILY.MEDIUM}
            string={startDateValue && startDateValue?.length > 0 ? startDateValue : '시작'}
            color={startDateValue ? colors.menuTextColor : colors.disableButton}
          />

          <Icons.Date />
        </Pressable>

        <CustomText forDriveMe color={colors.black} string="~" />

        <Pressable
          onPress={onEndDatePress}
          style={[
            styles.buttonWrapperStyle,
            {
              borderColor: colors.disableButton,
            },
          ]}>
          <CustomText
            textStyle={styles.dateTextStyle}
            forDriveMe
            family={FONT_FAMILY.MEDIUM}
            string={endDateValue && endDateValue?.length > 0 ? endDateValue : '마지막'}
            color={endDateValue ? colors.menuTextColor : colors.disableButton}
          />

          <Icons.Date />
        </Pressable>
      </HStack>
    </View>
  );
});

export default DateFilter;

const styles = StyleSheet.create({
  containerStyle: {
    gap: heightScale1(10),
  },
  buttonWrapperStyle: {
    borderWidth: 1,
    gap: widthScale1(10),
    flex: 1,
    minHeight: heightScale1(48),
    paddingHorizontal: widthScale1(16),
    paddingVertical: heightScale1(15),
    borderRadius: scale1(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTextStyle: {
    flex: 1,
  },
});
