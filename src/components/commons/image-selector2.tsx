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
import Plus from '~/assets/svgs/Plus';
import {FONT, FONT_FAMILY} from '~constants/enum';

interface Props {
  imageURI: ImageProps | string | null;
  onRemovePress?: () => void;
  mode?: 'ADD' | 'VIEW';
  onImage?: (value: ImageProps) => void;
}

const ImageSelector2: React.FC<Props> = memo(props => {
  const {imageURI, onRemovePress, mode = 'ADD', onImage} = props;
  const imagePickerRef = useRef<ImagePickerModalRefs>(null);
  const imageViewerRef = useRef<ImageViewRefs>(null);

  if (imageURI) {
    return (
      <View style={styles.boxImage}>
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
            style={styles.boxAttachment}>
            <View style={styles.circlePlus}>
              <Plus width={widthScale1(16.5)} height={heightScale1(16.5)} />
            </View>
            <CustomText
              string="현장결제 영수증을 첨부해주세요."
              family={FONT_FAMILY.REGULAR}
              size={FONT.CAPTION_6}
              color={colors.lineCancel}
              lineHeight={heightScale1(20)}
              forDriveMe
            />
          </Pressable>
          <ImagePickerModal ref={imagePickerRef} onImage={onImage as any} />
        </View>
      );
    } else {
      return (
        <View style={styles.noImageWrapper}>
          <Icons.IconX stroke={colors.disableButton} />
          <CustomText
            string="이미지 없음"
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

export default ImageSelector2;

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
  imageStyle: {
    width: '100%',
    height: '100%',
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
  noImageWrapper: {
    width: widthScale1(80),
    height: widthScale1(80),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale1(4),
    borderColor: colors.grayCheckBox,
  },
});
