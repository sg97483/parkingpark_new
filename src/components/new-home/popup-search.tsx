import React, {forwardRef, memo, Ref, useCallback, useState} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '~components/custom-text';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {ParkingInfo, ParkingMapProps} from '~constants/types';
import {getRealm} from '~services/realm';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {getDistanceFromTwoLatLong} from '~utils/getMyLocation';
import {sleep} from '~utils/index';
import ReactNativeModal from 'react-native-modal';
import {height, width} from '~constants/constant';
export interface PopupSearchRef {
  show: (text: string) => void;
  hide: () => void;
}
interface TypeList {
  item: ParkingInfo;
  index: number;
}

const PopupSearch = forwardRef(({}, ref: Ref<PopupSearchRef>) => {
  const userCordinate = useAppSelector(store => store?.coordinateReducer?.userCordinate);

  const [showModal, setShowModal] = useState(false);
  const [isFocusAffiliated, setisFocusAffiliated] = useState(true);
  const [isLoad, setIsLoad] = useState(false);
  const [text, setText] = useState('');

  const [dataMain, setDataMain] = useState<ParkingMapProps[]>();
  const [vmData, setVMData] = useState<ParkingMapProps[]>();

  const searchData = async (keyword: string) => {
    try {
      setIsLoad(true);
      const realm = await getRealm();
      const allData = realm.objects('Parking');

      // 검색어 키워드로부터 앞뒤 공백을 제거합니다.
      const trimmedKeyword = keyword.trim();

      // trimmedKeyword 값을 로그로 출력합니다.
      console.log('검색 키워드:', trimmedKeyword);

      const filterCondition =
        'ticketPartnerYN = "Y" AND (garageName CONTAINS[c] $0 OR keyword CONTAINS[c] $0)';

      if (trimmedKeyword === '서울역') {
        const mapLists = allData.filtered(filterCondition, trimmedKeyword).sorted([['id', false]]);
        await sleep(200);
        setDataMain(mapLists as any);
      } else {
        const mapLists = allData.filtered(filterCondition, trimmedKeyword).sorted([
          ['ticketPartnerYN', true],
          ['paylank', true],
        ]);
        await sleep(200);
        setDataMain(mapLists as any);
      }

      const filteredData = allData.filtered('keyword CONTAINS[c] $0', trimmedKeyword).sorted([
        ['ticketPartnerYN', true], // DESC order
        ['paylank', true], // ASC order
      ]);
      await sleep(200);
      setVMData(filteredData as any);
      setIsLoad(false);
    } catch (error) {
      showMessage({message: '다시 시도해주세요.'});
      setIsLoad(false);
    }
  };

  React.useImperativeHandle(
    ref,
    () => ({
      show,
      hide,
    }),
    [],
  );

  const onPressChangeFocus = useCallback(async () => {
    setIsLoad(true);
    setisFocusAffiliated(!isFocusAffiliated);
    await sleep(300);
    setIsLoad(false);
  }, [isFocusAffiliated]);

  const show = (text: string) => {
    setShowModal(true);
    setText(text);
    searchData(text);
  };
  const hide = useCallback(() => {
    setShowModal(false);
    setText('');
    searchData('');
  }, []);

  const renderItem = (data: TypeList) => {
    const {index, item} = data;
    const isTicketPartnerYN = item.ticketPartnerYN == 'Y';
    const getDistanceKm = (
      getDistanceFromTwoLatLong(item.lat, item.lng, userCordinate?.lat!, userCordinate?.long!) /
      1000
    ).toFixed(1);

    const txtSearchDialogAddress = isTicketPartnerYN
      ? `${getDistanceKm}km - ${item.addressOld}`
      : `${item.addressOld}`;

    const category = item.category.includes('조건부무료') ? '조건부무료' : item.category;

    let txtSearchDialogGarageName = '';
    if (!item.brand.trim() || !item.brand) {
      txtSearchDialogGarageName = item.garageName;
    } else {
      let brand = item.brand.includes('신한 rpm')
        ? '신한RPM카드'
        : item.brand.includes('현대카드')
        ? '현대카드M3'
        : item.brand;

      txtSearchDialogGarageName = item.garageName + ' - ' + brand + '(' + category + ')';
    }

    return (
      <TouchableOpacity onPress={() => onPressItemShop(item)} style={styles.viewItem}>
        <View style={{flex: 1}}>
          <CustomText string={txtSearchDialogGarageName} size={FONT.CAPTION} />
          <View style={styles.viewTextAddress}>
            <Text
              numberOfLines={1}
              style={{
                width: widthScale(270),
              }}>
              {txtSearchDialogAddress}
              <Text
                style={{
                  color: colors.red,
                }}>
                {' (주차권 구매가능)'}
              </Text>
            </Text>
          </View>
        </View>
        <CustomText
          size={FONT.CAPTION}
          string=">"
          color={index % 2 == 0 ? colors.black : colors.redButton}
        />
      </TouchableOpacity>
    );
  };

  const onPressItemShop = (data: ParkingInfo) => {
    hide();
    DeviceEventEmitter.emit(EMIT_EVENT.PING_ON_MAP, data);
  };

  return (
    <ReactNativeModal
      isVisible={showModal}
      onBackButtonPress={hide}
      onBackdropPress={hide}
      useNativeDriver>
      <View style={styles.container}>
        <Pressable onPress={hide} style={styles.viewContent}>
          <Pressable style={styles.show}>
            <View style={styles.viewTop}>
              <View style={styles.viewSearch}>
                <Icon name="magnify" size={widthScale(25)} color={colors.grayText} />
                <CustomText string={text} textStyle={styles.widthScale10} />
              </View>
            </View>
            <View style={styles.viewBottom}>
              <CustomText string={`'${text}' 검색결과`} />
              <View style={styles.viewTopTab}>
                <TouchableOpacity style={styles.widthScale15} onPress={onPressChangeFocus}>
                  <CustomText
                    string={'제휴 주차장'}
                    color={isFocusAffiliated ? colors.redButton : undefined}
                    family={FONT_FAMILY.SEMI_BOLD}
                    size={FONT.TITLE_3}
                  />
                  {isFocusAffiliated && <View style={styles.line} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressChangeFocus}>
                  <CustomText
                    string={'주변 주차장'}
                    color={!isFocusAffiliated ? colors.redButton : undefined}
                    family={FONT_FAMILY.SEMI_BOLD}
                    size={FONT.TITLE_3}
                  />
                  {!isFocusAffiliated && <View style={styles.line} />}
                </TouchableOpacity>
              </View>

              {isLoad ? (
                <View style={styles.load}>
                  <ActivityIndicator />
                </View>
              ) : (
                <FlatList
                  ListEmptyComponent={
                    <View style={styles.viewEmpty}>
                      <CustomText color={colors.grayText} string="검색된 주차장이 없습니다." />
                    </View>
                  }
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    padding: widthScale(12),
                    marginTop: heightScale(10),
                  }}
                  data={(isFocusAffiliated ? dataMain : vmData) as any}
                  renderItem={renderItem}
                />
              )}
            </View>
          </Pressable>
        </Pressable>
      </View>
    </ReactNativeModal>
  );
});

export default memo(PopupSearch);

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    height: height * 0.85,
    backgroundColor: colors.white,
    alignSelf: 'center',
    borderRadius: widthScale(5),
    overflow: 'hidden',
  },
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  viewContent: {
    flex: 1,
  },
  show: {
    backgroundColor: colors.white,
    flex: 1,
  },
  viewSearch: {
    flexDirection: 'row',
    padding: widthScale(5),
    backgroundColor: colors.gray,
    borderRadius: widthScale(30),
    margin: widthScale(10),
    alignItems: 'center',
    paddingHorizontal: widthScale(20),
  },
  viewTop: {
    height: heightScale(70),
    backgroundColor: colors.white,
    justifyContent: 'center',

    shadowColor: '#000000', // Your desired shadow color
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // This property is required for Android
  },
  viewBottom: {
    padding: widthScale(15),
    flex: 1,
  },
  viewTopTab: {
    flexDirection: 'row',
    marginTop: heightScale(15),
  },
  line: {
    width: '100%',
    height: heightScale(2),
    backgroundColor: 'red',
    marginTop: heightScale(2),
  },
  load: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  widthScale15: {
    marginRight: widthScale(15),
  },
  widthScale10: {
    marginLeft: widthScale(10),
  },
  viewItem: {
    width: '100%',
    height: 50,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewTextAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: heightScale(2),
  },
  viewEmpty: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: heightScale(100),
  },
});
