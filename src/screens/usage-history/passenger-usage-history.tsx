import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import moment from 'moment';
import React, {memo, useCallback, useEffect, useMemo, useRef} from 'react';
import {DeviceEventEmitter, ScrollView, StyleSheet, View} from 'react-native';
import CustomFilterButton from '~components/commons/custom-filter-button';
import EmptyList from '~components/commons/empty-list';
import PageButton from '~components/commons/page-button';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import CarpoolUsageHistoryItem from '~components/usage-history.tsx/carpool-usage-history-item';
import PassUsageFilter, {
  PassUsageFilterRefs,
} from '~components/usage-history.tsx/pass-usage-filter';
import {PADDING1} from '~constants/constant';
import {EMIT_EVENT} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {CarpoolPayHistoryModel} from '~model/passenger-model';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useLazyUpdateEstPriceQuery} from '~services/driverServices';
import {
  useGetPayHistoryRiderQuery,
  useUpdateRoadDayStateCheckMutation,
} from '~services/passengerServices';
import {useLazyUpdateStatusCarpoolHistoryQuery} from '~services/usageHistoryServices';
import {useLazyReadMyDriverQuery} from '~services/userServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface ParamsFilter {
  r_memberId: number;
  filterInOut?: number;
  filterState?: number;
  filterftDate?: number;
  frDate?: string;
  toDate?: string;
}

const PassengerUsageHistory: React.FC = memo(() => {
  const {userID} = userHook();
  const navigation = useNavigation<UseRootStackNavigation>();
  const carpoolFilterRef = useRef<PassUsageFilterRefs>(null);
  const filterScrollRef = useRef<ScrollView>(null);
  const processedItemsRef = useRef<Set<string>>(new Set());
  const passUsageFilter = useAppSelector(
    state => state?.carpoolReducer?.passengerUsageHistoryFilter,
  );

  const paramsPassengerFilter = useMemo((): ParamsFilter => {
    const commonParams: ParamsFilter = {
      filterInOut: passUsageFilter?.carInOut === 'in' ? 1 : 2,
      r_memberId: userID as number,
    };

    if (passUsageFilter?.carInOut === 'in') {
      commonParams.filterInOut = 1;
    } else if (passUsageFilter?.carInOut === 'out') {
      commonParams.filterInOut = 2;
    } else {
      commonParams.filterInOut = 0;
    }

    switch (passUsageFilter?.statusBooking) {
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

    if (passUsageFilter?.startDate || passUsageFilter?.endDate) {
      commonParams.filterftDate = 1;
    } else {
      commonParams.filterftDate = 0;
    }

    if (passUsageFilter?.startDate && passUsageFilter?.endDate) {
      const fromDate = moment(passUsageFilter?.startDate).format('YYYY-MM-DD');
      const toDate = moment(passUsageFilter?.endDate).format('YYYY-MM-DD');
      commonParams.frDate = fromDate;
      commonParams.toDate = toDate;
    }

    return commonParams;
  }, [passUsageFilter, userID]);

  const {
    data: listPaymentHistory,
    isFetching,
    refetch,
    isUninitialized,
  } = useGetPayHistoryRiderQuery(paramsPassengerFilter, {skip: !userID || !paramsPassengerFilter});
  const [updateStatusCheck] = useLazyUpdateStatusCarpoolHistoryQuery();
  const [readMyDriverInfo] = useLazyReadMyDriverQuery();
  const [updateStateCheck] = useUpdateRoadDayStateCheckMutation();

  const [updateEstPrice] = useLazyUpdateEstPriceQuery();

  // 데이터의 실제 내용이 변경되었을 때만 실행되도록 ID 기반 해시 생성
  const paymentHistoryHash = useMemo(
    () => listPaymentHistory?.map(item => `${item.id}-${item.rStatusCheck}`).join('|') || '',
    [listPaymentHistory],
  );

  useEffect(() => {
    const currentDate = moment().format('YYYYMMDD');
    const currentHour = moment().hours();

    // 1. 조건에 맞는 항목만 필터링 (이미 처리된 항목 제외)
    const itemsToUpdate = listPaymentHistory?.filter(carpool => {
      const carpoolId = carpool?.id?.toString();
      
      // 이미 처리된 항목은 건너뛰기
      if (processedItemsRef.current.has(carpoolId)) {
        return false;
      }

      const selectDay = moment(carpool?.selectDay?.slice(0, 10) as string, 'YYYY.MM.DD').format(
        'YYYYMMDD',
      );
      const before_current_day = Number(selectDay);
      const current_day = Number(currentDate);
      const diff_days = before_current_day - current_day;
      const isOverTime = carpool?.carInOut === 'out' ? currentHour >= 20 : currentHour >= 9;

      return (
        (diff_days < 0 || (diff_days === 0 && isOverTime)) &&
        (carpool?.rStatusCheck === 'O' ||
          carpool?.rStatusCheck === 'R' ||
          carpool?.state === 'R' ||
          carpool?.state === 'O')
      );
    }) || [];

    if (itemsToUpdate.length === 0) {
      return;
    }

    // 2. 즉시 processedItemsRef에 추가 (타이밍 이슈 방지)
    itemsToUpdate.forEach(carpool => {
      const carpoolId = carpool?.id?.toString();
      processedItemsRef.current.add(carpoolId);
    });

    // 3. 고유한 memberId 추출 (중복 제거)
    const uniqueMemberIds = [
      ...new Set(
        itemsToUpdate
          .map(item => item.d_memberId?.toString())
          .filter((id): id is string => !!id),
      ),
    ];

    // 4. 드라이버 정보 조회 및 처리
    const processItems = async () => {
      const driverInfoCache = new Map<string, any>();

      // 각 고유 memberId당 한 번만 조회
      for (const memberId of uniqueMemberIds) {
        try {
          const res = await readMyDriverInfo({memberId}).unwrap();
          driverInfoCache.set(memberId, res);
        } catch (error) {
          console.error(`Failed to fetch driver info for ${memberId}:`, error);
        }
      }

      // 모든 항목 처리
      itemsToUpdate.forEach(carpool => {
        updateStatusCheck({id: carpool?.id?.toString(), rStatusCheck: 'E'})
          .unwrap()
          .then(() => {});

        updateStateCheck({
          isPassengerRoute: true,
          roadInfoId: Number(carpool?.roadInfoId),
          state: 'E',
        });

        // 캐시된 드라이버 정보 사용
        const driverInfo = driverInfoCache.get(carpool?.d_memberId?.toString());
        if (driverInfo) {
          let estPrice = 0;
          if (driverInfo?.calYN === 'M') {
            estPrice = Number(carpool?.price) - Number(carpool?.price) * 0.25;
          } else {
            estPrice = Number(carpool?.price) - Number(carpool?.price) * 0.2;
          }
          updateEstPrice({
            id: carpool?.roadInfoId,
            estPrice: estPrice,
          });
        }
      });
    };

    processItems();
  }, [paymentHistoryHash]); // listPaymentHistory 대신 paymentHistoryHash 사용

  useFocusEffect(
    useCallback(() => {
      if (!isUninitialized) {
        refetch();
      }
    }, [isUninitialized]),
  );

  const renderItem = useCallback(({item}: {item: CarpoolPayHistoryModel}) => {
    return (
      <CarpoolUsageHistoryItem
        item={item}
        onItemPress={() => {
          navigation.navigate(ROUTE_KEY.DetailContentCarpool, {
            item: item,
            type: 'PASSENGER_HISTORY',
          });
        }}
        type="FOR_PASSENGER"
      />
    );
  }, []);

  const getRouteText = useMemo(() => {
    switch (passUsageFilter?.carInOut) {
      case 'in':
        return '출근길';
      case 'out':
        return '퇴근길';
      default:
        return '경로';
    }
  }, [passUsageFilter?.carInOut]);

  const getStatusBookingText = useMemo(() => {
    switch (passUsageFilter?.statusBooking) {
      case 'P':
        return '패널티 부과';
      case 'C':
        return '예약취소';
      case 'E':
        return '카풀완료';
      case 'R':
        return '예약완료';
      default:
        return '진행상태';
    }
  }, [passUsageFilter?.statusBooking]);

  const getTimeText = useMemo(() => {
    if (passUsageFilter?.startDate && passUsageFilter?.endDate) {
      return `${moment(passUsageFilter?.startDate).format('YYYY년 MM월')}~${moment(
        passUsageFilter?.endDate,
      ).format('YYYY년 MM월')}`;
    }

    return '조회기간';
  }, [passUsageFilter?.startDate, passUsageFilter?.endDate]);

  const filterPassengerUsageList = (data: CarpoolPayHistoryModel[]) => {
    return data?.filter(item => item?.rStatusCheck !== 'N' && item?.rStatusCheck !== 'A');
  };

  useEffect(() => {
    DeviceEventEmitter.addListener(EMIT_EVENT.DRIVER_CANCEL_PAYMENT, refetch);
  }, []);

  return (
    <View style={styles.containerStyle}>
      <HStack style={styles.filterWrapperStyle}>
        <ScrollView
          ref={filterScrollRef}
          scrollEnabled={!!passUsageFilter?.startDate && !!passUsageFilter?.endDate}
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
            type={passUsageFilter?.carInOut !== '' ? 'DARK' : 'LIGHT'}
            text={getRouteText}
          />

          <CustomFilterButton
            iconRight
            onPress={() => {
              carpoolFilterRef?.current?.show();
            }}
            type={passUsageFilter?.statusBooking !== '' ? 'DARK' : 'LIGHT'}
            text={getStatusBookingText}
          />

          <CustomFilterButton
            iconRight
            onPress={() => {
              carpoolFilterRef?.current?.show();
            }}
            type={passUsageFilter?.startDate && passUsageFilter?.endDate ? 'DARK' : 'LIGHT'}
            text={getTimeText}
          />
        </ScrollView>
      </HStack>

      <FlashList
        data={filterPassengerUsageList(listPaymentHistory as any)}
        estimatedItemSize={150}
        renderItem={renderItem}
        onRefresh={refetch}
        refreshing={isFetching}
        ListHeaderComponent={() => {
          return (
            <PaddingHorizontalWrapper
              containerStyles={{
                marginBottom: heightScale1(30),
              }}
              forDriveMe>
              <PageButton
                text="카풀 요청 등록내역 확인"
                onPress={() => {
                  navigation.navigate(ROUTE_KEY.CarpoolRequestRegistrationList, {
                    passengerID: userID as number,
                  });
                }}
              />
            </PaddingHorizontalWrapper>
          );
        }}
        ListEmptyComponent={() => <EmptyList text="이용내역이 없습니다." top={heightScale1(140)} />}
      />

      <PassUsageFilter ref={carpoolFilterRef} filterScrollRef={filterScrollRef} />
    </View>
  );
});

export default PassengerUsageHistory;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  filterWrapperStyle: {
    paddingVertical: heightScale1(14),
  },
  filterStyle: {
    borderWidth: 1,
    borderRadius: 999,
    minHeight: heightScale1(32),
    paddingHorizontal: widthScale1(14),
    borderColor: colors.disableButton,
  },
});
