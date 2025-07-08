import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ICONS, IMAGES} from '~/assets/images-path';
import Button from '~components/button';
import ButtonCardReservation from '~components/button-card-reservation';
import ButtonComnponent from '~components/button-component';
import ButtonShowBottom from '~components/button-show-bottom';
import CheckboxText from '~components/checkbox-text';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import {ChooseYearModalRefObject} from '~components/modal-choose-year';
import ModalDateTimePicker from '~components/modal-date-picker';
import ModalHelpReservation from '~components/modal-help-reservation';
import ModalTimePicker from '~components/modal-time-picker';
import RadioButton from '~components/radio-button';
import ChargePromoPopup, {ChargePromoRefs} from '~components/reservation/charge-promo-popup';
import CurationPopup, {CurationPopupRefs} from '~components/reservation/curation-popup';
import ReservationCheck, {ReservationCheckRefs} from '~components/reservation/reservation-check';
import ReservationCompletionPopup, {
  ReservationCompletionRefs,
} from '~components/reservation/reservation-completion-popup';
import ReservationConfirmPopup, {
  ReservationConfirmRefs,
} from '~components/reservation/reservation-confirm-popup';
import ReservationCoupon from '~components/reservation/reservation-coupon';
import TicketItem from '~components/reservation/ticket-item';
import TextBorder from '~components/text-border';
import TextInputChoose from '~components/textinput-choose-date';
import TextInputVoucherReservation from '~components/textinput-voucher-reservation';
import {PADDING} from '~constants/constant';
import {solar} from '~constants/data';
import {EMIT_EVENT, FONT, FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import {strings} from '~constants/strings';
import {CouponProps, TicketProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetParkingCouponQuery} from '~services/couponServices';
import {useTicketInfoQuery} from '~services/parkingServices';
import {
  useRequestParkingRestrictionQuery,
  useRequestPayInfoQuery,
} from '~services/reservationServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, heightScale1, scale1, widthScale, widthScale1} from '~styles/scaling-utils';
import {getNumberWithCommas} from '~utils/numberUtils';

import CustomCheckbox from '~components/custom-checkbox';

const Reservation = (props: RootStackScreenProps<'Reservation'>) => {
  const {navigation, route} = props;

  const parkingLot = route?.params?.parkingLot;

  const userToken = useAppSelector(state => state?.userReducer?.userToken);
  const userInfo = useAppSelector(state => state?.userReducer?.user);

  const [parkingTicketList, setParkingTicketList] = useState<TicketProps[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketProps | null>(null);
  const [dateHire, setDateHire] = useState<Date | undefined>(undefined);
  const [timeHire, setTimeHire] = useState<Date | undefined>(undefined);
  const [isCheckFullUsePoints, setIsCheckFullUsePoints] = useState<boolean>(false);
  const [point, setPoint] = useState<string>('');
  const [charge, setCharge] = useState<string>('');
  const [coupon, setCoupon] = useState(0);
  const [isCheckReservationCBRule, setIsCheckReservationCBRule] = useState<boolean>(false);
  const [isCheckReservationCBAgree, setIsCheckReservationCBAgree] = useState<boolean>(false);
  const [isCheckingReservation, setIsCheckingReservation] = useState<boolean>(false);

  const [isAutoPaymentChecked, setIsAutoPaymentChecked] = useState<boolean>(false);

  const {
    data: payInfo,
    isSuccess,
    refetch: refetchPayInfo,
  } = useRequestPayInfoQuery({
    id: userToken?.id,
    parkingID: parkingLot?.id,
    pass: userToken?.password,
  });

  useEffect(() => {
    const payCardListener = DeviceEventEmitter.addListener(EMIT_EVENT.PAYMENT_CARD, () => {
      refetchPayInfo();
    });

    const updatedCarListener = DeviceEventEmitter.addListener(EMIT_EVENT.UPDATED_CAR, () => {
      refetchPayInfo();
    });

    return () => {
      payCardListener.remove();
      updatedCarListener.remove();
    };
  }, []);

  const {data: parkingTickets} = useTicketInfoQuery({
    id: parkingLot?.id,
  });

  const {data: parkingRestriction} = useRequestParkingRestrictionQuery({
    parkId: parkingLot?.id,
  });

  // const parkingRestriction: ParkingRestrictionProps[] = [
  //   {
  //     end_date: '20230411',
  //     start_date: '20230411',
  //     parkId: '123',
  //     parkName: 'abc',
  //   },
  // ];

  useEffect(() => {
    if (isSuccess) {
      if (!payInfo) {
        showMessage({
          message: '차량번호와 카드등록을 해주세요!',
        });
        navigation.navigate(ROUTE_KEY.CardRegistration, {});
        return;
      }

      if (!payInfo?.carNumber || payInfo?.carNumber === 'null') {
        showMessage({
          message: '차량번호를 등록해 주세요!',
        });
        navigation.navigate(ROUTE_KEY.VehicleNumberManagement);
        return;
      }

      if (!payInfo?.pnum || payInfo?.pnum === '0') {
        showMessage({
          message: '휴대폰 번호를 등록해 주세요!',
        });
        navigation.navigate(ROUTE_KEY.EditUserInfo);
        return;
      }
    }
  }, [payInfo, isSuccess]);

  const chooseCalendarRef = useRef<ChooseYearModalRefObject>(null);
  const chooseTimeRef = useRef<ChooseYearModalRefObject>(null);
  const helpReservationRef = useRef<any>(null);
  const scrollviewRef = useRef<ScrollView>(null);
  const curationRef = useRef<CurationPopupRefs>(null);
  const reservationConfirmRef = useRef<ReservationConfirmRefs>(null);
  const reservationCheckRef = useRef<ReservationCheckRefs>(null);
  const reservationCompletionRef = useRef<ReservationCompletionRefs>(null);
  const chargePromoRef = useRef<ChargePromoRefs>(null);

  const onPressAgreeConfirmAll = () => {
    setIsCheckReservationCBRule(true);
    setIsCheckReservationCBAgree(true);
    showMessage({
      message: '모두 확인 후 동의하셨습니다.',
    });
  };

  const getDayName = (date: Date) => {
    const day = moment(date.valueOf()).day() + 1;

    switch (day) {
      case 1:
        return '일';

      case 2:
        return '월';

      case 3:
        return '화';

      case 4:
        return '수';

      case 5:
        return '목';

      case 6:
        return '금';

      case 7:
        return '토';

      default:
        return '';
    }
  };

  const getReservationTvType = () => {
    if (payInfo?.wifiYN === IS_ACTIVE.NO) {
      return '자주식';
    } else if (payInfo?.wifiYN === IS_ACTIVE.YES) {
      return '기계식';
    } else if (payInfo?.wifiYN === IS_ACTIVE.A) {
      return '혼합식';
    } else {
      return '';
    }
  };

  useEffect(() => {
    if (parkingTickets) {
      let mIsMonth: boolean = false;
      {
        /*parkingTickets.forEach(item => {
        if (item?.ticketName?.includes('월주차권')) {
          mIsMonth = true;
        }
        if (item?.ticketName?.includes('월연장권')) {
          mIsMonth = true;
        }
      });*/
      }
      if (mIsMonth) {
        const tempt = [
          ...parkingTickets,
          {
            ticketAmt: '0',
            ticketEnd: '00:00',
            ticketName: '월주차권 자동신청',
            ticketOrder: 0,
            ticketStart: '00:00',
            ticketText:
              '해당 서비스는 만료일 또는 매월(20일~21일)에 자동으로 결제 및 갱신되는 서비스입니다.(신규가능 및 연장고객전용)',
            // --- TicketProps 타입에 맞게 정확한 기본값으로 수정 ---
            ticketLimit: 0, // number 타입이므로 0으로 초기화
            ticketRealTime: 0, // number 타입이므로 0으로 초기화
            ticketRate: 0, // number 타입이므로 0으로 초기화
            ticketdayLimit: '', // string 타입이므로 빈 문자열로 초기화
          },
        ];
        setParkingTicketList(tempt);
        setSelectedTicket(tempt[0]);
      } else {
        setParkingTicketList(parkingTickets);
        setSelectedTicket(parkingTickets[0]);
      }
    }
  }, [parkingTickets]);

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

  const checkDayNameGubun = (date: Date): boolean => {
    if (payInfo?.dayNameGubun) {
      return payInfo?.dayNameGubun?.split('/').includes(getDayName(date));
    }

    return false;
  };

  const dayOfWeek = () => {
    const day = moment(dateHire?.valueOf()).day() + 1;
    switch (day) {
      case 1:
        return '주말';
      case 2:
        return '평일';
      case 3:
        return '평일';
      case 4:
        return '평일';
      case 5:
        return '평일';
      case 6:
        return '평일';
      case 7:
        return '주말';
      default:
        return '';
    }
  };

  const handleConfirm = (isAutoPaymentChecked: boolean) => {
    console.log('Auto Payment Checked:', isAutoPaymentChecked);

    if (!payInfo?.cardName) {
      showMessage({
        message: '결제카드를 등록해주세요',
      });
      return;
    }

    if (!dateHire) {
      showMessage({
        message: '날짜를 선택해 주세요',
      });
      return;
    }

    if (!timeHire) {
      showMessage({
        message: '시간을 선택해 주세요',
      });
      return;
    }

    if (!isCheckReservationCBRule) {
      showMessage({
        message: '주차장 이용규칙을 확인해주세요',
      });
      return;
    }

    if (!isCheckReservationCBAgree) {
      showMessage({
        message: '주차장 이용동의를 확인해주세요',
      });
      return;
    }

    if (!selectedTicket) {
      showMessage({
        message: '주차권을 선택해주세요',
      });
      return;
    }

    if (!selectedTicket?.ticketName) {
      showMessage({
        message: '주차권을 선택해주세요',
      });
      return;
    }

    if (!payInfo?.carNumber) {
      showMessage({
        message: '차량번호를 입력하시지않으셨습니다.\n상단 추가정보 입력에서 입력바랍니다.',
      });
      return;
    }

    if (!payInfo?.pnum) {
      showMessage({
        message: '핸드폰번호를 입력하시지않으셨습니다.\n상단 추가정보 입력에서 입력바랍니다.',
      });
    }

    if (checkDayNameGubun(dateHire)) {
      curationRef?.current?.show(
        '해당일 판매완료',
        '해당 주차장의 선택하신 날은 만차 또는 주차장 사정으로 결제가 불가능합니다.',
        parkingLot?.id,
      );
      return;
    }

    if (!point) {
      setPoint('0');
    }

    if (!charge) {
      setCharge('0');
    }

    if (Number(point) > userPoint) {
      showMessage({
        message: '입력하신 적립금이 잔여 적립금보다 큽니다.',
      });
      return;
    }

    if (Number(charge) > userCharge) {
      showMessage({
        message: '입력하신 충전금이 잔여 충전금보다 큽니다.',
      });
      return;
    }

    let ticketAmt = -1;

    try {
      ticketAmt = Number(selectedTicket?.ticketAmt);
    } catch (error) {
      console.log('🚀 ~ file: reservation.tsx:374 ~ handleConfirm ~ error', error);
    }

    if (ticketAmt < 0) {
      showMessage({
        message: '주차권 구매 오류입니다. 다시 구매하시길 바랍니다.',
      });
      return;
    }

    if (ticketAmt < 6000) {
      if (Number(point) > 0) {
        showMessage({
          message: '6,000 원 이상만 적립금을 사용할 수 있습니다.',
        });
        return;
      }
    }

    if (ticketAmt < 99999) {
      if (Number(point) > 1000) {
        showMessage({
          message: '회당 적립금 1천원까지 사용가능합니다.',
        });
        return;
      }
    } else if (ticketAmt < 149999) {
      if (Number(point) > 3000) {
        showMessage({
          message: '회당 적립금 3천원까지 사용가능합니다.',
        });
        return;
      }
    } else if (ticketAmt < 999999) {
      if (Number(point) > 5000) {
        showMessage({
          message: '회당 적립금 5천원까지 사용가능합니다.',
        });
        return;
      }
    }

    if (Number(point) > ticketAmt) {
      showMessage({
        message: '입력하신 적립금이 구매할 주차권의 금액보다 큽니다.',
      });
      return;
    }

    if (Number(charge) > ticketAmt) {
      showMessage({
        message: '입력하신 충전금이 구매할 주차권의 금액보다 큽니다.',
      });
      return;
    }

    let limitedNumber = 0;
    try {
      limitedNumber = Number(payInfo?.limitedNumber);
    } catch (error) {
      console.log('🚀 ~ file: reservation.tsx:437 ~ handleConfirm ~ error', error);
    }

    if (limitedNumber < 1) {
      reservationConfirmRef?.current?.show(
        '해당일 판매완료',
        '해당 주차장의 선택하신 날은\n만차 또는 주차장 사정으로 결제가 불가능합니다.',
      );
    }

    let isHoliday: boolean = false;

    if (solar.includes(moment(dateHire.valueOf()).format('MMDD'))) {
      isHoliday = true;
    }

    if (dayOfWeek() === '주말' && selectedTicket?.ticketName?.includes('평일')) {
      showMessage({
        message: '선택하신 날짜는 주말(토,일)이므로 해당 상품으로는 결제 불가능합니다.',
      });
      return;
    }

    if (dayOfWeek() === '평일' && selectedTicket?.ticketName?.includes('주말') && !isHoliday) {
      showMessage({
        message: '선택하신 날짜는 평일이므로 해당 상품으로는 결제 불가능합니다.',
      });
      return;
    }

    if (dayOfWeek() === '평일' && selectedTicket?.ticketName?.includes('휴일') && !isHoliday) {
      showMessage({
        message: '선택하신 날짜는 평일이므로 해당 상품으로는 결제 불가능합니다.',
      });
      return;
    }

    if (selectedTicket?.ticketName?.includes('평일') && isHoliday) {
      showMessage({
        message: '선택하신 날짜는 공휴일로 주말1일권을 선택하셔야합니다.',
      });
      return;
    }

    const dayKorMap: {[key: number]: string} = {
      0: '일',
      1: '월',
      2: '화',
      3: '수',
      4: '목',
      5: '금',
      6: '토',
    };

    const actualDay = dateHire ? dayKorMap[moment(dateHire).day()] : null;

    // ticketName에 (월), (화) ... 포함되어 있다면 실제 날짜 요일과 일치해야만 예약 가능
    if (selectedTicket?.ticketName) {
      const dayMatch = selectedTicket.ticketName.match(/\((월|화|수|목|금|토|일)\)/);
      if (dayMatch && actualDay && dayMatch[1] !== actualDay) {
        showMessage({
          message: `선택하신 주차권은 '${dayMatch[1]}'요일 전용입니다. 해당 요일에만 예약 가능합니다.`,
        });
        return;
      }
    }

    setIsCheckingReservation(true);
    reservationCheckRef?.current?.show();
  };

  const checkDayRestriction = (value: Date) => {
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

  const handleCheckTimeReservation = (time: Date) => {
    const selectedTimeHour = moment(time).format('HH');
    const selectedTimeMin = moment(time).format('mm');
    const tickStartHour = selectedTicket?.ticketStart?.split(':')[0];
    const tickStartMin = selectedTicket?.ticketStart?.split(':')[1];
    const tickEndHour = selectedTicket?.ticketEnd?.split(':')[0];
    const tickEndMin = selectedTicket?.ticketEnd?.split(':')[1];

    if (
      checkReservationTime(
        Number(selectedTimeHour),
        Number(selectedTimeMin),
        Number(tickStartHour),
        Number(tickStartMin),
        Number(tickEndHour),
        Number(tickEndMin),
      )
    ) {
      setTimeHire(time);
    } else {
      showMessage({
        message: `주차권 이용시간 내 (${selectedTicket?.ticketStart} ~ ${selectedTicket?.ticketEnd}) 시간을 선택해주세요.`,
      });
      return;
    }
  };

  return (
    <FixedContainer>
      <CustomHeader
        text=""
        rightContent={
          <>
            {userToken?.adminYN === IS_ACTIVE.YES ? (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(ROUTE_KEY.ParkingTicketAuto, {
                    parkingLotId: parkingLot?.id,
                  })
                }>
                <CustomText
                  color={colors.red}
                  textStyle={styles.textTop}
                  size={FONT.CAPTION}
                  family={FONT_FAMILY.SEMI_BOLD}
                  string={'관리자 모드'}
                />
              </TouchableOpacity>
            ) : null}
          </>
        }
      />

      <ScrollView ref={scrollviewRef} style={styles.view}>
        <CustomText
          textStyle={styles.textTitle}
          size={FONT.TITLE_2}
          family={FONT_FAMILY.BOLD}
          string={parkingLot?.garageName}
        />
        <HStack style={styles.viewTextTop}>
          <TextBorder text={`${strings.reservation.text_top_1}${parkingLot?.limitedNumber}`} />
          <TextBorder
            colorText={payInfo?.releyparking === IS_ACTIVE.YES ? colors.blue : colors.red}
            text={payInfo?.releyparking === IS_ACTIVE.YES ? '연박가능' : '연박불가능'}
          />
          {getReservationTvType() ? (
            <TextBorder
              colorText={payInfo?.wifiYN === IS_ACTIVE.YES ? colors.blue : undefined}
              text={getReservationTvType()}
            />
          ) : null}
        </HStack>

        <HStack
          style={{
            paddingHorizontal: PADDING,
            marginTop: heightScale(10),
            alignItems: 'flex-start',
          }}>
          <View style={{flex: 1}}>
            <CustomText
              textStyle={styles.textTop2}
              color={colors.red}
              size={FONT.SUB_HEAD}
              string={strings.reservation.text_policy_2}
            />
            <CustomText
              textStyle={styles.textTop2}
              size={FONT.SUB_HEAD}
              string={strings.reservation.text_policy_3}
              color={colors.grayText}
            />
            {/* ✅ 여기에 조건을 추가합니다 */}
            {parkingLot?.garageName?.includes('월주차') ? (
              <>
                <CustomText
                  textStyle={styles.textTop2}
                  size={FONT.SUB_HEAD}
                  string={strings.reservation.text_policy_4}
                  color={colors.grayText}
                />
                <CustomText
                  textStyle={styles.textTop2}
                  color={colors.red}
                  size={FONT.SUB_HEAD}
                  string={strings.reservation.text_policy_5}
                />
              </>
            ) : null}
          </View>
          <TouchableOpacity onPress={() => helpReservationRef.current?.show()}>
            <Icon name="help-circle-outline" size={widthScale(30)} />
          </TouchableOpacity>
        </HStack>

        <HStack
          style={{
            flexWrap: 'wrap',
          }}>
          {parkingTicketList?.map((item, index) => (
            <TicketItem
              key={index}
              item={item}
              selectedItem={selectedTicket}
              onItemPress={() => {
                setSelectedTicket(item);
              }}
            />
          ))}
        </HStack>

        <CustomText
          color={colors.grayText}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION}
          textStyle={styles.textBottomList}
          string={
            '선불주차권 구매 및 입차후 , 주차권 추가 구매 사용 절대 불가합니다. 초과사용시 , 현장요금으로 부과됩니다.'
          }
        />

        {/*<TouchableOpacity
          onPress={() =>
            scrollviewRef.current?.scrollTo({
              animated: true,
              y: heightScale(1350),
            })
          }
          style={styles.parkingDifferent}>
          <CustomText
            color={colors.grayText}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION}
            string={strings.reservation.explore_parking}
          />
          <Image
            resizeMode="contain"
            source={ICONS.btn_next_arrow_gray}
            style={{
              width: widthScale(14),
              height: widthScale(14),
              tintColor: colors.black,
            }}
          />
          </TouchableOpacity>*/}

        <View style={styles.divider1} />

        {parkingLot?.garageName?.includes('월주차') ? (
          <>
            <View style={styles.monthtt}>
              <CustomText
                string={'매달 월주차권 결제가 번거로우신가요?'}
                forDriveMe
                size={FONT.BODY}
                family={FONT_FAMILY.MEDIUM}
                lineHeight={heightScale1(20)}
              />
            </View>

            <View style={styles.monthcheck}>
              <CustomCheckbox
                text={'월주차권 자동결제 신청하기'}
                isChecked={isAutoPaymentChecked}
                onPress={() => setIsAutoPaymentChecked(!isAutoPaymentChecked)}
              />
            </View>

            <View style={styles.boxWrapperStyle}>
              <CustomText
                string={
                  '해당 서비스는 매달 월주차권을 직접 결제하지 않고, 만료일전 자동 결제되어 이용기간이 연장되는 서비스입니다.'
                }
                forDriveMe
                size={FONT.CAPTION_6}
                family={FONT_FAMILY.MEDIUM}
                lineHeight={heightScale1(20)}
              />
            </View>

            <ButtonShowBottom
              style={styles.buttonMonthBottom}
              title={
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    resizeMode="contain"
                    source={IMAGES.icon_autopay_info100}
                    style={{
                      width: widthScale(16),
                      height: widthScale(16),
                    }}
                  />
                  <Text style={{marginLeft: 8, fontSize: 16}}>
                    {strings.reservation.info_month_pay.content}
                  </Text>
                </View>
              }
              content={strings.reservation.parking_rules.content}
              viewBottom={
                <View style={styles.monthInfoDetail}>
                  <CustomText
                    textStyle={styles.textMonthRutes}
                    family={FONT_FAMILY.MEDIUM}
                    size={FONT.CAPTION_6}
                    string={
                      '• 1일~말일 월주차권 이용시 매달 20일 자동 결제됩니다.\n• 입차일로 부터 한달 월주차권 이용시 만료일 10일전 자동결제 됩니다.\n• 결제일이 주말이나 공휴일인 경우 안내된 일자보다 일찍\n   결제 될수 있습니다.\n• 자동 결제시 이용중인 월주차권 종료일 다음날로 자동 연장\n   등록처리됩니다.\n• 자동결제 이용시 결제수단을 카드결제만 가능합니다. \n   충전금 및 적립금은 사용 불가합니다.\n• 등록된 카드로 결제가 불가할 경우 담당자가 안내 문자를 전달드리며, \n   연장결제 기간 종료일까지 매일 결제 시도를 합니다.\n• 연장일 이전까지 등록된 카드로 자동결제 불가시 자동결제 신청은\n   해지 처리 됩니다.\n• 주차장 운영사 요청에 따라 사전고지 없이 연장 이용이 불가할수 있습니다.\n• 자동 결제 해지시 파킹박 고객 센터로 해지 요청후 \n   해지 처리가 가능합니다.'
                    }
                  />
                </View>
              }
            />
          </>
        ) : null}

        {/*
        {selectedTicket?.ticketName === '월주차권 자동신청' && selectedTicket.ticketAmt === '0' ? (
          <CustomText
            color={colors.grayText}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION}
            textStyle={styles.textBottomList}
            string={`자동결제는 결제가 아닌 신청입니다, 자동결제 신청하시면, 저희 운영팀에서\n담당자가 해당 주차장 신규.연장 가능여부 및 이용가능한 차량이면 결제를 진행합니다.\n자동결제 신청후 결제가 된 문자를 수신한 후에 해당일에 주차장 이용이 가능하게 됩니다.\n결제가 되지 않은 상태에서 주차장 이용시 현장에서 발생한 주차요금 및 손해가 발생할 경우,\n파킹박에서는 취소처리 및 책임을 질수가 없습니다. 이점, 자동결제 신청 및 이용에 참고해주세요.
            `}
          />
        ) : null}
        */}

        <View style={styles.divider1} />

        <ButtonShowBottom
          style={styles.buttonBottom}
          title={strings.reservation.info_user.title}
          content={strings.reservation.info_user.content}
          isShow={true}
          viewBottom={
            <>
              <View style={styles.cardList}>
                <ButtonCardReservation
                  title={payInfo?.cardName || ''}
                  content={`${payInfo?.number1}********${payInfo?.number4}` || ''}
                  style={styles.itemCard}
                  onPress={() => navigation.navigate(ROUTE_KEY.PaymentInfomation)}
                />
                <ButtonCardReservation
                  title="차량번호"
                  content={payInfo?.carNumber || ''}
                  onPress={() => navigation.navigate(ROUTE_KEY.VehicleManagement)}
                />
              </View>
              <Divider />
            </>
          }
        />

        <View style={[styles.viewVoucher2, styles.shadowColor]}>
          <CustomText
            string={strings.reservation.info_voucher}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.TITLE_2}
            textStyle={{marginBottom: heightScale(15)}}
          />
          <TextInputVoucherReservation
            placeholder="적립금 안내 확인후 입력"
            title={'적립금'}
            textMoney={`/ ${getNumberWithCommas(userPoint)}${strings?.general_text?.won}`}
            valueInput={point}
            onChangeText={setPoint}
          />
          <View style={{alignSelf: 'flex-end'}}>
            <CheckboxText
              isBold
              text={'적립금 전액 사용'}
              isChecked={isCheckFullUsePoints}
              onPress={() => {
                if (isCheckFullUsePoints) {
                  setPoint('');
                } else {
                  setMaxPoint();
                }
                setIsCheckFullUsePoints(!isCheckFullUsePoints);
              }}
            />
          </View>

          <TextInputVoucherReservation
            placeholder="충전금을 입력해주세요."
            title={'충전금'}
            textMoney={`/ ${getNumberWithCommas(userCharge)}${strings?.general_text?.won}`}
            valueInput={charge}
            onChangeText={setCharge}
          />

          <TouchableOpacity onPress={() => navigation.navigate(ROUTE_KEY.DepositMoney)}>
            <CustomText
              textStyle={styles.descriptionVoucherText}
              color={colors.heavyGray}
              size={FONT.CAPTION}
              family={FONT_FAMILY.SEMI_BOLD}
              string={'충전금으로 주차권구매시 충전후 이용가능       충전 및 혜택보기 >'}
            />
          </TouchableOpacity>

          {/* Coupon */}
          <ReservationCoupon
            data={couponList as CouponProps[]}
            onPress={(value: CouponProps) => {
              setCoupon(Number(value?.c_price));
            }}
          />

          <CustomText
            textStyle={[
              styles.descriptionVoucherText,
              {
                marginTop: heightScale(15),
              },
            ]}
            color={colors.heavyGray}
            size={FONT.CAPTION}
            family={FONT_FAMILY.SEMI_BOLD}
            string={strings.reservation.description_voucher_1}
          />
          <CustomText
            textStyle={styles.descriptionVoucherText}
            color={colors.heavyGray}
            size={FONT.CAPTION}
            family={FONT_FAMILY.SEMI_BOLD}
            string={strings.reservation.description_voucher_2}
          />
        </View>
        <View style={styles.divider1} />

        <CustomText
          textStyle={{marginHorizontal: PADDING, marginTop: PADDING}}
          color={colors.blue}
          string={'다른 조건을 가진 주차장 둘러보기!'}
          family={FONT_FAMILY.BOLD}
        />

        <View style={styles.viewVoucher}>
          <CustomText string="예약정보" family={FONT_FAMILY.SEMI_BOLD} size={FONT.TITLE_3} />
          <CustomText
            string="필수입력!"
            family={FONT_FAMILY.REGULAR}
            size={FONT.CAPTION_2}
            style={{
              ...styles.marginVertical,
              marginBottom: heightScale(20),
            }}
          />

          <TextInputChoose
            style={{
              marginBottom: heightScale(15),
            }}
            isShowIcon
            placeholder={'2025년'}
            value={
              dateHire
                ? moment(dateHire?.valueOf()).format(`YYYY년 M월 D일 (${getDayName(dateHire)})`)
                : ''
            }
            Icon={
              <ButtonComnponent
                icon={ICONS.icons8_calendar}
                onPress={() => chooseCalendarRef.current?.show()}
              />
            }
            title={'입차일'}
          />

          <CustomText
            string={moment(
              new Date(new Date().getTime() + parkingLot?.a1TicketCost * 24 * 60 * 60 * 1000),
            ).format('MM월DD일까지 예약가능')}
            textStyle={{
              marginLeft: widthScale(95),
              marginBottom: heightScale(5),
            }}
          />

          <TextInputChoose
            placeholder={'12시00분'}
            value={timeHire ? moment(timeHire.valueOf()).format('HH시mm분') : ''}
            Icon={
              <ButtonComnponent
                icon={ICONS.icons8_clock}
                onPress={() => chooseTimeRef.current?.show()}
              />
            }
            title={'입차시간'}
          />
        </View>

        <View style={styles.divider1} />
        <ButtonShowBottom
          style={styles.buttonBottom}
          title={strings.reservation.parking_rules.title}
          content={strings.reservation.parking_rules.content}
          viewBottom={
            <View style={styles.parkingRules}>
              <CustomText
                textStyle={styles.textRutes}
                lineHeight={heightScale1(22)}
                family={FONT_FAMILY.BOLD}
                size={FONT.CAPTION}
                string={payInfo?.issue_text || ''}
              />
            </View>
          }
        />
        <RadioButton
          isFocus={isCheckReservationCBRule}
          style={styles.radioButton}
          text={'확인했습니다.'}
          onPress={() => setIsCheckReservationCBRule(!isCheckReservationCBRule)}
        />
        <View style={styles.divider1} />

        <ButtonShowBottom
          style={styles.buttonBottom}
          title={'이용동의'}
          content={'동의를 눌러주세요!'}
          viewBottom={
            <View>
              <CustomText
                string={
                  '* 선불주차권 구매 및 입차후 , 주차권 추가 구매 사용 절대 불가합니다. 초과사용시 , 현장요금으로 부과됩니다.'
                }
                size={FONT.CAPTION}
              />
              <CustomText
                string={'* 예약하신 날짜, 시간, 차량번호, 주차권이 정확해야 합니다.'}
                color={colors.red}
                size={FONT.CAPTION}
              />
              <CustomText
                string={
                  '* 위 정보가 틀린 경우 혹은 잘못된 입력으로 문제 발생 시 파킹박은 책임지지 않습니다.'
                }
                color={colors.red}
                size={FONT.CAPTION}
              />
              <CustomText
                string={
                  '* 주차권 유효시간 이후 출차 시 추가 비용이 부과되거나, 구매한 주차권이 취소되며 전액 현장 요금이 부과되실 수 있으십니다.'
                }
                size={FONT.CAPTION}
              />
              <CustomText
                string={'* 적립금 사용은 6,000원 이상 결제 건에 대해, 회당 1,000원까지 가능합니다.'}
                size={FONT.CAPTION}
              />
              <CustomText
                string={'* 입차 전 주차권을 구매해주세요. 입차 후 구매 시 사용이 불가능합니다.'}
                color={colors.red}
                size={FONT.CAPTION}
              />
              <CustomText
                string={
                  '* 월주차를 제외한 모든 주차권은 한번의 입출차에 하나의 할인권만 적용(수시입출차불가)되기에 출차후 재입차하여 주차장 이용시 현장결제 요금이 발생할수 있습니다.\n* 월주차권을 구매하신 경우 수시로 입출차가 가능합니다. \n* 주차권 구매 후 출차 전 개인정보를 변동하거나 회원 탈퇴하실 경우 이용이 불가능합니다.\n* 만차 혹은 현장 사정에 따라 주차가 어려울 수 있으며, 이 경우 환불처리 해드립니다.\n* 입차 후 주차권 환불은 불가능합니다.\n * 주차장에서 발생한 사고는 파킹박에서 일정 책임지지 않습니다.\n* 사전 결제된 주차요금이 예약일 기준 변동될 시에는 미리 결제한 주차권이 취소될 수 있습니다.'
                }
                size={FONT.CAPTION}
              />
            </View>
          }
        />
        <RadioButton
          isFocus={isCheckReservationCBAgree}
          style={styles.radioButton}
          text={'확인했습니다'}
          onPress={() => {
            setIsCheckReservationCBAgree(!isCheckReservationCBAgree);
          }}
        />
        <Button
          text="모두 확인 후 동의합니다"
          color={colors.white}
          textColor={colors.redButton}
          borderColor={colors.redButton}
          onPress={onPressAgreeConfirmAll}
          style={styles.button}
        />
        <View style={styles.divider1} />
        <View style={styles.viewBottom}>
          <CustomText
            string={`...(${userInfo?.nic})님,`}
            family={FONT_FAMILY.BOLD}
            textStyle={{
              marginBottom: heightScale(5),
            }}
            size={FONT.CAPTION}
          />
          <View style={styles.viewGray}>
            {dateHire ? (
              <CustomText
                string={moment(dateHire?.valueOf()).format('YYYY년 M월 D일')}
                size={FONT.TITLE_3}
                family={FONT_FAMILY.SEMI_BOLD}
              />
            ) : (
              <CustomText string="입차날짜" size={FONT.TITLE_3} family={FONT_FAMILY.SEMI_BOLD} />
            )}
          </View>
          <View style={styles.viewGray}>
            {timeHire ? (
              <CustomText
                string={moment(timeHire?.valueOf()).format('HH시mm분')}
                size={FONT.TITLE_3}
                family={FONT_FAMILY.SEMI_BOLD}
              />
            ) : (
              <CustomText string="대예정시간" size={FONT.TITLE_3} family={FONT_FAMILY.SEMI_BOLD} />
            )}
          </View>
          <View style={styles.viewGray}>
            <CustomText
              string={selectedTicket?.ticketName || ''}
              size={FONT.TITLE_3}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </View>

          <CustomText
            string="결제하시겠습니까?"
            size={FONT.CAPTION}
            family={FONT_FAMILY.SEMI_BOLD}
            textStyle={{
              marginTop: heightScale(5),
            }}
          />
        </View>

        <Button
          text="결제하기"
          color={colors.red}
          borderColor={colors.red}
          onPress={() => handleConfirm(isAutoPaymentChecked)}
          style={styles.buttonRed}
          disable={isCheckingReservation}
        />

        <ModalTimePicker
          ref={chooseCalendarRef}
          onConfirm={(value: Date) => {
            // ticketdayLimit이 undefined일 경우 빈 배열을 기본값으로 설정
            const ticketLimitDates = selectedTicket?.ticketdayLimit
              ? selectedTicket.ticketdayLimit
                  .split('/')
                  .map(date => moment(date, 'YYMMDD').toDate())
              : [];

            // 선택한 날짜가 ticketLimitDates 목록에 포함되어 있는지 확인
            const isDateSoldOut = ticketLimitDates.some(ticketDate =>
              moment(value).isSame(ticketDate, 'day'),
            );

            if (isDateSoldOut) {
              showMessage({
                message:
                  '선택하신 주차권의 해당일은 현재 매진되었습니다. \n판매제한은 매일 갱신되며 다른날짜를 이용해주세요',
              });
              return;
            }

            if (checkDayRestriction(value)) {
              showMessage({
                message:
                  '현재 해당일은 매진으로 구매할 수 없습니다. 판매제한은 매일 갱신되며 선택한 날짜에 \n주차권 구매가 제한될 경우 고객센터\n(010-5949-0981) 또는 카카오톡으로 문의 바랍니다.',
              });
              return;
            }

            if (checkDayNameGubun(value)) {
              showMessage({
                message:
                  '현재 해당일은 매진으로 구매할 수 없습니다. 판매제한은 매일 갱신되며 선택한 날짜에 \n주차권 구매가 제한될 경우 고객센터\n(010-5949-0981) 또는 카카오톡으로 문의 바랍니다.',
              });
              return;
            } else {
              setDateHire(value);
            }
          }}
          // 최대 날짜를 2025년 12월 31일로 설정하거나 parkingLot 값에 따라 동적으로 계산
          maximumDate={
            parkingLot?.a1TicketCost ? new Date(parkingLot.a1TicketCost) : new Date('2025-12-31')
          }
          // 최소 날짜는 오늘 날짜로 설정하여 과거 날짜 선택을 방지
          minimumDate={new Date()}
        />

        <ModalDateTimePicker ref={chooseTimeRef} onConfirm={handleCheckTimeReservation} />
        <ModalHelpReservation ref={helpReservationRef} />
      </ScrollView>

      {/* Curation popup */}
      <CurationPopup ref={curationRef} />
      {/* Reservation confirm popup */}
      <ReservationConfirmPopup ref={reservationConfirmRef} />
      {/* Reservation Check */}
      <ReservationCheck
        ref={reservationCheckRef}
        TotalTicketType={selectedTicket?.ticketName || ''}
        agCarNumber={payInfo?.carNumber || ''}
        date={moment(dateHire?.valueOf()).format('YYYY년 M월 D일')}
        nic={userInfo?.nic || ''}
        pNum={payInfo?.pnum || ''}
        parkingLotId={parkingLot?.id}
        requirements={moment(timeHire?.valueOf()).format('HH시mm분') || ''}
        selectedDate={`${moment(dateHire?.valueOf()).format('YYYYMMDD')}${moment(
          timeHire?.valueOf(),
        ).format('HHmm')}`}
        ticketPrice={Number(selectedTicket?.ticketAmt)}
        useCharge={Number(charge)}
        useCoupon={Number(coupon)}
        usePoint={Number(point)}
        isAutoPaymentChecked={isAutoPaymentChecked} // 추가
        onSuccess={() => {
          setTimeout(() => {
            reservationCompletionRef?.current?.show();
          }, 1500);
        }}
        onDismiss={() => {
          setIsCheckingReservation(false);
        }}
      />

      {/* Reservation completion popup
      <ReservationCompletionPopup
        ref={reservationCompletionRef}
        onClose={() => navigation.goBack()}
        onChargePromoPress={() => {
          setTimeout(() => {
            chargePromoRef?.current?.show();
          }, 500);
        }}ROUTE_KEY.CarpoolTabDriver
      />*/}

      <ReservationCompletionPopup
        ref={reservationCompletionRef}
        onClose={() => navigation.goBack()}
        onChargePromoPress={() => {
          navigation.goBack();
          navigation.navigate(ROUTE_KEY.DepositMoney);
        }}
        onDriverPromoPress={() => {
          navigation.goBack();
          navigation.navigate(ROUTE_KEY.CarpoolTabDriver as any);
        }}
        onRulletBannerPress={() => {
          navigation.goBack();
          navigation.navigate(ROUTE_KEY.EventGame);
        }}
      />

      {/* Charge Promo popup */}
      <ChargePromoPopup
        ref={chargePromoRef}
        onConfirmPress={() => {
          navigation.goBack();
          navigation.navigate(ROUTE_KEY.DepositMoney);
        }}
      />
    </FixedContainer>
  );
};

export default Reservation;

const styles = StyleSheet.create({
  viewTop1: {
    justifyContent: 'flex-end',
    marginTop: heightScale(30),
  },
  divider1: {
    marginHorizontal: widthScale(25),
    backgroundColor: colors.gray,
    height: heightScale(1),
  },
  viewGray: {
    backgroundColor: colors.card,
    borderRadius: widthScale(5),
    alignSelf: 'flex-start',
    marginVertical: heightScale(2),
    height: heightScale(50),
    marginBottom: heightScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: widthScale(20),
  },
  buttonRed: {
    borderRadius: widthScale(7),
    marginTop: heightScale(20),
    height: heightScale(50),
    marginBottom: heightScale(30),
    marginHorizontal: PADDING,
  },
  viewBottom: {
    paddingBottom: heightScale(40),
    marginHorizontal: PADDING,
    paddingVertical: heightScale(25),
  },
  button: {
    marginHorizontal: PADDING,
    borderRadius: widthScale(7),
    marginTop: heightScale(20),
    height: heightScale(50),
    marginBottom: heightScale(30),
    borderWidth: widthScale(1.5),
  },
  white: {
    color: colors.black,
  },
  textContentRed: {
    fontSize: widthScale(11.3),
    color: colors.black,
    lineHeight: heightScale(18),
  },
  marginVertical: {
    marginVertical: heightScale(5),
  },
  dividerLine: {
    width: widthScale(120),
    backgroundColor: colors.blue,
    height: heightScale(0.5),
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: widthScale(25),
    marginTop: heightScale(25),
    marginBottom: heightScale(20),
  },
  radioButton: {
    marginHorizontal: PADDING,
    marginVertical: heightScale(22),
  },
  textRutes: {
    lineHeight: heightScale(18),
  },
  textMonthRutes: {
    lineHeight: heightScale(20),
  },
  parkingRules: {
    borderWidth: widthScale(1),
    padding: widthScale(5),
    borderRadius: widthScale(5),
    borderColor: colors.gray,
    paddingHorizontal: widthScale(20),
    paddingVertical: heightScale(16),
  },
  viewVoucher: {
    marginHorizontal: PADDING,
    marginTop: heightScale(20),
    marginBottom: heightScale(20),
  },
  cardList: {
    flexDirection: 'row',
    marginTop: heightScale(15),
    marginBottom: heightScale(20),
  },
  itemCard: {
    marginRight: widthScale(20),
  },
  buttonBottom: {
    marginTop: heightScale(20),
    marginBottom: heightScale(10),
  },
  buttonMonthBottom: {
    marginTop: heightScale(10),
    marginBottom: heightScale(0),
  },
  monthtitle: {
    marginTop: heightScale(20),
    marginBottom: heightScale(10),
    paddingVertical: heightScale1(16),
    paddingHorizontal: widthScale1(20), // 좌우 여백 추가
  },
  boxWrapperStyle: {
    borderRadius: scale1(4),
    backgroundColor: colors.gray9,
    marginTop: heightScale(20),
    marginBottom: heightScale(10),
    marginHorizontal: PADDING,
    paddingVertical: heightScale1(16),
    paddingHorizontal: widthScale1(20), // 좌우 여백 추가
  },

  monthInfoDetail: {
    borderWidth: widthScale(0),
    padding: widthScale(5),
    borderRadius: widthScale(0),
    borderColor: colors.gray,
    paddingHorizontal: widthScale(0),
    paddingVertical: heightScale(14),
  },

  monthtt: {
    marginTop: heightScale(30),
    marginHorizontal: PADDING,
    paddingHorizontal: widthScale1(0), // 좌우 여백 추가
  },

  monthcheck: {
    marginTop: heightScale(20),
    marginHorizontal: PADDING,
    paddingHorizontal: widthScale1(0), // 좌우 여백 추가
  },

  parkingDifferent: {
    height: heightScale(50),
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: colors.black,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    marginHorizontal: PADDING,
  },
  textBottomList1: {
    color: colors.red,
  },
  textBottomList: {
    marginBottom: heightScale(5),
    paddingHorizontal: PADDING,
    lineHeight: heightScale(20),
  },
  view: {
    flex: 1,
    backgroundColor: colors.white,
  },
  textTitle: {
    textAlign: 'center',
    marginVertical: heightScale(15),
  },
  textTop: {
    color: colors.red,
    textAlign: 'center',
    alignSelf: 'flex-end',
  },
  viewTextTop: {
    flexDirection: 'row',
    marginHorizontal: widthScale(10),
    marginTop: heightScale(10),
    justifyContent: 'flex-start',
  },
  textTop2: {
    marginTop: heightScale(3),
  },
  viewTop2: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: heightScale(10),
  },
  imageHelp: {
    width: widthScale(30),
    height: widthScale(30),
  },
  buttonHelp: {
    position: 'absolute',
    bottom: 0,
    right: widthScale(10),
  },
  listBuy: {
    backgroundColor: colors.whiteBlue,
    marginTop: heightScale(5),
  },
  columnWrapperStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: heightScale(20),
  },
  itemListBuy: {
    margin: widthScale(20),
  },
  shadowColor: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 8,
  },
  viewVoucher2: {
    borderRadius: widthScale(15),
    padding: widthScale(10),
    paddingTop: heightScale(15),
    paddingBottom: heightScale(25),
    paddingHorizontal: widthScale(15),
    margin: heightScale(20),
    backgroundColor: colors.white,
  },
  descriptionVoucherText: {
    marginBottom: heightScale(10),
  },
});
