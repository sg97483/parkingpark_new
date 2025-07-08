import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {DateData} from 'react-native-calendars';
import {ScrollView} from 'react-native-gesture-handler';
import CarpoolRequestFilter, {
  CarpoolRequestFilterRefs,
} from '~components/carpool-request/carpool-request-filter';
import CarpoolRequestList from '~components/carpool-request/carpool-request-list';
import CustomFilterButton from '~components/commons/custom-filter-button';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {DriverRoadDayModel} from '~model/driver-model';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetAllRouteRequestOfPassengerQuery} from '~services/driverServices';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {dayjs} from '~utils/dayjsUtil';

export interface CarpoolRequestFilterModel {
  carInOut: 'ALL' | 'IN' | 'OUT';
  gender: 'ALL' | 'MALE' | 'FEMALE';
  date: DateData[];
}

const CarpoolRequest = (props: RootStackScreenProps<'CarpoolRequest'>) => {
  const {navigation} = props;
  const text = strings.car_pool;
  const carpoolFilterRef = useRef<CarpoolRequestFilterRefs>(null);
  const {userID} = userHook();

  const [filter, setFilter] = useState<CarpoolRequestFilterModel>({
    carInOut: 'ALL',
    date: [],
    gender: 'ALL',
  });

  const params = useMemo(() => {
    const commons: any = {
      roadDayfilterftDate: filter?.date?.length ? 1 : 0,
      roadDayfilterGender: filter?.gender === 'ALL' ? 0 : filter?.gender === 'MALE' ? 1 : 2,
      roadDayfilterInOut: filter?.carInOut === 'ALL' ? 0 : filter?.carInOut === 'IN' ? 1 : 2,
    };

    if (filter?.date?.length > 0) {
      if (filter?.date?.length === 1) {
        commons.frDate = filter?.date[0]?.dateString;
        commons.toDate = filter?.date[0]?.dateString;
      }

      if (filter?.date?.length === 2) {
        commons.frDate = filter?.date[0]?.dateString;
        commons.toDate = filter?.date[1]?.dateString;
      }
    }

    return commons;
  }, [filter]);

  const {data, refetch, isLoading, isUninitialized} = useGetAllRouteRequestOfPassengerQuery(
    params,
    {skip: !params},
  );

  const listPassenger = useMemo(
    (): DriverRoadDayModel[] => data?.filter(item => item?.c_memberId !== userID) ?? [],
    [data],
  );

  useFocusEffect(
    useCallback(() => {
      if (!isUninitialized) {
        refetch();
      }
    }, [isUninitialized]),
  );

  const getRouteText = useMemo(() => {
    if (filter?.carInOut === 'IN') {
      return '출근길';
    }
    if (filter?.carInOut === 'OUT') {
      return '퇴근길';
    }
    return '경로';
  }, [filter?.carInOut]);

  const getGenderText = useMemo(() => {
    if (filter?.gender === 'FEMALE') {
      return '여성만';
    }
    if (filter?.gender === 'MALE') {
      return '남성만';
    }
    return '성별';
  }, [filter?.gender]);

  const getTimePeroidText = useMemo(() => {
    if (filter?.date?.length === 1) {
      return dayjs(filter?.date[0]?.timestamp).format('MM월DD일');
    }
    if (filter?.date?.length === 2) {
      return `${dayjs(filter?.date[0]?.timestamp).format('MM월DD일')}~${dayjs(
        filter?.date[1]?.timestamp,
      ).format('MM월DD일')}`;
    }
    return '조회기간';
  }, [filter?.date]);

  return (
    <FixedContainer edges={['top']}>
      <CustomHeader text={text.require_car_pool_list} />

      <ScrollView
        style={{maxHeight: heightScale1(52)}}
        horizontal
        contentContainerStyle={{paddingHorizontal: PADDING1}}
        showsHorizontalScrollIndicator={false}>
        <HStack style={{gap: widthScale1(10)}}>
          {/* Route */}
          <CustomFilterButton
            text={getRouteText}
            iconRight
            onPress={() => {
              carpoolFilterRef?.current?.show(filter);
            }}
            type={filter?.carInOut !== 'ALL' ? 'DARK' : 'LIGHT'}
          />

          {/* Gender */}
          <CustomFilterButton
            text={getGenderText}
            iconRight
            onPress={() => {
              carpoolFilterRef?.current?.show(filter);
            }}
            type={filter?.gender !== 'ALL' ? 'DARK' : 'LIGHT'}
          />

          {/* Time */}
          <CustomFilterButton
            text={getTimePeroidText}
            iconRight
            onPress={() => {
              carpoolFilterRef?.current?.show(filter);
            }}
            type={filter?.date?.length > 0 ? 'DARK' : 'LIGHT'}
          />
        </HStack>
      </ScrollView>

      <CarpoolRequestList data={listPassenger} isLoading={isLoading} onRefetch={refetch} />

      <CarpoolRequestFilter ref={carpoolFilterRef} onSubmit={setFilter} />
    </FixedContainer>
  );
};

export default CarpoolRequest;
