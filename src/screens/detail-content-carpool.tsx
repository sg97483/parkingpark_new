import moment from 'moment';
import React, {memo, useCallback, useMemo} from 'react';
import {Pressable, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import AppModal from '~components/app-modal';
import Avatar from '~components/commons/avatar';
import CustomButton from '~components/commons/custom-button';
import PageButton from '~components/commons/page-button';
import RouteBadge from '~components/commons/route-badge';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import RatingStar from '~components/evaluate/rating-star';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import Spacer from '~components/spacer';
import Spinner from '~components/spinner';
import {PADDING1} from '~constants/constant';
import {AUTO_MESSAGE_TYPE, FONT, FONT_FAMILY} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {
  useAddFavoriteDriverMutation,
  useGetFavoriteDriverListQuery,
  useRemoveFavoriteDriverMutation,
} from '~services/carpoolServices';
import {useGetDrivingDirectionQuery} from '~services/naverMapServices';
import {
  useGetPayHistoryInfoQuery,
  useReadMyRatingQuery,
  useUpdateRoadDayStateCheckMutation,
} from '~services/passengerServices';
import {useGetCreditCardQuery} from '~services/paymentCardServices';
import {useReadMyDriverQuery} from '~services/userServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {handleSendAutomaticMessage} from '~utils/firebaseChatUtils';
import {carpoolStatusValue} from '~utils/getRouteStateValue';
import {calculatePenaltyFeeIn, calculatePenaltyFeeOut} from '~utils/hourUtils';
import {getNumberWithCommas} from '~utils/numberUtils';

const DetailContentCarpool = (props: RootStackScreenProps<'DetailContentCarpool'>) => {
  const {navigation, route} = props;
  const {item, type} = route?.params;
  console.log('🚀 ~ DetailContentCarpool ~ item:', item);

  const {userID, myDriverInfo, user} = userHook();

  const isWayToWork = useMemo((): boolean => item?.carInOut === 'in', [item?.carInOut]);

  const [updateRoadDayStateCheck] = useUpdateRoadDayStateCheckMutation();

  const {data: payInfo} = useGetPayHistoryInfoQuery({
    hid: item?.id,
    requestBy: 'PASSENGER',
  });

  const {data: passengerInfo} = useReadMyDriverQuery(
    {
      memberId: item?.r_memberId?.toString(),
    },
    {skip: !item?.r_memberId},
  );

  const {data: listFavoriteDriver, refetch: refetchListFavoriteDriver} =
    useGetFavoriteDriverListQuery(
      {
        memberId: userID || 0,
      },
      {skip: !userID},
    );

  const {data: ratingOfReservation} = useReadMyRatingQuery({
    driverId: item?.d_memberId,
    resId: item?.id,
  });

  const avgEvaluation = useMemo(() => {
    return (
      (Number(ratingOfReservation?.driverQ1) +
        Number(ratingOfReservation?.driverQ2) +
        Number(ratingOfReservation?.driverQ3)) /
      3
    ).toFixed(1);
  }, [ratingOfReservation]);

  const [addFavoriteDriver] = useAddFavoriteDriverMutation();
  const [removeFavoriteDriver] = useRemoveFavoriteDriverMutation();
  const isFavoriteDriver = useMemo(
    () => listFavoriteDriver?.find(it => it?.driverId === item?.d_memberId)?.favStatus === 'Y',
    [listFavoriteDriver],
  );
  const {data: direction} = useGetDrivingDirectionQuery({
    start: `${item?.splng},${item?.splat}`,
    end: item?.soPrice ? `${item?.soplng},${item?.soplat}` : `${item?.eplng},${item?.eplat}`,
    waypoints: item?.soPrice
      ? ''
      : item?.soplng && item?.soplat
        ? `${item?.soplng},${item?.soplat}`
        : '',
  });

  const {data: creditCard} = useGetCreditCardQuery({memberId: userID?.toString() as string});

  const runningTimeString = useMemo(
    () => item?.selectDay?.slice(0, 10) + ' ' + item?.startTime,
    [item],
  );

  const endTime = useMemo(
    () =>
      item?.endTime
        ? item?.endTime
        : moment(item?.startTime, 'HH:mm')
            .add(direction?.duration ?? 0, 'minutes')
            .format('HH:mm'),
    [direction?.duration, item?.startTime, item?.endTime],
  );

  const handleCancelPaymentPress = useCallback(() => {
    if (item?.carInOut === 'in') {
      AppModal.show({
        title: `현재 해당 예약 취소시 카풀금액의 ${calculatePenaltyFeeIn(
          runningTimeString,
        )}가 취소 수수료로\n등록하신 카드로 자동결제 됩니다.`,
        content: '정말 취소하시겠습니까?',
        textYes: '예약취소',
        isTwoButton: true,
        textNo: '닫기',
        yesFunc() {
          navigation.replace(ROUTE_KEY.CancelRoutePaymentConfirmation, {
            routeInfo: {...item, endTime: endTime},
            percentFined: Number(calculatePenaltyFeeIn(runningTimeString).replace('%', '')),
            type,
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
                      type === 'PASSENGER_HISTORY'
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
    }

    if (item?.carInOut === 'out') {
      AppModal.show({
        title: `현재 해당 예약 취소시 카풀금액의 ${calculatePenaltyFeeOut(
          runningTimeString,
        )}가 취소 수수료로\n등록하신 카드로 자동결제 됩니다.`,
        content: '정말 취소하시겠습니까?',
        textYes: '예약취소',
        isTwoButton: true,
        textNo: '닫기',
        yesFunc() {
          navigation.replace(ROUTE_KEY.CancelRoutePaymentConfirmation, {
            routeInfo: {...item, endTime: endTime},
            percentFined: Number(calculatePenaltyFeeOut(runningTimeString).replace('%', '')),
            type,
          });
        },
      });
    }
  }, [item, endTime, runningTimeString]);

  const renderButton = useMemo(() => {
    switch (item?.rStatusCheck) {
      case 'O':
        return (
          <CustomButton
            text={__DEV__ ? 'RUNNING' : '운행중'}
            buttonHeight={58}
            type="TERTIARY"
            outLine
            buttonStyle={styles.submitButtonStyle}
            onPress={() => {
              if (type === 'DRIVER_HISTORY') {
                navigation.navigate(ROUTE_KEY.DriverRunning, {
                  item: item,
                });
              } else {
                navigation.navigate(ROUTE_KEY.Running, {
                  item: item,
                });
              }
            }}
          />
        );

      // case 'E':
      //   if (type === 'PASSENGER_HISTORY') {
      //     return (
      //       <CustomButton
      //         text={__DEV__ ? 'RATING' : '평가하기'}
      //         buttonHeight={58}
      //         type="TERTIARY"
      //         outLine
      //         buttonStyle={styles.submitButtonStyle}
      //         onPress={() => {
      //           navigation.navigate(ROUTE_KEY.Evaluation, {
      //             driverID: item?.d_memberId,
      //             resId: item?.id,
      //           });
      //         }}
      //       />
      //     );
      //   }

      case 'R':
        return (
          <CustomButton
            text={__DEV__ ? 'CANCEL PAYMENT' : '예약취소'}
            buttonHeight={58}
            type="TERTIARY"
            outLine
            buttonStyle={styles.submitButtonStyle}
            onPress={handleCancelPaymentPress}
          />
        );

      default:
        return null;
    }
  }, [item, type]);

  const handleAddFavoriteDriver = useCallback(() => {
    if (isFavoriteDriver) {
      Spinner.show();
      removeFavoriteDriver({
        driverId: item?.d_memberId ?? 0,
        memberId: userID ?? 0,
      })
        .unwrap()
        .then(res => {
          if (res === '200') {
            refetchListFavoriteDriver();
          }
        })
        .finally(() => {
          setTimeout(() => {
            Spinner.hide();
          }, 1000);
        });
    } else {
      Spinner.show();
      addFavoriteDriver({
        driverId: item?.d_memberId ?? 0,
        memberId: userID ?? 0,
      })
        .unwrap()
        .then(res => {
          if (res === '200') {
            refetchListFavoriteDriver();
          }
        })
        .finally(() => {
          setTimeout(() => {
            Spinner.hide();
          }, 1000);
        });
    }
  }, [isFavoriteDriver]);

  const cancelOrPenaltyFee = useMemo(
    () => Number(item?.cancelAmt ?? item?.amt),
    [item?.cancelAmt, item?.cancelAmt],
  );

  const accountInformationToReceiveMoneyAndCompensation = useCallback(() => {
    return (
      <View style={{gap: heightScale1(30), marginBottom: heightScale1(30)}}>
        {myDriverInfo?.calYN !== 'C' ? (
          <PaddingHorizontalWrapper forDriveMe>
            <View style={{gap: PADDING1}}>
              <View style={styles.infoViewStyle}>
                <CustomText
                  textStyle={styles.infoTextStyle}
                  string={
                    item?.rStatusCheck === 'P'
                      ? '아래 계좌로 드라이버님이 지불한 패널티 금액의 90%를 위로보상금으로 지급하였습니다.'
                      : '아래 계좌로 카풀금액의 90% 금액을 위로보상금으로 지급하였습니다.'
                  }
                />
              </View>

              <View style={{gap: heightScale1(6)}}>
                <HStack>
                  <View style={styles.cardInfoTitleStyle}>
                    <CustomText
                      forDriveMe
                      color={colors.grayText}
                      numberOfLines={1}
                      string="계좌번호"
                    />
                  </View>

                  <CustomText
                    string={`국민 ${myDriverInfo?.bankNum}`}
                    forDriveMe
                    family={FONT_FAMILY.MEDIUM}
                  />
                </HStack>
                <HStack>
                  <View style={styles.cardInfoTitleStyle}>
                    <CustomText
                      forDriveMe
                      color={colors.grayText}
                      numberOfLines={1}
                      string="예금주"
                    />
                  </View>

                  <CustomText
                    string={myDriverInfo?.bankName ?? ''}
                    forDriveMe
                    family={FONT_FAMILY.MEDIUM}
                  />
                </HStack>
              </View>
            </View>
          </PaddingHorizontalWrapper>
        ) : (
          <PaddingHorizontalWrapper forDriveMe>
            <View style={{gap: PADDING1}}>
              <View style={styles.infoViewStyle}>
                <CustomText
                  textStyle={styles.infoTextStyle}
                  string={`카풀 예약 취소로 인해 피해를 받으신 ${
                    item?.cancelRequestBy === 'DRIVER' || item?.penaltyRequestBy == 'DRIVER'
                      ? '탑승객'
                      : '드라이버'
                  }님께 위로보상금을 지급할 예정입니다. 아래 보상 받으실 계좌정보를 입력해주세요.`}
                />
              </View>
              <PageButton
                text={'계좌정보를 등록해주세요.'}
                onPress={() =>
                  navigation.navigate(ROUTE_KEY.PaymentRegistration, {isCarpoolPayment: true})
                }
              />
            </View>
          </PaddingHorizontalWrapper>
        )}

        <Divider />
      </View>
    );
  }, [myDriverInfo]);

  const daysOfWeek = (day: number) => {
    switch (day) {
      case 1:
        return '월';
      case 2:
        return '화';
      case 3:
        return '수';
      case 4:
        return '목';
      default:
        return '금';
    }
  };

  const payCardMethod = useMemo(() => {
    if (type === 'DRIVER_HISTORY') {
      if (
        (item?.rStatusCheck === 'P' || item?.rStatusCheck === 'C') &&
        (item?.cancelRequestBy === 'DRIVER' || item?.penaltyRequestBy === 'DRIVER')
      ) {
        return true;
      }
      return item?.calYN
        ? item?.calYN === 'M'
          ? true
          : false
        : myDriverInfo?.calYN === 'M'
          ? true
          : false;
    }

    return payInfo?.payMethod === 'BILL' ? true : false;
  }, [payInfo, myDriverInfo, type]);

  const paymentDate = useMemo(() => {
    const selectDate = item?.selectDay.slice(0, (item?.selectDay.length as number) - 3);
    const dateTime = new Date(moment(selectDate, 'YYYY.MM.DD') as any);
    if (!payCardMethod) {
      const nextDay = dateTime.getTime() + 60 * 60 * 24 * 1000;
      const nextDate = new Date(nextDay);

      if (nextDate.getDay() === 6) {
        const nextMonday = nextDay + 60 * 60 * 24 * 1000 * 2;
        const strNextDate = moment(nextMonday as any).format('YYYY.MM.DD');
        const monday = new Date(nextMonday).getDay();

        return item?.payStatus === 'Y'
          ? `${strNextDate}(${daysOfWeek(monday)}) 충전금 충전 완료되었습니다.`
          : `${strNextDate}(${daysOfWeek(monday)}) 충전금 충전 예정입니다.`;
      } else {
        const strNextDate = moment(nextDate as any).format('YYYY.MM.DD');
        const strNextDay = daysOfWeek(nextDate.getDay());
        return item?.payStatus === 'Y'
          ? `${strNextDate}(${strNextDay}) 충전금 충전 완료되었습니다.`
          : `${strNextDate}(${strNextDay}) 충전금 충전 예정입니다.`;
      }
    }

    let nextMonday = dateTime.getTime() + 60 * 60 * 24 * 1000 * 2;

    do {
      nextMonday += 60 * 60 * 24 * 1000;
    } while (new Date(nextMonday).getDay() !== 2);

    return item?.payStatus === 'Y'
      ? `${moment(nextMonday).format('YYYY.MM.DD')}(화) 계좌 입금 완료되었습니다.`
      : `${moment(nextMonday).format('YYYY.MM.DD')}(화) 계좌 입금 예정입니다.`;
  }, [item, payInfo, payCardMethod]);

  const paymentPrice = useMemo(() => {
    return item?.amt ? (item?.amt === item?.price ? item?.price : item?.soPrice) : item?.price;
  }, [item]);

  const renderTextPaymentPenalty = useCallback(() => {
    if (type === 'PASSENGER_HISTORY') {
      if (item?.rStatusCheck === 'C' && item?.cancelRequestBy === 'PASSENGER') {
        const cancelAmt =
          Number(item?.cancelAmt) > 0
            ? Number(paymentPrice) / (Number(paymentPrice) - Number(item?.cancelAmt))
            : 100;

        return (
          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string={`취소수수료 ${cancelAmt.toFixed(0)}%`}
              family={FONT_FAMILY.MEDIUM}
              color={colors.primary}
            />
            <CustomText
              forDriveMe
              string={
                item?.cancelAmt
                  ? `${getNumberWithCommas(Number(paymentPrice) - Number(item?.cancelAmt))}원`
                  : `${getNumberWithCommas(Number(paymentPrice))}원`
              }
              family={FONT_FAMILY.MEDIUM}
              color={colors.primary}
            />
          </HStack>
        );
      }

      if (item?.rStatusCheck === 'C' && item?.cancelRequestBy === 'DRIVER') {
        return (
          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string={'취소 환불 금액'}
              family={FONT_FAMILY.MEDIUM}
              color={colors.primary}
            />
            <CustomText
              forDriveMe
              string={`-${getNumberWithCommas(Number(paymentPrice))}원`}
              family={FONT_FAMILY.MEDIUM}
              color={colors.primary}
            />
          </HStack>
        );
      }

      if (
        item?.rStatusCheck === 'P' &&
        (item?.cancelRequestBy === 'DRIVER' || item?.penaltyRequestBy === 'DRIVER')
      ) {
        return (
          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string={'패널티금액'}
              family={FONT_FAMILY.MEDIUM}
              color={colors.primary}
            />
            <CustomText
              forDriveMe
              string={`${0}원`}
              family={FONT_FAMILY.MEDIUM}
              color={colors.primary}
            />
          </HStack>
        );
      }
      if (
        item?.rStatusCheck === 'P' &&
        (item?.cancelRequestBy === 'PASSENGER' || item?.penaltyRequestBy === 'PASSENGER')
      ) {
        return (
          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string={'패널티금액'}
              family={FONT_FAMILY.MEDIUM}
              color={colors.primary}
            />
            <CustomText
              forDriveMe
              string={`${getNumberWithCommas(Number(paymentPrice))}원`}
              family={FONT_FAMILY.MEDIUM}
              color={colors.primary}
            />
          </HStack>
        );
      }
    }

    if (type === 'DRIVER_HISTORY') {
      if (item?.rStatusCheck === 'C' && item?.cancelRequestBy === 'PASSENGER') {
        return (
          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string={'취소수수료 0%'}
              family={FONT_FAMILY.MEDIUM}
              color={colors.primary}
            />
            <CustomText
              forDriveMe
              string={'0원'}
              family={FONT_FAMILY.MEDIUM}
              color={colors.primary}
            />
          </HStack>
        );
      }

      if (item?.rStatusCheck === 'E' || item?.rStatusCheck === 'R' || item?.rStatusCheck === 'O') {
        if (payCardMethod) {
          // pay through bank card
          const price = Number(paymentPrice) * 0.25;
          return (
            <HStack style={styles.priceSessionStyle}>
              <CustomText
                forDriveMe
                string={'수수료25%'}
                family={FONT_FAMILY.MEDIUM}
                color={colors.grayText}
              />
              <CustomText
                forDriveMe
                string={`-${getNumberWithCommas(price)}원`}
                family={FONT_FAMILY.MEDIUM}
                color={colors.grayText}
              />
            </HStack>
          );
        } else {
          const price = Number(paymentPrice) * 0.2;

          return (
            <HStack style={styles.priceSessionStyle}>
              <CustomText
                forDriveMe
                string={'수수료20%'}
                family={FONT_FAMILY.MEDIUM}
                color={colors.grayText}
              />
              <CustomText
                forDriveMe
                string={`-${getNumberWithCommas(price)}원`}
                family={FONT_FAMILY.MEDIUM}
                color={colors.grayText}
              />
            </HStack>
          );
        }
      }

      if (item?.rStatusCheck === 'C' && item?.cancelRequestBy === 'DRIVER') {
        const cancelAmt =
          Number(item?.amt) === Number(item?.cancelNum)
            ? 100
            : Number(item?.amt) / Number(item?.cancelNum);

        return (
          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string={`취소수수료 ${cancelAmt.toFixed(0)}%`}
              family={FONT_FAMILY.MEDIUM}
              color={colors.primary}
            />
            <CustomText
              forDriveMe
              string={
                item?.cancelAmt
                  ? `${getNumberWithCommas(Number(item?.cancelNum))}원`
                  : `${getNumberWithCommas(Number(paymentPrice))}원`
              }
              family={FONT_FAMILY.MEDIUM}
              color={colors.primary}
            />
          </HStack>
        );
      }

      if (
        item?.rStatusCheck === 'P' &&
        (item?.cancelRequestBy === 'DRIVER' || item?.penaltyRequestBy === 'DRIVER')
      ) {
        return (
          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string={'패널티금액'}
              family={FONT_FAMILY.MEDIUM}
              color={colors.primary}
            />
            <CustomText
              forDriveMe
              string={`${getNumberWithCommas(Number(paymentPrice) * 2)}원`}
              family={FONT_FAMILY.MEDIUM}
              color={colors.primary}
            />
          </HStack>
        );
      }

      if (
        item?.rStatusCheck === 'P' &&
        (item?.cancelRequestBy === 'PASSENGER' || item?.penaltyRequestBy === 'PASSENGER')
      ) {
        return (
          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string={'패널티금액'}
              family={FONT_FAMILY.MEDIUM}
              color={colors.primary}
            />
            <CustomText
              forDriveMe
              string={`${0}원`}
              family={FONT_FAMILY.MEDIUM}
              color={colors.primary}
            />
          </HStack>
        );
      }
    }

    return (
      <HStack style={styles.priceSessionStyle}>
        <CustomText
          forDriveMe
          string={item?.rStatusCheck === 'C' ? '취소수수료' : '패널티금액'}
          family={FONT_FAMILY.MEDIUM}
          color={colors.primary}
        />
        <CustomText
          forDriveMe
          string={`-${getNumberWithCommas(paymentPrice)}원`}
          family={FONT_FAMILY.MEDIUM}
          color={colors.primary}
        />
      </HStack>
    );
  }, [item, type, payInfo, paymentPrice, payCardMethod]);

  const renderTextPaymentTotal = useCallback(() => {
    if (
      type === 'DRIVER_HISTORY' &&
      (item?.rStatusCheck === 'E' || item?.rStatusCheck === 'R' || item?.rStatusCheck === 'O')
    ) {
      if (payCardMethod) {
        const price = Number(paymentPrice) - Number(paymentPrice) * 0.25;
        return (
          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string="총 정산금액"
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.MEDIUM}
            />
            <CustomText
              forDriveMe
              string={`${getNumberWithCommas(price)}원`}
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </HStack>
        );
      } else {
        const price = Number(paymentPrice) - Number(paymentPrice) * 0.2;
        return (
          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string="총 정산금액"
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.MEDIUM}
            />
            <CustomText
              forDriveMe
              string={`${getNumberWithCommas(price)}원`}
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </HStack>
        );
      }
    }

    if (item?.rStatusCheck === 'P') {
      if (
        type === 'PASSENGER_HISTORY' &&
        (item?.cancelRequestBy === 'DRIVER' || item?.penaltyRequestBy === 'DRIVER')
      ) {
        return (
          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string="총 결제금액"
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.MEDIUM}
            />
            <CustomText
              forDriveMe
              string={'0원'}
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </HStack>
        );
      }
      if (
        type === 'PASSENGER_HISTORY' &&
        (item?.cancelRequestBy === 'PASSENGER' || item?.penaltyRequestBy === 'PASSENGER')
      ) {
        return (
          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string="총 결제금액"
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.MEDIUM}
            />
            <CustomText
              forDriveMe
              string={`${getNumberWithCommas(Number(paymentPrice) * 2)}원`}
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </HStack>
        );
      }

      if (
        type === 'DRIVER_HISTORY' &&
        (item?.cancelRequestBy === 'PASSENGER' || item?.penaltyRequestBy === 'PASSENGER')
      ) {
        return (
          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string="총 패널티부과 금액"
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.MEDIUM}
            />
            <CustomText
              forDriveMe
              string={'0원'}
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </HStack>
        );
      }
      if (
        type === 'DRIVER_HISTORY' &&
        (item?.cancelRequestBy === 'DRIVER' || item?.penaltyRequestBy === 'DRIVER')
      ) {
        return (
          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string="총 패널티부과 금액"
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.MEDIUM}
            />
            <CustomText
              forDriveMe
              string={`${getNumberWithCommas(Number(paymentPrice) * 2)}원`}
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </HStack>
        );
      }
    }

    if (item?.rStatusCheck === 'C') {
      if (type === 'DRIVER_HISTORY' && item?.cancelRequestBy === 'PASSENGER') {
        return (
          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string="총 취소수수료 부과금액"
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.MEDIUM}
            />
            <CustomText
              forDriveMe
              string={'0원'}
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </HStack>
        );
      }
      if (type === 'DRIVER_HISTORY' && item?.cancelRequestBy === 'DRIVER') {
        const price =
          Number(item?.amt) / Number(item?.cancelNum) === 10
            ? Number(item?.cancelNum)
            : Number(paymentPrice);
        return (
          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string="총 결제금액"
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.MEDIUM}
            />
            <CustomText
              forDriveMe
              string={`${getNumberWithCommas(price)}원`}
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </HStack>
        );
      }

      if (type === 'PASSENGER_HISTORY' && item?.cancelRequestBy === 'DRIVER') {
        return (
          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string="총 결제금액"
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.MEDIUM}
            />
            <CustomText
              forDriveMe
              string={'0원'}
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </HStack>
        );
      }

      if (type === 'PASSENGER_HISTORY' && item?.cancelRequestBy === 'PASSENGER') {
        const price =
          Number(item?.cancelAmt) > 0
            ? Number(paymentPrice) - Number(item?.cancelAmt)
            : Number(paymentPrice);
        return (
          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string="총 결제금액"
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.MEDIUM}
            />
            <CustomText
              forDriveMe
              string={`${getNumberWithCommas(item?.amt)}원`}
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </HStack>
        );
      }
    }

    if (
      type === 'PASSENGER_HISTORY' &&
      (item?.rStatusCheck === 'E' || item?.rStatusCheck === 'R' || item?.rStatusCheck === 'O')
    ) {
      return (
        <HStack style={styles.priceSessionStyle}>
          <CustomText
            forDriveMe
            string="총 결제금액"
            size={FONT.CAPTION_7}
            family={FONT_FAMILY.MEDIUM}
          />

          <CustomText
            forDriveMe
            string={`${getNumberWithCommas(Number(item?.amt))}원`}
            size={FONT.CAPTION_7}
            family={FONT_FAMILY.SEMI_BOLD}
          />
        </HStack>
      );
    }

    return (
      <HStack style={styles.priceSessionStyle}>
        <CustomText
          forDriveMe
          string="총 결제금액"
          size={FONT.CAPTION_7}
          family={FONT_FAMILY.MEDIUM}
        />

        <CustomText
          forDriveMe
          string={`${getNumberWithCommas(Number(paymentPrice) - cancelOrPenaltyFee)}원`}
          size={FONT.CAPTION_7}
          family={FONT_FAMILY.SEMI_BOLD}
        />
      </HStack>
    );
  }, [item, type, payInfo, paymentPrice, payCardMethod]);

  const textPayment = useMemo((): string => {
    if (type === 'DRIVER_HISTORY') {
      if (item?.rStatusCheck === 'C' && item?.cancelRequestBy === 'DRIVER') {
        return '취소 수수료 부과수단';
      }
      if (item?.rStatusCheck === 'C' && item?.cancelRequestBy === 'PASSENGER') {
        return '취소 상세내역';
      }

      if (
        item?.rStatusCheck === 'P' &&
        (item?.cancelRequestBy === 'PASSENGER' || item?.penaltyRequestBy === 'PASSENGER')
      ) {
        return '패널티 상세내역';
      }
      if (
        item?.rStatusCheck === 'P' &&
        (item?.cancelRequestBy === 'DRIVER' || item?.penaltyRequestBy === 'DRIVER')
      ) {
        return '패널티 부과수단';
      }
    }

    if (type === 'PASSENGER_HISTORY') {
      if (
        item?.rStatusCheck === 'P' &&
        (item?.cancelRequestBy === 'DRIVER' || item?.penaltyRequestBy === 'DRIVER')
      ) {
        return '환불수단';
      }

      return '결제수단';
    }

    return '정산방식';
  }, [type, item, payInfo]);

  const textDetailBill = useMemo((): string => {
    if (type === 'DRIVER_HISTORY') {
      if (item?.rStatusCheck === 'C' && item?.cancelRequestBy === 'PASSENGER') {
        return '취소 상세내역';
      }
      if (item?.rStatusCheck === 'P' && item?.cancelRequestBy === 'PASSENGER') {
        return '패널티 상세내역';
      }
    }

    return '요금 상세내역';
  }, [type, item, payInfo]);

  const hideBill = useMemo((): boolean => {
    if (type === 'DRIVER_HISTORY') {
      if (item?.rStatusCheck === 'C' && item?.cancelRequestBy === 'PASSENGER') {
        return true;
      }
      if (item?.rStatusCheck === 'E' || item?.rStatusCheck === 'R' || item?.rStatusCheck === 'O') {
        return true;
      }
    }

    if (type === 'PASSENGER_HISTORY') {
      if (
        (item?.rStatusCheck === 'C' || item?.rStatusCheck === 'P') &&
        item?.cancelRequestBy === 'DRIVER'
      ) {
        return true;
      }
      if (
        item?.rStatusCheck === 'P' &&
        (item?.cancelRequestBy === 'PASSENGER' || item?.penaltyRequestBy === 'PASSENGER')
      ) {
        return true;
      }
    }
    return false;
  }, [type, item, payInfo]);

  const isTenPercentCancelAmt = useMemo(() => {
    if (
      (type === 'PASSENGER_HISTORY' &&
        item?.rStatusCheck === 'C' &&
        item?.cancelRequestBy === 'DRIVER') ||
      (type === 'DRIVER_HISTORY' &&
        item?.rStatusCheck === 'C' &&
        item?.cancelRequestBy === 'PASSENGER')
    ) {
      if (item?.cancelAmt) {
        const percent = Number(paymentPrice) / (Number(paymentPrice) - Number(item?.cancelAmt));

        return Number(item?.cancelAmt) === 0 ? false : percent <= 10 ? true : false;
      }
    }

    return false;
  }, [item, type, paymentPrice]);

  const convertToCard = useCallback(
    (bankNum: string) => {
      const startNum = bankNum?.slice(0, 4)?.concat('********');
      const endNum = bankNum?.slice(-4);

      return startNum?.concat(endNum);
    },
    [payInfo?.cardNo],
  );

  const creditMethod = useMemo(() => {
    if (type === 'DRIVER_HISTORY') {
      if (
        (item?.rStatusCheck === 'P' || item?.rStatusCheck === 'C') &&
        (item?.cancelRequestBy === 'DRIVER' || item?.penaltyRequestBy === 'DRIVER')
      ) {
        const carName = creditCard?.cardName?.replace('[', '');
        return `${carName?.replace(']', '') || ''} ${creditCard?.number1 || ''}********${
          creditCard?.number4 || ''
        }`;
      }
      return `${myDriverInfo?.bankName || ''} ${myDriverInfo?.bankNum || ''}`;
    }

    if (type === 'PASSENGER_HISTORY') {
      if (
        (item?.rStatusCheck === 'P' || item?.rStatusCheck === 'C') &&
        (item?.cancelRequestBy === 'PASSENGER' || item?.penaltyRequestBy === 'PASSENGER')
      ) {
        const carName = creditCard?.cardName?.replace('[', '');
        return `${carName?.replace(']', '') || ''} ${creditCard?.number1 || ''}********${
          creditCard?.number4 || ''
        }`;
      }
    }

    return `${payInfo?.cardName || ''} ${convertToCard(payInfo?.cardNo as string) || ''}`;
  }, [payInfo, myDriverInfo, creditCard]);

  const iconCard = useCallback(() => {
    if (type === 'DRIVER_HISTORY' && item?.rStatusCheck !== 'C' && item?.rStatusCheck !== 'P') {
      return <Icons.Wallet />;
    }

    if (
      type === 'DRIVER_HISTORY' &&
      item?.rStatusCheck === 'P' &&
      (item?.cancelRequestBy === 'DRIVER' || item?.penaltyRequestBy === 'DRIVER')
    ) {
      return <Icons.CreditCard />;
    }

    return <Icons.Card />;
  }, [type, item]);

  const isThroughLine = useMemo(() => {
    if (type === 'DRIVER_HISTORY' && (item?.rStatusCheck === 'C' || item?.rStatusCheck === 'P')) {
      return true;
    }

    if (
      type === 'PASSENGER_HISTORY' &&
      item?.rStatusCheck === 'P' &&
      (item?.cancelRequestBy === 'DRIVER' || item?.penaltyRequestBy === 'DRIVER')
    ) {
      return true;
    }

    if (
      type === 'PASSENGER_HISTORY' &&
      item?.rStatusCheck === 'C' &&
      item?.cancelRequestBy === 'PASSENGER'
    ) {
      return true;
    }

    return false;
  }, [type, item]);

  const isShowBankNum = useMemo(() => {
    if (!isTenPercentCancelAmt && type === 'DRIVER_HISTORY') {
      if (
        (item?.rStatusCheck === 'P' || item?.rStatusCheck === 'C') &&
        (item?.cancelRequestBy === 'PASSENGER' || item?.penaltyRequestBy === 'PASSENGER')
      ) {
        return true;
      }
    }

    if (!isTenPercentCancelAmt && type === 'PASSENGER_HISTORY') {
      if (
        (item?.rStatusCheck === 'P' || item?.rStatusCheck === 'C') &&
        (item?.cancelRequestBy === 'DRIVER' || item?.penaltyRequestBy === 'DRIVER')
      ) {
        return true;
      }
    }

    return false;
  }, [isTenPercentCancelAmt, type, item]);
  console.log('🚀 ~ isShowBankNum ~ isShowBankNum:', isShowBankNum);

  return (
    <FixedContainer>
      <CustomHeader text="상세이용내역" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.containerStyle}>
        {/* Route Section */}
        <PaddingHorizontalWrapper forDriveMe>
          <HStack>
            <RouteBadge type={isWayToWork ? 'WAY_WORK' : 'WAY_HOME'} />
            <Spacer insetNumber={10} />
            <CustomText
              string={carpoolStatusValue(item?.rStatusCheck ?? '')}
              forDriveMe
              color={
                item?.rStatusCheck === 'C'
                  ? colors.disableButton
                  : item?.rStatusCheck === 'E'
                    ? colors.disableButton
                    : item?.rStatusCheck === 'P'
                      ? colors.primary
                      : colors.heavyGray
              }
              family={FONT_FAMILY.SEMI_BOLD}
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
            startAddress={item?.startPlace}
            stopOverAddress={
              item?.rStatusCheck !== 'R' || item?.soPrice ? '' : (item?.stopOverPlace ?? '')
            }
            arriveAddress={
              item?.amt === item?.soPrice ? (item?.stopOverPlace ?? '') : (item?.endPlace ?? '')
            }
            timeStart={item?.startTime}
            timeArrive={
              item?.rStatusCheck === 'C' || item?.rStatusCheck === 'P' ? item?.startTime : endTime
            }
            hideExpectations={
              item?.rStatusCheck === 'E' || item?.rStatusCheck === 'C' || item?.rStatusCheck === 'P'
            }
          />
        </PaddingHorizontalWrapper>

        {(type === 'DRIVER_HISTORY' && item?.rStatusCheck === 'E') ||
        (type === 'PASSENGER_HISTORY' && item?.rStatusCheck === 'E') ? (
          <PaddingHorizontalWrapper forDriveMe containerStyles={{marginTop: heightScale1(30)}}>
            <PageButton
              text="이용에 문제가 있으셨나요?"
              onPress={() => {
                if (type === 'DRIVER_HISTORY') {
                  navigation.navigate(ROUTE_KEY.ReportPassStep1, {
                    passengerID: Number(item?.r_memberId),
                    passengerName: passengerInfo?.nic as string,
                    routeID: Number(item?.id),
                  });
                } else {
                  navigation.navigate(ROUTE_KEY.ReportDriverStep1, {
                    driverID: Number(item?.d_memberId),
                    driverName: item?.nic,
                    routeID: Number(item?.id),
                  });
                }
              }}
            />
          </PaddingHorizontalWrapper>
        ) : null}

        {type === 'DRIVER_HISTORY' && item?.rStatusCheck === 'E' ? (
          <View style={{paddingTop: heightScale1(30)}} />
        ) : (
          <Divider style={styles.divider} />
        )}

        {type === 'PASSENGER_HISTORY' && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              navigation.navigate(ROUTE_KEY.DriverProfile, {
                driverID: item?.c_memberId,
                driverName: item?.nic,
              })
            }>
            <PaddingHorizontalWrapper forDriveMe>
              {/* Driver info section */}
              <HStack>
                <Avatar uri={item?.profileImageUrl ?? ''} size={40} />

                <Spacer insetNumber={6} />

                <View style={{gap: heightScale1(2)}}>
                  <HStack style={{gap: widthScale1(4)}}>
                    <CustomText
                      forDriveMe
                      size={FONT.SUB_HEAD}
                      family={FONT_FAMILY.MEDIUM}
                      string={`${item?.nic} 드라이버님`}
                      lineHeight={heightScale1(21)}
                      textStyle={{
                        maxWidth: widthScale1(170),
                        overflow: 'hidden',
                      }}
                      ellipsizeMode="tail"
                      numberOfLines={1}
                    />

                    <Icons.VerificationMark />
                  </HStack>

                  <HStack style={{gap: widthScale1(6)}}>
                    <CustomText
                      forDriveMe
                      size={FONT.CAPTION}
                      family={FONT_FAMILY.MEDIUM}
                      string="내평가"
                      color={colors.grayText}
                    />
                    {ratingOfReservation ? (
                      <HStack>
                        <CustomText
                          forDriveMe
                          family={FONT_FAMILY.SEMI_BOLD}
                          string={avgEvaluation}
                        />
                        <RatingStar
                          iconStyle={{marginHorizontal: 0}}
                          star={Math.floor(Number(avgEvaluation))}
                          text=""
                          onPress={() => {}}
                          size={20}
                          style={{marginLeft: widthScale1(4)}}
                        />
                      </HStack>
                    ) : (
                      <CustomText
                        forDriveMe
                        size={FONT.CAPTION}
                        family={FONT_FAMILY.MEDIUM}
                        string="평가없음"
                        color={colors.grayText}
                      />
                    )}
                  </HStack>
                </View>

                <Pressable
                  hitSlop={20}
                  onPress={handleAddFavoriteDriver}
                  style={styles.favoriteButtonStyle}>
                  {isFavoriteDriver ? (
                    <Icons.StarFill width={widthScale1(24)} height={widthScale1(24)} />
                  ) : (
                    <Icons.Star width={widthScale1(24)} height={widthScale1(24)} />
                  )}
                </Pressable>
              </HStack>
            </PaddingHorizontalWrapper>
            <Divider style={styles.divider} />
          </TouchableOpacity>
        )}

        {/* payment card session */}
        {type === 'DRIVER_HISTORY' &&
        item?.cancelRequestBy === 'PASSENGER' &&
        item?.rStatusCheck === 'C' ? null : (
          <>
            <PaddingHorizontalWrapper forDriveMe>
              <CustomText
                forDriveMe
                string={textPayment}
                family={FONT_FAMILY.SEMI_BOLD}
                size={FONT.BODY}
              />

              {payCardMethod ? (
                <HStack style={styles.cardInfoStyle}>
                  {iconCard()}

                  <Spacer insetNumber={12} />
                  <CustomText forDriveMe family={FONT_FAMILY.MEDIUM} string={creditMethod} />
                </HStack>
              ) : (
                <View>
                  <HStack style={styles.cardInfoStyle}>
                    <Icons.Coin />
                    <Spacer insetNumber={12} />
                    <CustomText forDriveMe family={FONT_FAMILY.MEDIUM} string="충전금충전" />
                  </HStack>
                </View>
              )}

              {item?.rStatusCheck !== 'C' &&
              item?.rStatusCheck !== 'P' &&
              type === 'DRIVER_HISTORY' ? (
                <View style={[styles.infoViewStyle, {marginTop: PADDING1}]}>
                  <CustomText forDriveMe family={FONT_FAMILY.MEDIUM} string={paymentDate} />
                </View>
              ) : null}
            </PaddingHorizontalWrapper>
            <Divider style={styles.divider} />
          </>
        )}

        {/* Fee details */}
        <PaddingHorizontalWrapper forDriveMe>
          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string={textDetailBill}
              size={FONT.BODY}
              family={FONT_FAMILY.SEMI_BOLD}
            />
            {hideBill ? null : (
              <CustomText
                family={FONT_FAMILY.MEDIUM}
                size={FONT.CAPTION_7}
                forDriveMe
                string="영수증"
                color={colors.lineCancel}
              />
            )}
          </HStack>

          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string={'카풀요금'}
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText}
            />
            <CustomText
              forDriveMe
              string={`${getNumberWithCommas(item?.price)}원`}
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText}
              textStyle={isThroughLine ? {textDecorationLine: 'line-through'} : {}}
            />
          </HStack>

          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string={'적립금'}
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText}
            />
            <CustomText
              forDriveMe
              string={
                Number(item?.usePoint) !== 0
                  ? `- ${getNumberWithCommas(Number(item?.usePoint))}원`
                  : `${getNumberWithCommas(Number(item?.usePoint))}원`
              }
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText}
              textStyle={isThroughLine ? {textDecorationLine: 'line-through'} : {}}
            />
          </HStack>

          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string={'충전금'}
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText}
            />
            <CustomText
              forDriveMe
              string={
                Number(item?.usePointSklent) !== 0
                  ? `- ${getNumberWithCommas(Number(item?.usePointSklent))}원`
                  : `${getNumberWithCommas(Number(item?.usePointSklent))}원`
              }
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText}
              textStyle={isThroughLine ? {textDecorationLine: 'line-through'} : {}}
            />
          </HStack>

          <HStack style={styles.priceSessionStyle}>
            <CustomText
              forDriveMe
              string={'쿠폰사용금액'}
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText}
            />
            <CustomText
              forDriveMe
              string={
                Number(item?.useCoupon) !== 0
                  ? `- ${getNumberWithCommas(Number(item?.useCoupon))}원`
                  : `${getNumberWithCommas(Number(item?.useCoupon))}원`
              }
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText}
              textStyle={isThroughLine ? {textDecorationLine: 'line-through'} : {}}
            />
          </HStack>

          {item?.rStatusCheck === 'C' ||
          item?.rStatusCheck === 'P' ||
          (type === 'DRIVER_HISTORY' &&
            (item?.rStatusCheck === 'E' ||
              item?.rStatusCheck === 'R' ||
              item?.rStatusCheck === 'O'))
            ? renderTextPaymentPenalty()
            : null}

          {renderTextPaymentTotal()}
        </PaddingHorizontalWrapper>

        <Divider
          style={[
            styles.divider,
            {
              marginTop: heightScale1(10),
            },
          ]}
        />

        {isShowBankNum ? accountInformationToReceiveMoneyAndCompensation() : null}

        <PaddingHorizontalWrapper forDriveMe>
          <PageButton
            text="도움이 필요하신가요?"
            onPress={() => navigation.navigate(ROUTE_KEY.ContactUs)}
          />
        </PaddingHorizontalWrapper>
      </ScrollView>

      <PaddingHorizontalWrapper forDriveMe>{renderButton}</PaddingHorizontalWrapper>
    </FixedContainer>
  );
};

export default memo(DetailContentCarpool);

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: PADDING1,
    paddingBottom: heightScale1(51),
  },
  timeTextStyle: {
    marginTop: heightScale1(4),
    marginBottom: PADDING1,
  },
  divider: {
    marginVertical: heightScale1(30),
  },
  favoriteButtonStyle: {
    marginLeft: 'auto',
  },
  buttonStyle: {
    borderRadius: scale1(8),
    borderColor: colors.disableButton,
    marginVertical: PADDING1 / 2,
  },
  supportViewStyle: {
    minHeight: heightScale1(52),
    backgroundColor: colors.policy,
    justifyContent: 'space-between',
    borderRadius: scale1(4),
    paddingHorizontal: PADDING1,
    marginBottom: heightScale1(30),
  },
  cardInfoStyle: {
    marginTop: PADDING1,
  },
  priceSessionStyle: {
    justifyContent: 'space-between',
    marginBottom: PADDING1,
  },
  submitButtonStyle: {
    marginTop: heightScale1(10),
    marginBottom: PADDING1 / 2,
  },
  infoViewStyle: {
    backgroundColor: colors.policy,
    paddingHorizontal: PADDING1,
    paddingVertical: heightScale1(16),
    borderRadius: scale1(4),
  },
  infoTextStyle: {
    fontSize: fontSize1(14),
    fontFamily: FONT_FAMILY.MEDIUM,
    lineHeight: heightScale1(20),
  },
  cardInfoTitleStyle: {
    width: widthScale1(69),
  },
});
