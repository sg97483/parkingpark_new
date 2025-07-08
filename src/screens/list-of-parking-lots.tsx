import {FlashList} from '@shopify/flash-list';
import _ from 'lodash';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import CustomHeader from '~components/custom-header';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import ListOfParkingLotsHeader from '~components/list-of-parking-lots/list-of-parking-lots-header';
import ListOfParkingLotsItem from '~components/list-of-parking-lots/list-of-parking-lots-item';
import Spinner from '~components/spinner';
import {height} from '~constants/constant';
import {LIST_OF_PARKING_FILTER_TYPE, PARKING_FILTER_TYPE} from '~constants/enum';
import {strings} from '~constants/strings';
import {ItemOfListParkingLotsProps} from '~constants/types';
import {RootStackScreenProps} from '~navigators/stack';
import {useLazyTicketInfoQuery} from '~services/parkingServices';
import {getRealm} from '~services/realm';
import {useAppSelector} from '~store/storeHooks';
import {getDistanceFromTwoLatLong} from '~utils/getMyLocation';

const ListOfParkingLots = memo((props: RootStackScreenProps<'ListOfParkingLots'>) => {
  const [parkingLots, setParkingLots] = useState<ItemOfListParkingLotsProps[]>([]);
  const flashListRef = useRef<FlashList<any>>(null);

  const parkingFilter = useAppSelector(state => state?.parkingReducer?.parkingFilter);

  let plusString = '';

  for (let index = 0; index < parkingFilter.length; index++) {
    switch (parkingFilter[index]) {
      case PARKING_FILTER_TYPE.ALLOWBOOKING:
        plusString += "(limitedNumber !=0 AND ticketPartnerYN == 'Y') AND ";
        break;

      case PARKING_FILTER_TYPE.ALLOWBOOKINGPARTNER:
        plusString += "(ticketPartnerYN == 'Y') AND ";
        break;

      case PARKING_FILTER_TYPE.WEEKDAY:
        plusString += "weekdayYN == 'Y' OR ";
        break;
      case PARKING_FILTER_TYPE.WEEKEND:
        plusString += "weekendYN == 'Y' OR ";
        break;
      case PARKING_FILTER_TYPE.NIGHT:
        plusString += "nightYN == 'Y' OR ";
        break;
      case PARKING_FILTER_TYPE.MONTH:
        plusString += "monthYN == 'Y' OR ";
        break;
      case PARKING_FILTER_TYPE.WEEKDAYTIME:
        plusString += "weekdayTimeYN == 'Y' OR ";
        break;
      case PARKING_FILTER_TYPE.WEEKENDTIME:
        plusString += "weekendTimeYN == 'Y' OR ";
        break;
      case PARKING_FILTER_TYPE.DINNER:
        plusString += "dinnerYN == 'Y' OR ";
        break;
      case PARKING_FILTER_TYPE.CONNIGHT:
        plusString += "conNightYN == 'Y' OR ";
        break;

      case PARKING_FILTER_TYPE.CARD:
        plusString += '((id >= 33001 AND id <= 33074) OR (id >= 35492 AND id <= 45000)) OR ';
        break;
      case PARKING_FILTER_TYPE.ELEC:
        plusString += '(id >= 50001 AND id <= 55000) OR ';
        break;
      case PARKING_FILTER_TYPE.FREE:
        plusString += "category == '무료' OR ";
        break;
      case PARKING_FILTER_TYPE.GREENCAR:
        plusString += 'category CONTAINS[c] "그린카" OR ';
        break;
      case PARKING_FILTER_TYPE.IFFREE:
        plusString += 'category CONTAINS[c] "조건부무료" OR ';
        break;
      case PARKING_FILTER_TYPE.PRIVATE:
        plusString += "category == '민영' OR ";
        break;
      case PARKING_FILTER_TYPE.PUBLIC:
        plusString += 'category CONTAINS[c] "공영" OR ';
        break;
      case PARKING_FILTER_TYPE.SHARECAR:
        plusString += 'category CONTAINS[c] "공유주차장" OR ';
        break;
      default:
        break;
    }
  }

  let formatPlusString = '';

  formatPlusString =
    plusString.substring(0, plusString.length - 4)?.length > 0
      ? ` AND ${plusString.substring(0, plusString.length - 4)}`
      : '';

  const [getTicketInfo] = useLazyTicketInfoQuery();

  const userCordinate = useAppSelector(state => state?.coordinateReducer?.userCordinate);

  const [filterValue, setFilterValue] = useState<LIST_OF_PARKING_FILTER_TYPE>(
    LIST_OF_PARKING_FILTER_TYPE.DISTANCE_INCREASE,
  );

  const renderItem = useCallback(({item}: {item: ItemOfListParkingLotsProps}) => {
    return <ListOfParkingLotsItem item={item} />;
  }, []);

  const loadData = async () => {
    const realm = await getRealm();
    const data = realm.objects('Parking').filtered(`ticketPartnerYN = 'Y' ${formatPlusString}`);

    sortByDistanceIncrease(data as any);
  };

  useEffect(() => {
    loadData();
  }, []);

  const sortByDistanceIncrease = async (data: ItemOfListParkingLotsProps[]) => {
    Spinner.show();
    const distanceIncSorted: ItemOfListParkingLotsProps[] = data
      ?.map((item: ItemOfListParkingLotsProps) => {
        return {
          addressNew: item?.addressNew,
          addressOld: item?.addressOld,
          appVersion: item?.appVersion,
          brand: item?.brand,
          category: item?.category,
          charge: item?.charge,
          chargeOneDay: item?.chargeOneDay,
          city: item?.city,
          coslat: item?.coslat,
          coslng: item?.coslng,
          creditCardYN: item?.creditCardYN,
          first30: item?.first30,
          free30YN: item?.free30YN,
          garageName: item?.garageName,
          icon: item?.icon,
          id: item?.id,
          keyword: item?.keyword,
          lat: item?.lat,
          limitedNumber: item?.limitedNumber,
          lng: item?.lng,
          monthYN: item?.monthYN,
          onedayTicketCost: item?.onedayTicketCost,
          parkingIntro: item?.parkingIntro,
          paylank: item?.paylank,
          satFreeYN: item?.satFreeYN,
          sinlat: item?.sinlat,
          sinlng: item?.sinlng,
          state: item?.state,
          sunFreeYN: item?.sunFreeYN,
          themeParking: item?.themeParking,
          ticketPartnerYN: item?.ticketPartnerYN,
          distance: getDistanceFromTwoLatLong(
            userCordinate?.lat as number,
            userCordinate?.long as number,
            item?.lat,
            item?.lng,
          ),
        };
      })
      .sort((a, b) => a?.distance - b?.distance)
      .filter(item => item?.distance < 1000) as ItemOfListParkingLotsProps[];

    let listCall: any = [];
    for (let index = 0; index < distanceIncSorted.length; index++) {
      listCall.push(
        getTicketInfo({
          id: distanceIncSorted[index]?.id,
        }).unwrap(),
      );
    }

    let newData: ItemOfListParkingLotsProps[] = [];

    Promise.all(listCall).then(value => {
      for (let index = 0; index < distanceIncSorted.length; index++) {
        if (value[index][0]?.ticketName && Number(value[index][0]?.ticketAmt)) {
          newData.push({
            ...distanceIncSorted[index],
            ticketName: value[index][0]?.ticketName,
            ticketAmt: Number(value[index][0]?.ticketAmt),
          });
        }
      }

      setParkingLots(newData);

      Spinner.hide();
    });
  };

  useEffect(() => {
    switch (filterValue) {
      case LIST_OF_PARKING_FILTER_TYPE.CHARGE_INCREASE:
        let chargeIncSorted = _.sortBy(parkingLots, 'ticketAmt');
        setParkingLots(chargeIncSorted);
        break;

      case LIST_OF_PARKING_FILTER_TYPE.DISTANCE_INCREASE:
        let chargeDistanceSorted = _.sortBy(parkingLots, 'distance');
        setParkingLots(chargeDistanceSorted);
        break;

      default:
        break;
    }
  }, [filterValue]);

  return (
    <FixedContainer>
      <CustomHeader text={strings?.list_of_parking_lots?.parking_lots_total_number} />
      <ListOfParkingLotsHeader
        onSelect={value => {
          if (value !== filterValue) {
            setFilterValue(value);
          }
          flashListRef?.current?.scrollToIndex({
            index: 0,
            animated: true,
          });
        }}
        selectedFilter={filterValue}
      />

      <Divider />

      <FlashList
        ref={flashListRef}
        data={parkingLots}
        renderItem={renderItem}
        keyExtractor={item => `${item?.id}`}
        ItemSeparatorComponent={() => <Divider />}
        estimatedItemSize={height}
      />
    </FixedContainer>
  );
});

export default ListOfParkingLots;
