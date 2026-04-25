import {AppRegistry, Dimensions, Platform} from 'react-native';
import App from './src';
import {enableScreens} from 'react-native-screens';
import {name as appName} from './app.json';
import Modal from 'react-native-modal';
import Orientation from 'react-native-orientation-locker';
import {LocaleConfig} from 'react-native-calendars';
import {configureReanimatedLogger, ReanimatedLogLevel} from 'react-native-reanimated';
import {getMessaging} from '@react-native-firebase/messaging';
import NaverLogin from '@react-native-seoul/naver-login';

// ⚠️ 중요: setBackgroundMessageHandler 는 반드시 AppRegistry.registerComponent 이전에 최상위에서 등록되어야 합니다.
// React 컴포넌트 내부(useEffect 등)에서 등록하면 iOS가 백그라운드 메시지를 전달하려는 시점에
// 아직 JS 핸들러가 등록되지 않아 RCTEventEmitter.receiveEvent 크래시(앱 즉시 종료)가 발생합니다.
getMessaging().setBackgroundMessageHandler(async () => {
  // 백그라운드 푸시 처리는 OS/알림 채널이 담당합니다. JS 레벨에서 추가 작업이 필요하면 여기 작성.
});

if (__DEV__) {
  // Reanimated strict mode can warn on `.value` access during render.
  // Disable strict warnings in development to reduce noise; runtime behavior is unchanged.
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
  });
}

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

NaverLogin.initialize({
  appName: '파킹박',
  consumerKey: 'YFo9o9INxTOezx7QNbba',
  consumerSecret: 'f6wfDAsa_f',
  serviceUrlSchemeIOS: Platform.OS === 'ios' ? 'kr.wisemobile.parking' : undefined,
});

AppRegistry.registerComponent(appName, () => App);
