import React, {useRef} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ICONS} from '~/assets/images-path';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import ImageViewer, {ImageViewRefs} from '~components/image-viewer';
import {PADDING} from '~constants/constant';
import {PhotoOfParkingProps} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

interface IProps {
  item: PhotoOfParkingProps;
  onPressDeletePhoto: () => void;
}

const TakePhotoParkingLotItem = ({item, onPressDeletePhoto}: IProps) => {
  const imageViewerRef = useRef<ImageViewRefs>(null);

  return (
    // 👇 이 부분이 수정되었습니다. (그림자를 담당하는 View로 감싸기)
    <View style={styles.shadowContainer}>
      <View style={styles.contentWrapper}>
        <HStack style={{justifyContent: 'space-between'}}>
          {/* Image */}
          <TouchableOpacity onPress={() => item?.uri && imageViewerRef.current?.show(item?.uri)}>
            <Image source={{uri: item?.uri}} style={styles.image} resizeMode="cover" />
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity onPress={onPressDeletePhoto} style={styles.closeIcon}>
            <Image source={ICONS.close} style={styles.closeIconInner} />
          </TouchableOpacity>

          {/* Image Info */}
          <View style={styles.rightContent}>
            {item?.name ? <CustomText string={item?.name} /> : null}

            {item?.date ? (
              <CustomText string={item?.date} textStyle={{marginTop: heightScale(5)}} />
            ) : null}
          </View>
        </HStack>

        {/* Image Viewer */}
        <ImageViewer ref={imageViewerRef} />
      </View>
    </View>
  );
};

export default TakePhotoParkingLotItem;

const styles = StyleSheet.create({
  // 그림자를 담당하는 외부 컨테이너
  shadowContainer: {
    width: '100%',
    shadowColor: '#7b7878',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3, // 표준적인 그림자 투명도 값으로 조정 (0 ~ 1 사이)
    shadowRadius: 5.62,
    elevation: 5,
    marginTop: heightScale(10),
  },
  // 실제 내용을 담는 내부 컨테이너
  contentWrapper: {
    backgroundColor: colors.white,
    padding: PADDING / 2,
    overflow: 'hidden', // 내부 콘텐츠가 그림자에 영향을 주지 않도록
    // borderRadius가 있다면 여기에 추가 (현재 코드에는 없음)
  },
  closeIcon: {
    width: widthScale(20),
    height: widthScale(20),
    borderRadius: widthScale(12),
    borderWidth: 1,
    borderColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    position: 'absolute',
    right: PADDING / 2, // contentWrapper의 padding을 고려하여 조정
    top: PADDING / 2, // contentWrapper의 padding을 고려하여 조정
    zIndex: 9999,
  },
  image: {
    aspectRatio: 1,
    width: widthScale(100),
  },
  rightContent: {
    flex: 1,
    marginLeft: widthScale(12),
    justifyContent: 'center',
  },
  closeIconInner: {
    width: widthScale(10),
    height: widthScale(10),
    tintColor: colors.red,
  },
});
