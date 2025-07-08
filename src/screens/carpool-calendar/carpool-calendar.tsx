import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {DeviceEventEmitter, RefreshControl, ScrollView, View} from 'react-native';
import {DateData} from 'react-native-calendars';
import ExpandMonthCalendar from '~components/calendar/expand-month-calendar';
import CarpoolNotRegister from '~components/carpool-calendar/carpool-not-register';
import WeeklyCarpoolItem from '~components/carpool-calendar/weekly-carpool-item';
import ToastMessage from '~components/commons/toast-message/toast-message';
import CustomHeader from '~components/custom-header';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {EMIT_EVENT} from '~constants/enum';
import {RoadInDriverUpdateProps} from '~constants/types';
import {userHook} from '~hooks/userHook';
import {DriverRoadDayModel, RouteRegisterModel} from '~model/driver-model';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetMyDriverRoadQuery} from '~services/carpoolServices';
import {useReadDriverRoadInfoListQuery} from '~services/driverServices';
import {colors} from '~styles/colors';
import {dayjs} from '~utils/dayjsUtil';
import {getDayName} from '~utils/hourUtils';

const CarpoolCalendar = (props: RootStackScreenProps<'CarpoolCalendar'>) => {
  const {navigation} = props;

  const {userID, CMemberID} = userHook();

  const {
    data: myRoadRegisterd,
    refetch,
    isFetching,
  } = useReadDriverRoadInfoListQuery(
    {
      c_memberId: userID,
    },
    {skip: !userID},
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  const formatMyRoadRegisterd = useMemo(
    () => myRoadRegisterd?.filter(item => item?.state !== 'C' && item.state !== 'P'),
    [myRoadRegisterd],
  );

  const {data: myRoadData} = useGetMyDriverRoadQuery({
    id: CMemberID!,
    memberId: userID!,
  });

  useEffect(() => {
    const refetchData = DeviceEventEmitter.addListener(EMIT_EVENT.CARPOOL_WAY_TO_WORK, () => {
      refetch();
    });

    return () => {
      refetchData.remove();
    };
  }, []);

  const [selectedDate, setSelectedDate] = useState<DateData>({
    year: dayjs().year(),
    month: dayjs().month() + 1,
    day: dayjs().date(),
    dateString: dayjs().format('YYYY-MM-DD'),
    timestamp: dayjs().unix(),
  });

  const isPastDay = useMemo(
    () => moment(moment().format('YYYY-MM-DD')).isAfter(selectedDate?.dateString),
    [selectedDate],
  );

  const workBooking = useMemo(() => {
    return formatMyRoadRegisterd?.find(
      (item: DriverRoadDayModel) =>
        moment(item?.selectDay?.slice(0, 10), 'YYYY.MM.DD').format('YYYY-MM-DD') ===
          selectedDate.dateString && item?.carInOut === 'in',
    );
  }, [selectedDate, formatMyRoadRegisterd]);

  const homeBooking = useMemo(() => {
    return formatMyRoadRegisterd?.find(
      (item: DriverRoadDayModel) =>
        moment(item?.selectDay?.slice(0, 10), 'YYYY.MM.DD').format('YYYY-MM-DD') ===
          selectedDate.dateString && item?.carInOut === 'out',
    );
  }, [selectedDate, formatMyRoadRegisterd]);

  const workRecommendRoute: RouteRegisterModel = useMemo(() => {
    return {
      carInOut: 'in',
      endPlace: myRoadData?.endPlaceIn || '',
      endTime: '도착지',
      startTime: myRoadData?.startTimeIn || '',
      startPlace: myRoadData?.startPlaceIn || '',
      eplat: myRoadData?.eplatIn || 0,
      eplng: myRoadData?.eplngIn || 0,
      splat: myRoadData?.splatIn || 0,
      splng: myRoadData?.splngIn || 0,
      stopOverPlace: myRoadData?.stopOverPlaceIn || '',
      soplat: myRoadData?.soplatIn,
      soplng: myRoadData?.soplngIn,
      selectDate: dayjs(selectedDate.dateString).format(
        `YYYY.MM.DD(${getDayName(moment(selectedDate?.dateString, 'YYYY-MM-DD').valueOf())})`,
      ),
      price: myRoadData?.priceIn,

      introduce: myRoadData?.introduce,
      soPrice: myRoadData?.soPriceIn,
      startParkIdIn: myRoadData?.startParkIdIn?.toString() || '',
      endParkIdIn: myRoadData?.endParkIdIn?.toString() || '',
    };
  }, [myRoadData, selectedDate]);

  const homeRecommendRoute: RouteRegisterModel = useMemo(() => {
    return {
      carInOut: 'out',
      endPlace: myRoadData?.endPlaceOut || '',
      endTime: '도착지',
      startTime: myRoadData?.startTimeOut || '',
      startPlace: myRoadData?.startPlaceOut || '',
      eplat: myRoadData?.eplatOut || 0,
      eplng: myRoadData?.eplngOut || 0,
      splat: myRoadData?.splatOut || 0,
      splng: myRoadData?.splngOut || 0,
      stopOverPlace: myRoadData?.stopOverPlaceOut || '',
      soplat: myRoadData?.soplatOut,
      soplng: myRoadData?.soplngOut,
      selectDate: dayjs(selectedDate?.dateString).format(
        `YYYY.MM.DD(${getDayName(moment(selectedDate?.dateString, 'YYYY-MM-DD').valueOf())})`,
      ),
      price: myRoadData?.priceOut,
      introduce: myRoadData?.introduceOut,
      soPrice: myRoadData?.soPriceOut,
      startParkIdOut: myRoadData?.startParkIdOut?.toString() || '',
      endParkIdOut: myRoadData?.endParkIdOut?.toString() || '',
    };
  }, [myRoadData, selectedDate]);

  const routeInRegistered: RoadInDriverUpdateProps | undefined = useMemo(() => {
    if (workBooking) {
      if (!workBooking?.stopOverPlace) {
        const data = {
          c_memberId: workBooking.c_memberId,
          startPlaceIn: workBooking.startPlace,
          startTimeIn: workBooking.startTime,
          splatIn: workBooking?.splat ?? '0',
          splngIn: workBooking?.splng ?? '0',
          endPlaceIn: workBooking?.endPlace,
          eplatIn: workBooking?.eplat ?? '0',
          eplngIn: workBooking?.eplng ?? '0',
          priceIn: workBooking?.price,
          introduce: workBooking?.introduce,
          selectDayIn: workBooking?.selectDay,
          startParkIdIn: myRoadData?.startParkIdIn?.toString() || '',
          endParkIdIn: myRoadData?.endParkIdIn?.toString() || '',
        };
        return data as any;
      }
      const data = {
        c_memberId: workBooking.c_memberId,
        startPlaceIn: workBooking.startPlace,
        startTimeIn: workBooking.startTime,
        splatIn: workBooking?.splat ?? '0',
        splngIn: workBooking?.splng ?? '0',
        endPlaceIn: workBooking?.endPlace,
        eplatIn: workBooking?.eplat ?? '0',
        eplngIn: workBooking?.eplng ?? '0',
        priceIn: workBooking?.price,
        introduce: workBooking?.introduce,
        stopOverPlaceIn: workBooking?.stopOverPlace,
        soplatIn: workBooking?.soplat ?? '0',
        soplngIn: workBooking?.soplng ?? '0',
        selectDayIn: workBooking?.selectDay,
        soPriceIn: workBooking?.soPrice,
        startParkIdIn: myRoadData?.startParkIdIn?.toString() || '',
        endParkIdIn: myRoadData?.endParkIdIn?.toString() || '',
      };

      return data;
    }
    return undefined;
  }, [workBooking]);

  const renderCalender = useMemo(() => {
    return (
      <ExpandMonthCalendar
        onDateChange={date => {
          setSelectedDate(date);
        }}
        selectedDate={selectedDate}
        myRoadRegisterd={formatMyRoadRegisterd ?? []}
        isLoading={isFetching}
      />
    );
  }, [selectedDate, formatMyRoadRegisterd, isFetching]);

  return (
    <FixedContainer>
      <CustomHeader text={'카풀 캘린더'} />

      {renderCalender}

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} tintColor={colors.primary} />
        }
        contentContainerStyle={{
          paddingVertical: PADDING1,
          gap: PADDING1,
        }}>
        <View style={{gap: PADDING1}}>
          {workBooking ? (
            <PaddingHorizontalWrapper forDriveMe>
              <WeeklyCarpoolItem
                item={workBooking}
                onDeleteRouteSuccess={refetch}
                isPastDay={isPastDay}
              />
            </PaddingHorizontalWrapper>
          ) : (
            <CarpoolNotRegister route={workRecommendRoute} isPastDay={isPastDay} />
          )}

          <Divider />

          {homeBooking ? (
            <PaddingHorizontalWrapper forDriveMe>
              <WeeklyCarpoolItem
                item={homeBooking}
                onDeleteRouteSuccess={refetch}
                isPastDay={isPastDay}
              />
            </PaddingHorizontalWrapper>
          ) : (
            <CarpoolNotRegister
              route={homeRecommendRoute}
              routeInRegistered={routeInRegistered}
              isPastDay={isPastDay}
            />
          )}
        </View>
      </ScrollView>
      <ToastMessage />
    </FixedContainer>
  );
};

export default CarpoolCalendar;
