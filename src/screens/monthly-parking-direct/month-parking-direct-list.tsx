import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {DeviceEventEmitter, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import LoadMoreButton from '~components/load-more-button';
import MonthlyParkingDirectItem from '~components/monthly-parking-direct/monthly-parking-direct-item';
import {PADDING} from '~constants/constant';
import {EMIT_EVENT, FONT} from '~constants/enum';
import {strings} from '~constants/strings';
import {MonthlyParkingDirectProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useLazyGetMonthlyParkingDirectListQuery} from '~services/monthlyParkingDirectServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

const MonthlyParkingDirectList = memo((props: RootStackScreenProps<'MonthlyParkingDirectList'>) => {
  const {navigation} = props;

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const [originalList, setOriginalList] = useState<MonthlyParkingDirectProps[]>([]);
  const [listData, setListData] = useState<MonthlyParkingDirectProps[]>([]);
  const [lastID, setLastID] = useState<number>(0);
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>('');

  const [getMonthlyParkingDirectList, {isFetching}] = useLazyGetMonthlyParkingDirectListQuery();

  const searchList = (searchKey: string) => {
    if (searchKey) {
      const searchResult = originalList.filter(item => item?.s_subject?.includes(searchKey));
      if (searchResult?.length < 10) {
        setCanLoadMore(false);
      } else {
        setCanLoadMore(true);
      }
      setListData(searchResult);
    } else {
      if (originalList?.length < 10) {
        setCanLoadMore(false);
      } else {
        setCanLoadMore(true);
      }
      setListData(originalList);
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setTimeout(() => searchList(value), 500);
  };

  const fetchData = () => {
    if (lastID === 0) {
      setListData([]);
      setOriginalList([]);
      setCanLoadMore(false);
    }
    getMonthlyParkingDirectList({
      lastID: lastID,
    })
      .unwrap()
      .then(res => {
        if (res?.length % 10 === 0) {
          setCanLoadMore(true);
        } else {
          setCanLoadMore(false);
        }
        setListData(oldValue => [...oldValue, ...res]);
        setOriginalList(oldValue => [...oldValue, ...res]);
      });
  };

  useEffect(() => {
    fetchData();
  }, [lastID]);

  const renderItem = useCallback(({item}: {item: MonthlyParkingDirectProps}) => {
    return <MonthlyParkingDirectItem item={item} />;
  }, []);

  const renderFooter = useCallback(() => {
    if (canLoadMore) {
      return (
        <LoadMoreButton
          onPress={() => {
            setLastID(listData[listData?.length - 1]?.s_no);
          }}
          isFetching={isFetching}
        />
      );
    }
    return null;
  }, [canLoadMore, listData]);

  useEffect(() => {
    const listeners = DeviceEventEmitter.addListener(EMIT_EVENT.MONTHLY_PARKING_DIRECT, () => {
      setLastID(0);
      fetchData();
    });

    return () => {
      listeners.remove();
    };
  }, []);

  return (
    <FixedContainer>
      <CustomHeader
        text={strings?.month_parking_direct_list?.view_monthly_parking_direct_transaction}
        rightContent={
          <TouchableOpacity
            onPress={() => {
              if (!userToken?.id || !userToken?.password) {
                navigation.navigate(ROUTE_KEY.Login);
              } else {
                navigation.navigate(ROUTE_KEY.MonthlyParkingDirectRegistration);
              }
            }}
            style={styles.createButtonWrapper}>
            <HStack>
              <Icon name="pencil" size={widthScale(15)} color={colors.white} />
              <CustomText
                string={` ${strings?.general_text?.writting}`}
                color={colors.white}
                size={FONT.CAPTION_2}
              />
            </HStack>
          </TouchableOpacity>
        }
      />
      <HStack style={styles.headerWrapper}>
        {/* Search */}
        <View style={styles.manifyWrapper}>
          <HStack
            style={{
              alignItems: 'center',
              flex: 1,
            }}>
            <Icon name="magnify" size={widthScale(30)} color={colors.darkGray} />
            <View style={{flex: 1}}>
              <TextInput
                value={searchValue}
                onChangeText={value => handleSearch(value)}
                style={{flex: 1}}
                placeholder={strings?.general_text?.keyword_search}
                placeholderTextColor={colors.darkGray}
              />
            </View>
          </HStack>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTE_KEY.MonthlyParkingDirectMap)}
          style={styles.locationWrapper}>
          <Icon name="map-marker" size={widthScale(25)} color={colors.darkGray} />
        </TouchableOpacity>
      </HStack>

      <Divider />

      <FlashList
        data={listData}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Divider />}
        ListFooterComponent={renderFooter}
        onRefresh={() => {
          if (lastID === 0) {
            fetchData();
          } else {
            setLastID(0);
          }
        }}
        estimatedItemSize={200}
        refreshing={isFetching}
      />
    </FixedContainer>
  );
});

export default MonthlyParkingDirectList;

const styles = StyleSheet.create({
  createButtonWrapper: {
    backgroundColor: colors.red,
    height: heightScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: PADDING / 2,
    borderRadius: widthScale(5),
  },
  headerWrapper: {
    paddingHorizontal: PADDING,
    marginBottom: PADDING / 2,
  },
  manifyWrapper: {
    backgroundColor: `${colors.gray}50`,
    flex: 1,
    marginRight: PADDING,
    borderRadius: 999,
    minHeight: heightScale(45),
    paddingHorizontal: PADDING / 2,
  },
  locationWrapper: {
    borderRadius: 999,
    borderWidth: widthScale(1),
    borderColor: colors.gray,
    width: heightScale(40),
    height: heightScale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
