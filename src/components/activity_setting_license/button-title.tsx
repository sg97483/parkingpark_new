import React from 'react';
import {Image, StyleSheet, View, ViewStyle} from 'react-native';
import CustomText from '~components/custom-text';
import ButtonImage from '~components/setting-passenger/button-image';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

interface Props {
  textContent: string;
  style?: ViewStyle;
  title: string;
  titleContent?: string;
  onPress?: () => void;
  uri?: string;
  important?: boolean;
  uriPath?: any;
}

const ButtonTitle = ({
  textContent,
  style,
  title,
  titleContent,
  onPress,
  uri,
  important,
  uriPath,
}: Props) => {
  return (
    <View style={style}>
      <View
        style={[
          styles.viewTitle,
          {
            marginBottom: titleContent ? heightScale(6) : 0,
          },
        ]}>
        <CustomText string={title} />
        {important && <View style={styles.dot} />}
      </View>
      {!!titleContent && <CustomText string={titleContent} color={colors.grayText1} />}
      {onPress ? (
        <ButtonImage onPress={onPress} text={textContent} uri={uri} />
      ) : (
        <Image source={uriPath} style={styles.img} resizeMode={'contain'} />
      )}
    </View>
  );
};

export default ButtonTitle;

const styles = StyleSheet.create({
  dot: {
    width: widthScale(5),
    height: widthScale(5),
    backgroundColor: colors.redButton,
    borderRadius: 100,
    marginLeft: widthScale(4),
  },
  viewTitle: {
    flexDirection: 'row',
  },
  img: {
    height: heightScale(260),
    width: '100%',
  },
});
