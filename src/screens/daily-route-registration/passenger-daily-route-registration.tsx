import {BottomSheetModal} from '@gorhom/bottom-sheet';
import moment from 'moment';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {DateData} from 'react-native-calendars';
import {showMessage} from 'react-native-flash-message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '~components/commons/custom-button';
import CustomTextArea from '~components/commons/custom-text-area';
import DayPickerModal, {DayPickerModalRefs} from '~components/commons/day-picker-modal';
import PageButton from '~components/commons/page-button';
import RouteBadge from '~components/commons/route-badge';
import SelectBox from '~components/commons/select-box';
import ToastMessage from '~components/commons/toast-message/toast-message';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import BottomSheetChooseDesiredAmount from '~components/way-to-work-registration/bottom-sheet-choose-desired-amount';
import BottomSheetChooseTime from '~components/way-to-work-registration/bottom-sheet-choose-time';
import {PADDING1} from '~constants/constant';
import {TIME_ROUTE_IN, TIME_ROUTE_OUT} from '~constants/data';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetMyRiderRoadQuery} from '~services/carpoolServices';
import {useGetDrivingDirectionQuery} from '~services/naverMapServices';
import {
  useGetMyDailyRouteCommuteQuery,
  useLazyGetMyDailyRouteCommuteQuery,
  usePassengerDailyRouteRegistrationMutation,
} from '~services/passengerServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {makeCommaNumber} from '~utils/common';
import {dayjs} from '~utils/dayjsUtil';
import {getDayName} from '~utils/hourUtils';

const PassengerDailyRouteRegistration = (
  props: RootStackScreenProps<'PassengerDailyRouteRegistration'>,
) => {
  const {navigation} = props;

  const {CMemberID, userID} = userHook();
  const {data: roadRider} = useGetMyRiderRoadQuery({memberId: userID!, id: CMemberID!});

  const {data} = useGetMyDailyRouteCommuteQuery({c_memberId: userID as number}, {skip: !userID});

  const transactionType = useAppSelector(
    state => state?.carpoolReducer?.passengerModeFilter?.carInOut,
  );
  const temporaryRoute = useAppSelector(state => state.userReducer.temporaryRoute);

  const bottomSheetChooseTime = useRef<BottomSheetModal>(null);
  const dayPickerRef = useRef<DayPickerModalRefs>(null);
  const bottomSheetChooseDesiredAmountRef = useRef<BottomSheetModal>(null);
  const [registerRoute, {isLoading: isRegistering}] = usePassengerDailyRouteRegistrationMutation();

  const [date, setDate] = useState<DateData>();
  const [minDate, setMinDate] = useState<string>(dayjs().format('YYYY-MM-DD'));

  const [introduce, setIntroduce] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isWayHome = useMemo(() => transactionType === 'out', [transactionType]);
  const [getMyDailyRouteCommute] = useLazyGetMyDailyRouteCommuteQuery();
  const [departureTime, setDepartureTime] = useState<string>('');
  const [desiredAmount, setDesiredAmount] = useState<string>('');

  const nowDay = dayjs().day();
  const checkIsWeekend = useMemo((): {isWeekend: boolean; value: number} => {
    const isWeekend = nowDay === 0 || nowDay == 5 || nowDay === 6 ? true : false;
    return {
      isWeekend: isWeekend,
      value: nowDay === 5 ? 3 : nowDay === 6 ? 2 : 1,
    };
  }, [nowDay]);

  useEffect(() => {
    const hour = dayjs().hour();
    if (isWayHome) {
      if (hour >= 20 || checkIsWeekend?.isWeekend) {
        setMinDate(dayjs().add(checkIsWeekend?.value, 'days').format('YYYY-MM-DD'));
        setDate({
          dateString: dayjs().add(checkIsWeekend?.value, 'days').format('YYYY-MM-DD'),
          day: dayjs().add(checkIsWeekend?.value, 'days').day(),
          month: dayjs().add(checkIsWeekend?.value, 'days').month() + 1,
          timestamp: dayjs().add(checkIsWeekend?.value, 'days').valueOf(),
          year: dayjs().add(checkIsWeekend?.value, 'days').year(),
        });
      }
    } else {
      if (hour >= 9 || checkIsWeekend?.isWeekend) {
        setMinDate(dayjs().add(checkIsWeekend?.value, 'days').format('YYYY-MM-DD'));
        setDate({
          dateString: dayjs().add(checkIsWeekend?.value, 'days').format('YYYY-MM-DD'),
          day: dayjs().add(checkIsWeekend?.value, 'days').day(),
          month: dayjs().add(checkIsWeekend?.value, 'days').month() + 1,
          timestamp: dayjs().add(checkIsWeekend?.value, 'days').valueOf(),
          year: dayjs().add(checkIsWeekend?.value, 'days').year(),
        });
      }
    }
  }, [isWayHome, checkIsWeekend]);

  useEffect(() => {
    if (roadRider) {
      setDepartureTime(isWayHome ? roadRider?.startTimeOut : roadRider?.startTimeIn);
      setIntroduce(isWayHome ? roadRider?.introduceOut : roadRider.introduce);
    }
  }, [roadRider]);

  const textDate = useMemo(
    () =>
      dayjs(date?.timestamp).format('YYYY.MM.DD') + `(${getDayName(date?.timestamp as number)})`,
    [date],
  );

  const isParking = useMemo(() => {
    if (isWayHome) {
      return {
        to: roadRider?.startParkIdOut?.toString() || '',
        from: roadRider?.startParkIdOut?.toString() || '',
      };
    }

    return {
      from: roadRider?.startParkIdIn?.toString() || '',
      to: roadRider?.endParkIdIn?.toString() || '',
    };
  }, [isWayHome, roadRider]);

  const startAddress = useMemo(() => {
    if (!isWayHome) {
      if (temporaryRoute?.startPlaceIn) {
        return {text: temporaryRoute.startPlaceIn, coord: temporaryRoute.startCoordIn};
      } else {
        return {
          text: roadRider?.startPlaceIn,
          coord: {latitude: roadRider?.splatIn, longitude: roadRider?.splngIn},
        };
      }
    } else {
      if (temporaryRoute?.startPlaceOut) {
        return {text: temporaryRoute.startPlaceOut, coord: temporaryRoute.startCoordOut};
      } else {
        return {
          text: roadRider?.startPlaceOut,
          coord: {latitude: roadRider?.splatOut, longitude: roadRider?.splngOut},
        };
      }
    }
  }, [isWayHome, roadRider, temporaryRoute]);

  const arriveAddress = useMemo(() => {
    if (!isWayHome) {
      if (temporaryRoute?.endPlaceIn) {
        return {text: temporaryRoute.endPlaceIn, coord: temporaryRoute.endCoordIn};
      } else {
        return {
          text: roadRider?.endPlaceIn,
          coord: {latitude: roadRider?.eplatIn, longitude: roadRider?.eplngIn},
        };
      }
    } else {
      if (temporaryRoute?.endPlaceOut) {
        return {text: temporaryRoute.endPlaceOut, coord: temporaryRoute.endCoordOut};
      } else {
        return {
          text: roadRider?.endPlaceOut,
          coord: {latitude: roadRider?.eplatOut, longitude: roadRider?.eplngOut},
        };
      }
    }
  }, [isWayHome, roadRider, temporaryRoute]);

  const {data: direction} = useGetDrivingDirectionQuery(
    {
      start: `${startAddress?.coord?.longitude},${startAddress?.coord?.latitude}`,
      end: `${arriveAddress?.coord?.longitude},${arriveAddress?.coord?.latitude}`,
    },
    {skip: !startAddress || !arriveAddress},
  );

  const endTime = useMemo(() => {
    if (direction?.duration && departureTime) {
      return moment(departureTime, 'HH:mm').add(direction?.duration, 'minutes').format('HH:mm');
    }
    return '';
  }, [direction, departureTime]);

  const isOut = useMemo(() => {
    return isWayHome ? 'out' : 'in';
  }, [isWayHome]);

  const getPriceDefault = () => {
    const from = startAddress.coord;
    const to = arriveAddress.coord;

    if (from && to) {
      setDesiredAmount(
        direction ? (direction?.taxiFare < 5000 ? 5000 : direction?.taxiFare).toString() : '',
      );
    }
  };

  const textPrice = useMemo(() => {
    return desiredAmount
      ? makeCommaNumber(desiredAmount)
      : direction
        ? makeCommaNumber(
            isOut === 'out'
              ? Number(roadRider?.priceOut) < 5000
                ? 5000
                : roadRider?.priceOut
              : Number(roadRider?.priceIn) < 5000
                ? 5000
                : roadRider?.priceIn,
          )
        : '';
  }, [desiredAmount, direction, roadRider, isOut]);

  const onPressSave = () => {
    if (!textDate) {
      showMessage({
        message: '날짜를 선택하여 카풀을 등록해주세요.',
      });
      return;
    }

    setIsLoading(true);
    getMyDailyRouteCommute({
      c_memberId: Number(userID),
    })
      .unwrap()
      .then(async returnedMyDailyRoute => {
        const isAlreadyHaveARoute = returnedMyDailyRoute?.find(
          item =>
            item?.selectDay?.slice(0, 10) === textDate?.slice(0, 10) &&
            item?.carInOut === (isWayHome ? 'out' : 'in'),
        );
        if (isAlreadyHaveARoute) {
          setIsLoading(false);
          showMessage({
            message:
              '해당 일자에 이미 카풀 요청을 등록하셨습니다.\n다른 일자로 카풀 요청을 등록해보세요.',
          });
          return;
        }

        const body = {
          cMemberId: userID as number,
          price: Number(textPrice?.split(',').join('')),
          route: {
            carInOut: isWayHome ? 'out' : 'in',
            endPlace: arriveAddress?.text ?? '',
            endTime: endTime,
            eplat: arriveAddress?.coord?.latitude as number,
            eplng: arriveAddress?.coord?.longitude as number,
            selectDate: textDate,
            startPlace: startAddress?.text ?? '',
            splat: startAddress?.coord?.latitude as number,
            splng: startAddress?.coord?.longitude as number,
            startTime: departureTime,
            introduce: introduce ?? '',
            startParkId: isParking?.from,
            endParkId: isParking?.to,
          },
        };

        registerRoute(body)
          .unwrap()
          .then(res => {
            setIsLoading(false);
            if (res !== '200') {
              showMessage({message: strings.general_text?.please_try_again});
              return;
            }
            showMessage({message: '경로등록이 완료되었습니다.'});
            navigation.replace(ROUTE_KEY.CarpoolRequestRegistrationList);
          });
      });
  };

  const disable = useMemo(() => {
    return !textPrice || !endTime;
  }, [textPrice, endTime]);

  return (
    <FixedContainer>
      <CustomHeader text={isWayHome ? '퇴근길 카풀 요청' : '출근길 카풀 요청'} />

      <KeyboardAwareScrollView>
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}>
          <PaddingHorizontalWrapper forDriveMe>
            {!!data?.length && (
              <PageButton
                text="등록한 요청내역을 확인해보세요!"
                onPress={() => {
                  navigation.navigate(ROUTE_KEY.CarpoolRequestRegistrationList);
                }}
              />
            )}

            <HStack
              style={{
                justifyContent: 'space-between',
                marginTop: PADDING1,
              }}>
              <HStack style={{gap: widthScale1(10)}}>
                <RouteBadge type={isWayHome ? 'WAY_HOME' : 'WAY_WORK'} />
                <CustomText
                  size={FONT.BODY}
                  forDriveMe
                  family={FONT_FAMILY.SEMI_BOLD}
                  string={textDate}
                  lineHeight={heightScale1(25)}
                />
              </HStack>

              <CustomButton
                type="TERTIARY"
                outLine
                onPress={() => {
                  dayPickerRef?.current?.show(date);
                }}
                text="변경"
                textSize={FONT.CAPTION_6}
                buttonHeight={38}
                borderRadiusValue={6}
                buttonStyle={{paddingHorizontal: widthScale1(10), minWidth: widthScale1(45)}}
              />
            </HStack>

            <RoutePlanner
              timeArrive={endTime ? endTime : '--:--'}
              timeStart={departureTime}
              startAddress={startAddress?.text!}
              arriveAddress={arriveAddress?.text!}
              isParkingFrom={!!isParking?.from}
              isParking={!!isParking?.to}
            />
          </PaddingHorizontalWrapper>

          <Divider style={{marginVertical: PADDING1}} />

          <PaddingHorizontalWrapper forDriveMe>
            <View style={{gap: PADDING1}}>
              <SelectBox
                value={departureTime}
                placeholderText="출발시간을 선택해주세요."
                onPress={() => {
                  bottomSheetChooseTime.current?.present();
                }}
                title="출발시간"
                subTitle={
                  isWayHome
                    ? '여객운수법현행법상 오후 6시-8시까지 카풀이 가능합니다.'
                    : '여객운수법현행법상 오전 7시-9시까지 카풀이 가능합니다.'
                }
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

              <SelectBox
                value={textPrice}
                placeholderText="희망금액을 등록해주세요."
                onPress={() => {
                  bottomSheetChooseDesiredAmountRef.current?.present();
                }}
                title="희망금액"
                disabled={!endTime}
              />

              <CustomTextArea
                title="코멘트(선택)"
                placeholder="간략한 소개를 50자 이내로 입력해주세요."
                value={introduce}
                onChangeText={setIntroduce}
              />
            </View>
          </PaddingHorizontalWrapper>
        </ScrollView>
      </KeyboardAwareScrollView>

      <CustomButton
        disabled={disable}
        text="등록하기"
        onPress={onPressSave}
        buttonHeight={58}
        buttonStyle={styles.buttonStyle}
        isLoading={isRegistering || isLoading}
      />

      <DayPickerModal
        ref={dayPickerRef}
        onSubmitPress={setDate}
        onlyTwoWeeks
        specMinDate={minDate}
      />

      <BottomSheetChooseTime
        timeList={isWayHome ? TIME_ROUTE_OUT : TIME_ROUTE_IN}
        onPressChoose={setDepartureTime}
        itemChoose={departureTime}
        ref={bottomSheetChooseTime}
      />

      <BottomSheetChooseDesiredAmount
        onSelectPrice={text => {
          if (text) {
            setDesiredAmount(text);
          } else {
            getPriceDefault();
          }
        }}
        ref={bottomSheetChooseDesiredAmountRef}
      />

      <ToastMessage containerStyle={{bottom: '50%'}} />
    </FixedContainer>
  );
};

export default PassengerDailyRouteRegistration;

const styles = StyleSheet.create({
  container: {
    paddingTop: heightScale1(10),
  },
  buttonStyle: {
    marginHorizontal: PADDING1,
    marginTop: heightScale1(10),
    marginBottom: PADDING1 / 2,
  },
  boxWrapperStyle: {
    borderRadius: scale1(4),
    paddingHorizontal: PADDING1,
    paddingVertical: heightScale1(16),
    backgroundColor: colors.gray7,
    gap: heightScale1(17),
  },
});
