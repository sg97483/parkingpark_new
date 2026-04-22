import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, DeviceEventEmitter, Linking, Platform, View} from 'react-native';
import WebView from 'react-native-webview';
import FixedContainer from '~components/fixed-container';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';
import API from '~services/api';
import {showMessage} from 'react-native-flash-message';
import {EMIT_EVENT} from '~constants/enum';

const VerifyPhoneNumber = memo((props: RootStackScreenProps<'VerifyPhoneNumber'>) => {
  const {navigation, route} = props;

  const webviewRef = useRef<WebView>(null);

  const [isBooting, setIsBooting] = useState<boolean>(true);
  const [authUrl, setAuthUrl] = useState<string>('');
  const [requestNo, setRequestNo] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');

  // 백엔드 구현 기준(return/close 콜백 URL)
  const returnUrl = useMemo(() => 'https://cafe.wisemobile.kr:8080/nice/intc/return', []);
  const closeUrl = useMemo(() => 'https://cafe.wisemobile.kr:8080/nice/intc/close', []);

  const parseWebTransactionId = useCallback((url: string): string => {
    // return_url로 web_transaction_id가 쿼리로 붙어온다고 가정
    const match = url.match(/[?&]web_transaction_id=([^&]+)/);
    return match?.[1] ? decodeURIComponent(match[1]) : '';
  }, []);

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

  const fetchAuthUrl = useCallback(async () => {
    setIsBooting(true);
    try {
      const res = await API.post('nice/intc/auth-url', {
        return_url: returnUrl,
        close_url: closeUrl,
        svc_types: ['M'],
        method_type: 'GET',
        exp_mods: ['closeButtonOn'],
      });

      if (__DEV__) {
        console.log('[VerifyPhoneNumber] auth-url http', {
          status: (res as any)?.status,
          responseURL: (res as any)?.request?.responseURL,
          data: res?.data,
        });
      }

      // 백엔드 응답 키 이름이 다를 수 있어 최대한 유연하게 파싱합니다.
      const payload: any = res?.data ?? {};
      const data: any = payload?.data ?? payload?.result ?? payload ?? {};

      const url =
        payload?.auth_url ||
        data?.auth_url ||
        payload?.authUrl ||
        data?.authUrl ||
        payload?.url ||
        data?.url ||
        '';
      const reqNo =
        payload?.request_no ||
        data?.request_no ||
        payload?.requestNo ||
        data?.requestNo ||
        payload?.reqNo ||
        data?.reqNo ||
        '';
      const txId =
        payload?.transaction_id ||
        data?.transaction_id ||
        payload?.transactionId ||
        data?.transactionId ||
        payload?.txId ||
        data?.txId ||
        '';

      if (!url || !reqNo || !txId) {
        if (__DEV__) {
          console.log('[VerifyPhoneNumber] auth-url response missing fields', {
            auth_url: url,
            request_no: reqNo,
            transaction_id: txId,
            raw: res?.data,
          });
        }
        showMessage({message: '본인인증 URL을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'});
        navigation.canGoBack() && navigation.goBack();
        return;
      }

      setAuthUrl(String(url));
      setRequestNo(String(reqNo));
      setTransactionId(String(txId));
    } catch (e) {
      showMessage({message: '본인인증을 시작할 수 없습니다. 네트워크 상태를 확인해주세요.'});
      navigation.canGoBack() && navigation.goBack();
    } finally {
      setIsBooting(false);
    }
  }, [closeUrl, navigation, returnUrl]);

  const fetchResultAndFinish = useCallback(
    async (webTransactionId: string) => {
      if (!webTransactionId || !requestNo || !transactionId) {
        return;
      }
      try {
        const res = await API.post('nice/intc/auth-result', {
          web_transaction_id: webTransactionId,
          request_no: requestNo,
          transaction_id: transactionId,
        });

        const phone =
          res?.data?.phone ||
          res?.data?.mobile ||
          res?.data?.mobile_no ||
          res?.data?.data?.phone ||
          res?.data?.data?.mobile ||
          res?.data?.data?.mobile_no ||
          '';

        if (!phone) {
          showMessage({message: '본인인증 결과를 확인할 수 없습니다. 다시 시도해주세요.'});
          navigation.canGoBack() && navigation.goBack();
          return;
        }

        DeviceEventEmitter.emit(EMIT_EVENT.VERIFY_PHONE_NUMBER_DONE, String(phone));
        navigation.canGoBack() && navigation.goBack();
      } catch {
        showMessage({message: '본인인증 결과 처리 중 오류가 발생했습니다. 다시 시도해주세요.'});
        navigation.canGoBack() && navigation.goBack();
      }
    },
    [navigation, requestNo, route?.params, transactionId],
  );

  const handleSuccess = useCallback(
    (value: string) => {
      const newArray = value?.replace('[plaindata] ', '').split(':');
      const phone = newArray?.[18]?.substring(0, newArray?.[18]?.length - 1) ?? '0';
      route?.params?.onReturn(phone);
      navigation.canGoBack() && navigation.goBack();
    },
    [navigation, route?.params],
  );

  useEffect(() => {
    fetchAuthUrl();
  }, [fetchAuthUrl]);

  return (
    <FixedContainer>
      {isBooting || !authUrl ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator color={colors.red} />
        </View>
      ) : (
        <WebView
          ref={webviewRef}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={{flex: 1}}>
              <ActivityIndicator color={colors.red} />
            </View>
          )}
          source={{
            uri: authUrl,
          }}
          domStorageEnabled
          onShouldStartLoadWithRequest={req => {
            const url = req?.url ?? '';
            if (__DEV__) {
              // PASS intent/deeplink 디버깅용
              if (
                url.startsWith('intent:') ||
                url.startsWith('intent://') ||
                url.startsWith('market:') ||
                url.startsWith('market://')
              ) {
                console.log('[VerifyPhoneNumber] onShouldStartLoadWithRequest:', url);
              }
            }

            // S2S 표준창 완료/닫기 콜백
            if (url.startsWith(returnUrl) || url.includes('web_transaction_id=')) {
              const webTransactionId = parseWebTransactionId(url);
              fetchResultAndFinish(webTransactionId);
              return false;
            }
            if (url.startsWith(closeUrl)) {
              navigation.canGoBack() && navigation.goBack();
              return false;
            }

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
          onHttpError={e => {
            console.log('[VerifyPhoneNumber] onHttpError:', {
              url: e?.nativeEvent?.url,
              statusCode: e?.nativeEvent?.statusCode,
              description: e?.nativeEvent?.description,
            });
          }}
          onError={e => {
            console.log('[VerifyPhoneNumber] onError:', {
              url: e?.nativeEvent?.url,
              description: e?.nativeEvent?.description,
              domain: (e?.nativeEvent as any)?.domain,
              code: (e?.nativeEvent as any)?.code,
            });
          }}
          onMessage={event => {
            if (event?.nativeEvent?.data) {
              handleSuccess(event?.nativeEvent?.data);
            }
          }}
          javaScriptEnabled
          originWhitelist={['*']}
        />
      )}
    </FixedContainer>
  );
});

export default VerifyPhoneNumber;
