import notifee, {EventType} from '@notifee/react-native';
import {getMessaging} from '@react-native-firebase/messaging';
import {StackActions, useNavigation} from '@react-navigation/native';
import {memo, useEffect, useState} from 'react';
import {DeviceEventEmitter} from 'react-native';
import {AUTO_MESSAGE_TYPE, EMIT_EVENT} from '~constants/enum';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {updateNotificationData} from '~reducers/userReducer';
import {NotiBodyModel} from '~services/notiServices';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {displayNotification} from '~utils/notifeeUtil';

function tryParseJson<T = any>(value: unknown): T | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    return undefined;
  }
}

const Notification = () => {
  const [channelID, setChannelID] = useState<string>('');
  const idChatRoom = useAppSelector(state => state.chatReducer.idChatRoom);
  const currentScreen = useAppSelector(state => state?.userReducer?.currentScreen);
  const notificationData = useAppSelector(state => state.userReducer.notificationData);
  const navigation = useNavigation<UseRootStackNavigation>();
  const dispatch = useAppDispatch();

  const handleNavOnNotification = (notiData: NotiBodyModel) => {
    const formatedChatRoomData = tryParseJson(notiData?.chatRoomData);

    if (formatedChatRoomData) {
      if (currentScreen === ROUTE_KEY.ChatDetail) {
        navigation.dispatch(
          StackActions.replace(ROUTE_KEY.ChatDetail, {
            currentChatRoomInfo: formatedChatRoomData,
          }),
        );
        dispatch(updateNotificationData(undefined));
        return;
      }

      navigation.navigate(ROUTE_KEY.ChatDetail, {
        currentChatRoomInfo: formatedChatRoomData,
      });

      dispatch(updateNotificationData(undefined));

      return;
    }

    if (notiData?.type === AUTO_MESSAGE_TYPE.CARPOOL_RUNNING) {
      if (typeof notiData?.carpool === 'string') {
        const parsed = tryParseJson(notiData?.carpool);
        if (!parsed) {
          dispatch(updateNotificationData(undefined));
          return;
        }
        navigation.navigate(ROUTE_KEY.Running, {
          item: parsed,
        });
        dispatch(updateNotificationData(undefined));
        return;
      }
    }

    if (
      notiData?.driverId &&
      notiData?.resId &&
      notiData?.type === AUTO_MESSAGE_TYPE.CARPOOL_COMPLETED
    ) {
      navigation.navigate(ROUTE_KEY.Evaluation, {
        driverID: Number(notiData?.driverId),
        resId: Number(notiData?.resId),
      });
      dispatch(updateNotificationData(undefined));
      return;
    }

    dispatch(updateNotificationData(undefined));
  };

  const initNoti = async () => {
    await notifee.requestPermission();
    const newChannelID = await notifee.createChannel({
      id: 'DRIVE_ME_CHANEL',
      name: 'PARKING PARK NOTIFICATION CHANEL',
      sound: 'default',
    });
    setChannelID(newChannelID);
  };

  useEffect(() => {
    initNoti();
  }, []);

  useEffect(() => {
    // Notification listener
    const unsubscribe = getMessaging().onMessage(message => {
      let chat_room_info_current: any = '';
      if (typeof message?.data?.chatRoomData === 'string') {
        chat_room_info_current = tryParseJson(message.data.chatRoomData) ?? '';
      } else if (typeof message?.data?.chatRoomData === 'object') {
        chat_room_info_current = message.data.chatRoomData;
      } else {
        chat_room_info_current = '';
      }

      let type: any = '';
      if (typeof message?.data?.type === 'string') {
        type = tryParseJson(message.data.type) ?? '';
      } else if (typeof message?.data?.type === 'object') {
        type = message.data.type;
      } else {
        type = '';
      }

      if (type === AUTO_MESSAGE_TYPE.CARPOOL_RUNNING) {
        setTimeout(() => {
          DeviceEventEmitter.emit(EMIT_EVENT.CARPOOL_RUNNING);
        }, 500);
      }

      if (type === AUTO_MESSAGE_TYPE.CARPOOL_COMPLETED) {
        setTimeout(() => {
          DeviceEventEmitter.emit(EMIT_EVENT.CARPOOL_COMPLETED);
        }, 500);
      }

      if (type === AUTO_MESSAGE_TYPE.DRIVER_CHANGE_AMOUNT) {
        setTimeout(() => {
          DeviceEventEmitter.emit(EMIT_EVENT.REFETCH_DATA_CARPOOL);
        }, 500);
      }

      if (type === AUTO_MESSAGE_TYPE.PASSENGER_CANCEL_PAYMENT) {
        setTimeout(() => {
          DeviceEventEmitter.emit(EMIT_EVENT.PASSENGER_CANCEL_PAYMENT);
        }, 500);
      }

      if (type === AUTO_MESSAGE_TYPE.DRIVER_CANCEL_PAYMENT) {
        setTimeout(() => {
          DeviceEventEmitter.emit(EMIT_EVENT.DRIVER_CANCEL_PAYMENT);
        }, 500);
      }

      if (message && (type || idChatRoom !== chat_room_info_current?.roomID)) {
        displayNotification(message, channelID);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [idChatRoom, channelID]);

  useEffect(() => {
    // NOTE: setBackgroundMessageHandler 는 index.js 최상단에서 등록합니다.
    // 여기서는 포그라운드/tap-to-open 관련 핸들러만 등록합니다.
    getMessaging().onNotificationOpenedApp(message => {
      const notiData = message?.data as NotiBodyModel;
      dispatch(updateNotificationData(notiData));
    });

    getMessaging()
      .getInitialNotification()
      .then(initialNotification => {
        const notiData = initialNotification?.data as NotiBodyModel;
        dispatch(updateNotificationData(notiData));
      });
  }, [dispatch, updateNotificationData]);

  useEffect(() => {
    //Notification in foreground
    notifee.onForegroundEvent(({type, detail}) => {
      const notiData = detail?.notification?.data as NotiBodyModel;

      if (type === EventType.PRESS) {
        dispatch(updateNotificationData(notiData));
      }
    });

    // Notification in background
    notifee.onBackgroundEvent(async () => {});
  }, [dispatch, updateNotificationData]);

  useEffect(() => {
    if (
      notificationData &&
      currentScreen !== ROUTE_KEY.Splash &&
      currentScreen !== ROUTE_KEY.TutorialSlider &&
      currentScreen !== ROUTE_KEY.PermissionActivity
    ) {
      handleNavOnNotification(notificationData);
    }
  }, [currentScreen, notificationData]);

  return null;
};

export default memo(Notification);
