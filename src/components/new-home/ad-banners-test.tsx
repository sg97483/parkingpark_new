import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

const BannerWebView = () => {
  const webViewRef = useRef(null);

  const handleWebViewNavigation = (event: {url: any}) => {
    const {url} = event;

    // 웹뷰 콜백 URL에서 데이터 추출
    const data = getParameterByName(url, 'data'); // 'data'는 웹페이지에서 사용한 데이터 이름에 맞게 수정

    if (data) {
      // 앱에서 데이터를 받아와서 처리
      console.log('Received data from web:', data);
    }
  };

  // URL에서 데이터 추출하는 함수
  const getParameterByName = (url: string, name: string) => {
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

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{uri: 'https://example.com/banner'}} // 웹 페이지 주소에 맞게 수정
        onNavigationStateChange={handleWebViewNavigation}
        originWhitelist={['*']}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BannerWebView;
