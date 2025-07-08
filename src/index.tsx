import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import NetInfo from '@react-native-community/netinfo';
import {getDynamicLinks} from '@react-native-firebase/dynamic-links';
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

  const prefixes = ['https://wisemobileapplink.page.link'];
  const linking = {
    prefixes,
    subscribe(listener: any) {
      try {
        const onReceiveURL = async ({url}: {url: string}) => {
          if (navigationRef.current?.getCurrentRoute()?.name === ROUTE_KEY.ParkingDetails) {
            navigationRef.current.goBack();
            await sleep(200);
          }
          navigationRef?.current?.navigate(ROUTE_KEY.ParkingDetails, {
            id: parseInt(url?.split('=')[1], 10),
          });
          return listener(url);
        };
        const dynamicLinksListener = getDynamicLinks().onLink((link: any) => {
          return onReceiveURL(link);
        });
        const sub = Linking.addEventListener('url', link => {
          if (link.url.startsWith('/link')) {
            return;
          }
          onReceiveURL(link);
        });

        return () => {
          dynamicLinksListener();
          sub.remove();
        };
      } catch (error) {}
    },
    async getInitialURL() {
      const dynamicLinkInitialURL = await getDynamicLinks().getInitialLink();
      if (dynamicLinkInitialURL?.url) {
        return dynamicLinkInitialURL?.url;
      }
      const initialURL = await Linking.getInitialURL();
      if (!initialURL || initialURL.startsWith('/link')) {
        return;
      }
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
