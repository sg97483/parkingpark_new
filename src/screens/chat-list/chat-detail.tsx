import notifee, {AndroidImportance, TimestampTrigger, TriggerType} from '@notifee/react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import moment from 'moment';
import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {DeviceEventEmitter, KeyboardAvoidingView, Pressable, StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {Icons} from '~/assets/svgs';
import {ChatRoomModel, MessageGroupByDateModel, MessageModel} from '~/model/chat-model';
import AppModal from '~components/app-modal';
import ChatInput from '~components/chat-list/chat-input';
import ChatQuickAction, {ChatQuickActionRefs} from '~components/chat-list/chat-quick-action';
import MessageItem from '~components/chat-list/message-item';
import ReservationInfo from '~components/chat-list/reservation-info';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import Spinner from '~components/spinner';
import {HEIGHT, IS_IOS, PADDING1} from '~constants/constant';
import {AUTO_MESSAGE_TYPE, EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {DriverRoadDayModel} from '~model/driver-model';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheIdChatRoom, clearChatReducer} from '~reducers/chatReducer';
import {cacheCarpoolAlarmList} from '~reducers/termAndContionReducer';
import {
  useBlockUserMutation,
  useGetRouteRequestInfoQuery,
  useReadMyCarpoolInfoQuery,
} from '~services/carpoolServices';
import {useGetPayHistoryInfoQuery} from '~services/passengerServices';
import {useReadMyDriverQuery} from '~services/userServices';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';
import {groupMessageDataByDate} from '~utils/common';
import {dayjs} from '~utils/dayjsUtil';
import {handleSendAutomaticMessage} from '~utils/firebaseChatUtils';

const ChatDetail = memo((props: RootStackScreenProps<'ChatDetail'>) => {
  const {route, navigation} = props;
  const {currentChatRoomInfo} = route?.params;

  const dispatch = useAppDispatch();

  const listChatRef = useRef<FlashList<any>>(null);
  const chatActionRef = useRef<ChatQuickActionRefs>(null);

  const [chatRoomInfo, setChatRoomInfo] = useState<ChatRoomModel>(currentChatRoomInfo);

  const [temptRoute, setTemptRoute] = useState<DriverRoadDayModel | undefined>(
    currentChatRoomInfo?.temptRoute ?? undefined,
  );
  const {userID} = userHook();
  const carpoolMode = useMemo(
    (): 'PASSENGER' | 'DRIVER' =>
      Number(chatRoomInfo?.passengerID) === Number(userID) ? 'PASSENGER' : 'DRIVER',
    [userID, chatRoomInfo?.passengerID],
  );
  const my_uid = auth().currentUser?.uid;
  const currentCarpoolAlarm = useAppSelector(
    state => state?.termAndConditionReducer?.carpoolAlarmList,
  );
  const carpoolAlarm = useMemo(
    () => currentCarpoolAlarm?.find(item => item?.roomID === chatRoomInfo?.roomID),
    [currentCarpoolAlarm],
  );
  const temptNotiID = useRef<string>('');

  const getNewTemptRouteData = () => {
    firestore()
      .collection('rooms')
      .doc(chatRoomInfo?.roomID)
      .get()
      .then(snapshot => {
        if (!snapshot?.metadata?.hasPendingWrites) {
          setTemptRoute(snapshot?.data()?.temptRoute);
        }
      });
  };

  const [listChat, setListChat] = useState<MessageGroupByDateModel[]>([]);
  const [isUserLeftChat, setIsUserLeftChat] = useState<boolean>(false);
  const [messageCount, setMessageCount] = useState<{
    passenger: number;
    driver: number;
    isDriverReply: boolean;
  }>({
    passenger: 0,
    driver: 0,
    isDriverReply: false,
  });
  const [userFCMToken, setUserFCMToken] = useState<string>('');
  const [blockUser] = useBlockUserMutation();
  const {data: driverInfo} = useReadMyDriverQuery(
    {
      memberId: chatRoomInfo?.driverID?.toString(),
    },
    {skip: !chatRoomInfo?.driverID},
  );

  const {data: passengerInfo} = useReadMyDriverQuery(
    {
      memberId: chatRoomInfo?.passengerID?.toString(),
    },
    {skip: !chatRoomInfo?.passengerID},
  );

  const {
    data: routeRequestInfo,
    refetch: refetchRouteRequestInfo,
    isUninitialized: isRouteRequestInfoUninitialized,
  } = useGetRouteRequestInfoQuery(
    {
      resId: chatRoomInfo?.resId || 0,
      requestBy: chatRoomInfo?.isRequestedBy ?? 'PASSENGER',
    },
    {skip: !chatRoomInfo?.resId},
  );

  const {
    data: payInfo,
    refetch: refetchPaymentHistory,
    isUninitialized: isPayInfoUninitialized,
  } = useGetPayHistoryInfoQuery(
    {
      hid: Number(chatRoomInfo?.resId),
      requestBy: chatRoomInfo?.isRequestedBy ?? 'PASSENGER',
    },
    {skip: !chatRoomInfo?.resId},
  );

  const {data: dataCarpool} = useReadMyCarpoolInfoQuery({
    memberId: passengerInfo?.memberId as number,
  });

  const isPassengerBusinessCard = useMemo(
    (): boolean =>
      !!dataCarpool?.coAddress &&
      !!dataCarpool?.job &&
      !!dataCarpool?.coName &&
      !!dataCarpool?.jobType,

    [dataCarpool],
  );

  // handle catch notification
  useEffect(() => {
    const id_chat = chatRoomInfo?.roomID;
    console.log('dispatch id_chat', id_chat);
    dispatch(cacheIdChatRoom(id_chat as string));
  }, []);

  useEffect(() => {
    const driverChangeAmountListener = DeviceEventEmitter.addListener(
      EMIT_EVENT.REFETCH_DATA_CARPOOL,
      () => {
        getNewTemptRouteData();
        refetchRouteRequestInfo();
      },
    );

    return () => {
      driverChangeAmountListener.remove();
    };
  }, []);

  const refetchReservationData = useCallback(() => {
    if (!isRouteRequestInfoUninitialized) {
      refetchRouteRequestInfo();
    }
  }, [isRouteRequestInfoUninitialized]);

  useFocusEffect(refetchReservationData);

  useEffect(() => {
    const onCreateTriggerNotification = async () => {
      if (carpoolAlarm) {
        if (carpoolAlarm?.notiID) {
          await notifee.cancelTriggerNotification(carpoolAlarm?.notiID);
        }
        if (temptNotiID?.current) {
          await notifee.cancelTriggerNotification(temptNotiID?.current);
        }
        const trigger: TimestampTrigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: moment(carpoolAlarm?.day + ' ' + carpoolAlarm?.time, 'YYYY.MM.DD HH:mm')
            .set({
              seconds: 0,
              milliseconds: 0,
            })
            .valueOf(),
        };
        const getTimeText = () => {
          switch (carpoolAlarm?.type) {
            case '5M':
              return '5분';
            case '15M':
              return '15분';
            case '30M':
              return '30분';
            case '1D':
              return '1일';
            case '2D':
              return '2일';
            default:
              return '';
          }
        };
        notifee
          .createTriggerNotification(
            {
              title: `카풀 예정시간이 ${getTimeText()} 남았어요! `,
              body:
                chatRoomInfo?.isRequestedBy === 'PASSENGER'
                  ? `${driverInfo?.nic ?? ''}님과 카풀약속시간에 늦지 않도록 준비해주세요!`
                  : `${passengerInfo?.nic ?? ''}님과 카풀약속시간에 늦지 않도록 준비해주세요!`,
              android: {
                channelId: 'DRIVE_ME_CHANEL',
                sound: 'default',
                importance: AndroidImportance.HIGH,
              },
              ios: {
                sound: 'default',
              },
            },
            trigger,
          )
          .then((returnedNotificationID: string) => {
            temptNotiID.current = returnedNotificationID;
            dispatch(
              cacheCarpoolAlarmList(
                currentCarpoolAlarm?.map(item => {
                  if (item?.roomID === chatRoomInfo?.roomID) {
                    return {
                      ...carpoolAlarm,
                      notiID: returnedNotificationID,
                    };
                  }
                  return item;
                }),
              ),
            );
          })
          .catch(error => {
            console.log('🚀 ~ useEffect ~ error:', error);
          });
      }
    };

    onCreateTriggerNotification();
  }, [carpoolAlarm?.type]);

  const getNewCDayId = () => {
    firestore()
      .collection('rooms')
      .doc(currentChatRoomInfo?.roomID)
      .get()
      .then(res => {
        if (res?.data()?.cDayId) {
          setChatRoomInfo({
            ...currentChatRoomInfo,
            cDayId: res?.data()?.cDayId,
            isCancelRequest: res?.data()?.isCancelRequest,
          } as ChatRoomModel);
        }
      })
      .catch(error => {
        console.log('🚀 ~ getNewCDayId ~ error:', error);
      });
  };

  useEffect(() => {
    firestore()
      .collection('rooms')
      .doc(chatRoomInfo?.roomID)
      .get()
      .then(value => {
        const users = value?.data()?.users;
        if (users) {
          const otherUID = Object.keys(value?.data()?.users).find(it => it !== my_uid); // PASSENGER ID OR DRIVER ID
          if (otherUID) {
            firestore()
              .collection('users')
              .doc(otherUID)
              .get()
              .then(user => {
                if (!user.metadata.hasPendingWrites) {
                  setUserFCMToken(user?.data()?.token || '');
                }
              });
          }
        }
      });
    const getListMessageListener = firestore()
      .collection('rooms')
      .doc(chatRoomInfo?.roomID)
      .collection('messages')
      .orderBy('timestamp')
      .onSnapshot(value => {
        if (!value.metadata.hasPendingWrites) {
          refetchReservationData();
          let passengerMessageCount = 0;
          let driverMessageCount = 0;
          let isDriverReply = false;

          const temptList = value.docs.flatMap(item => {
            if (
              Number(item?.data()?.msgtype) <= 1 &&
              item?.data().uid !== my_uid &&
              carpoolMode === 'PASSENGER'
            ) {
              driverMessageCount++;
            }
            if (
              Number(item?.data()?.msgtype) <= 1 &&
              item?.data().uid !== my_uid &&
              carpoolMode === 'DRIVER'
            ) {
              passengerMessageCount++;
            }
            if (item?.data()?.msgtype === AUTO_MESSAGE_TYPE.DRIVER_REPLY) {
              isDriverReply = true;
            }
            if (
              item?.data()?.msgtype === AUTO_MESSAGE_TYPE.PASSENGER_LEFT ||
              item?.data()?.msgtype === AUTO_MESSAGE_TYPE.DRIVER_LEFT
            ) {
              setIsUserLeftChat(true);
            }
            if (
              item?.data()?.msgtype === AUTO_MESSAGE_TYPE.ROUTE_OPERATION_REGISTRATION ||
              item?.data()?.msgtype === AUTO_MESSAGE_TYPE.CARPOOL_APPROVAL
            ) {
              passengerMessageCount = 0;
              getNewCDayId();
            }
            return {
              msg: item?.data()?.msg,
              msgtype: item?.data()?.msgtype,
              readUsers: item?.data()?.readUsers,
              timestamp: dayjs
                .unix(item?.data().timestamp?.seconds)
                .add(item?.data().timestamp?.nanoseconds / 1e9, 'second') as any,
              uid: item?.data()?.uid,
              filename: item?.data()?.filename || '',
              filesize: item?.data()?.filesize || '',
              chatID: item?.id,
            };
          });
          if (!isPayInfoUninitialized) {
            refetchPaymentHistory();
          }
          setMessageCount({
            passenger: passengerMessageCount,
            driver: driverMessageCount,
            isDriverReply,
          });
          setListChat(groupMessageDataByDate(temptList));
        }
      });
    const onChangeReadMsgCount = firestore()
      .collection('rooms')
      .doc(chatRoomInfo?.roomID)
      .onSnapshot(async value => {
        if (!value.metadata.hasPendingWrites) {
          const users = value.data()?.users as Record<string, number>;
          if (users) {
            users[my_uid as string] = 0;
            await firestore().collection('rooms').doc(chatRoomInfo?.roomID).update({
              users: users,
            });
          }
        }
      });
    const getTemptRouteListener = firestore()
      .collection('rooms')
      .doc(chatRoomInfo?.roomID)
      .onSnapshot(snapshot => {
        if (!snapshot?.metadata?.hasPendingWrites) {
          setTemptRoute(snapshot?.data()?.temptRoute);
        }
      });
    return () => {
      getListMessageListener();
      onChangeReadMsgCount();
      getTemptRouteListener();
    };
  }, [isPayInfoUninitialized]);

  const routeSelectDay = (payInfo?.selectDay ?? temptRoute?.selectDay)?.slice(0, 10);
  const routeStartTime = payInfo?.startTime ?? temptRoute?.startTime;

  const renderItem = useCallback(
    ({item}: {item: MessageGroupByDateModel}) => {
      return (
        <View>
          <CustomText
            forDriveMe
            textStyle={[styles.dayTextStyle]}
            string={dayjs(item?.date, 'YYYY-MM-DD').format('YYYY년 MM월 DD일')}
            size={FONT.CAPTION}
            family={FONT_FAMILY.MEDIUM}
            color={colors.grayText}
          />

          {item?.messages?.map((message: MessageModel, index: number) => {
            if (message?.msgtype === '0') {
              return (
                <MessageItem
                  otherAvatar={
                    carpoolMode === 'PASSENGER'
                      ? driverInfo?.profileImageUrl
                      : passengerInfo?.profileImageUrl
                  }
                  key={message?.chatID}
                  item={message}
                  nextMessageTime={item?.messages?.[index + 1]?.timestamp}
                  prevMessageTime={item?.messages?.[index - 1]?.timestamp}
                  isShowAva={
                    item?.messages?.[index]?.uid !== my_uid &&
                    item?.messages?.[index - 1]?.uid !== item?.messages?.[index]?.uid
                  }
                  roomID={chatRoomInfo?.roomID ?? ''}
                  routeSelectDay={routeSelectDay}
                  routeStartTime={routeStartTime}
                />
              );
            } else if (item?.messages?.[index + 1]?.msg !== item?.messages?.[index]?.msg) {
              return (
                <MessageItem
                  otherAvatar={
                    carpoolMode === 'PASSENGER'
                      ? driverInfo?.profileImageUrl
                      : passengerInfo?.profileImageUrl
                  }
                  key={message?.chatID}
                  item={message}
                  nextMessageTime={item?.messages?.[index + 1]?.timestamp}
                  prevMessageTime={item?.messages?.[index - 1]?.timestamp}
                  isShowAva={
                    item?.messages?.[index]?.uid !== my_uid &&
                    item?.messages?.[index - 1]?.uid !== item?.messages?.[index]?.uid
                  }
                  roomID={chatRoomInfo?.roomID ?? ''}
                  routeSelectDay={routeSelectDay}
                  routeStartTime={routeStartTime}
                />
              );
            }
          })}
        </View>
      );
    },
    [driverInfo?.profileImageUrl, passengerInfo?.profileImageUrl, routeStartTime, routeSelectDay],
  );

  const handleLeftChat = useCallback(() => {
    if (payInfo?.rStatusCheck === 'R') {
      showMessage({
        message:
          '카풀이 결제되여 현재 예약 완료 상태 입니다.\n카풀 종료 후에만 채팅방을 나갈 수 있어요.',
      });
      return;
    }

    setTimeout(() => {
      AppModal.show({
        title: '채팅방을 나가면 채팅 목록 및 대화\n내용이 삭제되고 복구할수 없어요.',
        content: '정말 나가시겠습니까?',
        isTwoButton: true,
        textYes: '나가기',
        textNo: '취소',
        yesFunc() {
          Spinner.show();
          firestore()
            .collection('rooms')
            .doc(chatRoomInfo?.roomID)
            .get()
            .then(value => {
              const currentNumberUserInChatRoom = value?.data()?.users
                ? Object.keys(value?.data()?.users).length
                : 0;
              if (currentNumberUserInChatRoom <= 1) {
                firestore().collection('rooms').doc(chatRoomInfo?.roomID).delete();
              } else {
                const newUsers = value?.data()?.users;

                if (my_uid && my_uid in newUsers) {
                  delete newUsers[my_uid];
                  firestore()
                    .collection('rooms')
                    .doc(chatRoomInfo?.roomID)
                    .update({
                      users: newUsers,
                      userCount: Object.keys(newUsers)?.length ?? 0,
                      rStatusCheck: 'C',
                    })
                    .then(() => {
                      handleSendAutomaticMessage({
                        roomID: chatRoomInfo?.roomID ?? '',
                        type:
                          carpoolMode === 'PASSENGER'
                            ? AUTO_MESSAGE_TYPE.PASSENGER_LEFT
                            : AUTO_MESSAGE_TYPE.DRIVER_LEFT,
                        driverName: driverInfo?.nic ?? '',
                        passengerName: passengerInfo?.nic ?? '',
                      });
                    });
                }
              }
            })
            .finally(() => {
              setTimeout(() => {
                Spinner.hide();
                navigation.goBack();
              }, 250);
            });
        },
      });
    }, 250);
  }, [
    chatRoomInfo?.roomID,
    carpoolMode,
    driverInfo?.nic,
    passengerInfo?.nic,
    payInfo?.rStatusCheck,
    my_uid,
  ]);

  const onCheckUserInfoPress = () => {
    if (carpoolMode === 'PASSENGER') {
      navigation.navigate(ROUTE_KEY.DriverProfile, {
        driverID: driverInfo?.memberId as number,
        driverName: driverInfo?.nic ?? '',
      });
      return;
    }
    navigation.navigate(ROUTE_KEY.PassengerProfile, {
      passengerID: passengerInfo?.memberId,
      passengerName: passengerInfo?.nic,
    });
  };

  const getChatRoomTitle = useMemo(() => {
    if (carpoolMode === 'PASSENGER') {
      return driverInfo?.nic ?? '';
    }
    if (carpoolMode === 'DRIVER') {
      return passengerInfo?.nic ?? '';
    }
    return '';
  }, [carpoolMode, driverInfo?.nic, passengerInfo?.nic]);

  const handleBlockUser = useCallback(() => {
    if (payInfo?.rStatusCheck === 'R') {
      showMessage({
        message: '결제 완료한 카풀이라서 상대방을 차단할 수 없습니다.',
      });
      return;
    }
    blockUser({
      memberId: userID as number,
      blockMId: carpoolMode === 'PASSENGER' ? driverInfo?.memberId : passengerInfo?.memberId,
    })
      .unwrap()
      .then(res => {
        if (res === '200') {
          Spinner.show();
          firestore()
            .collection('rooms')
            .doc(chatRoomInfo?.roomID)
            .get()
            .then(value => {
              const currentNumberUserInChatRoom = value?.data()?.users
                ? Object.keys(value?.data()?.users).length
                : 0;

              if (currentNumberUserInChatRoom <= 1) {
                value.ref.delete();
              } else {
                const newUsers = value?.data()?.users;
                if (my_uid && my_uid in newUsers) {
                  delete newUsers[my_uid];
                }
                value.ref
                  .update({
                    users: newUsers,
                    userCount: 1,
                  })
                  .then(() => {
                    handleSendAutomaticMessage({
                      roomID: chatRoomInfo?.roomID ?? '',
                      type:
                        carpoolMode === 'PASSENGER'
                          ? AUTO_MESSAGE_TYPE.PASSENGER_LEFT
                          : AUTO_MESSAGE_TYPE.DRIVER_LEFT,
                      driverName: driverInfo?.nic ?? '',
                      passengerName: passengerInfo?.nic ?? '',
                    });
                  });
              }
            })
            .finally(() => {
              setTimeout(() => {
                Spinner.hide();
                showMessage({
                  message: '해당 드라이버를 차단했습니다.',
                });
                navigation.goBack();
              }, 250);
            });
        }
      });
  }, [userID, payInfo?.rStatusCheck, carpoolMode, driverInfo?.memberId, passengerInfo?.memberId]);

  return (
    <FixedContainer>
      <CustomHeader
        text={getChatRoomTitle}
        rightContent={
          <Pressable hitSlop={40} onPress={() => chatActionRef?.current?.show()}>
            <Icons.Elipses />
          </Pressable>
        }
        showVerifyMark={isPassengerBusinessCard}
        onHeaderTextPress={() => {
          if (carpoolMode === 'PASSENGER') {
            navigation.navigate(ROUTE_KEY.DriverProfile, {
              driverID: chatRoomInfo?.driverID as number,
              driverName: chatRoomInfo?.title ?? '',
            });
          } else {
            navigation.navigate(ROUTE_KEY.PassengerProfile, {
              passengerID: passengerInfo?.memberId as number,
              passengerName: passengerInfo?.nic ?? '',
            });
          }
        }}
        onPressBack={() => {
          dispatch(clearChatReducer());
          navigation.goBack();
        }}
      />

      <ReservationInfo
        data={routeRequestInfo}
        messageCount={messageCount}
        passengerName={passengerInfo?.nic ?? ''}
        driverName={driverInfo?.nic ?? ''}
        chatRoomInfo={chatRoomInfo}
        userFCMToken={userFCMToken}
        temptRoute={temptRoute}
        rStatusCheck={payInfo?.rStatusCheck ?? ''}
        resId={payInfo?.id ?? 0}
        isUserLeftChat={isUserLeftChat}
        payInfo={payInfo}
      />

      <Divider />

      <KeyboardAvoidingView behavior={IS_IOS ? 'padding' : undefined} style={{flex: 1}}>
        <FlashList
          ref={listChatRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          data={listChat}
          estimatedItemSize={50}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingHorizontal: PADDING1,
            paddingTop: PADDING1,
          }}
          inverted
        />

        {payInfo?.rStatusCheck === 'C' || isUserLeftChat || chatRoomInfo?.isCancelRequest ? null : (
          <ChatInput
            userFCMToken={userFCMToken}
            onSuccess={() => {
              listChatRef?.current?.scrollToOffset({
                offset: -HEIGHT,
                animated: true,
              });
            }}
            chatRoomInfo={chatRoomInfo}
            messageCount={messageCount}
            driverName={driverInfo?.nic ?? ''}
          />
        )}
      </KeyboardAvoidingView>

      <ChatQuickAction
        ref={chatActionRef}
        onLeftChatPress={handleLeftChat}
        onCheckUserInfoPress={onCheckUserInfoPress}
        onBlockDriverPress={handleBlockUser}
      />
    </FixedContainer>
  );
});

export default ChatDetail;

const styles = StyleSheet.create({
  dayTextStyle: {
    textAlign: 'center',
    marginVertical: heightScale1(10),
  },
});
