import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {PointProps} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {dayjs} from '~utils/dayjsUtil';
import {getNumberWithCommas} from '~utils/numberUtils';

interface Props {
  item: PointProps;
}

const PointItem: React.FC<Props> = memo(props => {
  const {item} = props;
  return (
    <PaddingHorizontalWrapper forDriveMe>
      <HStack style={styles.containerStyle}>
        {item?.note === 'Y' ? (
          <Icons.MinusCircle stroke={colors.lineCancel} />
        ) : (
          <Icons.PlusCircle stroke={colors.lineCancel} />
        )}
        <View style={styles.contentStyle}>
          <CustomText
            size={FONT.CAPTION_7}
            forDriveMe
            family={FONT_FAMILY.MEDIUM}
            string={item?.garageName ?? ''}
            numberOfLines={1}
          />
          <CustomText
            family={FONT_FAMILY.MEDIUM}
            forDriveMe
            color={colors.grayText}
            string={dayjs(item?.regdate).format('YYYY.MM.DD')}
          />
        </View>

        <CustomText
          size={FONT.CAPTION_7}
          forDriveMe
          family={FONT_FAMILY.MEDIUM}
          string={`${getNumberWithCommas(item?.point)}원`}
        />
      </HStack>
    </PaddingHorizontalWrapper>
  );
});

export default PointItem;

const styles = StyleSheet.create({
  containerStyle: {
    minHeight: heightScale1(104),
    gap: widthScale1(10),
  },
  contentStyle: {
    flex: 1,
    gap: heightScale1(2),
  },
});
