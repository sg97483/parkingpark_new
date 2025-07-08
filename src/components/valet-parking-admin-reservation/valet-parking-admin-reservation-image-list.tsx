import {useNavigation} from '@react-navigation/native';
import React, {memo, useRef} from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import {PADDING, PADDING_HEIGHT} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ImageProps, PaymentHistoryProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {fontSize} from '~styles/typography';
import {getImageURL} from '~utils/getImageURL';

interface IProps {
  payment: PaymentHistoryProps;
  style?: ViewStyle;
  setCarImageNumber: (carNum: number) => void;
  getImageCar: () => ImageProps | null;
  setImage1: (image: ImageProps | null) => void;
  setImage2: (image: ImageProps | null) => void;
  setImage3: (image: ImageProps | null) => void;
  setImage4: (image: ImageProps | null) => void;
  setImage5: (image: ImageProps | null) => void;
}

interface ItemProps {
  title: string;
  image: any;
  contentStyle?: ViewStyle;
  onPress: () => void;
}

const ImageItem = ({title, image, contentStyle, onPress}: ItemProps) => {
  return (
    <TouchableOpacity style={[styles.itemContainer, contentStyle]} onPress={onPress}>
      <View style={styles.imageWrapper}>
        <Image source={image} style={styles.image} resizeMode="contain" />
      </View>
      <Text style={styles.imageTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const ValetParkingAdminReservationImageList: React.FC<IProps> = props => {
  const {
    style,
    payment,
    setCarImageNumber,
    getImageCar,
    setImage1,
    setImage2,
    setImage3,
    setImage4,
    setImage5,
  } = props;
  const navigation: UseRootStackNavigation = useNavigation();
  const imageMainPickerRef = useRef<ImagePickerModalRefs>(null);
  const imageFrontPickerRef = useRef<ImagePickerModalRefs>(null);
  const imageLeftPickerRef = useRef<ImagePickerModalRefs>(null);
  const imageRightPickerRef = useRef<ImagePickerModalRefs>(null);
  const imageEndPickerRef = useRef<ImagePickerModalRefs>(null);

  const getImage = (imageUri: number) => {
    if (getImageCar()) {
      return getImageCar();
    }
    return {uri: getImageURL(imageUri, true)};
  };
  return (
    <View style={[styles.container, style]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ImageItem
          image={getImage(payment?.carImage1Id)}
          title={strings.valet_parking_admin_reservation_1.main_board_image}
          onPress={() => {
            if (payment?.carImage1Id) {
              navigation.navigate(ROUTE_KEY.ValetParkingImageDetail, {
                imageUrl: getImageURL(payment?.carImage1Id, true),
                paymentHistoryId: Number(payment?.id),
                number: 1,
              });
            } else {
              setCarImageNumber(1);
              imageMainPickerRef?.current?.show();
            }
          }}
        />

        <ImageItem
          image={getImage(payment?.carImage2Id)}
          title={strings.valet_parking_admin_reservation_1.front_image}
          onPress={() => {
            if (payment?.carImage2Id) {
              navigation.navigate(ROUTE_KEY.ValetParkingImageDetail, {
                imageUrl: getImageURL(payment?.carImage2Id, true),
                paymentHistoryId: Number(payment?.id),
                number: 2,
              });
            } else {
              setCarImageNumber(2);
              imageFrontPickerRef?.current?.show();
            }
          }}
        />

        <ImageItem
          image={getImage(payment?.carImage3Id)}
          title={strings.valet_parking_admin_reservation_1.left_image}
          onPress={() => {
            if (payment?.carImage3Id) {
              navigation.navigate(ROUTE_KEY.ValetParkingImageDetail, {
                imageUrl: getImageURL(payment?.carImage3Id, true),
                paymentHistoryId: Number(payment?.id),
                number: 3,
              });
            } else {
              setCarImageNumber(3);
              imageLeftPickerRef?.current?.show();
            }
          }}
        />

        <ImageItem
          image={getImage(payment?.carImage4Id)}
          title={strings.valet_parking_admin_reservation_1.right_image}
          onPress={() => {
            if (payment?.carImage4Id) {
              navigation.navigate(ROUTE_KEY.ValetParkingImageDetail, {
                imageUrl: getImageURL(payment?.carImage4Id, true),
                paymentHistoryId: Number(payment?.id),
                number: 4,
              });
            } else {
              setCarImageNumber(4);
              imageRightPickerRef?.current?.show();
            }
          }}
        />

        <ImageItem
          image={getImage(payment?.carImage5Id)}
          title={strings.valet_parking_admin_reservation_1.end_image}
          onPress={() => {
            if (payment?.carImage5Id) {
              navigation.navigate(ROUTE_KEY.ValetParkingImageDetail, {
                imageUrl: getImageURL(payment?.carImage5Id, true),
                paymentHistoryId: Number(payment?.id),
                number: 5,
              });
            } else {
              setCarImageNumber(5);
              imageEndPickerRef?.current?.show();
            }
          }}
        />
      </ScrollView>

      {/* Image Picker */}
      <ImagePickerModal ref={imageMainPickerRef} onImage={setImage1} />
      <ImagePickerModal ref={imageFrontPickerRef} onImage={setImage2} />
      <ImagePickerModal ref={imageLeftPickerRef} onImage={setImage3} />
      <ImagePickerModal ref={imageRightPickerRef} onImage={setImage4} />
      <ImagePickerModal ref={imageEndPickerRef} onImage={setImage5} />
    </View>
  );
};

export default memo(ValetParkingAdminReservationImageList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray,
    paddingHorizontal: PADDING / 2,
    paddingVertical: PADDING_HEIGHT / 2,
    marginHorizontal: PADDING / 2,
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    borderColor: colors.gray,
    borderWidth: 1,
    width: widthScale(100),
    height: heightScale(100),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageTitle: {
    fontSize: fontSize(12),
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    marginTop: heightScale(5),
  },
});
