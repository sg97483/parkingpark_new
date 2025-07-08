import {StyleSheet} from 'react-native';
import React, {memo} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import WebView from 'react-native-webview';
import {ROUTE_KEY} from '~navigators/router';

const FindPassword = memo((props: RootStackScreenProps<'FindPassword'>) => {
  const {navigation, route} = props;

  const phoneNumber = route?.params?.phoneNumber;

  return (
    <FixedContainer>
      <CustomHeader text="개인정보 수정" />
      <WebView
        source={{
          uri: `http://cafe.wisemobile.kr/imobile/valet/and_pass.php?pnum=${phoneNumber}`,
        }}
        style={styles.container}
        javaScriptEnabled
        onLoadEnd={data => {
          if (data?.nativeEvent?.canGoBack) {
            navigation.reset({
              index: 0,
              routes: [{name: ROUTE_KEY.ParkingParkHome}, {name: ROUTE_KEY.Login}],
            });
          }
        }}
        originWhitelist={['*']}
      />
    </FixedContainer>
  );
});

export default FindPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
