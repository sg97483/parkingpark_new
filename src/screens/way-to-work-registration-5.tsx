import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  BackHandler,
  DeviceEventEmitter,
  InteractionManager,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSharedValue} from 'react-native-reanimated';
import AnimatedHeader from '~components/commons/animated-header';
import CustomButton from '~components/commons/custom-button';
import CustomTextArea from '~components/commons/custom-text-area';
import LineButton from '~components/commons/line-button';
import MapDirectionView from '~components/commons/map-direction-view';
import SelectBox from '~components/commons/select-box';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import BottomSheetChooseDesiredAmount from '~components/way-to-work-registration/bottom-sheet-choose-desired-amount';
import BottomSheetChooseTime from '~components/way-to-work-registration/bottom-sheet-choose-time';
import {PADDING1} from '~constants/constant';
import {TIME_ROUTE_IN, TIME_ROUTE_OUT} from '~constants/data';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {
  useRidingRoadUpdateInMutation,
  useRidingRoadUpdateOutMutation,
} from '~services/userServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1} from '~styles/scaling-utils';
import {getNameAddressKakao, makeCommaNumber} from '~utils/common';

const WayToWorkRegistration5 = (props: RootStackScreenProps<'WayToWorkRegistration5'>) => {
  const {navigation, route} = props;

  const routes = navigation.getState()?.routes;

  const scrollYValue = useSharedValue(0);

  const addressFrom = route.params?.searchFrom;
  const addressTo = route.params?.searchTo;

  const dataEdit = route.params?.dataEdit;
  const dataPreviousRoute = route.params?.previousRoute;
  const isRoadOut = route.params?.isRoadOut;
  const dataOldRoute = route.params.dataOldRoute;
  const hidePrice = route.params?.hidePrice;
  const isEdit = route.params?.isEdit;
  const dataInfo = route.params?.dataInfo;
  const isEditMyWork = route.params?.isEditMyWork;

  const priceTaxi = useRef<string>();

  const data = useMemo(() => dataEdit! || dataOldRoute!, [dataEdit, dataOldRoute]);

  const fromCoordinate = useMemo(
    () => ({
      longitude: (addressFrom?.x ||
        dataPreviousRoute?.eplngIn ||
        (isRoadOut ? data?.splngOut : data?.splngIn)) as string,
      latitude: (addressFrom?.y ||
        dataPreviousRoute?.eplatIn ||
        (isRoadOut ? data?.splatOut : data?.splatIn)) as string,
    }),
    [addressFrom, dataPreviousRoute, data, isRoadOut],
  );

  const toCoordinate = useMemo(
    () => ({
      longitude: (addressTo?.x ||
        dataPreviousRoute?.splngIn ||
        (isRoadOut ? data?.eplngOut : data?.eplngIn)) as string,
      latitude: (addressTo?.y ||
        dataPreviousRoute?.splatIn ||
        (isRoadOut ? data?.eplatOut : data?.eplatIn)) as string,
    }),
    [addressTo, dataPreviousRoute, isRoadOut, data],
  );

  const CMemberID = userHook().CMemberID;

  const bottomSheetChooseTime = useRef<BottomSheetModal>(null);
  const bottomSheetChooseDesiredAmountRef = useRef<BottomSheetModal>(null);
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);

  const isFocused = useIsFocused();
  const minuteEnd = useRef<number>();

  const [departureTime, setDepartureTime] = useState('');
  const [timeArrive, setTimeArrive] = useState<number>(0);
  const [desiredAmount, setDesiredAmount] = useState<string>('');
  const [introduce, setIntroduce] = useState('');

  const [ridingRoadUpdateIn, {isLoading: isLoadingIn}] = useRidingRoadUpdateInMutation();
  const [ridingRoadUpdateOut, {isLoading: isLoadingOut}] = useRidingRoadUpdateOutMutation();

  useEffect(() => {
    if (isFocused) {
      const timeStart = isRoadOut ? data?.startTimeOut : data?.startTimeIn;
      const intro = isRoadOut ? (data?.introduceOut ?? '') : (data?.introduce ?? '');
      const amount = hidePrice ? '' : isRoadOut ? data?.priceOut : data?.priceIn;

      if (dataInfo) {
        setDepartureTime(dataInfo.timeStart);
        setIntroduce(dataInfo.introduce);
      } else {
        if (data) {
          setDepartureTime(timeStart);
          setIntroduce(intro);
          setDesiredAmount(amount);
        } else {
          setDesiredAmount('');
        }
      }

      InteractionManager.runAfterInteractions(() => {
        if (isEdit) {
          scrollViewRef.current?.scrollToEnd();
        }
      });
    }
  }, [isFocused]);

  const handleBack = () => {
    if (routes.some(item => item.name === ROUTE_KEY.WayToWorkRegistration2)) {
      DeviceEventEmitter.emit(EMIT_EVENT.FOCUS_INPUT_WAY_2);
    }
    return false;
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => sub.remove();
  }, []);

  const textPrice = useMemo(
    () => (desiredAmount ? makeCommaNumber(desiredAmount) : ''),
    [desiredAmount],
  );

  const disable = useMemo(() => !departureTime || !textPrice, [textPrice, departureTime]);

  const nameStart = useMemo(
    (): any =>
      addressFrom
        ? getNameAddressKakao(addressFrom)
        : dataPreviousRoute?.endPlaceIn! || (isRoadOut ? data?.startPlaceOut : data?.startPlaceIn),
    [addressFrom, dataPreviousRoute, data, isRoadOut],
  );
  const nameEnd = useMemo(
    (): string =>
      addressTo
        ? getNameAddressKakao(addressTo)
        : dataPreviousRoute?.startPlaceIn! || (isRoadOut ? data?.endPlaceOut : data?.endPlaceIn),
    [addressTo, dataPreviousRoute, data, isRoadOut],
  );

  const timeEnd = useMemo(
    () =>
      departureTime
        ? moment(departureTime, 'HH:mm').add(minuteEnd.current, 'minutes').format('HH:mm')
        : '00:00',
    [departureTime, minuteEnd.current, isRoadOut, dataPreviousRoute, isFocused],
  );

  const isParking = useMemo(() => {
    if (dataPreviousRoute) {
      return {
        to: dataPreviousRoute?.endParkIdOut?.toString() || '',
        from: dataPreviousRoute?.startParkIdOut?.toString() || '',
      };
    }
    if (data) {
      return {
        to: isRoadOut
          ? addressTo
            ? addressTo?.isParking
              ? addressTo?.id?.toString()
              : ''
            : data?.endParkIdOut?.toString()
          : addressTo
            ? addressTo?.isParking
              ? addressTo?.id?.toString()
              : ''
            : data?.endParkIdIn?.toString(),
        from: isRoadOut
          ? addressFrom
            ? addressFrom?.isParking
              ? addressFrom?.id?.toString()
              : ''
            : data?.startParkIdOut?.toString()
          : addressFrom
            ? addressFrom?.isParking
              ? addressFrom?.id?.toString()
              : ''
            : data?.startParkIdIn?.toString(),
      };
    }

    return {
      to: addressTo?.isParking ? addressTo.id : '',
      from: addressFrom?.isParking ? addressFrom.id : '',
    };
  }, [addressTo, isRoadOut, data, addressFrom, dataPreviousRoute]);

  const onPressDone = () => {
    if (!CMemberID) {
      return;
    }

    if (isRoadOut) {
      ridingRoadUpdateOut({
        c_memberId: CMemberID.toString(),
        startPlaceOut: encodeURIComponent(nameStart),
        startTimeOut: encodeURIComponent(departureTime),
        splatOut: fromCoordinate.latitude!,
        splngOut: fromCoordinate.longitude!,
        endPlaceOut: encodeURIComponent(nameEnd),
        eplatOut: toCoordinate.latitude!,
        eplngOut: toCoordinate.longitude!,
        priceOut: desiredAmount?.toString(),
        introduceOut: encodeURIComponent(introduce),
        startParkIdOut: isParking.from || '',
        endParkIdOut: isParking.to || '',
      } as any)
        .unwrap()
        .then(res => {
          if (res.statusCode !== '200') {
            return;
          }
          onUpdateDone();
        });
    } else {
      const body = {
        c_memberId: CMemberID.toString(),
        startPlaceIn: encodeURIComponent(nameStart),
        startTimeIn: encodeURIComponent(departureTime),
        splatIn: fromCoordinate.latitude!,
        splngIn: fromCoordinate.longitude!,
        endPlaceIn: encodeURIComponent(nameEnd),
        eplatIn: toCoordinate.latitude!,
        eplngIn: toCoordinate.longitude!,
        priceIn: desiredAmount?.toString(),
        introduce: encodeURIComponent(introduce),
        startParkIdIn: isParking.from || '',
        endParkIdIn: isParking.to || '',
      };
      console.log('🚀 ~ onPressDone ~ body:', body);
      ridingRoadUpdateIn(body)
        .unwrap()
        .then(res => {
          if (res.statusCode !== '200') {
            return;
          }
          onUpdateDone(body);
        });
    }
  };

  const onUpdateDone = (bodyRouteIn?: any) => {
    if (routes.some(item => item.name === ROUTE_KEY.MyRoute)) {
      DeviceEventEmitter.emit(EMIT_EVENT.RELOAD_ROUTE_PASSENGER);
      navigation.navigate(ROUTE_KEY.MyRoute);
    } else {
      if (isEditMyWork || isRoadOut) {
        navigation.navigate(ROUTE_KEY.MyWorkRoute, {isPassenger: true});
      } else {
        const screenPrev = routes[routes.length - 2].name;

        if (
          screenPrev === ROUTE_KEY.WayToWorkRegistration1 ||
          screenPrev === ROUTE_KEY.WayToWorkRegistration2
        ) {
          navigation.navigate(ROUTE_KEY.WayToWorkRegistration1, {
            isReturnRoute: true,
            previousRoute: bodyRouteIn,
          });
        } else {
          navigation.goBack();
        }
      }
    }
  };

  return (
    <FixedContainer
      pointerEvents={isLoadingIn || isLoadingOut ? 'none' : undefined}
      edges={['bottom']}>
      {isFocused && <StatusBar barStyle={'dark-content'} translucent />}

      <AnimatedHeader
        title={isRoadOut ? '퇴근길 등록' : '출근길 등록'}
        handleBack={handleBack}
        scrollYValue={scrollYValue}
        rightContent={
          isEdit && (
            <LineButton
              onPress={() => {
                const dataParams = {
                  dataOldRoute: data,

                  isReturnRoute: isRoadOut,
                  hidePrice: true,
                  dataFill: {
                    from: {
                      road_address: {address_name: nameStart},
                      x: fromCoordinate.longitude,
                      y: fromCoordinate.latitude,
                    } as any,
                    to: {
                      road_address: {address_name: nameEnd},
                      x: toCoordinate.longitude,
                      y: toCoordinate.latitude,
                    } as any,
                    timeStart: departureTime,
                    introduce: introduce,
                  },
                  isEditMyWork: isEditMyWork,
                };

                if (isEditMyWork) {
                  navigation.push(ROUTE_KEY.WayToWorkRegistration2, dataParams);
                } else {
                  navigation.navigate(ROUTE_KEY.WayToWorkRegistration2, dataParams);
                }
              }}
              text={'경로수정'}
            />
          )
        }
      />

      <KeyboardAwareScrollView
        ref={scrollViewRef}
        contentContainerStyle={{paddingBottom: heightScale1(88)}}
        showsVerticalScrollIndicator={false}
        bounces={false}
        onScroll={e => {
          scrollYValue.value = e?.nativeEvent?.contentOffset?.y;
        }}>
        <MapDirectionView
          startPoint={{
            latitude: Number(fromCoordinate.latitude),
            longitude: Number(fromCoordinate.longitude),
          }}
          endPoint={{
            latitude: Number(toCoordinate.latitude),
            longitude: Number(toCoordinate.longitude),
          }}
          onDurationDataReturn={_timeEnd => {
            setTimeArrive(_timeEnd);
            minuteEnd.current = _timeEnd;
          }}
          onReturnPriceTaxi={price => {
            priceTaxi.current = price?.toString();
          }}
        />

        <View style={{padding: PADDING1}}>
          <RoutePlanner
            isParkingFrom={!!isParking.from}
            isParking={!!isParking?.to}
            timeStart={departureTime || '00:00'}
            timeArrive={timeEnd}
            startAddress={nameStart}
            arriveAddress={nameEnd}
          />
        </View>

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

        <View style={styles.viewForm}>
          <SelectBox
            title="희망금액"
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
      <CustomButton
        buttonStyle={styles.buttonStyle}
        isLoading={isLoadingIn || isLoadingOut}
        disabled={disable}
        buttonHeight={58}
        type="PRIMARY"
        onPress={onPressDone}
        text={'등록하기'}
      />
      <BottomSheetChooseTime
        timeList={isRoadOut ? TIME_ROUTE_OUT : TIME_ROUTE_IN}
        onPressChoose={time => {
          setDepartureTime(time);
        }}
        itemChoose={departureTime}
        ref={bottomSheetChooseTime}
      />
      <BottomSheetChooseDesiredAmount
        onSelectPrice={text => {
          if (text) {
            setDesiredAmount(text);
          } else {
            priceTaxi.current && setDesiredAmount(priceTaxi.current);
          }
        }}
        ref={bottomSheetChooseDesiredAmountRef}
      />
    </FixedContainer>
  );
};

export default WayToWorkRegistration5;
const styles = StyleSheet.create({
  viewForm: {
    paddingHorizontal: PADDING1,
    marginTop: heightScale1(30),
  },
  buttonStyle: {
    marginTop: heightScale1(10),
    marginHorizontal: PADDING1,
    marginBottom: PADDING1 / 2,
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
});
