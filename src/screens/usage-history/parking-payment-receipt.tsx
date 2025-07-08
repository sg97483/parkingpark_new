import React, {memo} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {strings} from '~constants/strings';
import WebView from 'react-native-webview';

const ParkingPaymentReceipt = memo((props: RootStackScreenProps<'ParkingPaymentReceipt'>) => {
  const {navigation, route} = props;

  const tid = route?.params?.tid;
  console.log('🚀 ~ file: parking-payment-receipt.tsx:13 ~ tid', tid);

  return (
    <FixedContainer>
      <CustomHeader text={strings?.usage_history_detail?.header} />

      <WebView
        source={{
          uri: `https://npg.nicepay.co.kr/issue/IssueLoader.do?TID=${tid}&type=0`,
        }}
        originWhitelist={['*']}
      />
    </FixedContainer>
  );
});
export default ParkingPaymentReceipt;
