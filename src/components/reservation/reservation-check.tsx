import React, {forwardRef, useImperativeHandle, useRef, useState, useCallback, memo} from 'react';
import {ActivityIndicator, Alert, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import WebView from 'react-native-webview';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import TermModal, {TermModalRefs} from '~components/preferences/term-modal';
import ViewTermsPopup, {
  ViewTermsRefs,
} from '~components/valet-parking-reservation/view-terms-popup';
import {PADDING, width} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
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
    isAutoPaymentChecked, // Props에서 isAutoPaymentChecked를 받아옵니다.
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
  };

  useImperativeHandle(
    ref,
    () => ({
      show,
    }),
    [],
  );

  const handleConfirm = () => {
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
                isAutoPaymentChecked ? 1 : 0 // props에서 받은 isAutoPaymentChecked 사용
              }`,
            }} // requirements, TotalTicketType 인코딩
            onLoadEnd={() => {
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
