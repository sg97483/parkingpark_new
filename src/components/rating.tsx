import React, {memo} from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Icons} from '~/assets/svgs';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {widthScale1} from '~styles/scaling-utils';
import CustomText from './custom-text';

interface Props {
  rating: number;
  text?: string;
  onPressText?: () => void;
  size?: number;
  iconStyle?: StyleProp<ViewStyle>;
  ratingText?: FONT;
}

const RatingDisplay = (props: Props) => {
  const {rating, text, onPressText, size = 22, iconStyle, ratingText = FONT.CAPTION_8} = props;

  const star = Math.floor(rating);

  return (
    <View style={styles.view}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <CustomText
          size={ratingText}
          string={rating.toFixed(1)}
          family={FONT_FAMILY.SEMI_BOLD}
          forDriveMe
        />

        <View style={{flexDirection: 'row', marginLeft: widthScale1(6)}}>
          {Array.from({length: 5}).map((_, i) => {
            if (i < star) {
              return (
                <Icons.StarFill
                  width={widthScale1(size)}
                  height={widthScale1(size)}
                  key={i}
                  style={[styles.icon, iconStyle]}
                />
              );
            }
            return (
              <Icons.Star
                width={widthScale1(size)}
                height={widthScale1(size)}
                key={i}
                style={[styles.icon, iconStyle]}
                stroke={colors.disableButton}
              />
            );
          })}
        </View>
      </View>

      {!!text && (
        <Pressable onPress={onPressText}>
          <CustomText
            family={FONT_FAMILY.MEDIUM}
            forDriveMe
            string={text}
            color={colors.grayText}
          />
        </Pressable>
      )}
    </View>
  );
};

export default memo(RatingDisplay);

const styles = StyleSheet.create({
  icon: {
    marginRight: widthScale1(2),
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
