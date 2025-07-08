import React, {memo, useCallback, useEffect, useMemo, useRef} from 'react';
import {Image, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import {PADDING, width} from '~constants/constant';
import HStack from '~components/h-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '~components/custom-text';
import {FONT} from '~constants/enum';
import {ICONS} from '~/assets/images-path';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import {ParkingMapProps} from '~constants/types';
import QuickViewParkingItem from './quick-view-parking-item';

interface Props {
  goToCurrentPress: () => void;
  onParkingListPress: () => void;
  onPressKakao: () => void;
  parkingListData: ParkingMapProps[];
  selectedParking: (item: ParkingMapProps | null) => void;
  selectedParkingLot: ParkingMapProps | null;
  isSearchResult?: boolean;
}

const QuickViewParking: React.FC<Props> = memo(props => {
  const {
    onParkingListPress,
    goToCurrentPress,
    onPressKakao,
    parkingListData = [],
    selectedParking,
    selectedParkingLot,
  } = props;

  const carouselRef = useRef<ICarouselInstance>(null);

  // 1. useEffect 로직 수정: 외부에서 선택된 주차장이 바뀌면, 그 주차장을 찾아 캐러셀을 스크롤합니다.
  useEffect(() => {
    if (selectedParkingLot && parkingListData.length > 0) {
      const targetIndex = parkingListData.findIndex(p => p.id === selectedParkingLot.id);

      // 해당 주차장을 목록에서 찾았고, 현재 캐러셀의 인덱스와 다를 경우에만 스크롤
      if (targetIndex > -1 && carouselRef.current?.getCurrentIndex() !== targetIndex) {
        carouselRef.current?.scrollTo({
          index: targetIndex,
          animated: true,
        });
      }
    }
  }, [selectedParkingLot, parkingListData]);

  // 2. onSnapToItem 로직 (상태 동기화): 캐러셀을 스와이프하면, 부모(MapView)의 상태를 업데이트합니다.
  const handleSnapToItem = useCallback(
    (index: number) => {
      if (parkingListData[index]) {
        selectedParking(parkingListData[index]);
      }
    },
    [parkingListData, selectedParking],
  );

  const renderItem = useCallback(
    ({item}: {item: ParkingMapProps}) => {
      // 👇 [수정] isSelected 로d직을 다시 추가합니다.
      const isSelected = selectedParkingLot?.id === item.id;
      return <QuickViewParkingItem item={item} isSelected={isSelected} />;
    },
    [selectedParkingLot],
  );

  // 3. 렌더링 조건 단순화: 주차장 목록이 1개 이상일 때만 캐러셀을 보여줍니다.
  const shouldShowCarousel = useMemo(() => parkingListData.length > 0, [parkingListData]);

  return (
    <View style={styles.container}>
      <HStack style={[styles.topViewWrapper, {marginBottom: shouldShowCarousel ? 0 : 5}]}>
        <TouchableWithoutFeedback onPress={goToCurrentPress}>
          <View style={styles.circleButtonWrapper}>
            <Icon name="crosshairs-gps" size={widthScale(22)} color={colors.black} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={onParkingListPress}>
          <HStack style={styles.buttonWrapper}>
            <Icon name="format-list-bulleted" size={widthScale(20)} />
            <CustomText
              string="주변목록보기"
              size={FONT.CAPTION}
              textStyle={{marginLeft: widthScale(5)}}
            />
          </HStack>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={onPressKakao}>
          <View style={styles.circleButtonWrapper}>
            <Image source={ICONS.kakao_icon} style={styles.kakaoIcon} resizeMode="contain" />
          </View>
        </TouchableWithoutFeedback>
      </HStack>

      {shouldShowCarousel && (
        <Carousel
          ref={carouselRef}
          data={parkingListData}
          renderItem={renderItem}
          width={width}
          height={heightScale(200)} // 아이템 높이에 맞게 조절 필요
          style={{height: heightScale(200)}} // 캐러셀 전체 높이 조절
          mode="parallax"
          pagingEnabled={true}
          onSnapToItem={handleSnapToItem}
        />
      )}
    </View>
  );
});

export default QuickViewParking;

const styles = StyleSheet.create({
  container: {
    marginBottom: PADDING / 2,
  },
  topViewWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: PADDING,
  },
  buttonWrapper: {
    backgroundColor: colors.white,
    minHeight: heightScale(40),
    paddingHorizontal: PADDING / 2,
    borderRadius: 999,
    borderWidth: widthScale(1),
    borderColor: colors.gray,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  kakaoIcon: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  circleButtonWrapper: {
    width: widthScale(42),
    height: widthScale(42),
    backgroundColor: colors.white,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
