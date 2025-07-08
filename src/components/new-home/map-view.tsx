import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {DeviceEventEmitter, Linking, StatusBar, StyleSheet, UIManager, View} from 'react-native';

import {
  NaverMapMarkerOverlay,
  NaverMapView,
  type NaverMapViewProps,
  type NaverMapViewRef,
} from '@mj-studio/react-native-naver-map';
import {getDistanceFromTwoPosition} from '~utils/getDistance';

import {ICONS} from '~/assets/images-path';
import Spinner from '~components/spinner';
import {IS_ANDROID, PADDING} from '~constants/constant';
import {EMIT_EVENT} from '~constants/enum';
import {CordinateProps, ParkingMapProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {fetchParkingList, getRealm} from '~services/realm';
import {useAppSelector} from '~store/storeHooks';
import {widthScale} from '~styles/scaling-utils';
import {getLocationDelta} from '~utils/getMyLocation';
import AdBanners from './ad-banners';
import ParkingMarker from './parking-marker';
import QuickViewParking from './quick-view-parking';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

type CameraChangedEvent = Parameters<NonNullable<NaverMapViewProps['onCameraChanged']>>[0];

const MapView: React.FC = memo(() => {
  const navigation: UseRootStackNavigation = useNavigation();
  const isFocused = useIsFocused();
  const mapRef = useRef<NaverMapViewRef>(null);

  const cameraMoveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const myLocation = useAppSelector(state => state.coordinateReducer.userCordinate);
  const parkingFilter = useAppSelector(state => state.parkingReducer.parkingFilter);

  const [currentCordinate, setCurrentCordinate] = useState<CordinateProps | null>(
    myLocation ?? null,
  );
  const [listData, setListData] = useState<ParkingMapProps[]>([]);
  const [recommendParkingList, setRecommendParkingList] = useState<ParkingMapProps[]>([]);
  const [selectedParkingLot, setSelectedParkingLot] = useState<ParkingMapProps | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isSearchResult, setIsSearchResult] = useState(false);
  const listDataRef = useRef<ParkingMapProps[]>([]);

  const handleCameraChanged = useCallback((e: CameraChangedEvent) => {
    // ⭐️ 'e.reason'의 타입은 string이므로, 문자열 'GESTURE'와 비교합니다.

    if (e.reason !== 'Gesture') {
      return;
    }

    if (cameraMoveTimer.current) {
      clearTimeout(cameraMoveTimer.current);
    }

    cameraMoveTimer.current = setTimeout(() => {
      setCurrentCordinate({lat: e.latitude, long: e.longitude});
      setIsSearchResult(false);
      setSelectedParkingLot(null);
      setShowQuickView(false);
      setRecommendParkingList([]);
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (cameraMoveTimer.current) {
        clearTimeout(cameraMoveTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (IS_ANDROID) {
      StatusBar.setTranslucent(true);
    }
  }, []);

  useEffect(() => {
    if (myLocation?.lat && myLocation.long && mapRef.current) {
      const zoomInfo = getLocationDelta(myLocation.lat, myLocation.long, 500);
      const regionToAnimate = {
        latitude: myLocation.lat - 0.0019,
        longitude: myLocation.long - 0.0022,
        latitudeDelta: zoomInfo.latitudeDelta,
        longitudeDelta: zoomInfo.longitudeDelta,
      };
      mapRef.current.animateRegionTo({...regionToAnimate, duration: 1000});
    }
  }, [myLocation]);

  useEffect(() => {
    const loadData = async () => {
      if (!currentCordinate?.lat || !currentCordinate?.long) {
        return;
      }

      const filteredData = await fetchParkingList({
        center: {lat: currentCordinate.lat, long: currentCordinate.long},
        parkingFilter: parkingFilter,
      });
      setListData(filteredData);
    };
    loadData();
  }, [currentCordinate, parkingFilter]);

  useEffect(() => {
    listDataRef.current = listData;
  }, [listData]);

  useEffect(() => {
    // 아직 currentCordinate가 설정되지 않았고 (앱 첫 실행),
    // myLocation 값은 들어왔을 때
    if (!currentCordinate && myLocation) {
      // 지도 이동 시 사용되는 currentCordinate 상태를 내 위치로 설정해줍니다.
      // 이 상태가 변경되면, 기존의 데이터 로딩 useEffect가 자동으로 실행됩니다.
      setCurrentCordinate(myLocation);
    }
  }, [myLocation, currentCordinate]); // myLocation이 변경될 때마다 이 로직을 확인합니다.

  const updateRecommendParkingList = useCallback(async (data: ParkingMapProps) => {
    if (data && data.lat && data.lng) {
      setListData([]);
      setCurrentCordinate({lat: data.lat, long: data.lng});

      const realm = await getRealm();
      const matchedItemFromDB = realm
        .objects<ParkingMapProps>('Parking')
        .filtered(`id == ${data.id}`)[0];

      const mainItem = {
        ...data,
        garageName: matchedItemFromDB ? String(matchedItemFromDB.garageName) : data.garageName,
      };

      const zoomInfo = getLocationDelta(mainItem.lat, mainItem.lng, 500);
      const regionToAnimate = {
        latitude: mainItem.lat - 0.0019,
        longitude: mainItem.lng - 0.0022,
        latitudeDelta: zoomInfo.latitudeDelta,
        longitudeDelta: zoomInfo.longitudeDelta,
      };
      mapRef.current?.animateRegionTo({...regionToAnimate, duration: 1000});

      setSelectedParkingLot(mainItem);
      setIsSearchResult(true);
      setRecommendParkingList([mainItem]);
      setShowQuickView(true);
    }
  }, []);

  useEffect(() => {
    const pingOnMap = DeviceEventEmitter.addListener(
      EMIT_EVENT.PING_ON_MAP,
      updateRecommendParkingList,
    );
    return () => pingOnMap.remove();
  }, [updateRecommendParkingList]);

  const handleMarkerPress = useCallback((item: ParkingMapProps) => {
    if (!item.lat || !item.lng) {
      return;
    }

    setSelectedParkingLot(item);
    setIsSearchResult(false);

    const zoomInfo = getLocationDelta(item.lat, item.lng, 500);
    const regionToAnimate = {
      latitude: item.lat - 0.0019,
      longitude: item.lng - 0.0022,
      latitudeDelta: zoomInfo.latitudeDelta,
      longitudeDelta: zoomInfo.longitudeDelta,
    };
    mapRef.current?.animateRegionTo({...regionToAnimate, duration: 1000});

    const clickedItem = item;
    const nearbyPartners = listDataRef.current.filter(p => p.id !== clickedItem.id);

    const partnersWithDistance = nearbyPartners
      .map(it => ({
        ...it,
        distance: getDistanceFromTwoPosition(
          {lat: clickedItem.lat, long: clickedItem.lng},
          {lat: it.lat, long: it.lng},
        ),
      }))
      .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));

    const finalRecommendList = [clickedItem, ...partnersWithDistance.slice(0, 4)];
    setRecommendParkingList(finalRecommendList);
    setShowQuickView(true);
  }, []);

  const handleKakaoNavigation = () => {
    const installLink = 'https://pf.kakao.com/_Sxdjxij/chat?...';
    Linking.canOpenURL(installLink)
      .then(supported => {
        if (supported) {
          Linking.openURL(installLink);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  if (!myLocation?.lat || !myLocation?.long) {
    return <Spinner />;
  }

  return (
    <View style={styles.container}>
      <NaverMapView
        ref={mapRef}
        style={styles.container}
        initialRegion={getLocationDelta(myLocation.lat, myLocation.long, 500)}
        onCameraChanged={handleCameraChanged}
        onTapMap={() => {
          setSelectedParkingLot(null);
          setIsSearchResult(false);
          setShowQuickView(false);
          setRecommendParkingList([]);
        }}
        isShowZoomControls={true}
        isShowLocationButton={false}
        isShowScaleBar={false}
        isShowCompass={false}>
        {isFocused && myLocation?.lat && (
          <NaverMapMarkerOverlay
            key="my-location"
            image={ICONS.icon_position}
            latitude={myLocation.lat}
            longitude={myLocation.long}
            width={widthScale(30)}
            height={widthScale(40)}
          />
        )}
        {isSearchResult && selectedParkingLot?.lat && (
          <NaverMapMarkerOverlay
            key="search-result"
            latitude={selectedParkingLot.lat}
            longitude={selectedParkingLot.lng}
            image={ICONS.icon_search_pin2}
            width={widthScale(54)}
            height={widthScale(60)}
            zIndex={1}
          />
        )}
        {isFocused &&
          listData.map(item => {
            return (
              <ParkingMarker
                key={item.id.toString()}
                item={item}
                onMarkerPress={() => handleMarkerPress(item)}
                selectedParking={selectedParkingLot}
              />
            );
          })}
      </NaverMapView>
      <View style={styles.bottomViewWrapper}>
        <QuickViewParking
          goToCurrentPress={() => {
            setSelectedParkingLot(null);
            setIsSearchResult(false);
            setShowQuickView(false);
            if (myLocation) {
              const zoomInfo = getLocationDelta(myLocation.lat, myLocation.long, 500);
              const regionToAnimate = {
                latitude: myLocation.lat - 0.0019,
                longitude: myLocation.long - 0.0022,
                latitudeDelta: zoomInfo.latitudeDelta,
                longitudeDelta: zoomInfo.longitudeDelta,
              };
              mapRef.current?.animateRegionTo({...regionToAnimate, duration: 1000});
            }
          }}
          onParkingListPress={() => navigation.navigate(ROUTE_KEY.ListOfParkingLots)}
          onPressKakao={handleKakaoNavigation}
          parkingListData={recommendParkingList}
          selectedParking={setSelectedParkingLot}
          selectedParkingLot={selectedParkingLot}
          isSearchResult={isSearchResult}
        />
        {!showQuickView && <AdBanners />}
      </View>
    </View>
  );
});

export default MapView;

const styles = StyleSheet.create({
  container: {flex: 1},
  bottomViewWrapper: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: PADDING * 1.5,
  },
});
