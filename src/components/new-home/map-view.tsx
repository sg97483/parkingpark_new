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
      // creditCardYN === 'A' 인 주차장은 제외
      const matchedItemFromDB = realm
        .objects<ParkingMapProps>('Parking')
        .filtered(`id == ${data.id} AND (creditCardYN != 'A' OR creditCardYN == nil)`)[0];

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

      // 카카오 검색 결과는 제휴 주차장 DB 매칭이 된 경우에만 하단 카드(QuickView)를 표시합니다.
      // 비제휴 장소는 목적지 핀은 유지하고, 하단 카드만 숨깁니다.
      const isKakaoSearch = mainItem.category === '카카오 검색';
      const isAffiliatedResult =
        mainItem.ticketPartnerYN === 'Y' && (!!matchedItemFromDB || !isKakaoSearch);
      if (!isAffiliatedResult) {
        setSelectedParkingLot(mainItem);
        setIsSearchResult(true);
        setRecommendParkingList([]);
        setShowQuickView(false);
        return;
      }

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
    const moveToLocation = DeviceEventEmitter.addListener(
      EMIT_EVENT.MOVE_TO_LOCATION,
      (data: {lat: number; lng: number}) => {
        if (data && data.lat && data.lng && mapRef.current) {
          const zoomInfo = getLocationDelta(data.lat, data.lng, 800);
          const regionToAnimate = {
            latitude: data.lat - 0.0019,
            longitude: data.lng - 0.0022,
            latitudeDelta: zoomInfo.latitudeDelta,
            longitudeDelta: zoomInfo.longitudeDelta,
          };
          mapRef.current.animateRegionTo({...regionToAnimate, duration: 1000});
          setCurrentCordinate({lat: data.lat, long: data.lng});
          
          // ✅ 좌표로 이동 시 하단 주차장 상세 정보 닫기
          setSelectedParkingLot(null);
          setShowQuickView(false);
          setRecommendParkingList([]);
          setIsSearchResult(false);
        }
      },
    );
    return () => {
      pingOnMap.remove();
      moveToLocation.remove();
    };
  }, [updateRecommendParkingList]);

  const handleMarkerPress = useCallback((item: ParkingMapProps) => {
    if (!item.lat || !item.lng) {
      return;
    }

    // UI를 즉시 보여주는 로직
    setSelectedParkingLot(item);
    setShowQuickView(true);
    setIsSearchResult(false);

    // 주변 주차장 계산 로직
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
  }, []);

  useEffect(() => {
    if (selectedParkingLot && selectedParkingLot.lat && selectedParkingLot.lng) {
      const zoomInfo = getLocationDelta(selectedParkingLot.lat, selectedParkingLot.lng, 500);
      const regionToAnimate = {
        // (수직 보정) 줌 레벨의 25%만큼 마커를 위로 올립니다.
        latitude: selectedParkingLot.lat - zoomInfo.latitudeDelta * 0.4,

        // 👇 (수평 보정) 줌 레벨에 비례하여 마커를 오른쪽으로 살짝 이동시킵니다.
        longitude: selectedParkingLot.lng - zoomInfo.longitudeDelta * 0.5,

        latitudeDelta: zoomInfo.latitudeDelta,
        longitudeDelta: zoomInfo.longitudeDelta,
      };
      mapRef.current?.animateRegionTo({...regionToAnimate, duration: 1000});
    }
  }, [selectedParkingLot]);

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
