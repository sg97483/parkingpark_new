import React, {memo} from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import {PADDING1} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  title: string;
  subTitle?: string;
  content: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  sourceImage?: ImageSourcePropType;
}

const ViewCardImage = (props: Props) => {
  const {subTitle, title, content, style, onPress, sourceImage} = props;

  return (
    <View style={style}>
      <CustomText
        lineHeight={heightScale1(20)}
        color={colors.black}
        forDriveMe
        string={title}
        family={FONT_FAMILY.MEDIUM}
      />

      {!!subTitle && (
        <CustomText
          lineHeight={heightScale1(20)}
          color={colors.lineCancel}
          string={subTitle}
          textStyle={styles.subtitle}
        />
      )}

      <Pressable onPress={onPress} style={[styles.viewImage, sourceImage ? {borderWidth: 0} : {}]}>
        {sourceImage ? (
          <Image style={styles.image} source={sourceImage} resizeMode="cover" />
        ) : (
          <>
            <View style={styles.viewPlus}>
              <Icons.Plus />
            </View>
            <CustomText
              color={colors.lineCancel}
              string={content}
              textStyle={styles.content}
              forDriveMe
              lineHeight={heightScale1(20)}
            />
          </>
        )}
      </Pressable>
    </View>
  );
};

export default memo(ViewCardImage);

const styles = StyleSheet.create({
  viewImage: {
    borderRadius: scale1(8),
    height: heightScale1(175),
    marginTop: heightScale1(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderDashed,
    overflow: 'hidden',
  },
  viewPlus: {
    width: widthScale1(32),
    height: widthScale1(32),
    backgroundColor: colors.white,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.shadowColor,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    shadowOpacity: 0.05,
  },
  content: {
    marginTop: PADDING1,
  },
  subtitle: {
    marginTop: heightScale1(4),
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: scale1(8),
  },
});
