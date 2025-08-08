import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import NetInfo from '@react-native-community/netinfo';
import {
  NavigationContainer,
  NavigationContainerRef,
  NavigationState,
} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {DeviceEventEmitter, Linking, StatusBar} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider as ReactNativePaperProvider} from 'react-native-paper';
import {MenuProvider} from 'react-native-popup-menu';
import {SafeAreaProvider, initialWindowMetrics} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import ModalAlert from '~components/app-modal';
import ToastMessage from '~components/commons/toast-message/toast-message';
import NoInternetModal from '~components/no-internet-modal';
import Spinner from '~components/spinner';
import {IS_ANDROID, PADDING1} from '~constants/constant';
import {EMIT_EVENT, FONT_FAMILY} from '~constants/enum';
import {ROUTE_KEY} from '~navigators/router';
import Stack, {RootStackScreensParams} from '~navigators/stack';
import store, {persistor} from '~store/store';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {sleep} from './utils';
import Notification from '~components/notification';

const App = () => {
  const navigationRef = React.useRef<NavigationContainerRef<RootStackScreensParams>>(null);

  const screenTracking = (state: NavigationState | undefined) => {
    if (state) {
      const route = state?.routes[state.index];
      if (route.state) {
        screenTracking(route?.state as any);
        // return;
      }
      console.log(`====== NAVIGATING to > ${route?.name}`);
      if (route.name !== ROUTE_KEY.Home) {
        DeviceEventEmitter.emit(EMIT_EVENT.EXIT_APP);
      }
    }
  };

  const prefixes = ['https://cafe.wisemobile.kr'];
  const linking = {
    prefixes,
    subscribe(listener: (url: string) => void) {
      const onReceiveURL = async (url: string) => {
        if (!url) {
          return;
        }
        try {
          if (navigationRef.current?.getCurrentRoute()?.name === ROUTE_KEY.ParkingDetails) {
            navigationRef.current.goBack();
            await sleep(200);
          }

          // 👇 URL 파싱 방식을 안정적인 문자열 처리로 변경합니다.
          const domain = 'https://cafe.wisemobile.kr';
          let pathname = url;
          if (url.startsWith(domain)) {
            // domain 부분을 잘라내어 "/parking/123" 같은 경로만 남깁니다.
            pathname = url.substring(domain.length);
          }

          const pathParts = pathname.split('/'); // => ["", "parking", "123"]
          // 👆 여기까지 변경

          if (pathParts[1] === 'parking' && pathParts[2]) {
            const parkingId = parseInt(pathParts[2], 10);
            if (!isNaN(parkingId)) {
              navigationRef.current?.navigate(ROUTE_KEY.ParkingDetails, {
                id: parkingId,
              });
            }
          }
        } catch (e) {
          console.error('[DeepLink] URL 파싱 에러:', e);
        }
        listener(url);
      };

      const subscription = Linking.addEventListener('url', ({url}) => onReceiveURL(url));

      return () => {
        subscription.remove();
      };
    },
    async getInitialURL() {
      // 앱이 꺼져있을 때 링크로 실행되면 초기 URL을 가져옵니다.
      const initialURL = await Linking.getInitialURL();
      return initialURL;
    },
  };

  NetInfo.addEventListener(state => {
    const offline = !(state.isConnected && state.isInternetReachable);
    if (offline) {
      NoInternetModal.show();
    } else {
      NoInternetModal.hide();
    }
  });

  useEffect(() => {
    if (IS_ANDROID) {
      StatusBar.setTranslucent(true);
      //StatusBar.setBackgroundColor(colors.transparent);
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{flex: 1}}>
          <BottomSheetModalProvider>
            <ReactNativePaperProvider>
              <MenuProvider>
                <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                  <NavigationContainer
                    ref={navigationRef}
                    linking={linking}
                    onStateChange={screenTracking}>
                    <Spinner />
                    <NoInternetModal />
                    <FlashMessage
                      position={'center'}
                      floating
                      color={colors.white}
                      style={{
                        marginLeft: PADDING1,
                        marginRight: PADDING1,
                        backgroundColor: '#333333CC',
                        justifyContent: 'center',
                        minWidth: widthScale1(310),
                      }}
                      titleStyle={{
                        fontFamily: FONT_FAMILY.REGULAR,
                        fontSize: fontSize1(14),
                        textAlign: 'center',
                        lineHeight: heightScale1(20),
                      }}
                    />
                    <Stack />
                    <Notification />
                    <ModalAlert />
                    <ToastMessage />
                  </NavigationContainer>
                </SafeAreaProvider>
              </MenuProvider>
            </ReactNativePaperProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
};

export default App;
