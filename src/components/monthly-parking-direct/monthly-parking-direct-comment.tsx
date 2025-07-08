import {Alert, DeviceEventEmitter, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  useDeleteMonthShareBBSReplyMutation,
  useLazyGetMonthlyParkingDirectReplyQuery,
} from '~services/monthlyParkingDirectServices';
import {MonthlyParkingDirectReplyProps} from '~constants/types';
import {FlashList} from '@shopify/flash-list';
import HStack from '~components/h-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import CustomText from '~components/custom-text';
import moment from 'moment';
import {getTimeAgo} from '~utils/hourUtils';
import {EMIT_EVENT, FONT, FONT_FAMILY, GENDER, IS_ACTIVE} from '~constants/enum';
import {PADDING} from '~constants/constant';
import Divider from '~components/divider';
import LoadMoreButton from '~components/load-more-button';
import MonthlyParkingDirectReply from './monthly-parking-direct-reply';
import {strings} from '~constants/strings';
import {useAppSelector} from '~store/storeHooks';
import MonthlyParkingDirectReplyModal, {
  MonthlyParkingDirectReplyRefs,
} from './month-parking-direct-reply-modal';
import {showMessage} from 'react-native-flash-message';
import {UseRootStackNavigation} from '~navigators/stack';
import {useNavigation} from '@react-navigation/native';
import {ROUTE_KEY} from '~navigators/router';
import Spinner from '~components/spinner';

interface Props {
  BBSID: number;
}

const MonthlyParkingDirectComment: React.FC<Props> = memo(props => {
  const {BBSID} = props;
  const navigation: UseRootStackNavigation = useNavigation();

  const replyCommentRef = useRef<MonthlyParkingDirectReplyRefs>(null);

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const [lastID, setLastID] = useState<number>(0);
  const [listData, setListData] = useState<MonthlyParkingDirectReplyProps[]>([]);
  const [canLoadMore, setCanLoadMore] = useState<boolean>(false);

  const [getMonthlyParkingDirectReply, {isFetching}] = useLazyGetMonthlyParkingDirectReplyQuery();
  const [deleteMonthShareBBSReply] = useDeleteMonthShareBBSReplyMutation();

  const fetchData = () => {
    if (lastID === 0) {
      setListData([]);
      setCanLoadMore(false);
    }
    getMonthlyParkingDirectReply({
      id: BBSID,
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
      });
  };

  useEffect(() => {
    fetchData();
  }, [lastID]);

  useEffect(() => {
    const addCommentListeners = DeviceEventEmitter.addListener(
      EMIT_EVENT.MONTHLY_PARKING_DIRECT,
      () => {
        setLastID(0);
        fetchData();
      },
    );

    return () => {
      addCommentListeners.remove();
    };
  }, []);

  const handleReply = (item: MonthlyParkingDirectReplyProps) => {
    if (!userToken?.id || !userToken?.password) {
      showMessage({
        message: strings.general_text?.login_first,
      });
      navigation.navigate(ROUTE_KEY.Login);
      return;
    }

    replyCommentRef?.current?.show(item?.id, item?.memberNic);
  };

  const handleDelete = (item: MonthlyParkingDirectReplyProps) => {
    Alert.alert('', strings?.general_text?.are_you_sure_to_delete, [
      {
        text: strings?.general_text?.agree,
        onPress: () => {
          Spinner.show();
          deleteMonthShareBBSReply({
            BBSID: item?.id,
            userID: userToken?.id,
            userPass: userToken?.password,
          })
            .unwrap()
            .then(res => {
              if (res === '200') {
                DeviceEventEmitter.emit(EMIT_EVENT.MONTHLY_PARKING_DIRECT);
              } else {
                showMessage({
                  message: strings?.general_text?.please_try_again,
                });
              }
            })
            .finally(() => {
              Spinner.hide();
            });
        },
      },
      {
        text: strings?.general_text?.cancel,
        style: 'cancel',
      },
    ]);
  };

  const renderItem = useCallback(
    ({item, index}: {item: MonthlyParkingDirectReplyProps; index: number}) => {
      return (
        <View>
          <HStack style={styles.itemContainer}>
            <Icon
              name="chat-processing"
              size={widthScale(35)}
              color={index % 2 === 0 ? colors.yellow : colors.orange}
            />
            <View style={styles.content}>
              <HStack style={styles.itemHeaderWrapper}>
                <HStack>
                  <TouchableOpacity>
                    <CustomText
                      string={item?.memberNic}
                      family={FONT_FAMILY.SEMI_BOLD}
                      color={item?.gender === GENDER?.MALE ? colors.darkBlue : colors.pink}
                    />
                  </TouchableOpacity>
                  <CustomText
                    size={FONT.CAPTION_2}
                    color={colors.darkGray}
                    string={` | ${moment(item?.regdate * 1000).format('MM.DD HH:mm')}`}
                  />
                </HStack>
                {getTimeAgo(item?.regdate * 1000) ? (
                  <HStack>
                    <Icon name="clock-outline" size={widthScale(15)} color={colors.darkGray} />
                    <CustomText
                      string={` ${getTimeAgo(item?.regdate * 1000)}`}
                      color={colors.darkGray}
                      size={FONT.CAPTION_2}
                    />
                  </HStack>
                ) : null}
              </HStack>
              <HStack style={styles.replyButtonWrapper}>
                <TouchableOpacity onPress={() => handleReply(item)}>
                  <HStack>
                    <Icon name="reply" color={colors.darkBlue} size={widthScale(20)} />
                    <CustomText
                      string={strings?.general_text?.reply}
                      size={FONT.CAPTION_2}
                      color={colors.darkBlue}
                    />
                  </HStack>
                </TouchableOpacity>
                {userToken?.id === item?.memberId || userToken?.adminYN === IS_ACTIVE.YES ? (
                  <TouchableOpacity
                    onPress={() => handleDelete(item)}
                    style={{marginLeft: PADDING / 2}}>
                    <HStack>
                      <Icon name="delete" color={colors.darkBlue} size={widthScale(16)} />
                      <CustomText
                        string={strings?.general_text?.delete}
                        size={FONT.CAPTION_2}
                        color={colors.darkBlue}
                      />
                    </HStack>
                  </TouchableOpacity>
                ) : null}
              </HStack>

              <View style={styles.replyWrapper}>
                <CustomText string={item?.text} />
              </View>
            </View>
          </HStack>

          <MonthlyParkingDirectReply BBSID={item?.id} />
        </View>
      );
    },
    [],
  );

  const renderFooter = useCallback(() => {
    if (canLoadMore && listData?.length > 0) {
      return (
        <LoadMoreButton
          onPress={() => {
            setLastID(listData[listData?.length - 1]?.id);
          }}
          isFetching={isFetching}
        />
      );
    } else {
      return null;
    }
  }, [lastID, canLoadMore, listData]);

  return (
    <View style={styles.container}>
      <FlashList
        data={listData}
        renderItem={renderItem}
        estimatedItemSize={50}
        ItemSeparatorComponent={() => <Divider />}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{
          paddingBottom: PADDING / 2,
        }}
      />

      {/* Reply comment modal */}
      <MonthlyParkingDirectReplyModal ref={replyCommentRef} />
    </View>
  );
});

export default MonthlyParkingDirectComment;

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
  },
  content: {
    flex: 1,
    marginLeft: PADDING / 2,
  },
  itemContainer: {
    alignItems: 'flex-start',
    marginTop: PADDING,
  },
  itemHeaderWrapper: {
    justifyContent: 'space-between',
  },
  replyWrapper: {
    marginVertical: PADDING,
  },
  replyButtonWrapper: {
    marginTop: 5,
  },
});
