import React, {memo} from 'react';
import {StyleSheet, Text, View, Image, ImageSourcePropType} from 'react-native';
import {ParkingMapProps} from '~constants/types';
// NaverMapMarkerOverlay와 필요한 타입을 import 합니다.
import {NaverMapMarkerOverlay} from '@mj-studio/react-native-naver-map';
// getMarkerText 대신 getMarker를 import 합니다.
import {getMarker} from '~utils/getMarker';
import {widthScale} from '~styles/scaling-utils';

interface Props {
  item: ParkingMapProps; // ParkingMapProps에 lat, lng, icon, charge, onedayTicketCost, category 등이 있다고 가정
  onMarkerPress: (item: ParkingMapProps) => void; // 인자 추가
  selectedParking: ParkingMapProps | null;
}

// getMarker가 반환하는 MarkerProps 타입에는 text 필드가 없습니다.
// MarkerImageProp은 @mj-studio/react-native-naver-map의 타입입니다.
// types.ts의 MarkerProps.source가 NaverMapMarkerImageProp으로 수정되었다고 가정합니다.

const ParkingMarkerText: React.FC<Props> = memo(props => {
  const {item, onMarkerPress, selectedParking = null} = props;

  // getMarker 함수를 호출하여 마커의 스타일 정보(source, width, height)를 가져옵니다.
  const markerStyleInfo = getMarker(
    item?.icon,
    item?.charge,
    item?.onedayTicketCost || 0,
    item?.category,
  );

  const isSelected =
    selectedParking?.id === item?.id &&
    selectedParking?.lat === item?.lat &&
    selectedParking?.lng === item?.lng;

  // item.lat 또는 item.lng가 유효하지 않거나 markerStyleInfo (특히 source)가 없으면 렌더링하지 않음
  if (item?.lat == null || item?.lng == null || !markerStyleInfo || !markerStyleInfo.source) {
    console.warn(
      '[ParkingMarkerText] Essential info missing for item or marker style:',
      item,
      markerStyleInfo,
    );
    return null;
  }

  // markerText는 item.charge 값을 사용하거나, 다른 로직으로 결정할 수 있습니다.
  // getMarker 함수는 text 정보를 반환하지 않으므로 item에서 직접 가져옵니다.
  const markerText = item?.charge?.toString();

  const displayWidth = isSelected
    ? (markerStyleInfo.width ?? 0) + widthScale(20)
    : markerStyleInfo.width;
  const displayHeight = isSelected
    ? (markerStyleInfo.height ?? 0) + widthScale(12)
    : markerStyleInfo.height;

  return (
    <NaverMapMarkerOverlay
      latitude={item.lat}
      longitude={item.lng}
      width={displayWidth}
      height={displayHeight}
      onTap={() => {
        onMarkerPress(item);
      }}
      zIndex={isSelected ? 999 : undefined}
      // image prop은 children을 사용할 것이므로 설정하지 않습니다.
    >
      <View
        style={[
          styles.markerWrapper,
          {width: markerStyleInfo.width, height: markerStyleInfo.height},
        ]}>
        <Image
          // markerStyleInfo.source는 types.ts의 MarkerProps.source 정의에 따라 NaverMapMarkerImageProp 타입입니다.
          // React Native의 <Image> 컴포넌트는 ImageSourcePropType을 기대합니다.
          // NaverMapMarkerImageProp이 require()의 결과(ImageSourcePropType)를 포함하므로,
          // markerStyleInfo.source가 require()의 결과라면 이대로 사용 가능합니다.
          source={markerStyleInfo.source as ImageSourcePropType}
          style={styles.markerImage}
          resizeMode="contain"
        />
        {markerText && ( // markerText가 유효한 경우에만 Text 컴포넌트를 렌더링합니다.
          <Text style={styles.markerText} numberOfLines={1} ellipsizeMode="clip">
            {markerText}
          </Text>
        )}
      </View>
    </NaverMapMarkerOverlay>
  );
});

export default ParkingMarkerText;

const styles = StyleSheet.create({
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    // 이 View는 NaverMapMarkerOverlay의 width/height (여기서는 markerStyleInfo.width/height)에 맞춰집니다.
  },
  markerImage: {
    width: '100%',
    height: '100%',
  },
  markerText: {
    position: 'absolute',
    fontSize: 10, // 폰트 크기 및 색상 등은 디자인에 맞게 조정
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.3)', // 가독성을 위한 배경 (선택 사항)
    paddingHorizontal: 2,
    borderRadius: 2,
    // 텍스트 위치는 실제 마커 이미지와 디자인에 맞춰 세밀하게 조정 필요
  },
});
