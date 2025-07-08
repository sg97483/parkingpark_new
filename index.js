import {AppRegistry, Dimensions} from 'react-native';
import App from './src';
import {enableScreens} from 'react-native-screens';
import {name as appName} from './app.json';
import Modal from 'react-native-modal';
import {getDynamicLinks} from '@react-native-firebase/dynamic-links';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_KEY} from './src/constants/enum';
import Orientation from 'react-native-orientation-locker';
import {LocaleConfig} from 'react-native-calendars';

LocaleConfig.locales.ko = {
  monthNames: [
    '일월',
    '이월',
    '삼월',
    '사월',
    '오월',
    '유월',
    '칠월',
    '팔월',
    '구월',
    '시월',
    '십일월',
    '십이월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

Orientation.lockToPortrait();
enableScreens();
let {width, height} = Dimensions.get('screen');
Modal.defaultProps.deviceWidth = Math.min(width, height);
Modal.defaultProps.deviceHeight = Math.max(width, height);
Modal.defaultProps.statusBarTranslucent = true;
Modal.defaultProps.backdropTransitionOutTiming = 0;
Modal.defaultProps.hideModalContentWhileAnimating = true;

getDynamicLinks()
  .getInitialLink()
  .then(async res => {
    await AsyncStorage.setItem(ASYNC_STORAGE_KEY.DEEP_LINK, res ? JSON.stringify(res) : '');
  });

AppRegistry.registerComponent(appName, () => App);
