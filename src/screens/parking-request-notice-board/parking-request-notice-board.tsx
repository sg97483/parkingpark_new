import {FlashList} from '@shopify/flash-list';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, DeviceEventEmitter, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {ICONS} from '~/assets/images-path';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import ParkingQuestionNoticeItem from '~components/parking-question-notice-board/parking-question-notice-item';
import ParkingRequestNoticeModal, {
  ParkingRequestNoticeModalRefs,
} from '~components/parking-question-notice-board/parking-request-notice-modal';
import {PADDING} from '~constants/constant';
import {EMIT_EVENT, FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import {strings} from '~constants/strings';
import {ValetQnaBbsProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useDeleteQnaBbsMutation, useLazyGetListValetQnaBbsQuery} from '~services/parkingServices';
import {useGetUserInfoQuery} from '~services/userServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

const ParkingRequestNoticeBoard = (props: RootStackScreenProps<'ParkingRequestNoticeBoard'>) => {
  const {navigation, route} = props;

  const showHeader = route?.params?.showHeader || false;

  const parkingRequestNoticeModalRef = useRef<ParkingRequestNoticeModalRefs>(null);

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const [getListValetQnaBbs, {isFetching}] = useLazyGetListValetQnaBbsQuery();

  const [deleteQnaBbs] = useDeleteQnaBbsMutation();

  const {data: userInfo} = useGetUserInfoQuery(
    {
      id: userToken?.id,
      password: userToken?.password,
    },
    {skip: !userToken?.id || !userToken?.password},
  );

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
    })
      .unwrap()
      .then(res => {
        if (res?.length < 10) {
          setCanLoadMore(false);
        } else {
          setCanLoadMore(true);
        }
        if (userToken?.adminYN === IS_ACTIVE.YES) {
          setListData(oldValue => [...oldValue, ...res]);
        } else {
          let filterList = res?.filter((it: ValetQnaBbsProps) => it?.memberId === userToken?.id);
          setListData(oldValue => [...oldValue, ...filterList]);
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, [lastID, userToken]);

  useEffect(() => {
    const listeners = DeviceEventEmitter.addListener(EMIT_EVENT.RELOAD_QNA_BBS, () => {
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

  const onEndReached = useCallback(() => {
    if (canLoadMore) {
      setLastID(listData[listData?.length - 1]?.id);
    }
  }, [canLoadMore, listData]);

  const renderItem = useCallback(({item, index}: {item: ValetQnaBbsProps; index: number}) => {
    return (
      <ParkingQuestionNoticeItem
        key={index}
        item={item}
        onPressButtonActions={onPressDeleteItem}
        onPressShowDetail={onPressNoticeDetail}
      />
    );
  }, []);

  const onPressDeleteItem = (item: ValetQnaBbsProps) => {
    Alert.alert('', strings.parking_request_notice_board.delete_confirmation, [
      {
        text: '예',
        onPress: () => handleDelete(item),
      },
      {
        text: '아니오',
        onPress: () => {},
      },
    ]);
  };

  const handleDelete = (item: ValetQnaBbsProps) => {
    if (userToken?.id && userToken?.password && item?.id) {
      const body = {
        memberId: userToken?.id + '',
        memberPwd: userToken.password,
        id: item?.id + '',
      };
      deleteQnaBbs(body)
        .unwrap()
        .then(res => {
          if (res === '200') {
            onRefresh();
          } else {
            showMessage({
              message: strings?.general_text?.please_try_again,
            });
          }
        });
    }
  };

  const onPressNoticeDetail = (item: ValetQnaBbsProps) => {
    let isSameMemberId = false;
    if (item?.memberId === userToken?.id) {
      isSameMemberId = true;
    }

    let isAdmin = false;
    if (userToken?.adminYN === IS_ACTIVE.YES) {
      isAdmin = true;
    }

    let isValetParkingAdmin = false;
    if (userInfo?.adminValetParkingId) {
      isValetParkingAdmin = true;
    }

    if (isSameMemberId || isAdmin || isValetParkingAdmin) {
      navigation.navigate(ROUTE_KEY.ParkingRequestNoticeBoardDetail, {
        notice: item,
      });
    } else {
      showMessage({
        message: strings.parking_request_notice_board.permission,
      });
    }
  };

  return (
    <FixedContainer edges={showHeader ? ['top', 'left', 'right'] : ['left', 'right']}>
      {showHeader ? (
        <CustomHeader
          text={strings.parking_request_notice_board.parking_request_notice}
          rightContent={
            <TouchableOpacity
              onPress={() => {
                if (!userToken?.id || !userToken?.password) {
                  navigation.navigate(ROUTE_KEY.Login);
                } else {
                  navigation.navigate(ROUTE_KEY.ParkingRequestNoticeAdd);
                }
              }}>
              <Image source={ICONS.edit} style={styles.writeIcon} resizeMode="contain" />
            </TouchableOpacity>
          }
        />
      ) : null}

      <FlashList
        keyExtractor={item => JSON.stringify(item)}
        data={listData}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={1}
        onRefresh={onRefresh}
        ItemSeparatorComponent={() => <Divider />}
        estimatedItemSize={200}
        contentContainerStyle={styles.listView}
        refreshing={isFetching}
      />

      {listData?.length ? (
        <TouchableOpacity
          style={styles.questionButton}
          onPress={() => navigation.navigate(ROUTE_KEY.FAQ)}>
          <HStack>
            <CustomText
              string={strings?.parking_request_notice_board?.general_question}
              color={colors.blue}
              textStyle={styles.questionBtnTitle}
              family={FONT_FAMILY.SEMI_BOLD}
            />
            <Image source={ICONS.chevron_right} style={styles.chevronRight} resizeMode="contain" />
          </HStack>
        </TouchableOpacity>
      ) : null}

      <ParkingRequestNoticeModal ref={parkingRequestNoticeModalRef} />
    </FixedContainer>
  );
};

export default ParkingRequestNoticeBoard;

const styles = StyleSheet.create({
  button: {
    width: widthScale(100),
    minHeight: heightScale(35),
    borderRadius: widthScale(5),
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  writeIcon: {
    width: widthScale(30),
    height: heightScale(30),
  },
  questionButton: {
    justifyContent: 'flex-start',
    height: heightScale(60),
    paddingHorizontal: PADDING / 2,
  },
  listView: {
    paddingHorizontal: PADDING / 2,
  },
  questionBtnTitle: {
    textDecorationLine: 'underline',
  },
  chevronRight: {
    width: widthScale(28),
    height: heightScale(28),
    tintColor: colors.blue,
  },
});
