import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import ReactNativeModal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icons} from '~/assets/svgs';
import {PADDING} from '~constants/constant';
import {colors} from '~styles/colors';
import {scale, widthScale} from '~styles/scaling-utils';

export interface ImageViewRefs {
  show: (imageURL: string) => void;
}

const ImageViewer = forwardRef((_, ref) => {
  const insets = useSafeAreaInsets();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [imageURL, setImageURL] = useState<string>('');

  const show = (imageURL: string) => {
    setImageURL(imageURL);
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
    setImageURL('');
  };

  useImperativeHandle(
    ref,
    () => ({
      show,
    }),
    [],
  );

  return (
    <ReactNativeModal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      isVisible={isVisible}
      useNativeDriver
      backdropOpacity={0.9}
      onBackButtonPress={hide}>
      <View style={styles.container}>
        <FastImage source={{uri: imageURL}} style={styles.image} resizeMode="contain" />

        <Pressable
          hitSlop={40}
          style={[
            styles.closeButtonStyle,
            {
              bottom: insets.bottom + PADDING / 2,
            },
          ]}
          onPress={hide}>
          <Icons.IconX stroke={colors.white} />
        </Pressable>
      </View>
    </ReactNativeModal>
  );
});

export default ImageViewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '70%',
    borderRadius: scale(8),
  },
  closeButtonStyle: {
    position: 'absolute',
    backgroundColor: colors.heavyGray,
    width: widthScale(44),
    height: widthScale(44),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
  },
});
