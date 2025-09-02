import React, {memo} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {strings} from '~constants/strings';
import WebView from 'react-native-webview';

const ParkingPaymentReceipt2 = memo((props: RootStackScreenProps<'ParkingPaymentReceipt2'>) => {
  const {navigation, route} = props;

  const tid = route?.params?.tid;
  console.log('🚀 ~ file: parking-payment-receipt2.tsx:13 ~ tid', tid);

  return (
    <FixedContainer>
      <CustomHeader text={strings?.usage_history_detail?.header} />

      <WebView
        source={{
          uri: `http://cafe.wisemobile.kr/imobile/pay_lite/email_receipt_form.php?pid=${tid}`,
        }}
        originWhitelist={['*']}
      />
    </FixedContainer>
  );
});
export default ParkingPaymentReceipt2;
