import notifee from '@notifee/react-native';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import React, {memo, useCallback, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import WebView from 'react-native-webview';
import {Icons} from '~/assets/svgs';
import AppModal from '~components/app-modal';
import CustomButton from '~components/commons/custom-button';
import PageButton from '~components/commons/page-button';
import RouteBadge from '~components/commons/route-badge';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import Spacer from '~components/spacer';
import Spinner from '~components/spinner';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheCarpoolAlarmList} from '~reducers/termAndContionReducer';

import {
  useCancelPaymentMutation,
  usePenaltyPaymentMutation,
  useUpdateRoadDayStateCheckMutation,
} from '~services/passengerServices';
import {useGetCreditCardListQuery} from '~services/paymentCardServices';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {getNumberWithCommas} from '~utils/numberUtils';

const CancelRoutePaymentConfirmation = memo(
  (props: RootStackScreenProps<'CancelRoutePaymentConfirmation'>) => {
    const {navigation, route} = props;
    const {percentFined, routeInfo, type, onCancelSuccess} = route.params;

    const isPassengerCancelPayment = type === 'PASSENGER_HISTORY';
    const {userToken} = userHook();
    const dispatch = useAppDispatch();

    const [canceledHistoryId, setCanceledHistoryId] = useState<number>();

    const currentCarpoolAlarmList = useAppSelector(
      state => state?.termAndConditionReducer?.carpoolAlarmList,
    );
    const carpoolAlarm = useMemo(
      () => currentCarpoolAlarmList?.find(it => it?.roomID === routeInfo?.chatId),
      [currentCarpoolAlarmList, routeInfo?.chatId],
    );

    const runningTimeString = useMemo(
      () => routeInfo?.selectDay?.slice(0, 10) + ' ' + routeInfo?.startTime,
      [routeInfo],
    );

    const [cancelPayment, {isLoading: isCancelingPayment}] = useCancelPaymentMutation();
    const [updateRoadDayState] = useUpdateRoadDayStateCheckMutation();
    const {data: payCardList} = useGetCreditCardListQuery({
      memberId: userToken?.id,
      memberPwd: userToken?.password,
    });
    const [penaltyPayment, {isLoading: isPenaltyPayment}] = usePenaltyPaymentMutation();

    const defaultPaymentCard = useMemo(
      () => payCardList?.find(item => item?.defaultYN === 'Y'),
      [payCardList],
    );

    const paymentPrice = useMemo(() => {
      return routeInfo?.amt
        ? routeInfo?.amt === routeInfo?.price
          ? routeInfo?.price
          : routeInfo?.soPrice
        : routeInfo?.price;
    }, [routeInfo]);

    const getPenaltyFee = useMemo((): number => {
      switch (percentFined) {
        case 10:
          return Number(((Number(paymentPrice) * 10) / 100).toFixed(0));
        case 100:
          return Number(paymentPrice);
        default:
          return 0;
      }
    }, [percentFined, paymentPrice]);

    const handlePenaltyPayment = useCallback(() => {
      console.log('roadInfo: ', routeInfo?.id);
      Spinner.show();
      penaltyPayment({
        cancelRequestBy: type === 'DRIVER_HISTORY' ? 'DRIVER' : 'PASSENGER',
        resId: routeInfo?.id,
      })
        .unwrap()
        .then(res => {
          setTimeout(async () => {
            if (res === '200') {
              setCanceledHistoryId(routeInfo?.id);

              await updateRoadDayState({
                roadInfoId: routeInfo?.roadInfoId,
                state: 'C',
              });

              await firestore().collection('rooms').doc(routeInfo?.chatId).update({
                rStatusCheck: 'C',
              });

              if (carpoolAlarm?.notiID) {
                await notifee.cancelTriggerNotification(carpoolAlarm?.notiID);
                dispatch(
                  cacheCarpoolAlarmList(
                    currentCarpoolAlarmList?.filter(it => it?.roomID !== routeInfo?.chatId) ?? [],
                  ),
                );
              }

              AppModal.show({
                title: '취소가 완료되었습니다.',
                content: '취소 내역은 이용내역에서 확인하실수 있습니다.',
                textYes: '확인',
                yesFunc() {
                  onCancelSuccess && onCancelSuccess();
                  navigation.goBack();
                },
              });
            } else {
              showMessage({
                message: strings.general_text?.please_try_again,
              });
            }
            Spinner.hide();
          }, 500);
        })
        .catch(() => {
          Spinner.hide();
        });
    }, [type, routeInfo, carpoolAlarm, currentCarpoolAlarmList]);

    const handleCancelPayment = useCallback(() => {
      Spinner.show();

      const body = {
        cancelRequestBy: type === 'DRIVER_HISTORY' ? 'DRIVER' : 'PASSENGER',
        chatId: routeInfo?.chatId,
        d_memberId: routeInfo?.d_memberId,
        r_memberId: routeInfo?.r_memberId,
        historyId: routeInfo?.id,
        reservedStDtm: moment(runningTimeString, 'YYYY.MM.DD HH:mm').format('YYYYMMDDHHmm'),
        roadInfoId: routeInfo?.roadInfoId,
        cancelAmt: type === 'PASSENGER_HISTORY' ? Number(paymentPrice) - getPenaltyFee : '',
        cancelNum: type === 'DRIVER_HISTORY' ? Number(paymentPrice) - getPenaltyFee : '',
      };

      console.log('body', body);

      cancelPayment(body as any)
        .unwrap()
        .then(async res => {
          if (res === '200') {
            setCanceledHistoryId(routeInfo?.id);

            await updateRoadDayState({
              roadInfoId: routeInfo?.roadInfoId,
              state: 'C',
            });

            if (carpoolAlarm?.notiID) {
              await notifee.cancelTriggerNotification(carpoolAlarm?.notiID);
              dispatch(
                cacheCarpoolAlarmList(
                  currentCarpoolAlarmList?.filter(it => it?.roomID !== routeInfo?.chatId) ?? [],
                ),
              );
            }

            AppModal.show({
              title: '취소가 완료되었습니다.',
              content: '취소 내역은 이용내역에서 확인하실수 있습니다.',
              textYes: '확인',
              yesFunc() {
                onCancelSuccess && onCancelSuccess();
                navigation.goBack();
              },
            });
          } else {
            showMessage({
              message: strings.general_text?.please_try_again,
            });
          }

          Spinner.hide();
        })
        .catch(() => {
          Spinner.hide();
        });
    }, [routeInfo, getPenaltyFee, runningTimeString, type, percentFined]);

    const cancelPaymentPrice = useCallback(() => {
      if (type === 'PASSENGER_HISTORY') {
        // cancel 100%
        return (
          <>
            <CustomText
              string={`취소수수료 ${percentFined}%`}
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              color={colors.primary}
            />
            <CustomText
              string={`-${getNumberWithCommas(getPenaltyFee)}원`}
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              color={colors.primary}
            />
          </>
        );
      }

      // DRIVER
      return (
        <>
          <CustomText
            string={`취소수수료 ${percentFined}%`}
            forDriveMe
            family={FONT_FAMILY.MEDIUM}
            color={colors.primary}
          />
          <CustomText
            string={`${getNumberWithCommas(getPenaltyFee)}원`}
            forDriveMe
            family={FONT_FAMILY.MEDIUM}
            color={colors.primary}
          />
        </>
      );
    }, [percentFined, type, getPenaltyFee]);

    const cancelTotalPaymentPrice = useCallback(() => {
      //  PASSENGER cancel 100%
      if (type === 'PASSENGER_HISTORY' && percentFined === 100) {
        return (
          <>
            <CustomText
              string={'총 환불금액'}
              forDriveMe
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.MEDIUM}
            />
            <CustomText
              string={'0원'}
              forDriveMe
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </>
        );
      }

      // DRIVER cancel 100%
      if (type === 'DRIVER_HISTORY') {
        return (
          <>
            <CustomText
              string={'총 취소수수료 부과금액'}
              forDriveMe
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.MEDIUM}
            />
            <CustomText
              string={`${getNumberWithCommas(getPenaltyFee)}원`}
              forDriveMe
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </>
        );
      }

      return (
        <>
          <CustomText
            string={type === 'PASSENGER_HISTORY' ? '총 환불금액' : '총 취소수수료 부과금액'}
            forDriveMe
            size={FONT.CAPTION_7}
            family={FONT_FAMILY.MEDIUM}
          />
          <CustomText
            string={`${getNumberWithCommas(Number(paymentPrice) - getPenaltyFee)}원`}
            forDriveMe
            size={FONT.CAPTION_7}
            family={FONT_FAMILY.SEMI_BOLD}
          />
        </>
      );
    }, [percentFined, type, getPenaltyFee]);

    return (
      <FixedContainer>
        <CustomHeader text="" />

        <ScrollView
          contentContainerStyle={styles.containerStyle}
          showsVerticalScrollIndicator={false}>
          <PaddingHorizontalWrapper containerStyles={{gap: heightScale1(6)}} forDriveMe>
            <CustomText
              string={'아래의 예약 내용을\n정말 취소하시겠습니까?'}
              forDriveMe
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.CAPTION_9}
              lineHeight={heightScale1(31)}
            />
            <CustomText
              string="상황에 따라 수수료 및 패널티가 부과될수 있습니다."
              forDriveMe
              color={colors.grayText}
            />
          </PaddingHorizontalWrapper>

          <PaddingHorizontalWrapper forDriveMe>
            <PageButton
              text="수수료 및 패널티 정책 확인"
              onPress={() => navigation.navigate(ROUTE_KEY.PenaltyPolicy)}
            />
          </PaddingHorizontalWrapper>

          <PaddingHorizontalWrapper containerStyles={{gap: PADDING1}} forDriveMe>
            <View style={{gap: heightScale1(4)}}>
              <HStack style={{gap: widthScale1(10)}}>
                <RouteBadge type={routeInfo?.carInOut === 'in' ? 'WAY_WORK' : 'WAY_HOME'} />
                <CustomText
                  string="예약완료"
                  forDriveMe
                  family={FONT_FAMILY.SEMI_BOLD}
                  color={colors.heavyGray}
                />
              </HStack>
              <CustomText
                string={routeInfo?.selectDay}
                forDriveMe
                size={FONT.BODY}
                family={FONT_FAMILY.SEMI_BOLD}
              />
            </View>
            <RoutePlanner
              timeStart={routeInfo?.startTime ?? ''}
              startAddress={routeInfo?.startPlace ?? ''}
              stopOverAddress={routeInfo?.soPrice ? '' : (routeInfo?.stopOverPlace ?? '')}
              arriveAddress={
                routeInfo?.amt === routeInfo?.soPrice
                  ? routeInfo?.stopOverPlace
                  : (routeInfo?.endPlace ?? '')
              }
              timeArrive={routeInfo?.endTime ?? ''}
            />
          </PaddingHorizontalWrapper>

          <Divider />

          <PaddingHorizontalWrapper forDriveMe containerStyles={{gap: PADDING1}}>
            <HStack style={styles.menuItemStyle}>
              <CustomText
                string="취소 상세내역"
                forDriveMe
                size={FONT.BODY}
                family={FONT_FAMILY.SEMI_BOLD}
              />
              <CustomText
                string="영수증"
                forDriveMe
                size={FONT.CAPTION_7}
                family={FONT_FAMILY.MEDIUM}
                color={colors.lineCancel}
              />
            </HStack>
            <HStack style={styles.menuItemStyle}>
              <CustomText
                string="카풀요금"
                forDriveMe
                family={FONT_FAMILY.MEDIUM}
                color={colors.grayText}
              />
              <CustomText
                string={`${getNumberWithCommas(paymentPrice)}원`}
                forDriveMe
                family={FONT_FAMILY.MEDIUM}
                color={colors.grayText}
                textStyle={type === 'DRIVER_HISTORY' ? {textDecorationLine: 'line-through'} : {}}
              />
            </HStack>
            <HStack style={styles.menuItemStyle}>{cancelPaymentPrice()}</HStack>
            <HStack style={styles.menuItemStyle}>{cancelTotalPaymentPrice()}</HStack>
          </PaddingHorizontalWrapper>

          <Divider />

          <PaddingHorizontalWrapper containerStyles={{gap: PADDING1}} forDriveMe>
            <CustomText
              string={isPassengerCancelPayment ? '환불수단' : '취소 수수료 부과수단'}
              forDriveMe
              size={FONT.BODY}
              family={FONT_FAMILY.SEMI_BOLD}
            />

            <HStack>
              <Icons.Card />
              <Spacer insetNumber={12} />
              <CustomText
                forDriveMe
                family={FONT_FAMILY.MEDIUM}
                string={`${(defaultPaymentCard?.cardName ?? '')
                  .replace('[', '')
                  .replace(']', '')} ${defaultPaymentCard?.number1 ?? ''}********${
                  defaultPaymentCard?.number4 ?? ''
                }`}
              />
            </HStack>
          </PaddingHorizontalWrapper>

          <Divider />
        </ScrollView>

        <PaddingHorizontalWrapper forDriveMe>
          <CustomButton
            buttonStyle={styles.submitButtonStyle}
            text="예약취소"
            buttonHeight={58}
            onPress={
              percentFined === 100 && type === 'PASSENGER_HISTORY'
                ? handlePenaltyPayment
                : handleCancelPayment
            }
            isLoading={isCancelingPayment || isPenaltyPayment}
          />
        </PaddingHorizontalWrapper>

        {canceledHistoryId && (
          <WebView
            source={{
              uri: `http://cafe.wisemobile.kr/imobile/pay_lite/cancelCarPoolSendKakao.php?historyId=${canceledHistoryId}`,
            }}
            originWhitelist={['*']}
          />
        )}
      </FixedContainer>
    );
  },
);

export default CancelRoutePaymentConfirmation;

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: heightScale1(16),
    paddingBottom: heightScale1(28),
    gap: heightScale1(30),
  },
  menuItemStyle: {
    justifyContent: 'space-between',
  },
  submitButtonStyle: {
    marginBottom: PADDING1 / 2,
    marginTop: heightScale1(10),
  },
});
