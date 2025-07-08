import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {memo, useEffect, useMemo} from 'react';
import {DeviceEventEmitter, ScrollView, StyleSheet, View} from 'react-native';
import CustomButton from '~components/commons/custom-button';
import InfoPriceRoute from '~components/commons/info-price-route';
import RouteBadge from '~components/commons/route-badge';
import Divider from '~components/divider';
import HStack from '~components/h-stack';
import MyRouteEmpty from '~components/my-route/my-route-empty';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import {PADDING1} from '~constants/constant';
import {EMIT_EVENT, FONT} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useGetMyRiderRoadQuery} from '~services/carpoolServices';
import {useGetDrivingDirectionQuery} from '~services/naverMapServices';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

const PassengerRoute: React.FC = memo(() => {
  const {userID, CMemberID} = userHook();
  const navigation = useNavigation<UseRootStackNavigation>();

  const {data, refetch} = useGetMyRiderRoadQuery({memberId: userID!, id: CMemberID!});

  const {data: directionIn} = useGetDrivingDirectionQuery(
    {
      start: `${data?.splngIn},${data?.splatIn}`,
      end: `${data?.eplngIn},${data?.eplatIn}`,
    },
    {skip: !data},
  );

  const {data: directionOut} = useGetDrivingDirectionQuery(
    {
      start: `${data?.splngOut},${data?.splatOut}`,
      end: `${data?.eplngOut},${data?.eplatOut}`,
    },
    {skip: !data},
  );

  useEffect(() => {
    const reload = DeviceEventEmitter.addListener(EMIT_EVENT.RELOAD_ROUTE_PASSENGER, () => {
      refetch();
    });
    return () => reload.remove();
  }, []);

  const isRouteRegistered = useMemo(
    (): boolean =>
      (data?.endPlaceIn?.length ?? 0) > 0 &&
      (data?.endPlaceOut?.length ?? 0) > 0 &&
      (data?.startPlaceIn?.length ?? 0) > 0 &&
      (data?.startPlaceOut?.length ?? 0) > 0,
    [data],
  );

  const endTimeIn = useMemo(() => {
    if (directionIn && data) {
      return moment(data.startTimeIn, 'HH:mm')
        .add(directionIn?.duration, 'minutes')
        .format('HH:mm');
    }
    return '';
  }, [directionIn, data]);

  const endTimeOut = useMemo(() => {
    if (directionOut && data) {
      return moment(data.startTimeOut, 'HH:mm')
        .add(directionOut?.duration, 'minutes')
        .format('HH:mm');
    }
    return '';
  }, [directionOut, data]);

  if (!isRouteRegistered) {
    return (
      <MyRouteEmpty
        onPress={() => {
          navigation.navigate(ROUTE_KEY.DriverCommunicationRegistration, {isPassenger: true});
        }}
        buttonText="경로 등록하고 탑승객 모드 시작하기"
      />
    );
  }

  return (
    <View style={styles.containerStyle}>
      <ScrollView contentContainerStyle={{paddingTop: PADDING1}}>
        {/* On the way to work */}
        <PaddingHorizontalWrapper forDriveMe>
          <HStack style={styles.headerWrapperStyle}>
            <RouteBadge />

            <CustomButton
              onPress={() => {
                navigation.navigate(ROUTE_KEY.WayToWorkRegistration5, {
                  dataOldRoute: data,
                  isEdit: true,
                  isRoadOut: false,
                });
              }}
              type="TERTIARY"
              text="변경"
              outLine
              buttonHeight={38}
              buttonStyle={styles.buttonStyle}
              textSize={FONT.CAPTION_6}
            />
          </HStack>

          <RoutePlanner
            isParking={!!data?.endParkIdIn}
            isParkingFrom={!!data?.startParkIdIn}
            arriveAddress={data?.endPlaceIn || ''}
            startAddress={data?.startPlaceIn || ''}
            stopOverAddress={data?.stopOverPlaceIn ? data?.startPlaceIn : undefined}
            timeArrive={endTimeIn}
            timeStart={data?.startTimeIn || ''}
          />

          <HStack style={styles.priceWrapperStyle}>
            <InfoPriceRoute hideChevron price={data?.priceIn ?? ''} />
          </HStack>
        </PaddingHorizontalWrapper>

        <Divider style={{marginVertical: heightScale1(30)}} />

        {/* Way home */}
        <PaddingHorizontalWrapper forDriveMe>
          <HStack style={styles.headerWrapperStyle}>
            <RouteBadge type="WAY_HOME" />

            <CustomButton
              onPress={() => {
                navigation.navigate(ROUTE_KEY.WayToWorkRegistration5, {
                  dataOldRoute: data,
                  isEdit: true,
                  isRoadOut: true,
                });
              }}
              type="TERTIARY"
              text="변경"
              outLine
              buttonHeight={38}
              buttonStyle={styles.buttonStyle}
              textSize={FONT.CAPTION_6}
            />
          </HStack>
          <RoutePlanner
            isParking={!!data?.endParkIdOut}
            isParkingFrom={!!data?.startParkIdOut}
            arriveAddress={data?.endPlaceOut || ''}
            startAddress={data?.startPlaceOut || ''}
            stopOverAddress={data?.stopOverPlaceOut ? data?.stopOverPlaceOut : undefined}
            timeArrive={endTimeOut}
            timeStart={data?.startTimeOut || ''}
          />
          <HStack style={styles.priceWrapperStyle}>
            <InfoPriceRoute hideChevron price={data?.priceOut ?? ''} />
          </HStack>
        </PaddingHorizontalWrapper>

        <Divider style={{marginVertical: heightScale1(30)}} />
      </ScrollView>
    </View>
  );
});

export default PassengerRoute;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: colors.white,
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
