import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {DeviceEventEmitter, InteractionManager, StatusBar, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSharedValue} from 'react-native-reanimated';
import AppModal from '~components/app-modal';
import ModalParkingNearest, {
  ModalParkingNearestRefs,
} from '~components/carpool-calendar/modal-parking-nearest';
import AnimatedHeader from '~components/commons/animated-header';
import CustomButton from '~components/commons/custom-button';
import CustomTextArea from '~components/commons/custom-text-area';
import LineButton from '~components/commons/line-button';
import MapDirectionView from '~components/commons/map-direction-view';
import SelectBox from '~components/commons/select-box';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import Spinner from '~components/spinner';
import BottomSheetChooseDesiredAmount from '~components/way-to-work-registration/bottom-sheet-choose-desired-amount';
import BottomSheetChooseTime from '~components/way-to-work-registration/bottom-sheet-choose-time';
import {PADDING, PADDING1} from '~constants/constant';
import {TIME_ROUTE_IN, TIME_ROUTE_OUT} from '~constants/data';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {
  useDailyRouteRegistrationMutation,
  useLazyReadAllDriverRoadDayInfoQuery,
} from '~services/carpoolServices';
import {getParkingNearest} from '~services/kakaoService';
import {
  useDrivingRoadUpdateInMutation,
  useDrivingRoadUpdateOutMutation,
} from '~services/userServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {getNameAddressKakao, makeCommaNumber} from '~utils/common';

const DriverWayToWork4 = (props: RootStackScreenProps<'DriverWayToWork4'>) => {
  const {navigation, route} = props;

  const addressFrom = route.params?.searchFrom;
  const addressStop = route.params?.searchStop;
  const addressTo = route.params?.searchTo;
  const isRoadOut = route.params?.isRoadOut;
  const selectedDate = route.params?.selectedDate;
  const dataOldRoute = route.params?.dataOldRoute;
  const dataEdit = route.params?.dataEdit;
  const dataPreviousRoute = route.params?.previousRoute;
  const isDailyRegistration = route?.params?.isDailyRegistration;
  const isEditMyRoute = route?.params?.isEditMyRoute;
  const hasAddressStop = route?.params?.hasAddressStop;
  const data = dataEdit! || dataOldRoute!;
  const isFocused = useIsFocused();
  const minuteEnd = useRef<number>();
  const {CMemberID, userID} = userHook();

  // from coordinate
  const fromCoordinate = useMemo(() => {
    return {
      longitude: (addressFrom?.x ||
        dataPreviousRoute?.eplngIn ||
        (isRoadOut ? data?.splngOut : data?.splngIn)) as string,
      latitude: (addressFrom?.y ||
        dataPreviousRoute?.eplatIn ||
        (isRoadOut ? data?.splatOut : data?.splatIn)) as string,
    };
  }, [dataPreviousRoute, addressFrom, data]);

  // stop coordinate
  const stopCoordinate = useMemo(() => {
    return {
      longitude: (addressStop?.x ||
        dataPreviousRoute?.soplngIn ||
        (isRoadOut ? data?.soplngOut : data?.soplngIn)) as string,
      latitude: (addressStop?.y ||
        dataPreviousRoute?.soplatIn ||
        (isRoadOut ? data?.soplatOut : data?.soplatIn)) as string,
    };
  }, [addressStop, data, dataPreviousRoute, hasAddressStop]);

  // to coordinate
  const toCoordinate = useMemo(() => {
    return {
      longitude: (addressTo?.x ||
        dataPreviousRoute?.splngIn ||
        (isRoadOut ? data?.eplngOut : data?.eplngIn)) as string,
      latitude: (addressTo?.y ||
        dataPreviousRoute?.splatIn ||
        (isRoadOut ? data?.eplatOut : data?.eplatIn)) as string,
    };
  }, [dataPreviousRoute, addressTo, data]);

  const isParking = useMemo(() => {
    if (dataPreviousRoute) {
      return {
        to: dataPreviousRoute?.endParkIdOut || '',
        from: dataPreviousRoute?.startParkIdOut || '',
        // stop: dataPreviousRoute?.stopParkIdOut || '',
      };
    }

    if (data) {
      return {
        to: isRoadOut
          ? addressTo
            ? addressTo?.isParking
              ? addressTo?.id
              : ''
            : data?.endParkIdOut
          : addressTo
            ? addressTo?.isParking
              ? addressTo?.id
              : ''
            : data?.endParkIdIn,
        from: isRoadOut
          ? addressFrom
            ? addressFrom?.isParking
              ? addressFrom?.id
              : ''
            : data?.startParkIdOut
          : addressFrom
            ? addressFrom?.isParking
              ? addressFrom?.id
              : ''
            : data?.startParkIdIn,
      };
    } else {
      return {
        to: addressTo?.isParking ? addressTo?.id : '',
        from: addressFrom?.isParking ? addressFrom?.id : '',
      };
    }
  }, [addressTo, dataPreviousRoute, addressFrom, isRoadOut, data, addressStop]);

  // api
  const [drivingUpdateRoadIn, {isLoading: isLoadingIn}] = useDrivingRoadUpdateInMutation();
  const [drivingUpdateRoadOut, {isLoading: isLoadingOut}] = useDrivingRoadUpdateOutMutation();
  const [dailyRouteRegistration] = useDailyRouteRegistrationMutation();
  const [readAllDriverRoadDayInfo] = useLazyReadAllDriverRoadDayInfoQuery();

  // bottom sheet
  const bottomSheetChooseTime = useRef<BottomSheetModal>(null);
  const bottomSheetChooseDesiredAmountRef = useRef<BottomSheetModal>(null);
  const bottomSheetChoosePriceToStopAmountRef = useRef<BottomSheetModal>(null);
  const [departureTime, setDepartureTime] = useState('');
  const [priceToStop, setPriceToStop] = useState<string | undefined>('');
  const [desiredAmount, setDesiredAmount] = useState<string | undefined>('');
  const [introduce, setIntroduce] = useState('');
  const scrollRef = useRef<KeyboardAwareScrollView>(null);
  const priceDefaultRef = useRef<string>();
  const priceStopRef = useRef<string>();
  const scrollYValue = useSharedValue(0);
  const [refetchEndTime, setRefetchEndTime] = useState<boolean>(false);

  const modalParkingNearestRef = useRef<ModalParkingNearestRefs>(null);

  useEffect(() => {
    if (data) {
      if (isRoadOut) {
        if (
          data?.stopOverPlaceOut &&
          data?.soPriceOut &&
          data?.soPriceOut !== '0' &&
          data?.soplatOut &&
          data?.soplngOut
        ) {
          setPriceToStop(Number(data?.soPriceOut) < 5000 ? '5000' : data?.soPriceOut);
        }
        if (data?.introduceOut) {
          setIntroduce(data?.introduceOut);
        }
        setDepartureTime(data?.startTimeOut);
        setDesiredAmount(data?.priceOut);
      } else {
        if (
          data?.stopOverPlaceIn &&
          data?.soPriceIn &&
          data?.soPriceIn !== '0' &&
          data?.soplatIn &&
          data?.soplngIn
        ) {
          setPriceToStop(Number(data?.soPriceIn) < 5000 ? '5000' : data?.soPriceIn);
        }
        if (data?.introduce) {
          setIntroduce(data?.introduce);
        }
        setDepartureTime(data?.startTimeIn);
        setDesiredAmount(data?.priceIn);
      }
    }

    if (dataPreviousRoute) {
      setDepartureTime(dataPreviousRoute?.startTimeIn);
      setDesiredAmount('');
      setIntroduce(dataPreviousRoute?.introduce);
      setPriceToStop('');
    }
  }, [dataPreviousRoute, data, isRoadOut, hasAddressStop]);

  const textPrice = useMemo(
    () => (desiredAmount ? makeCommaNumber(desiredAmount) : ''),
    [desiredAmount],
  );

  const textPriceStop = useMemo(
    () => (priceToStop ? makeCommaNumber(priceToStop) : ''),
    [priceToStop],
  );

  const disable = useMemo(
    () =>
      stopCoordinate?.latitude && stopCoordinate?.longitude
        ? !departureTime || !textPrice || !textPriceStop
        : !departureTime || !textPrice,
    [textPrice, departureTime, textPriceStop, addressStop],
  );

  // goBack and handle focus driver way to work 2
  useEffect(() => {
    navigation.addListener('blur', () => {
      DeviceEventEmitter.emit(EMIT_EVENT.FOCUS_INPUT_DRIVER_WAY_2);
    });
  }, [navigation]);

  // scroll to bottom
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (isEditMyRoute) {
        scrollRef.current?.scrollToEnd();
      }
    });
  }, [isEditMyRoute]);

  // name start
  const nameStart = useMemo(
    (): string =>
      addressFrom
        ? getNameAddressKakao(addressFrom)
        : dataPreviousRoute?.endPlaceIn! || (isRoadOut ? data?.startPlaceOut : data?.startPlaceIn),
    [addressFrom, dataPreviousRoute, data, isRoadOut],
  );

  // name end
  const nameEnd = useMemo(
    (): string =>
      addressTo
        ? getNameAddressKakao(addressTo)
        : dataPreviousRoute?.startPlaceIn! || (isRoadOut ? data?.endPlaceOut : data?.endPlaceIn),
    [addressTo, dataPreviousRoute, data, isRoadOut],
  );

  // name stop
  const nameStop = useMemo(
    () =>
      addressStop
        ? getNameAddressKakao(addressStop)
        : dataPreviousRoute?.stopOverPlaceIn ||
          ((isRoadOut ? data?.stopOverPlaceOut : data?.stopOverPlaceIn) as string),
    [addressStop, data, isRoadOut],
  );

  const timeEnd = useMemo(
    () =>
      departureTime
        ? moment(departureTime, 'HH:mm').add(minuteEnd.current, 'minutes').format('HH:mm')
        : '00:00',
    [departureTime, minuteEnd.current, isRoadOut, dataPreviousRoute, isFocused],
  );

  console.log('🚀 ~ onPressDone ~ hasAddressStop:', hasAddressStop);

  // handle on submit
  const onPressDone = () => {
    Spinner.show();
    if (!CMemberID) {
      return;
    }

    const routes = navigation.getState()?.routes;
    const nameScreenPrev = routes?.[routes.length - 2]?.name;

    // start place
    const nameStartPlace = nameStart;
    const timeStart = departureTime;
    const splat = fromCoordinate.latitude!;
    const splng = fromCoordinate.longitude!;

    // stop
    const soplat = hasAddressStop ? stopCoordinate?.latitude : '';
    const soplng = hasAddressStop ? stopCoordinate?.longitude : '';
    const soPrice = priceToStop;

    // arrive place
    const nameArrive = nameEnd;
    const eplat = toCoordinate.latitude!;
    const eplng = toCoordinate.longitude!;
    const price = desiredAmount;

    // road out api
    if (isRoadOut) {
      const body = {
        c_memberId: CMemberID.toString(),
        startPlaceOut: nameStartPlace,
        startTimeOut: timeStart,
        splatOut: splat,
        splngOut: splng,
        stopOverPlaceOut: hasAddressStop ? nameStop : '',
        soplatOut: hasAddressStop ? soplat : '',
        soplngOut: hasAddressStop ? soplng : '',
        endPlaceOut: nameArrive,
        eplatOut: eplat,
        eplngOut: eplng,
        priceOut: price,
        introduceOut: introduce ? introduce : '',
        soPriceOut: hasAddressStop ? (soPrice === '0' ? '' : soPrice) : '',
        startParkIdOut: isParking.from || '',
        endParkIdOut: isParking.to || '',
        // stopParkIdOut: isParking.stop || '',
      };
      console.log('🚀 ~ onPressDone ~ body:', body);
      dailyRouteRegistration({
        c_memberId: userID,
        carInOut: 'out',
        endPlace: nameEnd,
        eplat: Number(eplat),
        eplng: Number(eplng),
        selectDay: selectedDate || '',
        splat: Number(splat),
        splng: Number(splng),
        startPlace: nameStart,
        startTime: departureTime,
        introduce: introduce,
        soplat: hasAddressStop ? Number(soplat) : '',
        soplng: hasAddressStop ? Number(soplng) : '',
        stopOverPlace: nameStop,
        soPrice: hasAddressStop ? (soPrice === '0' ? '' : soPrice) : '',
        startParkId: isParking.from || '',
        endParkId: isParking.to || '',
        price: price,
      })
        .unwrap()
        .then(res => {
          readAllDriverRoadDayInfo();
          drivingUpdateRoadOut(body as any)
            .unwrap()
            .then(res => {
              if (res.statusCode !== '200') {
                return;
              }

              if (routes.some(item => item.name === ROUTE_KEY.MyRoute)) {
                DeviceEventEmitter.emit(EMIT_EVENT.RELOAD_ROUTE_DRIVER);
                navigation.navigate(ROUTE_KEY.MyRoute);
              } else {
                if (isEditMyRoute) {
                  navigation.navigate(ROUTE_KEY.MyWorkRoute, {isPassenger: false});
                } else {
                  if (data) {
                    navigation.goBack();
                    if (nameScreenPrev === ROUTE_KEY.DriverWayToWork1) {
                      navigation.goBack();
                    }
                  }
                  navigation.replace(ROUTE_KEY.MyWorkRoute, {isPassenger: false});
                }
              }
            });
        })
        .finally(() => {
          Spinner.hide();
        });
    } else {
      const body = {
        c_memberId: CMemberID.toString(),
        startPlaceIn: nameStartPlace,
        startTimeIn: timeStart,
        splatIn: splat,
        splngIn: splng,
        stopOverPlaceIn: hasAddressStop ? nameStop : '',
        soplatIn: hasAddressStop ? soplat : '',
        soplngIn: hasAddressStop ? soplng : '',
        endPlaceIn: nameArrive,
        eplatIn: eplat,
        eplngIn: eplng,
        priceIn: price,
        introduce: introduce ? introduce : '',
        soPriceIn: hasAddressStop ? (soPrice === '0' ? '' : soPrice) : '',
        startParkIdIn: isParking.from || '',
        endParkIdIn: isParking.to || '',
      };
      dailyRouteRegistration({
        c_memberId: userID,
        carInOut: 'in',
        endPlace: nameEnd,
        eplat: Number(eplat),
        eplng: Number(eplng),
        selectDay: selectedDate || '',
        splat: Number(splat),
        splng: Number(splng),
        startPlace: nameStart,
        startTime: departureTime,
        introduce: introduce,
        soplat: hasAddressStop ? Number(soplat) : '',
        soplng: hasAddressStop ? Number(soplng) : '',
        stopOverPlace: nameStop,
        soPrice: hasAddressStop ? (soPrice === '0' ? '' : soPrice) : '',
        startParkId: isParking.from || '',
        endParkId: isParking.to || '',
        price: price,
        // stopParkId: isParking.stop || '',
      })
        .unwrap()
        .then(res => {
          readAllDriverRoadDayInfo();
          drivingUpdateRoadIn(body as any)
            .unwrap()
            .then(res => {
              console.log('🚀 ~ .then ~ res:', res);

              if (res.statusCode !== '200') {
                return;
              }
              if (routes.some(item => item.name === ROUTE_KEY.MyRoute)) {
                DeviceEventEmitter.emit(EMIT_EVENT.RELOAD_ROUTE_DRIVER);
                navigation.navigate(ROUTE_KEY.MyRoute);
              } else {
                if (isEditMyRoute) {
                  navigation.navigate(ROUTE_KEY.MyWorkRoute, {isPassenger: false});
                } else {
                  navigation.navigate(ROUTE_KEY.DriverWayToWork1, {
                    previousRoute: body as any,
                    isReturnRoute: true,
                    addressStop: addressStop,
                  });
                }
              }
            })
            .finally(() => {
              Spinner.hide();
            });
        });
    }
  };

  const onDailyRouteRegister = () => {
    const price = desiredAmount;
    const nameStopOverPlace = nameStop || '';
    const soplat = nameStop ? stopCoordinate?.latitude : '';
    const soplng = nameStop ? stopCoordinate?.longitude : '';
    const soPrice = priceToStop;
    const splat = fromCoordinate.latitude!;
    const splng = fromCoordinate.longitude!;
    const eplat = toCoordinate.latitude!;
    const eplng = toCoordinate.longitude!;

    dailyRouteRegistration({
      c_memberId: userID,
      carInOut: isRoadOut ? 'out' : 'in',
      endPlace: nameEnd,
      eplat: Number(eplat),
      eplng: Number(eplng),
      selectDay: selectedDate || '',
      splat: Number(splat),
      splng: Number(splng),
      startPlace: nameStart,
      startTime: departureTime,
      introduce: introduce,
      soplat: Number(soplat),
      soplng: Number(soplng),
      stopOverPlace: nameStopOverPlace,
      soPrice: soPrice,
      startParkId: isParking.from || '',
      endParkId: isParking.to || '',
      price: price,
    })
      .unwrap()
      .then(res => {
        readAllDriverRoadDayInfo();
        getParkingNearest({
          latitude: Number(addressTo?.y) as number,
          longitude: Number(addressTo?.x) as number,
        })
          .then(res => {
            if (
              res?.distance <= 1000 &&
              res?.distance > 0 &&
              res?.nearestParking?.limitedNumber !== 0 &&
              res?.nearestParking?.ticketPartnerYN === 'Y'
            ) {
              modalParkingNearestRef.current?.show(res?.nearestParking);
            } else if (
              res?.nearestParking?.limitedNumber !== 0 &&
              res?.nearestParking?.ticketPartnerYN === 'Y'
            ) {
              AppModal.show({
                title: '파킹박 제휴 주차장을\n목적지로 등록하셨네요!\n주차장을 확인하시겠습니까?',
                content: '파킹박을 통해 평균 60% 할인된 금액으로\n주차권을 구매하실수 있습니다.',
                textYes: '주차장 보기',
                textNo: '닫기',
                yesFunc: () => {
                  DeviceEventEmitter.emit(EMIT_EVENT.CARPOOL_WAY_TO_WORK);
                  navigation.navigate(ROUTE_KEY.CarpoolCalendar);
                  navigation.navigate(ROUTE_KEY.ParkingDetails, {id: Number(isParking.to)});
                },
                noFunc: () => {
                  DeviceEventEmitter.emit(EMIT_EVENT.CARPOOL_WAY_TO_WORK);

                  navigation.navigate(ROUTE_KEY.CarpoolCalendar);
                },
                isTwoButton: true,
              });
            } else {
              AppModal.show({
                title: !isRoadOut
                  ? '출근길 운행등록이\n완료되었습니다.'
                  : '퇴근길 운행등록이\n완료되었습니다.',
                content: '',
                textYes: '확인',
                yesFunc: () => {
                  DeviceEventEmitter.emit(EMIT_EVENT.CARPOOL_WAY_TO_WORK);
                  navigation.navigate(ROUTE_KEY.CarpoolCalendar);
                },
              });
            }
          })
          .finally(() => {});
      })
      .catch(error => {
        console.log(
          'Thuan ~ file: car-pool-way-to-work-registration.tsx:118 ~ onRegisterNewRoute ~ error:',
          error,
        );
      });
  };

  return (
    <FixedContainer
      edges={['bottom']}
      pointerEvents={isLoadingIn || isLoadingOut ? 'none' : undefined}>
      <AnimatedHeader
        title={isRoadOut ? '퇴근길 등록' : '출근길 등록'}
        scrollYValue={scrollYValue}
        rightContent={
          isEditMyRoute ? (
            <LineButton
              text="경로수정"
              onPress={() =>
                navigation.navigate(ROUTE_KEY.DriverWayToWork2, {
                  dataOldRoute: data,
                  isReturnRoute: isRoadOut,
                  isEditMyRoute: isEditMyRoute,
                  hasAddressStop: hasAddressStop,
                  dataFill: {
                    from: {
                      road_address: {address_name: nameStart},
                      x: fromCoordinate.longitude,
                      y: fromCoordinate.latitude,
                    } as any,
                    stop: hasAddressStop
                      ? ({
                          road_address: {address_name: nameStop},
                          x: stopCoordinate.longitude,
                          y: stopCoordinate.latitude,
                        } as any)
                      : undefined,
                    to: {
                      road_address: {address_name: nameEnd},
                      x: toCoordinate.longitude,
                      y: toCoordinate.latitude,
                    } as any,
                    timeStart: departureTime,
                    introduce: introduce,
                  },
                })
              }
            />
          ) : null
        }
      />

      {isFocused && <StatusBar barStyle={'dark-content'} translucent />}

      <KeyboardAwareScrollView
        ref={scrollRef}
        contentContainerStyle={{paddingBottom: heightScale1(70)}}
        onScroll={e => {
          scrollYValue.value = e?.nativeEvent?.contentOffset?.y;
        }}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        {isFocused && (
          <MapDirectionView
            startPoint={{
              latitude: Number(fromCoordinate?.latitude) ?? 0,
              longitude: Number(fromCoordinate?.longitude) ?? 0,
            }}
            stopOverPoint={
              hasAddressStop
                ? {
                    latitude: Number(stopCoordinate?.latitude) ?? 0,
                    longitude: Number(stopCoordinate?.longitude) ?? 0,
                  }
                : undefined
            }
            endPoint={{
              latitude: Number(toCoordinate?.latitude) ?? 0,
              longitude: Number(toCoordinate?.longitude) ?? 0,
            }}
            onDurationDataReturn={_timeEnd => {
              setRefetchEndTime(true);
              minuteEnd.current = _timeEnd;
            }}
            onReturnPriceTaxi={price => (priceDefaultRef.current = price?.toString())}
            onReturnPriceStopTaxi={price =>
              (priceStopRef.current = (price < 5000 ? 5000 : price)?.toString())
            }
          />
        )}

        <PaddingHorizontalWrapper
          containerStyles={{
            marginVertical: PADDING1,
          }}
          forDriveMe>
          <RoutePlanner
            isParkingFrom={!!isParking.from}
            isParking={!!isParking.to}
            timeStart={departureTime}
            timeArrive={timeEnd}
            startAddress={nameStart}
            stopOverAddress={hasAddressStop ? nameStop : ''}
            arriveAddress={nameEnd}
            // isParkingStop={!!isParking.stop}
          />
        </PaddingHorizontalWrapper>

        <Divider />

        <View style={styles.viewForm}>
          <SelectBox
            subTitle={
              isRoadOut
                ? '여객운수법현행법상 오후 6시-8시까지 카풀이 가능합니다.'
                : '여객운수법현행법상 오전 7시-9시까지 카풀이 가능합니다.'
            }
            title="출발시간"
            value={departureTime}
            onPress={() => {
              bottomSheetChooseTime.current?.present();
            }}
            placeholderText="출발시간을 선택해주세요."
          />
        </View>

        <View style={styles.boxWrapperStyle}>
          <CustomText
            string={
              '카풀 운영시간 내 탑승한 탑승객은 교통 정체나 기타\n외부 요인으로 인한 하차 지연이 발생해도 문제가 되지 않습니다.'
            }
            forDriveMe
            size={FONT.CAPTION_6}
            family={FONT_FAMILY.MEDIUM}
            lineHeight={heightScale1(22)}
          />
        </View>

        {hasAddressStop ? (
          <View style={styles.viewForm}>
            <SelectBox
              title="출발지-경유지 희망금액"
              value={textPriceStop}
              onPress={() => {
                bottomSheetChoosePriceToStopAmountRef.current?.present();
              }}
              placeholderText="희망금액을 등록해주세요."
            />
          </View>
        ) : null}

        <View style={styles.viewForm}>
          <SelectBox
            title={hasAddressStop ? '출발지-도착지 희망금액' : '희망금액'}
            value={textPrice}
            onPress={() => {
              bottomSheetChooseDesiredAmountRef.current?.present();
            }}
            placeholderText="희망금액을 등록해주세요."
          />
        </View>
        <View style={styles.viewForm}>
          <CustomTextArea
            scrollEnabled={false}
            onChangeText={setIntroduce}
            title="코멘트(선택)"
            value={introduce}
            maxLength={50}
            placeholder="간략한 소개를 50자 이내로 입력해주세요."
          />
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.viewButton}>
        <CustomButton
          buttonHeight={58}
          onPress={isDailyRegistration ? onDailyRouteRegister : onPressDone}
          text={'등록하기'}
          disabled={disable}
          isLoading={isLoadingIn || isLoadingOut}
        />
      </View>

      <BottomSheetChooseTime
        timeList={isRoadOut ? TIME_ROUTE_OUT : TIME_ROUTE_IN}
        onPressChoose={setDepartureTime}
        itemChoose={departureTime}
        ref={bottomSheetChooseTime}
      />
      <BottomSheetChooseDesiredAmount
        onSelectPrice={text => {
          if (text) {
            setDesiredAmount(text);
          } else {
            priceDefaultRef.current && setDesiredAmount(priceDefaultRef.current);
          }
        }}
        ref={bottomSheetChooseDesiredAmountRef}
      />
      <BottomSheetChooseDesiredAmount
        onSelectPrice={text => {
          if (text) {
            setPriceToStop(text);
          } else {
            priceStopRef.current && setPriceToStop(priceStopRef.current);
          }
        }}
        ref={bottomSheetChoosePriceToStopAmountRef}
      />
      <ModalParkingNearest
        onPressHide={() => {
          DeviceEventEmitter.emit(EMIT_EVENT.CARPOOL_WAY_TO_WORK);
          navigation.navigate(ROUTE_KEY.CarpoolCalendar);
        }}
        ref={modalParkingNearestRef}
      />
    </FixedContainer>
  );
};

export default DriverWayToWork4;

const styles = StyleSheet.create({
  viewTop: {flexDirection: 'row', alignItems: 'center'},
  viewCenter: {height: heightScale1(8)},
  view: {padding: PADDING},
  viewLine: {alignItems: 'center', marginHorizontal: widthScale1(10)},
  viewDot1: {
    width: widthScale1(9),
    height: widthScale1(9),
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.black,
  },
  viewDot2: {
    width: widthScale1(9),
    height: widthScale1(9),
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.black,
    backgroundColor: colors.black,
  },
  boxWrapperStyle: {
    borderRadius: scale1(4),
    paddingHorizontal: PADDING1,
    paddingVertical: heightScale1(16),
    backgroundColor: colors.gray7,
    gap: heightScale1(17),
    marginTop: heightScale1(14), // 여기에 상단 여백 추가
    marginHorizontal: PADDING1, // 좌우 여백 추가
  },
  line: {width: widthScale1(1), height: heightScale1(20), backgroundColor: colors.black},
  lineGey: {width: '100%', height: 1, backgroundColor: colors.policy},
  viewForm: {paddingHorizontal: PADDING1, marginTop: heightScale1(30)},
  viewButton: {
    marginHorizontal: PADDING1,
    marginVertical: PADDING1 / 2,
  },
});
