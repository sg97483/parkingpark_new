import _ from 'lodash';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  InteractionManager,
  Keyboard,
  KeyboardAvoidingView,
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
import HStack from '~components/h-stack';
import EmptyRecent from '~components/way-to-work-registration/empty-recent';
import EmptySearch from '~components/way-to-work-registration/empty-search';
import {IS_IOS, PADDING1} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {AddressKakaoProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheSearchRecent} from '~reducers/searchRecentLocationsReducer';
import {searchAddressKakao} from '~services/kakaoService';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {getNameAddressKakao} from '~utils/common';
import {generateRandomId} from '~utils/encrypt';

const DriverWayToWork2 = (props: RootStackScreenProps<'DriverWayToWork2'>) => {
  const {navigation, route} = props;

  const isReturnRoute = route?.params?.isReturnRoute;
  const dataOldRoute = route?.params?.dataOldRoute;
  const selectedDate = route?.params?.selectedDate;
  const isDailyRegistration = route?.params?.isDailyRegistration;
  const isEditMyRoute = route?.params?.isEditMyRoute;
  const dataFill = route?.params?.dataFill;
  const searchRecent = useAppSelector(state => state.searchRecentLocationReducer.searchRecent);
  const dispatch = useAppDispatch();

  const inputEnd = useRef<TextInput>(null);
  const inputStart = useRef<TextInput>(null);
  const inputStop = useRef<TextInput>(null);

  const [addressFrom, setAddressFrom] = useState<AddressKakaoProps>();
  const [addressStop, setAddressStop] = useState<AddressKakaoProps>();
  const [addressTo, setAddressTo] = useState<AddressKakaoProps>();
  const [addStop, setAddStop] = useState<boolean>(false);
  const [textSearchTo, setTextSearchTo] = useState('');
  const [textSearchStop, setTextSearchStop] = useState<string>('');
  const [textSearchFrom, setTextSearchFrom] = useState<string>('');
  const [dataSearch, setDataSearch] = useState<AddressKakaoProps[]>([]);

  const [refreshing, setRefreshing] = useState(false);
  const [isSearchFrom, setIsSearchFrom] = useState<boolean>(true);
  const [isSearchStop, setIsSearchStop] = useState<boolean>(false);
  const [hideButtonItem, setHideButtonItem] = useState(false);

  const showRecent = useMemo(
    () => (isSearchFrom ? !textSearchFrom : isSearchStop ? !textSearchStop : !textSearchTo),
    [textSearchTo, textSearchFrom, addressFrom, isSearchFrom, textSearchStop, isSearchStop],
  );

  useEffect(() => {
    if (dataFill) {
      setAddressFrom(dataFill?.from);
      if (dataFill?.stop?.x && dataFill?.stop?.y) {
        setAddressStop(dataFill?.stop);
        setAddStop(true);
      }
      setAddressTo(dataFill?.to);

      dataFill?.from && onChangeTextSearchFrom(getNameAddressKakao(dataFill?.from));
    }
  }, [dataFill]);

  const isParkInList = useMemo(() => false, [dataSearch]);

  const valueFrom = useMemo(
    () => textSearchFrom || getNameAddressKakao(addressFrom!),
    [addressFrom, textSearchFrom],
  );

  const valueTo = useMemo(
    () => textSearchTo || getNameAddressKakao(addressTo!),
    [addressTo, textSearchTo],
  );

  const valueStop = useMemo(
    () => textSearchStop || getNameAddressKakao(addressStop!),
    [addressStop, textSearchStop],
  );

  // handle add stop
  const handleAddStopPlace = () => {
    InteractionManager.runAfterInteractions(() => {
      inputStop.current?.focus();
    });
    setAddStop(true);
  };

  // handle done
  const onDoneAddress = (
    start: AddressKakaoProps | undefined,
    stop: AddressKakaoProps | undefined,
    end: AddressKakaoProps | undefined,
  ) => {
    navigation.navigate(ROUTE_KEY.DriverWayToWork4, {
      searchFrom: start,
      searchStop: stop,
      searchTo: end,
      isRoadOut: isReturnRoute,
      dataOldRoute: dataOldRoute,
      selectedDate: selectedDate,
      isDailyRegistration: isDailyRegistration,
      isEditMyRoute: isEditMyRoute,
      hasAddressStop: addStop,
    });
  };

  const onPressItem = (item: AddressKakaoProps) => {
    try {
      dispatch(cacheSearchRecent([item]));
      navigation.navigate(ROUTE_KEY.WayToWorkRegistration4, {
        dataDriver: {
          address: {
            from: addressFrom,
            stop: addressStop,
            to: addressTo,
            isChooseFrom: isSearchFrom,
            isChooseStop: isSearchStop,
          },
        },
        data: item,
        func: (data: AddressKakaoProps) => {
          if (isSearchFrom) {
            setAddressFrom(data);
            setTextSearchFrom('');

            if (addressStop && addressTo) {
              onDoneAddress(data, addressStop, addressTo);
            } else {
              if (addStop) {
                if (addressStop) {
                  InteractionManager.runAfterInteractions(() => {
                    inputEnd.current?.focus();
                  });
                } else {
                  InteractionManager.runAfterInteractions(() => {
                    inputStop.current?.focus();
                  });
                }
              } else {
                if (addressTo) {
                  onDoneAddress(data, undefined, addressTo);
                } else {
                  InteractionManager.runAfterInteractions(() => {
                    inputEnd.current?.focus();
                  });
                }
              }
            }
          } else if (isSearchStop) {
            setAddressStop(data);
            setTextSearchStop('');

            if (addressFrom && addressTo) {
              onDoneAddress(addressFrom, data, addressTo);
            } else {
              if (addressFrom) {
                InteractionManager.runAfterInteractions(() => {
                  inputEnd.current?.focus();
                });
              } else {
                InteractionManager.runAfterInteractions(() => {
                  inputStart.current?.focus();
                });
              }
            }
          } else {
            setAddressTo(data);
            setTextSearchTo('');
            if (addressFrom && addressStop) {
              onDoneAddress(addressFrom, addressStop, data);
            } else {
              if (addStop) {
                if (addressFrom) {
                  InteractionManager.runAfterInteractions(() => {
                    inputStop.current?.focus();
                  });
                } else {
                  InteractionManager.runAfterInteractions(() => {
                    inputStart.current?.focus();
                  });
                }
              } else {
                if (addressFrom) {
                  onDoneAddress(addressFrom, undefined, data);
                } else {
                  InteractionManager.runAfterInteractions(() => {
                    inputStart.current?.focus();
                  });
                }
              }
            }
          }
        },
        isGoTo: isSearchFrom,
        isToStop: isSearchStop,
      });
    } catch (error) {}
  };

  const searchDebounce = _.debounce((text: string) => {
    searchAddressKakao(text)
      .then(res => {
        setDataSearch(res);
      })
      .finally(() => setRefreshing(false));
  }, 1000);

  const onChangeTextSearchFrom = (text: string) => {
    !hideButtonItem && setHideButtonItem(true);
    setTextSearchFrom(text);
    if (text) {
      !refreshing && setRefreshing(true);
      searchDebounce(text);
    } else {
      setAddressFrom(undefined);
    }
  };

  const onChangeTextSearchStop = (text: string) => {
    !hideButtonItem && setHideButtonItem(true);
    setTextSearchStop(text);
    if (text) {
      !refreshing && setRefreshing(true);
      searchDebounce(text);
    } else {
      setAddressStop(undefined);
    }
  };

  const onChangeTextSearchTo = (text: string) => {
    !hideButtonItem && setHideButtonItem(true);
    setTextSearchTo(text);
    if (text) {
      !refreshing && setRefreshing(true);
      searchDebounce(text);
    } else {
      setAddressTo(undefined);
    }
  };

  const renderItem = ({item, index}: {item: AddressKakaoProps; index: number}) => {
    return (
      <>
        <ItemAddressSearch
          item={item}
          hideArrive={!showRecent && hideButtonItem}
          colorName={showRecent ? colors.menuTextColor : colors.black}
          textSearch={isSearchFrom ? textSearchFrom : isSearchStop ? textSearchStop : textSearchTo}
          onPress={() => onPressItem(item)}
          isDepart={!!isSearchFrom}
          isStop={isSearchStop}
          isPark={item.isParking}
        />
      </>
    );
  };

  const onScrollSearch = useCallback(() => Keyboard.dismiss(), []);

  const renderSearchList = useCallback(
    () =>
      refreshing ? (
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
                : isSearchStop
                  ? getNameAddressKakao(item) !== getNameAddressKakao(addressFrom!)
                  : getNameAddressKakao(item) !== getNameAddressKakao(addressFrom!),
            )}
            ListEmptyComponent={<EmptySearch noneShow={refreshing} />}
          />
        </>
      ),
    [refreshing, dataSearch, isSearchFrom, isSearchStop, showRecent, isParkInList, hideButtonItem],
  );

  useEffect(() => {
    const focus = DeviceEventEmitter.addListener(EMIT_EVENT.FOCUS_INPUT_DRIVER_WAY_2, () => {
      InteractionManager.runAfterInteractions(() => {
        if (isSearchStop) {
          inputStop.current?.focus();
          valueStop && onChangeTextSearchStop(valueStop);
          return;
        }

        if (isSearchFrom) {
          inputStart.current?.focus();
          valueFrom && onChangeTextSearchFrom(valueFrom);
        } else {
          inputEnd.current?.focus();
          valueTo && onChangeTextSearchTo(valueTo);
        }
      });
    });

    return () => focus.remove();
  }, [
    isSearchFrom,
    isSearchStop,
    valueFrom,
    valueStop,
    valueTo,
    onChangeTextSearchStop,
    onChangeTextSearchFrom,
    onChangeTextSearchTo,
  ]);

  return (
    <FixedContainer>
      <CustomHeader text={isReturnRoute ? '퇴근길 등록' : '출근길 등록'} />

      <KeyboardAvoidingView style={{flex: 1}} behavior={IS_IOS ? 'padding' : undefined}>
        <View style={styles.viewTop}>
          <View style={styles.viewLine}>
            <View style={styles.viewWhite} />
            {Array.from({length: 6}).map(() => (
              <View key={generateRandomId()} style={styles.viewDot} />
            ))}
            {addStop && (
              <>
                <View style={styles.viewGray} />
                {Array.from({length: 6}).map(() => (
                  <View key={generateRandomId()} style={styles.viewDot} />
                ))}
              </>
            )}
            <View style={styles.viewBlack} />
          </View>
          <View style={{marginLeft: widthScale1(16), gap: heightScale1(10)}}>
            <CustomPositionSearch
              ref={inputStart}
              // autoFocus
              onChangeText={value => onChangeTextSearchFrom(value)}
              onSubmitEditing={() => setHideButtonItem(false)}
              autoFocus={!dataOldRoute}
              value={valueFrom}
              type={'DELETE_TEXT'}
              placeholder="출발지를 등록해주세요."
              borderColorType={'DISABLED'}
              onDeleteText={() => {
                inputStart.current?.focus();
                setAddressFrom(undefined);
              }}
              onFocus={() => {
                setIsSearchFrom(true);
                setIsSearchStop(false);
                valueFrom && onChangeTextSearchFrom(valueFrom);
              }}
            />

            {/* TEXT SEARCH STOP */}
            {addStop && (
              <CustomPositionSearch
                ref={inputStop}
                value={valueStop}
                type={'DELETE_AND_MINUS_CIRCLE'}
                onSubmitEditing={() => setHideButtonItem(false)}
                borderColorType={'DISABLED'}
                onChangeText={value => {
                  onChangeTextSearchStop(value);
                }}
                placeholder="경유지를 등록해주세요."
                onPressMinus={() => {
                  setAddStop(false);
                  setIsSearchStop(false);
                  onChangeTextSearchStop('');
                  setAddressStop(undefined);
                }}
                onFocus={() => {
                  setIsSearchStop(true);
                  setIsSearchFrom(false);
                  valueStop && onChangeTextSearchStop(valueStop);
                }}
                onDeleteText={() => {
                  inputStop.current?.focus();
                  setAddressStop(undefined);
                }}
              />
            )}

            <CustomPositionSearch
              value={valueTo}
              type={addStop ? 'DELETE_TEXT' : 'DELETE_TEXT_AND_ADD_BUTTON'}
              onSubmitEditing={() => setHideButtonItem(false)}
              onChangeText={value => {
                onChangeTextSearchTo(value);
              }}
              placeholder="도착지를 등록해주세요."
              borderColorType={'DISABLED'}
              onPressAdd={handleAddStopPlace}
              onDeleteText={() => {
                inputEnd.current?.focus();
                setAddressTo(undefined);
              }}
              ref={inputEnd}
              onFocus={() => {
                setIsSearchFrom(false);
                setIsSearchStop(false);
                valueTo && onChangeTextSearchTo(valueTo);
              }}
            />
          </View>
        </View>

        {isParkInList ? (
          <View style={styles.textTop}>
            <CustomText
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION_6}
              forDriveMe
              color={colors.lineCancel}
              string="제휴 주차장을 목적지로 설정하고 매칭률을 높여보세요!"
            />
          </View>
        ) : null}

        {showRecent ? (
          <>
            <Divider style={{marginTop: PADDING1}} />

            <HStack
              style={{
                justifyContent: 'space-between',
                marginHorizontal: PADDING1,
                paddingVertical: heightScale1(10),
              }}>
              <CustomText
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
            </HStack>

            <FlatList
              onScroll={onScrollSearch}
              keyboardShouldPersistTaps={'handled'}
              keyExtractor={item => item?.id}
              renderItem={renderItem}
              data={searchRecent.filter(item =>
                isSearchFrom
                  ? getNameAddressKakao(item) !== getNameAddressKakao(addressTo!)
                  : isSearchStop
                    ? getNameAddressKakao(item) !== getNameAddressKakao(addressFrom) &&
                      getNameAddressKakao(item) !== getNameAddressKakao(addressTo)
                    : getNameAddressKakao(item) !== getNameAddressKakao(addressFrom!) &&
                      getNameAddressKakao(item) !== getNameAddressKakao(addressStop),
              )}
              ListEmptyComponent={<EmptyRecent />}
            />
          </>
        ) : (
          <>{renderSearchList()}</>
        )}
      </KeyboardAvoidingView>
    </FixedContainer>
  );
};

export default DriverWayToWork2;

const styles = StyleSheet.create({
  viewTop: {
    flexDirection: 'row',
    paddingHorizontal: PADDING1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: widthScale1(10),
    gap: widthScale1(2),
    minHeight: heightScale1(30),
    borderRadius: widthScale1(6),
    borderColor: colors.disableButton,
    borderWidth: 1,
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
  colorSearch: {
    color: colors.primary,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: colors.policy,
  },
  textTop: {
    paddingVertical: heightScale1(16),
    backgroundColor: colors.policy,
    paddingHorizontal: PADDING1,
    marginTop: PADDING1,
  },
  iconPark: {
    marginRight: widthScale1(5),
  },
  viewItemSearch: {
    padding: PADDING1,
    margin: PADDING1,
    gap: heightScale1(4),
  },
  viewGray: {
    width: widthScale1(9),
    height: widthScale1(9),
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.lineInput,
    backgroundColor: colors.lineInput,
  },
  divider: {
    marginTop: PADDING1,
  },
});
