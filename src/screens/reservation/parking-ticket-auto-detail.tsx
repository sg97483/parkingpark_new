import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo, useRef, useState} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomText from '~components/custom-text';
import CustomHeader from '~components/custom-header';
import UsageHistoryMenuText from '~components/usage-history.tsx/usage-history-menu-text';
import moment from 'moment';
import {PADDING} from '~constants/constant';
import {FONT, FONT_FAMILY, PAYMENT_METHOD} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import HStack from '~components/h-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getNumberWithCommas} from '~utils/numberUtils';
import {strings} from '~constants/strings';
import {useReadUserPassQuery} from '~services/userServices';
import Checkbox from '~components/checkbox';
import ViewTermsPopup, {
  ViewTermsRefs,
} from '~components/valet-parking-reservation/view-terms-popup';
import {useSubmitParkingReservationMutation} from '~services/reservationServices';
import Spinner from '~components/spinner';
import {showMessage} from 'react-native-flash-message';
import ReservationCompletionPopup, {
  ReservationCompletionRefs,
} from '~components/reservation/reservation-completion-popup';
import {ROUTE_KEY} from '~navigators/router';

const ParkingTicketAutoDetail = memo((props: RootStackScreenProps<'ParkingTicketAutoDetail'>) => {
  const {navigation, route} = props;

  const [submitParkingReservation] = useSubmitParkingReservationMutation();

  const viewTermsRef = useRef<ViewTermsRefs>(null);
  const reservationCompletionRef = useRef<ReservationCompletionRefs>(null);

  const coupon = route?.params?.coupon;
  const memberIDUse = route?.params?.memberIDUse;
  const parkingLotID = route?.params?.parkingLotID;
  const payInfo = route?.params?.payInfo;
  const requirements = route?.params?.requirements;
  const selectedDate = route?.params?.selectedDate;
  const selectedTicket = route?.params?.selectedTicket;
  const usePoint = route?.params?.usePoint;

  const totalPrice = Number(selectedTicket?.ticketAmt) - usePoint - coupon;

  const {data: userInfo} = useReadUserPassQuery({
    id: memberIDUse,
  });

  const [paymentMethod, setPaymentMethod] = useState<PAYMENT_METHOD>(PAYMENT_METHOD.CREDIT_CARD);
  const [isAgreeTerms, setIsAgreeTerms] = useState<boolean>(false);

  const handleConfirm = () => {
    Spinner.show();
    submitParkingReservation({
      memberId: Number(memberIDUse),
      memberPwd: userInfo?.pwd || '',
      agCarNumber: encodeURIComponent(payInfo?.carNumber),
      edDtm: moment(selectedDate).format('YYYYMMDDHHmm'),
      stDtm: moment(selectedDate).format('YYYYMMDDHHmm'),
      parkId: parkingLotID,
      payAmt: totalPrice,
      requirements: encodeURIComponent(requirements),
      TotalTicketType: encodeURIComponent(selectedTicket?.ticketName),
      useCoupon: 0,
      usePoint: 0,
      usePointSklent: 0,
    })
      .unwrap()
      .then(res => {
        if (res?.statusCode === '200') {
          reservationCompletionRef?.current?.show();
        } else {
          showMessage({
            message: `[결제실패] ${res?.statusMsg}`,
          });
        }
      })
      .finally(() => {
        Spinner.hide();
      });
  };

  return (
    <FixedContainer>
      <CustomHeader text="주차 이용권 구매" />

      <ScrollView>
        <UsageHistoryMenuText
          title="주차장명"
          content={<CustomText string={payInfo?.garageName} />}
        />
        <UsageHistoryMenuText
          title="차량번호"
          content={<CustomText string={payInfo?.carNumber} />}
        />
        <UsageHistoryMenuText
          title="결제카드"
          content={
            <CustomText
              string={`${payInfo?.cardName} ${payInfo?.number1}********${payInfo?.number4}`}
            />
          }
        />
        <UsageHistoryMenuText
          title="날짜"
          content={<CustomText string={moment(selectedDate).format('YYYY년 MM월 DD일')} />}
        />
        <UsageHistoryMenuText
          title="종류"
          content={<CustomText string={selectedTicket?.ticketName} />}
        />
        <UsageHistoryMenuText
          title={'이용안내\n(필독)'}
          content={
            <CustomText
              string={payInfo?.issue_text}
              textStyle={{
                padding: PADDING,
                textAlign: 'center',
              }}
              size={FONT.CAPTION}
              color={colors.blue}
            />
          }
        />
        <UsageHistoryMenuText
          title="사용적립금"
          content={
            <View style={styles.contentViewWrapper}>
              <HStack>
                <Icon
                  name="minus-circle-outline"
                  size={widthScale(30)}
                  style={{
                    marginRight: PADDING,
                  }}
                  color={colors.blue}
                />
                <View style={{flex: 1, alignItems: 'center'}}>
                  <CustomText string={`${usePoint} 원 (적립금)`} />
                </View>
              </HStack>
            </View>
          }
        />
        <UsageHistoryMenuText
          title="쿠폰사용금액"
          content={
            <View style={styles.contentViewWrapper}>
              <HStack>
                <Icon
                  name="minus-circle-outline"
                  size={widthScale(30)}
                  style={{
                    marginRight: PADDING,
                  }}
                  color={colors.blue}
                />
                <View style={{flex: 1, alignItems: 'center'}}>
                  <CustomText string={`${coupon} 원 (적립금)`} />
                </View>
              </HStack>
            </View>
          }
        />
        <UsageHistoryMenuText
          title="최종결제"
          pinkColor
          titleColor={colors.white}
          isLastIndex
          content={
            <View style={styles.contentViewWrapper}>
              <HStack>
                <Icon
                  name="pause-circle-outline"
                  size={widthScale(30)}
                  style={{
                    marginRight: PADDING,
                    transform: [{rotate: '90deg'}],
                  }}
                  color={colors.pink2}
                />
                <View style={{flex: 1, alignItems: 'center'}}>
                  <CustomText
                    string={`${getNumberWithCommas(totalPrice)}${strings?.general_text?.won}`}
                    color={colors.pink2}
                    family={FONT_FAMILY.BOLD}
                  />
                </View>
              </HStack>
            </View>
          }
        />

        <View style={{height: PADDING}} />

        <UsageHistoryMenuText
          title="아이디"
          pinkColor
          titleColor={colors.white}
          content={
            <View style={styles.contentViewWrapper}>
              <HStack>
                <Icon
                  name="pause-circle-outline"
                  size={widthScale(30)}
                  style={{
                    marginRight: PADDING,
                    transform: [{rotate: '90deg'}],
                  }}
                  color={colors.pink2}
                />
                <View style={{flex: 1, alignItems: 'center'}}>
                  <CustomText string={memberIDUse} color={colors.pink2} family={FONT_FAMILY.BOLD} />
                </View>
              </HStack>
            </View>
          }
        />
        <UsageHistoryMenuText
          title="비밀번호"
          pinkColor
          isLastIndex
          titleColor={colors.white}
          content={
            <View style={styles.contentViewWrapper}>
              <HStack>
                <Icon
                  name="pause-circle-outline"
                  size={widthScale(30)}
                  style={{
                    marginRight: PADDING / 2,
                    transform: [{rotate: '90deg'}],
                  }}
                  color={colors.pink2}
                />
                <View style={{flex: 1, alignItems: 'center'}}>
                  <CustomText
                    string={userInfo?.pwd || ''}
                    color={colors.pink2}
                    family={FONT_FAMILY.BOLD}
                    textStyle={{
                      textAlign: 'center',
                    }}
                  />
                </View>
              </HStack>
            </View>
          }
        />
        <HStack style={styles.termsWrapper}>
          <Icon name="map-marker-alert" size={widthScale(30)} color={colors.darkGray} />
          <View style={{flex: 1, marginLeft: PADDING / 3}}>
            <CustomText
              color={colors.darkGray}
              size={FONT.CAPTION}
              string={
                '주차비 결제완료 후 결제확인 문자를 보내드립니다.\n정해진 시간에 출차가 이루어져야 합니다.\n이후 출차시 주차비가 추가로 부과됩니다.\n주차권은 적어도 하루전에 미리 구매하시는 것이 좋습니다.\n적립금 사용시 회당 1,000원 까지 사용가능합니다.'
              }
            />
          </View>
        </HStack>
        <UsageHistoryMenuText
          title="쿠폰사용금액"
          isLastIndex
          content={
            <View style={styles.contentViewWrapper}>
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
        />
        <HStack style={styles.termViewWrapper}>
          <TouchableOpacity onPress={() => setIsAgreeTerms(!isAgreeTerms)}>
            <HStack>
              <Checkbox isChecked={isAgreeTerms} onPress={() => setIsAgreeTerms(!isAgreeTerms)} />
              <CustomText
                string="주차요금 및 주차장 이용 약관동의"
                size={FONT.CAPTION_2}
                family={FONT_FAMILY.SEMI_BOLD}
                textStyle={{
                  marginHorizontal: PADDING / 3,
                }}
              />
            </HStack>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => viewTermsRef?.current?.show()}
            style={styles.viewTermButtonWrapper}>
            <CustomText string="약관보기" size={FONT.CAPTION_2} family={FONT_FAMILY.SEMI_BOLD} />
          </TouchableOpacity>
        </HStack>

        <TouchableOpacity onPress={handleConfirm} style={styles.confirmButtonWrapper}>
          <CustomText string="결제하기" color={colors.white} family={FONT_FAMILY.SEMI_BOLD} />
        </TouchableOpacity>
      </ScrollView>

      <ViewTermsPopup ref={viewTermsRef} />

      {/* Reservation completion popup */}
      <ReservationCompletionPopup
        ref={reservationCompletionRef}
        onClose={() => {
          navigation.reset({
            index: 0,
            routes: [{name: ROUTE_KEY.ParkingParkHome}],
          });
        }}
        onChargePromoPress={() => {
          navigation.reset({
            index: 0,
            routes: [{name: ROUTE_KEY.ParkingParkHome}, {name: ROUTE_KEY.DepositMoney}],
          });
        }}
      />
    </FixedContainer>
  );
});
export default ParkingTicketAutoDetail;

const styles = StyleSheet.create({
  contentViewWrapper: {
    width: '100%',
    padding: widthScale(3),
  },
  termsWrapper: {
    borderWidth: 1,
    marginHorizontal: PADDING,
    borderColor: colors.gray,
    padding: PADDING / 2,
    alignItems: 'flex-start',
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
  termViewWrapper: {
    justifyContent: 'center',
    marginVertical: PADDING,
  },
  viewTermButtonWrapper: {
    borderWidth: 1,
    paddingHorizontal: PADDING / 2,
    paddingVertical: PADDING / 3,
    borderRadius: widthScale(5),
    borderColor: colors.gray,
  },
  confirmButtonWrapper: {
    backgroundColor: colors.blue,
    marginHorizontal: PADDING,
    minHeight: heightScale(45),
    marginBottom: PADDING,
    borderRadius: widthScale(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
