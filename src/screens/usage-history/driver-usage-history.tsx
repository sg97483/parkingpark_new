import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import moment from 'moment';
import React, {memo, useCallback, useEffect, useMemo, useRef} from 'react';
import {DeviceEventEmitter, ScrollView, StyleSheet, View} from 'react-native';
import CustomFilterButton from '~components/commons/custom-filter-button';
import EmptyList from '~components/commons/empty-list';
import HStack from '~components/h-stack';
import CarpoolUsageHistoryItem from '~components/usage-history.tsx/carpool-usage-history-item';
import DriverUsageFilter, {
  DriverUsageFilterRefs,
} from '~components/usage-history.tsx/driver-usage-filter';
import {PADDING1} from '~constants/constant';
import {EMIT_EVENT} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {CarpoolPayHistoryModel} from '~model/passenger-model';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useGetPayHistoryDriverQuery, useLazyUpdateEstPriceQuery} from '~services/driverServices';
import {useUpdateRoadDayStateCheckMutation} from '~services/passengerServices';
import {useLazyUpdateStatusCarpoolHistoryQuery} from '~services/usageHistoryServices';
import {useAppSelector} from '~store/storeHooks';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface ParamsFilter {
  d_memberId: number;
  filterInOut?: number;
  filterState?: number;
  filterftDate?: number;
  frDate?: string;
  toDate?: string;
}

const DriverUsageHistory: React.FC = memo(() => {
  const {userID, myDriverInfo} = userHook();
  const navigation = useNavigation<UseRootStackNavigation>();
  const carpoolFilterRef = useRef<DriverUsageFilterRefs>(null);
  const filterScrollRef = useRef<ScrollView>(null);
  const driverUsageFilter = useAppSelector(
    state => state?.carpoolReducer?.driverUsageHistoryFilter,
  );

  const paramsDriverFilter = useMemo((): ParamsFilter => {
    const commonParams: ParamsFilter = {
      filterInOut: driverUsageFilter?.carInOut === 'in' ? 1 : 2,
      d_memberId: userID as number,
    };

    if (driverUsageFilter?.carInOut === 'in') {
      commonParams.filterInOut = 1;
    } else if (driverUsageFilter?.carInOut === 'out') {
      commonParams.filterInOut = 2;
    } else {
      commonParams.filterInOut = 0;
    }

    switch (driverUsageFilter?.statusBooking) {
      case 'R':
        commonParams.filterState = 1;
        break;
      case 'E':
        commonParams.filterState = 2;
        break;
      case 'C':
        commonParams.filterState = 3;
        break;
      case 'P':
        commonParams.filterState = 4;
        break;
      default:
        commonParams.filterState = 0;
        break;
    }

    if (driverUsageFilter?.startDate || driverUsageFilter?.endDate) {
      commonParams.filterftDate = 1;
    } else {
      commonParams.filterftDate = 0;
    }

    if (driverUsageFilter?.startDate && driverUsageFilter?.endDate) {
      const fromDate = moment(driverUsageFilter?.startDate).format('YYYY-MM-DD');
      const toDate = moment(driverUsageFilter?.endDate).format('YYYY-MM-DD');
      commonParams.frDate = fromDate;
      commonParams.toDate = toDate;
    }

    return commonParams;
  }, [driverUsageFilter, userID]);

  const {
    data: listPaymentHistory,
    isFetching,
    refetch,
    isUninitialized,
  } = useGetPayHistoryDriverQuery(paramsDriverFilter, {skip: !userID || !paramsDriverFilter});

  const [updateStatusCheck] = useLazyUpdateStatusCarpoolHistoryQuery();
  const [updateStateCheck] = useUpdateRoadDayStateCheckMutation();
  const [updateEstPrice] = useLazyUpdateEstPriceQuery();

  useFocusEffect(
    useCallback(() => {
      if (!isUninitialized) {
        refetch();
      }
    }, [isUninitialized]),
  );

  useEffect(() => {
    DeviceEventEmitter.addListener(EMIT_EVENT.PASSENGER_CANCEL_PAYMENT, refetch);
  }, []);

  const filterDriverUsageList = useMemo(
    (): CarpoolPayHistoryModel[] =>
      listPaymentHistory?.filter(
        item => item?.rStatusCheck !== 'N' && item?.rStatusCheck !== 'A',
      ) ?? [],
    [listPaymentHistory],
  );

  useEffect(() => {
    const currentDate = moment().format('YYYYMMDD');
    const currentTime = moment().format('HH:mm').valueOf();
    const currentHour = moment().hours();

    listPaymentHistory?.map(carpool => {
      const selectDay = moment(carpool?.selectDay?.slice(0, 10) as string, 'YYYY.MM.DD').format(
        'YYYYMMDD',
      );

      const startTime = moment(carpool?.startTime, 'HH:mm').format('HH:mm').valueOf();

      const before_current_day = Number(selectDay);
      const current_day = Number(currentDate);
      const diff_days = before_current_day - current_day;

      const isOverTime = carpool?.carInOut === 'out' ? currentHour >= 20 : currentHour >= 9;

      if (
        (diff_days < 0 || (diff_days === 0 && isOverTime)) &&
        (carpool?.rStatusCheck === 'O' ||
          carpool?.rStatusCheck === 'R' ||
          carpool?.state === 'R' ||
          carpool?.state === 'O')
      ) {
        let estPrice = 0;
        if (myDriverInfo?.calYN === 'M') {
          estPrice = Number(carpool?.price) - Number(carpool?.price) * 0.25;
        } else {
          estPrice = Number(carpool?.price) - Number(carpool?.price) * 0.2;
        }

        updateStatusCheck({id: carpool?.id?.toString(), rStatusCheck: 'E'})
          .unwrap()
          .then(res => {});
        updateStateCheck({
          isPassengerRoute: false,
          roadInfoId: Number(carpool?.roadInfoId),
          state: 'E',
        })
          .unwrap()
          .then(res => {});
        updateEstPrice({
          id: carpool?.roadInfoId,
          estPrice: estPrice,
        });
      }
    });
  }, [listPaymentHistory]);

  const renderItem = useCallback(
    ({item}: {item: CarpoolPayHistoryModel}) => {
      return (
        <CarpoolUsageHistoryItem
          item={item}
          onItemPress={() => {
            navigation.navigate(ROUTE_KEY.DetailContentCarpool, {
              item: item,
              type: 'DRIVER_HISTORY',
            });
          }}
          type="FOR_DRIVER"
        />
      );
    },
    [listPaymentHistory],
  );

  const getRouteText = useMemo(() => {
    switch (driverUsageFilter?.carInOut) {
      case 'in':
        return '출근길';
      case 'out':
        return '퇴근길';
      default:
        return '경로';
    }
  }, [driverUsageFilter?.carInOut]);

  const getStatusBookingText = useMemo(() => {
    switch (driverUsageFilter?.statusBooking) {
      case 'R':
        return '예약완료';
      case 'E':
        return '카풀완료';
      case 'C':
        return '예약취소';
      case 'P':
        return '패널티 부과';
      default:
        return '진행상태';
    }
  }, [driverUsageFilter?.statusBooking]);

  const getTimeText = useMemo(() => {
    if (driverUsageFilter?.startDate && driverUsageFilter?.endDate) {
      return `${moment(driverUsageFilter?.startDate).format('YYYY년 MM월')}~${moment(
        driverUsageFilter?.endDate,
      ).format('YYYY년 MM월')}`;
    }

    return '조회기간';
  }, [driverUsageFilter?.startDate, driverUsageFilter?.endDate]);

  return (
    <View style={styles.containerStyle}>
      <HStack style={styles.filterWrapperStyle}>
        <ScrollView
          ref={filterScrollRef}
          scrollEnabled={!!driverUsageFilter?.startDate && !!driverUsageFilter?.endDate}
          contentContainerStyle={{
            gap: widthScale1(10),
            paddingHorizontal: PADDING1,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}>
          <CustomFilterButton
            iconRight
            onPress={() => {
              carpoolFilterRef?.current?.show();
            }}
            type={driverUsageFilter?.carInOut !== '' ? 'DARK' : 'LIGHT'}
            text={getRouteText}
          />

          <CustomFilterButton
            iconRight
            onPress={() => {
              carpoolFilterRef?.current?.show();
            }}
            type={driverUsageFilter?.statusBooking !== '' ? 'DARK' : 'LIGHT'}
            text={getStatusBookingText}
          />

          <CustomFilterButton
            iconRight
            onPress={() => {
              carpoolFilterRef?.current?.show();
            }}
            type={driverUsageFilter?.startDate && driverUsageFilter?.endDate ? 'DARK' : 'LIGHT'}
            text={getTimeText}
          />
        </ScrollView>
      </HStack>

      <FlashList
        data={filterDriverUsageList}
        estimatedItemSize={150}
        renderItem={renderItem}
        ListEmptyComponent={() => <EmptyList text="이용내역이 없습니다." top={heightScale1(218)} />}
        onRefresh={refetch}
        refreshing={isFetching}
      />

      <DriverUsageFilter ref={carpoolFilterRef} filterScrollRef={filterScrollRef} />
    </View>
  );
});

export default DriverUsageHistory;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  filterWrapperStyle: {
    paddingVertical: heightScale1(14),
  },
});
