import {FlashList} from '@shopify/flash-list';
import moment from 'moment';
import React, {memo, useCallback, useMemo, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomFilterButton from '~components/commons/custom-filter-button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import LoadingComponent from '~components/loading-component';
import PointFilter from '~components/my-profile/point-filter';
import {FilterModalRefs} from '~components/my-profile/recharge-filter';
import PointItem from '~components/recharge-point-coupon/point-item';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {PointProps} from '~constants/types';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetPointListQuery} from '~services/couponServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {getNumberWithCommas} from '~utils/numberUtils';

interface Params {
  memberId: number | undefined;
  noteUse?: string;
  frDate?: string;
  toDate?: string;
}

const PointManagement = memo((props: RootStackScreenProps<'PointManagement'>) => {
  const userInfo = useAppSelector(state => state?.userReducer?.user);
  const userToken = useAppSelector(state => state?.userReducer?.userToken);
  const filterModalRef = useRef<FilterModalRefs>(null);
  const currentPointFilter = useAppSelector(state => state?.carpoolReducer?.pointFilter);

  const situationFilterValue = useMemo(() => {
    switch (currentPointFilter?.situation) {
      case 'ACCUMULATE':
        return '1';
      case 'USED':
        return '2';
      default:
        return '0';
    }
  }, [currentPointFilter?.situation]);

  const peroidFilterValue = useMemo(() => {
    switch (currentPointFilter?.viewingPeriod) {
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
  }, [currentPointFilter?.viewingPeriod]);

  const getSituationText = useMemo(() => {
    switch (currentPointFilter?.situation) {
      case 'ACCUMULATE':
        return '적립';
      case 'USED':
        return '사용';
      default:
        return '상태';
    }
  }, [currentPointFilter?.situation]);

  const getPeriodText = useMemo(() => {
    switch (currentPointFilter?.viewingPeriod) {
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
  }, [currentPointFilter?.viewingPeriod]);

  const params = useMemo((): any => {
    const commonParams: Params = {
      memberId: userToken?.id,
      noteUse: situationFilterValue,
    };

    if (peroidFilterValue?.frDate && peroidFilterValue?.toDate) {
      commonParams.frDate = peroidFilterValue.frDate;
      commonParams.toDate = peroidFilterValue.toDate;
    }

    return commonParams;
  }, [situationFilterValue, userToken, peroidFilterValue]);

  const {data, isFetching} = useGetPointListQuery(params, {skip: !userToken?.id});

  const mPoint = Number(userInfo?.mpoint) || 0;
  let usePoint = 0;
  if (userInfo?.usePointSum) {
    usePoint = Number(userInfo?.usePointSum);
  }

  let cancelPoint = 0;
  if (userInfo?.cancelPoint) {
    cancelPoint = Number(userInfo?.cancelPoint);
  }

  const userPoint = mPoint - usePoint + cancelPoint;

  const showFilterModal = useCallback(() => {
    filterModalRef.current?.show();
  }, []);

  const renderItem = useCallback(({item}: {item: PointProps}) => {
    return (
      <View>
        <PointItem item={item} />
        <Divider />
      </View>
    );
  }, []);

  return (
    <FixedContainer>
      <CustomHeader text="적립금" />

      <View>
        <View style={styles.headerBoxWrapper}>
          <CustomText
            string="사용 가능한 적립금"
            family={FONT_FAMILY.MEDIUM}
            color={colors.grayText03}
            forDriveMe
            size={FONT.CAPTION_7}
            lineHeight={heightScale1(22)}
          />
          <HStack style={{gap: widthScale1(6), alignItems: 'baseline'}}>
            <CustomText
              string={`${getNumberWithCommas(userPoint)}`}
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

        <HStack style={styles.filterWrapper}>
          {/* charging method */}
          <CustomFilterButton
            onPress={showFilterModal}
            type={currentPointFilter?.situation === '' ? 'LIGHT' : 'DARK'}
            iconRight
            iconType="DROPDOWN"
            text={getSituationText}
          />

          {/* status */}
          <CustomFilterButton
            onPress={showFilterModal}
            type={currentPointFilter?.viewingPeriod === '' ? 'LIGHT' : 'DARK'}
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

      <PointFilter ref={filterModalRef} />
    </FixedContainer>
  );
});

export default PointManagement;

const styles = StyleSheet.create({
  itemWrapper: {
    paddingHorizontal: PADDING1,
    justifyContent: 'space-between',
    minHeight: heightScale1(55),
  },
  titleWrapper: {
    minHeight: heightScale1(45),
    backgroundColor: `${colors.gray}70`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    marginTop: heightScale1(10),
  },
  placeholderView: {
    flex: 1,
    position: 'absolute',
    backgroundColor: colors.white,
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'center',
  },
  headerBoxWrapper: {
    margin: PADDING1,
    backgroundColor: colors.policy,
    borderRadius: widthScale1(5),
    padding: PADDING1,
  },
  filterWrapper: {
    paddingHorizontal: PADDING1,
    gap: widthScale1(10),
  },
});
