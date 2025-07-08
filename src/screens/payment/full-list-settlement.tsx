import {useFocusEffect} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import moment from 'moment';
import React, {memo, useCallback, useMemo, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import SettlementItem from '~components/account-settlement/settlement-item';
import CustomBoxSelectButton from '~components/commons/custom-box-select-button';
import DateFilter from '~components/commons/date-filter';
import DayPickerModal, {DayPickerModalRefs} from '~components/commons/day-picker-modal';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {FONT_FAMILY} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {SettlementModel} from '~model/settlement-model';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheSettlementFilter} from '~reducers/carpoolReducer';
import {useGetSettlementHistoryQuery} from '~services/carpoolServices';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {getNumberWithCommas} from '~utils/numberUtils';

interface Parmas {
  calYNfilter: string;
  memberId: number;
  frDate?: string;
  toDate?: string;
}

const FullListSettlement = memo((props: RootStackScreenProps<'FullListSettlement'>) => {
  const {navigation} = props;

  const currentSettlementFilter = useAppSelector(state => state?.carpoolReducer?.settlementFilter);
  const dispatch = useAppDispatch();
  const startDayPickerRef = useRef<DayPickerModalRefs>(null);
  const endDayPickerRef = useRef<DayPickerModalRefs>(null);
  const {userID, myDriverInfo} = userHook();

  useFocusEffect(
    useCallback(() => {
      dispatch(
        cacheSettlementFilter({
          calYNfilter: 'ALL',
          frDate: undefined,
          toDate: undefined,
        }),
      );
    }, []),
  );

  const parmas = useMemo(() => {
    const commons: Parmas = {
      calYNfilter: currentSettlementFilter?.calYNfilter,
      memberId: userID as number,
    };
    if (currentSettlementFilter?.frDate && currentSettlementFilter?.toDate) {
      commons.frDate = currentSettlementFilter?.frDate?.dateString?.split('-').join('.');
      commons.toDate = currentSettlementFilter?.toDate?.dateString?.split('-').join('.');
    }
    return commons;
  }, [currentSettlementFilter, userID]);

  const {data, isFetching, refetch} = useGetSettlementHistoryQuery(parmas as any, {skip: !parmas});
  const dataList = useMemo(() => {
    return data?.filter(it => it?.payStatus === 'Y');
  }, [data]);

  const totalIncome = useMemo(() => {
    return dataList?.reduce(
      (prevValue, nextValue) => prevValue + Number(nextValue?.incomePrice ?? 0),
      0 ?? 0,
    );
  }, [dataList]);

  const renderHeader = useMemo(() => {
    return (
      <PaddingHorizontalWrapper
        containerStyles={{marginTop: heightScale1(10), gap: heightScale1(16)}}
        forDriveMe>
        <View style={{gap: heightScale1(6)}}>
          <DateFilter
            onStartDatePress={() => {
              startDayPickerRef?.current?.show(currentSettlementFilter?.frDate);
            }}
            onEndDatePress={() => {
              if (!currentSettlementFilter?.frDate) {
                showMessage({
                  message: '시작 시간과 마지막 시간을 먼저 선택해주세요.',
                });
                return;
              }
              endDayPickerRef?.current?.show(currentSettlementFilter?.toDate);
            }}
            startDateValue={
              currentSettlementFilter?.frDate
                ? moment(currentSettlementFilter?.frDate?.timestamp).format('YY년MM월DD일')
                : ''
            }
            endDateValue={
              currentSettlementFilter?.toDate
                ? moment(currentSettlementFilter?.toDate?.timestamp).format('YY년MM월DD일')
                : ''
            }
            type="ONE_YEAR"
          />

          <HStack
            style={{
              alignSelf: 'flex-end',
              gap: widthScale1(4),
            }}>
            <CustomText string="총 카풀 수입" forDriveMe color={colors.grayText} />
            <CustomText
              string={`${getNumberWithCommas(totalIncome)}원`}
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              color={colors.black}
            />
          </HStack>
        </View>
        <HStack style={{gap: widthScale1(10)}}>
          <CustomBoxSelectButton
            text="전체"
            selected={currentSettlementFilter?.calYNfilter === 'ALL'}
            onSelected={() => {
              dispatch(
                cacheSettlementFilter({
                  ...currentSettlementFilter,
                  calYNfilter: 'ALL',
                }),
              );
            }}
          />
          <CustomBoxSelectButton
            text="충전금충전"
            selected={currentSettlementFilter?.calYNfilter === 'IN_APP'}
            onSelected={() => {
              dispatch(
                cacheSettlementFilter({
                  ...currentSettlementFilter,
                  calYNfilter: 'IN_APP',
                }),
              );
            }}
          />
          <CustomBoxSelectButton
            text="계좌입금"
            selected={currentSettlementFilter?.calYNfilter === 'CREDIT_CARD'}
            onSelected={() => {
              dispatch(
                cacheSettlementFilter({
                  ...currentSettlementFilter,
                  calYNfilter: 'CREDIT_CARD',
                }),
              );
            }}
          />
        </HStack>
      </PaddingHorizontalWrapper>
    );
  }, [currentSettlementFilter, totalIncome]);

  const renderItem = useCallback(({item}: {item: SettlementModel}) => {
    return (
      <View>
        <SettlementItem item={item} />
        <Divider />
      </View>
    );
  }, []);

  const renderEmpty = useCallback(() => {
    return (
      <CustomText string="정산 내역이 없습니다." forDriveMe textStyle={styles.emptyTextStyle} />
    );
  }, []);

  return (
    <FixedContainer>
      <CustomHeader text="전체 정산 내역" />

      <View>
        {renderHeader}
        <Divider style={{marginTop: heightScale1(14)}} />
      </View>

      <FlashList
        data={dataList}
        renderItem={renderItem}
        estimatedItemSize={100}
        refreshing={isFetching}
        onRefresh={refetch}
        ListEmptyComponent={renderEmpty}
      />

      {/* Start day */}
      <DayPickerModal
        ref={startDayPickerRef}
        onSubmitPress={value => {
          if (value) {
            if (
              currentSettlementFilter.toDate &&
              moment(value.timestamp).isAfter(moment(currentSettlementFilter?.toDate?.timestamp))
            ) {
              showMessage({
                message: '시작 시간은 마지막 시간 이전이어야 됩니다. 다시 확인해주세요.',
              });

              return;
            }
            dispatch(
              cacheSettlementFilter({
                ...currentSettlementFilter,
                frDate: value,
              }),
            );
          } else {
            dispatch(
              cacheSettlementFilter({
                ...currentSettlementFilter,
                frDate: undefined,
              }),
            );
          }
        }}
      />

      {/* End day */}
      <DayPickerModal
        ref={endDayPickerRef}
        onSubmitPress={value => {
          if (value) {
            if (
              currentSettlementFilter.frDate &&
              moment(value?.timestamp).isBefore(moment(currentSettlementFilter?.frDate?.timestamp))
            ) {
              showMessage({
                message: '마지막 시간은 시작 시간 이후여야 됩니다. 다시 확인해주세요.',
              });

              return;
            }

            dispatch(
              cacheSettlementFilter({
                ...currentSettlementFilter,
                toDate: value,
              }),
            );
          } else {
            dispatch(
              cacheSettlementFilter({
                ...currentSettlementFilter,
                toDate: undefined,
              }),
            );
          }
        }}
      />
    </FixedContainer>
  );
});

export default FullListSettlement;

const styles = StyleSheet.create({
  emptyTextStyle: {
    marginTop: heightScale1(141),
    textAlign: 'center',
    color: colors.grayText,
    fontSize: fontSize1(16),
    fontFamily: FONT_FAMILY.MEDIUM,
  },
});
