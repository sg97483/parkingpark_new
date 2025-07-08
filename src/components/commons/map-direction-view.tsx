import React, {memo, useEffect, useMemo, useRef} from 'react';
import {StatusBar, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
// @mj-studio/react-native-naver-map에서 필요한 것들을 named import로 가져옵니다.
import {
  NaverMapView,
  NaverMapMarkerOverlay,
  NaverMapPathOverlay, // 또는 NaverMapPolylineOverlay (선택)
  type Coord,
  type Region,
  type NaverMapViewRef, // NaverMapView.tsx에서 export하는 Ref 타입을 사용
} from '@mj-studio/react-native-naver-map';
import {IMAGES} from '~/assets/images-path';
import {userHook} from '~hooks/userHook';
import {cacheUserCordinate} from '~reducers/coordinateReducer';
import {
  useGetDrivingDirectionQuery,
  useLazyGetDrivingDirectionQuery,
} from '~services/naverMapServices';
import {useAppDispatch} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {getMyLocation, requestLocationPermisstion} from '~utils/getMyLocation';
import type {CordinateProps} from '~constants/types';

interface Props {
  startPoint: Coord | undefined;
  stopOverPoint?: Coord | undefined;
  endPoint: Coord | undefined;
  onDurationDataReturn?: (minutesStart: number, minutesStop?: number) => void;
  onReturnPriceTaxi?: (price: number) => void;
  onReturnPriceStopTaxi?: (price: number) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const MapDirectionView: React.FC<Props> = memo(props => {
  const {
    startPoint,
    stopOverPoint,
    endPoint,
    onDurationDataReturn,
    onReturnPriceTaxi,
    onReturnPriceStopTaxi,
    containerStyle,
  } = props;

  const mapRef = useRef<NaverMapViewRef>(null); // NaverMapView.tsx에 정의된 Ref 타입 사용
  const dispatch = useAppDispatch();
  const {myLocation} = userHook();
  const [getPriceStop] = useLazyGetDrivingDirectionQuery();

  const {data: direction} = useGetDrivingDirectionQuery({
    start: `${startPoint?.longitude},${startPoint?.latitude}`,
    end: `${endPoint?.longitude},${endPoint?.latitude}`,
    waypoints:
      stopOverPoint?.longitude && stopOverPoint?.latitude
        ? `${stopOverPoint?.longitude},${stopOverPoint?.latitude}`
        : '',
  });

  const distance = useMemo(() => {
    if (!startPoint || !endPoint) {
      return 0;
    }
    return Math.sqrt(
      Math.pow(startPoint.latitude - endPoint.latitude, 2) +
        Math.pow(startPoint.longitude - endPoint.longitude, 2),
    );
  }, [startPoint, endPoint]);

  useEffect(() => {
    if (mapRef.current && startPoint && endPoint) {
      const region: Region = {
        latitude: (startPoint.latitude + endPoint.latitude) / 2,
        longitude: (startPoint.longitude + endPoint.longitude) / 2,
        latitudeDelta: distance * 1.5,
        longitudeDelta: distance * 1.5,
      };
      // NaverMapView.tsx의 NaverMapViewRef 인터페이스에 animateRegionTo가 정의되어 있음
      mapRef.current.animateRegionTo({
        ...region,
        duration: 1000, // CameraMoveBaseParams에 duration이 있으므로 사용 가능
        // easing: 'EaseOut' // CameraMoveBaseParams에 easing이 있으므로 사용 가능 (string 타입인지 확인)
      });
    }
  }, [startPoint, endPoint, distance]);

  useEffect(() => {
    requestLocationPermisstion().then(() => {
      getMyLocation().then(data => {
        // getMyLocation()이 반환하는 data 객체가 { lat: number, long: number } 형태라고 가정합니다.
        // 그리고 cacheUserCordinate가 받는 CordinateProps 타입이
        // 사용자님이 제공해주신 types.ts 파일에 정의된 대로 { lat: number, long: number } 라고 가정합니다.
        if (data && typeof data.lat === 'number' && typeof data.long === 'number') {
          // CordinateProps 타입에 맞춰서 객체를 전달합니다.
          const payload: CordinateProps = {
            lat: data.lat,
            long: data.long,
          };
          dispatch(cacheUserCordinate(payload));
        } else {
          // 위치 정보를 가져오지 못했을 경우의 예외 처리 (선택 사항)
          console.warn('Failed to get current location or data format is incorrect.');
        }
      });
    });
  }, [dispatch]); // dispatch를 의존성 배열에 추가하는 것이 좋습니다.

  useEffect(() => {
    if (direction?.taxiFare) {
      onReturnPriceTaxi?.(direction.taxiFare < 5000 ? 5000 : direction.taxiFare);
    }
    if (direction?.duration) {
      onDurationDataReturn?.(parseFloat(direction.duration as any)); // duration이 string일 수 있으므로 number로 변환
    }
  }, [direction?.taxiFare, direction?.duration, onReturnPriceTaxi, onDurationDataReturn]);

  useEffect(() => {
    if (stopOverPoint && startPoint) {
      getPriceStop({
        start: `${startPoint.longitude},${startPoint.latitude}`,
        end: `${stopOverPoint.longitude},${stopOverPoint.latitude}`,
        waypoints: '',
      })
        .unwrap()
        .then(res => {
          if (res?.taxiFare) {
            onReturnPriceStopTaxi?.(res.taxiFare);
          }
        });
    }
  }, [stopOverPoint, startPoint, getPriceStop, onReturnPriceStopTaxi]);

  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <StatusBar backgroundColor={colors.transparent} />

      <NaverMapView
        // NaverMapViewProps에 정의된 prop 사용 (제공해주신 NaverMapView.tsx 참고)
        isShowCompass={false}
        style={{flex: 1}}
        isShowZoomControls={false} // zoomControl -> isShowZoomControls
        // isShowScaleBar={false} // 필요시 추가
        ref={mapRef}>
        {myLocation && myLocation.lat && myLocation.long && (
          <NaverMapMarkerOverlay
            image={IMAGES.animation_marker}
            latitude={myLocation.lat}
            longitude={myLocation.long}
            width={widthScale1(30)}
            height={widthScale1(30)}
            // animated prop은 NaverMapMarkerOverlayProps에 없으므로 제거
          />
        )}

        {startPoint && (
          <NaverMapMarkerOverlay
            image={IMAGES.depart_marker}
            latitude={startPoint.latitude}
            longitude={startPoint.longitude}
            width={widthScale1(43)}
            height={widthScale1(60)}
          />
        )}

        {stopOverPoint && (
          <NaverMapMarkerOverlay
            image={IMAGES.stopover_marker}
            latitude={stopOverPoint.latitude}
            longitude={stopOverPoint.longitude}
            width={widthScale1(43)}
            height={widthScale1(60)}
          />
        )}

        {endPoint && (
          <NaverMapMarkerOverlay
            image={IMAGES.arrive_marker}
            latitude={endPoint.latitude}
            longitude={endPoint.longitude}
            width={widthScale1(43)}
            height={widthScale1(60)}
          />
        )}

        {direction &&
          direction.path &&
          Array.isArray(direction.path) &&
          direction.path.length >= 2 && (
            // NaverMapPathOverlay.tsx 또는 NaverMapPolylineOverlay.tsx의 props를 정확히 사용해야 합니다.
            // NaverMapPathOverlay.tsx를 기준으로 width, color prop 사용
            <NaverMapPathOverlay
              coords={direction.path} // direction.path가 Coord[]와 호환되는지 확인
              width={widthScale1(6)} // NaverMapPathOverlayProps에 width prop 존재
              outlineWidth={0}
              color="#0073CB" // NaverMapPathOverlayProps에 color prop 존재
              // 만약 NaverMapPolylineOverlay를 사용한다면, 해당 컴포넌트의 props(width, color 등)를 사용
            />
          )}
      </NaverMapView>
    </View>
  );
});

export default MapDirectionView;

const styles = StyleSheet.create({
  containerStyle: {
    height: heightScale1(420),
  },
});
