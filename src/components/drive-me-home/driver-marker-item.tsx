import React, {memo, useMemo} from 'react';
// NaverMapMarkerOverlay와 필요한 타입을 import 합니다.
import {NaverMapMarkerOverlay, type MarkerImageProp} from '@mj-studio/react-native-naver-map';
import {IMAGES} from '~/assets/images-path';
import {DriverRoadDayModel} from '~model/driver-model';
import {useAppSelector} from '~store/storeHooks';
import {widthScale1} from '~styles/scaling-utils'; // widthScale1 함수 사용 확인

interface Props {
  item: DriverRoadDayModel; // DriverRoadDayModel에 splat, splng, jumin, dayregYN, selectDay, id 등이 있다고 가정
  onPress: () => void;
}

const DriverMarkerItem: React.FC<Props> = memo(props => {
  const {item, onPress} = props;

  const lastJumin = useMemo(() => item?.jumin?.toString().charAt(6), [item?.jumin]);
  const currentPassengerModeFilter = useAppSelector(
    state => state?.carpoolReducer?.passengerModeFilter,
  );

  const driverIcon: MarkerImageProp | undefined = useMemo(() => {
    // 반환 타입을 MarkerImageProp | undefined 로 명시
    if (currentPassengerModeFilter?.routeRegistrationComplete) {
      switch (lastJumin) {
        case '1':
        case '3':
          return IMAGES.driver_man_verify;
        case '2':
        case '4':
          return IMAGES.driver_women_verify;
        default:
          return IMAGES.driver_man_verify;
      }
    } else {
      if (item?.dayregYN) {
        // dayregYN이 boolean 또는 string Y/N 값일 것으로 추정
        switch (lastJumin) {
          case '1':
          case '3':
            return IMAGES.driver_man_verify;
          case '2':
          case '4':
            return IMAGES.driver_women_verify;
          default:
            return IMAGES.driver_man_verify;
        }
      } else {
        switch (lastJumin) {
          case '1':
          case '3':
            return IMAGES.driver_man_unverify;
          case '2':
          case '4':
            return IMAGES.driver_women_unverify;
          default:
            return IMAGES.driver_man_unverify;
        }
      }
    }
  }, [currentPassengerModeFilter?.routeRegistrationComplete, item?.dayregYN, lastJumin]);

  // item.splat 또는 item.splng가 유효하지 않거나 driverIcon이 없으면 마커를 렌더링하지 않습니다.
  if (item?.splat == null || item?.splng == null || !driverIcon) {
    return null;
  }

  // splat, splng가 문자열일 수 있으므로 숫자로 변환 시도
  const latitude = typeof item.splat === 'string' ? parseFloat(item.splat) : item.splat;
  const longitude = typeof item.splng === 'string' ? parseFloat(item.splng) : item.splng;

  if (isNaN(latitude) || isNaN(longitude)) {
    console.warn('[DriverMarkerItem] Invalid coordinates for item:', item);
    return null;
  }

  return (
    <NaverMapMarkerOverlay // Marker -> NaverMapMarkerOverlay
      key={item?.id?.toString()} // key는 문자열 또는 숫자여야 함
      // coordinate prop 대신 latitude와 longitude를 직접 전달합니다.
      latitude={latitude}
      longitude={longitude}
      onTap={onPress} // onClick -> onTap
      image={driverIcon} // driverIcon이 MarkerImageProp 타입과 호환되어야 함
      // width, height prop은 NaverMapMarkerOverlay에 정의되어 있습니다.
      width={item?.dayregYN || item?.selectDay ? widthScale1(42) : widthScale1(37)}
      height={widthScale1(56)}
      zIndex={100} // zIndex는 숫자 타입이어야 함
      // anchor prop 등 다른 필요한 props가 있다면 추가 (예: 이미지 중심을 맞추기 위해)
      // anchor={{x: 0.5, y: 0.5}}
    />
  );
});

export default DriverMarkerItem;
