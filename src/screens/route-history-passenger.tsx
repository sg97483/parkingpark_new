import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomBoxSelectButton from '~components/commons/custom-box-select-button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {DriverRoadDayModel} from '~model/driver-model';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetMyDailyRouteCommuteQuery} from '~services/passengerServices';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {CARPOOL_TYPE} from './driver-profile/driver-profile';
import ItemRequestRegistration from '~components/carpool-request-registration-list/item-request-registration';
import Divider from '~components/divider';

const RouteHistoryPassenger = memo((props: RootStackScreenProps<'RouteHistoryPassenger'>) => {
  const {route} = props;
  const {passengerID, passengerName} = route?.params;

  const {data, isFetching, refetch} = useGetMyDailyRouteCommuteQuery(
    {
      c_memberId: passengerID as number,
    },
    {skip: !passengerID},
  );

  const [filterType, setFilterType] = useState<CARPOOL_TYPE>('ALL');

  const listCarpoolHistory = useMemo((): DriverRoadDayModel[] => {
    if (data) {
      switch (filterType) {
        case 'ALL':
          return data;
        case 'WAY_WORK':
          return data?.filter(item => item?.carInOut === 'in');
        case 'WAY_HOME':
          return data?.filter(item => item?.carInOut === 'out');
        default:
          return [];
      }
    } else {
      return [];
    }
  }, [data, filterType]);

  const renderHeader = useMemo(() => {
    return (
      <View>
        <PaddingHorizontalWrapper forDriveMe>
          <CustomText
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_9}
            string={`${passengerName} 탑승객님은\n총 ${
              listCarpoolHistory?.length ?? 0
            }회의 카풀 등록 내역이 있어요!`}
            forDriveMe
            lineHeight={heightScale1(31)}
          />
        </PaddingHorizontalWrapper>

        <HStack style={styles.header}>
          <CustomBoxSelectButton
            text="전체"
            selected={filterType === 'ALL'}
            onSelected={() => {
              setFilterType('ALL');
            }}
          />
          <CustomBoxSelectButton
            text="출근길"
            selected={filterType === 'WAY_WORK'}
            onSelected={() => {
              setFilterType('WAY_WORK');
            }}
          />
          <CustomBoxSelectButton
            text="퇴근길"
            selected={filterType === 'WAY_HOME'}
            onSelected={() => {
              setFilterType('WAY_HOME');
            }}
          />
        </HStack>

        <Divider />
      </View>
    );
  }, [passengerName, listCarpoolHistory?.length, filterType]);

  const renderItem = useCallback(({item}: {item: DriverRoadDayModel}) => {
    return (
      <>
        <ItemRequestRegistration item={item} viewMode />
        <Divider insetsVertical={30} />
      </>
    );
  }, []);

  const renderEmptyList = useCallback(() => {
    return (
      <CustomText
        string="카풀 요청 내역이 없습니다."
        forDriveMe
        size={FONT.CAPTION_7}
        family={FONT_FAMILY.MEDIUM}
        color={colors.grayText}
        textStyle={{
          textAlign: 'center',
          paddingTop: heightScale1(100),
        }}
      />
    );
  }, []);

  return (
    <FixedContainer>
      <CustomHeader text="" />
      {renderHeader}

      <FlashList
        data={listCarpoolHistory}
        estimatedItemSize={100}
        renderItem={renderItem}
        contentContainerStyle={styles.containerStyle}
        ListEmptyComponent={renderEmptyList}
        refreshing={isFetching}
        onRefresh={refetch}
      />
    </FixedContainer>
  );
});

export default RouteHistoryPassenger;

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: PADDING1,
  },
  header: {
    paddingHorizontal: PADDING1,
    paddingVertical: PADDING1,
    gap: widthScale1(10),
  },
});
