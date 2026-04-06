import React, {forwardRef, useImperativeHandle, useRef, useState, useCallback, memo} from 'react';
import {ActivityIndicator, Alert, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import WebView from 'react-native-webview';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import TermModal, {TermModalRefs} from '~components/preferences/term-modal';
import ViewTermsPopup, {
  ViewTermsRefs,
} from '~components/valet-parking-reservation/view-terms-popup';
import Spinner from '~components/spinner';
import {BASE_URL, PADDING, width} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {useNavigation} from '@react-navigation/native';
import {ROUTE_KEY} from '~navigators/router';
import {useSubmitParkingReservationMutation} from '~services/reservationServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {getNumberWithCommas} from '~utils/numberUtils';

export interface ReservationCheckRefs {
  show: () => void;
}

interface Props {
  parkingLotId: number;
  pNum: string;
  nic: string;
  TotalTicketType: string;
  date: string;
  selectedDate: string;
  requirements: string;
  ticketPrice: number;
  usePoint: number;
  useCharge: number;
  useCoupon: number;
  agCarNumber: string;
  isAutoPaymentChecked: boolean;
  // 아마노 API 호출에 필요한 정보
  dateHire?: Date;
  timeHire?: Date;
  parkingLotAgency?: string;
  parkingLotMTicketTimeStart?: string;
  ticketAmanoGdsId?: string;
  ticketType?: string;
  carModel?: string;
  onSuccess: () => void;
  onDismiss: () => void;
}

const ReservationCheck = forwardRef((props: Props, ref) => {
  const {
    TotalTicketType,
    agCarNumber,
    date,
    nic,
    pNum,
    parkingLotId,
    requirements,
    selectedDate,
    ticketPrice,
    useCharge,
    useCoupon,
    usePoint,
    onSuccess,
    onDismiss,
    isAutoPaymentChecked,
    // 아마노 API 호출에 필요한 정보
    dateHire,
    timeHire,
    parkingLotAgency,
    parkingLotMTicketTimeStart,
    ticketAmanoGdsId,
    ticketType,
    carModel,
  } = props;

  const userToken = useAppSelector(state => state?.userReducer?.userToken);
  const userCordinate = useAppSelector(state => state?.coordinateReducer?.userCordinate);

  const [submitParkingReservation] = useSubmitParkingReservationMutation();

  const monthRuleRef = useRef<TermModalRefs>(null);
  const termRef = useRef<ViewTermsRefs>(null);

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isCheckLiAgree, setIsCheckLiAgree] = useState<boolean>(false);
  const [isCheckMonth, setIsCheckMonth] = useState<boolean>(false);
  const [showWebviewPointIn, setShowWebviewPointIn] = useState<boolean>(false);
  const [showWebviewPointOut, setShowWebviewPointOut] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [amanoGdsTrdId, setAmanoGdsTrdId] = useState<string>(''); // 아마노 거래 ID
  const [amanoPlotId, setAmanoPlotId] = useState<string>(''); // 아마노 주차장 ID (정기권 complete용)
  const [amanoIsSeason, setAmanoIsSeason] = useState<boolean>(false); // 정기권 여부

  const totalPrice = Number(ticketPrice) - Number(usePoint) - Number(useCharge) - Number(useCoupon);

  const show = () => {
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
    setIsCheckLiAgree(false);
    setIsCheckMonth(false);
    setShowWebviewPointIn(false);
    setShowWebviewPointOut(false);
    setIsLoading(false); // 로딩 상태도 초기화
    setAmanoGdsTrdId(''); // 아마노 거래 ID 초기화
    setAmanoPlotId(''); // 아마노 주차장 ID 초기화
    setAmanoIsSeason(false); // 정기권 여부 초기화
  };

  useImperativeHandle(
    ref,
    () => ({
      show,
    }),
    [],
  );

  const navigation = useNavigation<any>();

  // 아마노 에러 메시지 매핑
  const AMANO_ERROR_MESSAGE_MAP: Record<string, string> = {
    ERR_AKC_8002: '요청 처리 중 일시적인 문제가 발생했습니다.',
    ERR_AKC_8003: '요청 데이터에 오류가 있습니다. 올바른 파라미터가 아닙니다.',
    ERR_AKC_8004: '현재 선택하신 상품의 판매 가능 수량이 부족합니다. 다른 상품이나 다른 기간을 선택해 주세요.',
    ERR_AKC_8005: '로컬 센터 서버와 일시적으로 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
    ERR_AKC_8101: '입차 예정 시각이 올바르지 않습니다. 현재 예약 시간을 다시 확인해 주세요.',
    ERR_AKC_8102: '입차 예정 시각이 올바르지 않습니다. 입차 예정 시간을 다시 확인해 주세요.',
    ERR_AKC_8104: '차량번호를 올바르게 입력해 주세요.',
    ERR_AKC_8624: '이미 주차권이 완료된 차량입니다.',
    // 필요한 다른 에러 코드들도 추가 가능
  };

  // 아마노 에러 중 "결제는 계속 진행"하고 싶은 코드들
  // TODO: 실전 적용 시 주석 해제 예정
  // const AMANO_IGNORE_ERROR_CODES = new Set<string>(['ERR_AKC_8624', 'ERR_AKC_9603']);

  // 🔹 true: AS-IS (결제 후 /purchase 1번), false: TO-BE (pending → 결제 → complete 2번)
  const AMANO_USE_AS_IS = true;

  const handleConfirm = async () => {
    if (!isCheckLiAgree) {
      Alert.alert('약관을 동의해주세요.');
      return;
    }

    if (
      (TotalTicketType?.includes('월주차') || TotalTicketType?.includes('월연장')) &&
      !isCheckMonth
    ) {
      Alert.alert('월주차 약관을 동의해주세요');
      return;
    }

    setIsLoading(true);
    setAmanoGdsTrdId('');
    setAmanoPlotId('');
    setAmanoIsSeason(false);

    // ✅ 아마노 API 연동 조건 확인 및 호출
    const isAmanoAgency = parkingLotAgency === '아마노코리아';
    const hasMTicketTimeStart = parkingLotMTicketTimeStart && parkingLotMTicketTimeStart.trim() !== '';
    const amanoGdsId = ticketAmanoGdsId;
    const amanoTicketType = ticketType;

    let amanoMoid = '';

    if (isAmanoAgency && hasMTicketTimeStart && amanoGdsId) {
      const isSeason = amanoTicketType === '정기권';
      setAmanoIsSeason(isSeason);
      setAmanoPlotId(parkingLotMTicketTimeStart || '');

      const combineDateTime = () => {
        if (!dateHire || !timeHire) {
          return null;
        }
        const base = moment(dateHire);
        const time = moment(timeHire);
        base.hour(time.hour()).minute(time.minute()).second(0).millisecond(0);
        return base;
      };
      const combined = combineDateTime();
      const pinResveDtm = combined ? combined.utc().format('YYYY-MM-DDTHH:mm:ss[Z]') : null;
      const purchaseDate = moment().utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
      const pakStrDt = dateHire ? moment(dateHire).format('YYYY-MM-DD') : undefined;
      const carNo = agCarNumber || '';
      const carTp = carModel || '세단';

      if (AMANO_USE_AS_IS) {
        const purchaseResult = await callAmanoPurchaseAPI({
          isSeason,
          plotId: parkingLotMTicketTimeStart,
          gdsId: amanoGdsId,
          carNo,
          carTp,
          pinResveDtm,
          purchaseDate,
          pakStrDt,
        });
        if (!purchaseResult.ok) {
          setIsLoading(false);
          hide();
          onDismiss?.();
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
            plotId: parkingLotMTicketTimeStart,
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
          
          // 메시지 내용으로 에러 코드 추론 (서버에서 코드를 반환하지 않는 경우)
          const errorMessage = json?.message || json?.rsltMsg || '';
          let inferredErrCode = errCode;
          
          // 메시지 내용으로 에러 코드 추론
          if (!errCode && errorMessage) {
            if (errorMessage.includes('이미 다른 할인이 적용되어 있어') || 
                errorMessage.includes('중복 적용할 수 없습니다')) {
              inferredErrCode = 'ERR_AKC_9603';
            } else if (errorMessage.includes('이미 주차권이 완료된')) {
              inferredErrCode = 'ERR_AKC_8624';
            }
          }
          
          // 일부 에러코드는 결제를 계속 진행 (연동만 스킵)
          // TODO: 실전 적용 시 주석 해제 예정
          // if (!inferredErrCode || !AMANO_IGNORE_ERROR_CODES.has(inferredErrCode)) {
          if (true) { // 무시 코드 로직 비활성화 (실전 적용 시 주석 해제)
            const mapped = inferredErrCode ? AMANO_ERROR_MESSAGE_MAP[inferredErrCode] : undefined;
            Spinner.hide();
            setIsLoading(false);
            
            // 팝업을 닫고 에러 메시지 표시 (팝업에 가려지지 않도록)
            hide();
            const msg =
              (mapped ||
                json?.message ||
                json?.rsltMsg ||
                json?.msg ||
                json?.des ||
                `주차권 결제 실패 (code: ${errCode || res.status})`) +
              '\n\n(관련 문의사항이 있을시 아래 문의하기 부탁드립니다.)';
            Alert.alert('주차권 결제 실패', msg, [
              {text: '문의하기', onPress: () => navigation.navigate(ROUTE_KEY.ContactUs)},
              {text: '확인'},
            ]);
            onDismiss?.();
            return;
          }
        } else {
          // 5번: 정기권은 seasonGoodsStatus[0].gdsTrdId, 주차권은 data.gdsTrdId
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
        setIsLoading(false);
        
        // 팝업을 닫고 에러 메시지 표시 (팝업에 가려지지 않도록)
        hide();
        Alert.alert(
          '주차권 결제 오류',
          '주차권 결제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        );
        onDismiss?.();
        return;
      }
      } // TO-BE else 블록 종료
    }

    // 실제 결제 API 호출
    const body = {
      memberId: userToken?.id,
      memberPwd: userToken?.password,
      agCarNumber: encodeURIComponent(agCarNumber),
      edDtm: selectedDate,
      stDtm: selectedDate,
      parkId: parkingLotId,
      payAmt: totalPrice,
      payLocation: `${userCordinate?.lat}/${userCordinate?.long}`,
      requirements: encodeURIComponent(requirements),
      TotalTicketType: encodeURIComponent(TotalTicketType),
      useCoupon: useCoupon,
      usePoint: usePoint,
      usePointSklent: useCharge,
      ...(amanoMoid ? {moid: amanoMoid} : {}),
    };

    submitParkingReservation(body)
      .unwrap()
      .then(res => {
        if (res?.statusCode === '200') {
          setShowWebviewPointIn(true);
        } else {
          Alert.alert(
            res?.statusMsg ||
              '결제에 실패하셨습니다. 등록된 카드에 문제가 있을수있으니 삭제후 재등록부탁드립니다.',
          );
          hide();
          onDismiss?.();
        }
      })
      .catch(error => {
        // 에러 처리 추가
        setIsLoading(false);
        Alert.alert('결제 중 오류가 발생했습니다. 다시 시도해 주세요.');
        console.error('Payment error:', error);
        hide();
        onDismiss?.();
      });
  };

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
      Alert.alert('주차권 결제 오류', '주차권 결제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
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

  const handleModalClose = useCallback(() => {
    if (!isLoading) {
      hide();
      onDismiss?.();
    }
  }, [isLoading, hide, onDismiss]);

  return (
    <ReactNativeModal
      onBackButtonPress={handleModalClose}
      onBackdropPress={handleModalClose}
      isVisible={isVisible}
      useNativeDriver>
      <View style={styles.container}>
        <CustomText
          string={`${nic}님,`}
          size={FONT.BODY}
          family={FONT_FAMILY.BOLD}
          textStyle={{marginBottom: heightScale(15)}}
        />
        <HStack>
          <View style={styles.viewGrayText}>
            <CustomText
              string={date}
              size={FONT.TITLE_3}
              family={FONT_FAMILY.BOLD}
              textStyle={styles.grayTextContent} // 스타일 이름 변경 적용
            />
          </View>
        </HStack>

        <HStack>
          <View style={styles.viewGrayText}>
            <CustomText
              string={`${requirements} 입차`}
              size={FONT.TITLE_3}
              family={FONT_FAMILY.BOLD}
              textStyle={styles.grayTextContent} // 스타일 이름 변경 적용
            />
          </View>
        </HStack>

        <HStack>
          <View style={styles.viewGrayText}>
            <CustomText
              string={TotalTicketType}
              size={FONT.TITLE_3}
              family={FONT_FAMILY.BOLD}
              textStyle={styles.grayTextContent} // 스타일 이름 변경 적용
            />
          </View>
        </HStack>

        <HStack>
          <View style={styles.viewGrayText}>
            <CustomText
              string={agCarNumber}
              size={FONT.TITLE_3}
              family={FONT_FAMILY.BOLD}
              textStyle={styles.grayTextContent} // 스타일 이름 변경 적용
            />
          </View>
        </HStack>
        <CustomText
          string={`기본: ${getNumberWithCommas(ticketPrice)}${strings?.general_text?.won}`}
        />
        <CustomText
          string={`적립금: ${getNumberWithCommas(usePoint)}${strings?.general_text?.won}`}
          textStyle={{
            marginVertical: heightScale(5),
          }}
        />
        <CustomText
          string={`충전금: ${getNumberWithCommas(useCharge)}${strings?.general_text?.won}`}
        />
        <CustomText
          string={`쿠폰: ${getNumberWithCommas(useCoupon)}${strings?.general_text?.won}`}
          textStyle={{
            marginVertical: heightScale(5),
          }}
        />

        <HStack
          style={{
            marginTop: heightScale(10),
          }}>
          <CustomText string="결제금액: " size={FONT.TITLE_3} family={FONT_FAMILY.SEMI_BOLD} />
          <CustomText
            string={getNumberWithCommas(totalPrice)}
            size={FONT.TITLE_3}
            family={FONT_FAMILY.BOLD}
            color={colors.red}
          />
          <CustomText
            string={`${strings?.general_text?.won}`}
            size={FONT.TITLE_3}
            family={FONT_FAMILY.BOLD}
          />
        </HStack>

        <HStack
          style={{
            marginVertical: heightScale(15),
          }}>
          <TouchableOpacity
            onPress={() => {
              setIsCheckLiAgree(!isCheckLiAgree);
            }}
            disabled={isLoading}
            activeOpacity={1}
            style={{flex: 1}}>
            <HStack style={{marginVertical: heightScale(5)}}>
              <TouchableOpacity
                onPress={() => {
                  setIsCheckLiAgree(!isCheckLiAgree);
                }}
                disabled={isLoading}
                activeOpacity={1}
                style={{flex: 1}}>
                <HStack>
                  <View style={styles.checkWrapper}>
                    <View
                      style={[
                        styles.dot,
                        {backgroundColor: isCheckLiAgree ? colors.red : colors.transparent},
                      ]}
                    />
                  </View>
                  <View style={{flex: 1, marginRight: widthScale(5)}}>
                    <CustomText string="주차요금 및 이용 약관 동의" size={FONT.CAPTION_2} />
                  </View>
                  {/* 🚩 [스타일 수정 2] 불필요한 View를 제거하고 TouchableOpacity에 직접 스타일을 적용합니다. */}
                  <TouchableOpacity
                    style={styles.termButton}
                    onPress={() => {
                      termRef?.current?.show();
                    }}>
                    <CustomText string="약관보기" />
                  </TouchableOpacity>
                </HStack>
              </TouchableOpacity>
            </HStack>
          </TouchableOpacity>
        </HStack>
        {TotalTicketType?.includes('월주차') || TotalTicketType?.includes('월연장') ? (
          <HStack style={{marginBottom: heightScale(25)}}>
            <TouchableOpacity
              onPress={() => {
                setIsCheckMonth(!isCheckMonth);
              }}
              disabled={isLoading}
              activeOpacity={1}
              style={{flex: 1}}>
              <HStack>
                <View style={styles.checkWrapper}>
                  <View
                    style={[
                      styles.dot,
                      {backgroundColor: isCheckMonth ? colors.red : colors.transparent},
                    ]}
                  />
                </View>
                <View style={{flex: 1, marginRight: widthScale(5)}}>
                  <CustomText string="월주차 이용안내 및 취소, 환불 규정" size={FONT.CAPTION_2} />
                </View>
                {/* 🚩 [스타일 수정 2] 여기도 동일하게 구조를 변경합니다. */}
                <TouchableOpacity
                  style={styles.termButton}
                  onPress={() => {
                    monthRuleRef?.current?.show();
                  }}>
                  <CustomText string="약관보기" />
                </TouchableOpacity>
              </HStack>
            </TouchableOpacity>
          </HStack>
        ) : null}

        <HStack style={{justifyContent: 'space-around'}}>
          {/* 🚩 [스타일 수정 2] 여기도 동일하게 구조를 변경합니다. */}
          <TouchableOpacity
            disabled={isLoading}
            onPress={handleModalClose}
            style={styles.bottomButton}>
            <CustomText string="취소하기" family={FONT_FAMILY.BOLD} color={colors.grayText} />
          </TouchableOpacity>

          {/* 🚩 [스타일 수정 2] 여기도 동일하게 구조를 변경합니다. */}
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={isLoading}
            style={[styles.bottomButton, {backgroundColor: colors.red}]}>
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <CustomText string="확인하기" family={FONT_FAMILY.BOLD} color={colors.white} />
            )}
          </TouchableOpacity>
        </HStack>

        <ViewTermsPopup ref={termRef} />
        <TermModal ref={monthRuleRef} />

        {showWebviewPointIn ? (
          <WebView
            source={{
              uri: `http://cafe.wisemobile.kr/imobile/pay_lite/pointInsert.php?mmid=${
                userToken?.id
              }&selectedDate=${selectedDate}&requirements=${encodeURIComponent(
                requirements,
              )}&totalPrice=${totalPrice}&parkId=${parkingLotId}`,
            }} // requirements 인코딩
            onLoadEnd={() => {
              setTimeout(() => {
                setShowWebviewPointOut(true);
              }, 100);
            }}
            originWhitelist={['*']}
          />
        ) : null}

        {showWebviewPointOut ? (
          <WebView
            source={{
              uri: `http://cafe.wisemobile.kr/imobile/pay_lite/android_payResult_ticket.php?mmid=${
                userToken?.id
              }&selectedDate=${selectedDate}&requirements=${encodeURIComponent(
                requirements,
              )}&TotalTicketType=${encodeURIComponent(
                TotalTicketType,
              )}&parkId=${parkingLotId}&AutoPay=${
                isAutoPaymentChecked ? 1 : 0
              }${amanoGdsTrdId ? `&moid=${encodeURIComponent(amanoGdsTrdId)}` : ''}`,
            }}
            onLoadEnd={async () => {
              if (!AMANO_USE_AS_IS && amanoGdsTrdId) {
                await callAmanoCompleteAPI();
              }

              setTimeout(() => {
                hide();
                onSuccess?.(); // props의 onSuccess 호출
                // setIsLoading(false); // hide()에서 이미 처리
              }, 100);
            }}
            originWhitelist={['*']}
          />
        ) : null}
      </View>
    </ReactNativeModal>
  );
});

export default memo(ReservationCheck);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: PADDING + 5,
    width: width * 0.75,
    alignSelf: 'center',
    borderRadius: PADDING,
    overflow: 'hidden', // 모달 컨테이너는 그림자가 없으므로 hidden 유지
  },
  viewGrayText: {
    height: heightScale(55),
    backgroundColor: colors.card,
    marginBottom: heightScale(10),
    borderRadius: widthScale(5),
    paddingHorizontal: widthScale(10),
    justifyContent: 'center',
    alignItems: 'flex-start', // 텍스트를 왼쪽 정렬
    width: '100%', // 부모 HStack에 맞춰 너비 100%
  },
  grayTextContent: {
    // 이름 변경 (기존 grayText -> grayTextContent)
    // backgroundColor: colors.card, // 배경색은 부모 View에서 이미 처리
    padding: widthScale(5),
    // borderRadius: widthScale(10), // 불필요한 이중 borderRadius 제거
    // marginVertical: heightScale(5), // 불필요한 margin 제거
  },
  checkWrapper: {
    width: widthScale(15),
    height: widthScale(15),
    borderWidth: 1,
    borderRadius: 999,
    marginRight: widthScale(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.darkGray,
  },
  dot: {
    width: widthScale(8),
    height: widthScale(8),
    backgroundColor: colors.gray,
    borderRadius: 999,
  },
  // checkButtonWrapper 스타일은 현재 사용되지 않는 것으로 보입니다.
  // checkButtonWrapper: {
  //   backgroundColor: colors.gray,
  //   paddingHorizontal: widthScale(5),
  //   paddingVertical: heightScale(3),
  //   borderRadius: widthScale(5),
  // },

  bottomButton: {
    height: heightScale(50),
    width: widthScale(120),
    borderRadius: widthScale(5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },

  termButton: {
    backgroundColor: colors.white,
    paddingHorizontal: widthScale(10),
    paddingVertical: heightScale(5),
    borderRadius: widthScale(5),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  // 하단 버튼 (취소/확인) 그림자 담당
  bottomButtonShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 8,
  },
  // 하단 버튼 (취소/확인) 내용 담당
  bottomButtonContent: {
    backgroundColor: colors.white, // 기본 배경 (확인 버튼은 인라인으로 오버라이드)
    height: heightScale(50),
    width: widthScale(120),
    borderRadius: widthScale(5),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  // 약관보기 버튼 그림자 담당
  termButtonShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // 약관보기 버튼 내용 담당
  termButtonContent: {
    backgroundColor: colors.white,
    paddingHorizontal: widthScale(10),
    paddingVertical: heightScale(5),
    borderRadius: widthScale(5),
    overflow: 'hidden',
  },
});
