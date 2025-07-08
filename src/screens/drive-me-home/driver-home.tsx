import notifee, {AndroidImportance, TimestampTrigger, TriggerType} from '@notifee/react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {DeviceEventEmitter, RefreshControl, ScrollView, StatusBar, StyleSheet} from 'react-native';
import {Icons} from '~/assets/svgs';
import WeeklyCarpoolAgenda from '~components/calendar/weekly-carpool-agenda';
import FloatingButton from '~components/commons/floating-button';
import ChattingList from '~components/drive-me-home/chatting-list';
import DriverHomeHeader from '~components/drive-me-home/driver-home-header';
import DriverInformationCard from '~components/drive-me-home/driver-information-card';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {IS_ANDROID, PADDING1} from '~constants/constant';
import {EMIT_EVENT} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {CarpoolPayHistoryModel} from '~model/passenger-model';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {
  useGetPayHistoryDriverQuery,
  useLazyUpdateEstPriceQuery,
  useReadDriverRoadInfoListQuery,
} from '~services/driverServices';
import {useUpdateRoadDayStateCheckMutation} from '~services/passengerServices';
import {useLazyUpdateStatusCarpoolHistoryQuery} from '~services/usageHistoryServices';
import {useReadMyDriverQuery} from '~services/userServices';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';
import {dayjs} from '~utils/dayjsUtil';

const DriverHome = memo((props: RootStackScreenProps<'DriverHome'>) => {
  const {navigation} = props;
  const {userID, myDriverInfo} = userHook();
  const isFocused = useIsFocused();
  const [currentScheduleId, setCurrentScheduleId] = useState<string>('');

  const {
    data: myRoadRegisterd,
    refetch,
    isFetching,
    isUninitialized: isAPIReadDriverRoadInfoListUninitialized,
  } = useReadDriverRoadInfoListQuery(
    {
      c_memberId: userID,
    },
    {skip: !userID},
  );

  const formatMyRoadRegisterd = useMemo(
    () => myRoadRegisterd?.filter(item => item?.state !== 'C'),
    [myRoadRegisterd],
  );

  const {
    data: listPaymentHistory,
    refetch: refetchListPaymentHistory,
    isUninitialized,
  } = useGetPayHistoryDriverQuery(
    {
      d_memberId: userID as number,
      filterftDate: 1,
      filterInOut: 0,
      filterState: 0,
      frDate: '',
      toDate: dayjs().format('YYYY-MM-DD'),
    },
    {skip: !userID},
  );

  const [updateStatusCheck] = useLazyUpdateStatusCarpoolHistoryQuery();
  const [updateStateCheck] = useUpdateRoadDayStateCheckMutation();

  const [updateEstPrice] = useLazyUpdateEstPriceQuery();

  const carpoolWaitingToday = useMemo((): CarpoolPayHistoryModel | null => {
    const currentHour = moment().hour();

    if (currentHour < 12) {
      // way to work
      return (
        listPaymentHistory?.filter(item => {
          return (
            moment(`${item?.selectDay?.slice(0, 10)} ${item?.startTime}`, 'YYYY.MM.DD HH:mm')
              .subtract(10, 'minute')
              .isSameOrBefore(moment()) &&
            item?.selectDay?.slice(0, 10) === dayjs().format('YYYY.MM.DD') &&
            item?.rStatusCheck === 'R' &&
            item?.carInOut === 'in'
          );
        })[0] ?? null
      );
    } else {
      // way to home
      return (
        listPaymentHistory?.filter(item => {
          return (
            moment(`${item?.selectDay?.slice(0, 10)} ${item?.startTime}`, 'YYYY.MM.DD HH:mm')
              .subtract(10, 'minute')
              .isSameOrBefore(moment()) &&
            item?.selectDay?.slice(0, 10) === dayjs().format('YYYY.MM.DD') &&
            item?.rStatusCheck === 'R' &&
            item?.carInOut === 'out'
          );
        })[0] ?? null
      );
    }
  }, [listPaymentHistory, isFocused]);

  const carpoolRunning = useMemo((): CarpoolPayHistoryModel | null => {
    const currentHour = moment().hour();
    if (currentHour < 12) {
      return (
        listPaymentHistory?.filter(
          item =>
            item?.selectDay?.slice(0, 10) === dayjs().format('YYYY.MM.DD') &&
            item?.rStatusCheck === 'O' &&
            item?.carInOut === 'in',
        )[0] ?? null
      );
    } else {
      return (
        listPaymentHistory?.filter(
          item =>
            item?.selectDay?.slice(0, 10) === dayjs().format('YYYY.MM.DD') &&
            item?.rStatusCheck === 'O' &&
            item?.carInOut === 'out',
        )[0] ?? null
      );
    }
  }, [listPaymentHistory]);

  const {data: passengerInfo} = useReadMyDriverQuery(
    {
      memberId: carpoolRunning?.r_memberId?.toString(),
    },
    {skip: !carpoolRunning?.r_memberId},
  );

  useEffect(() => {
    const carpool = () => {
      const currentHour = moment().hour();
      if (currentHour < 12) {
        // way to work

        return (
          listPaymentHistory?.filter(item => {
            return (
              moment(`${item?.selectDay?.slice(0, 10)} ${item?.startTime}`, 'YYYY.MM.DD HH:mm')
                .subtract(90, 'minute')
                .isSameOrBefore(moment()) &&
              item?.selectDay?.slice(0, 10) === dayjs().format('YYYY.MM.DD') &&
              item?.rStatusCheck === 'R' &&
              item?.carInOut === 'in'
            );
          })[0] ?? null
        );
      } else {
        // way to home

        return (
          listPaymentHistory?.filter(
            item =>
              moment(`${item?.selectDay?.slice(0, 10)} ${item?.startTime}`, 'YYYY.MM.DD HH:mm')
                .subtract(90, 'minute')
                .isSameOrBefore(moment()) &&
              item?.selectDay?.slice(0, 10) === dayjs().format('YYYY.MM.DD') &&
              item?.rStatusCheck === 'R' &&
              item?.carInOut === 'out',
          )[0] ?? null
        );
      }
    };

    notifee.getTriggerNotifications().then(res => {
      const triggerExisted = res?.find(item =>
        item?.notification?.title?.includes('카풀 예정 시간이에요!'),
      );

      if (
        !triggerExisted &&
        carpool() &&
        moment(carpool()?.startTime, 'HH:mm').subtract(10, 'minute').valueOf() >= moment().valueOf()
      ) {
        const trigger: TimestampTrigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: moment(
            carpool()?.selectDay?.split(' ')?.[0] +
              ' ' +
              `${moment(carpool()?.startTime, 'HH:mm').subtract(10, 'minute').format('HH:mm')}`,
            'YYYY.MM.DD HH:mm',
          )
            .set({
              seconds: 0,
              milliseconds: 0,
            })
            .valueOf(),
        };
        notifee
          .createTriggerNotification(
            {
              title: '카풀 예정 시간이에요! 탑승객이 탑승하셨나요? ',
              body: '카풀 탑승을 완료하셨다면 탑승완료 버튼을 눌러주세요!',
              android: {
                channelId: 'DRIVE_ME_CHANEL',
                sound: 'default',
                importance: AndroidImportance.HIGH,
              },
              ios: {
                sound: 'default',
              },
            },
            trigger,
          )
          .then((returnedNotificationID: string) => {
            console.log('Thuan ~ .then ~ returnedNotificationID:', returnedNotificationID);
            setCurrentScheduleId(returnedNotificationID);
          })
          .catch(error => {
            console.log('Thuan ~ .then ~ error:', error);
          });
      }
    });
  }, [listPaymentHistory, isFocused]);

  useEffect(() => {
    const currentDate = moment().format('YYYYMMDD');
    const currentTime = moment().format('HH:mm').valueOf();
    const currentHour = moment().hours();

    listPaymentHistory?.map(carpool => {
      const selectDay = moment(carpool?.selectDay?.slice(0, 10) as string, 'YYYY.MM.DD').format(
        'YYYYMMDD',
      );

      const startTime = moment(carpool?.startTime, 'HH:mm').format('HH:mm').valueOf();
      const select_day_carpool = Number(selectDay); // select day carpool
      const current_day = Number(currentDate);
      const diff_days = select_day_carpool - current_day;

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
          isPassengerRoute: true,
          roadInfoId: Number(carpool?.roadInfoId),
          state: 'E',
        });
        updateEstPrice({
          id: carpool?.roadInfoId,
          estPrice: estPrice,
        });
      }
    });
  }, [listPaymentHistory]);

  useFocusEffect(
    useCallback(() => {
      if (!isUninitialized) {
        refetchListPaymentHistory();
      }
      if (!isAPIReadDriverRoadInfoListUninitialized) {
        refetch();
      }
    }, [isUninitialized, isAPIReadDriverRoadInfoListUninitialized]),
  );

  useEffect(() => {
    const carpoolCompletedListener = DeviceEventEmitter.addListener(
      EMIT_EVENT.CARPOOL_COMPLETED,
      refetch,
    );

    return () => {
      carpoolCompletedListener.remove();
    };
  }, []);

  return (
    <FixedContainer
      style={{
        backgroundColor: colors.gray8,
      }}
      edges={IS_ANDROID ? ['top', 'bottom'] : ['top']}>
      <StatusBar backgroundColor={colors.gray8} />

      <PaddingHorizontalWrapper forDriveMe>
        <DriverHomeHeader />
      </PaddingHorizontalWrapper>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={colors.primary} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        <DriverInformationCard
          carpoolRunning={carpoolRunning}
          carpoolWaitingToday={carpoolWaitingToday}
          listPaymentHistory={listPaymentHistory ?? []}
        />

        <WeeklyCarpoolAgenda myRoadRegisterd={formatMyRoadRegisterd ?? []} isLoading={isFetching} />

        <ChattingList />
      </ScrollView>

      {carpoolRunning ? (
        <FloatingButton
          text="이용에 문제가 있으신가요?"
          iconPosition="right"
          icon={<Icons.ChevronRight />}
          type="black"
          position={{
            bottom: heightScale1(10),
          }}
          onPress={() => {
            navigation.navigate(ROUTE_KEY.ReportPassStep1, {
              passengerID: carpoolRunning?.r_memberId,
              passengerName: passengerInfo?.nic ?? '',
              routeID: carpoolRunning?.id,
            });
          }}
          iconContainerStyle={{
            alignSelf: 'center',
          }}
        />
      ) : null}
    </FixedContainer>
  );
});

export default DriverHome;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray8,
    paddingHorizontal: PADDING1,
    paddingBottom: heightScale1(44),
  },
});
