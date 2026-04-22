import moment from 'moment';
import React, {memo, useEffect, useRef, useState} from 'react';
import {
  Alert,
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
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import ModalCalendarPicker, {CalendarPickerRefs} from '~components/modal-calendar-picker';
import ModalTimeWheelPicker, {TimeWheelPickerRefs} from '~components/modal-time-wheel-picker';
import MenuItem from '~components/reservation-simple-pay/menu-item';
import Spinner from '~components/spinner';
import ViewTermsPopup, {
  ViewTermsRefs,
} from '~components/valet-parking-reservation/view-terms-popup';
import {BASE_URL, PADDING, width} from '~constants/constant';
import {solar} from '~constants/data';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
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

import {useParkingDetailsQuery} from '~services/parkingServices';
import {ROUTE_KEY} from '~navigators/router';
import {getAmanoDisplayQty, useAmanoAvailability} from '~hooks/useAmanoAvailability';

const ReservationSimplePay = memo((props: RootStackScreenProps<'ReservationSimplePay'>) => {
  const {navigation, route} = props;
  const parkId = route?.params?.parkId;
  const parkTicketName = route?.params?.parkTicketName;
  const requirements = route?.params?.requirements;

  // parkId를 사용해 주차장 상세 정보를 가져옵니다.
  const {data: parkingLotData} = useParkingDetailsQuery(
    {id: Number(parkId)},
    {
      skip: !parkId,
    },
  );

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
  const timePickerRef = useRef<TimeWheelPickerRefs>(null);
  const chooseCalendarRef = useRef<CalendarPickerRefs>(null);

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
  const amanoPlotIdForAvail = parkingLotData?.MTicketTimeStart?.trim();
  const amanoAvailEnabled =
    parkingLotData?.agency === '아마노코리아' && !!amanoPlotIdForAvail;
  const amanoAvailabilityMap = useAmanoAvailability({
    enabled: amanoAvailEnabled,
    plotId: amanoPlotIdForAvail,
    tickets: parkingTicket,
    pakStrStddDt: moment().format('YYYY-MM-DD'),
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
  const [amanoGdsTrdId, setAmanoGdsTrdId] = useState<string>(''); // 아마노 거래 ID
  const [amanoPlotId, setAmanoPlotId] = useState<string>(''); // 아마노 주차장 ID (정기권 complete용)
  const [amanoIsSeason, setAmanoIsSeason] = useState<boolean>(false); // 정기권 여부

  const isHoliday = holidayList?.includes(moment(day).format('MMDD'));
  const isWeek = weekendNameList.includes(getDayName(day));

  let checkRestriction: boolean = false;

  const selectedTicket = parkingTicket?.find(it => it?.ticketName === parkTicketName);

  const simplePayAmanoDisplayQty = selectedTicket
    ? getAmanoDisplayQty(
        parkingLotData?.agency,
        selectedTicket,
        amanoAvailabilityMap,
      )
    : null;

  const isSelectedTicketSoldOutForPay = Boolean(
    selectedTicket &&
      (selectedTicket.soldOutYn === 'Y' ||
        selectedTicket.ticketLimit === 0 ||
        (simplePayAmanoDisplayQty !== null && simplePayAmanoDisplayQty <= 0)),
  );

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

  const AMANO_ERROR_MESSAGE_MAP: Record<string, string> = {
    ERR_AKC_8002: '요청 처리 중 일시적인 문제가 발생했습니다.',
    ERR_AKC_8003: '요청 데이터에 오류가 있습니다. 올바른 파라미터가 아닙니다.',
    ERR_AKC_8004: '현재 선택하신 상품의 판매 가능 수량이 부족합니다. 다른 상품이나 다른 기간을 선택해 주세요.',
    ERR_AKC_8005: '로컬 센터 서버와 일시적으로 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
    ERR_AKC_8101: '입차 예정 시각이 올바르지 않습니다. 현재 예약 시간을 다시 확인해 주세요.',
    ERR_AKC_8102: '입차 예정 시각이 올바르지 않습니다. 입차 예정 시간을 다시 확인해 주세요.',
    ERR_AKC_8103: '최소 입차 시간을 지났습니다. 날짜를 yyyy-MM-dd 형식으로 입력해 주세요.',
    ERR_AKC_8104: '차량번호를 올바르게 입력해 주세요.',
    ERR_AKC_8105: '변경할 차량번호 형식이 올바르지 않습니다. 차량번호를 정확히 입력해 주세요.',
    ERR_AKC_8106: '변경할 차량번호 형식이 올바르지 않습니다. 날짜를 yyyy-MM-dd 형식으로 입력해 주세요.',
    ERR_AKC_8107: '입차할 차량번호를 입력해 주세요.',
    ERR_AKC_8108: '차량명을 입력해 주세요.',
    ERR_AKC_8109: '고객 별칭이 누락되었습니다. 식별을 위한 별칭을 입력해 주세요.',
    ERR_AKC_8110: '고객 별칭의 차량번호 형식이 올바르지 않습니다. 차량번호를 정확히 입력해 주세요.',
    ERR_AKC_8600: '요청한 리소스를 찾을 수 없습니다.',
    ERR_AKC_8601: '요청 처리할 리소스를 찾을 수 없습니다.',
    ERR_AKC_8604: '유효하지 않은 토큰입니다. 올바른 인증 정보로 다시 시도해 주세요.',
    ERR_AKC_8605: '해당 리소스에 대한 접근 권한이 없습니다.',
    ERR_AKC_8606: '입력 값에 오류가 있습니다. 입력 내용을 확인 후 다시 시도해 주세요.',
    ERR_AKC_8607: '해당 차량은 서비스 이용이 제한됩니다. 이미 구매한 내역을 확인해 주세요.',
    ERR_AKC_8608: '해당 차량은 이미 등록되어 있습니다. 기존 등록 내용을 확인하거나 다른 차량번호로 시도해 주세요.',
    ERR_AKC_8612: '현재 차량은 이용 요금에만 이용 가능합니다. 운행 요일을 확인해 주세요.',
    ERR_AKC_8613: '현재 차량은 운행 요일에만 이용 가능합니다. 운행 기간을 확인해 주세요.',
    ERR_AKC_8614: '이미 사용 중인 정기권이 존재합니다. 변경 가능한 정기권을 확인해 주세요.',
    ERR_AKC_8615: '요청 횟수를 초과했습니다. 잠시 후 다시 시도해 주세요.',
    ERR_AKC_8616: '해당 정기권은 이미 취소되어 있습니다.',
    ERR_AKC_8617: '변경 가능한 기간이 지났습니다. 변경 가능 기간을 확인해 주세요.',
    ERR_AKC_8618: '정기권 종료일 이후에는 환불이 불가능합니다. 이용 기간을 확인해 주세요.',
    ERR_AKC_8620: '변경 가능 횟수를 모두 사용했습니다. 더 이상 변경할 수 없습니다.',
    ERR_AKC_8621: '선택하신 시작일이 올바르지 않습니다. 상품의 종료일 이전으로 날짜를 선택해 주세요.',
    ERR_AKC_8622: '선택하신 시작일이 올바르지 않습니다. 오늘 이후의 날짜를 선택해 주세요.',
    ERR_AKC_8623: '연박권은 차량 변경 할 수 없습니다.',
    ERR_AKC_8624: '이미 주차권이 완료된 차량입니다.',
    ERR_AKC_8625: '상품이 만료되어 구매할 수 없습니다. 다른 상품을 선택해 주세요.',
    ERR_AKC_8626: '아직 사용 전인 정기권은 환불이 불가능하니 취소를 진행해 주세요.',
    ERR_AKC_9001: '로컬 현장 서버에서 데이터 저장에 실패했습니다.',
    ERR_AKC_9002: '로컬 현장 서버에서 일시적인 네트워크가 발생했습니다.',
    ERR_AKC_9003: '로컬 현장 서버에서 정보 수집에 실패했습니다.',
    ERR_AKC_9004: '이미 정기권으로 등록된 차량입니다.',
    ERR_AKC_9005: '해당 차량은 이미 정기권이 등록되어 있어 주차권을 추가로 등록할 수 없습니다.',
    ERR_AKC_9401: '해당 일일 정산 마감이 완료되어 아침 조정할 수 없습니다.',
    ERR_AKC_9600: '이미 취소된 상태입니다. 취소 요청을 수행할 수 없습니다.',
    ERR_AKC_9601: '해당 거래 정보를 찾을 수 없습니다.',
    ERR_AKC_9602: '기존 차량번호와 동일한 번호입니다. 다른 차량번호를 입력해 주세요.',
    ERR_AKC_9603: '해당 차량이 이미 다른 할인에 적용되어 있어 등록할 수 없습니다.',
    ERR_AKC_9604: '변경하려는 차량번호에 이미 다른 할인에 적용되어 있어 변경할 수 없습니다.',
    ERR_AKC_9605: '해당 거래 정보가 삭제되어 처리할 수 없습니다.',
    ERR_AKC_9606: '해당 거래 정보가 만료되어 처리할 수 없습니다.',
    ERR_AKC_9607: '이미 주차가 완료된 차량입니다.',
    ERR_AKC_9608: '이미 정기권 등록이 완료되었습니다.',
    ERR_AKC_9609: '해당 상품의 정기권 정보가 존재하지 않습니다.',
    ERR_AKC_9610: '현재 주차장에 있는 차량으로 처리할 수 없습니다.',
    ERR_AKC_9611: '변경하려는 차량번호가 현재 주차장에 있어 변경할 수 없습니다.',
    ERR_AKC_9612: '이전 차량이 72시간 동안 출차하지 않아 이전 차량을 입력합니다.',
    ERR_AKC_9613: '로컬 현장 서버에 준차하지 않은 상품 코드(Dec) 입니다.',
    ERR_AKC_9614: '출차할 수 있는 시간이 지나 확인이 어려울 수 있습니다.',
    ERR_AKC_9615: '이미 정산되었거나 출차가 완료된 차량입니다.',
    ERR_AKC_9616: '로컬 현장 서버에 할인코드가 존재하지 않아 처리할 수 없습니다.',
    ERR_AKC_9713: '정기권 유형 코드 값이 유효하지 않습니다. (허용 범위: 1~8)',
    ERR_AKC_9714: '이미 존재하는 거래 ID(gdsTrId) 입니다. 중복 생성이 불가능합니다.',
    ERR_AKC_9715: '요청 데이터가 비어 있습니다. 필수 입력 항목을 확인해 주세요.',
    ERR_AKC_9716: '이미 유효한 정기권이 있습니다. (yyyy-MM-dd ~ yyyy-MM-dd)',
    ERR_AKC_9717: '정기권 유형 형식(gktTpNm)이 누락되었습니다.',
    ERR_AKC_9718: '요청하신 동작 유형이 올바르지 않습니다.',
    ERR_AKC_9719: '동일한 정기권 그룹번호가 이미 존재합니다.',
    ERR_AKC_9720: '해당 정기권 그룹번호를 찾을 수 없습니다.',
  };

  // 아마노 에러 중 "결제는 계속 진행"하고 싶은 코드들
  // (예: 이미 완료된 주차권 등, 안내만 받고 추가 연동만 생략)
  const AMANO_IGNORE_ERROR_CODES = new Set<string>(['ERR_AKC_8624']);

  // 아마노 에러 메시지 중 무시하고 결제를 계속 진행할 메시지들
  const AMANO_IGNORE_MESSAGES: string[] = [
    // 원복: 모든 에러 메시지는 결제를 중단합니다
  ];

  // 🔹 true: AS-IS (결제 후 /purchase 1번), false: TO-BE (pending → 결제 → complete 2번)
  const AMANO_USE_AS_IS = true;

  // 🔹 AS-IS: 결제 후 구매(purchase) API 1번 호출
  type AmanoPurchaseParams = {
    isSeason: boolean;
    plotId?: string | null;
    gdsId?: string | null;
    carNo: string;
    carTp?: string | null;
    pinResveDtm?: string | null;
    purchaseDate: string;
    pakStrDt?: string;
  };

  const callAmanoPurchaseAPI = async ({
    isSeason,
    plotId,
    gdsId,
    carNo,
    carTp,
    pinResveDtm,
    purchaseDate,
    pakStrDt,
  }: AmanoPurchaseParams): Promise<{ok: boolean; gdsTrdId?: string}> => {
    const AMANO_BASE = `${BASE_URL.replace(/\/$/, '')}/api/amano`;
    const amanoBody = isSeason
      ? {
          plotId,
          seasonGoods: [
            {
              gdsId,
              purcPsn: carNo,
              carNo: carNo,
              carTp: carTp,
              pakStrDt: pakStrDt,
              purchaseDate: purchaseDate.slice(0, 10),
            },
          ],
        }
      : {
          plotId,
          gdsId,
          pinResveDtm: pinResveDtm,
          carNo: carNo,
          purchaseDate: purchaseDate,
        };
    const amanoUrl = isSeason
      ? `${AMANO_BASE}/seasonpasses/purchase`
      : `${AMANO_BASE}/parkingtickets/purchase`;
    try {
      const res = await fetch(amanoUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(amanoBody),
      });
      const raw = await res.text();
      let json: any = {};
      try {
        json = raw ? JSON.parse(raw) : {};
      } catch {
        json = {};
      }
      const ok = res.ok && (json.success === undefined || json.success === true);
      if (!ok) {
        const errCode = (
          json?.errCode ||
          json?.err_code ||
          json?.errorCode ||
          json?.code ||
          json?.rsltCd ||
          json?.data?.errCode ||
          ''
        ).toString();
        const errMsg =
          json?.message ||
          json?.rsltMsg ||
          json?.msg ||
          raw ||
          `주차권 결제 실패 (code: ${errCode || res.status})`;
        const mapped = errCode ? AMANO_ERROR_MESSAGE_MAP[errCode] : undefined;
        const displayMsg =
          (mapped || errMsg) + '\n\n(관련 문의사항이 있을시 아래 문의하기 부탁드립니다.)';
        Alert.alert('주차권 결제 실패', displayMsg, [
          {text: '문의하기', onPress: () => navigation.navigate(ROUTE_KEY.ContactUs)},
          {text: '확인'},
        ]);
        return {ok: false};
      }
      const gdsTrdId = isSeason
        ? json?.data?.seasonGoodsStatus?.[0]?.gdsTrdId || ''
        : json?.data?.gdsTrdId || '';
      return {ok: true, gdsTrdId};
    } catch (error) {
      console.error('[Amano] AS-IS Purchase API 호출 실패:', error);
      showMessage({
        message: '주차권 결제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
      return {ok: false};
    }
  };

  // 🔹 TO-BE: 2단계 구매 프로세스 - 구매 완료(complete) API 호출
  const callAmanoCompleteAPI = async () => {
    if (!amanoGdsTrdId) {
      return; // 거래 ID가 없으면 스킵
    }

    const AMANO_BASE = `${BASE_URL.replace(/\/$/, '')}/api/amano`;

    try {
      if (amanoIsSeason) {
        // 정기권 complete API
        const completeUrl = `${AMANO_BASE}/seasonpasses/complete`;
        const completeBody = {
          plotId: amanoPlotId,
          completions: [{gdsTrdId: amanoGdsTrdId}],
        };

        await fetch(completeUrl, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(completeBody),
        });
      } else {
        // 주차권 complete API
        const completeUrl = `${AMANO_BASE}/parkingtickets/purchase/${encodeURIComponent(amanoGdsTrdId)}/complete`;

        await fetch(completeUrl, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({}), // 빈 body
        });
      }

    } catch (error) {
      console.error('[Amano] Complete API 호출 실패:', error);
      // complete 실패해도 결제는 완료된 상태이므로 계속 진행
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
    // ticketStart/ticketEnd가 없으면(상품 정책 미제공 등) 시간 제한 없이 선택 허용
    if (!selectedTicket?.ticketStart || !selectedTicket?.ticketEnd) {
      setTime(time);
      return;
    }

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
    } else {
      showMessage({
        message: `주차권 이용시간 내 (${selectedTicket?.ticketStart} ~ ${selectedTicket?.ticketEnd}) 시간을 선택해주세요.`,
      });
      return;
    }
  };

  const handleViewParkingLot = () => {
    showMessage({
      message: '해당 주차권 상품이 변경되어 간편예약이 아닌 해당주차장 진입후 결제 가능합니다',
    });
    if (parkingLotData) {
      navigation.navigate(ROUTE_KEY.Reservation, {
        parkingLot: parkingLotData,
      });
    } else {
      showMessage({
        message: '주차장 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.',
      });
    }
  };

  const handleSubmit = async () => {
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

    // 선택한 주차권이 매진 상태(soldOutYn === 'Y')인 경우 결제 차단
    if (selectedTicket?.soldOutYn === 'Y') {
      showMessage({
        message: '해당 주차권은 매진되어 구매할 수 없습니다.',
      });
      return;
    }
    if (selectedTicket?.ticketLimit === 0) {
      showMessage({
        message: '해당 주차권은 매진되어 구매할 수 없습니다.',
      });
      return;
    }
    if (simplePayAmanoDisplayQty !== null && simplePayAmanoDisplayQty <= 0) {
      showMessage({
        message: '해당 주차권은 매진되어 구매할 수 없습니다.',
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
        message: '해당 주차권 상품이 변경되어 간편예약이 아닌 해당주차장 진입후 결제 가능합니다',
      });

      // 주차장 데이터가 이미 로드된 경우에만 이동
      if (parkingLotData) {
        navigation.navigate(ROUTE_KEY.Reservation, {
          parkingLot: parkingLotData,
        });
      } else {
        // 데이터가 아직 로드되지 않았을 경우, 사용자에게 메시지를 보여줍니다.
        showMessage({
          message: '주차장 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.',
        });
      }
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

    // ✅ 아마노 API 연동 조건 확인
    const isAmanoAgency = parkingLotData?.agency === '아마노코리아';
    const hasMTicketTimeStart =
      parkingLotData?.MTicketTimeStart && parkingLotData?.MTicketTimeStart.trim() !== '';
    const amanoGdsId = selectedTicket?.amano_gds_id;
    const ticketType = selectedTicket?.ticket_type;

    let amanoMoid = '';

    if (isAmanoAgency && hasMTicketTimeStart && amanoGdsId) {
      const isSeason = ticketType === '정기권';
      setAmanoIsSeason(isSeason);
      setAmanoPlotId(parkingLotData?.MTicketTimeStart || '');

      const combineDateTime = () => {
        if (!day || !time) {
          return null;
        }
        const base = moment(day);
        const timeMoment = moment(time);
        base.hour(timeMoment.hour()).minute(timeMoment.minute()).second(0).millisecond(0);
        return base;
      };
      const combined = combineDateTime();
      const pinResveDtm = combined ? combined.utc().format('YYYY-MM-DDTHH:mm:ss[Z]') : null;
      const purchaseDate = moment().utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
      const pakStrDt = day ? moment(day).format('YYYY-MM-DD') : undefined;
      const carNo = payInfo?.carNumber || '';
      const carTp = (payInfo as any)?.carModel || '세단';

      if (AMANO_USE_AS_IS) {
        const purchaseResult = await callAmanoPurchaseAPI({
          isSeason,
          plotId: parkingLotData?.MTicketTimeStart,
          gdsId: amanoGdsId,
          carNo,
          carTp,
          pinResveDtm,
          purchaseDate,
          pakStrDt,
        });
        if (!purchaseResult.ok) {
          return;
        }
        if (purchaseResult.gdsTrdId) {
          amanoMoid = purchaseResult.gdsTrdId;
          setAmanoGdsTrdId(purchaseResult.gdsTrdId);
        }
      } else {
        /* ========== TO-BE (2단계): 구매 대기 pending 호출 ========== */
        Spinner.show();

        // 4번: 주차권 pending body에 plotId 제거 (스펙에 없음)
        const amanoBody = isSeason
          ? {
              plotId: parkingLotData?.MTicketTimeStart,
              seasonGoods: [
                {
                  gdsId: amanoGdsId,
                  purcPsn: carNo, // 구매자 이름을 차량번호로 사용
                  carNo: carNo,
                  carTp: carTp,
                  pakStrDt: pakStrDt,
                  purchaseDate: purchaseDate.slice(0, 10),
                },
              ],
            }
          : {
              gdsId: amanoGdsId,
              pinResveDtm: pinResveDtm,
              carNo: carNo,
              purchaseDate: purchaseDate,
            };

        // 2번: BASE_URL 상수 사용
        const AMANO_BASE = `${BASE_URL.replace(/\/$/, '')}/api/amano`;
        const amanoUrl = isSeason
          ? `${AMANO_BASE}/seasonpasses/pending`
          : `${AMANO_BASE}/parkingtickets/pending`;

        try {
          const res = await fetch(amanoUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(amanoBody),
          });

          const raw = await res.text();

          let json: any = {};
          try {
            json = raw ? JSON.parse(raw) : {};
          } catch {
            json = {};
          }

          const ok = res.ok && (json.success === undefined || json.success === true);
          if (!ok) {
            const errCode = (
              json?.errCode ||
              json?.err_code ||
              json?.errorCode ||
              json?.code ||
              json?.rsltCd ||
              ''
            ).toString();
            const errorMessage = json?.message || json?.rsltMsg || json?.msg || json?.des || '';

            // 메시지 내용으로 무시할지 확인
            const shouldIgnoreByMessage = AMANO_IGNORE_MESSAGES.some(ignoreMsg =>
              errorMessage.includes(ignoreMsg),
            );

            if (shouldIgnoreByMessage) {
              // 아마노 연동은 실패했지만 결제는 계속 진행
            } else if (errCode && AMANO_IGNORE_ERROR_CODES.has(errCode)) {
              // 아마노 연동은 실패했지만 결제는 계속 진행
            } else {
              // 에러 메시지 표시하고 중단
              const mapped = errCode ? AMANO_ERROR_MESSAGE_MAP[errCode] : undefined;
              const displayMsg =
                (mapped || errorMessage || raw || `주차권 결제 실패 (code: ${errCode || res.status})`) +
                '\n\n(관련 문의사항이 있을시 아래 문의하기 부탁드립니다.)';
              Spinner.hide();
              Alert.alert('주차권 결제 실패', displayMsg, [
                {text: '문의하기', onPress: () => navigation.navigate(ROUTE_KEY.ContactUs)},
                {text: '확인'},
              ]);
              return;
            }
          } else {
            // Amano API 성공: gdsTrdId 저장
            const gdsTrdId = isSeason
              ? json?.data?.seasonGoodsStatus?.[0]?.gdsTrdId || ''
              : json?.data?.gdsTrdId || '';
            if (gdsTrdId) {
              amanoMoid = gdsTrdId;
              setAmanoGdsTrdId(gdsTrdId);
            }
          }

          // 로딩 숨김
          Spinner.hide();
        } catch (error: any) {
          Spinner.hide();
          showMessage({
            message: '주차권 결제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          });
          return;
        }
      }
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
      ...(amanoMoid ? {moid: amanoMoid} : {}),
    };

    submitParkingReservation(body)
      .unwrap()
      .then(res => {
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

  const handleNavigateToReservation = () => {
    if (parkingLotData) {
      navigation.navigate(ROUTE_KEY.Reservation, {
        parkingLot: parkingLotData,
      });
    } else {
      showMessage({
        message: '주차장 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.',
      });
    }
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
          size={FONT.CAPTION}
        />
        <CustomText
          string="월주차를 제외한 모든 주차권은 한번의 입출차에 하나의 할인권만 적용(수시입출차불가, 무료회차 미포함)되기에 출차후 재입차하여 주차장 이용시 현장결제 요금이 발생할수 있습니다."
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
          <TouchableOpacity onPress={handleNavigateToReservation}>
            <MenuItem
              title="주차장명:"
              content={<CustomText string={payInfo?.garageName || ''} />}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNavigateToReservation}>
            <MenuItem
              title="주차권명:"
              content={
                <HStack style={{alignItems: 'center'}}>
                  <CustomText string={parkTicketName} />
                  <CustomText
                    string="(주차권 변경하기)"
                    color={colors.darkGray}
                    size={FONT.CAPTION}
                    textStyle={{
                      marginLeft: widthScale(5),
                      textDecorationLine: 'underline',
                    }}
                  />
                </HStack>
              }
            />
          </TouchableOpacity>
          <MenuItem
            title="주차권금액:"
            content={
              <CustomText
                string={`${getNumberWithCommas(ticketAmount)}${strings?.general_text?.won}`}
              />
            }
          />
          {Number(ticketAmount) > 0 && isSelectedTicketSoldOutForPay ? (
            <View style={{marginTop: heightScale(6), marginLeft: widthScale(150)}}>
              <CustomText
                string="선택된 주차권 매진입니다."
                color={colors.red}
                family={FONT_FAMILY.BOLD}
                size={FONT.CAPTION}
              />
            </View>
          ) : null}
          <MenuItem title="차량번호:" content={<CustomText string={payInfo?.carNumber || ''} />} />
        </View>

        <Divider />

        <View style={{marginTop: heightScale(10)}}>
          <MenuItem
            title="입차일"
            content={
              <TouchableOpacity onPress={() => chooseCalendarRef.current?.show()}>
                <HStack>
                  <View style={styles.dateWrapper}>
                    <CustomText string={getFullDayName(day)} />
                  </View>
                  <Icon name="calendar-outline" size={widthScale(30)} />
                </HStack>
              </TouchableOpacity>
            }
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: widthScale(150),
              marginBottom: heightScale(10),
              flexWrap: 'wrap',
            }}>
            {Number(payInfo?.a1TicketCost || 0) === 0 ? (
              <CustomText
                string="(당일만 예약 가능한 주차장)"
                color={colors.red}
                textStyle={{marginRight: widthScale(6)}}
              />
            ) : null}
            <CustomText
              string={moment(
                new Date(new Date().getTime() + (payInfo?.a1TicketCost || 0) * 24 * 60 * 60 * 1000),
              ).format('(MM월DD일까지 예약가능)')}
              color={colors.red}
            />
          </View>

          <MenuItem
            title="입차시간"
            content={
              <TouchableOpacity
                onPress={() => {
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
        <TouchableOpacity
          onPress={
            Number(ticketAmount) === 0
              ? handleViewParkingLot
              : isSelectedTicketSoldOutForPay
                ? () =>
                    showMessage({
                      message: '해당 주차권은 매진되어 구매할 수 없습니다.',
                    })
                : handleSubmit
          }
          disabled={Number(ticketAmount) > 0 && isSelectedTicketSoldOutForPay}
          style={[
            styles.confirmButtonWrapper,
            Number(ticketAmount) > 0 && isSelectedTicketSoldOutForPay
              ? {opacity: 0.5}
              : null,
          ]}>
          <CustomText
            string={
              Number(ticketAmount) === 0
                ? '주차상품 변경으로 주차권 다시보기'
                : isSelectedTicketSoldOutForPay
                  ? '매진'
                  : '결제하기'
            }
            color={colors.white}
            family={FONT_FAMILY.SEMI_BOLD}
          />
        </TouchableOpacity>
      </ScrollView>

      {/* Terms */}
      <ViewTermsPopup ref={viewTermsRef} />
      {/* Day picker (same as Reservation calendar) */}
      <ModalCalendarPicker
        ref={chooseCalendarRef}
        onConfirm={(value: Date) => setDay(moment(value).valueOf())}
        maximumDate={Number(payInfo?.a1TicketCost || 0)}
        soldOutDateStr={selectedTicket?.ticketdayLimit}
        disabledDayNames={payInfo?.dayNameGubun}
        restrictedRanges={parkingRestriction}
      />
      {/* Time picker (same as Reservation wheel bottom sheet) */}
      <ModalTimeWheelPicker
        ref={timePickerRef}
        selectedDate={new Date(day)}
        initialTime={new Date(time)}
        ticketStart={selectedTicket?.ticketStart}
        ticketEnd={selectedTicket?.ticketEnd}
        minuteInterval={10}
        onConfirm={(d: Date) => handleCheckTimeReservation(moment(d).valueOf())}
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
            )}${amanoGdsTrdId ? `&moid=${encodeURIComponent(amanoGdsTrdId)}` : ''}`,
          }}
          originWhitelist={['*']}
          onLoadEnd={async () => {
            if (!AMANO_USE_AS_IS && amanoGdsTrdId) {
              await callAmanoCompleteAPI();
            }

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
