import {FlashList} from '@shopify/flash-list';
import moment from 'moment';
import React, {memo, useCallback, useEffect, useMemo, useRef} from 'react';
import {DeviceEventEmitter, StyleSheet, View} from 'react-native';
import CustomButton from '~components/commons/custom-button';
import CustomFilterButton from '~components/commons/custom-filter-button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import LoadingComponent from '~components/loading-component';
import RechargeFilter, {FilterModalRefs} from '~components/my-profile/recharge-filter';
import ChargeItem from '~components/recharge-point-coupon/charge-item';
import {PADDING1} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ChargeProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetChargeListQuery} from '~services/couponServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {getNumberWithCommas} from '~utils/numberUtils';

interface Params {
  memberId: number | undefined;
  usePointSklentYN?: string;
  frDate?: string;
  toDate?: string;
}

const ChargeManagement = memo((props: RootStackScreenProps<'ChargeManagement'>) => {
  const {navigation} = props;

  const userInfo = useAppSelector(state => state?.userReducer?.user);
  const userToken = useAppSelector(state => state?.userReducer?.userToken);
  const currentFilter = useAppSelector(state => state?.carpoolReducer?.chargeFilter);

  const mCharge = Number(userInfo?.chargeMoney) || 0;

  let mChargeSum = 0;
  if (userInfo?.usePointSumSklent) {
    mChargeSum = Number(userInfo?.usePointSumSklent);
  }

  let cancelCharge = 0;
  if (userInfo?.cancelPointSklent) {
    cancelCharge = Number(userInfo?.cancelPointSklent);
  }

  const userCharge = mCharge - mChargeSum + cancelCharge || 0;

  const filterModalRef = useRef<FilterModalRefs>(null);

  const situationFilterValue = useMemo(() => {
    switch (currentFilter?.situation) {
      case 'DIRECT_CHARGING':
        return '0';
      case 'SETTLEMENT_RECHARGE':
        return '2';
      case 'USED':
        return '1';
      default:
        return '';
    }
  }, [currentFilter?.situation]);

  const peroidFilterValue = useMemo(() => {
    switch (currentFilter?.viewingPeriod) {
      case '12M':
        return {
          frDate: moment().subtract(1, 'years').format('YYYY-MM-DD 00:00'),
          toDate: moment().format('YYYY-MM-DD HH:mm'),
        };
      case '6M':
        return {
          frDate: moment().subtract(0.5, 'years').format('YYYY-MM-DD 00:00'),
          toDate: moment().format('YYYY-MM-DD HH:mm'),
        };
      case '3M':
        return {
          frDate: moment().subtract(3, 'months').format('YYYY-MM-DD 00:00'),
          toDate: moment().format('YYYY-MM-DD HH:mm'),
        };
      case '1M':
        return {
          frDate: moment().subtract(1, 'months').format('YYYY-MM-DD 00:00'),
          toDate: moment().format('YYYY-MM-DD HH:mm'),
        };
      default:
        return {};
    }
  }, [currentFilter?.viewingPeriod]);

  const params = useMemo((): any => {
    const commonParams: Params = {memberId: userToken?.id};

    if (situationFilterValue !== '') {
      commonParams.usePointSklentYN = situationFilterValue;
    }

    if (peroidFilterValue?.frDate && peroidFilterValue?.toDate) {
      commonParams.frDate = peroidFilterValue.frDate;
      commonParams.toDate = peroidFilterValue.toDate;
    }

    return commonParams;
  }, [userToken?.id, situationFilterValue, peroidFilterValue]);

  const {data, refetch, isFetching} = useGetChargeListQuery(params);

  useEffect(() => {
    const listeners = DeviceEventEmitter.addListener(EMIT_EVENT.UPDATED_USER, () => {
      refetch();
    });

    return () => {
      listeners.remove();
    };
  }, []);

  const showFilterModal = useCallback(() => {
    filterModalRef.current?.show();
  }, []);

  const renderItem = useCallback(({item}: {item: ChargeProps}) => {
    return (
      <View>
        <ChargeItem item={item} />
        <Divider />
      </View>
    );
  }, []);

  const getSituationText = useMemo(() => {
    switch (currentFilter?.situation) {
      case 'DIRECT_CHARGING':
        return '직접충전';
      case 'SETTLEMENT_RECHARGE':
        return '정산충전';
      case 'USED':
        return '사용';
      default:
        return '상태';
    }
  }, [currentFilter?.situation]);

  const getPeriodText = useMemo(() => {
    switch (currentFilter?.viewingPeriod) {
      case '12M':
        return '12개월';
      case '6M':
        return '6개월';
      case '3M':
        return '3개월';
      case '1M':
        return '1개월';
      default:
        return '조회기간';
    }
  }, [currentFilter?.viewingPeriod]);

  return (
    <FixedContainer>
      <CustomHeader text="충전금" />

      <View>
        <HStack style={styles.headerBoxWrapper}>
          <View style={{flex: 1, gap: heightScale1(4)}}>
            <CustomText
              string="사용 가능한 충전금"
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText03}
              forDriveMe
              size={FONT.CAPTION_7}
              lineHeight={heightScale1(22)}
            />

            <HStack style={{gap: widthScale1(6), alignItems: 'baseline'}}>
              <CustomText
                string={`${getNumberWithCommas(userCharge)}`}
                family={FONT_FAMILY.SEMI_BOLD}
                color={colors.menuTextColor}
                size={FONT.CAPTION_11}
                forDriveMe
                lineHeight={heightScale1(36)}
              />
              <CustomText
                family={FONT_FAMILY.MEDIUM}
                string={strings.general_text.won}
                forDriveMe
                size={FONT.SUB_HEAD}
              />
            </HStack>
          </View>

          <CustomButton
            onPress={() => navigation.navigate(ROUTE_KEY.DepositMoney)}
            text="충전하기"
            type="SECONDARY"
            buttonHeight={38}
            textSize={FONT.CAPTION_6}
            buttonStyle={styles.buttonWrapper}
            borderRadiusValue={6}
          />
        </HStack>

        <HStack style={styles.filterWrapper}>
          {/* status */}
          <CustomFilterButton
            onPress={showFilterModal}
            type={currentFilter?.situation === '' ? 'LIGHT' : 'DARK'}
            iconRight
            iconType="DROPDOWN"
            text={getSituationText}
          />

          {/* inquiry period */}
          <CustomFilterButton
            onPress={showFilterModal}
            type={currentFilter?.viewingPeriod === '' ? 'LIGHT' : 'DARK'}
            iconRight
            iconType="DROPDOWN"
            text={getPeriodText}
          />
        </HStack>

        <Divider style={styles.divider} />
      </View>

      {isFetching ? (
        <LoadingComponent />
      ) : (
        <FlashList data={data} estimatedItemSize={104} renderItem={renderItem} />
      )}

      <RechargeFilter
        ref={filterModalRef}
        onCancel={() => {
          // TODO:
        }}
        onComplete={() => {
          // TODO:
        }}
      />
    </FixedContainer>
  );
});

export default ChargeManagement;

const styles = StyleSheet.create({
  headerBoxWrapper: {
    margin: PADDING1,
    backgroundColor: colors.policy,
    borderRadius: widthScale1(5),
    padding: PADDING1,
  },
  buttonWrapper: {
    paddingHorizontal: scale1(10),
  },
  arrowDown: {
    width: widthScale1(24),
    height: widthScale1(24),
    tintColor: colors.lineCancel,
  },
  divider: {
    marginTop: PADDING1,
  },
  filterWrapper: {
    paddingHorizontal: PADDING1,
    gap: widthScale1(10),
  },
  filterButton: {
    borderWidth: 1,
    borderColor: colors.disableButton,
    borderRadius: 999,
    paddingHorizontal: scale1(14),
    paddingVertical: scale1(6),
    marginRight: scale1(10),
  },
  title: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: fontSize1(14),
    color: colors.lineCancel,
  },
});
