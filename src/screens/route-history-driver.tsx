import {FlashList} from '@shopify/flash-list';
import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {DateData} from 'react-native-calendars';
import CarpoolHistoryItem from '~components/carpool-user-profile/carpool-history-item';
import CustomBoxSelectButton from '~components/commons/custom-box-select-button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {DriverRoadDayModel} from '~model/driver-model';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetRouteRegistrationListOfDriverQuery} from '~services/driverServices';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {CARPOOL_TYPE} from './driver-profile/driver-profile';

export interface DateFilterType {
  date1?: DateData;
  date2?: DateData;
}

const RouteHistoryDriver = (props: RootStackScreenProps<'RouteHistoryDriver'>) => {
  const {route} = props;
  const {driverName, driverID} = route?.params;

  const [filterType, setFilterType] = useState<CARPOOL_TYPE>('ALL');

  const {data} = useGetRouteRegistrationListOfDriverQuery(
    {
      memberId: driverID as number,
      carInOut: filterType === 'ALL' ? '0' : filterType === 'WAY_WORK' ? '1' : '2',
    },
    {skip: !driverID},
  );

  const renderHeader = useMemo(() => {
    return (
      <View>
        <PaddingHorizontalWrapper forDriveMe>
          <CustomText
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_9}
            string={`${driverName} 드라이버님은\n총 ${
              data?.length ?? 0
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
  }, [driverName, data?.length, filterType]);

  const renderItem = useCallback(({item}: {item: DriverRoadDayModel}) => {
    return <CarpoolHistoryItem item={{...item, rStatusCheck: 'N'}} />;
  }, []);

  return (
    <FixedContainer edges={['top']}>
      <CustomHeader text={''} />

      {renderHeader}

      <FlashList
        data={data}
        estimatedItemSize={100}
        renderItem={renderItem}
        contentContainerStyle={styles.containerStyle}
      />
    </FixedContainer>
  );
};

export default RouteHistoryDriver;
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
