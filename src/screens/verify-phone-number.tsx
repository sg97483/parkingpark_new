import React, {memo, useRef} from 'react';
import {ActivityIndicator, Linking, Platform, View} from 'react-native';
import WebView from 'react-native-webview';
import FixedContainer from '~components/fixed-container';
import {VERIFY_PHONE_NUMBER_WEBVIEW_URL} from '~constants/constant';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';

const VerifyPhoneNumber = memo((props: RootStackScreenProps<'VerifyPhoneNumber'>) => {
  const {navigation, route} = props;

  const webviewRef = useRef<WebView>(null);

  const jsCode = 'window.ReactNativeWebView.postMessage(document.documentElement.innerText)';
  const successUrl = 'https://cafe.wisemobile.kr/imobile/check/check_pnum_success_android_t.php';

  const handleAppLink = async (url: string) => {
    if (Platform.OS !== 'android') {
      return false;
    }

    // PASS(AppLink)에서 주로 쓰는 스킴들 (intent/market)
    if (
      url.startsWith('intent:') ||
      url.startsWith('intent://') ||
      url.startsWith('market:') ||
      url.startsWith('market://')
    ) {
      try {
        console.log('[VerifyPhoneNumber] Trying openURL:', url);
        await Linking.openURL(url);
        console.log('[VerifyPhoneNumber] openURL succeeded:', url);
      } catch (e) {
        console.log('[VerifyPhoneNumber] Linking.openURL failed:', url, e);

        // intent://...#Intent;scheme=xxx;package=yyy;end 형태를 보강 처리
        // 1) scheme 기반으로 실제 deeplink URL로 변환해 재시도
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
              console.log('[VerifyPhoneNumber] Trying converted deeplink:', converted);
              await Linking.openURL(converted);
              console.log('[VerifyPhoneNumber] Converted deeplink succeeded:', converted);
              return true;
            } catch (e2) {
              console.log('[VerifyPhoneNumber] Converted deeplink open failed:', converted, e2);
            }
          }

          // 2) 그래도 실패하면 스토어로 이동
          if (pkg) {
            const marketUrl = `market://details?id=${pkg}`;
            try {
              console.log('[VerifyPhoneNumber] Trying market url:', marketUrl);
              await Linking.openURL(marketUrl);
              console.log('[VerifyPhoneNumber] Market url succeeded:', marketUrl);
              return true;
            } catch (e3) {
              console.log('[VerifyPhoneNumber] Market open failed:', marketUrl, e3);
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
        domStorageEnabled
        onShouldStartLoadWithRequest={req => {
          const url = req?.url ?? '';
          console.log('[VerifyPhoneNumber] onShouldStartLoadWithRequest:', url);

          // 외부 앱 실행이 필요한 deeplink는 WebView 로드를 중단
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
        onMessage={event => {
          if (event?.nativeEvent?.data) {
            handleSuccess(event?.nativeEvent?.data);
          }
        }}
        javaScriptEnabled
        onLoadEnd={e => {
          const url = e?.nativeEvent?.url ?? '';
          console.log('[VerifyPhoneNumber] onLoadEnd:', url);
          if (
            url === successUrl ||
            // 쿼리스트링이 붙는 경우도 있어서 includes로 보강
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

export default VerifyPhoneNumber;
