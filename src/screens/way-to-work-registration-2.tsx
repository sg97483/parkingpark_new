import _ from 'lodash';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  InteractionManager,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import CustomPositionSearch from '~components/commons/custom-position-search';
import ItemAddressSearch from '~components/commons/item-address-search';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import EmptyRecent from '~components/way-to-work-registration/empty-recent';
import EmptySearch from '~components/way-to-work-registration/empty-search';
import {PADDING1} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {AddressKakaoProps, TemporaryRouteProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheSearchRecent} from '~reducers/searchRecentLocationsReducer';
import {cacheTemporaryRoute} from '~reducers/userReducer';
import {useGetMyRiderRoadQuery} from '~services/carpoolServices';
import {searchAddressKakao} from '~services/kakaoService';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {getNameAddressKakao} from '~utils/common';

const WayToWorkRegistration2 = (props: RootStackScreenProps<'WayToWorkRegistration2'>) => {
  const {navigation, route} = props;
  const routes = navigation.getState()?.routes;

  const {
    isReturnRoute,
    textSearchFromValue,
    textSearchToValue,
    dataOldRoute,
    hidePrice,
    dataFill,
    isEditMyWork,
    focusTo,
  } = route?.params;

  const dispatch = useAppDispatch();

  const searchRecent = useAppSelector(state => state.searchRecentLocationReducer.searchRecent);

  const [addressFrom, setAddressFrom] = useState<AddressKakaoProps | undefined>();
  const [addressTo, setAddressTo] = useState<AddressKakaoProps>();
  const [isSearchFrom, setIsSearchFrom] = useState(true);

  const inputFromRef = useRef<TextInput>(null);
  const inputToRef = useRef<TextInput>(null);

  const [textSearchFrom, setTextSearchFrom] = useState('');
  const [textSearchTo, setTextSearchTo] = useState('');
  const [dataSearch, setDataSearch] = useState<AddressKakaoProps[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [hideButtonItem, setHideButtonItem] = useState(false);

  const memberID = useAppSelector(state => state?.userReducer?.userToken?.id);
  const driverID = useAppSelector(state => state?.userReducer?.myDriverInfo?.id);

  const {data} = useGetMyRiderRoadQuery(
    {
      memberId: memberID as number,
      id: driverID as number,
    },
    {skip: !driverID || !memberID},
  );

  useEffect(() => {
    const subInputFocus = DeviceEventEmitter.addListener(EMIT_EVENT.FOCUS_INPUT_WAY_2, () => {
      InteractionManager.runAfterInteractions(() => {
        if (!isSearchFrom) {
          inputToRef.current?.focus();
        } else {
          inputFromRef.current?.focus();
        }
      });
    });

    return () => subInputFocus.remove();
  }, [isSearchFrom]);

  useEffect(() => {
    if (dataFill) {
      setAddressFrom(dataFill.from);
      setAddressTo(dataFill.to);

      dataFill.from && onChangeTextFrom(getNameAddressKakao(dataFill.from));
    }
  }, []);

  useEffect(() => {
    if (data) {
      if (textSearchFromValue && textSearchToValue) {
        const from = {
          address_name: textSearchFromValue,
          x: isReturnRoute ? data.splngOut : data.splngIn,
          y: isReturnRoute ? data.splatOut : data.splatIn,
        };
        const to = {
          address_name: textSearchToValue,
          x: isReturnRoute ? data.eplngOut : data.eplngIn,
          y: isReturnRoute ? data.eplatOut : data.eplatIn,
        };
        setAddressFrom(from as any);
        setAddressTo(to as any);
        onChangeTextFrom(textSearchFromValue);
      }
    }
  }, [data]);

  const onScrollSearch = useCallback(() => Keyboard.dismiss(), []);

  const showRecent = useMemo(
    () => (isSearchFrom ? !textSearchFrom : !textSearchTo),
    [textSearchTo, textSearchFrom, addressFrom, isSearchFrom],
  );

  const isParkInList = useMemo(
    () => !showRecent && dataSearch.some(item => !!item.isParking),
    [dataSearch, showRecent],
  );

  const onPressItem = (item: AddressKakaoProps) => {
    try {
      dispatch(cacheSearchRecent([item]));
      navigation.navigate(ROUTE_KEY.WayToWorkRegistration4, {
        address: {from: addressFrom, to: addressTo, isChooseFrom: isSearchFrom},
        data: item,
        func: (data: AddressKakaoProps) => {
          if (isSearchFrom) {
            setAddressFrom(data);
            setTextSearchFrom('');
            if (addressTo) {
              onDoneAddress(data, addressTo);
            } else {
              InteractionManager.runAfterInteractions(() => {
                inputToRef.current?.focus();
              });
            }
          } else {
            setAddressTo(data);
            setTextSearchTo('');
            if (addressFrom) {
              onDoneAddress(addressFrom, data);
            } else {
              InteractionManager.runAfterInteractions(() => {
                inputFromRef.current?.focus();
              });
            }
          }
        },
        isGoTo: isSearchFrom,
      });
    } catch (error) {}
  };

  const onDoneAddress = (from: AddressKakaoProps, to: AddressKakaoProps) => {
    if (textSearchFromValue || textSearchToValue) {
      let route = {} as TemporaryRouteProps;

      if (!isReturnRoute) {
        route.startPlaceIn = getNameAddressKakao(from);
        route.endPlaceIn = getNameAddressKakao(to);
        route.startCoordIn = {latitude: from.y, longitude: from.x};
        route.endCoordIn = {latitude: to.y, longitude: to.x};
      } else {
        route.startPlaceOut = getNameAddressKakao(from);
        route.endPlaceOut = getNameAddressKakao(to);
        route.startCoordOut = {latitude: from.y, longitude: from.x};
        route.endCoordOut = {latitude: to.y, longitude: to.x};
      }

      dispatch(cacheTemporaryRoute(route));
      navigation.goBack();
    } else {
      if (routes[routes.length - 2].name === ROUTE_KEY.WayToWorkRegistration5) {
        navigation.goBack();
        navigation.goBack();
      }

      navigation.navigate(ROUTE_KEY.WayToWorkRegistration5, {
        searchFrom: from,
        searchTo: to,
        isRoadOut: isReturnRoute,
        dataOldRoute: dataOldRoute,
        hidePrice: hidePrice,
        isEdit: !!dataFill,
        dataInfo: dataFill,
        isEditMyWork: isEditMyWork,
      });
    }
  };

  const searchDebounce = _.debounce((text: string) => {
    searchAddressKakao(text)
      .then(res => {
        setDataSearch(res);
      })
      .finally(() => setRefreshing(false));
  }, 1000);

  const onChangeTextTo = (text: string) => {
    !hideButtonItem && setHideButtonItem(true);
    setTextSearchTo(text);
    if (text) {
      setRefreshing(true);
      searchDebounce(text);
    } else {
      setAddressTo(undefined);
    }
  };

  const onChangeTextFrom = (text: string) => {
    !hideButtonItem && setHideButtonItem(true);
    setTextSearchFrom(text);
    if (text) {
      setRefreshing(true);
      searchDebounce(text);
    } else {
      setAddressFrom(undefined);
    }
  };

  const renderItem = ({item}: {item: AddressKakaoProps}) => {
    return (
      <ItemAddressSearch
        hideArrive={!showRecent && hideButtonItem}
        item={item}
        colorName={showRecent ? colors.menuTextColor : colors.black}
        textSearch={isSearchFrom ? textSearchFrom : textSearchTo}
        onPress={() => onPressItem(item)}
        isDepart={isSearchFrom}
        isPark={item.isParking}
      />
    );
  };

  const valueFrom = useMemo(
    () => textSearchFrom || getNameAddressKakao(addressFrom!),
    [addressFrom, textSearchFrom],
  );
  const valueTo = useMemo(
    () => textSearchTo || getNameAddressKakao(addressTo!),
    [addressTo, textSearchTo],
  );

  return (
    <FixedContainer>
      <CustomHeader text={isReturnRoute ? '퇴근길 등록' : '출근길 등록'} />
      <View style={styles.viewTop}>
        <View style={styles.viewLine}>
          <View style={styles.viewWhite} />
          {Array.from({length: 6}).map((i, index) => (
            <View key={index} style={styles.viewDot} />
          ))}
          <View style={styles.viewBlack} />
        </View>
        <View style={{gap: heightScale1(10)}}>
          <CustomPositionSearch
            ref={inputFromRef}
            onSubmitEditing={() => setHideButtonItem(false)}
            autoFocus={!focusTo}
            onChangeText={value => onChangeTextFrom(value)}
            value={valueFrom}
            type={'DELETE_TEXT'}
            placeholder="출발지를 등록해주세요."
            borderColorType={'DISABLED'}
            onFocus={() => {
              setIsSearchFrom(true);
              valueFrom && onChangeTextFrom(valueFrom);
            }}
            onDeleteText={() => {
              setAddressFrom(undefined);
              setTextSearchFrom('');
              InteractionManager.runAfterInteractions(() => {
                inputFromRef.current?.focus();
              });
            }}
          />
          <CustomPositionSearch
            ref={inputToRef}
            onSubmitEditing={() => setHideButtonItem(false)}
            value={valueTo}
            type={'DELETE_TEXT'}
            autoFocus={focusTo}
            onChangeText={value => onChangeTextTo(value)}
            placeholder="도착지를 등록해주세요."
            borderColorType={'DISABLED'}
            onFocus={() => {
              setIsSearchFrom(false);
              valueTo && onChangeTextTo(valueTo);
            }}
            onDeleteText={() => {
              setAddressTo(undefined);
              setTextSearchTo('');
              InteractionManager.runAfterInteractions(() => {
                inputToRef.current?.focus();
              });
            }}
          />
        </View>
      </View>

      {isParkInList && (
        <View style={styles.textTop}>
          <CustomText
            family={FONT_FAMILY.MEDIUM}
            size={FONT.CAPTION_6}
            forDriveMe
            color={colors.lineCancel}
            string="제휴 주차장을 등록하고 매칭률을 높여보세요!"
          />
        </View>
      )}

      {showRecent ? (
        <>
          <Divider style={{marginTop: PADDING1}} />
          <View style={styles.viewRecent}>
            <CustomText
              color={colors.grayText}
              size={FONT.CAPTION_6}
              family={FONT_FAMILY.MEDIUM}
              forDriveMe
              string="최근검색장소"
            />
            {!!searchRecent.length && (
              <Pressable
                onPress={() => {
                  navigation.navigate(ROUTE_KEY.RecentSearchLocation);
                }}>
                <CustomText
                  size={FONT.CAPTION_6}
                  family={FONT_FAMILY.MEDIUM}
                  forDriveMe
                  string="편집"
                  color={colors.grayText}
                />
              </Pressable>
            )}
          </View>
          <FlatList
            onScroll={onScrollSearch}
            keyboardShouldPersistTaps={'handled'}
            keyExtractor={item => item?.id}
            renderItem={renderItem}
            data={searchRecent.filter(item =>
              isSearchFrom
                ? getNameAddressKakao(item) !== getNameAddressKakao(addressTo!)
                : getNameAddressKakao(item) !== getNameAddressKakao(addressFrom!),
            )}
            ListEmptyComponent={<EmptyRecent />}
          />
        </>
      ) : (
        <>
          {refreshing ? (
            <ActivityIndicator style={styles.divider} />
          ) : (
            <>
              {!isParkInList && !showRecent ? <Divider style={styles.divider} /> : <></>}
              <FlatList
                onScroll={onScrollSearch}
                keyboardShouldPersistTaps={'handled'}
                keyExtractor={item => item?.id}
                renderItem={renderItem}
                data={dataSearch.filter(item =>
                  isSearchFrom
                    ? getNameAddressKakao(item) !== getNameAddressKakao(addressTo!)
                    : getNameAddressKakao(item) !== getNameAddressKakao(addressFrom!),
                )}
                ListEmptyComponent={<EmptySearch noneShow={refreshing} />}
              />
            </>
          )}
        </>
      )}
    </FixedContainer>
  );
};

export default WayToWorkRegistration2;
const styles = StyleSheet.create({
  viewTop: {
    flexDirection: 'row',
    paddingHorizontal: PADDING1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: PADDING1,
  },
  viewWhite: {
    width: widthScale1(9),
    height: widthScale1(9),
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.black,
  },
  viewBlack: {
    width: widthScale1(9),
    height: widthScale1(9),
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.black,
    backgroundColor: colors.black,
  },
  viewDot: {
    width: 1,
    height: heightScale1(5),
    backgroundColor: colors.black,
    marginVertical: heightScale1(2),
  },
  viewLine: {
    alignItems: 'center',
  },
  textTop: {
    paddingVertical: heightScale1(16),
    backgroundColor: colors.policy,
    paddingHorizontal: PADDING1,
    marginTop: PADDING1,
  },
  viewRecent: {
    marginHorizontal: PADDING1,
    marginTop: heightScale1(16),
    marginBottom: heightScale1(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    marginTop: PADDING1,
  },
});
