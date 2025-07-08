import {PERMISSIONS, RESULTS, request, checkNotifications} from 'react-native-permissions';
import {IS_IOS} from '~constants/constant';
import {getMessaging, AuthorizationStatus} from '@react-native-firebase/messaging';
import {Platform} from 'react-native';

export const checkNotificationPermission = () => {
  return new Promise<boolean>((resolve, reject) => {
    checkNotifications()
      .then(({status}) => {
        if (status === 'granted') {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const requestNotificationPermissions = () => {
  return new Promise((resole, reject) => {
    if (IS_IOS) {
      getMessaging()
        .requestPermission()
        .then(value => {
          if (
            value === AuthorizationStatus.AUTHORIZED ||
            value === AuthorizationStatus.PROVISIONAL
          ) {
            resole(true);
          } else {
            reject(false);
          }
        })
        .catch(() => {
          reject(false);
        });
    } else {
      if (Number(Platform.Version) >= 33) {
        request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
          .then(value => {
            if (value === RESULTS.GRANTED) {
              resole(true);
            } else {
              reject(false);
            }
          })
          .catch(() => {
            reject(false);
          });
      } else {
        resole(true);
      }
    }
  });
};
