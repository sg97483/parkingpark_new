import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import {ICONS} from '~/assets/images-path';
import CustomText from '~components/custom-text';
import {FONT_FAMILY, FONT} from '~constants/enum';
import {colors} from '~styles/colors';
import {widthScale, heightScale} from '~styles/scaling-utils';
import FastImage from 'react-native-fast-image';

interface Props {
  onPress: () => void;
  uri?: string;
  text: string;
  style?: ViewStyle;
}

const ButtonImage = ({onPress, uri, text, style}: Props) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.5} style={[styles.img, style]}>
      {uri ? (
        <FastImage
          source={{
            uri: uri,
            cache: FastImage.cacheControl.web,
          }}
          resizeMode="contain"
          style={styles.image}
        />
      ) : (
        <>
          <FastImage source={ICONS.btn_camera} resizeMode="contain" style={styles.imgIcon} />
          <CustomText
            string={text}
            family={FONT_FAMILY.SEMI_BOLD}
            color={colors.grayText}
            size={FONT.CAPTION_4}
          />
        </>
      )}
    </TouchableOpacity>
  );
};

export default ButtonImage;

const styles = StyleSheet.create({
  img: {
    height: heightScale(220),
    marginVertical: heightScale(15),
    borderRadius: widthScale(10),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: widthScale(1.5),
    borderColor: colors.gray,
    borderStyle: 'dashed',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.lightGray,
  },
  imgIcon: {
    width: widthScale(70),
    height: widthScale(70),
  },
});
