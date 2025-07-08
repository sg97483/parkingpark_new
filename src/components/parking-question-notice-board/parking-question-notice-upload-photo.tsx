import React, {useRef} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ICONS} from '~/assets/images-path';
import Button from '~components/button';
import HStack from '~components/h-stack';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import {strings} from '~constants/strings';
import {ImageProps} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

interface IProps {
  photo: ImageProps | null;
  onSelect: (image: ImageProps | null) => void;
  onRemove: () => void;
}

const ParkingQuestionNoticeUploadPhoto = ({photo, onSelect, onRemove}: IProps) => {
  const imagePickerRef = useRef<ImagePickerModalRefs>(null);

  return (
    <View>
      <HStack style={{marginTop: heightScale(12), alignItems: 'center'}}>
        <Button
          text={strings.add_parking_request_notice.add_photo}
          style={styles.addPhotoButton}
          color={colors.transparent}
          borderColor={colors.gray}
          textColor={colors.heavyGray}
          onPress={() => imagePickerRef.current?.show()}
        />

        {/* image list */}
        {photo ? (
          <View style={styles.imageView}>
            <Image source={{uri: photo.uri}} style={styles.image} resizeMode="cover" />
            <TouchableOpacity style={styles.closeIcon} onPress={onRemove}>
              <Image source={ICONS.close} style={styles.closeIconInner} />
            </TouchableOpacity>
          </View>
        ) : null}
      </HStack>

      {/* Image Picker */}
      <ImagePickerModal ref={imagePickerRef} onImage={onSelect} />
    </View>
  );
};

export default ParkingQuestionNoticeUploadPhoto;

const styles = StyleSheet.create({
  addPhotoButton: {
    width: widthScale(120),
    borderRadius: widthScale(5),
  },
  imageView: {
    width: widthScale(60),
    height: heightScale(60),
    borderRadius: widthScale(5),
    borderWidth: 1,
    borderColor: colors.gray,
    marginLeft: widthScale(5),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  closeIcon: {
    width: widthScale(16),
    height: widthScale(16),
    borderRadius: widthScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 9999,
  },
  closeIconInner: {
    width: widthScale(10),
    height: widthScale(10),
    tintColor: colors.black,
  },
});
