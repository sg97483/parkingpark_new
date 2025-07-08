import {useFocusEffect} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import SettlementAmountButton from '~components/account-settlement/settlement-amount-button';
import SettlementItem from '~components/account-settlement/settlement-item';
import SettlementMethod from '~components/account-settlement/settlement-method';
import EmptyList from '~components/commons/empty-list';
import CustomHeader from '~components/custom-header';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {userHook} from '~hooks/userHook';
import {SettlementModel} from '~model/settlement-model';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetDriverHistoryAccountListQuery} from '~services/carpoolServices';
import {useReadMyDriverQuery} from '~services/userServices';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

const AccountSettlement = memo((props: RootStackScreenProps<'AccountSettlement'>) => {
  const {navigation} = props;
  const {userID} = userHook();

  const {
    data: driverInfo,
    isUninitialized,
    refetch,
    isFetching,
  } = useReadMyDriverQuery(
    {
      memberId: userID as any,
    },
    {skip: !userID},
  );

  const {
    data,
    isFetching: isLoadingData,
    refetch: refetchData,
  } = useGetDriverHistoryAccountListQuery(
    {d_memberId: userID as any},
    {skip: !driverInfo?.calYN || isUninitialized || isFetching},
  );

  const inComeAmount = useMemo((): number => {
    return (
      data
        ?.filter(item => item?.payStatus === 'N')
        ?.reduce((prev, nItem) => prev + Number(nItem?.estPrice ?? 0), 0) ?? 0
    );
  }, [data]);

  const totalInComeAmount = useMemo((): number => {
    return (
      data
        ?.filter(item => item?.payStatus === 'Y')
        ?.reduce((prev, nItem) => prev + Number(nItem?.incomePrice ?? 0), 0) ?? 0
    );
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      if (!isUninitialized) {
        refetch();
      }
    }, [isUninitialized]),
  );

  const renderItem = useCallback(
    ({item}: {item: SettlementModel}) => {
      return (
        <View>
          <SettlementItem item={item} />
          <Divider />
        </View>
      );
    },
    [driverInfo],
  );

  return (
    <FixedContainer>
      <CustomHeader text="정산내역" />

      <View>
        <PaddingHorizontalWrapper containerStyles={{gap: heightScale1(16)}} forDriveMe>
          <HStack style={styles.headerWrapperStyle}>
            <SettlementAmountButton
              title="정산 예정 수익금"
              amount={inComeAmount}
              onPress={() => {
                navigation.navigate(ROUTE_KEY.ScheduledSettlementDetails);
              }}
            />
            <SettlementAmountButton
              title="전체 카풀 수익금"
              amount={totalInComeAmount}
              onPress={() => {
                navigation.navigate(ROUTE_KEY.FullListSettlement);
              }}
            />
          </HStack>
          <SettlementMethod driverInfo={driverInfo} isLoading={isFetching} />
        </PaddingHorizontalWrapper>
        <Divider style={{marginTop: heightScale1(16)}} />
      </View>

      <FlashList
        refreshing={isLoadingData}
        onRefresh={refetchData}
        data={data}
        estimatedItemSize={100}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <EmptyList text="정산 내역이 없습니다." top={heightScale1(141)} />
        )}
      />
    </FixedContainer>
  );
});

export default AccountSettlement;

const styles = StyleSheet.create({
  headerWrapperStyle: {
    gap: widthScale1(10),
  },
});
