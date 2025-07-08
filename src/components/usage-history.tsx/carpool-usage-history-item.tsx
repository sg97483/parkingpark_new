import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {memo, useCallback, useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import AppModal from '~components/app-modal';
import CustomButton from '~components/commons/custom-button';
import InfoPriceRoute from '~components/commons/info-price-route';
import RouteBadge from '~components/commons/route-badge';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import {PADDING1} from '~constants/constant';
import {AUTO_MESSAGE_TYPE, FONT, FONT_FAMILY} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {CarpoolPayHistoryModel} from '~model/passenger-model';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useGetDrivingDirectionQuery} from '~services/naverMapServices';
import {
  useGetPayHistoryInfoQuery,
  useUpdateRoadDayStateCheckMutation,
} from '~services/passengerServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {handleSendAutomaticMessage} from '~utils/firebaseChatUtils';
import {carpoolStatusValue} from '~utils/getRouteStateValue';
import {calculatePenaltyFeeIn, calculatePenaltyFeeOut} from '~utils/hourUtils';

interface Props {
  item: CarpoolPayHistoryModel;
  onItemPress: () => void;
  type?: 'FOR_DRIVER' | 'FOR_PASSENGER';
  viewMode?: boolean;
}

const CarpoolUsageHistoryItem: React.FC<Props> = memo(props => {
  const {item, onItemPress, type = 'FOR_PASSENGER', viewMode = false} = props;
  const {myDriverInfo, user} = userHook();
  const [updateRoadDayStateCheck] = useUpdateRoadDayStateCheckMutation();

  const navigation = useNavigation<UseRootStackNavigation>();
  const currentCarpoolAlarmList = useAppSelector(
    state => state?.termAndConditionReducer?.carpoolAlarmList,
  );
  const carpoolAlarm = useMemo(
    () => currentCarpoolAlarmList?.find(it => it?.roomID === item?.chatId),
    [currentCarpoolAlarmList, item?.chatId],
  );

  const {data: direction} = useGetDrivingDirectionQuery({
    start: `${item?.splng},${item?.splat}`,
    end:
      item?.amt === item?.soPrice
        ? `${item?.soplng},${item?.soplat}`
        : `${item?.eplng},${item?.eplat}`,
  });

  const {data: payInfo} = useGetPayHistoryInfoQuery({
    hid: item?.id,
    requestBy: 'PASSENGER',
  });

  const endTime = useMemo(
    () =>
      moment(item?.startTime, 'HH:mm')
        .add(direction?.duration ?? 0, 'minutes')
        .format('HH:mm'),
    [direction?.duration, item?.startTime],
  );

  const handleGoToRunningPage = useCallback(() => {
    if (type === 'FOR_PASSENGER') {
      navigation.navigate(ROUTE_KEY.Running, {
        item: item,
      });
      return;
    }

    if (type === 'FOR_DRIVER') {
      navigation.navigate(ROUTE_KEY.DriverRunning, {
        item: item,
      });
      return;
    }
  }, [type, item]);

  const payCardMethod = useMemo(() => {
    if (type === 'FOR_DRIVER') {
      return myDriverInfo?.calYN === 'M' ? true : false;
    }

    return payInfo?.payMethod === 'BILL' ? true : false;
  }, [payInfo, myDriverInfo, type]);

  const runningTimeString = useMemo(
    () => item?.selectDay?.slice(0, 10) + ' ' + item?.startTime,
    [item],
  );

  const penaltyFeePercent =
    item?.carInOut === 'in'
      ? calculatePenaltyFeeIn(runningTimeString)
      : calculatePenaltyFeeOut(runningTimeString);

  const penaltyFeeAmount = useMemo(() => {
    switch (penaltyFeePercent) {
      case '10%':
        return (Number(item?.price) * 0.1).toFixed(0);
      case '100%':
        return Number(item?.price);
      default:
        return 0;
    }
  }, [penaltyFeePercent, item?.price]);

  const onCancelPayment = useCallback(() => {
    setTimeout(() => {
      AppModal.show({
        title:
          type === 'FOR_DRIVER'
            ? `현재 해당 예약 취소시 카풀금액의\n${penaltyFeePercent}가 취소 수수료로\n등록하신 카드로 자동결제 됩니다.`
            : `현재 해당 예약 취소시\n결제금액의 ${penaltyFeePercent}가\n수수료로 부과됩니다.`,
        content: '정말 취소하시겠습니까?',
        textYes: '예약취소',
        isTwoButton: true,
        textNo: '닫기',
        yesFunc() {
          navigation.navigate(ROUTE_KEY.CancelRoutePaymentConfirmation, {
            percentFined: Number(penaltyFeePercent.replace('%', '')),
            routeInfo: {...item, endTime},
            type: type === 'FOR_PASSENGER' ? 'PASSENGER_HISTORY' : 'DRIVER_HISTORY',
            onCancelSuccess() {
              updateRoadDayStateCheck({
                roadInfoId: item?.roadInfoId,
                state: 'C',
              })
                .unwrap()
                .then(() => {
                  handleSendAutomaticMessage({
                    roomID: item?.chatId ?? '',
                    type:
                      type === 'FOR_PASSENGER'
                        ? AUTO_MESSAGE_TYPE.PASSENGER_CANCEL_PAYMENT
                        : AUTO_MESSAGE_TYPE.DRIVER_CANCEL_PAYMENT,
                    driverName: user?.nic ?? '',
                    passengerName: user?.nic ?? '',
                  });
                });
            },
          });
        },
      });
    }, 250);
  }, [type, item, penaltyFeePercent, penaltyFeeAmount, currentCarpoolAlarmList, carpoolAlarm]);

  const paymentPrice = useMemo(() => {
    return item?.amt ? (item?.amt === item?.price ? item?.price : item?.soPrice) : '0';
  }, [item]);

  const cancelPricePayment = useMemo(() => {
    if (type === 'FOR_PASSENGER') {
      // CANCEL
      if (item?.rStatusCheck === 'C') {
        if (item?.cancelRequestBy === 'PASSENGER') {
          if (item?.cancelAmt) {
            return `${Number(paymentPrice) - Number(item?.cancelAmt)}`;
          }
          return `${paymentPrice}`;
        } else {
          return '0';
        }
      }

      // PENALTY
      if (
        (item?.rStatusCheck === 'P' && item?.cancelRequestBy === 'PASSENGER') ||
        item?.penaltyRequestBy === 'PASSENGER'
      ) {
        return `${Number(paymentPrice) * 2}`;
      }
      if (
        (item?.rStatusCheck === 'P' && item?.cancelRequestBy === 'DRIVER') ||
        item?.penaltyRequestBy === 'DRIVER'
      ) {
        return '0';
      }
    }

    if (type === 'FOR_DRIVER') {
      // CANCEL
      if (item?.rStatusCheck === 'C') {
        if (item?.cancelRequestBy === 'DRIVER') {
          if (item?.cancelNum) {
            return `${Number(item?.cancelNum)}`;
          }
          return `${paymentPrice}`;
        } else {
          return '0';
        }
      }

      // COMPLETE
      if (item?.rStatusCheck === 'E' || item?.rStatusCheck === 'R' || item?.rStatusCheck === 'O') {
        if (payCardMethod) {
          const price = Number(paymentPrice) - Number(paymentPrice) * 0.25;
          return `${price}`;
        }
        const price = Number(paymentPrice) - Number(paymentPrice) * 0.2;
        return `${price}`;
      }

      // PENALTY
      if (
        (item?.rStatusCheck === 'P' && item?.cancelRequestBy === 'DRIVER') ||
        item?.penaltyRequestBy === 'DRIVER'
      ) {
        return `${Number(paymentPrice) * 2}`;
      }
      if (
        (item?.rStatusCheck === 'P' && item?.cancelRequestBy === 'PASSENGER') ||
        item?.penaltyRequestBy === 'PASSENGER'
      ) {
        return '0';
      }
    }

    return paymentPrice;
  }, [item, type, paymentPrice, payCardMethod]);

  return (
    <View>
      <Pressable onPress={onItemPress}>
        <PaddingHorizontalWrapper forDriveMe>
          <HStack style={{gap: widthScale1(10)}}>
            <RouteBadge type={item?.carInOut === 'in' ? 'WAY_WORK' : 'WAY_HOME'} />
            <CustomText
              forDriveMe
              family={FONT_FAMILY.SEMI_BOLD}
              string={carpoolStatusValue(item?.rStatusCheck ?? '')}
              color={
                item?.rStatusCheck === 'P'
                  ? colors.primary
                  : item?.rStatusCheck === 'C' || item?.rStatusCheck === 'E'
                    ? colors.disableButton
                    : colors.heavyGray
              }
            />
          </HStack>

          <CustomText
            string={item?.selectDay}
            family={FONT_FAMILY.SEMI_BOLD}
            forDriveMe
            size={FONT.BODY}
            textStyle={styles.timeTextStyle}
          />

          <RoutePlanner
            startAddress={item?.startPlace ?? ''}
            arriveAddress={item?.amt === item?.soPrice ? item?.stopOverPlace : item?.endPlace}
            timeStart={item?.startTime}
            stopOverAddress={
              item?.rStatusCheck !== 'R' || item?.soPrice ? '' : (item?.stopOverPlace ?? '')
            }
            timeArrive={item?.rStatusCheck === 'C' ? item?.startTime : endTime}
            hideExpectations={
              item?.rStatusCheck === 'E' || item?.rStatusCheck === 'C' || item?.rStatusCheck === 'P'
            }
          />

          <HStack style={styles.priceStyle}>
            <InfoPriceRoute
              price={item?.rStatusCheck === 'C' ? cancelPricePayment : item?.price} // 조건에 따라 price 값 설정
              onPress={onItemPress}
              isUsageHistory={type === 'FOR_DRIVER' && item?.rStatusCheck === 'C'}
              completePayment={
                item?.rStatusCheck === 'E' ||
                item?.rStatusCheck === 'R' ||
                item?.rStatusCheck === 'O'
              }
              cancelPayment={item?.rStatusCheck === 'C'}
              penaltyCarpool={item?.rStatusCheck === 'P'}
              driverCarpoolHistory={type === 'FOR_DRIVER' && item?.rStatusCheck !== 'C'}
              type={type}
            />
          </HStack>

          {viewMode ? null : (
            <View>
              {/* Carpool is running */}
              {item?.rStatusCheck === 'O' && (
                <CustomButton
                  text={__DEV__ ? 'RUNNING' : '운행중'}
                  buttonHeight={58}
                  type="TERTIARY"
                  outLine
                  buttonStyle={{marginTop: heightScale1(30)}}
                  onPress={handleGoToRunningPage}
                />
              )}

              {/* Cancel reservation */}
              {item?.rStatusCheck === 'R' && (
                <CustomButton
                  text={__DEV__ ? 'CANCEL PAYMENT' : '예약취소'}
                  buttonHeight={58}
                  type="TERTIARY"
                  outLine
                  buttonStyle={{marginTop: heightScale1(30)}}
                  onPress={onCancelPayment}
                />
              )}

              {/* Completed reservation */}
              {item?.rStatusCheck === 'E' && type === 'FOR_PASSENGER' && !item?.ratId && (
                <CustomButton
                  text={__DEV__ ? 'RATING DRIVER' : '평가하기'}
                  buttonHeight={58}
                  type="TERTIARY"
                  outLine
                  buttonStyle={{marginTop: heightScale1(30)}}
                  onPress={() =>
                    navigation.navigate(ROUTE_KEY.Evaluation, {
                      driverID: item?.d_memberId,
                      resId: item?.id,
                    })
                  }
                />
              )}
            </View>
          )}
        </PaddingHorizontalWrapper>

        <Divider insetsVertical={30} />
      </Pressable>
    </View>
  );
});

export default CarpoolUsageHistoryItem;

const styles = StyleSheet.create({
  timeTextStyle: {
    marginTop: heightScale1(4),
    marginBottom: PADDING1,
  },
  priceStyle: {
    marginTop: PADDING1,
    marginLeft: 'auto',
  },
  removeButtonStyle: {
    marginLeft: 'auto',
  },
});
