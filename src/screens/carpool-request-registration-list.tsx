import {FlashList} from '@shopify/flash-list';
import moment from 'moment';
import React, {useCallback, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import CarpoolRegistrationFilter, {
  CarpoolRegistrationFilterRefs,
} from '~components/carpool-request-registration-list/carpool-registration-filter';
import ItemRequestRegistration from '~components/carpool-request-registration-list/item-request-registration';
import PageButton from '~components/commons/page-button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {DriverRoadDayModel} from '~model/driver-model';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetMyDailyRouteCommuteQuery} from '~services/passengerServices';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

const text = strings.carpool_request_registration_list;

const CarpoolRequestRegistrationList = (
  props: RootStackScreenProps<'CarpoolRequestRegistrationList'>,
) => {
  const {navigation, route} = props;
  const passengerIDValue = route?.params?.passengerID;

  const {userID} = userHook();

  const {data, isFetching, refetch} = useGetMyDailyRouteCommuteQuery(
    {
      c_memberId: (passengerIDValue as number) ?? (userID as number),
    },
    {skip: passengerIDValue ? !passengerIDValue : !userID},
  );

  const carpoolFilterModal = useRef<CarpoolRegistrationFilterRefs>(null);

  const renderItem = useCallback(
    ({item}: {item: DriverRoadDayModel}) => {
      return (
        <View>
          <ItemRequestRegistration
            item={item}
            onDeletedItem={refetch}
            viewMode={passengerIDValue ? true : false}
          />
          <Divider insetsVertical={30} />
        </View>
      );
    },
    [data],
  );

  const renderEmptyList = useCallback(() => {
    return (
      <PaddingHorizontalWrapper forDriveMe>
        <PageButton
          text="내경로를 드라이버에게 카풀 요청해보세요!"
          onPress={() => {
            navigation.navigate(ROUTE_KEY.PassengerDailyRouteRegistration);
          }}
        />
        <CustomText
          forDriveMe
          textStyle={styles.emptyTextStyle}
          string="카풀 요청 내역이 없습니다."
        />
      </PaddingHorizontalWrapper>
    );
  }, []);

  const sortingDateArray = (listDate: DriverRoadDayModel[]) => {
    const temp = [...listDate] ?? [];

    const sorting: DriverRoadDayModel[] = temp.sort((a, b) => {
      const dateA = moment(
        a?.selectDay?.slice(0, a?.selectDay?.length - 3),
        'YYYY.MM.DD',
      ).valueOf();
      const dateB = moment(
        b?.selectDay?.slice(0, a?.selectDay?.length - 3),
        'YYYY.MM.DD',
      ).valueOf();

      return Number(dateA) - Number(dateB);
    });
    return sorting;
  };

  return (
    <FixedContainer>
      <CustomHeader text={text.title} />

      <FlashList
        data={sortingDateArray(data ?? ([] as any))}
        onRefresh={refetch}
        refreshing={isFetching}
        estimatedItemSize={200}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingTop: PADDING1,
        }}
        ListEmptyComponent={renderEmptyList}
      />

      <CarpoolRegistrationFilter ref={carpoolFilterModal} />
    </FixedContainer>
  );
};

export default CarpoolRequestRegistrationList;

const styles = StyleSheet.create({
  header: {
    padding: PADDING1,
    gap: widthScale1(10),
  },
  buttonFilter: {
    marginRight: widthScale1(10),
  },
  emptyTextStyle: {
    fontSize: fontSize1(16),
    fontFamily: FONT_FAMILY.MEDIUM,
    textAlign: 'center',
    marginTop: heightScale1(220),
    color: colors.grayText,
  },
});
