import {useNavigation} from '@react-navigation/native';
import React, {memo, useEffect, useRef, useState} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {WebView, WebViewNavigation} from 'react-native-webview'; // 웹뷰 관련 타입 추가
import {WebViewMessageEvent} from 'react-native-webview/lib/WebViewTypes';
import {PADDING1} from '~constants/constant';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1, widthScale} from '~styles/scaling-utils';

interface Props {}

const AdBanners: React.FC<Props> = memo(props => {
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

    // 웹뷰 콜백 URL에서 데이터 추출
    const data = getParameterByName(url, 'data'); // 'data'는 웹페이지에서 사용한 데이터 이름에 맞게 수정

    if (data) {
      // 앱에서 데이터를 받아와서 처리
      console.log('Received data from web:', data);
    }

    //console.log('parkingBottomBanner : ', parkingBottomBanner?.);
  };

  // URL에서 GET 파라미터 추출하는 함수
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

    // data 객체에는 웹페이지에서 전달한 링크 정보가 담겨있습니다.
    const {url, parkId} = data;

    // 이후 필요한 로직을 작성하여 원하는 대로 처리합니다.

    if (url === '' && Number(parkId) === 999910) {
      // url이 빈 값이고, parkId가 999910이면 EventGame으로 이동
      navigation.navigate(ROUTE_KEY.EventGame);
    } else if (url === '') {
      // url이 빈 값이고, parkId가 그 외 값이면 ParkingDetails로 이동
      navigation.navigate(ROUTE_KEY.ParkingDetails, {
        id: Number(parkId),
      });
    } else if (url.startsWith('http')) {
      Linking.openURL(url);
      console.log('WebURL Open!!:', url);
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{uri: 'http://cafe.wisemobile.kr/imobile/valet/event_banner.php'}}
        ref={webViewRef}
        onNavigationStateChange={handleWebViewNavigation} // 웹뷰 로드 시 이벤트 핸들러
        onMessage={handleWebViewMessage} // 웹뷰에서 메시지를 받는 이벤트 핸들러
        containerStyle={styles.webview} // 스타일을 containerStyle로 적용
        style={{backgroundColor: 'transparent'}} // Add the transparent background style here
        originWhitelist={['*']}
        onShouldStartLoadWithRequest={() => true}
      />
    </View>
  );
});

export default AdBanners;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: PADDING1,
    height: heightScale1(75),
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  webview: {
    width: '100%',
    height: '100%', // 웹뷰가 container의 크기를 가지도록 설정
    borderRadius: widthScale(8),
    overflow: 'hidden', // 웹뷰의 내용이 컨테이너를 벗어나지 않도록 처리
  },
});
