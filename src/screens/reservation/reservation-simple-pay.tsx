import moment from 'moment';
import React, {memo, useEffect, useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import WebView from 'react-native-webview';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import DateTimePicker, {DateTimePickerRefs} from '~components/date-time-picker';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import MenuItem from '~components/reservation-simple-pay/menu-item';
import Spinner from '~components/spinner';
import ViewTermsPopup, {
  ViewTermsRefs,
} from '~components/valet-parking-reservation/view-terms-popup';
import {PADDING, width} from '~constants/constant';
import {solar} from '~constants/data';
import {DATE_PICKER_MODE, EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {UserProps} from '~constants/types';
import {RootStackScreenProps} from '~navigators/stack';
import {useTicketInfoQuery} from '~services/parkingServices';
import {
  useRequestParkingRestrictionQuery,
  useRequestPayInfoQuery,
  useSubmitParkingReservationMutation,
} from '~services/reservationServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {getUserPointAndChange} from '~utils/getUserPointAndChange';
import {getDayName, getFullDayName, getFullHourName} from '~utils/hourUtils';
import {getNumberWithCommas} from '~utils/numberUtils';

const ReservationSimplePay = memo((props: RootStackScreenProps<'ReservationSimplePay'>) => {
  const {navigation, route} = props;
  const parkId = route?.params?.parkId;
  const parkTicketName = route?.params?.parkTicketName;
  const requirements = route?.params?.requirements;

  const holidayList: string[] = solar;
  const weekendNameList: string[] = ['토', '일'];

  const getTimeBefore = (): number => {
    const hour = requirements.substring(0, requirements.indexOf('시'));
    const min = requirements.substring(requirements.indexOf('시') + 1, requirements.indexOf('분'));

    return moment()
      .set({
        hour: Number(hour),
        minute: Number(min),
      })
      .valueOf();
  };

  const viewTermsRef = useRef<ViewTermsRefs>(null);
  const dayPickerRef = useRef<DateTimePickerRefs>(null);
  const timePickerRef = useRef<DateTimePickerRefs>(null);

  const userInfo = useAppSelector(state => state?.userReducer?.user) as UserProps;
  const userToken = useAppSelector(state => state?.userReducer?.userToken);
  const userCordinate = useAppSelector(state => state?.coordinateReducer?.userCordinate);

  const {data: payInfo} = useRequestPayInfoQuery({
    id: userToken?.id,
    pass: userToken?.password,
    parkingID: Number(parkId),
  });
  const {data: parkingRestriction} = useRequestParkingRestrictionQuery({
    parkId: Number(parkId),
  });
  const {data: parkingTicket} = useTicketInfoQuery({
    id: Number(parkId),
  });
  const [submitParkingReservation] = useSubmitParkingReservationMutation();

  let ticketAmount = parkingTicket?.find(it => it?.ticketName === parkTicketName)?.ticketAmt || 0;

  const [day, setDay] = useState<number>(moment().valueOf());
  const [time, setTime] = useState<number>(getTimeBefore() ? getTimeBefore() : moment().valueOf());
  const [point, setPoint] = useState<string>('0');
  const [charge, setCharge] = useState<string>('0');
  const [isAgreeTerms, setIsAgreeTerms] = useState<boolean>(true);
  const [isSetPoint, setIsSetPoint] = useState<boolean>(false);
  const [isSetInout, setIsSetInout] = useState<boolean>(false);

  const isHoliday = holidayList?.includes(moment(day).format('MMDD'));
  const isWeek = weekendNameList.includes(getDayName(day));

  let checkRestriction: boolean = false;

  const selectedTicket = parkingTicket?.find(it => it?.ticketName === parkTicketName);

  if (parkingRestriction) {
    checkRestriction = parkingRestriction.some(element => {
      const startDate = moment(element?.start_date, 'YYYYMMDD').valueOf();
      const endDate = moment(element?.end_date, 'YYYYMMDD').valueOf();
      return moment(day).isBetween(startDate, endDate);
    });
  }

  useEffect(() => {
    if (point === '') {
      setPoint('0');
    }
    if (charge === '') {
      setCharge('0');
    }
  }, []);

  const checkDayRestriction = (value: number) => {
    const isBetween =
      parkingRestriction &&
      parkingRestriction?.find(item =>
        moment(value).isBetween(
          moment(item?.start_date, 'YYYYMMDD'),
          moment(item?.end_date, 'YYYYMMDD'),
          'day',
          '[]',
        ),
      );

    return isBetween;
  };

  const checkTimeBig = (
    hourOfDay: number,
    minute: number,
    standardHour: number,
    standardMin: number,
  ): boolean => {
    if (hourOfDay >= standardHour) {
      if (hourOfDay === standardHour) {
        return minute >= standardMin;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  const checkTimeSmall = (
    hourOfDay: number,
    minute: number,
    standardHour: number,
    standardMin: number,
  ): boolean => {
    if (hourOfDay <= standardHour) {
      if (hourOfDay === standardHour) {
        return minute <= standardMin;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  const checkReservationTime = (
    hourOfDay: number,
    minute: number,
    ticketStartHour: number,
    ticketStartMin: number,
    ticketEndHour: number,
    ticketEndMin: number,
  ): boolean => {
    console.log(`time // ${hourOfDay}:${minute}`);
    console.log(`ticketStart // ${ticketStartHour}:${ticketStartMin}`);
    console.log(`ticketEnd // ${ticketEndHour}:${ticketEndMin}`);

    if (
      ticketStartHour === 0 &&
      ticketStartMin === 0 &&
      ticketEndHour === 0 &&
      ticketEndMin === 0
    ) {
      return true;
    } else if (ticketStartHour <= ticketEndHour) {
      return (
        checkTimeBig(hourOfDay, minute, ticketStartHour, ticketStartMin) &&
        checkTimeSmall(hourOfDay, minute, ticketEndHour, ticketEndMin)
      );
    } else {
      if (hourOfDay > ticketEndHour) {
        if (hourOfDay >= ticketStartHour) {
          return checkTimeBig(hourOfDay, minute, ticketStartHour, ticketStartMin);
        } else {
          return false;
        }
      } else {
        return checkTimeSmall(hourOfDay, minute, ticketEndHour, ticketEndMin);
      }
    }
  };

  const handleCheckTimeReservation = (time: number) => {
    console.log('Selected Time:', time);
    const selectedTimeHour = moment(time).format('HH');
    const selectedTimeMin = moment(time).format('mm');
    const tickStartHour = selectedTicket?.ticketStart?.split(':')[0];
    const tickStartMin = selectedTicket?.ticketStart?.split(':')[1];
    const tickEndHour = selectedTicket?.ticketEnd?.split(':')[0];
    const tickEndMin = selectedTicket?.ticketEnd?.split(':')[1];

    const paddedSelectedTimeHour = selectedTimeHour.padStart(2, '0');
    const paddedSelectedTimeMin = selectedTimeMin.padStart(2, '0');

    if (
      checkReservationTime(
        Number(paddedSelectedTimeHour),
        Number(paddedSelectedTimeMin),
        Number(tickStartHour),
        Number(tickStartMin),
        Number(tickEndHour),
        Number(tickEndMin),
      )
    ) {
      setTime(time);
      console.log('Time updated:', time);
    } else {
      showMessage({
        message: `주차권 이용시간 내 (${selectedTicket?.ticketStart} ~ ${selectedTicket?.ticketEnd}) 시간을 선택해주세요.`,
      });
      return;
    }
  };

  const handleSubmit = () => {
    // 선택한 주차권의 매진 날짜 제한을 확인
    const ticketLimitDates = selectedTicket?.ticketdayLimit
      ? selectedTicket.ticketdayLimit.split('/').map(date => moment(date, 'YYMMDD').toDate())
      : [];

    const isDateSoldOut = ticketLimitDates.some(ticketDate =>
      moment(day).isSame(ticketDate, 'day'),
    );

    if (isDateSoldOut) {
      showMessage({
        message:
          '선택하신 주차권의 해당일은 현재 매진되었습니다. \n판매제한은 매일 갱신되며 다른날짜를 이용해주세요',
      });
      return;
    }

    if (!parkTicketName) {
      showMessage({
        message: '해당 주차권은 현재 이용하실 수 없습니다.',
      });
      return;
    }
    if (checkDayRestriction(day)) {
      showMessage({
        message:
          '현재 해당일은 매진으로 구매할 수 없습니다. 판매제한은 매일 갱신되며 선택한 날짜에 \n주차권 구매가 제한될 경우 고객센터\n(010-5949-0981) 또는 카카오톡으로 문의 바랍니다.',
      });
      return;
    }

    if (!payInfo?.carNumber) {
      showMessage({
        message: '해당 차량번호는 현재 이용하실 수 없습니다.',
      });
      return;
    }
    if (Number(ticketAmount) == 0) {
      showMessage({
        message:
          '해당 주차권 상품이 변경되어 간편예약이 아닌 메인화면 해당주차장 진입후 결제 가능합니다',
      });
      return;
    }
    if (Number(ticketAmount) <= 0) {
      showMessage({
        message: '현재 해당 주차권은 이용하실 수 없습니다.',
      });
      return;
    }
    if (!day) {
      showMessage({
        message: '날짜를 선택해 주세요',
      });
      return;
    }
    if (!time) {
      showMessage({
        message: '시간을 선택해 주세요',
      });
      return;
    }
    if (!isAgreeTerms) {
      showMessage({
        message: '주차요금 및 주차장 이용 약관을 확인해주세요',
      });
      return;
    }

    if (payInfo?.dayNameGubun?.split('/')?.includes(getDayName(day))) {
      showMessage({
        message: '선택하신 날짜에 주차장은 만차 또는 주차장 사정으로 이용이 불가능합니다.',
      });
      return;
    }
    if (checkRestriction) {
      showMessage({
        message: '선택하신 날짜에 주차장은 만차 또는 주차장 사정으로 이용이 불가능합니다.',
      });
      return;
    }
    if (!point) {
      setPoint('0');
    }
    if (!charge) {
      setCharge('0');
    }
    if (point !== '' && charge !== '') {
      // 값이 입력되었는지 확인
      const strPointLastWord = point.substring(point.length - 1);
      const strChargeLastWord = charge.substring(charge.length - 1);
      if (strPointLastWord !== '0') {
        showMessage({
          message: '1원단위는 사용불가능합니다',
        });
        return;
      }
      if (strChargeLastWord !== '0') {
        showMessage({
          message: '1원단위는 사용불가능합니다',
        });
        return;
      }
    } else {
      showMessage({
        message: '사용 적립금과 충전금을 정상적으로 입력해주세요.',
      });
      return;
    }
    if (Number(point) > 1000) {
      showMessage({
        message: '회당 적립금 1천원까지 사용가능합니다.',
      });
      return;
    }
    if (Number(point) > getUserPointAndChange(userInfo)?.userPoint) {
      showMessage({
        message: '입력하신 적립금이 잔여 적립금보다 큽니다.',
      });
      return;
    }
    if (Number(charge) > getUserPointAndChange(userInfo)?.userCharge) {
      showMessage({
        message: '입력하신 충전금이 잔여 충전금보다 큽니다.',
      });
      return;
    }
    if (Number(ticketAmount) < 6000) {
      if (Number(point) > 0) {
        showMessage({
          message: '6,000 원 이상만 적립금을 사용할 수 있습니다.',
        });
        return;
      }
    }
    if (Number(point) > Number(ticketAmount)) {
      showMessage({
        message: '입력하신 적립금이 구매할 주차권의 금액보다 큽니다.',
      });
      return;
    }
    if (Number(charge) > Number(ticketAmount)) {
      showMessage({
        message: '입력하신 충전금이 구매할 주차권의 금액보다 큽니다.',
      });
      return;
    }
    if (isWeek && parkTicketName.includes('평일')) {
      showMessage({
        message: '선택하신 날짜는 주말(토,일)이므로 해당 상품으로는 결제 불가능합니다.',
      });
      return;
    }
    if (!isWeek && parkTicketName.includes('주말') && !isHoliday) {
      showMessage({
        message: '선택하신 날짜는 평일이므로 해당 상품으로는 결제 불가능합니다.',
      });
      return;
    }
    if (!isWeek && parkTicketName.includes('휴일') && !isHoliday) {
      showMessage({
        message: '선택하신 날짜는 평일이므로 해당 상품으로는 결제 불가능합니다.',
      });
      return;
    }
    if (parkTicketName.includes('평일') && isHoliday) {
      showMessage({
        message:
          '선택하신 날짜는 공휴일로 공휴일권을 선택하셔야합니다. (공휴일권이 없으시면 주말1일권을 선택하세요.)',
      });
      return;
    }

    // 요일 지정형 주차권 예: "평일 당일권(화)" → 반드시 화요일만 예약 가능
    const dayKorMap: {[key: number]: string} = {
      0: '일',
      1: '월',
      2: '화',
      3: '수',
      4: '목',
      5: '금',
      6: '토',
    };

    const actualDay = dayKorMap[moment(day).day()];

    if (parkTicketName) {
      const dayMatch = parkTicketName.match(/\((월|화|수|목|금|토|일)\)/);
      if (dayMatch && actualDay && dayMatch[1] !== actualDay) {
        showMessage({
          message: `선택하신 주차권은 '${dayMatch[1]}'요일 전용입니다. 해당 요일에만 예약 가능합니다.`,
        });
        return;
      }
    }

    const payableAmt = Number(ticketAmount) - Number(point) - Number(charge);
    if (payableAmt < 0) {
      showMessage({
        message: '결제액이 0원 이하입니다. 적립금과 충전금을 확인해주세요.',
      });
      return;
    }

    Spinner.show();
    const requirementsValue = encodeURIComponent(
      getFullHourName(time)
        .replace(/\s/g, '')
        .replace(/오전|오후/g, ''),
    );

    const body = {
      agCarNumber: encodeURIComponent(payInfo?.carNumber),
      edDtm: `${moment(day).format('YYYYMMDD')}${moment(time).format('HHmm')}`,
      stDtm: `${moment(day).format('YYYYMMDD')}${moment(time).format('HHmm')}`,
      memberId: userToken?.id,
      memberPwd: userToken?.password,
      parkId: Number(parkId),
      payAmt: payableAmt,
      payLocation: `${userCordinate?.lat}/${userCordinate?.long}`,
      requirements: requirementsValue, // Use the updated time value here
      TotalTicketType: encodeURIComponent(parkTicketName),
      useCoupon: 0,
      usePoint: Number(point),
      usePointSklent: Number(charge),
    };

    submitParkingReservation(body)
      .unwrap()
      .then(res => {
        console.log('res ne', res);
        if (res?.statusCode === '200') {
          setIsSetPoint(true);
        } else {
          showMessage({
            message: `결제에 실패하셨습니다. 원인: ${res?.statusMsg}`,
          });
          Spinner.hide();
        }
      });
  };

  useEffect(() => {
    if (payInfo && payInfo?.limitedNumber <= 0) {
      showMessage({
        message: '해당 주차장은 현재 이용할 수 없습니다.',
      });
      navigation.goBack();
    }
  }, [payInfo]);

  return (
    <FixedContainer>
      <CustomHeader text="이용주차장 간편예약" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: PADDING,
        }}>
        <CustomText string="입차 전 결제 해주셔야 합니다." size={FONT.CAPTION} />
        <CustomText
          string="(입차 후 결제로 인한 현장결제 시 취소 불가)"
          color={colors.red}
          textStyle={{
            marginVertical: heightScale(3),
          }}
          size={FONT.CAPTION}
        />
        <CustomText
          string="만차 혹은 현장 사정에 따라서 주차가 어려울 수 있습니다."
          size={FONT.CAPTION}
        />

        <View
          style={{
            marginVertical: heightScale(10),
          }}>
          <MenuItem title="주차장명:" content={<CustomText string={payInfo?.garageName || ''} />} />
          <MenuItem title="주차권명:" content={<CustomText string={parkTicketName} />} />
          <MenuItem
            title="주차권금액:"
            content={
              <CustomText
                string={`${getNumberWithCommas(ticketAmount)}${strings?.general_text?.won}`}
              />
            }
          />
          <MenuItem title="차량번호:" content={<CustomText string={payInfo?.carNumber || ''} />} />
        </View>

        <Divider />

        <View style={{marginTop: heightScale(10)}}>
          <MenuItem
            title="입차일"
            content={
              <TouchableOpacity onPress={() => dayPickerRef?.current?.show()}>
                <HStack>
                  <View style={styles.dateWrapper}>
                    <CustomText string={getFullDayName(day)} />
                  </View>
                  <Icon name="calendar-outline" size={widthScale(30)} />
                </HStack>
              </TouchableOpacity>
            }
          />

          <CustomText
            string={moment(
              new Date(new Date().getTime() + (payInfo?.a1TicketCost || 0) * 24 * 60 * 60 * 1000),
            ).format('(MM월DD일까지 예약가능)')}
            textStyle={{
              marginLeft: widthScale(150),
              marginBottom: heightScale(10),
            }}
            color={colors.red}
          />

          <MenuItem
            title="입차시간"
            content={
              <TouchableOpacity
                onPress={() => {
                  console.log('Opening time picker');
                  timePickerRef?.current?.show();
                }}>
                <HStack>
                  <View style={styles.dateWrapper}>
                    <CustomText string={getFullHourName(time)} />
                  </View>
                  <Icon name="clock-outline" size={widthScale(30)} />
                </HStack>
              </TouchableOpacity>
            }
          />

          <MenuItem
            title="적립금"
            content={
              <TouchableOpacity>
                <HStack>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      placeholder="적립금을 입력해주세요"
                      value={point}
                      onChangeText={text => setPoint(text.replace(/[^0-9]/g, ''))}
                      keyboardType="number-pad"
                      style={{flex: 1}}
                      placeholderTextColor={colors.grayText}
                    />
                  </View>
                  <CustomText
                    string={`/ ${getNumberWithCommas(getUserPointAndChange(userInfo)?.userPoint)}${
                      strings?.general_text?.won
                    }`}
                  />
                </HStack>
              </TouchableOpacity>
            }
          />
          <MenuItem
            title="충전금"
            content={
              <TouchableOpacity>
                <HStack>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      placeholder="충전금을 입력해주세요"
                      value={charge}
                      onChangeText={text => setCharge(text.replace(/[^0-9]/g, ''))}
                      keyboardType="number-pad"
                      style={{flex: 1}}
                      placeholderTextColor={colors.grayText}
                    />
                  </View>
                  <CustomText
                    string={`/ ${getNumberWithCommas(getUserPointAndChange(userInfo)?.userCharge)}${
                      strings?.general_text?.won
                    }`}
                  />
                </HStack>
              </TouchableOpacity>
            }
          />
        </View>
        <CustomText
          string="(주차권요금 6,000원 이상) 적립금은 회당 1,000원까지 사용가능"
          size={FONT.CAPTION}
          color={colors.darkGray}
        />

        {payInfo?.issue_text ? (
          <View style={styles.issueWrapper}>
            <CustomText
              string={payInfo?.issue_text || ''}
              size={FONT.CAPTION}
              family={FONT_FAMILY.BOLD}
            />
          </View>
        ) : null}

        <HStack style={styles.termsWrapper}>
          <TouchableOpacity
            onPress={() => {
              setIsAgreeTerms(!isAgreeTerms);
            }}>
            <HStack>
              <View style={styles.selectorWrapper}>
                <View
                  style={[
                    styles.selector,
                    {
                      backgroundColor: isAgreeTerms ? colors.red : colors.transparent,
                    },
                  ]}
                />
              </View>
              <CustomText
                string="주차요금 및 주차장 이용 약관동의"
                size={FONT.CAPTION}
                color={colors.darkGray}
                family={FONT_FAMILY.SEMI_BOLD}
                textStyle={{
                  marginHorizontal: PADDING,
                }}
              />
            </HStack>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              viewTermsRef?.current?.show();
            }}
            style={styles.openTermsButtonWrapper}>
            <CustomText string="약관보기" size={FONT.CAPTION} />
          </TouchableOpacity>
        </HStack>

        {/* Confirm */}
        <TouchableOpacity onPress={handleSubmit} style={styles.confirmButtonWrapper}>
          <CustomText string="결제하기" color={colors.white} family={FONT_FAMILY.SEMI_BOLD} />
        </TouchableOpacity>
      </ScrollView>

      {/* Terms */}
      <ViewTermsPopup ref={viewTermsRef} />
      {/* Day picker */}
      <DateTimePicker ref={dayPickerRef} mode={DATE_PICKER_MODE.DATE} onSelect={setDay} />
      {/* Time picker */}
      <DateTimePicker
        ref={timePickerRef}
        mode={DATE_PICKER_MODE.TIME}
        onSelect={handleCheckTimeReservation}
      />

      {/* Set point */}
      {isSetPoint ? (
        <WebView
          source={{
            uri: `http://cafe.wisemobile.kr/imobile/pay_lite/pointInsert.php?mmid=${
              userToken?.id
            }&selectedDate=${moment(day).format('YYYYMMDD')}${moment(time).format(
              'HHmm',
            )}&requirements=${getFullHourName(time)}&totalPrice=${
              Number(ticketAmount) - Number(point) - Number(charge)
            }&parkId=${parkId}`,
          }}
          onLoadEnd={() => {
            setTimeout(() => {
              setIsSetInout(true);
            }, 100);
          }}
          originWhitelist={['*']}
        />
      ) : null}

      {/* Set Inout */}
      {isSetInout ? (
        <WebView
          source={{
            uri: `http://cafe.wisemobile.kr/imobile/pay_lite/android_payResult_ticket.php?mmid=${
              userToken?.id
            }&selectedDate=${moment(day).format('YYYYMMDD')}${moment(time).format(
              'HHmm',
            )}&requirements=${getFullHourName(time)}&totalPrice=${
              Number(ticketAmount) - Number(point) - Number(charge)
            }&TotalTicketType=${parkTicketName}&parkId=${parkId}&easypay=y&intime=${getFullHourName(
              time,
            )}`,
          }}
          originWhitelist={['*']}
          onLoadEnd={() => {
            setTimeout(() => {
              Spinner.hide();
              showMessage({
                message: `주차장명: ${payInfo?.garageName}\n주차권명: ${parkTicketName}\n간편예약이 완료되었습니다`,
              });
              DeviceEventEmitter.emit(EMIT_EVENT.REFETCH_QUICK_RESERVATION);
              navigation.goBack();
            }, 100);
          }}
        />
      ) : null}
    </FixedContainer>
  );
});

export default ReservationSimplePay;

const styles = StyleSheet.create({
  dateWrapper: {
    flex: 1,
    borderRadius: widthScale(5),
    borderWidth: 1,
    borderColor: colors.gray,
    paddingVertical: heightScale(10),
    alignItems: 'center',
    marginRight: widthScale(10),
  },
  issueWrapper: {
    marginVertical: heightScale(10),
    borderWidth: 1,
    borderColor: colors.darkGray,
    padding: PADDING / 2,
  },
  inputWrapper: {
    minHeight: heightScale(30),
    borderWidth: 1,
    borderColor: colors.gray,
    paddingHorizontal: PADDING / 3,
    marginRight: widthScale(10),
    borderRadius: widthScale(5),
    flex: 1,
  },
  termsWrapper: {
    alignSelf: 'center',
  },
  openTermsButtonWrapper: {
    borderWidth: 1,
    borderColor: colors.darkGray,
    padding: PADDING / 3,
    borderRadius: widthScale(5),
  },
  selectorWrapper: {
    borderWidth: 1,
    borderColor: colors.gray,
    width: widthScale(20),
    height: widthScale(20),
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selector: {
    width: widthScale(14),
    height: widthScale(14),
    borderRadius: 999,
    backgroundColor: colors.red,
  },
  confirmButtonWrapper: {
    minHeight: heightScale(45),
    backgroundColor: colors.red,
    marginVertical: PADDING / 2,
    width: width * 0.7,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: widthScale(5),
  },
});
