import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {ChargeProps} from '~constants/types';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {Icons} from '~/assets/svgs';
import {colors} from '~styles/colors';
import {getNumberWithCommas} from '~utils/numberUtils';
import {dayjs} from '~utils/dayjsUtil';
import {FONT, FONT_FAMILY} from '~constants/enum';

interface Props {
  item: ChargeProps;
}

const ChargeItem: React.FC<Props> = memo(props => {
  const {item} = props;

  return (
    <PaddingHorizontalWrapper forDriveMe>
      <HStack style={styles.containerStyle}>
        {Number(item?.usePointSklent) > 0 ? (
          <Icons.MinusCircle stroke={colors.lineCancel} />
        ) : (
          <Icons.PlusCircle stroke={colors.lineCancel} />
        )}

        <View style={styles.contentStyle}>
          <CustomText
            numberOfLines={1}
            forDriveMe
            size={FONT.CAPTION_7}
            family={FONT_FAMILY.MEDIUM}
            string={item?.totalTicketType}
          />
          <CustomText
            forDriveMe
            family={FONT_FAMILY.MEDIUM}
            color={colors.grayText}
            string={`${dayjs(item?.createDate).format('YYYY.MM.DD')}`}
          />
        </View>

        <CustomText
          forDriveMe
          size={FONT.CAPTION_7}
          family={FONT_FAMILY.MEDIUM}
          string={`${getNumberWithCommas(
            item?.usePointSklent > 0 ? item?.usePointSklent : item?.amt,
          )}원`}
        />
      </HStack>
    </PaddingHorizontalWrapper>
  );
});

export default ChargeItem;

const styles = StyleSheet.create({
  containerStyle: {
    minHeight: heightScale1(84),
    gap: widthScale1(10),
  },
  contentStyle: {
    flex: 1,
    gap: heightScale1(2),
  },
});
