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

const AdBannersEvent: React.FC<Props> = memo(props => {
  const navigation: UseRootStackNavigation = useNavigation();
  const webViewRef = useRef(null);
  const [index, setIndex] = useState<number>(0);

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
    const data = JSON.parse(event.nativeEvent.data);
    const {url, parkId} = data;

    if (url === '') {
      navigation.navigate(ROUTE_KEY.ParkingDetails, {id: Number(parkId)});
    } else {
      if (url.startsWith('http')) {
        Linking.openURL(url);
        return false;
      }
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{uri: 'http://cafe.wisemobile.kr/imobile/valet/event_banner_new.php'}}
        ref={webViewRef}
        onNavigationStateChange={handleWebViewNavigation}
        onMessage={handleWebViewMessage}
        style={styles.webview} // 스타일을 style로 적용
        originWhitelist={['*']}
      />
    </View>
  );
});

export default AdBannersEvent;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0, // 좌우 여백 제거
    padding: 0, // padding 제거
    height: heightScale1(500),
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
    flex: 1, // 부모 컨테이너 크기에 맞추기
    borderRadius: widthScale(0),
    overflow: 'hidden',
  },
});
