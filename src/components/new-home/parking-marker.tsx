import React, {memo} from 'react';
import {ParkingMapProps} from '~constants/types';
import {NaverMapMarkerOverlay} from '@mj-studio/react-native-naver-map';
import {getMarker} from '~utils/getMarker';
import {widthScale} from '~styles/scaling-utils';

interface Props {
  item: ParkingMapProps;
  onMarkerPress: (item: ParkingMapProps) => void; // 인자 추가
  selectedParking: ParkingMapProps | null;
}

const ParkingMarker: React.FC<Props> = memo(props => {
  const {item, onMarkerPress, selectedParking = null} = props;

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

  if (item?.lat == null || item?.lng == null || !markerStyleInfo) {
    return null;
  }

  return (
    <NaverMapMarkerOverlay
      latitude={item.lat}
      longitude={item.lng}
      image={markerStyleInfo.source}
      width={isSelected ? (markerStyleInfo.width ?? 0) + widthScale(20) : markerStyleInfo.width}
      height={isSelected ? (markerStyleInfo.height ?? 0) + widthScale(12) : markerStyleInfo.height}
      caption={markerStyleInfo.caption}
      onTap={() => {
        onMarkerPress(item);
      }}
      zIndex={isSelected ? 999 : undefined}
    />
  );
});

export default ParkingMarker;
