import React, {memo, useRef} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import ImageViewer, {ImageViewRefs} from '~components/image-viewer';
import {ImageProps} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  imageURI: ImageProps | string | null;
  onRemovePress?: () => void;
  mode?: 'ADD' | 'VIEW';
  onImage?: (value: ImageProps) => void;
}

const ImageSelector: React.FC<Props> = memo(props => {
  const {imageURI, onRemovePress, mode = 'ADD', onImage} = props;
  const imagePickerRef = useRef<ImagePickerModalRefs>(null);
  const imageViewerRef = useRef<ImageViewRefs>(null);

  if (imageURI) {
    return (
      <View style={styles.imageStyle}>
        <Pressable
          onPress={() => {
            if (mode === 'VIEW') {
              imageViewerRef?.current?.show(
                typeof imageURI === 'string' ? imageURI : imageURI?.uri,
              );
            }
          }}>
          <FastImage
            source={{
              uri: typeof imageURI === 'string' ? imageURI : imageURI?.uri,
            }}
            style={styles.imageStyle}
          />
        </Pressable>
        {mode === 'ADD' && (
          <Pressable onPress={onRemovePress} hitSlop={40} style={styles.removeButtonStyle}>
            <Icons.IconX width={widthScale1(16)} height={widthScale1(16)} stroke={colors.white} />
          </Pressable>
        )}

        <ImageViewer ref={imageViewerRef} />
      </View>
    );
  } else {
    if (mode === 'ADD') {
      return (
        <View>
          <Pressable
            onPress={() => {
              imagePickerRef?.current?.show();
            }}
            style={styles.imageWrapperStyle}>
            <Icons.Camera stroke={colors.disableButton} />
          </Pressable>
          <ImagePickerModal ref={imagePickerRef} onImage={onImage as any} />
        </View>
      );
    } else {
      return (
        <View style={[styles.imageWrapperStyle]}>
          <Icons.IconX stroke={colors.disableButton} />

          <CustomText
            string="이미지없음"
            color={colors.disableButton}
            textStyle={{marginTop: 4}}
            numberOfLines={1}
            forDriveMe
            lineHeight={heightScale1(19.6)}
          />
        </View>
      );
    }
  }
});

export default ImageSelector;

const styles = StyleSheet.create({
  imageStyle: {
    width: widthScale1(80),
    height: widthScale1(80),
    borderRadius: scale1(4),
  },
  removeButtonStyle: {
    width: widthScale1(20),
    height: widthScale1(20),
    borderRadius: 999,
    backgroundColor: colors.gray30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: scale1(2),
    right: scale1(2),
  },
  imageWrapperStyle: {
    width: widthScale1(80),
    height: widthScale1(80),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale1(4),
    borderColor: colors.grayCheckBox,
  },
});
