import {Alert, DeviceEventEmitter, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {PADDING} from '~constants/constant';
import CustomText from '~components/custom-text';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import TitleMoney from '~components/deposit-money/title-money';
import {heightScale, widthScale} from '~styles/scaling-utils';
import IconExclamation from '~components/icon-exclamation';
import {colors} from '~styles/colors';
import Button from '~components/button';
import {RootStackScreenProps} from '~navigators/stack';
import {getNumberWithCommas} from '~utils/numberUtils';
import {useAppSelector} from '~store/storeHooks';
import {useDepositMoneyMutation} from '~services/couponServices';
import {showMessage} from 'react-native-flash-message';
import WebView from 'react-native-webview';
import {ROUTE_KEY} from '~navigators/router';
import moment from 'moment';

const ConfirmDepositMoney = (props: RootStackScreenProps<'ConfirmDepositMoney'>) => {
  const {navigation, route} = props;
  const userToken = useAppSelector(state => state?.userReducer?.userToken);
  const money = route.params?.money * 10000;
  const [depositMoney] = useDepositMoneyMutation();
  const [showWebviewPointInsert, setShowWebviewPointInsert] = useState<boolean>(false);
  const [showWebview, setShowWebview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = () => {
    setIsLoading(true);
    const body = {
      edDtm: moment().format('YYYYMMDDHHmm'),
      stDtm: moment().format('YYYYMMDDHHmm'),
      memberId: userToken?.id,
      memberPwd: userToken?.password,
      payAmt: `${money}`,
      TotalTicketType: `${money / 10000}만원 충전권`,
    };
    depositMoney(body)
      .unwrap()
      .then(res => {
        if (res?.statusCode === '500') {
          Alert.alert('', res?.statusMsg);
        } else {
          setShowWebviewPointInsert(true);
        }
      });
  };

  return (
    <FixedContainer>
      <CustomHeader text="충전금확인" />
      <View style={styles.view}>
        <CustomText
          string="충전 금액을 확인해주세요."
          family={FONT_FAMILY.BOLD}
          size={FONT.TITLE_2}
        />
        <View style={styles.viewTop1}>
          <TitleMoney title={'충전금'} money={`${getNumberWithCommas(money / 50 + money)}원`} />
          <TitleMoney title={'적립금'} money={`${getNumberWithCommas(money / 100)}원`} />
        </View>

        <TitleMoney main title={'결제금액'} money={`${getNumberWithCommas(money)}원`} />
        <View style={styles.viewBottom}>
          <IconExclamation />
          <View>
            <CustomText
              textStyle={styles.text}
              size={FONT.CAPTION}
              string={
                '충전후 60% 이상 남아있어야만 환불 가능\n(환불시 추가 3%에 해당하는 충전금 차감처리)\n1년이 지난 충전금에 대해서는 사용은 가능.\n환불은 불가하며, 2년이 지난 충전금은 자동 소멸됩니다.'
              }
            />
            <CustomText
              textStyle={styles.text1}
              size={FONT.CAPTION}
              color={colors.redButton}
              string={'자세한 충전금안내 및 규정(보기)'}
            />
          </View>
        </View>
      </View>
      <Button text="충전하기" onPress={handleSubmit} style={styles.button} disable={isLoading} />

      {showWebviewPointInsert ? (
        <WebView
          source={{
            uri: `http://cafe.wisemobile.kr/imobile/pay_lite/pointInsert.php?mmid=${userToken?.id}&selectedDate=null&totalPrice=${money}&parkId=60009`,
          }}
          onLoadEnd={() => {
            setShowWebview(true);
          }}
        />
      ) : null}
      {showWebview ? (
        <WebView
          source={{
            uri: `http://cafe.wisemobile.kr/imobile/pay_lite/android_payResult_ticket.php?mmid=${userToken?.id}&parkId=60009`,
          }}
          onLoadEnd={() => {
            DeviceEventEmitter.emit(EMIT_EVENT.UPDATED_USER);
            showMessage({
              message: '충전이 완료되었습니다!',
            });
            navigation.reset({
              index: 0,
              routes: [{name: ROUTE_KEY.ParkingParkHome}],
            });
          }}
          originWhitelist={['*']}
        />
      ) : null}
    </FixedContainer>
  );
};

export default ConfirmDepositMoney;

const styles = StyleSheet.create({
  view: {
    marginHorizontal: PADDING,
    marginTop: PADDING,
  },
  viewTop1: {
    padding: PADDING,
  },
  viewBottom: {
    flexDirection: 'row',
    marginTop: heightScale(20),
  },
  text: {
    marginLeft: widthScale(8),
    lineHeight: heightScale(20),
  },
  button: {
    borderRadius: widthScale(8),
    marginTop: 'auto',
    margin: PADDING,
  },
  text1: {
    marginLeft: widthScale(8),
    lineHeight: heightScale(20),
    textDecorationLine: 'underline',
    marginTop: heightScale(10),
  },
});
