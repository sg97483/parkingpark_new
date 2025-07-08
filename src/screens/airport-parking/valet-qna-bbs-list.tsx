import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {DeviceEventEmitter, StyleSheet, TouchableOpacity, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import ValetQnaBbsItem from '~components/valet-qna-bbs-list/valet-qna-bbs-item';
import {PADDING, PADDING_HEIGHT} from '~constants/constant';
import {EMIT_EVENT, FONT, IS_ACTIVE} from '~constants/enum';
import {strings} from '~constants/strings';
import {ValetQnaBbsProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps, UseRootStackNavigation} from '~navigators/stack';
import {useLazyGetListValetQnaBbsQuery} from '~services/parkingServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

const ValetQnaBbsList = memo((props: RootStackScreenProps<'ValetQnaBbsList'>) => {
  const navigation: UseRootStackNavigation = useNavigation();

  const parkId = props?.route?.params?.parkingID;

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const [getListValetQnaBbs, {isFetching}] = useLazyGetListValetQnaBbsQuery();

  const renderRightContentHeader = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (!userToken?.id || !userToken?.password) {
            navigation.navigate(ROUTE_KEY.Login);
          } else {
            if (parkId) {
              navigation.navigate(ROUTE_KEY.ValetQnaBbsCreate, {
                parkID: parkId,
              });
            }
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
    );
  };

  const [listData, setListData] = useState<ValetQnaBbsProps[]>([]);
  const [lastID, setLastID] = useState<number>(0);
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);

  const fetchData = () => {
    if (lastID === 0) {
      setListData([]);
      setCanLoadMore(false);
    }
    getListValetQnaBbs({
      lastID,
      parkId,
    })
      .unwrap()
      .then(res => {
        if (res?.length < 10) {
          setCanLoadMore(false);
        } else {
          setCanLoadMore(true);
        }
        setListData(oldValue => [...oldValue, ...res]);
      });
  };

  useEffect(() => {
    fetchData();
  }, [lastID]);

  useEffect(() => {
    const listeners = DeviceEventEmitter.addListener(EMIT_EVENT.CHANGE_QNA_BBS_REPLY_LIST, () => {
      fetchData();
    });

    return () => {
      listeners.remove();
    };
  }, []);

  const onRefresh = useCallback(() => {
    if (lastID === 0) {
      fetchData();
    } else {
      setLastID(0);
    }
  }, [lastID]);

  const onEndReached = () => {
    if (canLoadMore) {
      setLastID(listData[listData?.length - 1]?.id);
    }
  };

  const onPressDetail = (item: ValetQnaBbsProps) => {
    // const isSameMemberId = userToken?.id !== null && userToken?.id === item?.id;
    const isSameMemberId = userToken?.id !== undefined;
    const isAdmin = userToken?.adminYN !== null && userToken?.adminYN === IS_ACTIVE.YES;

    let isValetParkingAdmin = false;
    const valetParkingIds = userToken?.adminValetParkingId?.split(',');
    if (valetParkingIds !== null) {
      valetParkingIds?.forEach(el => {
        if (Number(el) === Number(item?.parkingLotId)) {
          isValetParkingAdmin = true;
        }
      });
    }

    if (isSameMemberId || isAdmin || isValetParkingAdmin) {
      navigation.navigate(ROUTE_KEY.ValetQnaBbsDetail, {bbs: item});
    } else {
      showMessage({
        message: strings.valet_qna_bbs_list.permission,
      });
    }
  };

  const renderItem = useCallback(({item, index}: {item: ValetQnaBbsProps; index: number}) => {
    return (
      <ValetQnaBbsItem
        item={item}
        index={index}
        length={listData?.length}
        onPress={() => onPressDetail(item)}
      />
    );
  }, []);

  return (
    <FixedContainer>
      <CustomHeader
        text={strings.valet_qna_bbs_list.header}
        rightContent={renderRightContentHeader()}
      />

      <View style={styles.listView}>
        <FlashList
          data={listData}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          onEndReached={onEndReached}
          onEndReachedThreshold={1}
          onRefresh={onRefresh}
          estimatedItemSize={200}
          refreshing={isFetching}
        />
      </View>
    </FixedContainer>
  );
});

const styles = StyleSheet.create({
  createButtonWrapper: {
    backgroundColor: colors.red,
    height: heightScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: PADDING / 2,
    borderRadius: widthScale(5),
  },
  listView: {
    flex: 1,
    marginTop: PADDING_HEIGHT,
  },
});

export default ValetQnaBbsList;
