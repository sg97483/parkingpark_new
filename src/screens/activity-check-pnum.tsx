import React, {memo, useRef} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import FixedContainer from '~components/fixed-container';
import {VERIFY_PHONE_NUMBER_WEBVIEW_URL} from '~constants/constant';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';

const ActivityCheckPnum = memo((props: RootStackScreenProps<'ActivityCheckPnum'>) => {
  const {navigation, route} = props;
  const webviewRef = useRef<WebView>(null);

  const jsCode = 'window.ReactNativeWebView.postMessage(document.documentElement.innerText)';

  const handleSuccess = (value: string) => {
    const newArray = value?.replace('[plaindata] ', '').split(':');
    const pnum = newArray[18].substring(0, newArray[18]?.length - 1);

    navigation.navigate(ROUTE_KEY.FindPassword, {
      phoneNumber: pnum,
    });
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
        cacheMode={'LOAD_NO_CACHE'}
        source={{
          uri: VERIFY_PHONE_NUMBER_WEBVIEW_URL,
        }}
        onMessage={(event: WebViewMessageEvent) => {
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

export default ActivityCheckPnum;

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});
