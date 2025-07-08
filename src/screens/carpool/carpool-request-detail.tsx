import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {memo, useCallback, useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Animated, {useSharedValue} from 'react-native-reanimated';
import {Icons} from '~/assets/svgs';
import AnimatedHeader from '~components/commons/animated-header';
import Avatar from '~components/commons/avatar';
import CustomButton from '~components/commons/custom-button';
import InfoPriceRoute from '~components/commons/info-price-route';
import MapDirectionView from '~components/commons/map-direction-view';
import RouteBadge from '~components/commons/route-badge';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import LoadingComponent from '~components/loading-component';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import Spinner from '~components/spinner';
import {PADDING1} from '~constants/constant';
import {AUTO_MESSAGE_TYPE, FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {
  useAddFavoritePassengerMutation,
  useCreatePaymentHistoryMutation,
  useGetFavoritePassengerListQuery,
  useReadMyCarpoolInfoQuery,
  useRemoveFavoritePassengerMutation,
  useRequestNewCarpoolMutation,
} from '~services/carpoolServices';
import {useReadDriverRoadInfoListQuery} from '~services/driverServices';
import {useSendFCMNotiMutation} from '~services/notiServices';
import {getRealm} from '~services/realm';
import {useReadMyDriverQuery} from '~services/userServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {dayjs} from '~utils/dayjsUtil';
import {createNewChatRoom, handleSendAutomaticMessage} from '~utils/firebaseChatUtils';
import {getRouteStateValue} from '~utils/getRouteStateValue';

const CarpoolRequestDetail = memo((props: RootStackScreenProps<'CarpoolRequestDetail'>) => {
  const {navigation, route} = props;
  const {item} = route?.params;

  const myUID = auth().currentUser?.uid;
  const passengerID = useMemo(() => item?.c_memberId, [item?.c_memberId]);
  const {userID, user: userInfo} = userHook();
  const scrollYValue = useSharedValue(0);

  const {data: myRoadRegisterd, isFetching} = useReadDriverRoadInfoListQuery(
    {
      c_memberId: userID,
    },
    {skip: !userID},
  );

  const isAlreadyHaveAReservation = useMemo(
    () =>
      myRoadRegisterd?.find(
        it =>
          it?.selectDay === item?.selectDay &&
          it?.carInOut === item?.carInOut &&
          it?.state !== 'N' &&
          it?.state !== 'C',
      ),
    [myRoadRegisterd],
  );

  const {data: passengerInfo} = useReadMyDriverQuery(
    {
      memberId: passengerID?.toString(),
    },
    {skip: !passengerID},
  );

  const {data: dataCarpool} = useReadMyCarpoolInfoQuery({
    memberId: passengerInfo?.memberId as number,
  });
  const authPassenger = useMemo(
    () =>
      !!dataCarpool?.jobType &&
      !!dataCarpool?.job &&
      !!dataCarpool?.coName &&
      !!dataCarpool?.coAddress,
    [dataCarpool],
  );

  const {data: listFavoritePassenger, refetch} = useGetFavoritePassengerListQuery(
    {
      memberId: userID as number,
    },
    {skip: !userID},
  );
  const [addFavoritePassenger] = useAddFavoritePassengerMutation();
  const [removeFavoritePassenger] = useRemoveFavoritePassengerMutation();
  const [createPaymentHistory] = useCreatePaymentHistoryMutation();
  const [driverRequestCarpool] = useRequestNewCarpoolMutation();
  const [sendFCM] = useSendFCMNotiMutation();

  const isFavoritePassenger = useMemo(
    () => listFavoritePassenger?.find(item => item?.riderId === passengerID)?.favStatus === 'Y',
    [passengerID, listFavoritePassenger],
  );

  const handleFavoritePassenger = useCallback(() => {
    Spinner.show();

    if (isFavoritePassenger) {
      removeFavoritePassenger({
        memberId: userID as number,
        riderId: passengerID as number,
      })
        .unwrap()
        .then(res => {
          if (res !== '200') {
            showMessage({
              message: strings.general_text?.please_try_again,
            });
            return;
          }
          refetch();
          Spinner.hide();
        });
    } else {
      addFavoritePassenger({
        memberId: userID as number,
        riderId: passengerID as number,
      })
        .unwrap()
        .then(res => {
          if (res !== '200') {
            showMessage({
              message: strings.general_text?.please_try_again,
            });
            return;
          }
          refetch();
          Spinner.hide();
        });
    }
  }, [listFavoritePassenger, refetch]);

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
      isRequestedBy: 'DRIVER',
      cDayId: '',
      temptRoute: res.temptRoute,
    } as any;

    navigation.push(ROUTE_KEY.ChatDetail, {
      currentChatRoomInfo: {...chatRoomData},
    });
  };

  const handleDriverRequestCarpool = useCallback(() => {
    if (isAlreadyHaveAReservation) {
      showMessage({
        message: '해당 일자에 카풀 예약이 완료되었습니다.\n다른 날짜로 카풀 요청을 확인해보세요.',
      });
      return;
    }

    Spinner.show();

    createNewChatRoom({
      driverID: userID || 0,
      myUID: myUID || '',
      otherEmail: item?.email || '',
      passengerID: item?.c_memberId || 0,
      cDayId: '' as any,
      temptRoute: item,
      routeRegisterByPassengerID: item?.id,
      selectedPrice: null,
    })
      .then(res => {
        if (res?.isExisted) {
          openChatRoom(res);
          return;
        }
        createPaymentHistory({
          chatId: res?.roomID,
          d_memberId: userID,
          r_memberId: item?.c_memberId,
          roadInfoId: '' as any,
        })
          .unwrap()
          .then(async data => {
            driverRequestCarpool({
              c_dayId: '' as any,
              chatId: res?.roomID,
              driverId: userID ?? 0,
              isRouteRegistered: false,
              passengerId: item?.c_memberId ?? 0,
              priceSelect: 'E',
              resId: data?.[0]?.resId,
              selectDay: item?.selectDay,
              requestBy: 'DRIVER',
            })
              .unwrap()
              .then(() => {
                firestore()
                  .collection('rooms')
                  .doc(res?.roomID)
                  .update({
                    resId: data?.[0]?.resId,
                    isRequestedBy: 'DRIVER',
                  })
                  .then(() => {
                    const passengerID = Object.keys(res?.users).find(it => it !== myUID);
                    firestore()
                      .collection('users')
                      .doc(passengerID)
                      .get()
                      .then(user => {
                        sendFCM({
                          userToken: user?.data()?.token || '',
                          title: `${userInfo?.nic ?? ''} 드라이버님이 카풀요청에 응답하셨습니다.`,
                          body: '채팅을 통해 카풀을 예약해보세요.',
                          data: {
                            chatRoomData: JSON.stringify({
                              roomID: res?.roomID,
                              unreadCount: 0,
                              userCount: 2,
                              driverID: res?.driverID,
                              passengerID: res?.passengerID,
                              resId: data?.[0]?.resId,
                              lastDatetime: dayjs().format('YYYY.MM.DD HH:mm'),
                              isRequestedBy: 'DRIVER',
                              cDayId: '',
                              otherUID: passengerID,
                              temptRoute: item,
                            } as any),
                          },
                        }).then(() => {
                          handleSendAutomaticMessage({
                            roomID: res?.roomID,
                            type: AUTO_MESSAGE_TYPE.DRIVER_REPLY,
                            driverName: userInfo?.nic ?? '',
                          });
                        });
                      });
                    openChatRoom({
                      ...res,
                      resId: data?.[0]?.resId,
                      isRequestedBy: 'DRIVER',
                      otherUID: passengerID,
                      temptRoute: item,
                    });
                  })
                  .catch(error => {
                    console.log('🚀 ~ onHandleRequest ~ error 239:', error);
                  });
              });
          })
          .catch(error => {
            console.log('🚀 ~ onHandleRequest ~ error 244:', error);
          })
          .finally(() => {
            Spinner.hide();
          });
      })
      .finally(() => {
        Spinner.hide();
      });
  }, [userID, item, myUID, isAlreadyHaveAReservation]);

  if (isFetching) {
    return <LoadingComponent />;
  }

  return (
    <FixedContainer edges={['bottom']}>
      <AnimatedHeader title="경로 상세보기" scrollYValue={scrollYValue} />

      <Animated.ScrollView
        contentContainerStyle={{
          paddingBottom: heightScale1(58),
        }}
        showsVerticalScrollIndicator={false}
        onScroll={e => {
          scrollYValue.value = e?.nativeEvent?.contentOffset?.y;
        }}
        bounces={false}>
        <MapDirectionView
          startPoint={{
            longitude: item.splng,
            latitude: item?.splat,
          }}
          endPoint={{
            latitude: item?.eplat,
            longitude: item?.eplng,
          }}
        />

        {/* Route info section */}
        <PaddingHorizontalWrapper containerStyles={styles.routeInfoStyle} forDriveMe>
          <View style={{gap: heightScale1(4)}}>
            <HStack style={{gap: widthScale1(10)}}>
              <RouteBadge type={item?.carInOut === 'in' ? 'WAY_WORK' : 'WAY_HOME'} />
              <CustomText
                forDriveMe
                string={getRouteStateValue(item?.state)}
                family={FONT_FAMILY.SEMI_BOLD}
                size={FONT.CAPTION_7}
                color={colors.heavyGray}
              />
            </HStack>
            <CustomText
              forDriveMe
              string={item?.selectDay}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.BODY}
              lineHeight={heightScale1(25)}
            />
          </View>
          <RoutePlanner
            timeStart={item?.startTime}
            timeArrive={item?.endTime}
            startAddress={item?.startPlace}
            arriveAddress={item?.endPlace}
          />
          <InfoPriceRoute price={item?.price} hideChevron />
        </PaddingHorizontalWrapper>

        <Divider insetsVertical={30} />

        {/* Passenger profile section */}
        <PaddingHorizontalWrapper forDriveMe>
          <View style={styles.profileSectionStyle}>
            <Pressable
              onPress={() =>
                navigation.navigate(ROUTE_KEY.PassengerProfile, {
                  passengerID: item?.c_memberId,
                  passengerName: item?.nic,
                })
              }>
              <HStack style={{gap: widthScale1(6)}}>
                <Avatar uri={item?.profileImageUrl} size={40} />
                <View style={{flex: 1, gap: heightScale1(2)}}>
                  <HStack style={{gap: widthScale1(4)}}>
                    <CustomText
                      forDriveMe
                      numberOfLines={1}
                      family={FONT_FAMILY.MEDIUM}
                      size={FONT.SUB_HEAD}
                      string={`${item?.nic}`}
                      textStyle={{
                        maxWidth: widthScale1(80),
                      }}
                    />
                    <CustomText
                      forDriveMe
                      string="탑승객님"
                      family={FONT_FAMILY.MEDIUM}
                      size={FONT.SUB_HEAD}
                    />
                    {authPassenger ? <Icons.VerifivationMarkText /> : null}
                  </HStack>
                  <CustomText
                    forDriveMe
                    size={FONT.CAPTION}
                    family={FONT_FAMILY.MEDIUM}
                    color={colors.lineCancel}
                    string={`총 카풀횟수 ${item?.driverCnt ?? 0}회`}
                  />
                </View>
                <Pressable onPress={handleFavoritePassenger} hitSlop={40}>
                  {isFavoritePassenger ? <Icons.StarFill width={25} height={24} /> : <Icons.Star />}
                </Pressable>
              </HStack>
            </Pressable>

            <View style={{gap: heightScale1(10)}}>
              <CustomText
                color={colors.black}
                string="코멘트"
                forDriveMe
                family={FONT_FAMILY.MEDIUM}
              />
              <View style={styles.introduceStyle}>
                <CustomText
                  lineHeight={20}
                  forDriveMe
                  family={FONT_FAMILY.MEDIUM}
                  string={item?.introduce || '등록한 코멘트가 없습니다.'}
                  color={item?.introduce ? colors.menuTextColor : colors.grayText}
                />
              </View>
            </View>

            {authPassenger ? (
              <View style={{gap: heightScale1(10)}}>
                <HStack style={{gap: widthScale1(4)}}>
                  <Icons.Check width={widthScale1(24)} height={widthScale1(24)} />
                  <CustomText
                    color={colors.black}
                    forDriveMe
                    family={FONT_FAMILY.MEDIUM}
                    string={'명함 및 백신 인증완료'}
                  />
                </HStack>
              </View>
            ) : null}
          </View>
        </PaddingHorizontalWrapper>
      </Animated.ScrollView>

      {userID !== item?.c_memberId && (
        <PaddingHorizontalWrapper forDriveMe>
          <CustomButton
            text="요청 응답하기"
            buttonHeight={58}
            buttonStyle={styles.submitButtonStyle}
            onPress={handleDriverRequestCarpool}
          />
        </PaddingHorizontalWrapper>
      )}
    </FixedContainer>
  );
});

export default CarpoolRequestDetail;

const styles = StyleSheet.create({
  routeInfoStyle: {
    marginTop: PADDING1,
    gap: PADDING1,
  },
  profileSectionStyle: {
    padding: PADDING1,
    borderRadius: scale1(8),
    backgroundColor: colors.policy,
    gap: PADDING1,
  },
  submitButtonStyle: {
    marginTop: heightScale1(10),
    marginBottom: PADDING1 / 2,
  },
  introduceStyle: {
    paddingHorizontal: widthScale1(16),
    paddingVertical: heightScale1(15),
    borderWidth: 1,
    borderRadius: scale1(8),
    minHeight: heightScale1(110),
    borderColor: colors.disableButton,
  },
});
