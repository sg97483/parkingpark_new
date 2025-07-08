import {FlashList} from '@shopify/flash-list';
import React, {useEffect, useRef, useState} from 'react';
import {Alert, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {ICONS, IMAGES} from '~/assets/images-path';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import TakePhotoParkingLotItem from '~components/take-photo-parking-lot/take-photo-parking-lot-item';
import TakePhotoParkingModal, {
  TakePhotoParkingModalRefs,
} from '~components/take-photo-parking-lot/take-photo-parking-modal';
import {PADDING, PADDING_HEIGHT} from '~constants/constant';
import {strings} from '~constants/strings';
import {ImageProps, PhotoOfParkingProps} from '~constants/types';
import {cacheParkingPhotos} from '~reducers/parkingReducer';
import {useAppSelector} from '~store/storeHooks';
import {heightScale, widthScale} from '~styles/scaling-utils';

const TakePhotoParkingLot = () => {
  const imagePickerRef = useRef<ImagePickerModalRefs>(null);

  const takePhotoParkingModalRef = useRef<TakePhotoParkingModalRefs>(null);

  const [image, setImage] = useState<ImageProps | null>(null);

  const dispatch = useDispatch();

  const parkingPhotos = useAppSelector(state => state?.parkingReducer?.parkingPhotos);

  useEffect(() => {
    if (image) {
      setTimeout(() => {
        takePhotoParkingModalRef?.current?.show(image);
      }, 500);
    }
  }, [image]);

  const handleAddImage = (item: PhotoOfParkingProps) => {
    let photos = [...parkingPhotos];
    photos.push(item);
    dispatch(cacheParkingPhotos(photos));
  };

  const handleRemoveImage = (item: PhotoOfParkingProps) => {
    if (parkingPhotos.some(photo => photo.uri === item.uri)) {
      let photos = [...parkingPhotos];
      photos = photos.filter(photo => photo.uri !== item?.uri);
      dispatch(cacheParkingPhotos(photos));
    }
  };

  const onPressDeletePhoto = (item: PhotoOfParkingProps) => {
    Alert.alert('', strings?.general_text?.are_you_sure_to_delete, [
      {
        text: strings?.general_text?.agree,
        onPress: () => handleRemoveImage(item),
      },
      {
        text: strings?.general_text?.cancel,
        style: 'cancel',
      },
    ]);
  };

  const renderListPhoto = ({item}: {item: PhotoOfParkingProps}) => {
    return (
      <TakePhotoParkingLotItem item={item} onPressDeletePhoto={() => onPressDeletePhoto(item)} />
    );
  };

  return (
    <FixedContainer>
      <CustomHeader text={strings.take_photo_parking_lot.take_picture_of_parking} />

      {parkingPhotos?.length ? (
        <View style={{flex: 1}}>
          <FlashList
            contentContainerStyle={{
              paddingHorizontal: PADDING / 2,
              paddingBottom: PADDING_HEIGHT / 2,
            }}
            estimatedItemSize={200}
            data={parkingPhotos}
            renderItem={renderListPhoto}
          />
        </View>
      ) : (
        <View style={styles.content}>
          <Image source={IMAGES.img_notp} style={styles.imageBg} resizeMode="contain" />
        </View>
      )}

      {/* modal */}
      <TakePhotoParkingModal ref={takePhotoParkingModalRef} handleAddImage={handleAddImage} />

      {/* add image button */}
      <TouchableOpacity style={styles.cameraButton} onPress={() => imagePickerRef.current?.show()}>
        <Image source={ICONS.btn_camera} style={styles.iconCamera} />
      </TouchableOpacity>

      {/* Image Picker */}
      <ImagePickerModal ref={imagePickerRef} onImage={setImage} />
    </FixedContainer>
  );
};

export default TakePhotoParkingLot;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBg: {
    width: widthScale(200),
    aspectRatio: 1,
  },
  iconCamera: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  cameraButton: {
    width: widthScale(80),
    height: heightScale(80),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: widthScale(22),
    bottom: heightScale(24),
  },
  closeIconInner: {
    width: widthScale(12),
    height: widthScale(12),
    tintColor: 'black',
  },
});
