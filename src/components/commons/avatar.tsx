import React, {memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import {colors} from '~styles/colors';
import {widthScale1} from '~styles/scaling-utils';

interface Props {
  uri?: string;
  size?: number; //If size has been declared, width and height are not needed
  width?: number;
  height?: number;
  blurImage?: boolean;
  showVerifyMark?: boolean;
  disabled?: boolean;
}

const Avatar: React.FC<Props> = memo(props => {
  const {height, size, uri, blurImage, width, showVerifyMark = false, disabled} = props;

  if (disabled) {
    return (
      <View
        style={[
          styles.containerStyle,
          size
            ? {
                width: widthScale1(size),
                height: widthScale1(size),
              }
            : {
                width,
                height,
              },
          ,
          {
            backgroundColor: colors.grayCheckBox,
            borderRadius: 999,
          },
        ]}
      />
    );
  }

  if (uri) {
    return (
      <View style={styles.containerStyle}>
        <Image
          source={{
            uri: uri,
          }}
          blurRadius={blurImage ? 40 : 0}
          resizeMode="cover"
          style={[
            styles.avatarStyle,
            size
              ? {
                  width: widthScale1(size),
                  height: widthScale1(size),
                }
              : {
                  width,
                  height,
                },
          ]}
        />
        {showVerifyMark && <Icons.VerificationMark style={styles.verifyMarkStyle} />}
      </View>
    );
  }

  return (
    <View style={styles.containerStyle}>
      <Icons.NonProfile width={widthScale1(size)} height={widthScale1(size)} />
      {showVerifyMark && <Icons.VerificationMark style={styles.verifyMarkStyle} />}
    </View>
  );
});

export default Avatar;

const styles = StyleSheet.create({
  avatarStyle: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  verifyMarkStyle: {
    position: 'absolute',
    right: 0,
  },
  containerStyle: {
    alignItems: 'center',
    alignSelf: 'center',
  },
});
