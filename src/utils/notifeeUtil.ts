import notifee, {AndroidImportance} from '@notifee/react-native';
import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';

export const displayNotification = async (
  message: FirebaseMessagingTypes.RemoteMessage,
  channelId?: string,
) => {
  await notifee.displayNotification({
    title: message?.notification?.title,
    body: message?.notification?.body,
    data: message?.data,
    android: {
      channelId: channelId,
      sound: 'default',
      importance: AndroidImportance.HIGH,
    },
    ios: {
      sound: 'default',
    },
  });
};
