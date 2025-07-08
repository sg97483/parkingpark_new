import {useNavigation} from '@react-navigation/native';
import React, {memo, useEffect, useRef, useState} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {WebView, WebViewNavigation} from 'react-native-webview';
import {WebViewMessageEvent} from 'react-native-webview/lib/WebViewTypes';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1, widthScale} from '~styles/scaling-utils';

interface Props {}

const HotPlaceBanner: React.FC<Props> = memo(props => {
  const navigation: UseRootStackNavigation = useNavigation();
  const webViewRef = useRef(null);
  const [index, setIndex] = useState<number>(0);
  const [webViewHeight, setWebViewHeight] = useState<number>(heightScale1(1800)); // 초기 높이

  useEffect(() => {
    const timer = setInterval(() => {
      if (index < 11) {
        setIndex(index + 1);
      }
      if (index === 11) {
        setIndex(0);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [index]);

  const handleWebViewNavigation = (event: WebViewNavigation) => {
    const {url} = event;
    const data = getParameterByName(url, 'data');
    if (data) {
      console.log('Received data from web:', data);
    }
  };

  const getParameterByName = (url: string, name: string): string | null => {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  };

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data && data.type === 'setHeight') {
        setWebViewHeight(Number(data.height)); // WebView 높이 조정
      } else {
        const {url, parkId} = data;

        if (url === '') {
          navigation.navigate(ROUTE_KEY.ParkingDetails, {id: Number(parkId)});
        } else if (url === 'parkingshare') {
          navigation.navigate(ROUTE_KEY.RegisterParkingShared);
        } else {
          if (url.startsWith('http')) {
            Linking.openURL(url);
            return false;
          }
        }
      }
    } catch (error) {
      console.error('Error parsing message from WebView:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{uri: 'http://cafe.wisemobile.kr/imobile/valet/hotplace_banner.php'}}
        ref={webViewRef}
        onNavigationStateChange={handleWebViewNavigation}
        onMessage={handleWebViewMessage}
        style={[styles.webview, {height: webViewHeight}]}
        originWhitelist={['*']}
        scrollEnabled={true} // 스크롤 활성화
        injectedJavaScript={`
          (function() {
            function updateHeight() {
              var contentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
              var maxHeight = 1800; // 원하는 최대 높이 값
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'setHeight', height: Math.min(contentHeight, maxHeight) }));
            }
            setInterval(updateHeight, 0); // 0.5초마다 높이 업데이트
          })();
        `}
      />
    </View>
  );
});

export default HotPlaceBanner;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    padding: 0,
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 0,
    elevation: 5,
  },
  webview: {
    flex: 1,
    borderRadius: widthScale(0),
    overflow: 'hidden',
  },
});
