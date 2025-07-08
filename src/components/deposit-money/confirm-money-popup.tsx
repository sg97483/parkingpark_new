import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Alert, DeviceEventEmitter, ScrollView, StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import {Icons} from '~/assets/svgs';
import PaymentChangeCard, {PaymentChangeCardRefs} from '~components/chat-list/payment-change-card';
import CustomButton from '~components/commons/custom-button';
import CustomBackdrop from '~components/custom-backdrop';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {HEIGHT, PADDING, PADDING1} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {CreditCardProps} from '~constants/types';
import {userHook} from '~hooks/userHook';
import {UseRootStackNavigation} from '~navigators/stack';
import {useDepositMoneyMutation} from '~services/couponServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {getNumberWithCommas} from '~utils/numberUtils';

export interface ConfirmMoneyRefs {
  show: (value: number, creditCard: CreditCardProps) => void;
}

interface Props {
  onSuccess: () => void;
  listPaymentCard: CreditCardProps[] | undefined;
}

const ConfirmMoneyPopup = forwardRef((props: Props, ref) => {
  const {onSuccess, listPaymentCard} = props;
  const navigation = useNavigation<UseRootStackNavigation>();
  const insets = useSafeAreaInsets();

  const {userID, userToken} = userHook();
  const [depositMoney] = useDepositMoneyMutation();

  const [money, setMoney] = useState<number>(0);
  const [showWebviewPointInsert, setShowWebviewPointInsert] = useState<boolean>(false);
  const [showWebview, setShowWebview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const paymentChangeRef = useRef<PaymentChangeCardRefs>(null);
  const modalRef = useRef<BottomSheetModal>(null);

  const defaultCard = useMemo(
    () => listPaymentCard?.find(item => item?.defaultYN === 'Y'),
    [listPaymentCard],
  );

  const show = (value: number, creditCard: CreditCardProps) => {
    setMoney(value);
    modalRef?.current?.present();
  };

  const hide = () => {
    setMoney(0);
    setIsLoading(false);
    modalRef?.current?.forceClose();
  };

  useImperativeHandle(
    ref,
    () => ({
      show,
    }),
    [],
  );

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

  const handleChangeCard = useCallback(() => {
    paymentChangeRef?.current?.show();
  }, []);

  return (
    <BottomSheetModal
      index={0}
      backdropComponent={props => <CustomBackdrop {...props} onPressBackdrop={hide} />}
      handleComponent={null}
      ref={modalRef}
      enableDynamicSizing>
      <BottomSheetView style={styles.containerStyle}>
        <View
          style={[
            styles.contentStyle,
            {
              paddingBottom: heightScale1(42),
              maxHeight: HEIGHT - (insets.top + heightScale1(48)),
            },
          ]}>
          <CustomText
            string="충전금 충전 확인"
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_7}
            textStyle={styles.headerTextStyle}
            forDriveMe
            lineHeight={heightScale1(22)}
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.sectionStyle}>
              <CustomText
                string="충전내용"
                forDriveMe
                size={FONT.CAPTION_7}
                family={FONT_FAMILY.SEMI_BOLD}
                textStyle={{
                  marginBottom: heightScale1(10),
                }}
                lineHeight={heightScale1(22)}
              />

              <HStack style={styles.menuSectionStyle}>
                <CustomText
                  color={colors.blackGray}
                  string="기본 충전금"
                  forDriveMe
                  family={FONT_FAMILY.MEDIUM}
                />
                <CustomText
                  size={FONT.CAPTION_7}
                  family={FONT_FAMILY.SEMI_BOLD}
                  string={`${getNumberWithCommas(money)}원`}
                  forDriveMe
                />
              </HStack>

              <HStack style={styles.menuSectionStyle}>
                <CustomText
                  color={colors.blackGray}
                  string="추가 충전금 2%"
                  forDriveMe
                  family={FONT_FAMILY.MEDIUM}
                />
                <CustomText
                  size={FONT.CAPTION_7}
                  family={FONT_FAMILY.SEMI_BOLD}
                  string={`${getNumberWithCommas(money / 50)}원`}
                  forDriveMe
                />
              </HStack>

              <HStack style={styles.menuSectionStyle}>
                <CustomText
                  color={colors.blackGray}
                  string="추가 1% 적립금"
                  forDriveMe
                  family={FONT_FAMILY.MEDIUM}
                />
                <CustomText
                  size={FONT.CAPTION_7}
                  family={FONT_FAMILY.SEMI_BOLD}
                  string={`${getNumberWithCommas(money / 100)}원`}
                  forDriveMe
                />
              </HStack>
            </View>

            {/* Money section */}
            <View style={styles.sectionStyle}>
              <HStack style={[styles.menuSectionStyle]}>
                <CustomText
                  string="결제금액"
                  size={FONT.BODY}
                  forDriveMe
                  family={FONT_FAMILY.SEMI_BOLD}
                  color={colors.blackGray}
                  lineHeight={heightScale1(25)}
                />
                <CustomText
                  size={FONT.CAPTION_8}
                  family={FONT_FAMILY.SEMI_BOLD}
                  string={`${getNumberWithCommas(money)}원`}
                  color={colors.primary}
                  forDriveMe
                  lineHeight={heightScale1(28)}
                />
              </HStack>
            </View>

            {/* Card section */}
            <HStack style={styles.sectionStyle}>
              <View style={{flex: 1}}>
                <CustomText
                  string="결제수단"
                  size={FONT.BODY}
                  forDriveMe
                  family={FONT_FAMILY.SEMI_BOLD}
                />
                <HStack
                  style={{
                    marginTop: PADDING1,
                  }}>
                  <Icons.Card />
                  <CustomText
                    numberOfLines={1}
                    string={`  ${defaultCard?.cardName.replace('[', '').replace(']', '')} ${
                      defaultCard?.number1
                    }********${defaultCard?.number4}`}
                    forDriveMe
                    family={FONT_FAMILY.MEDIUM}
                  />
                </HStack>
              </View>

              <CustomButton
                buttonStyle={styles.changeCardButtonStyle}
                type="TERTIARY"
                outLine
                buttonHeight={38}
                text="변경"
                onPress={handleChangeCard}
                textSize={FONT.CAPTION_6}
              />
            </HStack>

            {/* Terms */}
            <View
              style={[
                styles.sectionStyle,
                {
                  marginBottom: heightScale1(40),
                },
              ]}>
              <CustomText
                string={
                  '충전후 60% 이상 남아있어야만 환불 가능\n(환불시 추가 3%에 해당하는 충전금 차감처리)\n1년이 지난 충전금에 대해서는 사용은 가능. 환불은 불가하며, 2년이 지난 충전금은 자동 소멸됩니다.'
                }
                color={colors.lineCancel}
                forDriveMe
                family={FONT_FAMILY.MEDIUM}
                lineHeight={heightScale1(20)}
              />
            </View>
          </ScrollView>

          <HStack style={{gap: widthScale1(10), marginTop: heightScale1(10)}}>
            <CustomButton
              type="TERTIARY"
              buttonHeight={58}
              text="취소"
              onPress={hide}
              disabled={isLoading}
              buttonStyle={{flex: 1}}
              outLine
            />
            <CustomButton
              buttonHeight={58}
              onPress={handleSubmit}
              text="결제하기"
              isLoading={isLoading}
              buttonStyle={{flex: 1}}
            />
          </HStack>

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
                hide();
                onSuccess && onSuccess();
              }}
            />
          ) : null}
        </View>
        <PaymentChangeCard
          ref={paymentChangeRef}
          listPaymentCard={listPaymentCard}
          navigation={navigation}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default ConfirmMoneyPopup;

const styles = StyleSheet.create({
  containerStyle: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  contentStyle: {
    backgroundColor: colors.white,
    paddingHorizontal: PADDING1,
    borderTopLeftRadius: scale1(16),
    borderTopRightRadius: scale1(16),
  },
  headerTextStyle: {
    textAlign: 'center',
    marginVertical: heightScale1(30),
  },
  sectionStyle: {
    backgroundColor: colors.policy,
    padding: PADDING,
    borderRadius: scale1(8),
    marginBottom: heightScale1(20),
  },
  menuSectionStyle: {
    justifyContent: 'space-between',
    minHeight: heightScale1(30),
  },
  changeCardButtonStyle: {
    paddingHorizontal: widthScale1(10),
    minWidth: widthScale1(45),
  },
  buttonStyle: {
    flex: 1,
    borderRadius: scale1(6),
  },
});
