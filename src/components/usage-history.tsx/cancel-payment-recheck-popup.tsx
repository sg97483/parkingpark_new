import {
  ActivityIndicator,
  Alert,
  DeviceEventEmitter,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import CustomText from '~components/custom-text';
import {PADDING} from '~constants/constant';
import {EMIT_EVENT, FONT_FAMILY} from '~constants/enum';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {strings} from '~constants/strings';
import {useCancelValetParkingMutation} from '~services/valetParkingServices';
import {useAppSelector} from '~store/storeHooks';
import WebView from 'react-native-webview';
import {showMessage} from 'react-native-flash-message';

interface Props {
  onSuccess: () => void;
  /**
   * 결제 취소 WebView 실행 전에 선행되어야 하는 취소 로직 (예: Amano 취소)
   * true 를 반환하면 계속 진행, false 를 반환하면 이후 작업을 중단합니다.
   */
  onBeforeCancel?: () => Promise<boolean>;
}

export interface CancelPaymentRecheckRefs {
  show: (text: string, id: number, amount: string) => void;
}

const CancelPaymentRecheckPopup = forwardRef((props: Props, ref) => {
  const {onSuccess, onBeforeCancel} = props;
  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const [title, setTitle] = useState<string>('');
  const [historyID, setHistoryID] = useState<number | null>(null);
  const [cancelAmount, setCancelAmount] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showWebview, setShowWebview] = useState<boolean>(false);

  const [cancelValetParking] = useCancelValetParkingMutation();

  const show = (text: string, id: number, amount: number) => {
    setTitle(text);
    setHistoryID(id);
    setCancelAmount(amount);
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
    setTitle('');
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

  const handleCancel = async () => {
    if (!cancelAmount || !historyID) {
      return;
    }

    setIsLoading(true);

    try {
      if (onBeforeCancel) {
        const ok = await onBeforeCancel();
        if (!ok) {
          setIsLoading(false);
          return;
        }
      }

      const body = {
        cancelAmt: cancelAmount,
        historyId: historyID,
        memberId: userToken?.id,
        memberPwd: userToken?.password,
      };

      const res = await cancelValetParking(body).unwrap();
      if (res === '200') {
        setShowWebview(true);
      } else {
        Alert.alert('결제취소에 실패하였습니다. 관리자에게 문의해 주세요.');
        setIsLoading(false);
      }
    } catch (e) {
      Alert.alert('결제취소에 실패하였습니다. 관리자에게 문의해 주세요.');
      setIsLoading(false);
    }
  };

  return (
    <ReactNativeModal
      onBackButtonPress={isLoading ? () => {} : hide}
      onBackdropPress={isLoading ? () => {} : hide}
      isVisible={isVisible}
      useNativeDriver>
      <View style={styles.container}>
        <CustomText
          string="결제취소"
          color={colors.red}
          family={FONT_FAMILY.BOLD}
          textStyle={{
            textAlign: 'center',
          }}
        />
        <TouchableOpacity disabled={isLoading} onPress={hide} style={styles.closeIcon}>
          <Icon name="close" size={widthScale(22)} color={colors.red} />
        </TouchableOpacity>

        <View style={styles.content}>
          <CustomText string={title} />
        </View>

        <View>
          <TouchableOpacity
            disabled={isLoading}
            onPress={handleCancel}
            style={styles.confirmButton}>
            {isLoading ? (
              <ActivityIndicator color={colors.red} />
            ) : (
              <CustomText
                string={strings?.general_text?.confirm}
                color={colors.red}
                family={FONT_FAMILY.SEMI_BOLD}
              />
            )}
          </TouchableOpacity>
        </View>
        {showWebview ? (
          <WebView
            source={{
              uri: `http://cafe.wisemobile.kr/imobile/pay_lite/pointCancel.php?pid=${historyID}`,
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
                message: '정상적으로 결제취소 되었습니다.',
              });
            }}
          />
        ) : null}
      </View>
    </ReactNativeModal>
  );
});
export default CancelPaymentRecheckPopup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: PADDING / 2,
  },
  closeIcon: {
    position: 'absolute',
    right: PADDING / 2,
    top: PADDING / 2,
  },
  confirmButton: {
    height: heightScale(40),
    width: widthScale(100),
    borderWidth: 1,
    borderColor: colors.red,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: PADDING,
  },
  content: {
    paddingTop: PADDING,
  },
});
