import {BottomSheetModal} from '@gorhom/bottom-sheet';
import moment from 'moment';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSharedValue} from 'react-native-reanimated';
import AppModal from '~components/app-modal';
import ModalParkingNearest, {
  ModalParkingNearestRefs,
} from '~components/carpool-calendar/modal-parking-nearest';
import CustomButton from '~components/commons/custom-button';
import CustomTextArea from '~components/commons/custom-text-area';
import SelectBox from '~components/commons/select-box';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import Spinner from '~components/spinner';
import BottomSheetChooseDesiredAmount from '~components/way-to-work-registration/bottom-sheet-choose-desired-amount';
import BottomSheetChooseTime from '~components/way-to-work-registration/bottom-sheet-choose-time';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useDailyRouteRegistrationMutation} from '~services/carpoolServices';
import {useLazyReadDriverRoadInfoListQuery} from '~services/driverServices';
import {getParkingNearest} from '~services/kakaoService';
import {
  useGetDrivingDirectionQuery,
  useLazyGetDrivingDirectionQuery,
} from '~services/naverMapServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1} from '~styles/scaling-utils';
import {makeCommaNumber} from '~utils/common';

const CarPoolWayToWorkRegistration = (
  props: RootStackScreenProps<'CarPoolWayToWorkRegistration'>,
) => {
  const {navigation, route} = props;
  const myRoute = route?.params?.route;
  const {userID} = userHook();

  const bottomSheetChooseTime = useRef<BottomSheetModal>(null);
  const bottomSheetChooseDesiredAmountRef = useRef<BottomSheetModal>(null);
  const bottomSheetChoosePriceToStopAmountRef = useRef<BottomSheetModal>(null);

  const [desiredAmount, setDesiredAmount] = useState<any>(myRoute?.price || '');
  const [startTime, setStartTime] = useState<string>(myRoute?.startTime);
  const [introduce, setIntroduce] = useState<string>(myRoute?.introduce || '');
  const scrollYValue = useSharedValue(0);
  const priceDefaultRef = useRef<string>();
  const priceStopRef = useRef<string>();
  const [priceToStop, setPriceToStop] = useState<string | undefined>(myRoute?.soPrice || '');

  const [getPriceStop] = useLazyGetDrivingDirectionQuery();
  const modalParkingNearestRef = useRef<ModalParkingNearestRefs>(null);

  const startDirection = useMemo(() => {
    return myRoute.splng && myRoute.splat ? `${myRoute.splng},${myRoute.splat}` : '';
  }, [myRoute]);

  const endDirection = useMemo(() => {
    return myRoute.eplng && myRoute.eplat ? `${myRoute.eplng},${myRoute.eplat}` : '';
  }, [myRoute]);

  const stopDirection = useMemo(() => {
    return myRoute.soplng && myRoute.soplat ? `${myRoute.soplng},${myRoute.soplat}` : '';
  }, [myRoute]);

  const {data: direction} = useGetDrivingDirectionQuery(
    {
      start: startDirection,
      end: endDirection,
      waypoints: stopDirection,
    },
    {skip: !startDirection || !endDirection},
  );

  useEffect(() => {
    if (direction?.taxiFare) {
      priceDefaultRef.current = (
        direction?.taxiFare < 5000 ? 5000 : direction?.taxiFare
      ).toString();
    }
    if (myRoute?.soplng && myRoute?.soplat) {
      getPriceStop({
        start: startDirection,
        end: stopDirection,
        waypoints: '',
      })
        .unwrap()
        .then(res => {
          priceStopRef.current = res?.taxiFare.toString();
        });
    }
  }, [direction, stopDirection, myRoute]);

  const endTime = useMemo((): string => {
    return startTime && direction?.duration
      ? moment(startTime, 'HH:mm').add(direction?.duration, 'minutes').format('HH:mm')
      : '';
  }, [direction?.duration, startTime]);

  const [dailyRouteRegistration, {isLoading}] = useDailyRouteRegistrationMutation();
  const [readDriverRoadInfoList] = useLazyReadDriverRoadInfoListQuery();

  const onPressRegisterButton = async () => {
    getParkingNearest({latitude: myRoute?.eplat, longitude: myRoute?.eplng})
      .then((res: any) => {
        console.log('🚀 ~ .then ~ res:', res);
        if (res?.ticketPartnerYN !== 'Y' && res?.limitedNumber === 0) {
          if (res?.distance <= 1000 && res?.distance > 0) {
            modalParkingNearestRef.current?.show(res?.nearestParking);
            return;
          }
          if (res?.distance === 0) {
            AppModal.show({
              title: '파킹박 제휴 주차장을\n목적지로 등록하셨네요!\n주차장을 확인하시겠습니까?',
              content: '파킹박을 통해 평균 60% 할인된 금액으로\n주차권을 구매하실수 있습니다.',
              textYes: '주차장 보기',
              textNo: '닫기',
              yesFunc: () => {
                navigation.navigate(ROUTE_KEY.CarpoolCalendar);
                navigation.navigate(ROUTE_KEY.ParkingDetails, {id: Number(myRoute?.endParkIdOut)});
              },
              noFunc: () => {
                navigation.navigate(ROUTE_KEY.CarpoolCalendar);
              },
              isTwoButton: true,
            });
            return;
          }
        }

        AppModal.show({
          title: `${myRoute?.carInOut === 'in' ? '출근길' : '퇴근길'} 운행등록이\n완료되었습니다.`,
          content: '',
          textYes: '확인',
          yesFunc: () => {
            navigation.navigate(ROUTE_KEY.CarpoolCalendar);
          },
        });
      })
      .finally(() => {
        Spinner.hide();
      });
  };

  const textPrice = useMemo(
    () => (desiredAmount ? makeCommaNumber(desiredAmount) : ''),
    [desiredAmount],
  );

  const textPriceStop = useMemo(
    () => (priceToStop ? makeCommaNumber(priceToStop) : ''),
    [priceToStop, priceStopRef],
  );

  const onRegisterNewRoute = () => {
    Spinner.show();

    dailyRouteRegistration({
      c_memberId: userID,
      carInOut: myRoute?.carInOut,
      endPlace: myRoute?.endPlace,
      eplat: myRoute?.eplat,
      eplng: myRoute?.eplng,
      introduce: introduce,
      price: desiredAmount,
      soPrice: priceToStop && Number(priceToStop) > 0 ? priceToStop : '',
      selectDay: myRoute?.selectDate,
      soplat: myRoute?.soplat ? myRoute?.soplat : '',
      soplng: myRoute?.soplng ? myRoute?.soplng : '',
      splat: myRoute?.splat,
      splng: myRoute?.splng,
      startPlace: myRoute?.startPlace,
      startTime: myRoute?.startTime,
      stopOverPlace: myRoute?.stopOverPlace ? myRoute?.stopOverPlace : '',
      endParkId: myRoute?.carInOut === 'out' ? myRoute?.endParkIdOut : myRoute?.endParkIdIn,
      startParkId: myRoute?.carInOut === 'out' ? myRoute?.startParkIdOut : myRoute?.startParkIdOut,
    })
      .unwrap()
      .then(async res => {
        if (res?.statusCode === '200') {
          if (route?.params?.onReturn) {
            Spinner.hide();
            route?.params?.onReturn(res?.listDriverDay[0]?.roadInfoId, Number(desiredAmount));
            navigation.goBack();
            return;
          }
          await readDriverRoadInfoList({
            c_memberId: userID,
          });
          await onPressRegisterButton();
        } else {
          Spinner.hide();
          showMessage({
            message: strings.general_text.please_try_again,
          });
        }
      })
      .catch(error => {
        console.log(
          'Thuan ~ file: car-pool-way-to-work-registration.tsx:118 ~ onRegisterNewRoute ~ error:',
          error,
        );
      });
  };

  const disabled = useMemo(() => {
    if (myRoute?.soplat && myRoute?.soplng) {
      return !textPrice || !textPriceStop || !startTime;
    }
    return !textPrice || !startTime;
  }, [myRoute, textPrice, startTime, textPriceStop]);

  return (
    <FixedContainer edges={['top', 'bottom']}>
      <CustomHeader
        text={myRoute?.carInOut === 'in' ? strings.car_pool.way_to_work : '퇴근길 등록'}
      />
      <KeyboardAwareScrollView
        onScroll={e => {
          scrollYValue.value = e?.nativeEvent?.contentOffset?.y;
        }}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <PaddingHorizontalWrapper containerStyles={styles.routeContainer}>
          <RoutePlanner
            isParkingFrom={
              myRoute?.carInOut === 'out' ? !!myRoute?.startParkIdOut : !!myRoute?.startParkIdIn
            }
            isParking={
              myRoute?.carInOut === 'out' ? !!myRoute?.endParkIdOut : !!myRoute?.endParkIdIn
            }
            startAddress={myRoute?.startPlace || ''}
            arriveAddress={myRoute?.endPlace || ''}
            stopOverAddress={
              myRoute?.stopOverPlace && myRoute?.soPrice && myRoute?.soplat && myRoute?.soplng
                ? myRoute?.stopOverPlace
                : ''
            }
            timeStart={startTime}
            timeArrive={endTime}
          />
        </PaddingHorizontalWrapper>

        <Divider />

        <PaddingHorizontalWrapper containerStyles={styles.contentContainer}>
          <SelectBox
            title="출발시간"
            subTitle="여객운수법현행법상 오전 7시-9시까지 카풀이 가능합니다."
            onPress={() => {
              bottomSheetChooseTime.current?.present();
            }}
            value={startTime}
            placeholderText="출발시간을 선택해주세요."
          />

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

          {myRoute?.soplng && myRoute?.soplat ? (
            // <View style={styles.viewForm}>
            <SelectBox
              title="출발지-경유지 희망금액"
              value={textPriceStop}
              onPress={() => {
                bottomSheetChoosePriceToStopAmountRef.current?.present();
              }}
              placeholderText="희망금액을 등록해주세요."
            />
          ) : // </View>
          null}
          <SelectBox
            title={myRoute?.soplng && myRoute?.soplat ? '출발지-도착지 희망금액' : '희망금액'}
            value={textPrice}
            onPress={() => {
              bottomSheetChooseDesiredAmountRef.current?.present();
            }}
            placeholderText="희망금액을 등록해주세요."
          />
          {route?.params?.onReturn ? null : (
            <CustomTextArea
              scrollEnabled={false}
              onChangeText={setIntroduce}
              title="코멘트(선택)"
              value={introduce}
              maxLength={50}
              placeholder="간략한 소개를 50자 이내로 입력해주세요."
            />
          )}
        </PaddingHorizontalWrapper>
      </KeyboardAwareScrollView>

      <PaddingHorizontalWrapper containerStyles={styles.bottomContainer}>
        <CustomButton
          text="등록하기"
          onPress={() => {
            Keyboard.dismiss();
            onRegisterNewRoute();
          }}
          type="PRIMARY"
          buttonHeight={58}
          disabled={disabled}
          isLoading={isLoading}
        />
      </PaddingHorizontalWrapper>

      <BottomSheetChooseTime
        timeList={
          myRoute?.carInOut === 'in'
            ? ['07:10', '07:20', '07:30', '07:40', '07:50', '08:00', '08:10', '08:20']
            : ['18:10', '18:20', '18:30', '18:40', '18:50', '19:00', '19:10', '19:20']
        }
        onPressChoose={setStartTime}
        itemChoose={startTime}
        ref={bottomSheetChooseTime}
      />
      <BottomSheetChooseDesiredAmount
        ref={bottomSheetChooseDesiredAmountRef}
        onSelectPrice={text => {
          if (text) {
            setDesiredAmount(text);
          } else {
            priceDefaultRef.current && setDesiredAmount(priceDefaultRef.current);
          }
        }}
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
        onPressHide={() => navigation.navigate(ROUTE_KEY.CarpoolCalendar)}
        ref={modalParkingNearestRef}
      />
    </FixedContainer>
  );
};

export default CarPoolWayToWorkRegistration;

const styles = StyleSheet.create({
  routeContainer: {minHeight: heightScale1(65), marginVertical: heightScale1(20)},
  contentContainer: {gap: heightScale1(30), marginTop: heightScale1(30)},
  bottomContainer: {marginTop: 'auto', paddingBottom: heightScale1(20)},

  boxWrapperStyle: {
    borderRadius: scale1(4),
    paddingHorizontal: PADDING1,
    paddingVertical: heightScale1(16),
    backgroundColor: colors.gray7,
    gap: heightScale1(17),
  },
});
