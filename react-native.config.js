module.exports = {
  // 기존 설정은 그대로 유지합니다.
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/assets/fonts/'],

  // 여기에 새로운 dependencies 설정을 추가합니다.
  dependencies: {
    'react-native-mail': {
      platforms: {
        android: null, // react-native-mail의 안드로이드 자동 연결 끄기
      },
    },
    'react-native-sms': {
      platforms: {
        android: null, // react-native-sms의 안드로이드 자동 연결 끄기
      },
    },
    'react-native-webview': {
      platforms: {
        android: null,
      },
    },
  },
};
