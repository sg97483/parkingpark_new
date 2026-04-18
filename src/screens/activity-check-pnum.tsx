import React, {memo, useRef} from 'react';
import {View, StyleSheet, ActivityIndicator, Linking, Platform} from 'react-native';
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
  const successUrl = 'https://cafe.wisemobile.kr/imobile/check/check_pnum_success_android_t.php';

  const handleAppLink = async (url: string) => {
    if (Platform.OS !== 'android') {
      return false;
    }

    if (
      url.startsWith('intent:') ||
      url.startsWith('intent://') ||
      url.startsWith('market:') ||
      url.startsWith('market://')
    ) {
      try {
        console.log('[ActivityCheckPnum] Trying openURL:', url);
        await Linking.openURL(url);
        console.log('[ActivityCheckPnum] openURL succeeded:', url);
      } catch (e) {
        console.log('[ActivityCheckPnum] Linking.openURL failed:', url, e);

        if (url.startsWith('intent:') || url.startsWith('intent://')) {
          const dataPart = url.includes('#Intent')
            ? url.split('#Intent')[0].replace(/^intent:\/\//, '').replace(/^intent:/, '')
            : url.replace(/^intent:\/\//, '').replace(/^intent:/, '');

          const schemeMatch = url.match(/;scheme=([^;]+);/);
          const packageMatch = url.match(/;package=([^;]+);/);
          const scheme = schemeMatch?.[1] ?? '';
          const pkg = packageMatch?.[1] ?? '';

          if (scheme) {
            const converted = `${scheme}://${dataPart}`;
            try {
              console.log('[ActivityCheckPnum] Trying converted deeplink:', converted);
              await Linking.openURL(converted);
              console.log('[ActivityCheckPnum] Converted deeplink succeeded:', converted);
              return true;
            } catch (e2) {
              console.log('[ActivityCheckPnum] Converted deeplink open failed:', converted, e2);
            }
          }

          if (pkg) {
            const marketUrl = `market://details?id=${pkg}`;
            try {
              console.log('[ActivityCheckPnum] Trying market url:', marketUrl);
              await Linking.openURL(marketUrl);
              console.log('[ActivityCheckPnum] Market url succeeded:', marketUrl);
              return true;
            } catch (e3) {
              console.log('[ActivityCheckPnum] Market open failed:', marketUrl, e3);
            }
          }
        }
      }
      return true;
    }

    return false;
  };

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
        domStorageEnabled
        onShouldStartLoadWithRequest={req => {
          const url = req?.url ?? '';
          console.log('[ActivityCheckPnum] onShouldStartLoadWithRequest:', url);

          handleAppLink(url);
          if (
            Platform.OS === 'android' &&
            (url.startsWith('intent:') ||
              url.startsWith('intent://') ||
              url.startsWith('market:') ||
              url.startsWith('market://'))
          ) {
            return false;
          }

          return true;
        }}
        onMessage={(event: WebViewMessageEvent) => {
          if (event?.nativeEvent?.data) {
            handleSuccess(event?.nativeEvent?.data);
          }
        }}
        javaScriptEnabled
        onLoadEnd={e => {
          const url = e?.nativeEvent?.url ?? '';
          console.log('[ActivityCheckPnum] onLoadEnd:', url);
          if (
            url === successUrl ||
            url.includes('check_pnum_success_android_t.php')
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
