import React, {memo, useRef} from 'react';
import {Image, ScrollView, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import {PADDING_HEIGHT} from '~constants/constant';
import {ImageProps} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {IMAGES} from '~/assets/images-path';

interface IProps {
  style?: ViewStyle;
  image1: ImageProps | null;
  image2: ImageProps | null;
  image3: ImageProps | null;
  image4: ImageProps | null;
  setImage1: (image: ImageProps | null) => void;
  setImage2: (image: ImageProps | null) => void;
  setImage3: (image: ImageProps | null) => void;
  setImage4: (image: ImageProps | null) => void;
}

interface ItemProps {
  image: ImageProps | null;
  contentStyle?: ViewStyle;
  onPress: () => void;
}

const ImageItem = ({image, contentStyle, onPress}: ItemProps) => {
  return (
    <TouchableOpacity style={[styles.itemContainer, contentStyle]} onPress={onPress}>
      <View style={styles.imageWrapper}>
        <Image
          source={image?.uri ? {uri: image.uri} : IMAGES.no_image} // 이미지가 없으면 no_image 사용
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
};

const RegisterParkingSharedImageList: React.FC<IProps> = props => {
  const {style, image1, image2, image3, image4, setImage1, setImage2, setImage3, setImage4} = props;
  const image1PickerRef = useRef<ImagePickerModalRefs>(null);
  const image2PickerRef = useRef<ImagePickerModalRefs>(null);
  const image3PickerRef = useRef<ImagePickerModalRefs>(null);
  const image4PickerRef = useRef<ImagePickerModalRefs>(null);

  return (
    <View style={[styles.container, style]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ImageItem
          image={image1}
          onPress={() => {
            image1PickerRef?.current?.show();
          }}
        />

        <ImageItem
          image={image2}
          onPress={() => {
            image2PickerRef?.current?.show();
          }}
          contentStyle={{marginLeft: widthScale(3)}}
        />

        <ImageItem
          image={image3}
          onPress={() => {
            image3PickerRef?.current?.show();
          }}
          contentStyle={{marginLeft: widthScale(3)}}
        />

        <ImageItem
          image={image4}
          onPress={() => {
            image4PickerRef?.current?.show();
          }}
          contentStyle={{marginLeft: widthScale(3)}}
        />
      </ScrollView>

      {/* Image Picker */}
      <ImagePickerModal ref={image1PickerRef} onImage={setImage1} />
      <ImagePickerModal ref={image2PickerRef} onImage={setImage2} />
      <ImagePickerModal ref={image3PickerRef} onImage={setImage3} />
      <ImagePickerModal ref={image4PickerRef} onImage={setImage4} />
    </View>
  );
};

export default memo(RegisterParkingSharedImageList);

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    borderColor: colors.gray,
    paddingHorizontal: 0,
    paddingVertical: PADDING_HEIGHT / 2,
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    borderColor: colors.gray,
    borderWidth: 0,
    width: widthScale(90),
    height: heightScale(90),
    justifyContent: 'center', // 세로 중앙 정렬
    alignItems: 'center', // 가로 중앙 정렬
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
