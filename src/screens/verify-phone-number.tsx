import React, {memo, useRef} from 'react';
import {ActivityIndicator, View} from 'react-native';
import WebView from 'react-native-webview';
import FixedContainer from '~components/fixed-container';
import {VERIFY_PHONE_NUMBER_WEBVIEW_URL} from '~constants/constant';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';

const VerifyPhoneNumber = memo((props: RootStackScreenProps<'VerifyPhoneNumber'>) => {
  const {navigation, route} = props;

  const webviewRef = useRef<WebView>(null);

  const jsCode = 'window.ReactNativeWebView.postMessage(document.documentElement.innerText)';

  const handleSuccess = (value: string) => {
    const newArray = value?.replace('[plaindata] ', '').split(':');
    route?.params?.onReturn(newArray[18].substring(0, newArray[18]?.length - 1));
    navigation.canGoBack() && navigation.goBack();
  };

  return (
    <FixedContainer>
      <WebView
        ref={webviewRef}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={{flex: 1}}>
            <ActivityIndicator color={colors.red} />
          </View>
        )}
        source={{
          uri: VERIFY_PHONE_NUMBER_WEBVIEW_URL,
        }}
        onMessage={event => {
          if (event?.nativeEvent?.data) {
            handleSuccess(event?.nativeEvent?.data);
          }
        }}
        javaScriptEnabled
        onLoadEnd={e => {
          if (
            e?.nativeEvent?.url ===
            'https://cafe.wisemobile.kr/imobile/check/check_pnum_success_android_t.php'
          ) {
            webviewRef?.current?.injectJavaScript(jsCode);
          }
        }}
        originWhitelist={['*']}
      />
    </FixedContainer>
  );
});

export default VerifyPhoneNumber;
