import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import {PADDING, PADDING_HEIGHT} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {fontSize} from '~styles/typography';

interface IProps {
  style?: ViewStyle;
  image1: string | undefined;
  image2: string | undefined;
  image3: string | undefined;
  image4: string | undefined;
}

interface ItemProps {
  title: string;
  image: string | undefined;
  contentStyle?: ViewStyle;
  onPress: () => void;
}

const ImageItem = ({title, image, contentStyle, onPress}: ItemProps) => {
  return (
    <TouchableOpacity style={[styles.itemContainer, contentStyle]} onPress={onPress}>
      <View style={styles.imageWrapper}>
        <Image source={{uri: image || undefined}} style={styles.image} resizeMode="contain" />
      </View>
      <Text style={styles.imageTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const RegisterParkingSharedDetailImageList: React.FC<IProps> = props => {
  const {style, image1, image2, image3, image4} = props;
  const navigation: UseRootStackNavigation = useNavigation();
  return (
    <View style={[styles.container, style]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ImageItem
          image={image1}
          title={strings.register_parking_shared_detail.picture_1}
          onPress={() => {
            if (image1) {
              navigation.navigate(ROUTE_KEY.RegisterParkingSharedImageDetail, {
                imageUrl: image1,
              });
            }
          }}
        />

        <ImageItem
          image={image2}
          title={strings.register_parking_shared_detail.picture_2}
          onPress={() => {
            if (image2) {
              navigation.navigate(ROUTE_KEY.RegisterParkingSharedImageDetail, {
                imageUrl: image2,
              });
            }
          }}
          contentStyle={{marginLeft: widthScale(2)}}
        />

        <ImageItem
          image={image3}
          title={strings.register_parking_shared_detail.picture_3}
          onPress={() => {
            if (image3) {
              navigation.navigate(ROUTE_KEY.RegisterParkingSharedImageDetail, {
                imageUrl: image3,
              });
            }
          }}
          contentStyle={{marginLeft: widthScale(2)}}
        />

        <ImageItem
          image={image4}
          title={strings.register_parking_shared_detail.picture_4}
          onPress={() => {
            if (image4) {
              navigation.navigate(ROUTE_KEY.RegisterParkingSharedImageDetail, {
                imageUrl: image4,
              });
            }
          }}
          contentStyle={{marginLeft: widthScale(2)}}
        />
      </ScrollView>
    </View>
  );
};

export default memo(RegisterParkingSharedDetailImageList);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.gray,
    paddingHorizontal: PADDING / 2,
    paddingVertical: PADDING_HEIGHT / 2,
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
