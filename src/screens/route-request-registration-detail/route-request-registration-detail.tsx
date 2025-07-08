import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import React, {memo, useMemo, useRef, useState} from 'react';
import {Pressable, StatusBar, StyleSheet, View} from 'react-native';
import Animated, {useSharedValue} from 'react-native-reanimated';
import {Icons} from '~/assets/svgs';
import AnimatedHeader from '~components/commons/animated-header';
import CustomBoxSelectButton from '~components/commons/custom-box-select-button';
import CustomButton from '~components/commons/custom-button';
import DayPickerModal, {DayPickerModalRefs} from '~components/commons/day-picker-modal';
import InfoPriceRoute from '~components/commons/info-price-route';
import MapDirectionView from '~components/commons/map-direction-view';
import RouteBadge from '~components/commons/route-badge';
import SelectRequestPathModal, {
  SelectRequestPathModalRefs,
} from '~components/commons/select-request-path-model';
import ToastMessage from '~components/commons/toast-message/toast-message';
import ToastMessageController from '~components/commons/toast-message/toast-message-controller';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import RenderProgress from '~components/driver-profile-evaluation-details/render-progress';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import RatingDisplay from '~components/rating';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import DriverSectionInfo from '~components/route-request-registration-detail/driver-section-info';
import InfoCar from '~components/route-to-stopover-registration-completed/info-car';
import VehicleInformation from '~components/route-to-stopover-registration-completed/vehicle-information';
import Spinner from '~components/spinner';
import {PADDING1} from '~constants/constant';
import {AUTO_MESSAGE_TYPE, FONT, FONT_FAMILY} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {ChatRoomModel} from '~model/chat-model';
import {DriverRoadDayModel} from '~model/driver-model';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {
  useCreatePaymentHistoryMutation,
  useGetMyDriverDetailRoadQuery,
  useGetReadMyDriverDayQuery,
  useLazyBlockRoadDriverDayQuery,
  useReadMyDriverQuery,
  useRequestNewCarpoolMutation,
} from '~services/carpoolServices';
import {useReadDriverRoadInfoListQuery} from '~services/driverServices';
import {useSendFCMNotiMutation} from '~services/notiServices';
import {useGetDriverEvaluationQuery} from '~services/passengerServices';
import {getRealm} from '~services/realm';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {dayjs} from '~utils/dayjsUtil';
import {createNewChatRoom, handleSendAutomaticMessage} from '~utils/firebaseChatUtils';
import {getCarpoolDriverStyle} from '~utils/getCarpoolDriverStyle';
import {getRouteStateValue} from '~utils/getRouteStateValue';
import {getDayName} from '~utils/hourUtils';

const RouteRequestRegistrationDetail = memo(
  (props: RootStackScreenProps<'RouteRequestRegistrationDetail'>) => {
    const {navigation, route} = props;
    const {routeInfo, viewMode} = route?.params;

    const myUID = auth().currentUser?.uid;
    const selectPathRef = useRef<SelectRequestPathModalRefs>(null);
    const dayPickerRef = useRef<DayPickerModalRefs>(null);
    const [durationValue, setDurationValue] = useState<number>(0);
    const [selectedDay, setSelectedDay] = useState(routeInfo?.selectDay);
    const {userID, user: userInfo} = userHook();
    const scrollYValue = useSharedValue(0);
    const [sendFCM] = useSendFCMNotiMutation();
    const isHaveStopOverPlace = useMemo(
      (): boolean =>
        routeInfo?.stopOverPlace &&
        routeInfo?.soplat &&
        routeInfo?.soplng &&
        routeInfo?.soPrice &&
        routeInfo?.soPrice !== '0'
          ? true
          : false,
      [routeInfo],
    );

    const {data: routeDetail} = useGetReadMyDriverDayQuery(
      {
        id: routeInfo?.id as number,
      },
      {skip: !routeInfo?.selectDay},
    );

    const {data: driverRoadInfo} = useGetMyDriverDetailRoadQuery(
      {
        id: routeInfo?.id as number,
        memberId: routeInfo?.c_memberId
          ? Number(routeInfo?.c_memberId)
          : Number(routeInfo?.memberId),
      },
      {skip: (routeInfo?.selectDay ?? '')?.length > 0},
    );

    const {data: listRoadRegisterdOfDriver} = useReadDriverRoadInfoListQuery({
      c_memberId: routeInfo?.c_memberId
        ? Number(routeInfo?.c_memberId)
        : Number(routeInfo?.memberId),
    });

    const filterRoadRegisterd = useMemo(
      () => listRoadRegisterdOfDriver?.filter(item => item?.state !== 'C'),
      [listRoadRegisterdOfDriver],
    );
    // console.log('🚀 ~ listRoadRegisterdOfDriver:', listRoadRegisterdOfDriver);

    const {data: driverInfo} = useReadMyDriverQuery({
      memberId: routeInfo?.c_memberId ? Number(routeInfo?.c_memberId) : Number(routeInfo?.memberId),
    });

    const {data: driverEvaluationAvg} = useGetDriverEvaluationQuery({
      driverID: routeInfo?.c_memberId ? Number(routeInfo?.c_memberId) : Number(routeInfo?.memberId),
    });

    const [passengerRequestCarpool] = useRequestNewCarpoolMutation();
    const [createPaymentHistory] = useCreatePaymentHistoryMutation();
    const [blockDayCarpoolDriver] = useLazyBlockRoadDriverDayQuery();

    const driverStyle = useMemo(
      (): string[] =>
        getCarpoolDriverStyle(
          routeInfo?.selectDay ? (driverInfo?.style ?? '') : (driverRoadInfo?.style ?? ''),
        ) as string[],
      [driverInfo?.style, driverRoadInfo?.style, routeInfo],
    );

    const handleRequest = () => {
      if (routeInfo?.selectDay || selectedDay) {
        const booking = listRoadRegisterdOfDriver?.find(
          (item: DriverRoadDayModel) =>
            moment(item?.selectDay, 'YYYY.MM.DD').format('YYYY-MM-DD') ===
              moment(routeInfo?.selectDay || selectedDay, 'YYYY.MM.DD').format('YYYY-MM-DD') &&
            item?.carInOut === routeInfo?.carInOut,
        );

        if (booking?.state === 'E' || booking?.state === 'R') {
          ToastMessageController.show(
            '이미 카풀 등록한 날짜입니다.\n다른 날짜를 선택하여 요청해주세요.',
          );
          return;
        }

        if (isHaveStopOverPlace) {
          selectPathRef?.current?.show(routeInfo?.soPrice || '', routeInfo?.price || '');
        } else {
          onHandleRequest('E');
        }
      } else {
        dayPickerRef?.current?.show();
      }
    };

    const onChoosedPrice = (price: 'E' | 'M' | null) => {
      if (routeDetail?.selectDay || selectedDay) {
        onHandleRequest(price);
      } else {
        dayPickerRef?.current?.show();
      }
    };

    const onHandleRequest = async (price: 'E' | 'M' | null, chooseDay?: string) => {
      try {
        Spinner.show();

        const temptRoute = routeInfo?.selectDay
          ? null
          : ({
              ...(routeInfo || {}),
              selectDay: chooseDay ?? selectedDay,
            } as DriverRoadDayModel);

        createNewChatRoom({
          driverID: routeInfo?.c_memberId
            ? Number(routeInfo?.c_memberId)
            : Number(routeInfo?.memberId),
          myUID: myUID || '',
          otherEmail: routeDetail?.email ? routeDetail?.email : (routeInfo?.email ?? ''),
          passengerID: userID || 0,
          cDayId: routeInfo?.selectDay ? routeInfo?.id : ('' as any),
          temptRoute: temptRoute,
          selectedPrice: price,
        })
          .then(res => {
            if (res?.isExisted) {
              openChatRoom(res);
              return;
            }
            // Create payment history
            createPaymentHistory({
              chatId: res?.roomID,
              d_memberId: routeInfo?.c_memberId
                ? Number(routeInfo?.c_memberId)
                : Number(routeInfo?.memberId),
              r_memberId: userID,
              roadInfoId: routeInfo?.selectDay ? routeInfo?.id : ('' as any),
            })
              .unwrap()
              .then(data => {
                passengerRequestCarpool({
                  c_dayId: routeInfo?.selectDay ? routeInfo?.id : ('' as any),
                  chatId: res?.roomID ?? '',
                  driverId: routeDetail?.c_memberId || 0,
                  passengerId: userID || 0,
                  priceSelect: price,
                  selectDay: selectedDay || '',
                  resId: data?.[0]?.resId,
                  isRouteRegistered: routeInfo?.selectDay ? true : false,
                  requestBy: 'PASSENGER',
                })
                  .unwrap()
                  .then(() => {
                    firestore()
                      .collection('rooms')
                      .doc(res?.roomID)
                      .update({
                        resId: data?.[0]?.resId,
                        isRequestedBy: 'PASSENGER',
                      })
                      .then(() => {
                        const driverID = Object.keys(res?.users).find(it => it !== myUID);
                        firestore()
                          .collection('users')
                          .doc(driverID)
                          .get()
                          .then(async user => {
                            sendFCM({
                              userToken: user?.data()?.token || '',
                              title: routeInfo?.selectDay
                                ? '드라이버님의 운행경로 운행을 요청하였습니다.'
                                : '드라이버님의 운행경로 운행을 요청하였습니다.',
                              body: routeInfo?.selectDay
                                ? '운행 등록하고 카풀을 시작해보세요!'
                                : '운행 등록하고 카풀을 시작해보세요!',
                              data: {
                                chatRoomData: JSON.stringify({
                                  ...res,
                                  resId: data?.[0]?.resId,
                                  isRequestedBy: 'PASSENGER',
                                  otherUID: driverID,
                                  temptRoute: temptRoute,
                                  lastMsg: undefined,
                                } as ChatRoomModel),
                              },
                            }).then(() => {
                              openChatRoom({
                                ...res,
                                resId: data?.[0]?.resId,
                                isRequestedBy: 'PASSENGER',
                                otherUID: driverID,
                                temptRoute: temptRoute,
                              });
                              handleSendAutomaticMessage({
                                roomID: res?.roomID ?? '',
                                type: routeInfo?.selectDay
                                  ? AUTO_MESSAGE_TYPE.CARPOOL_REQUEST
                                  : AUTO_MESSAGE_TYPE.PASSENGER_CARPOOL_REQUEST,
                                passengerName: userInfo?.nic ?? '',
                              });
                            });
                          });
                      });
                  })
                  .catch(error => {
                    console.log('🚀 ~ onHandleRequest ~ error 213:', error);
                  });
              });
          })
          .catch(error => {
            console.log('🚀 ~ onHandleRequest ~ error 219:', error);
          })
          .finally(() => {
            setSelectedDay(undefined);
            Spinner.hide();
          });
      } catch (error) {}
    };

    const openChatRoom = async (res: any) => {
      let photo: string = '';
      let userid: string = '';
      if (Object.keys(res?.users)?.length === 2) {
        const realm = await getRealm();
        const listUsers = realm.objects('FirebaseUser');
        for (const key in res?.users) {
          if (myUID === key) {
            continue;
          }
          const userModel: any = listUsers?.find(it => it?.uid === key);

          userid = userModel?.userid || '';
          photo = userModel?.userphoto || '';
        }
      }
      const chatRoomData = {
        roomID: res?.roomID,
        lastMsg: undefined,
        unreadCount: 0,
        userCount: 2,
        driverID: res?.driverID,
        passengerID: res?.passengerID,
        resId: res?.resId,
        userid: userid,
        photo: photo,
        lastDatetime: dayjs
          .unix(res?.timestamp?.seconds)
          .add(res?.timestamp?.nanoseconds / 1e9, 'second')
          .format('YYYY.MM.DD HH:mm'),
        isRequestedBy: res?.isRequestedBy,
        cDayId: routeInfo?.selectDay ? routeInfo?.id : null,
        temptRoute: res.temptRoute,
      } as ChatRoomModel;

      navigation.push(ROUTE_KEY.ChatDetail, {
        currentChatRoomInfo: chatRoomData,
      });
    };

    return (
      <FixedContainer edges={['bottom']}>
        <AnimatedHeader title="경로 상세보기" scrollYValue={scrollYValue} />

        <StatusBar translucent backgroundColor={colors.transparent} />

        <Animated.ScrollView
          onScroll={e => {
            scrollYValue.value = e?.nativeEvent?.contentOffset?.y;
          }}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          <MapDirectionView
            startPoint={{
              latitude: Number(routeInfo?.splat),
              longitude: Number(routeInfo?.splng),
            }}
            endPoint={{
              latitude: Number(routeInfo?.eplat),
              longitude: Number(routeInfo?.eplng),
            }}
            stopOverPoint={
              isHaveStopOverPlace
                ? {
                    latitude: Number(routeInfo?.soplat),
                    longitude: Number(routeInfo?.soplng),
                  }
                : undefined
            }
            onDurationDataReturn={duration => {
              setDurationValue(duration);
            }}
          />

          {/* Route info section */}
          <PaddingHorizontalWrapper
            containerStyles={{
              marginTop: heightScale1(30),
            }}
            forDriveMe>
            <View>
              <HStack style={{gap: widthScale1(10)}}>
                <RouteBadge type={routeInfo?.carInOut === 'in' ? 'WAY_WORK' : 'WAY_HOME'} />

                <CustomText
                  string={getRouteStateValue(routeInfo?.state ?? '')}
                  forDriveMe
                  family={FONT_FAMILY.SEMI_BOLD}
                  color={routeInfo?.selectDay ? colors.menuTextColor : colors.lineInput}
                />

                {routeInfo?.selectDay ? (
                  <Pressable
                    style={{
                      marginLeft: 'auto',
                    }}>
                    <Icons.Share />
                  </Pressable>
                ) : null}
              </HStack>

              {routeInfo?.selectDay ? (
                <CustomText
                  string={routeInfo?.selectDay ?? ''}
                  forDriveMe
                  family={FONT_FAMILY.SEMI_BOLD}
                  size={FONT.BODY}
                  textStyle={{
                    marginTop: heightScale1(10),
                    marginBottom: PADDING1,
                  }}
                />
              ) : null}

              <RoutePlanner
                timeStart={routeInfo?.startTime ?? ''}
                timeArrive={moment(routeInfo?.startTime, 'HH:mm')
                  .add(durationValue, 'minutes')
                  .format('HH:mm')}
                startAddress={routeInfo?.startPlace ?? ''}
                arriveAddress={routeInfo?.endPlace ?? ''}
                stopOverAddress={isHaveStopOverPlace ? routeInfo?.stopOverPlace : ''}
              />

              <HStack
                style={{
                  gap: widthScale1(6),
                  marginTop: heightScale1(30),
                  justifyContent: 'flex-end',
                }}>
                <InfoPriceRoute
                  price={routeInfo?.price ?? ''}
                  soPrice={isHaveStopOverPlace ? routeInfo?.soPrice : ''}
                  hideChevron
                />
              </HStack>
            </View>
          </PaddingHorizontalWrapper>

          <Divider style={styles.dividerStyle} />

          {/* Driver info section */}
          <PaddingHorizontalWrapper forDriveMe>
            <DriverSectionInfo
              carpoolCount={Number(routeInfo?.driverCnt ?? 0)}
              routeDetail={routeDetail}
              driverInfo={driverInfo}
            />
          </PaddingHorizontalWrapper>

          <Divider style={styles.dividerStyle} />

          <InfoCar
            carNumber={driverInfo?.carNumber ?? ''}
            vehicleModel={driverInfo?.carModel ?? ''}
            vehicleColor={driverInfo?.carColor ?? ''}
            vehicleYear={driverInfo?.carYear ?? ''}
            isLock={routeInfo?.selectDay ? false : true}
          />

          <Divider style={styles.dividerStyle} />

          {/* Driver style */}
          <PaddingHorizontalWrapper forDriveMe>
            <CustomText
              string="카풀 옵션"
              forDriveMe
              size={FONT.BODY}
              family={FONT_FAMILY.SEMI_BOLD}
            />
            <HStack
              style={{
                flexWrap: 'wrap',
                marginTop: PADDING1,
                gap: widthScale1(10),
              }}>
              {driverStyle.flatMap((item, index) => {
                if (item?.length > 0) {
                  return <CustomBoxSelectButton key={index} darkText text={item} />;
                }
              })}
            </HStack>
          </PaddingHorizontalWrapper>

          <Divider style={styles.dividerStyle} />

          <VehicleInformation
            carImages={[
              driverInfo?.carImageUrl ?? '',
              driverInfo?.carImageUrl2 ?? '',
              driverInfo?.carImageUrl3 ?? '',
              driverInfo?.carImageUrl4 ?? '',
            ]}
            isLock={routeInfo?.selectDay ? false : true}
          />

          <Divider style={styles.dividerStyle} />

          {/* Rating */}

          <PaddingHorizontalWrapper forDriveMe>
            <View style={styles.viewTop}>
              <RatingDisplay
                onPressText={() => {
                  navigation.navigate(ROUTE_KEY.DriverProfileEvaluationDetails, {
                    driverID: driverInfo?.memberId as number,
                    evaluationAvg: {
                      avg1: driverEvaluationAvg?.avg1 ?? '0',
                      avg2: driverEvaluationAvg?.avg2 ?? '0',
                      avg3: driverEvaluationAvg?.avg3 ?? '0',
                    },
                  });
                }}
                text={'상세후기보기'}
                rating={
                  (Number(driverEvaluationAvg?.avg1 ?? 0) +
                    Number(driverEvaluationAvg?.avg2 ?? 0) +
                    Number(driverEvaluationAvg?.avg3 ?? 0)) /
                  3
                }
              />

              <View style={{gap: heightScale1(10)}}>
                <RenderProgress
                  text={'친절해요'}
                  star={Number(driverEvaluationAvg?.avg1 ?? 0).toFixed(1)}
                />
                <RenderProgress
                  text={'차안이 청결해요'}
                  star={Number(driverEvaluationAvg?.avg2 ?? 0).toFixed(1)}
                />
                <RenderProgress
                  text={'시간을 잘지켜요'}
                  star={Number(driverEvaluationAvg?.avg3 ?? 0).toFixed(1)}
                />
              </View>
            </View>
          </PaddingHorizontalWrapper>
        </Animated.ScrollView>

        {routeInfo?.c_memberId === userID || viewMode ? null : (
          <PaddingHorizontalWrapper forDriveMe>
            <CustomButton
              text={routeInfo?.selectDay ? '카풀 요청하기' : '경로등록 요청하기'}
              onPress={handleRequest}
              buttonStyle={styles.submitButtonStyle}
              buttonHeight={58}
            />
          </PaddingHorizontalWrapper>
        )}

        <SelectRequestPathModal onSubmit={onChoosedPrice} ref={selectPathRef} />

        <DayPickerModal
          onlyTwoWeeks
          showResetButton
          onSubmitPress={value => {}}
          onPressRouteRequest={async value => {
            blockDayCarpoolDriver({
              carInOut: routeInfo?.carInOut === 'in' ? 'in' : 'out',
              d_memberId: routeInfo?.c_memberId?.toString() || routeInfo?.memberId?.toString(),
              selectDay: value?.dateString?.split('-').join(''),
            })
              .unwrap()
              .then(res => {
                if (res?.length > 0) {
                  ToastMessageController.show(
                    '선택한 일자에 이미 해당 드라이버가\n카풀 예약을 완료한 상태입니다.\n다른 일자를 선택해주세요',
                  );
                  return;
                }

                if (value?.dateString) {
                  const isToday = moment().format('YYYY-MM-DD') === value?.dateString;
                  const currentTime = moment().hour();

                  if (
                    isToday &&
                    ((routeInfo?.carInOut === 'in' && currentTime >= 9) ||
                      (routeInfo?.carInOut === 'out' && currentTime >= 20))
                  ) {
                    ToastMessageController.show(
                      '카풀 요청 시간을 지났습니다. 다음 날짜로 요청해주세요.',
                    );
                    return;
                  }

                  setSelectedDay(
                    `${moment(value?.dateString, 'YYYY-MM-DD').format('YYYY.MM.DD')}(${getDayName(
                      moment(value?.dateString, 'YYYY-MM-DD').valueOf(),
                    )})`,
                  );

                  dayPickerRef.current?.hide();

                  if (routeInfo?.soPrice && routeInfo?.stopOverPlace) {
                    selectPathRef?.current?.show(routeInfo?.soPrice || '', routeInfo?.price || '');
                  } else {
                    onHandleRequest(
                      'E',
                      `${moment(value?.dateString, 'YYYY-MM-DD').format('YYYY.MM.DD')}(${getDayName(
                        moment(value?.dateString, 'YYYY-MM-DD').valueOf(),
                      )})`,
                    );
                  }
                }
              });
          }}
          ref={dayPickerRef}
        />
        <ToastMessage containerStyle={{bottom: '50%'}} />
      </FixedContainer>
    );
  },
);

export default RouteRequestRegistrationDetail;

const styles = StyleSheet.create({
  mapStyle: {
    height: heightScale1(420),
  },
  submitButtonStyle: {
    marginBottom: PADDING1 / 2,
    marginTop: heightScale1(10),
  },
  dividerStyle: {
    marginVertical: heightScale1(30),
  },
  content: {
    marginTop: PADDING1,
    marginBottom: heightScale1(30),
  },
  viewTop: {
    backgroundColor: colors.evaluateBackground,
    padding: widthScale1(22),
    borderRadius: scale1(8),
    marginBottom: heightScale1(32),
    gap: PADDING1,
  },
});
