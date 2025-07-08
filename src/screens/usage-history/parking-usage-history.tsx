import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback, useEffect} from 'react';
import {DeviceEventEmitter, StyleSheet, View} from 'react-native';
import EmptyList from '~components/commons/empty-list';
import PageButton from '~components/commons/page-button';
import LoadingComponent from '~components/loading-component';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import UsageHistoryItem from '~components/usage-history-item';
import {PADDING1} from '~constants/constant';
import {EMIT_EVENT} from '~constants/enum';
import {PaymentHistoryProps} from '~constants/types';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useGetPaymentHistoryListQuery} from '~services/usageHistoryServices';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

const ParkingUsageHistory: React.FC = memo(() => {
  const {userToken} = userHook();
  const navigation = useNavigation<UseRootStackNavigation>();

  const {data, isFetching, refetch} = useGetPaymentHistoryListQuery({
    id: userToken?.id,
    pass: userToken?.password,
  });

  const renderItem = useCallback(({item}: {item: PaymentHistoryProps}) => {
    return <UsageHistoryItem item={item} />;
  }, []);

  useEffect(() => {
    const listeners = DeviceEventEmitter.addListener(EMIT_EVENT.VALET_PARKING, () => {
      refetch();
    });
    return () => {
      listeners.remove();
    };
  }, []);

  if (isFetching) {
    return <LoadingComponent />;
  }

  return (
    <View style={styles.containerStyle}>
      <FlashList
        data={data}
        estimatedItemSize={180}
        renderItem={renderItem}
        refreshing={isFetching}
        onRefresh={refetch}
        ListHeaderComponent={() => {
          return (
            <PaddingHorizontalWrapper
              containerStyles={{
                marginBottom: heightScale1(30),
                paddingTop: heightScale1(14),
              }}
              forDriveMe>
              <PageButton
                onPress={() => navigation.navigate(ROUTE_KEY.ReservationSimple)}
                text="이용한 주차장 간편하게 예약하기"
              />
            </PaddingHorizontalWrapper>
          );
        }}
        ListEmptyComponent={() => <EmptyList text="이용내역이 없습니다." top={heightScale1(182)} />}
      />
    </View>
  );
});

export default ParkingUsageHistory;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  filterWrapperStyle: {
    paddingHorizontal: PADDING1,
    paddingVertical: heightScale1(14),
    gap: widthScale1(10),
  },
  filterStyle: {
    borderWidth: 1,
    borderRadius: 999,
    minHeight: heightScale1(32),
    paddingHorizontal: widthScale1(14),
    borderColor: colors.disableButton,
  },
});
