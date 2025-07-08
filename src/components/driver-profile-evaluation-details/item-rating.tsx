import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import RatingDisplay from '~components/rating';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {DriverEvaluationModel} from '~model/driver-model';
import {colors} from '~styles/colors';
import {heightScale1, widthScale} from '~styles/scaling-utils';
import {getTimeAgo} from '~utils/hourUtils';

interface Props {
  item: DriverEvaluationModel;
}

const ItemRating = (props: Props) => {
  const {item} = props;

  const star = useMemo(
    () =>
      ((Number(item?.driverQ1) + Number(item?.driverQ2) + Number(item?.driverQ3)) / 3).toFixed(1),
    [item],
  );

  return (
    <View>
      <View style={styles.view}>
        <RatingDisplay
          rating={Number(star)}
          size={20}
          iconStyle={{marginHorizontal: widthScale(-2)}}
          ratingText={FONT.CAPTION_7}
        />
        {item?.text ? (
          <CustomText
            color={colors.grayRating}
            string={item?.text}
            textStyle={styles.text}
            forDriveMe
          />
        ) : null}

        <View style={styles.bottom}>
          <CustomText
            color={colors.lineInput}
            forDriveMe
            textStyle={styles.text}
            string={getTimeAgo(item?.regdate)}
            family={FONT_FAMILY.MEDIUM}
            size={FONT.CAPTION}
          />
        </View>
      </View>
      <Divider style={styles.dividerStyle} />
    </View>
  );
};

export default memo(ItemRating);

const styles = StyleSheet.create({
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  view: {
    paddingHorizontal: PADDING1,
  },
  text: {
    marginTop: heightScale1(10),
  },
  dividerStyle: {
    marginVertical: heightScale1(30),
  },
});
