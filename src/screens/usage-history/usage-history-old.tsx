import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback, useEffect} from 'react';
import {DeviceEventEmitter, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {ICONS} from '~/assets/images-path';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import UsageHistoryItemOld from '~components/usage-history-item-old';
import {PADDING, PADDING_HEIGHT} from '~constants/constant';
import {EMIT_EVENT} from '~constants/enum';
import {strings} from '~constants/strings';
import {PaymentHistoryProps} from '~constants/types';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetPaymentHistoryListQuery} from '~services/usageHistoryServices';
import {useAppSelector} from '~store/storeHooks';
import {heightScale, widthScale} from '~styles/scaling-utils';

const UsageHistoryOld = memo((props: RootStackScreenProps<'UsageHistory'>) => {
  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const {data, isFetching, refetch} = useGetPaymentHistoryListQuery({
    id: userToken?.id,
    pass: userToken?.password,
  });

  const renderItem = useCallback(({item}: {item: PaymentHistoryProps}) => {
    return <UsageHistoryItemOld item={item} />;
  }, []);

  useEffect(() => {
    const listeners = DeviceEventEmitter.addListener(EMIT_EVENT.VALET_PARKING, () => {
      refetch();
    });

    return () => {
      listeners.remove();
    };
  }, []);

  return (
    <FixedContainer>
      <CustomHeader text={strings.usage_history.used_history} />

      <HStack style={styles.buttonWrapper}>
        <TouchableOpacity style={{marginRight: PADDING}}>
          <HStack>
            <CustomText string={strings.usage_history.all} />
            <Image source={ICONS.arrow_down} style={styles.arrowDown} resizeMode="contain" />
          </HStack>
        </TouchableOpacity>
        <TouchableOpacity>
          <HStack>
            <CustomText string={`12${strings.usage_history.month}`} />
            <Image source={ICONS.arrow_down} style={styles.arrowDown} resizeMode="contain" />
          </HStack>
        </TouchableOpacity>
      </HStack>

      <Divider style={styles.divider} />

      <FlashList
        data={data}
        estimatedItemSize={200}
        renderItem={renderItem}
        contentContainerStyle={styles.flatlist}
        refreshing={isFetching}
        onRefresh={refetch}
      />
    </FixedContainer>
  );
});

export default UsageHistoryOld;

const styles = StyleSheet.create({
  itemWrapper: {
    flexDirection: 'row',
    minHeight: heightScale(50),
  },
  buttonWrapper: {
    alignSelf: 'flex-end',
    marginRight: PADDING,
    marginTop: PADDING_HEIGHT,
  },
  arrowDown: {
    width: widthScale(24),
    height: heightScale(24),
  },
  divider: {
    marginTop: PADDING_HEIGHT,
    marginBottom: PADDING_HEIGHT / 2,
  },
  flatlist: {
    paddingHorizontal: PADDING,
    paddingBottom: PADDING_HEIGHT,
  },
});
