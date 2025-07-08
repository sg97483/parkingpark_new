import {useBottomSheetModal} from '@gorhom/bottom-sheet';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {DateData} from 'react-native-calendars';
import {showMessage} from 'react-native-flash-message';
import CustomButton from '~components/commons/custom-button';
import DayPickerModal, {DayPickerModalRefs} from '~components/commons/day-picker-modal';
import InfoPriceRoute from '~components/commons/info-price-route';
import RouteBadge from '~components/commons/route-badge';
import SelectRequestPathModal, {
  SelectRequestPathModalRefs,
} from '~components/commons/select-request-path-model';
import CustomHeader from '~components/custom-header';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import LoadingComponent from '~components/loading-component';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import Spinner from '~components/spinner';
import {PADDING1} from '~constants/constant';
import {AUTO_MESSAGE_TYPE} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {DriverRoadDayModel} from '~model/driver-model';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {
  useCreatePaymentHistoryMutation,
  useGetMyDriverRoadQuery,
  useLazyBlockRoadDriverDayQuery,
  useRequestNewCarpoolMutation,
} from '~services/carpoolServices';
import {useReadDriverRoadInfoListQuery} from '~services/driverServices';
import {useGetDrivingDirectionQuery} from '~services/naverMapServices';
import {useSendFCMNotiMutation} from '~services/notiServices';
import {getRealm} from '~services/realm';
import {useLazyReadMyDriverQuery} from '~services/userServices';
import {dayjs} from '~utils/dayjsUtil';
import {createNewChatRoom, handleSendAutomaticMessage} from '~utils/firebaseChatUtils';
import {getDayName} from '~utils/hourUtils';

const RepresentativeRouteOfDriver = memo(
  (props: RootStackScreenProps<'RepresentativeRouteOfDriver'>) => {
    const {route, navigation} = props;
    const {driverID} = route?.params;
    const selectPathRef = useRef<SelectRequestPathModalRefs>(null);
    const dayPickerRef = useRef<DayPickerModalRefs>(null);
    const {userID, user: userInfo} = userHook();
    const {dismissAll} = useBottomSheetModal();
    const myUID = auth().currentUser?.uid;

    const [cMemberID, setCMemberID] = useState<number | null>(null);
    const [selectedDay, setSelectedDay] = useState<DateData | undefined>(undefined);
    const [carInOut, setCarInOut] = useState<string>('');

    const [readMyDriver, {isLoading}] = useLazyReadMyDriverQuery();
    const [passengerRequestCarpool] = useRequestNewCarpoolMutation();
    const [createPaymentHistory] = useCreatePaymentHistoryMutation();
    const [sendFCM] = useSendFCMNotiMutation();
    const {data: listRoadRegisteredOfDriver} = useReadDriverRoadInfoListQuery({
      c_memberId: driverID,
    });
    const [blockDayCarpoolDriver] = useLazyBlockRoadDriverDayQuery();

    const specMinDate = useMemo(() => {
      const currentHour = dayjs().hour();
      switch (carInOut) {
        case 'in':
          return currentHour >= 9
            ? dayjs().add(1, 'days').format('YYYY-MM-DD')
            : dayjs().format('YYYY-MM-DD');

        case 'out':
          return currentHour >= 20
            ? dayjs().add(1, 'days').format('YYYY-MM-DD')
            : dayjs().format('YYYY-MM-DD');

        default:
          return dayjs().format('YYYY-MM-DD');
      }
    }, [carInOut]);

    useEffect(() => {
      readMyDriver({
        memberId: driverID.toString(),
      })
        .unwrap()
        .then(res => {
          if (res?.c_memberId) {
            setCMemberID(res?.c_memberId);
          }
        });
    }, []);

    const {data, isFetching} = useGetMyDriverRoadQuery(
      {
        memberId: driverID,
        id: cMemberID as number,
      },
      {skip: !cMemberID},
    );

    const isHaveStopOverPlaceIn = useMemo(
      () =>
        data?.stopOverPlaceIn &&
        data?.soPriceIn &&
        data?.soPriceIn !== '0' &&
        data?.soplatIn &&
        data?.soplngIn
          ? true
          : false,
      [data],
    );

    const isHaveStopOverPlaceOut = useMemo(
      () =>
        data?.stopOverPlaceOut &&
        data?.soPriceOut &&
        data?.soPriceOut !== '0' &&
        data?.soplatOut &&
        data?.soplngOut
          ? true
          : false,
      [data],
    );

    const {data: directionIn} = useGetDrivingDirectionQuery(
      {
        start: `${data?.splngIn},${data?.splatIn}`,
        end: `${data?.eplngIn},${data?.eplatIn}`,
        waypoints: isHaveStopOverPlaceIn ? `${data?.soplngIn},${data?.soplatIn}` : '',
      },
      {skip: !data},
    );

    const {data: directionOut} = useGetDrivingDirectionQuery(
      {
        start: `${data?.splngOut},${data?.splatOut}`,
        end: `${data?.eplngOut},${data?.eplatOut}`,
        waypoints: isHaveStopOverPlaceOut ? `${data?.soplngOut},${data?.soplatOut}` : '',
      },
      {skip: !data},
    );

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
        isRequestedBy: 'PASSENGER',
        cDayId: null,
        temptRoute: res.temptRoute,
      } as any;

      navigation.push(ROUTE_KEY.ChatDetail, {
        currentChatRoomInfo: {...chatRoomData},
      });
    };

    const handleRequestPath = (selectedPath: 'M' | 'E', day?: DateData | undefined) => {
      const formatedDay = (): string => {
        if (day) {
          return (
            moment(day?.dateString, 'YYYY-MM-DD').format('YYYY.MM.DD') +
            `(${getDayName(moment(day?.dateString, 'YYYY-MM-DD').valueOf())})`
          );
        }

        if (selectedDay) {
          return (
            moment(selectedDay?.dateString, 'YYYY-MM-DD').format('YYYY.MM.DD') +
            `(${getDayName(moment(selectedDay?.dateString, 'YYYY-MM-DD').valueOf())})`
          );
        }

        return '';
      };

      const temptRoute = (): DriverRoadDayModel | null => {
        switch (carInOut) {
          case 'in':
            return {
              c_memberId: driverID,
              carInOut: 'in',
              email: data?.email ?? '',
              startPlace: data?.startPlaceIn ?? '',
              endPlace: data?.endPlaceIn ?? '',
              stopOverPlace: data?.stopOverPlaceIn,
              memberId: driverID,
              selectDay: formatedDay(),
              startTime: data?.startTimeIn ?? '',
              splat: data?.splatIn ?? 0,
              splng: data?.splngIn ?? 0,
              eplat: data?.eplatIn ?? 0,
              eplng: data?.eplngIn ?? 0,
              soplat: data?.soplatIn ?? 0,
              soplng: data?.soplngIn ?? 0,
              price: data?.priceIn.toString() ?? '0',
              soPrice: data?.soPriceIn ?? '',
            } as DriverRoadDayModel;

          case 'out':
            return {
              c_memberId: driverID,
              carInOut: 'out',
              email: data?.email ?? '',
              startPlace: data?.startPlaceOut ?? '',
              endPlace: data?.endPlaceOut ?? '',
              stopOverPlace: data?.stopOverPlaceOut ?? '',
              memberId: driverID,
              selectDay: formatedDay(),
              startTime: data?.startTimeOut ?? '',
              splat: data?.splatOut ?? 0,
              splng: data?.splngOut ?? 0,
              eplat: data?.eplatOut ?? 0,
              eplng: data?.eplngOut ?? 0,
              soplat: data?.soplatOut ?? 0,
              soplng: data?.soplngOut ?? 0,
              price: data?.priceOut ?? '',
              soPrice: data?.soPriceOut ?? '',
            } as DriverRoadDayModel;

          default:
            return null;
        }
      };

      Spinner.show();

      createNewChatRoom({
        cDayId: '' as any,
        driverID: driverID,
        myUID: myUID ?? '',
        otherEmail: data?.email ?? '',
        passengerID: userID ?? 0,
        temptRoute: temptRoute(),
        selectedPrice: selectedPath,
      })
        .then(res => {
          if (res?.isExisted) {
            openChatRoom(res);
            return;
          }
          // Create payment history
          createPaymentHistory({
            chatId: res?.roomID,
            d_memberId: driverID,
            r_memberId: userID,
            roadInfoId: '' as any,
          })
            .unwrap()
            .then(data => {
              passengerRequestCarpool({
                c_dayId: '' as any,
                chatId: res?.roomID,
                driverId: driverID,
                passengerId: userID ?? 0,
                priceSelect: selectedPath,
                selectDay: formatedDay(),
                resId: data?.[0]?.resId,
                isRouteRegistered: false,
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
                        .then(user => {
                          sendFCM({
                            userToken: user?.data()?.token || '',
                            title: '드라이버님의 운행경로 운행을 요청하였습니다.',
                            body: '운행 등록하고 카풀을 시작해보세요!',
                            data: {
                              chatRoomData: JSON.stringify({
                                roomID: res?.roomID,
                                unreadCount: 0,
                                userCount: 2,
                                driverID: res?.driverID,
                                passengerID: res?.passengerID,
                                resId: data?.[0]?.resId,
                                lastDatetime: dayjs().format('YYYY.MM.DD HH:mm'),
                                isRequestedBy: 'PASSENGER',
                                cDayId: '',
                                otherUID: driverID,
                                temptRoute: temptRoute(),
                              } as any),
                            },
                          }).then(() => {
                            handleSendAutomaticMessage({
                              roomID: res?.roomID,
                              type: AUTO_MESSAGE_TYPE.PASSENGER_CARPOOL_REQUEST,
                              passengerName: userInfo?.nic ?? '',
                            });
                          });
                        });
                      openChatRoom({
                        ...res,
                        resId: data?.[0]?.resId,
                        isRequestedBy: 'PASSENGER',
                        otherUID: driverID,
                        temptRoute: temptRoute(),
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
          Spinner.hide();
        });
    };

    return (
      <FixedContainer>
        <CustomHeader text="기본 등록경로" />

        {isLoading || isFetching ? (
          <LoadingComponent />
        ) : (
          <ScrollView
            contentContainerStyle={styles.containerStyle}
            showsVerticalScrollIndicator={false}>
            {/* Way to work */}
            <PaddingHorizontalWrapper containerStyles={{gap: PADDING1}} forDriveMe>
              <HStack>
                <RouteBadge />
              </HStack>

              <RoutePlanner
                startAddress={data?.startPlaceIn ?? ''}
                arriveAddress={data?.endPlaceIn ?? ''}
                stopOverAddress={isHaveStopOverPlaceIn ? data?.stopOverPlaceIn : ''}
                timeStart={data?.startTimeIn ?? ''}
                timeArrive={moment(data?.startTimeIn, 'HH:mm')
                  .add(directionIn?.duration, 'minutes')
                  .format('HH:mm')}
              />

              <InfoPriceRoute
                price={data?.priceIn ?? ''}
                soPrice={isHaveStopOverPlaceIn ? data?.soPriceIn : ''}
                hideChevron
              />

              {driverID === userID ? null : (
                <CustomButton
                  onPress={() => {
                    setCarInOut('in');
                    dayPickerRef?.current?.show(selectedDay);
                  }}
                  type="TERTIARY"
                  outLine
                  text="출근길 운행 요청"
                  buttonHeight={58}
                />
              )}
            </PaddingHorizontalWrapper>

            <Divider insetsVertical={30} />

            {/* Way to home */}
            <PaddingHorizontalWrapper containerStyles={{gap: PADDING1}} forDriveMe>
              <HStack>
                <RouteBadge type="WAY_HOME" />
              </HStack>

              <RoutePlanner
                startAddress={data?.startPlaceOut ?? ''}
                arriveAddress={data?.endPlaceOut ?? ''}
                stopOverAddress={isHaveStopOverPlaceOut ? data?.stopOverPlaceOut : ''}
                timeStart={data?.startTimeOut ?? ''}
                timeArrive={moment(data?.startTimeOut, 'HH:mm')
                  .add(directionOut?.duration, 'minutes')
                  .format('HH:mm')}
              />

              <InfoPriceRoute
                price={data?.priceOut ?? ''}
                soPrice={isHaveStopOverPlaceOut ? data?.soPriceOut : ''}
                hideChevron
              />

              {driverID === userID ? null : (
                <CustomButton
                  onPress={() => {
                    setCarInOut('out');
                    dayPickerRef?.current?.show(selectedDay);
                  }}
                  type="TERTIARY"
                  outLine
                  text="퇴근길 운행 요청"
                  buttonHeight={58}
                />
              )}
            </PaddingHorizontalWrapper>
          </ScrollView>
        )}

        <SelectRequestPathModal
          onSubmit={value => {
            dismissAll();
            handleRequestPath(value);
          }}
          ref={selectPathRef}
        />

        <DayPickerModal
          ref={dayPickerRef}
          onlyTwoWeeks
          specMinDate={specMinDate}
          onSubmitPress={async value => {
            blockDayCarpoolDriver({
              carInOut: carInOut,
              d_memberId: driverID.toString(),
              selectDay: value?.dateString?.split('-').join(''),
            })
              .unwrap()
              .then(res => {
                if (res?.length > 0) {
                  showMessage({
                    message:
                      '선택한 일자에 이미 해당 드라이버가\n카풀 예약을 완료한 상태입니다.\n다른 일자를 선택해주세요',
                  });
                  return;
                }
                if (value?.dateString) {
                  setSelectedDay(() => value);
                  if (carInOut === 'in') {
                    if (!isHaveStopOverPlaceIn) {
                      handleRequestPath('E', value);
                    } else {
                      selectPathRef?.current?.show(data?.soPriceIn ?? '', data?.priceIn ?? '');
                    }
                  }
                  if (carInOut === 'out') {
                    if (!isHaveStopOverPlaceOut) {
                      handleRequestPath('E', value);
                    } else {
                      selectPathRef?.current?.show(data?.soPriceOut ?? '', data?.priceOut ?? '');
                    }
                  }
                } else {
                  showMessage({
                    message: '날짜를 선택하여 카풀을 등록해주세요.',
                  });
                }
              });
          }}
        />
      </FixedContainer>
    );
  },
);

export default RepresentativeRouteOfDriver;

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: PADDING1,
  },
});
