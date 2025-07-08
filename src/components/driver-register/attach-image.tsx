import {Pressable, StyleSheet, View, ViewStyle} from 'react-native';
import React, {memo} from 'react';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {StyleProp} from 'react-native';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import Plus from '~/assets/svgs/Plus';
import FastImage from 'react-native-fast-image';
import {fontSize1} from '~styles/typography';

interface Props {
  title: string;
  textAttachment: string;
  containerStyle?: StyleProp<ViewStyle>;
  onPress: () => void;
  image?: string;
}

const AttachImage: React.FC<Props> = memo(props => {
  const {title, containerStyle, textAttachment, onPress, image} = props;

  return (
    <View style={containerStyle}>
      <CustomText
        string={title}
        family={FONT_FAMILY.MEDIUM}
        size={FONT.CAPTION_6}
        color={colors.black}
        lineHeight={fontSize1(20)}
        forDriveMe
      />

      {image ? (
        <Pressable style={styles.boxImage} onPress={onPress}>
          <FastImage
            source={{uri: image}}
            style={{width: '100%', height: '100%'}}
            resizeMode="cover"
          />
        </Pressable>
      ) : (
        <Pressable style={styles.boxAttachment} onPress={onPress}>
          <View style={styles.circlePlus}>
            <Plus width={widthScale1(16.5)} height={heightScale1(16.5)} />
          </View>

          <CustomText
            string={textAttachment}
            family={FONT_FAMILY.REGULAR}
            size={FONT.CAPTION_6}
            color={colors.lineCancel}
            lineHeight={fontSize1(20)}
            forDriveMe
          />
        </Pressable>
      )}
    </View>
  );
});

export default AttachImage;

const styles = StyleSheet.create({
  boxAttachment: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderDashed,
    borderStyle: 'dashed',
    borderRadius: widthScale1(8),
    marginTop: heightScale1(10),
    minHeight: heightScale1(174),
  },
  circlePlus: {
    padding: widthScale1(7.75),
    shadowOffset: {height: 3, width: 0},
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: widthScale1(999),
    backgroundColor: colors.white,
    elevation: 8,
    marginBottom: heightScale1(20),
  },
  boxImage: {
    borderRadius: widthScale1(8),
    overflow: 'hidden',
    height: heightScale1(174),
    marginTop: heightScale1(10),
  },
});
