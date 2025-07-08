import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {
  NaverMapView,
  NaverMapMarkerOverlay,
  type NaverMapViewRef,
} from '@mj-studio/react-native-naver-map';
import {IMAGES} from '~/assets/images-path';
import ToastMessage from '~components/commons/toast-message/toast-message';
import CustomFab from '~components/custom-fab';
import DriverMarkerItem from '~components/drive-me-home/driver-marker-item';
import QuickDriverInfo, {QuickDriverInfoRefs} from '~components/drive-me-home/quick-info-driver';
import BottomRightButtons from '~components/passenger-home/bottom-right-buttons';
import ListRecommandDriver, {
  ListRecommandDriverRefs,
} from '~components/passenger-home/list-recommend-driver';
import MapFooter, {MapFooterRefs} from '~components/passenger-home/MapFooter';
import MapHeader, {MapHeaderRefs} from '~components/passenger-home/MapHeader';
import {EMIT_EVENT} from '~constants/enum';
import {DriverRoadDayModel} from '~model/driver-model';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetMyRiderRoadQuery, useReadAllDriverRoadDayInfoQuery} from '~services/carpoolServices';
import {
  useGetDriverDailyCommuteListQuery,
  useGetPayHistoryRiderQuery,
} from '~services/passengerServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {dayjs} from '~utils/dayjsUtil';
import {getLocationDelta} from '~utils/getMyLocation';

interface Params {
  frDate?: string;
  toDate?: string;
  genderFilter?: string;
  startFilter?: string;
  endFilter?: string;
  inOutFilter?: string;
  myLatitude?: string;
  myLongitude?: string;
  routeRegistrationComplete?: boolean;
  roadDayfilterftDate?: string;
}

const PassengerHome = memo((props: RootStackScreenProps<'PassengerHome'>) => {
  const {navigation} = props;
  const mapRef = useRef<NaverMapViewRef>(null);
  const headerRef = useRef<MapHeaderRefs>(null);
  const quickDriverRef = useRef<QuickDriverInfoRefs>(null);
  const isFocused = useIsFocused();
  const headerHeightValue = useRef<number>(0);
  const listDriverRef = useRef<ListRecommandDriverRefs>(null);
  const memberID = useAppSelector(state => state?.userReducer?.userToken?.id);
  const driverID = useAppSelector(state => state?.userReducer?.myDriverInfo?.id);
  const myLocation = useAppSelector(state => state?.coordinateReducer?.userCordinate);
  const mapFooterRef = useRef<MapFooterRefs>(null);
  const isShowList = useRef<boolean>(false);
  const currentPassengerModeFilter = useAppSelector(
    state => state?.carpoolReducer?.passengerModeFilter,
  );

  const temporaryRoute = useAppSelector(state => state.userReducer.temporaryRoute);
  const [isShowButtonScrollUp, setIsShowButtonScrollUp] = useState(false);

  const {
    data: listPaymentHistory,
    refetch,
    isUninitialized,
  } = useGetPayHistoryRiderQuery(
    {
      filterftDate: 1,
      filterInOut: 0,
      filterState: 0,
      r_memberId: memberID as number,
      frDate: dayjs().format('YYYY-MM-DD'),
      toDate: dayjs().format('YYYY-MM-DD'),
    },
    {skip: !memberID},
  );

  useFocusEffect(
    useCallback(() => {
      if (!isUninitialized) {
        refetch();
      }
    }, [isUninitialized]),
  );

  useEffect(() => {
    const carpoolRunningListener = DeviceEventEmitter.addListener(
      EMIT_EVENT.CARPOOL_RUNNING,
      () => {
        if (!isUninitialized) {
          refetch();
        }
      },
    );

    const carpoolCompletedListener = DeviceEventEmitter.addListener(
      EMIT_EVENT.CARPOOL_COMPLETED,
      () => {
        if (!isUninitialized) {
          refetch();
        }
      },
    );

    return () => {
      carpoolRunningListener.remove();
      carpoolCompletedListener.remove();
    };
  }, []);

  const hasRunningRoute = useMemo(
    () =>
      listPaymentHistory?.find(
        item =>
          item?.rStatusCheck === 'O' &&
          item?.selectDay?.slice(0, 10) === moment().format('YYYY.MM.DD'),
      ),
    [listPaymentHistory],
  );

  const {
    data: listAllRegisterdRouteOfDriver,
    isUninitialized: isListDriverUninitialized,
    refetch: refetchListDriver,
  } = useReadAllDriverRoadDayInfoQuery();

  const {data: myRoadInfo} = useGetMyRiderRoadQuery(
    {
      memberId: memberID as number,
      id: driverID as number,
    },
    {skip: !driverID || !memberID},
  );

  const params = useMemo((): any => {
    const commonParams: Params = {
      inOutFilter: currentPassengerModeFilter?.carInOut === 'in' ? '1' : '2',
    };

    if (currentPassengerModeFilter?.selectedDay?.length === 1) {
      commonParams.frDate = currentPassengerModeFilter?.selectedDay[0]?.dateString;
      commonParams.toDate = currentPassengerModeFilter?.selectedDay[0]?.dateString;
      commonParams.roadDayfilterftDate = '1';
    } else if (currentPassengerModeFilter?.selectedDay?.length === 2) {
      commonParams.frDate = currentPassengerModeFilter?.selectedDay[0]?.dateString;
      commonParams.toDate = currentPassengerModeFilter?.selectedDay[1]?.dateString;
      commonParams.roadDayfilterftDate = '1';
    } else {
      commonParams.roadDayfilterftDate = '0';
    }

    commonParams.genderFilter =
      currentPassengerModeFilter?.gender === 'FEMALE'
        ? '2'
        : currentPassengerModeFilter?.gender === 'MALE'
          ? '1'
          : '0';

    commonParams.startFilter =
      currentPassengerModeFilter?.distanceRangeFromDeparturePoint === '3KM'
        ? '1'
        : currentPassengerModeFilter?.distanceRangeFromDeparturePoint === '5KM'
          ? '2'
          : '0';

    commonParams.endFilter =
      currentPassengerModeFilter.destinationDistanceRange === '3KM'
        ? '1'
        : currentPassengerModeFilter.destinationDistanceRange === '5KM'
          ? '2'
          : '0';

    commonParams.routeRegistrationComplete = currentPassengerModeFilter?.routeRegistrationComplete;

    if (currentPassengerModeFilter?.carInOut === 'in') {
      if (temporaryRoute?.startCoordIn) {
        commonParams.myLatitude = temporaryRoute?.startCoordIn?.latitude?.toString();
        commonParams.myLongitude = temporaryRoute?.startCoordIn?.longitude?.toString();
      } else {
        commonParams.myLatitude = myRoadInfo?.splatIn?.toString();
        commonParams.myLongitude = myRoadInfo?.splngIn?.toString();
      }
    }

    if (currentPassengerModeFilter?.carInOut === 'out') {
      if (temporaryRoute?.startCoordOut) {
        commonParams.myLatitude = temporaryRoute?.startCoordOut?.latitude?.toString();
        commonParams.myLongitude = temporaryRoute?.startCoordOut?.longitude?.toString();
      } else {
        commonParams.myLatitude = myRoadInfo?.splatOut?.toString();
        commonParams.myLongitude = myRoadInfo?.splngOut?.toString();
      }
    }

    return commonParams;
  }, [currentPassengerModeFilter, myRoadInfo, temporaryRoute]);

  const {
    data: listDriver,
    isFetching,
    refetch: refetchDriverDailyCommuteList,
    isUninitialized: isDriverDailyCommuteListUninitialized,
  } = useGetDriverDailyCommuteListQuery(params, {skip: !params});

  useFocusEffect(
    useCallback(() => {
      if (!isDriverDailyCommuteListUninitialized) {
        refetchDriverDailyCommuteList();
      }
      if (!isListDriverUninitialized) {
        refetchListDriver();
      }
    }, [isDriverDailyCommuteListUninitialized, isListDriverUninitialized]),
  );

  const sortDateListDriver = (list: DriverRoadDayModel[]) => {
    if (list) {
      const temp = [...list];
      const arr: DriverRoadDayModel[] = temp.sort((a, b) => {
        const dateA = a?.selectDay
          ?.slice(0, (a?.selectDay?.length - 3) as number)
          ?.split('.')
          ?.join('');
        const dateB = b?.selectDay
          ?.slice(0, (b?.selectDay?.length - 3) as number)
          ?.split('.')
          ?.join('');

        return Number(dateA) - Number(dateB);
      });
      return arr.filter(item => item?.memberId !== memberID && item?.state !== 'C');
    }
    return [];
  };

  useEffect(() => {
    const animateTo = (latitude: number, longitude: number) => {
      const region = getLocationDelta(latitude, longitude, 500);
      mapRef.current?.animateRegionTo({
        ...region,
        latitude,
        longitude,
        duration: 300,
      });
    };

    if (currentPassengerModeFilter?.carInOut === 'in') {
      if (temporaryRoute?.startCoordIn?.latitude && temporaryRoute?.startCoordIn?.longitude) {
        animateTo(
          Number(temporaryRoute.startCoordIn.latitude),
          Number(temporaryRoute.startCoordIn.longitude),
        );
      } else {
        animateTo(Number(myRoadInfo?.splatIn ?? 0), Number(myRoadInfo?.splngIn ?? 0));
      }
    }

    if (currentPassengerModeFilter?.carInOut === 'out') {
      if (temporaryRoute?.startCoordOut?.latitude && temporaryRoute?.startCoordOut?.longitude) {
        animateTo(
          Number(temporaryRoute.startCoordOut.latitude),
          Number(temporaryRoute.startCoordOut.longitude),
        );
      } else {
        animateTo(Number(myRoadInfo?.splatOut ?? 0), Number(myRoadInfo?.splngOut ?? 0));
      }
    }
  }, [temporaryRoute, myRoadInfo, currentPassengerModeFilter?.carInOut]);

  const handleOpenList = useCallback((showList: boolean) => {
    if (showList) {
      headerRef?.current?.showRecommandDriverButton(false);
      listDriverRef?.current?.show(headerHeightValue?.current);
      mapFooterRef?.current?.setShowReturnLocationButton(false);
      isShowList.current = true;
    } else {
      headerRef?.current?.showRecommandDriverButton(true);
      listDriverRef?.current?.hide();
      mapFooterRef?.current?.setShowReturnLocationButton(true);
      setIsShowButtonScrollUp(false);
      isShowList.current = false;
    }
  }, []);

  const onScrollListRecommandDriver: (event: NativeSyntheticEvent<NativeScrollEvent>) => void =
    useCallback(
      ({
        nativeEvent: {
          contentOffset: {y},
        },
      }) => {
        if (y > 150 && isShowList.current) {
          setIsShowButtonScrollUp(true);
        } else {
          setIsShowButtonScrollUp(false);
        }
      },
      [],
    );

  const renderStartPlaceInMarker = useMemo(() => {
    if (currentPassengerModeFilter?.carInOut === 'in') {
      if (temporaryRoute?.startCoordIn?.latitude && temporaryRoute?.startCoordIn?.longitude) {
        return (
          <NaverMapMarkerOverlay
            zIndex={1}
            latitude={Number(temporaryRoute?.startCoordIn?.latitude)}
            longitude={Number(temporaryRoute?.startCoordIn?.longitude)}
            image={IMAGES.depart_marker}
            width={widthScale1(43)}
            height={heightScale1(60)}
          />
        );
      }

      return (
        <NaverMapMarkerOverlay
          zIndex={1}
          latitude={Number(myRoadInfo?.splatIn ?? 0)}
          longitude={Number(myRoadInfo?.splngIn ?? 0)}
          image={IMAGES.depart_marker}
          width={widthScale1(43)}
          height={heightScale1(60)}
        />
      );
    }

    if (currentPassengerModeFilter?.carInOut === 'out') {
      if (temporaryRoute?.startCoordOut?.latitude && temporaryRoute?.startCoordOut?.longitude) {
        return (
          <NaverMapMarkerOverlay
            zIndex={1}
            latitude={Number(temporaryRoute?.startCoordOut?.latitude)}
            longitude={Number(temporaryRoute?.startCoordOut?.longitude)}
            image={IMAGES.depart_marker}
            width={widthScale1(43)}
            height={heightScale1(60)}
          />
        );
      }

      return (
        <NaverMapMarkerOverlay
          zIndex={1}
          latitude={Number(myRoadInfo?.splatOut ?? 0)}
          longitude={Number(myRoadInfo?.splngOut ?? 0)}
          image={IMAGES.depart_marker}
          width={widthScale1(43)}
          height={heightScale1(60)}
        />
      );
    }

    return null;
  }, [temporaryRoute, myRoadInfo, currentPassengerModeFilter?.carInOut]);

  const renderStartPlaceOutMarker = useMemo(() => {
    if (currentPassengerModeFilter?.carInOut === 'in') {
      if (temporaryRoute?.endCoordIn) {
        return (
          <NaverMapMarkerOverlay
            zIndex={1}
            latitude={Number(temporaryRoute?.endCoordIn?.latitude)}
            longitude={Number(temporaryRoute?.endCoordIn?.longitude)}
            image={IMAGES.arrive_marker}
            width={widthScale1(43)}
            height={heightScale1(60)}
          />
        );
      }

      return (
        <NaverMapMarkerOverlay
          zIndex={1}
          latitude={Number(myRoadInfo?.eplatIn ?? 0)}
          longitude={Number(myRoadInfo?.eplngIn ?? 0)}
          image={IMAGES.arrive_marker}
          width={widthScale1(43)}
          height={heightScale1(60)}
        />
      );
    }

    if (currentPassengerModeFilter?.carInOut === 'out') {
      if (temporaryRoute?.endCoordOut) {
        return (
          <NaverMapMarkerOverlay
            zIndex={1}
            latitude={Number(temporaryRoute?.endCoordOut?.latitude)}
            longitude={Number(temporaryRoute?.endCoordOut?.longitude)}
            image={IMAGES.arrive_marker}
            width={widthScale1(43)}
            height={heightScale1(60)}
          />
        );
      }

      return (
        <NaverMapMarkerOverlay
          zIndex={1}
          latitude={Number(myRoadInfo?.eplatOut ?? 0)}
          longitude={Number(myRoadInfo?.eplngOut ?? 0)}
          image={IMAGES.arrive_marker}
          width={widthScale1(43)}
          height={heightScale1(60)}
        />
      );
    }
  }, [temporaryRoute, myRoadInfo, currentPassengerModeFilter?.carInOut]);

  return (
    <View style={styles.containerStyle}>
      <MapHeader
        onLayout={(heightValue: number) => {
          headerHeightValue.current = heightValue;
        }}
        ref={headerRef}
        myRoadInfo={myRoadInfo}
        haveAReservationIsRunning={hasRunningRoute}
      />

      {isFocused && <StatusBar translucent backgroundColor={colors.transparent} />}

      <NaverMapView
        ref={mapRef}
        isShowLocationButton={false}
        isShowScaleBar={false}
        isShowCompass={false}
        isShowZoomControls={__DEV__ ? true : false}
        style={styles.containerStyle}>
        {myLocation && isFocused && (
          <NaverMapMarkerOverlay
            latitude={myLocation.lat}
            longitude={myLocation.long}
            image={IMAGES.animation_marker}
            width={widthScale1(30)}
            height={widthScale1(30)}
            zIndex={1}
          />
        )}

        {isFocused && renderStartPlaceInMarker}

        {isFocused && renderStartPlaceOutMarker}

        {isFocused &&
          listDriver &&
          listDriver?.map((item: DriverRoadDayModel) => {
            return (
              <DriverMarkerItem
                key={item?.id}
                item={item}
                onPress={() => {
                  const returnDate =
                    listAllRegisterdRouteOfDriver
                      ?.filter(
                        it =>
                          it?.c_memberId === item?.memberId &&
                          it?.carInOut === currentPassengerModeFilter?.carInOut &&
                          it?.state === 'N' &&
                          (currentPassengerModeFilter?.selectedDay?.length === 1
                            ? moment(
                                moment(it?.selectDay?.slice(0, 10), 'YYYY.MM.DD')
                                  .startOf('days')
                                  .valueOf(),
                              ).isSame(
                                moment(
                                  currentPassengerModeFilter?.selectedDay[0]?.dateString,
                                  'YYYY-MM-DD',
                                ).valueOf(),
                              )
                            : currentPassengerModeFilter?.selectedDay?.length === 2
                              ? moment(
                                  moment(it?.selectDay?.slice(0, 10), 'YYYY.MM.DD')
                                    .startOf('days')
                                    .valueOf(),
                                ).isBetween(
                                  moment(
                                    currentPassengerModeFilter?.selectedDay[0]?.dateString,
                                    'YYYY-MM-DD',
                                  ).valueOf(),
                                  moment(
                                    currentPassengerModeFilter?.selectedDay[1]?.dateString,
                                    'YYYY-MM-DD',
                                  ).valueOf(),
                                  'days',
                                  '[]',
                                )
                              : moment(
                                  moment(it?.selectDay?.slice(0, 10), 'YYYY.MM.DD')
                                    .startOf('days')
                                    .valueOf(),
                                ).isSameOrAfter(moment().startOf('day').valueOf())) &&
                          item?.startPlace === it?.startPlace &&
                          item?.endPlace === it?.endPlace &&
                          (item?.stopOverPlace ?? '') === (it?.stopOverPlace ?? ''),
                      )
                      .sort(
                        (a, b) =>
                          moment(a?.selectDay?.slice(0, 10), 'YYYY.MM.DD').valueOf() -
                          moment(b?.selectDay?.slice(0, 10), 'YYYY.MM.DD').valueOf(),
                      ) ?? [];
                  console.log('🚀 ~ listDriver?.map ~ returnDate:', returnDate?.length);

                  quickDriverRef?.current?.show(returnDate?.length > 0 ? returnDate : [item]);
                }}
              />
            );
          })}
      </NaverMapView>

      <QuickDriverInfo ref={quickDriverRef} />

      <ListRecommandDriver
        ref={listDriverRef}
        listDriver={sortDateListDriver(listDriver as any)}
        onScroll={onScrollListRecommandDriver}
        isLoading={isFetching}
      />

      <BottomRightButtons
        isShowButtonScrollUp={isShowButtonScrollUp}
        onPressGoToTop={() => {
          listDriverRef.current?.scrollToTop();
        }}
        isRunning={hasRunningRoute ? true : false}
      />

      <MapFooter
        ref={mapFooterRef}
        onViewListPress={handleOpenList}
        onBackToMyLocationPress={() => {
          const delta = getLocationDelta(myLocation?.lat ?? 0, myLocation?.long ?? 0, 500);
          mapRef?.current?.animateRegionTo({
            latitude: myLocation?.lat ?? 0,
            longitude: myLocation?.long ?? 0,
            latitudeDelta: delta.latitudeDelta,
            longitudeDelta: delta.longitudeDelta,
            duration: 300, // 애니메이션 시간 (ms)
          });
        }}
        haveAReservationIsRunning={hasRunningRoute}
      />

      {isFocused && <CustomFab haveAReservationIsRunning={!!hasRunningRoute} />}

      {!currentPassengerModeFilter?.routeRegistrationComplete ? (
        <ToastMessage containerStyle={{bottom: '40%'}} />
      ) : null}
    </View>
  );
});

export default PassengerHome;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    zIndex: 0,
  },
});
