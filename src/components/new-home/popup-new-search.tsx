import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
  Image,
  DeviceEventEmitter,
} from 'react-native';
import _ from 'lodash';
import CustomText from '~components/custom-text';
import CustomPositionMainSearch from '~components/commons/custom-position-main-search';
import ItemAddressMainSearch from '~components/commons/item-address-main-search';
import {useAppSelector, useAppDispatch} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {widthScale, heightScale, widthScale1, heightScale1} from '~styles/scaling-utils';
import {getDistanceFromTwoLatLong} from '~utils/getMyLocation';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {AddressKakaoProps} from '~constants/types';
import {ICONS} from '~/assets/images-path';
import HStack from '~components/h-stack';
import {cacheSearchRecent} from '~reducers/searchRecentLocationsReducer';
import {ROUTE_KEY} from '~navigators/router';
import {searchAddressKakao} from '~services/kakaoService';
import EmptyRecent from '~components/way-to-work-registration/empty-recent';
import FixedContainer from '~components/fixed-container';

const PopupNewSearch = ({navigation}: any) => {
  const dispatch = useAppDispatch();
  const userCordinate = useAppSelector(store => store?.coordinateReducer?.userCordinate);
  const searchRecent = useAppSelector(state => state.searchRecentLocationReducer.searchRecent);

  const [isLoad, setIsLoad] = useState(false);
  const [text, setText] = useState('');
  const [dataMain, setDataMain] = useState<AddressKakaoProps[]>([]);

  const searchDebounce = _.debounce((keyword: string) => {
    searchData(keyword);
  }, 1000);

  const searchData = async (keyword: string) => {
    if (!keyword) {
      setDataMain([]);
      return;
    }

    try {
      setIsLoad(true);
      const results = await searchAddressKakao(keyword);
      setDataMain(results);
      setIsLoad(false);
    } catch (error) {
      setIsLoad(false);
    }
  };

  const onPressItemShop = (item: AddressKakaoProps) => {
    const parkingMapData = {
      id: item.id,
      category: '카카오 검색',
      garageName: item.place_name,
      addressNew: item.address_name,
      lat: parseFloat(item.y),
      lng: parseFloat(item.x),
      ticketPartnerYN: item.isParking ? 'Y' : 'N',
      distance:
        getDistanceFromTwoLatLong(
          parseFloat(item.y),
          parseFloat(item.x),
          userCordinate?.lat!,
          userCordinate?.long!,
        ) / 1000,
    };

    dispatch(cacheSearchRecent([item]));
    DeviceEventEmitter.emit(EMIT_EVENT.PING_ON_MAP, parkingMapData);
    navigation.goBack();
  };

  const renderItem = ({item}: {item: AddressKakaoProps}) => (
    <ItemAddressMainSearch
      item={item}
      onPress={() => onPressItemShop(item)}
      textSearch={text}
      colorName={colors.black}
      isDepart={false}
      isPark={item.isParking || false}
    />
  );

  const renderRecentItem = ({item}: {item: AddressKakaoProps}) => (
    <ItemAddressMainSearch
      item={item}
      onPress={() => onPressItemShop(item)}
      colorName={colors.black}
      isDepart={false}
      isPark={item.isParking || false}
    />
  );

  return (
    <FixedContainer>
      <View style={styles.viewTop}>
        <HStack style={styles.inputContainer}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image source={ICONS.backbtn} style={styles.iconStyle} />
          </Pressable>
          <CustomPositionMainSearch
            value={text}
            onChangeText={value => {
              setText(value);
              searchDebounce(value);
            }}
            placeholder="주차장명 또는 지역명을 입력해주세요!"
            type="DELETE_TEXT"
            borderColorType="MENU_TEXT_COLOR"
            onDeleteText={() => {
              setText('');
              searchDebounce('');
            }}
          />
        </HStack>
      </View>

      <View style={styles.viewBottom}>
        {isLoad ? (
          <View style={styles.load}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            {text ? (
              <FlatList
                ListEmptyComponent={
                  <View style={styles.viewEmpty}>
                    <CustomText
                      color={colors.grayText}
                      string="해당 주소가 없습니다."
                      size={FONT.CAPTION_6}
                      forDriveMe
                    />
                  </View>
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{padding: widthScale(0), marginTop: heightScale(0)}}
                data={dataMain}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            ) : (
              <>
                <View style={styles.divider1} />
                <View style={styles.recentHeader}>
                  <CustomText
                    color={colors.grayText}
                    size={FONT.CAPTION_6}
                    family={FONT_FAMILY.MEDIUM}
                    forDriveMe
                    string="최근 검색 기록"
                  />
                  {!!searchRecent.length && (
                    <Pressable
                      onPress={() => navigation.navigate(ROUTE_KEY.RecentSearchLocationMain)}>
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
                  data={searchRecent}
                  renderItem={renderRecentItem}
                  keyExtractor={item => item.id}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={<EmptyRecent />}
                />
              </>
            )}
          </>
        )}
      </View>
    </FixedContainer>
  );
};

export default PopupNewSearch;

const styles = StyleSheet.create({
  viewTop: {
    paddingTop: heightScale(50),
    height: heightScale(90),
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  iconStyle: {
    width: widthScale1(48),
    height: heightScale1(48),
    marginRight: 0,
  },
  viewBottom: {
    paddingTop: heightScale(15),
    padding: widthScale(0),
    flex: 1,
  },
  load: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  viewEmpty: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: heightScale(200),
  },
  divider1: {
    marginTop: 15,
    backgroundColor: colors.gray9,
    height: heightScale(1),
  },
  recentHeader: {
    flexDirection: 'row',
    paddingTop: heightScale(5),
    justifyContent: 'space-between',
    paddingHorizontal: widthScale(21),
    marginVertical: heightScale(20),
  },
});
