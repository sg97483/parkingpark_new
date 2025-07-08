import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useMemo} from 'react';
import {BackHandler, StyleSheet} from 'react-native';
import CustomButton from '~components/commons/custom-button';
import InfoPriceRoute from '~components/commons/info-price-route';
import RouteBadge from '~components/commons/route-badge';
import CustomHeader from '~components/custom-header';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import {PADDING1} from '~constants/constant';
import {FONT} from '~constants/enum';
import {ROUTE_KEY} from '~navigators/router';
import {userHook} from '~hooks/userHook';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheMyDriverInfo, changeCarpoolMode} from '~reducers/userReducer';
import {useGetMyDriverRoadQuery, useGetMyRiderRoadQuery} from '~services/carpoolServices';
import {useGetDrivingDirectionQuery} from '~services/naverMapServices';
import {useCheckAuthDriverAndPassengerMutation} from '~services/userServices';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

const MyWorkRoute = (props: RootStackScreenProps<'MyWorkRoute'>) => {
  const {navigation, route} = props;
  const {isPassenger} = route.params;

  const dispatch = useAppDispatch();
  const {CMemberID, userID} = userHook();
  const isFocused = useIsFocused();
  const [checkAuthDriverAndPassenger, {isLoading}] = useCheckAuthDriverAndPassengerMutation();
  const isFirstTimeApproval = useAppSelector(state => state?.carpoolReducer?.isFirstTimeApproval);

  // ✅ Hook들은 무조건 호출
  const riderRoadQuery = useGetMyRiderRoadQuery({memberId: userID!, id: CMemberID!});
  const driverRoadQuery = useGetMyDriverRoadQuery({id: CMemberID!, memberId: userID!});

  // ✅ 필요한 값은 분기해서 선택
  const data = isPassenger ? riderRoadQuery.data : driverRoadQuery.data;
  const isFetching = isPassenger ? riderRoadQuery.isFetching : driverRoadQuery.isFetching;
  const refetch = isPassenger ? riderRoadQuery.refetch : driverRoadQuery.refetch;

  const hasStopPlaceIn = useMemo(
    (): boolean =>
      data?.stopOverPlaceIn &&
      data?.soPriceIn &&
      data?.soPriceIn !== '0' &&
      data?.soplatIn &&
      data?.soplngIn
        ? true
        : false,
    [data],
  );
  const hasStopPlaceOut = useMemo(
    (): boolean =>
      data?.stopOverPlaceOut &&
      data?.soPriceOut &&
      data?.soPriceOut !== '0' &&
      data?.soplatOut &&
      data?.soplngOut
        ? true
        : false,
    [data],
  );

  const {data: directionIn} = useGetDrivingDirectionQuery(
    {
      start: `${data?.splngIn},${data?.splatIn}`,
      end: `${data?.eplngIn},${data?.eplatIn}`,
      waypoints: data?.soplatIn && data?.soplngIn ? `${data?.soplngIn},${data?.soplatIn}` : '',
    },
    {skip: !data},
  );

  const {data: directionOut} = useGetDrivingDirectionQuery(
    {
      start: `${data?.splngOut},${data?.splatOut}`,
      end: `${data?.eplngOut},${data?.eplatOut}`,
      waypoints: data?.soplngOut && data?.soplatOut ? `${data?.soplngOut},${data?.soplatOut}` : '',
    },
    {skip: !data},
  );

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused]);

  const endTimeIn = useMemo(() => {
    if (directionIn?.duration) {
      return moment(data?.startTimeIn, 'HH:mm')
        .add(directionIn?.duration, 'minutes')
        .format('HH:mm');
    }

    return '';
  }, [directionIn, data]);

  const endTimeOut = useMemo(() => {
    if (directionOut?.duration) {
      return moment(data?.startTimeOut, 'HH:mm')
        .add(directionOut?.duration, 'minutes')
        .format('HH:mm');
    }

    return '';
  }, [directionOut, data]);

  const onPressGetStarted = () => {
    checkAuthDriverAndPassenger({
      memberId: userID,
      id: CMemberID,
    })
      .unwrap()
      .then(returnedAuthValue => {
        if (data) {
          dispatch(cacheMyDriverInfo(data as any));
        }
        if (isPassenger) {
          dispatch(changeCarpoolMode('PASSENGER'));
          navigation.navigate(ROUTE_KEY.ParkingParkHome, {selectedTab: 1});
        } else {
          if (returnedAuthValue.authDriver === 'Y' && isFirstTimeApproval) {
            navigation.navigate(ROUTE_KEY.DriverCompleteApproval);
          } else if (returnedAuthValue.authDriver === 'Y' && !isFirstTimeApproval) {
            dispatch(changeCarpoolMode('DRIVER'));
            navigation.navigate(ROUTE_KEY.ParkingParkHome, {selectedTab: 2});
          } else {
            // dispatch(changeCarpoolMode('DRIVER'));
            navigation.navigate(ROUTE_KEY.DriverWaitingApproved);
          }
        }
      });
  };

  useEffect(() => {
    const subBack = BackHandler.addEventListener('hardwareBackPress', () => isFocused);
    return () => subBack.remove();
  }, [isFocused]);

  const onPressRoadInPassenger = () => {
    if (data) {
      navigation.push(ROUTE_KEY.WayToWorkRegistration5, {
        dataEdit: data,
        isEdit: true,
        isRoadOut: false,
        isEditMyWork: true,
      });
    }
  };
  const onPressRoadOutPassenger = () => {
    if (data) {
      navigation.push(ROUTE_KEY.WayToWorkRegistration5, {
        dataOldRoute: data,
        isEdit: true,
        isRoadOut: true,
        isEditMyWork: true,
      });
    }
  };

  const onPressRoadInDriver = () => {
    navigation.navigate(ROUTE_KEY.DriverWayToWork4, {
      dataEdit: data,
      isEditMyRoute: true,
      hasAddressStop: hasStopPlaceIn,
    });
  };

  const onPressRoadOutDriver = () => {
    navigation.navigate(ROUTE_KEY.DriverWayToWork4, {
      dataEdit: data,
      isRoadOut: true,
      isEditMyRoute: true,
      hasAddressStop: hasStopPlaceOut,
    });
  };

  console.log('🚀 ~ onPressRoadInPassenger ~ isEditMyWork:', data?.soPriceOut);

  return (
    <FixedContainer pointerEvents={isFetching ? 'none' : undefined}>
      <CustomHeader text="나의 출퇴근 경로" hideBack />

      {/* ROAD IN */}
      <PaddingHorizontalWrapper containerStyles={{marginTop: PADDING1}} forDriveMe>
        <HStack style={styles.headerWrapperStyle}>
          <RouteBadge />

          <CustomButton
            onPress={isPassenger ? onPressRoadInPassenger : onPressRoadInDriver}
            type="TERTIARY"
            text="변경"
            outLine
            buttonHeight={38}
            buttonStyle={styles.buttonStyle}
            textSize={FONT.CAPTION_6}
          />
        </HStack>

        <RoutePlanner
          isParkingFrom={!!data?.startParkIdIn}
          isParking={!!data?.endParkIdIn}
          arriveAddress={data?.endPlaceIn || ''}
          startAddress={data?.startPlaceIn || ''}
          stopOverAddress={data?.stopOverPlaceIn ? data?.stopOverPlaceIn : undefined}
          timeArrive={endTimeIn ? endTimeIn : '--:--'}
          timeStart={data?.startTimeIn || ''}
        />

        <HStack style={styles.priceWrapperStyle}>
          <InfoPriceRoute hideChevron price={data?.priceIn ?? ''} soPrice={data?.soPriceIn ?? ''} />
        </HStack>
      </PaddingHorizontalWrapper>

      {/* ROAD OUT */}
      <Divider style={{marginVertical: heightScale1(30)}} />

      <PaddingHorizontalWrapper forDriveMe>
        <HStack style={styles.headerWrapperStyle}>
          <RouteBadge type="WAY_HOME" />

          <CustomButton
            onPress={isPassenger ? onPressRoadOutPassenger : onPressRoadOutDriver}
            type="TERTIARY"
            text="변경"
            outLine
            buttonHeight={38}
            buttonStyle={styles.buttonStyle}
            textSize={FONT.CAPTION_6}
          />
        </HStack>
        <RoutePlanner
          isParkingFrom={!!data?.startParkIdOut}
          isParking={!!data?.endParkIdOut}
          arriveAddress={data?.endPlaceOut || ''}
          startAddress={data?.startPlaceOut || ''}
          stopOverAddress={data?.stopOverPlaceOut ? data?.stopOverPlaceOut : undefined}
          timeArrive={endTimeOut ? endTimeOut : '--:--'}
          timeStart={data?.startTimeOut || ''}
        />
        <HStack style={styles.priceWrapperStyle}>
          <InfoPriceRoute
            hideChevron
            price={data?.priceOut ?? ''}
            soPrice={data?.soPriceOut ?? ''}
          />
        </HStack>
      </PaddingHorizontalWrapper>

      <CustomButton
        buttonStyle={styles.button}
        onPress={onPressGetStarted}
        text={'태워줘 시작하기'}
        buttonHeight={58}
        isLoading={isFetching || isLoading}
        disabled={!endTimeIn || !endTimeOut}
      />
    </FixedContainer>
  );
};

export default MyWorkRoute;

const styles = StyleSheet.create({
  button: {
    marginHorizontal: PADDING1,
    marginBottom: heightScale1(10),
    marginTop: 'auto',
  },
  headerWrapperStyle: {
    justifyContent: 'space-between',
    marginBottom: PADDING1,
  },
  priceWrapperStyle: {
    marginTop: PADDING1,
    justifyContent: 'flex-end',
  },
  buttonStyle: {
    paddingHorizontal: widthScale1(10),
    minWidth: widthScale1(45),
  },
});
