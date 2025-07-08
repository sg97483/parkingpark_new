import React, {memo, useCallback, useMemo, useRef} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import CustomFilterButton from '~components/commons/custom-filter-button';
import {PADDING1} from '~constants/constant';
import {useAppSelector} from '~store/storeHooks';
import {widthScale1} from '~styles/scaling-utils';
import MainFilterModal, {MainFilterModalRefs} from './main-filter-modal';

const MainFilter: React.FC = memo(() => {
  const filterModelRef = useRef<MainFilterModalRefs>(null);
  const passengerFilter = useAppSelector(state => state?.carpoolReducer?.passengerModeFilter);

  const handleShowFilterModal = useCallback(() => {
    filterModelRef?.current?.show();
  }, []);

  const getGenderText = useMemo(() => {
    switch (passengerFilter?.gender) {
      case 'FEMALE':
        return '여성만';
      case 'MALE':
        return '남성만';
      default:
        return '성별';
    }
  }, [passengerFilter?.gender]);

  const distanceRangeFromDeparturePoint = useMemo(() => {
    switch (passengerFilter?.distanceRangeFromDeparturePoint) {
      case '3KM':
        return '출발지 3km 이내';
      case '5KM':
        return '출발지 5km 이내';
      default:
        return '출발지거리범위';
    }
  }, [passengerFilter?.distanceRangeFromDeparturePoint]);

  const destinationDistanceRange = useMemo(() => {
    switch (passengerFilter?.destinationDistanceRange) {
      case '3KM':
        return '도착지 3km 이내';
      case '5KM':
        return '도착지 5km 이내';
      default:
        return '도착지거리범위';
    }
  }, [passengerFilter?.destinationDistanceRange]);

  return (
    <ScrollView
      style={{width: '100%'}}
      contentContainerStyle={styles.containerStyle}
      horizontal
      showsHorizontalScrollIndicator={false}>
      <CustomFilterButton
        onPress={handleShowFilterModal}
        text={passengerFilter?.routeRegistrationComplete ? '운행등록완료만' : '운행등록여부'}
        type={passengerFilter?.routeRegistrationComplete ? 'DARK' : 'LIGHT'}
        iconRight
      />
      <CustomFilterButton
        onPress={handleShowFilterModal}
        text={getGenderText}
        type={passengerFilter?.gender === '' ? 'LIGHT' : 'DARK'}
        iconRight
      />

      <CustomFilterButton
        onPress={handleShowFilterModal}
        text={distanceRangeFromDeparturePoint}
        type={passengerFilter?.distanceRangeFromDeparturePoint === '' ? 'LIGHT' : 'DARK'}
        iconRight
      />

      <CustomFilterButton
        onPress={handleShowFilterModal}
        text={destinationDistanceRange}
        type={passengerFilter?.destinationDistanceRange === '' ? 'LIGHT' : 'DARK'}
        iconRight
      />

      <MainFilterModal ref={filterModelRef} />
    </ScrollView>
  );
});

export default MainFilter;

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: PADDING1,
    gap: widthScale1(10),
  },
});
