import {DeviceEventEmitter, View} from 'react-native';
import React, {memo, useCallback, useEffect} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {useAppSelector} from '~store/storeHooks';
import {useGetPaymentHistoryListQuery} from '~services/usageHistoryServices';
import {FlashList} from '@shopify/flash-list';
import {PaymentHistoryProps} from '~constants/types';
import ReservationSimpleItem from '~components/new-home/reservation-simple-item';
import {ROUTE_KEY} from '~navigators/router';
import CustomText from '~components/custom-text';
import {PADDING} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';

const ReservationSimple = memo((props: RootStackScreenProps<'ReservationSimple'>) => {
  const {navigation} = props;

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const {data, refetch} = useGetPaymentHistoryListQuery({
    id: userToken?.id,
    pass: userToken?.password,
  });

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(EMIT_EVENT.REFETCH_QUICK_RESERVATION, () =>
      refetch(),
    );
    return () => sub.remove();
  }, []);

  const results = data
    ?.filter(
      (payHistory, index, self) =>
        self.findIndex(p => p.parkingLotId === payHistory.parkingLotId) === index,
    )
    ?.filter(item => item?.TotalTicketType !== null)
    ?.filter(
      item =>
        !(
          item?.TotalTicketType?.includes('대기') ||
          item?.TotalTicketType?.includes('추가') ||
          item?.TotalTicketType?.includes('충전') ||
          item?.TotalTicketType?.includes('월주차 자동결제') ||
          item?.TotalTicketType?.includes('월주차권 자동결제') ||
          item?.TotalTicketType?.includes('월주차권 자동신청') ||
          item?.TotalTicketType?.includes('월주차 자동신청')
        ),
    );

  const renderItem = useCallback(({item, index}: {item: PaymentHistoryProps; index: number}) => {
    return (
      <ReservationSimpleItem
        item={item}
        key={index}
        onItemPress={() => {
          navigation.navigate(ROUTE_KEY.ReservationSimplePay, {
            parkId: item?.parkingLotId,
            parkTicketName: item?.TotalTicketType,
            requirements: item?.requirements,
          });
        }}
      />
    );
  }, []);

  const renderHeader = useCallback(() => {
    return (
      <View
        style={{
          marginBottom: PADDING,
        }}>
        <CustomText
          family={FONT_FAMILY.BOLD}
          string={'내가 이용한 주차장을 클릭 한번으로\n간편하게 예약할수있어요!'}
          size={FONT.TITLE_3}
        />
      </View>
    );
  }, []);

  return (
    <FixedContainer>
      <CustomHeader text="간편예약" />
      <FlashList
        data={results || []}
        renderItem={renderItem}
        estimatedItemSize={200}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{
          paddingHorizontal: PADDING,
        }}
      />
    </FixedContainer>
  );
});

export default ReservationSimple;
