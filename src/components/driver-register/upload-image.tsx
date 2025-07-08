import React, {memo} from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  title: string;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  boxStyle?: StyleProp<ViewStyle>;
  image?: string;
}

const UploadImage: React.FC<Props> = memo(props => {
  const {title, onPress, containerStyle, image, boxStyle} = props;

  return (
    <View style={[styles.container, containerStyle]}>
      {image ? (
        <Pressable style={[styles.boxImage, boxStyle]} onPress={onPress}>
          <FastImage
            source={{uri: image}}
            style={{width: '100%', height: '100%'}}
            resizeMode="cover"
          />
        </Pressable>
      ) : (
        <Pressable style={[styles.boxUpload, boxStyle]} onPress={onPress}>
          <Icons.Plus stroke={colors.lineInput} />
        </Pressable>
      )}

      <CustomText
        string={title}
        family={FONT_FAMILY.MEDIUM}
        textStyle={{alignSelf: 'center', paddingTop: heightScale1(10)}}
        lineHeight={heightScale1(20)}
        forDriveMe
      />
    </View>
  );
});

export default UploadImage;

const styles = StyleSheet.create({
  container: {
    width: widthScale1(160),
  },
  boxUpload: {
    width: '100%',
    height: heightScale1(160),
    borderWidth: 1,
    borderColor: colors.grayCheckBox,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale1(4),
  },
  boxImage: {
    width: '100%',
    height: heightScale1(160),
    borderRadius: scale1(4),
    overflow: 'hidden',
  },
});
