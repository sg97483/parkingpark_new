import {Alert, DeviceEventEmitter, Image, StyleSheet, View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale, widthScale1} from '~styles/scaling-utils';
import CustomText from '~components/custom-text';
import {PADDING1} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {useCancelValetParkingMutation} from '~services/valetParkingServices';
import {useAppSelector} from '~store/storeHooks';
import WebView from 'react-native-webview';
import {showMessage} from 'react-native-flash-message';
import {IMAGES} from '~/assets/images-path';
import HStack from '~components/h-stack';
import CustomButton from '~components/commons/custom-button';

interface Props {
  onSuccess: () => void;
}

export interface AutoPayRefs {
  show: (id: number, amount: string) => void;
}

const AutoPayPopup = forwardRef((props: Props, ref) => {
  const {onSuccess} = props;
  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const [historyID, setHistoryID] = useState<number | null>(null);
  const [cancelAmount, setCancelAmount] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showWebview, setShowWebview] = useState<boolean>(false);

  const [cancelValetParking] = useCancelValetParkingMutation();

  const show = (id: number, amount: number) => {
    setHistoryID(id);
    setCancelAmount(amount);
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
    setHistoryID(null);
    setCancelAmount(null);
    setShowWebview(false);
  };

  useImperativeHandle(
    ref,
    () => ({
      show,
    }),
    [],
  );

  const handleCancel = () => {
    if (cancelAmount && historyID) {
      setIsLoading(true);

      const body = {
        cancelAmt: cancelAmount,
        historyId: historyID,
        memberId: userToken?.id,
        memberPwd: userToken?.password,
      };

      cancelValetParking(body)
        .unwrap()
        .then(res => {
          if (res === '200') {
            setShowWebview(true);
          } else {
            Alert.alert('결제취소에 실패하였습니다. 관리자에게 문의해 주세요.');
            setIsLoading(false);
          }
        });
    }
  };

  const autoReg = () => {
    setShowWebview(true);
  };

  return (
    <ReactNativeModal
      onBackButtonPress={isLoading ? () => {} : hide}
      onBackdropPress={isLoading ? () => {} : hide}
      isVisible={isVisible}
      useNativeDriver>
      <View style={styles.containerStyle}>
        <View style={styles.rowStyle}>
          <Image
            resizeMode="contain"
            source={IMAGES.icon_autopay_info100}
            style={styles.imageStyle}
          />
          <CustomText
            textStyle={styles.headerTextStyle}
            size={FONT.BODY}
            family={FONT_FAMILY.SEMI_BOLD}
            string="자동결제 신청전 꼭 확인해주세요!"
            forDriveMe
          />
        </View>

        <CustomText
          string={
            '• 1일~말일 월주차권 이용시 매달 20일 자동\n   결제됩니다.\n• 입차일로 부터 한달 월주차권 이용시 만료일 \n   10일전 자동결제 됩니다.\n• 결제일이 주말이나 공휴일인 경우 안내된\n   일자보다 일찍 결제 될수 있습니다.\n• 자동 결제시 이용중인 월주차권 종료일 다음날로\n   자동 연장등록처리됩니다.\n• 자동결제 이용시 결제수단을 카드결제만 가능\n   합니다. 충전금 및 적립금은 사용 불가합니다.\n• 등록된 카드로 결제가 불가할 경우 담당자가 \n   안내문자를 전달드리며, 연장결제 기간 종료일\n   까지 매일 결제 시도를 합니다.\n• 연장일 이전까지 등록된 카드로 자동결제 불가시\n   자동결제 신청은 해지처리 됩니다.\n• 주차장 운영사 요청에 따라 사전고지 없이 연장\n   이용이 불가할수 있습니다.\n• 자동 결제 해지시 파킹박 고객 센터로 해지 요청\n   후 해지 처리가 가능합니다.'
          }
          textStyle={styles.textStyle}
          size={FONT.CAPTION_6}
          forDriveMe
          lineHeight={heightScale1(20)}
          color={colors.grayText2}
        />

        <HStack style={{gap: widthScale1(10)}}>
          <CustomButton
            buttonHeight={58}
            onPress={hide}
            type="TERTIARY"
            text="닫기"
            disabled={isLoading}
            buttonStyle={{flex: 1}}
          />

          <CustomButton
            buttonHeight={58}
            onPress={autoReg}
            text="신청하기"
            isLoading={isLoading}
            buttonStyle={{flex: 1}}
          />
        </HStack>

        {showWebview ? (
          <WebView
            source={{
              uri: `http://cafe.wisemobile.kr/imobile/pay_lite/autopay_reg_send.php?pid=${historyID}`,
            }}
            style={{
              position: 'absolute',
              height: 0,
              maxHeight: 0,
            }}
            originWhitelist={['*']}
            onLoadEnd={() => {
              DeviceEventEmitter.emit(EMIT_EVENT.VALET_PARKING);
              onSuccess && onSuccess();
              hide();
              showMessage({
                message: '정상적으로 신청되었습니다.',
              });
            }}
          />
        ) : null}
      </View>
    </ReactNativeModal>
  );
});
export default AutoPayPopup;

const styles = StyleSheet.create({
  containerStyle: {
    padding: PADDING1,
    backgroundColor: colors.white,
    borderRadius: scale1(8),
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightScale1(10),
  },
  imageStyle: {
    width: widthScale(16),
    height: widthScale(16),
    marginRight: widthScale(8),
  },
  headerTextStyle: {
    textAlign: 'center',
  },
  textStyle: {
    textAlign: 'left',
    color: colors.grayText2,
    marginBottom: heightScale1(30),
  },
  buttonStyle: {
    flex: 1,
    borderRadius: scale1(8),
  },
});
