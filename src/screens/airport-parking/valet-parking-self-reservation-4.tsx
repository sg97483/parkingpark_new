import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo, useRef, useState} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import UsageHistoryMenuText from '~components/usage-history.tsx/usage-history-menu-text';
import CustomText from '~components/custom-text';
import {FONT, PAYMENT_METHOD} from '~constants/enum';
import {colors} from '~styles/colors';
import {getNumberWithCommas} from '~utils/numberUtils';
import {strings} from '~constants/strings';
import HStack from '~components/h-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {PADDING, width} from '~constants/constant';
import {heightScale, widthScale} from '~styles/scaling-utils';
import RefundPolicyPopup, {
  RefundPolicyRefs,
} from '~components/valet-parking-reservation/refund-policy-popup';
import ViewTermsPopup, {
  ViewTermsRefs,
} from '~components/valet-parking-reservation/view-terms-popup';
import TitleWithIcon from '~components/valet-parking-reservation/title-with-icon';
import {useAppSelector} from '~store/storeHooks';
import {showMessage} from 'react-native-flash-message';
import ValetParkingReservationPopup, {
  ValetParkingReservationRefs,
} from '~components/valet-parking-reservation/valet-parking-reservation-popup';
import ValetParkingSelfReservationCompletionPopup, {
  ValetParkingSelfReservationCompletionRefs,
} from '~components/valet-parking-reservation/valet-parking-self-reservation-completion-popup';
import ValetParkingReservationCompletionPopup, {
  ValetParkingReservationCompletionRefs,
} from '~components/valet-parking-reservation/valet-parking-reservation-completion-popup';
import {useCreateValetParkingReservationMutation} from '~services/valetParkingServices';
import Spinner from '~components/spinner';

const ValetParkingSelfReservation4 = memo(
  (props: RootStackScreenProps<'ValetParkingSelfReservation4'>) => {
    const {navigation, route} = props;

    const refundPolicyRef = useRef<RefundPolicyRefs>(null);
    const viewTermsRef = useRef<ViewTermsRefs>(null);
    const valetParkingReservationRef = useRef<ValetParkingReservationRefs>(null);
    const selfReservationCompletionRef = useRef<ValetParkingSelfReservationCompletionRefs>(null);
    const reservationCompletionRef = useRef<ValetParkingReservationCompletionRefs>(null);

    const userInfo = useAppSelector(state => state?.userReducer?.user);
    const userToken = useAppSelector(state => state?.userReducer?.userToken);

    const [createValetParkingReservation] = useCreateValetParkingReservationMutation();

    const parkingLot = route?.params?.parkingLot;
    const requirements = route?.params?.requirements;
    const agCarNumber = route?.params?.agCarNumber;
    const inFlightDate = route?.params?.inFlightDate;
    const outFlightDate = route?.params?.outFlightDate;
    const inFlightDateTag = route?.params?.inFlightDateTag;
    const outFlightDateTag = route?.params?.outFlightDateTag;
    const usePoint = route?.params?.usePoint;
    const usePointSklent = route?.params?.usePointSklent;
    const useCoupon = route?.params?.useCoupon;
    const inFlightAndCityName = route?.params?.inFlightAndCityName;
    const outFlightAndCityName = route?.params?.outFlightAndCityName;
    const inFlightTimeInMillis = route?.params?.inFlightTimeInMillis;
    const outFlightTimeInMillis = route?.params?.outFlightTimeInMillis;
    const totalPrice = route?.params?.totalPrice;

    const [agreeToRefundPolicy, setAgreeToRefundPolicy] = useState<boolean>(false);
    const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
    const [paymentMethod, setPaymentMethod] = useState<PAYMENT_METHOD>(PAYMENT_METHOD.CREDIT_CARD);

    const getTitle = () => {
      if (
        parkingLot?.id === 70003 ||
        parkingLot?.id === 70004 ||
        parkingLot?.id === 70005 ||
        parkingLot?.id === 70006 ||
        parkingLot?.id === 70007 ||
        parkingLot?.id === 70008 ||
        parkingLot?.id === 70009 ||
        parkingLot?.id === 70010 ||
        parkingLot?.id === 70011
      ) {
        return '4단계. 직접(셀프주차) 예약결제';
      } else {
        return '4단계. 발렛주차 예약결제';
      }
    };

    const getTotalTicketType = (): string => {
      if (
        parkingLot?.id === 70004 ||
        parkingLot?.id === 70005 ||
        parkingLot?.id === 70006 ||
        parkingLot?.id === 70007 ||
        parkingLot?.id === 70008 ||
        parkingLot?.id === 70009 ||
        parkingLot?.id === 70010 ||
        parkingLot?.id === 70011
      ) {
        return '직접주차';
      }
      return '발렛파킹';
    };

    const handleReservation = () => {
      Spinner.show();
      createValetParkingReservation({
        memberId: userToken?.id,
        memberPwd: userToken?.password,
        parkId: parkingLot?.id,
        payAmt: totalPrice,
        stDtm: outFlightDateTag,
        edDtm: inFlightDateTag,
        usePoint: usePoint,
        usePointSklent: usePointSklent,
        useCoupon: useCoupon,
        TotalTicketType: encodeURIComponent(getTotalTicketType()),
        requirements: requirements
          ? encodeURIComponent(requirements)
          : encodeURIComponent('00시00분'),
        agCarNumber: encodeURIComponent(agCarNumber),
        inFlightAndCityName: encodeURIComponent(inFlightAndCityName),
        outFlightAndCityName: encodeURIComponent(outFlightAndCityName),
      })
        .unwrap()
        .then(res => {
          if (res === '200') {
            if (parkingLot?.id === 70003) {
              selfReservationCompletionRef?.current?.show();
            } else {
              reservationCompletionRef?.current?.show(userToken?.id as number);
            }
          } else {
            showMessage({
              message: '[결제실패] 관리자에게 문의해 주세요.',
            });
          }
        })
        .finally(() => {
          Spinner.hide();
        });
    };

    const handleConfirm = () => {
      if (!agreeToRefundPolicy || !agreeTerms) {
        showMessage({
          message: '약관에 동의해 주세요.',
        });
        return;
      }

      valetParkingReservationRef?.current?.show(outFlightDate, inFlightDate, totalPrice);
    };

    return (
      <FixedContainer>
        <CustomHeader text={getTitle()} />
        <ScrollView>
          <UsageHistoryMenuText
            title="입차시간"
            content={<CustomText string={outFlightDate} size={FONT.CAPTION} color={colors.green} />}
          />
          <UsageHistoryMenuText
            title="출차시간"
            content={<CustomText string={inFlightDate} size={FONT.CAPTION} color={colors.green} />}
          />
          <UsageHistoryMenuText
            title="결제금액"
            content={
              <CustomText
                string={`${getNumberWithCommas(totalPrice)}${strings?.general_text?.won}`}
                size={FONT.CAPTION}
                color={colors.pink2}
              />
            }
          />
          <UsageHistoryMenuText
            title="환불규정확인"
            content={
              <View
                style={{
                  width: '100%',
                  paddingHorizontal: PADDING / 3,
                }}>
                <HStack>
                  <View style={{flex: 1}}>
                    <CustomText string="환불규정 확인 및 동의" size={FONT.CAPTION_2} />
                  </View>

                  <TouchableOpacity
                    onPress={() => refundPolicyRef?.current?.show()}
                    style={styles.checkButtonWrapper}>
                    <CustomText string="규정보기" size={FONT.CAPTION_2} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setAgreeToRefundPolicy(!agreeToRefundPolicy);
                    }}
                    style={styles.checkBoxWrapper}>
                    <Icon
                      name="check"
                      size={widthScale(18)}
                      color={agreeToRefundPolicy ? colors.green : colors.transparent}
                    />
                  </TouchableOpacity>
                </HStack>
              </View>
            }
          />
          <UsageHistoryMenuText
            title="이용약관"
            content={
              <View
                style={{
                  width: '100%',
                  paddingHorizontal: PADDING / 3,
                }}>
                <HStack>
                  <View style={{flex: 1}}>
                    <CustomText
                      string="발렛파킹(주차대행) 이용약관"
                      size={FONT.CAPTION_2}
                      numberOfLines={1}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => viewTermsRef?.current?.show()}
                    style={styles.checkButtonWrapper}>
                    <CustomText string="규정보기" size={FONT.CAPTION_2} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setAgreeTerms(!agreeTerms);
                    }}
                    style={styles.checkBoxWrapper}>
                    <Icon
                      name="check"
                      size={widthScale(18)}
                      color={agreeTerms ? colors.green : colors.transparent}
                    />
                  </TouchableOpacity>
                </HStack>
              </View>
            }
            isLastIndex
          />

          <TitleWithIcon title="이용자정보" />
          <UsageHistoryMenuText
            title="주차장명"
            content={<CustomText string={parkingLot?.garageName} />}
          />
          <UsageHistoryMenuText title="차량번호" content={<CustomText string={agCarNumber} />} />
          <UsageHistoryMenuText
            title="차량기종"
            content={<CustomText string={userInfo?.carModel || ''} />}
          />
          <UsageHistoryMenuText
            title="차량색상"
            content={<CustomText string={userInfo?.carColor || ''} />}
          />
          <UsageHistoryMenuText
            title="연락처"
            content={<CustomText string={userInfo?.pnum || ''} />}
          />
          <UsageHistoryMenuText
            title="이메일"
            content={<CustomText string={userInfo?.email || ''} />}
          />
          <UsageHistoryMenuText
            title="카드정보"
            content={<CustomText string={userInfo?.cardName || ''} />}
            isLastIndex
          />

          <View style={{height: PADDING}} />

          <UsageHistoryMenuText
            title="결제방법 선택"
            content={
              <View
                style={{
                  width: '100%',
                  paddingHorizontal: PADDING / 1.5,
                }}>
                <HStack>
                  <TouchableOpacity
                    onPress={() => {
                      setPaymentMethod(PAYMENT_METHOD.CREDIT_CARD);
                    }}>
                    <HStack>
                      <View style={styles.circleCheckBoxWrapper}>
                        <View
                          style={[
                            styles.circleView,
                            {
                              backgroundColor:
                                paymentMethod === PAYMENT_METHOD.CREDIT_CARD
                                  ? colors.blue
                                  : colors.transparent,
                            },
                          ]}
                        />
                      </View>
                      <CustomText string="신용카드" />
                    </HStack>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginLeft: PADDING,
                    }}
                    onPress={() => {
                      setPaymentMethod(PAYMENT_METHOD.CELL_PHONE);
                    }}>
                    <HStack>
                      <View style={styles.circleCheckBoxWrapper}>
                        <View
                          style={[
                            styles.circleView,
                            {
                              backgroundColor:
                                paymentMethod === PAYMENT_METHOD.CELL_PHONE
                                  ? colors.blue
                                  : colors.transparent,
                            },
                          ]}
                        />
                      </View>
                      <CustomText string="휴대폰" />
                    </HStack>
                  </TouchableOpacity>
                </HStack>
              </View>
            }
            isLastIndex
          />

          <TouchableOpacity onPress={handleConfirm} style={styles.confirmButtonWrapper}>
            <CustomText string={strings?.general_text?.confirm} color={colors.white} />
          </TouchableOpacity>
        </ScrollView>
        {/* Refund policy */}
        <RefundPolicyPopup ref={refundPolicyRef} />
        {/* Terms and conditions */}
        <ViewTermsPopup ref={viewTermsRef} />
        {/* Reservation popup */}
        <ValetParkingReservationPopup
          ref={valetParkingReservationRef}
          onConfirm={handleReservation}
        />
        {/* Valet parking self reservation completion popup */}
        <ValetParkingSelfReservationCompletionPopup ref={selfReservationCompletionRef} />
        {/* Valet parking reservation completion popup */}
        <ValetParkingReservationCompletionPopup ref={reservationCompletionRef} />
      </FixedContainer>
    );
  },
);

export default ValetParkingSelfReservation4;

const styles = StyleSheet.create({
  checkButtonWrapper: {
    borderWidth: 0.5,
    paddingHorizontal: widthScale(5),
    height: heightScale(25),
    justifyContent: 'center',
    borderRadius: widthScale(5),
    marginRight: widthScale(10),
  },
  checkBoxWrapper: {
    width: widthScale(25),
    height: widthScale(25),
    borderWidth: 1,
    borderColor: colors.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleCheckBoxWrapper: {
    width: widthScale(18),
    height: widthScale(18),
    borderWidth: 1,
    borderRadius: 999,
    marginRight: widthScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.darkGray,
  },
  circleView: {
    width: widthScale(10),
    height: widthScale(10),
    backgroundColor: colors.gray,
    borderRadius: 999,
  },
  confirmButtonWrapper: {
    backgroundColor: colors.blue,
    height: heightScale(40),
    width: width * 0.7,
    borderRadius: widthScale(5),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: PADDING,
  },
});
