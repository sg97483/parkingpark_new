import {BottomSheetModal, BottomSheetView, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {DeviceEventEmitter, StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import {Icons} from '~/assets/svgs';
import CustomButton from '~components/commons/custom-button';
import RouteBadge from '~components/commons/route-badge';
import ToastMessage from '~components/commons/toast-message/toast-message';
import ToastMessageController from '~components/commons/toast-message/toast-message-controller';
import CustomBackdrop from '~components/custom-backdrop';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import {PADDING1} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {CreditCardProps} from '~constants/types';
import {RequestInfoModel} from '~model/chat-model';
import {CarpoolReservationPayModel} from '~model/passenger-model';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useGetDrivingDirectionQuery} from '~services/naverMapServices';
import {useCarpoolReservationPayMutation} from '~services/passengerServices';
import {colors} from '~styles/colors';
import {heightScale, heightScale1, scale1, widthScale, widthScale1} from '~styles/scaling-utils';
import {getNumberWithCommas} from '~utils/numberUtils';
import PaymentChangeCard, {PaymentChangeCardRefs} from './payment-change-card';

import {CouponProps} from '~constants/types';
import {useGetParkingCouponQuery} from '~services/couponServices';

import {useAppSelector} from '~store/storeHooks';
import TextInputVoucherReservation from '~components/textinput-voucher-reservation';
import ReservationCarpoolCoupon from '~components/reservation/reservation-carpool-coupon';

interface Props {
  routeInfo: RequestInfoModel | undefined;
  listPaymentCard: CreditCardProps[] | undefined;
  onPaySuccess: () => void;
  totalPrice: number;
  passengerRouteId?: string;
}

export interface PaymentCheckMethodRefs {
  show: () => void;
  hide: () => void;
}

const PaymentCheckMethod = forwardRef((props: Props, ref) => {
  const {routeInfo, listPaymentCard, onPaySuccess, totalPrice, passengerRouteId} = props;

  const [historyId, setHistoryId] = useState<number | undefined>(undefined);
  const [pointValue, setPointValue] = useState<number>(0);
  const [chargeValue, setChargeValue] = useState<number>(0);
  const [couponNumber, setCouponNumber] = useState<string | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponProps | null>(null);

  const route = useRoute(); // useRoute 훅을 사용하여 route 가져오기
  const parkingLot = route.params?.parkingLot;

  const formatedDay = useMemo(
    () =>
      moment(routeInfo?.selectDay?.slice(0, 10), 'YYYY.MM.DD').format('YYYYMMDD') +
      routeInfo?.startTime?.replace(':', ''),
    [routeInfo?.selectDay, routeInfo?.startTime],
  );

  const navigation = useNavigation<UseRootStackNavigation>();

  const [isCheckFullUsePoints, setIsCheckFullUsePoints] = useState<boolean>(false);

  const [point, setPoint] = useState<string>('');
  const [charge, setCharge] = useState<string>('');
  const [coupon, setCoupon] = useState(0);

  const userToken = useAppSelector(state => state?.userReducer?.userToken);
  const userInfo = useAppSelector(state => state?.userReducer?.user);

  const modalRef = useRef<BottomSheetModal>(null);
  const paymentChangeRef = useRef<PaymentChangeCardRefs>(null);

  const [carpoolReservation, {isLoading}] = useCarpoolReservationPayMutation();
  const startDirection = useMemo(() => {
    return `${routeInfo?.splng},${routeInfo?.splat}`;
  }, [routeInfo]);

  const endDirection = useMemo(() => {
    return `${routeInfo?.eplng},${routeInfo?.eplat}`;
  }, [routeInfo]);

  const stopDirection = useMemo(() => {
    return `${routeInfo?.soplng},${routeInfo?.soplat}`;
  }, [routeInfo]);

  const {data: direction} = useGetDrivingDirectionQuery(
    {
      start: startDirection,
      end: routeInfo?.priceSelect === 'E' ? endDirection : stopDirection,
    },
    {skip: !routeInfo?.splng},
  );

  const mPoint = Number(userInfo?.mpoint) || 0;
  let usePoint = 0;
  if (userInfo?.usePointSum) {
    usePoint = Number(userInfo?.usePointSum);
  }

  const mCharge = Number(userInfo?.chargeMoney) || 0;

  let mChargeSum = 0;
  if (userInfo?.usePointSumSklent) {
    mChargeSum = Number(userInfo?.usePointSumSklent);
  }

  let cancelPoint = 0;
  if (userInfo?.cancelPoint) {
    cancelPoint = Number(userInfo?.cancelPoint);
  }

  let cancelCharge = 0;
  if (userInfo?.cancelPointSklent) {
    cancelCharge = Number(userInfo?.cancelPointSklent);
  }

  const userPoint = mPoint - usePoint + cancelPoint;
  const userCharge = mCharge - mChargeSum + cancelCharge || 0;

  const setMaxPoint = () => {
    if (userPoint > 1000) {
      setPoint('1000');
    } else {
      setPoint(`${userPoint}`);
    }
  };

  const {data: couponList} = useGetParkingCouponQuery({
    memberId: userToken?.id,
    memberPwd: userToken?.password,
    parkingLotId: parkingLot?.id,
  });

  const endTime = useMemo(
    () =>
      moment(routeInfo?.startTime, 'HH:mm')
        .add(direction?.duration ?? 0, 'minutes')
        .format('HH:mm'),
    [direction, routeInfo?.startTime],
  );

  const show = useCallback(() => {
    modalRef?.current?.present();
  }, []);

  const hide = useCallback(() => {
    modalRef?.current?.close();
  }, []);

  useImperativeHandle(ref, () => ({show, hide}), []);

  const defaultCard = useMemo(
    () => listPaymentCard?.find(item => item?.defaultYN === 'Y'),
    [listPaymentCard],
  );

  const handlePayment = () => {
    // 적립금 및 충전금액을 숫자로 변환
    const pointVal = Number(point) || 0;
    const chargeVal = Number(charge) || 0;

    // 적립금 1천원 제한
    if (pointVal > 1000) {
      ToastMessageController.show('회당 적립금 1천원까지 사용가능합니다.');
      return;
    }

    // 결제 금액 계산
    const amountToPay = totalPrice - coupon - pointVal - chargeVal;

    if (amountToPay < 0) {
      ToastMessageController.show('결제 금액이 유효하지 않습니다. 다시 확인해주세요.');
      return;
    }

    // state 업데이트
    setPointValue(pointVal);
    setChargeValue(chargeVal);

    const body: CarpoolReservationPayModel = {
      agCarNumber: routeInfo?.carNumber ?? '',
      amt: amountToPay, // 쿠폰 금액을 차감한 총 금액
      r_memberId: routeInfo?.r_memberId as number,
      reservedStDtm: formatedDay ?? '',
      roadInfoId: routeInfo?.roadInfoId as number,
      rStatusCheck: 'R',
      resId: routeInfo?.resId as number,
      carInOut: routeInfo?.carInOut ?? '',
    };

    carpoolReservation({
      body: body,
    })
      .unwrap()
      .then(async res => {
        if (res?.statusCode !== '200') {
          ToastMessageController.show(res?.statusMsg ?? strings.general_text?.please_try_again);
          return;
        }
        setHistoryId(routeInfo?.resId as number);

        onPaySuccess && onPaySuccess();

        DeviceEventEmitter.emit(EMIT_EVENT.CARPOOL_PAYMENT_COMPLETE);

        hide();

        navigation.navigate(ROUTE_KEY.PaymentCompletionPage);
      });
  };

  return (
    <BottomSheetModal
      enableDynamicSizing
      index={0}
      backdropComponent={props => <CustomBackdrop {...props} onPressBackdrop={hide} />}
      handleComponent={null}
      ref={modalRef}>
      <BottomSheetView style={styles.containerStyle}>
        <BottomSheetScrollView contentContainerStyle={styles.scrollContainer}>
          <CustomText
            string="예약확인"
            forDriveMe
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_7}
            textStyle={[styles.headerTextStyle, styles.topMargin2]}
          />
          <PaddingHorizontalWrapper forDriveMe>
            <View style={styles.boxStyle}>
              <HStack style={{gap: widthScale1(10)}}>
                <RouteBadge type={routeInfo?.carInOut === 'in' ? 'WAY_WORK' : 'WAY_HOME'} />
                <CustomText
                  string={routeInfo?.selectDay ?? ''}
                  forDriveMe
                  family={FONT_FAMILY.SEMI_BOLD}
                  size={FONT.BODY}
                />
              </HStack>
              <RoutePlanner
                startAddress={routeInfo?.startPlace ?? ''}
                arriveAddress={
                  routeInfo?.priceSelect === 'E'
                    ? routeInfo?.endPlace ?? ''
                    : routeInfo?.stopOverPlace ?? ''
                }
                timeStart={routeInfo?.startTime ?? ''}
                timeArrive={endTime}
              />
              <HStack
                style={{
                  justifyContent: 'space-between',
                }}>
                <CustomText
                  string="결제금액"
                  forDriveMe
                  family={FONT_FAMILY.SEMI_BOLD}
                  size={FONT.BODY}
                  color={colors.blackGray}
                />
                <CustomText
                  string={`${getNumberWithCommas(
                    totalPrice - coupon - pointValue - chargeValue,
                  )}원`} // 모든 금액을 차감한 금액 표시
                  forDriveMe
                  family={FONT_FAMILY.SEMI_BOLD}
                  size={FONT.CAPTION_8}
                  color={colors.black}
                />
              </HStack>
            </View>
          </PaddingHorizontalWrapper>

          <PaddingHorizontalWrapper forDriveMe containerStyles={styles.topMargin}>
            <View style={styles.boxStyle}>
              <HStack style={{justifyContent: 'space-between'}}>
                <View style={{gap: PADDING1}}>
                  <CustomText
                    string="결제수단"
                    forDriveMe
                    family={FONT_FAMILY.SEMI_BOLD}
                    size={FONT.BODY}
                  />
                  <HStack style={{gap: widthScale1(12)}}>
                    <Icons.Card />
                    <CustomText
                      string={`${defaultCard?.cardName?.replace('[', '').replace(']', '') ?? ''} ${
                        defaultCard?.number1 ?? ''
                      }********${defaultCard?.number4 ?? ''}`}
                      forDriveMe
                      family={FONT_FAMILY.MEDIUM}
                    />
                  </HStack>
                </View>
                <CustomButton
                  text="변경"
                  buttonHeight={38}
                  type="TERTIARY"
                  outLine
                  textSize={FONT.CAPTION_6}
                  borderRadiusValue={6}
                  buttonStyle={{
                    paddingHorizontal: widthScale1(10),
                    minWidth: widthScale1(45),
                  }}
                  onPress={() => {
                    paymentChangeRef?.current?.show();
                  }}
                />
              </HStack>
            </View>
          </PaddingHorizontalWrapper>

          <View style={[styles.viewVoucher2, styles.shadowColor]}>
            <CustomText
              string={strings.reservation.info_voucher}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.TITLE_2}
            />
            <View style={styles.inputContainer}>
              <TextInputVoucherReservation
                placeholder="적립금 안내 확인후 입력"
                title={'적립금'}
                textMoney={`/ ${getNumberWithCommas(userPoint)}${strings?.general_text?.won}`}
                valueInput={point}
                onChangeText={text => {
                  const pointVal = Number(text);
                  if (pointVal > 1000) {
                    ToastMessageController.show('회당 적립금 1천원까지 사용가능합니다.');
                    setPoint('1000');
                    setPointValue(1000);
                  } else {
                    setPoint(text);
                    setPointValue(pointVal);
                  }
                }}
              />
              <TextInputVoucherReservation
                placeholder="충전금을 입력해주세요."
                title={'충전금'}
                textMoney={`/ ${getNumberWithCommas(userCharge)}${strings?.general_text?.won}`}
                valueInput={charge}
                onChangeText={text => {
                  setCharge(text);
                  setChargeValue(Number(text));
                }}
              />
            </View>

            {/* Coupon */}
            <ReservationCarpoolCoupon
              data={couponList as CouponProps[]}
              onPress={(value: CouponProps) => {
                console.log('Coupon Number:', value?.c_number); // 쿠폰 번호를 로그로 출력
                console.log('Coupon Price:', value?.c_price); // 쿠폰 가격을 로그로 출력
                setCoupon(Number(value?.c_price));
                setSelectedCoupon(value); // 선택된 쿠폰을 설정합니다.
              }}
            />
          </View>

          <PaddingHorizontalWrapper containerStyles={styles.buttonWrapperStyle} forDriveMe>
            <HStack style={{gap: widthScale1(10)}}>
              <CustomButton
                text="취소"
                type="TERTIARY"
                outLine
                buttonHeight={58}
                buttonStyle={styles.buttonStyle}
                onPress={hide}
              />
              <CustomButton
                text="확인"
                buttonHeight={58}
                buttonStyle={styles.buttonStyle}
                onPress={handlePayment}
                isLoading={isLoading}
              />
            </HStack>
          </PaddingHorizontalWrapper>
        </BottomSheetScrollView>

        <PaymentChangeCard
          ref={paymentChangeRef}
          listPaymentCard={listPaymentCard}
          navigation={navigation}
        />

        <ToastMessage
          containerStyle={{
            marginBottom: heightScale1(150),
          }}
        />

        {historyId && (
          <WebView
            source={{
              uri: `http://cafe.wisemobile.kr/imobile/pay_lite/payCarPoolSendKakao.php?historyId=${historyId}&rid=${passengerRouteId}&coupon=${coupon}&point=${pointValue}&charge=${chargeValue}&couponNumber=${selectedCoupon?.c_number}`,
            }}
            originWhitelist={['*']}
            onLoadEnd={() => {
              console.log(
                `http://cafe.wisemobile.kr/imobile/pay_lite/payCarPoolSendKakao.php?historyId=${historyId}&rid=${passengerRouteId}&coupon=${coupon}&point=${pointValue}&charge=${chargeValue}&couponNumber=${selectedCoupon?.c_number}`,
              );
              setTimeout(() => {
                setHistoryId(undefined);
              }, 100);
            }}
          />
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default PaymentCheckMethod;

const styles = StyleSheet.create({
  containerStyle: {
    gap: heightScale1(30),
  },
  scrollContainer: {
    paddingBottom: heightScale(10), // Adjust this value to reduce the bottom padding
  },
  headerTextStyle: {
    marginTop: heightScale1(30),
    textAlign: 'center',
  },
  boxStyle: {
    gap: PADDING1,
    backgroundColor: colors.policy,
    padding: PADDING1,
    borderRadius: scale1(8),
  },
  buttonWrapperStyle: {
    marginBottom: heightScale1(42),
    marginTop: heightScale1(10),
  },
  buttonStyle: {
    flex: 1,
  },
  viewVoucher2: {
    borderRadius: widthScale(5),
    padding: widthScale(5),
    paddingTop: heightScale(10),
    paddingBottom: heightScale(10),
    paddingHorizontal: widthScale(20),
    margin: heightScale(20),
    backgroundColor: colors.white,
  },
  shadowColor: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.37,
    shadowRadius: 3.49,
    elevation: 2,
  },
  descriptionVoucherText: {
    marginBottom: heightScale(10),
  },
  inputContainer: {
    gap: heightScale(-25), // 상하 간격을 조정합니다. 필요에 따라 값을 조절하세요.
  },
  topMargin: {
    marginTop: heightScale(15), // 원하는 상단 여백 값을 설정합니다.
  },
  topMargin2: {
    marginTop: heightScale(45), // 원하는 상단 여백 값을 설정합니다.
    marginBottom: heightScale(20), // 원하는 상단 여백 값을 설정합니다.
  },
});
