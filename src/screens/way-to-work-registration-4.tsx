import {useIsFocused} from '@react-navigation/native';
import _ from 'lodash';
import React, {memo, useEffect, useRef, useState} from 'react';
import {BackHandler, DeviceEventEmitter, Image, StatusBar, StyleSheet, View} from 'react-native';
import {
  NaverMapView,
  type NaverMapViewRef,
  type Region, // ✅ 여기에 같이 추가
} from '@mj-studio/react-native-naver-map';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IMAGES} from '~/assets/images-path';
import {Icons} from '~/assets/svgs';
import AppModal from '~components/app-modal';
import IconButton from '~components/commons/icon-button';
import BottomSheetButtonRegister from '~components/way-to-work-registration/bottom-sheet-button-register';
import ButtonBack from '~components/way-to-work-registration/button-back';
import {IS_IOS, MAXIMUM_DISTANCE, PADDING1} from '~constants/constant';
import {EMIT_EVENT} from '~constants/enum';
import {AddressKakaoProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheUserCordinate} from '~reducers/coordinateReducer';
import {searchCoordinateKakao} from '~services/kakaoService';
import {useLazyGetDrivingDirectionQuery} from '~services/naverMapServices';
import {useAppDispatch} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {widthScale1} from '~styles/scaling-utils';
import {getMyLocation, requestLocationPermisstion} from '~utils/getMyLocation';

const WayToWorkRegistration4 = (props: RootStackScreenProps<'WayToWorkRegistration4'>) => {
  const {navigation, route} = props;

  const routes = navigation.getState()?.routes;

  const {data, func, isGoTo, isToStop, address, dataDriver} = route?.params;

  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const inset = useSafeAreaInsets();

  const mapRef = useRef<NaverMapViewRef>(null); // ✅ 타입 오류 해결

  const firstChangeMap = useRef(0);

  const [getDrivingDirection] = useLazyGetDrivingDirectionQuery();

  const [dataAddress, setDataAddress] = useState<AddressKakaoProps>(data);
  const [loading, setLoading] = useState(false);
  const [bottomLocation, setBottomLocation] = useState(0);

  const handleBack = () => {
    if (routes.some(item => item.name === ROUTE_KEY.WayToWorkRegistration2)) {
      DeviceEventEmitter.emit(EMIT_EVENT.FOCUS_INPUT_WAY_2);
    }
    if (routes.some(item => item.name === ROUTE_KEY.DriverWayToWork2)) {
      DeviceEventEmitter.emit(EMIT_EVENT.FOCUS_INPUT_DRIVER_WAY_2);
    }
    return false;
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (data) {
      const bounds: Region = {
        latitude: Number(data.y),
        longitude: Number(data.x),
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      };
      mapRef.current?.animateRegionTo({
        ...bounds,
        duration: 300, // ms 단위, 애니메이션 지속 시간
      });
    }
  }, []);

  const onPressRequestMyLocation = () => {
    requestLocationPermisstion().then(() => {
      getMyLocation().then(data => {
        dispatch(cacheUserCordinate(data));

        const bounds: Region = {
          latitude: data.lat,
          longitude: data.long,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };

        mapRef.current?.animateRegionTo({
          ...bounds,
          duration: 300, // 애니메이션 지속 시간 (ms)
        });
      });
    });
  };

  const checkDistance = (start: string, end: string) => {
    setLoading(true);

    getDrivingDirection({start: start, end: end})
      .then(({data}) => {
        if (!data?.taxiFare) {
          AppModal.show({
            title: '',
            content: '출발지 또는 도착지가 도로 주변이 아닙니다. 위치를 변경해 주세요.',
            textYes: '확인',
            yesFunc: () => {},
          });
          return;
        }
        if (data?.distance! > MAXIMUM_DISTANCE) {
          AppModal.show({
            title: '80km이상의 경로는\n등록 불가합니다.',
            content: '80km이내의 경로로 재등록해주세요.',
            textYes: '확인',
            yesFunc: () => {},
          });
          return;
        }

        onDone();
      })
      .finally(() => setLoading(false));
  };

  const onPressRegisterRoute = () => {
    if (dataDriver) {
      let start = '';
      let stop = '';
      let end = '';

      if (dataDriver?.address?.isChooseFrom) {
        if (!dataDriver?.address?.to && !dataDriver?.address?.stop) {
          return onDone();
        }
        start = `${dataAddress?.x},${dataAddress?.y}`;
        stop = `${dataDriver?.address?.stop?.x},${dataDriver?.address?.stop?.y}`;
        end = `${dataDriver?.address?.to?.x},${dataDriver?.address?.to?.y}`;

        // have address stop
        if (dataDriver?.address?.stop && !dataDriver?.address?.to) {
          return checkDistance(start, stop);
        }
      } else if (dataDriver?.address?.isChooseStop) {
        if (!dataDriver?.address?.from && !dataDriver?.address?.to) {
          return onDone();
        }
        start = `${dataDriver?.address?.from?.x},${dataDriver?.address?.from?.y}`;
        stop = `${dataAddress?.x},${dataAddress?.y}`;
        end = `${dataDriver?.address?.to?.x},${dataDriver?.address?.to?.y}`;

        // have address start
        if (dataDriver?.address?.from && !dataDriver?.address?.to) {
          return checkDistance(start, stop);
        }

        // have address end
        if (!dataDriver?.address?.from && dataDriver?.address?.to) {
          return checkDistance(stop, end);
        }
      } else {
        if (!dataDriver?.address?.from && !dataDriver?.address?.stop) {
          return onDone();
        }
        start = `${dataDriver?.address?.from?.x},${dataDriver?.address?.from?.y}`;
        stop = `${dataDriver?.address?.stop?.x},${dataDriver?.address?.stop?.y}`;
        end = `${dataAddress?.x},${dataAddress?.y}`;

        // have address stop
        if (!dataDriver?.address?.from && dataDriver?.address?.stop) {
          return checkDistance(end, stop);
        }
      }
      checkDistance(start, end);
    } else {
      let start = '';
      let end = '';

      if (address?.isChooseFrom) {
        if (!address.to) {
          return onDone();
        }
        start = `${dataAddress.x},${dataAddress.y}`;
        end = `${address.to.x},${address.to.y}`;
      } else {
        if (!address?.from) {
          return onDone();
        }

        start = `${address.from.x},${address.from.y}`;
        end = `${dataAddress.x},${dataAddress.y}`;
      }

      checkDistance(start, end);
    }
  };

  const onDone = () => {
    navigation.goBack();
    func?.(dataAddress);
  };

  const onCameraChangeDebounce = _.debounce((coordinate: {latitude: number; longitude: number}) => {
    searchCoordinateKakao(coordinate.longitude, coordinate.latitude)
      .then(response => {
        if (response) {
          setDataAddress({
            ...response,
            address_name: response?.address?.address_name,
            x: coordinate.longitude.toString(),
            y: coordinate.latitude.toString(),
          } as any);
        }
      })
      .finally(() => setLoading(false));
  }, 500);

  const onCameraChange = (e: {latitude: number; longitude: number}) => {
    if (firstChangeMap.current >= (IS_IOS ? 2 : 3)) {
      setLoading(true);
      onCameraChangeDebounce(e);
    }
    firstChangeMap.current += 1;
  };

  return (
    <View style={styles.view}>
      {isFocused && <StatusBar translucent backgroundColor={colors.transparent} />}

      <Image
        source={
          isGoTo ? IMAGES.depart_marker : isToStop ? IMAGES.stopover_marker : IMAGES.arrive_marker
        }
        style={styles.marker}
      />
      <View
        style={[
          {
            bottom: bottomLocation + PADDING1,
          },
          styles.iconLocation,
        ]}>
        <IconButton icon={<Icons.Location />} onPress={onPressRequestMyLocation} />
      </View>

      <NaverMapView
        isShowScaleBar={false}
        isShowCompass={false}
        isShowZoomControls={false}
        ref={mapRef}
        onCameraChanged={({latitude, longitude}) => {
          onCameraChange({latitude, longitude});
        }}
        style={styles.view}
      />

      <ButtonBack
        handleBack={handleBack}
        style={[
          styles.buttonBack,
          {
            top: PADDING1 + inset.top,
          },
        ]}
      />

      <BottomSheetButtonRegister
        onChangeSize={height => {
          setBottomLocation(height);
        }}
        address={dataAddress}
        disable={loading}
        text={isToStop ? '경유지 등록하기' : isGoTo ? '출발지 등록하기' : '도착지 등록하기'}
        onPressRegisterRoute={onPressRegisterRoute}
      />
    </View>
  );
};

export default memo(WayToWorkRegistration4);

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  marker: {
    width: widthScale1(43),
    height: widthScale1(60),
    position: 'absolute',
    zIndex: 100,
    bottom: '51%',
    left: '44.5%',
    resizeMode: 'contain',
  },
  iconLocation: {
    position: 'absolute',
    right: PADDING1,
    zIndex: 10000,
  },
  buttonBack: {
    position: 'absolute',
    zIndex: 1000,
    left: PADDING1,
  },
});
