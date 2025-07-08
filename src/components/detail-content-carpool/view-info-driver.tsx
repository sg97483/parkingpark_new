import React, {memo} from 'react';
import {Image, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import {FONT} from '~constants/enum';
import {colors} from '~styles/colors';
import {widthScale} from '~styles/scaling-utils';

interface Props {
  image: string;
  name: string;
  isEvaluate?: boolean;
  isTick?: boolean;
  onPressImage?: () => void;
  style?: StyleProp<ViewStyle>;
  onPressEvaluate?: () => void;
}

const ViewInfoDriver = (props: Props) => {
  const {image, name, isEvaluate, isTick, onPressImage, style, onPressEvaluate} = props;

  return (
    <View style={[styles.view, style]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={onPressImage}>
          <Image style={styles.image} source={{uri: image}} />
        </TouchableOpacity>
        <View style={{justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CustomText size={FONT.SUB_HEAD} string={name} />
            {isTick && <Icons.VerificationMark />}
          </View>
          <TouchableOpacity
            disabled={!isEvaluate}
            onPress={onPressEvaluate}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <CustomText size={FONT.CAPTION} color={colors.grayText} string={'내평가 '} />
            {isEvaluate ? (
              <>
                <CustomText size={FONT.CAPTION} color={colors.disableButton} string={'평가없음'} />
                <Icons.ChevronRight />
              </>
            ) : (
              <CustomText size={FONT.CAPTION} color={colors.disableButton} string={'평가없음'} />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Icons.Star />
    </View>
  );
};

export default memo(ViewInfoDriver);
const styles = StyleSheet.create({
  view: {flexDirection: 'row', justifyContent: 'space-between'},
  image: {
    width: widthScale(42),
    height: widthScale(42),
    borderRadius: 100,
    marginRight: widthScale(6),
  },
});
