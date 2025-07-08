import firestore from '@react-native-firebase/firestore';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  Keyboard,
  LayoutRectangle,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import AppModal from '~components/app-modal';
import CustomButton from '~components/commons/custom-button';
import Point from '~components/commons/point';
import RouteBadge from '~components/commons/route-badge';
import ToastMessageController from '~components/commons/toast-message/toast-message-controller';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import Spinner from '~components/spinner';
import {AUTO_MESSAGE_TYPE, EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {CreditCardProps} from '~constants/types';
import {userHook} from '~hooks/userHook';
import {ChatRoomModel, RequestInfoModel} from '~model/chat-model';
import {DriverRoadDayModel, RouteRegisterModel} from '~model/driver-model';
import {MyPaymentModel} from '~model/passenger-model';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {
  useDailyRouteRegistrationMutation,
  useLazyGetRouteRequestInfoQuery,
} from '~services/carpoolServices';
import {useLazyReadDriverRoadInfoListQuery} from '~services/driverServices';
import {useGetDrivingDirectionQuery} from '~services/naverMapServices';
import {useSendFCMNotiMutation} from '~services/notiServices';
import {
  useUpdateRequestStateCheckMutation,
  useUpdateRoadDayStateCheckMutation,
  useUpdateRoadInfoIDValueMutation,
} from '~services/passengerServices';
import {useGetCreditCardListQuery} from '~services/paymentCardServices';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {handleSendAutomaticMessage} from '~utils/firebaseChatUtils';
import {carpoolStatusValue} from '~utils/getRouteStateValue';
import {calculatePenaltyFeeIn, calculatePenaltyFeeOut} from '~utils/hourUtils';
import {getNumberWithCommas} from '~utils/numberUtils';
import PaymentCheckMethod, {PaymentCheckMethodRefs} from './payment-check-method';

interface Props {
  data: RequestInfoModel | undefined;
  messageCount?: {driver: number; passenger: number};
  passengerName: string;
  driverName: string;
  chatRoomInfo: ChatRoomModel;
  userFCMToken: string;
  temptRoute: DriverRoadDayModel | undefined;
  rStatusCheck: string;
  resId: number;
  isUserLeftChat?: boolean;
  payInfo?: MyPaymentModel;
}

const ReservationInfo: React.FC<Props> = memo(props => {
  const navigation = useNavigation<UseRootStackNavigation>();
  const {
    data,
    messageCount,
    driverName,
    passengerName,
    chatRoomInfo,
    userFCMToken,
    temptRoute,
    rStatusCheck,
    resId,
    isUserLeftChat,
    payInfo,
  } = props;

  const paymentRef = useRef<PaymentCheckMethodRefs>(null);
  const [cDayId, setCDayId] = useState<number | undefined>(
    chatRoomInfo?.cDayId ? chatRoomInfo?.cDayId : undefined,
  );
  const [newPrice, setNewPrice] = useState<number>(0);
  const {userID, userToken} = userHook();
  const isPassenger = userID === data?.r_memberId;
  const [startPoint, setStartPoint] = useState<LayoutRectangle>();
  const [endPoint, setEndPoint] = useState<LayoutRectangle>();
  const [startItemHeight, setStartItemHeight] = useState<number>(0);
  const [sendFCM] = useSendFCMNotiMutation();
  const [updateRequestStateCheck] = useUpdateRequestStateCheckMutation();
  const [updateRoadInfoIDValue] = useUpdateRoadInfoIDValueMutation();
  const [updateRoadDayState] = useUpdateRoadDayStateCheckMutation();
  const [getRouteRequestInfo] = useLazyGetRouteRequestInfoQuery();
  const [dailyRouteRegistration] = useDailyRouteRegistrationMutation();
  const [readDriverRoadInfoList] = useLazyReadDriverRoadInfoListQuery();

  const [isUpdatingRequestState, setIsUpdatingRequestState] = useState<boolean>(false);

  const {
    data: listPaymentCard,
    refetch,
    isUninitialized,
  } = useGetCreditCardListQuery({
    memberId: userToken?.id,
    memberPwd: userToken?.password,
  });
  const oneClick = useRef<number>(0);

  useFocusEffect(
    useCallback(() => {
      if (!isUninitialized) {
        refetch();
      }
    }, [isUninitialized]),
  );

  useEffect(() => {
    const paymentCardChangeListeners = DeviceEventEmitter.addListener(
      EMIT_EVENT.PAYMENT_CARD,
      () => {
        refetch();
      },
    );

    return () => {
      paymentCardChangeListeners.remove();
    };
  }, []);

  useEffect(() => {
    if (chatRoomInfo?.cDayId) {
      setCDayId(chatRoomInfo?.cDayId);
    }
  }, [chatRoomInfo?.cDayId]);

  const startDirection = useMemo(() => {
    return data?.splng && data?.splat
      ? `${data?.splng},${data?.splat}`
      : `${temptRoute?.splng},${temptRoute?.splat}`;
  }, [data, temptRoute]);

  const endDirection = useMemo(() => {
    return data?.eplng && data?.eplat
      ? `${data?.eplng},${data?.eplat}`
      : `${temptRoute?.eplng},${temptRoute?.eplat}`;
  }, [data, temptRoute]);

  const stopDirection = useMemo(() => {
    return data?.soplng && data?.soplat
      ? `${data?.soplng},${data?.soplat}`
      : temptRoute?.soplng && temptRoute?.soplat
        ? `${temptRoute?.soplng},${temptRoute?.soplat}`
        : '';
  }, [data, temptRoute]);

  const {data: direction} = useGetDrivingDirectionQuery({
    start: startDirection,
    end: data?.priceSelect === 'E' ? endDirection : stopDirection,
    waypoints: '',
  });

  const onAcceptRequest = () => {
    oneClick.current++;
    if (oneClick.current > 1) {
      return;
    }

    Keyboard.dismiss();
    setIsUpdatingRequestState(true);
    Spinner.show();
    updateRequestStateCheck({
      resId: chatRoomInfo?.resId,
      rStatusCheck: 'A',
    })
      .unwrap()
      .then(async () => {
        await updateRoadDayState({
          roadInfoId: chatRoomInfo?.cDayId,
          state: 'A',
        }).then(data => {
          console.log('Thuan ~ .then ~ data:', data);
        });
        sendFCM({
          userToken: userFCMToken,
          title: `${driverName} 드라이버님이 카풀을 승인하였습니다.`,
          body: '결제후 카풀 예약을 완료해보세요.',
          data: {
            type: AUTO_MESSAGE_TYPE.CARPOOL_APPROVAL,
            chatRoomData: JSON.stringify(chatRoomInfo),
          },
        })
          .unwrap()
          .then(() => {
            handleSendAutomaticMessage({
              roomID: chatRoomInfo?.roomID || '',
              type: AUTO_MESSAGE_TYPE.CARPOOL_APPROVAL,
              driverName: driverName,
            });

            setTimeout(() => {
              Spinner.hide();
              setIsUpdatingRequestState(false);
            }, 500);
          });
      });
  };

  const onMakePayment = () => {
    Keyboard.dismiss();

    if (listPaymentCard?.length === 0) {
      showMessage({
        message: '해당 기능을 사용하기 위해 카드 정보를 추가해주세요.',
      });
      navigation.navigate(ROUTE_KEY.CardRegistration, {
        listCards: listPaymentCard as CreditCardProps[],
      });
      return;
    }

    Keyboard.dismiss();
    paymentRef?.current?.show();
  };

  const endTime = useMemo((): string => {
    const duration = direction?.duration;

    return (data?.startTime ?? temptRoute?.startTime) && duration
      ? moment(data?.startTime ?? temptRoute?.startTime, 'HH:mm')
          .add(duration, 'minutes')
          .format('HH:mm')
      : '';
  }, [direction?.duration, data?.startTime, data?.priceSelect, temptRoute?.startTime]);

  const lineHeight = useMemo(
    () => (endPoint?.y ?? 0) + (endPoint?.height ?? 0) + (startPoint?.y ?? 0) + widthScale1(2),
    [startPoint, endPoint],
  );

  const onCancelRequest = (cancelByDriver?: boolean) => {
    Spinner.show();
    updateRequestStateCheck({
      resId: chatRoomInfo?.resId,
      rStatusCheck: 'N',
    })
      .unwrap()
      .then(async () => {
        await firestore()
          .collection('rooms')
          .doc(chatRoomInfo?.roomID)
          .update({
            rStatusCheck: 'C',
            isCancelRequest: true,
          })
          .then(data => {
            console.log('Thuan ~ awaitfirestore ~ data:', data);
          })
          .catch(error => {
            ToastMessageController.show(`${error}`);
          });
        sendFCM({
          userToken: userFCMToken,
          title: '탑승객님이 카풀 요청이 취소되었습니다.',
          body: '요청 취소시 채팅이 불가합니다.',
          data: {
            type: cancelByDriver
              ? AUTO_MESSAGE_TYPE.DRIVER_CANCEL_RESERVATION
              : AUTO_MESSAGE_TYPE.PASSENGER_CANCEL_RESERVATION,
          },
        }).then(() => {
          handleSendAutomaticMessage({
            type: cancelByDriver
              ? AUTO_MESSAGE_TYPE.DRIVER_CANCEL_RESERVATION
              : AUTO_MESSAGE_TYPE.PASSENGER_CANCEL_RESERVATION,
            roomID: chatRoomInfo?.roomID ?? '',
            passengerName: passengerName,
            driverName: driverName,
          });
        });
      })
      .catch(error => {
        console.log(
          'Thuan ~ file: reservation-info.tsx:80 ~ onCancelPassengerRequest ~ error:',
          error,
        );
      })
      .finally(() => {
        Spinner.hide();
        navigation.goBack();
        showMessage({
          message: '요청이 취소되었습니다.',
        });
      });
  };

  const checkIfDriverDontHaveRoad = () => {
    return new Promise<boolean>((resolve, reject) => {
      Spinner.show();

      readDriverRoadInfoList({
        c_memberId: chatRoomInfo?.driverID,
      })
        .unwrap()
        .then(results => {
          const formatMyRoadRegisterd = results?.filter(
            item => item?.state !== 'C' && item.state !== 'P',
          );
          const isDriverAlredayHaveAReservation = formatMyRoadRegisterd.find(
            item =>
              item?.selectDay === temptRoute?.selectDay && item?.carInOut === temptRoute?.carInOut,
          );
          if (!isDriverAlredayHaveAReservation) {
            resolve(true);
          } else {
            return AppModal.show({
              isTwoButton: true,
              title: '알림',
              content:
                '해당 날짜는 이미 확정된 카풀이 있어 더이상 카풀을 확장할 수 없습니다.\n해당 요청을 취소하시겠습니까?',
              textYes: '요청취소',
              textNo: '취소',
              yesFunc() {
                onCancelRequest(true);
              },
            });
          }
        })
        .catch(error => {
          reject(error);
        })
        .finally(() => {
          Spinner.hide();
        });
    });
  };

  const onDriverRegisterNewRoute = () => {
    checkIfDriverDontHaveRoad().then(driverIsAvailable => {
      if (driverIsAvailable) {
        const route: RouteRegisterModel = {
          carInOut: temptRoute?.carInOut ?? '',
          startPlace: temptRoute?.startPlace ?? '',
          endPlace:
            data?.priceSelect === 'E'
              ? (temptRoute?.endPlace ?? '')
              : (temptRoute?.stopOverPlace ?? ''),
          splat: temptRoute?.splat ?? 0,
          splng: temptRoute?.splng ?? 0,
          eplat: data?.priceSelect === 'E' ? (temptRoute?.eplat ?? 0) : (temptRoute?.soplat ?? 0),
          eplng: data?.priceSelect === 'E' ? (temptRoute?.eplng ?? 0) : (temptRoute?.soplng ?? 0),
          selectDate: temptRoute?.selectDay ?? '',
          startTime: temptRoute?.startTime ?? '',
          price: data?.priceSelect === 'E' ? temptRoute?.price : temptRoute?.soPrice,
          introduce: temptRoute?.introduce ?? '',
        } as RouteRegisterModel;

        navigation.navigate(ROUTE_KEY.CarPoolWayToWorkRegistration, {
          route: route as any,
          onReturn: async (returnRoadInfoId, returnNewPrice) => {
            Spinner.show();

            setNewPrice(returnNewPrice);
            setCDayId(returnRoadInfoId);

            await updateRoadInfoIDValue({
              roadInfoId: returnRoadInfoId,
              resId: data?.resId,
            });

            await readDriverRoadInfoList({
              c_memberId: chatRoomInfo?.driverID,
            });

            firestore()
              .collection('rooms')
              .doc(chatRoomInfo?.roomID)
              .update({
                cDayId: returnRoadInfoId,
                temptRoute:
                  data?.priceSelect === 'E'
                    ? {
                        ...chatRoomInfo?.temptRoute,
                        price: returnNewPrice,
                        cDayId: returnRoadInfoId,
                      }
                    : {
                        ...chatRoomInfo?.temptRoute,
                        soPrice: returnNewPrice,
                        cDayId: returnRoadInfoId,
                      },
              })
              .then(async () => {
                sendFCM({
                  userToken: userFCMToken,
                  title: `${driverName} 드라이버님이 운행경로를 등록하셨습니다.`,
                  body: '채팅을 통해 카풀예약을 완료해보세요.',
                  data: {
                    type: AUTO_MESSAGE_TYPE.ROUTE_OPERATION_REGISTRATION,
                    chatRoomData: JSON.stringify({
                      ...chatRoomInfo,
                      temptRoute:
                        data?.priceSelect === 'E'
                          ? {
                              ...chatRoomInfo?.temptRoute,
                              price: newPrice,
                              cDayId: returnRoadInfoId,
                            }
                          : ({
                              ...chatRoomInfo?.temptRoute,
                              soPrice: newPrice,
                              cDayId: returnRoadInfoId,
                            } as any),
                      cDayId: returnRoadInfoId,
                    }),
                  },
                })
                  .unwrap()
                  .then(() => {
                    handleSendAutomaticMessage({
                      roomID: chatRoomInfo?.roomID || '',
                      type: AUTO_MESSAGE_TYPE.ROUTE_OPERATION_REGISTRATION,
                      driverName: driverName,
                    });

                    Spinner.hide();
                  });
              })
              .catch(error => {
                Spinner.hide();
                console.log('🚀 ~ onDriverRegisterNewRoute ~ error:', error);
              });
          },
        });
      }
    });
  };

  const onDriverAcceptRouteOfPassenger = () => {
    checkIfDriverDontHaveRoad().then(isDriverAvailable => {
      if (isDriverAvailable) {
        Spinner.show();
        dailyRouteRegistration({
          carInOut: temptRoute?.carInOut ?? '',
          startPlace: temptRoute?.startPlace ?? '',
          endPlace:
            data?.priceSelect === 'E'
              ? (temptRoute?.endPlace ?? '')
              : (temptRoute?.stopOverPlace ?? ''),
          splat: temptRoute?.splat ?? 0,
          splng: temptRoute?.splng ?? 0,
          eplat: data?.priceSelect === 'E' ? (temptRoute?.eplat ?? 0) : (temptRoute?.soplat ?? 0),
          eplng: data?.priceSelect === 'E' ? (temptRoute?.eplng ?? 0) : (temptRoute?.soplng ?? 0),
          selectDay: temptRoute?.selectDay ?? '',
          startTime: temptRoute?.startTime ?? '',
          price: data?.priceSelect === 'E' ? temptRoute?.price : temptRoute?.soPrice,
          introduce: temptRoute?.introduce ?? '',
          c_memberId: chatRoomInfo?.driverID,
          soplat: '',
          endParkId: '',
          soplng: '',
          soPrice: '',
          startParkId: '',
          stopOverPlace: '',
        })
          .unwrap()
          .then(async returnedValue => {
            if (returnedValue?.statusCode !== '200') {
              Spinner.hide();
              showMessage({
                message: strings.general_text.please_try_again,
              });
              return;
            }
            const returnedRoadInfoId = returnedValue?.listDriverDay[0]?.roadInfoId;
            await readDriverRoadInfoList({
              c_memberId: chatRoomInfo?.driverID,
            });
            if (data?.resId && returnedRoadInfoId) {
              await updateRoadInfoIDValue({
                roadInfoId: returnedRoadInfoId,
                resId: data?.resId,
              })
                .unwrap()
                .then(res => {
                  console.log('update id tuyen duong ne', res);
                });
            }

            await updateRequestStateCheck({
              resId: chatRoomInfo?.resId,
              rStatusCheck: 'A',
            });
            await readDriverRoadInfoList({
              c_memberId: chatRoomInfo?.driverID,
            });
            firestore()
              .collection('rooms')
              .doc(chatRoomInfo?.roomID)
              .update({
                cDayId: returnedRoadInfoId,
              })
              .then(async () => {
                handleSendAutomaticMessage({
                  roomID: chatRoomInfo?.roomID || '',
                  type: AUTO_MESSAGE_TYPE.CARPOOL_APPROVAL,
                  driverName: driverName,
                });
                await sendFCM({
                  userToken: userFCMToken,
                  title: `${driverName} 드라이버님이 카풀을 승인하였습니다.`,
                  body: '결제후 카풀 예약을 완료해보세요.',
                  data: {
                    type: AUTO_MESSAGE_TYPE.CARPOOL_APPROVAL,
                    chatRoomData: JSON.stringify({
                      ...chatRoomInfo,
                      cDayId: returnedRoadInfoId,
                    }),
                  },
                });
              });
          })
          .finally(() => {
            Spinner.hide();
          });
      }
    });
  };

  const runningTimeString = useMemo(
    () =>
      (payInfo?.selectDay
        ? payInfo?.selectDay
        : data?.selectDay
          ? data?.selectDay
          : temptRoute?.selectDay
      )?.slice(0, 10) +
      ' ' +
      (data?.startTime ?? temptRoute?.startTime),
    [data, chatRoomInfo],
  );

  const penaltyFeePercent = useMemo(
    () =>
      data?.carInOut === 'in' || temptRoute?.carInOut === 'in'
        ? calculatePenaltyFeeIn(runningTimeString)
        : calculatePenaltyFeeOut(runningTimeString),
    [data?.carInOut, temptRoute?.carInOut, runningTimeString],
  );

  const onCancelPayment = (driverCancel?: boolean) => {
    Keyboard.dismiss();
    AppModal.show({
      title: driverCancel
        ? `현재 해당 예약 취소시 카풀금액의\n${penaltyFeePercent}가 취소 수수료로\n등록하신 카드로 자동결제 됩니다.`
        : `현재 해당 예약 취소시\n결제금액의 ${penaltyFeePercent}가\n수수료로 부과됩니다.`,
      content: '정말 취소하시겠습니까?',
      textYes: '예약취소',
      isTwoButton: true,
      textNo: '닫기',
      yesFunc() {
        navigation.navigate(ROUTE_KEY.CancelRoutePaymentConfirmation, {
          percentFined: Number(penaltyFeePercent.replace('%', '')),
          type: driverCancel ? 'DRIVER_HISTORY' : 'PASSENGER_HISTORY',
          routeInfo: {
            selectDay: data?.selectDay ?? temptRoute?.selectDay ?? '',
            d_memberId: chatRoomInfo?.driverID ?? 0,
            r_memberId: chatRoomInfo?.passengerID ?? 0,
            price:
              data?.priceSelect === 'E'
                ? (data?.price ?? temptRoute?.price ?? '')
                : (data?.soPrice ?? temptRoute?.soPrice ?? ''),
            carInOut: data?.carInOut ?? temptRoute?.carInOut ?? 'in',
            startPlace: data?.startPlace ?? temptRoute?.startPlace ?? '',
            endPlace:
              data?.priceSelect === 'E'
                ? (data?.endPlace ?? temptRoute?.endPlace ?? '')
                : (data?.stopOverPlace ?? temptRoute?.stopOverPlace ?? ''),
            rStatusCheck: rStatusCheck,
            chatId: chatRoomInfo?.roomID ?? '',
            id: resId,
            startTime: data?.startTime ?? temptRoute?.startTime ?? '',
            roadInfoId: chatRoomInfo?.cDayId ?? 0,
            splat: data?.splat ?? temptRoute?.splat ?? 0,
            splng: data?.splng ?? temptRoute?.splng ?? 0,
            eplat:
              data?.priceSelect === 'E'
                ? (data?.eplat ?? temptRoute?.eplat ?? 0)
                : (data?.soplat ?? temptRoute?.soplat ?? 0),
            eplng:
              data?.priceSelect === 'E'
                ? (data?.eplng ?? temptRoute?.eplng ?? 0)
                : (data?.soplng ?? temptRoute?.soplng ?? 0),
            endTime: endTime,
            stopOverPlace: data?.stopOverPlace,
            soplng: data?.soplng,
            soplat: data?.soplat,
            soPrice: data?.soPrice,
          } as any,

          onCancelSuccess: async () => {
            Spinner.show();
            console.log('cancel: ', chatRoomInfo?.roomID);
            await firestore()
              .collection('rooms')
              .doc(chatRoomInfo?.roomID)
              .update({
                rStatusCheck: 'C',
              })
              .then(data => {
                console.log('Thuan ~ awaitfirestore ~ data:', data);
              })
              .catch(error => {
                ToastMessageController.show(`${error}`);
              });
            handleSendAutomaticMessage({
              roomID: chatRoomInfo?.roomID ?? '',
              type: driverCancel
                ? AUTO_MESSAGE_TYPE.DRIVER_CANCEL_PAYMENT
                : AUTO_MESSAGE_TYPE.PASSENGER_CANCEL_PAYMENT,
              driverName: driverName,
              passengerName: passengerName,
            });

            await sendFCM({
              userToken: userFCMToken,
              title: '탑승객님 카풀 예약이 취소되었습니다.',
              body: '이용 내역을 통해 취소내용을 확인해보세요.',
              data: {
                type: driverCancel
                  ? AUTO_MESSAGE_TYPE.DRIVER_CANCEL_PAYMENT
                  : AUTO_MESSAGE_TYPE.PASSENGER_CANCEL_PAYMENT,
              },
            })
              .unwrap()
              .then(() => {
                Spinner.hide();
              });
          },

          endTime: endTime,
        });
      },
    });
  };

  const isPastDay = useMemo(
    () =>
      moment(
        data?.selectDay ? data?.selectDay?.slice(0, 10) : temptRoute?.selectDay?.slice(0, 10),
        'YYYY.MM.DD',
      ).isBefore(moment().startOf('day')),
    [data?.selectDay, temptRoute?.selectDay],
  );

  const renderButton = useMemo(() => {
    if (chatRoomInfo?.isCancelRequest) {
      return null;
    }

    if (rStatusCheck === 'P') {
      return null;
    }

    if (
      Number(chatRoomInfo?.userCount) < 2 ||
      rStatusCheck === 'C' ||
      isPastDay ||
      isUserLeftChat
    ) {
      return null;
    }

    if (isPassenger) {
      if (
        rStatusCheck === 'N' &&
        Number(messageCount?.driver) <= 0 &&
        chatRoomInfo?.isRequestedBy === 'PASSENGER'
      ) {
        return (
          // Cancel request
          <CustomButton
            textSize={FONT.CAPTION_6}
            type="TERTIARY"
            outLine
            buttonHeight={38}
            text={__DEV__ ? 'HUỶ YÊU CẦU' : '요청취소'}
            buttonStyle={{
              paddingHorizontal: widthScale1(10),
            }}
            onPress={() => onCancelRequest(false)}
            borderRadiusValue={6}
          />
        );
      }

      if (rStatusCheck !== 'R' && rStatusCheck !== 'E') {
        return (
          // Proceed to pay the driver
          <CustomButton
            textSize={FONT.CAPTION_6}
            buttonHeight={38}
            text={__DEV__ ? '결제하기' : '결제하기'}
            buttonStyle={{
              paddingHorizontal: widthScale1(10),
            }}
            type={rStatusCheck !== 'A' ? 'TERTIARY' : 'PRIMARY'}
            outLine={rStatusCheck !== 'A' ? true : false}
            onPress={onMakePayment}
            borderRadiusValue={6}
            disabled={rStatusCheck !== 'A' || !cDayId}
          />
        );
      }

      if (rStatusCheck === 'R') {
        return (
          // cancel payment
          <CustomButton
            textSize={FONT.CAPTION_6}
            buttonHeight={38}
            text={__DEV__ ? 'HUY THANH TOAN' : '예약취소'}
            buttonStyle={{
              paddingHorizontal: widthScale1(10),
            }}
            type={'TERTIARY'}
            outLine
            onPress={() => onCancelPayment(false)}
            borderRadiusValue={6}
          />
        );
      }

      return null;
    } else {
      if (
        Number(messageCount?.passenger) === 0 &&
        chatRoomInfo?.isRequestedBy === 'DRIVER' &&
        !cDayId
      ) {
        return (
          <CustomButton
            textSize={FONT.CAPTION_6}
            type="TERTIARY"
            outLine
            buttonHeight={38}
            text={__DEV__ ? 'HUỶ BOOKING' : '요청취소'}
            buttonStyle={{
              paddingHorizontal: widthScale1(10),
            }}
            onPress={() => onCancelRequest(true)}
            borderRadiusValue={6}
          />
        );
      }

      if (!cDayId && chatRoomInfo?.isRequestedBy === 'PASSENGER') {
        return (
          <CustomButton
            text={__DEV__ ? 'ĐK TUYẾN ĐG' : '등록하기'}
            buttonHeight={38}
            disabled={Number(messageCount?.passenger) === 0}
            buttonStyle={{
              paddingHorizontal: widthScale1(10),
            }}
            type="SECONDARY"
            textSize={FONT.CAPTION_6}
            onPress={onDriverRegisterNewRoute}
            borderRadiusValue={6}
          />
        );
      }

      if (!cDayId && chatRoomInfo?.isRequestedBy === 'DRIVER') {
        return (
          <CustomButton
            text={__DEV__ ? 'CHẤP NHẬN REQUEST' : '카풀확정'}
            buttonHeight={38}
            disabled={Number(messageCount?.passenger) === 0 || oneClick.current > 0}
            buttonStyle={{
              paddingHorizontal: widthScale1(10),
            }}
            textSize={FONT.CAPTION_6}
            onPress={onDriverAcceptRouteOfPassenger}
            borderRadiusValue={6}
          />
        );
      }

      if (rStatusCheck === 'N' || rStatusCheck === 'A') {
        return (
          <CustomButton
            textSize={FONT.CAPTION_6}
            type={
              rStatusCheck === 'A' || Number(messageCount?.passenger) === 0 ? 'TERTIARY' : 'PRIMARY'
            }
            outLine={Number(messageCount?.passenger) === 0 || rStatusCheck === 'A'}
            buttonHeight={38}
            text={__DEV__ ? 'ĐÃ XÁC NHẬN CP' : '카풀확정'}
            buttonStyle={{
              paddingHorizontal: widthScale1(10),
            }}
            disabled={Number(messageCount?.passenger) === 0 || rStatusCheck === 'A'}
            onPress={onAcceptRequest}
            borderRadiusValue={6}
            isLoading={isUpdatingRequestState}
          />
        );
      }

      if (rStatusCheck === 'R') {
        return (
          // cancel payment
          <CustomButton
            textSize={FONT.CAPTION_6}
            buttonHeight={38}
            text={__DEV__ ? 'HUY BOOKING' : '예약취소'}
            buttonStyle={{
              paddingHorizontal: widthScale1(10),
            }}
            type={'TERTIARY'}
            outLine
            onPress={() => onCancelPayment(true)}
            borderRadiusValue={6}
          />
        );
      }
      return null;
    }
  }, [
    isPassenger,
    messageCount,
    cDayId,
    rStatusCheck,
    onMakePayment,
    onAcceptRequest,
    onDriverRegisterNewRoute,
    onCancelRequest,
    onCancelPayment,
    chatRoomInfo?.isRequestedBy,
    isPastDay,
    isUserLeftChat,
  ]);

  const totalPriceToPay = useMemo(
    (): number =>
      newPrice
        ? Number(newPrice)
        : data?.priceSelect === 'E'
          ? Number(data?.price ?? temptRoute?.price)
          : Number(data?.soPrice ?? temptRoute?.soPrice),
    [newPrice, data, temptRoute],
  );

  return (
    <View>
      <Pressable>
        <PaddingHorizontalWrapper containerStyles={styles.containerStyle} forDriveMe>
          {/* Header */}
          <HStack style={{justifyContent: 'space-between'}}>
            <View style={{gap: heightScale1(4)}}>
              <HStack style={{gap: widthScale1(10)}}>
                <RouteBadge
                  type={(data?.carInOut ?? temptRoute?.carInOut) === 'in' ? 'WAY_WORK' : 'WAY_HOME'}
                />
                <CustomText
                  color={colors.heavyGray}
                  family={FONT_FAMILY.SEMI_BOLD}
                  forDriveMe
                  string={!cDayId ? '등록예정' : carpoolStatusValue(rStatusCheck)}
                  lineHeight={heightScale1(20)}
                />
              </HStack>
              <HStack style={{gap: widthScale1(8)}}>
                <CustomText
                  forDriveMe
                  string={
                    payInfo?.selectDay
                      ? payInfo?.selectDay
                      : data?.selectDay
                        ? data?.selectDay
                        : (temptRoute?.selectDay ?? '')
                  }
                  lineHeight={heightScale1(20)}
                />
                <CustomText
                  forDriveMe
                  string={`${
                    newPrice
                      ? getNumberWithCommas(newPrice)
                      : data?.priceSelect === 'E'
                        ? getNumberWithCommas(data?.price ?? temptRoute?.price)
                        : getNumberWithCommas(data?.soPrice ?? temptRoute?.soPrice)
                  }원`}
                  lineHeight={heightScale1(20)}
                  family={FONT_FAMILY.SEMI_BOLD}
                />
              </HStack>
            </View>

            {renderButton}
          </HStack>

          <Pressable
            disabled={isPassenger || rStatusCheck !== 'N' || !chatRoomInfo?.cDayId}
            onPress={() =>
              navigation.navigate(ROUTE_KEY.DriverChangeRoutePrice, {
                tempRoute: temptRoute,
                routeRequestInfo: data,
                endTime: endTime,
                roadInfoID: chatRoomInfo?.cDayId as number,
                onChangeNewPrice: async (newPrice: number) => {
                  await sendFCM({
                    userToken: userFCMToken,
                    title: '금액변경',
                    body: `금액변경 ${driverName} 드라이버님이 카풀금액을 변경하였습니다. `,
                    data: {
                      type: AUTO_MESSAGE_TYPE.DRIVER_CHANGE_AMOUNT,
                      chatRoomData: JSON.stringify(chatRoomInfo),
                    },
                  });
                  handleSendAutomaticMessage({
                    type: AUTO_MESSAGE_TYPE.DRIVER_CHANGE_AMOUNT,
                    roomID: chatRoomInfo?.roomID as any,
                    driverName: driverName,
                  });
                  firestore()
                    .collection('rooms')
                    .doc(chatRoomInfo?.roomID)
                    .update({
                      temptRoute: {
                        ...chatRoomInfo?.temptRoute,
                        price:
                          data?.priceSelect === 'E' ? newPrice : chatRoomInfo?.temptRoute?.price,
                        soPrice:
                          data?.priceSelect === 'M' ? newPrice : chatRoomInfo?.temptRoute?.soPrice,
                      },
                    });
                  getRouteRequestInfo({
                    requestBy: chatRoomInfo?.isRequestedBy ?? 'PASSENGER',
                    resId: chatRoomInfo?.resId,
                  });
                  setTimeout(() => {
                    DeviceEventEmitter.emit(EMIT_EVENT.REFETCH_DATA_CARPOOL);
                  }, 500);
                },
              })
            }>
            <View style={{marginTop: heightScale1(10)}}>
              {lineHeight > 0 && startItemHeight > 0 ? (
                <View
                  style={{
                    width: widthScale1(1),
                    height: lineHeight,
                    backgroundColor: colors.heavyGray,
                    position: 'absolute',
                    left: widthScale1(4),
                    top: startItemHeight / 2 + widthScale1(4.25),
                  }}
                />
              ) : null}

              <View style={{gap: heightScale1(8)}}>
                <HStack
                  onLayout={e => {
                    setStartItemHeight(e?.nativeEvent?.layout?.height);
                  }}
                  style={{gap: widthScale1(10)}}>
                  <Point
                    onLayout={e => {
                      setStartPoint(e?.nativeEvent?.layout);
                    }}
                  />
                  <CustomText
                    forDriveMe
                    family={FONT_FAMILY.MEDIUM}
                    lineHeight={heightScale1(20)}
                    string={data?.startPlace ?? temptRoute?.startPlace ?? ''}
                    textStyle={{
                      flexShrink: 1,
                    }}
                  />
                  <CustomText
                    forDriveMe
                    size={FONT.CAPTION}
                    family={FONT_FAMILY.MEDIUM}
                    color={colors.grayText}
                    string={`${data?.startTime ?? temptRoute?.startTime ?? ''} 출발예정`}
                  />
                </HStack>

                <HStack style={{gap: widthScale1(10)}}>
                  <Point
                    onLayout={e => {
                      setEndPoint(e?.nativeEvent?.layout);
                    }}
                    type="ARRIVE"
                  />
                  <CustomText
                    forDriveMe
                    family={FONT_FAMILY.MEDIUM}
                    lineHeight={heightScale1(20)}
                    string={
                      data?.priceSelect === 'E'
                        ? (data?.endPlace ?? temptRoute?.endPlace ?? '')
                        : (data?.stopOverPlace ?? temptRoute?.stopOverPlace ?? '')
                    }
                    textStyle={{
                      flexShrink: 1,
                    }}
                  />
                  <CustomText
                    forDriveMe
                    size={FONT.CAPTION}
                    family={FONT_FAMILY.MEDIUM}
                    color={colors.grayText}
                    string={`${endTime} 도착예정`}
                  />
                </HStack>
              </View>
            </View>
          </Pressable>
        </PaddingHorizontalWrapper>
      </Pressable>

      <PaymentCheckMethod
        onPaySuccess={async () => {
          sendFCM({
            userToken: userFCMToken,
            title: '결제가 완료되었습니다.',
            body: `${passengerName} 탑승객님은 해당 카풀에 결제가 완료되었습니다.`,
            data: {
              type: AUTO_MESSAGE_TYPE.COMPLETE_PAYMENT,
              chatRoomData: JSON.stringify(chatRoomInfo),
            },
          })
            .unwrap()
            .then(async () => {
              // update passenger's road
              if (chatRoomInfo?.isRequestedBy === 'DRIVER' && temptRoute?.id) {
                await updateRoadDayState({
                  isPassengerRoute: true,
                  roadInfoId: temptRoute?.id,
                  state: 'R',
                });
              }

              if (chatRoomInfo?.cDayId) {
                await updateRoadDayState({
                  roadInfoId: chatRoomInfo?.cDayId,
                  state: 'R',
                });

                setTimeout(() => {
                  DeviceEventEmitter.emit(EMIT_EVENT.CARPOOL_WAY_TO_WORK);
                }, 500);
              }

              handleSendAutomaticMessage({
                roomID: chatRoomInfo?.roomID || '',
                type: AUTO_MESSAGE_TYPE.COMPLETE_PAYMENT,
              });
            });
        }}
        ref={paymentRef}
        routeInfo={
          {
            ...data,
            ...chatRoomInfo?.temptRoute,
            startTime: data?.startTime ?? temptRoute?.startTime,
            roadInfoId: chatRoomInfo?.cDayId,
          } as RequestInfoModel
        }
        listPaymentCard={listPaymentCard}
        totalPrice={totalPriceToPay}
        passengerRouteId={chatRoomInfo?.routeRegisterByPassengerID?.toString()}
      />
    </View>
  );
});

export default ReservationInfo;

const styles = StyleSheet.create({
  containerStyle: {
    paddingVertical: heightScale1(10),
  },
});
