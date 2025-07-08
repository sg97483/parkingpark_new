import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {activateKeepAwake, deactivateKeepAwake} from '@sayem314/react-native-keep-awake';
import moment from 'moment';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StatusBar, StyleSheet, TouchableHighlight, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icons} from '~/assets/svgs';
import CustomButton from '~components/commons/custom-button';
import IconButton from '~components/commons/icon-button';
import MapDirectionView from '~components/commons/map-direction-view';
import NavigationSelectionModal, {
  NavigationSelectionModalRefs,
} from '~components/commons/navigation-selection';
import CustomText from '~components/custom-text';
import MessageOfRelief, {MessageOfReliefRefs} from '~components/running/message-of-relief';
import {PADDING1} from '~constants/constant';
import {AUTO_MESSAGE_TYPE, FONT_FAMILY} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useReadMyDriverQuery} from '~services/carpoolServices';
import {
  useLazyReadDriverRoadInfoListQuery,
  useLazyUpdateEstPriceQuery,
  useUpdateEndTimeForReservationMutation,
} from '~services/driverServices';
import {useSendFCMNotiMutation} from '~services/notiServices';
import {
  useUpdateRequestStateCheckMutation,
  useUpdateRoadDayStateCheckMutation,
} from '~services/passengerServices';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {handleSendAutomaticMessage} from '~utils/firebaseChatUtils';

const DriverRunning = (props: RootStackScreenProps<'DriverRunning'>) => {
  const {navigation, route} = props;
  const {item} = route?.params;
  console.log('🚀 ~ DriverRunning ~ item:', item);
  const messageOfReliefRef = useRef<MessageOfReliefRefs>(null);
  const navigationRef = useRef<NavigationSelectionModalRefs>(null);
  const insets = useSafeAreaInsets();
  const chatID = useMemo(() => item?.chatId, [item?.chatId]);
  const my_uid = auth().currentUser?.uid;
  const {userID, myDriverInfo} = userHook();

  const [updatePaymentHistory, {isLoading}] = useUpdateRequestStateCheckMutation();
  const [readDriverRoadInfoList] = useLazyReadDriverRoadInfoListQuery();
  const [updateRoadDayState] = useUpdateRoadDayStateCheckMutation();
  const [sendFCM] = useSendFCMNotiMutation();
  const [updateEndTimeForReservation] = useUpdateEndTimeForReservationMutation();
  const [updateEstPrice] = useLazyUpdateEstPriceQuery();
  const [passengerFCMToken, setPassengerFCMToken] = useState<string>('');

  const {data: passengerInfo} = useReadMyDriverQuery(
    {memberId: item?.r_memberId},
    {skip: !item?.r_memberId}, // r_memberId가 없을 경우 skip
  );

  const {data: driverInfo} = useReadMyDriverQuery(
    {memberId: item?.d_memberId},
    {skip: !item?.d_memberId}, // d_memberId가 없을 경우 skip
  );

  const paymentPrice = useMemo(() => {
    return Number(item?.amt) === Number(item?.soPrice) ? item?.soPrice : item?.price;
  }, [item]);

  const estPrice = useMemo(() => {
    if (myDriverInfo?.calYN === 'M') {
      const price = Number(paymentPrice) - Number(paymentPrice) * 0.25;
      return price;
    }
    const price = Number(paymentPrice) - Number(paymentPrice) * 0.2;
    return price;
  }, [myDriverInfo, paymentPrice]);

  useEffect(() => {
    if (chatID && my_uid) {
      // chatID와 my_uid가 유효한 경우에만 실행
      const roomRef = firestore().collection('rooms').doc(chatID);
      const unsubscribe = roomRef.onSnapshot(
        value => {
          // onSnapshot으로 실시간 변경 감지
          const users = value?.data()?.users;
          if (users) {
            const otherUID = Object.keys(users).find(it => it !== my_uid);
            if (otherUID) {
              firestore()
                .collection('users')
                .doc(otherUID)
                .get()
                .then(user => {
                  if (user.exists && !user.metadata.hasPendingWrites) {
                    // user.exists 추가
                    setPassengerFCMToken(user?.data()?.token || '');
                  }
                })
                .catch(console.error); // 에러 처리 추가
            }
          }
        },
        error => {
          // onSnapshot 에러 처리
          console.error('Error fetching room snapshot: ', error);
        },
      );
      return () => unsubscribe(); // 컴포넌트 언마운트 시 리스너 정리
    }
  }, [chatID, my_uid]);

  useEffect(() => {
    activateKeepAwake();
    return () => {
      deactivateKeepAwake();
    };
  }, []);

  const handleCompleteReservation = useCallback(() => {
    if (!item?.id || !item?.roadInfoId || !userID || !passengerFCMToken || !chatID) {
      console.error('Required information for completing reservation is missing.');
      // 사용자에게 알림 등을 통해 피드백 제공 가능
      return;
    }
    updatePaymentHistory({
      resId: item.id,
      rStatusCheck: 'E',
    })
      .unwrap() // unwrap 추가
      .then(async () => {
        await Promise.all([
          // await 추가하여 모든 작업이 완료될 때까지 기다리도록
          updateEndTimeForReservation({
            id: item.id,
            endTime: moment().format('HH:mm'),
          }).unwrap(),
          updateRoadDayState({
            roadInfoId: item.roadInfoId,
            state: 'E',
          }).unwrap(),
          updateEstPrice({
            id: item.roadInfoId,
            estPrice: estPrice,
          })
            .unwrap()
            .then(res => {
              console.log('🚀 ~ .then ~ res:', res);
            }),
          readDriverRoadInfoList({
            // 데이터 다시 불러오기
            c_memberId: userID,
          }).unwrap(),
          sendFCM({
            userToken: passengerFCMToken,
            title: '카풀 운행이 완료되었습니다.',
            body: '더 나은 서비스를 위해 드라이버에 대한 평가를 남겨주세요.',
            data: {
              type: AUTO_MESSAGE_TYPE.CARPOOL_COMPLETED,
              driverId: item.d_memberId,
              resId: item.id,
            },
          }).unwrap(),
        ]);

        handleSendAutomaticMessage({
          // 모든 Promise가 완료된 후 메시지 전송
          roomID: chatID,
          type: AUTO_MESSAGE_TYPE.CARPOOL_COMPLETED,
        });
      })
      .catch(error => {
        // 에러 처리 추가
        console.error('Error completing reservation: ', error);
        // 사용자에게 에러 알림 등
      })
      .finally(() => {
        navigation.navigate(ROUTE_KEY.ParkingParkHome, {selectedTab: 1});
      });
  }, [
    item,
    navigation,
    chatID,
    passengerFCMToken,
    updatePaymentHistory,
    updateEndTimeForReservation,
    updateRoadDayState,
    updateEstPrice,
    estPrice,
    readDriverRoadInfoList,
    userID,
    sendFCM,
  ]);

  return (
    <View style={styles.containerStyle}>
      <StatusBar backgroundColor={colors.transparent} />

      <MapDirectionView
        startPoint={{
          latitude: item?.splat,
          longitude: item?.splng,
        }}
        endPoint={{
          latitude: item?.soplat ? item?.soplat : item?.eplat,
          longitude: item?.soplng ? item?.soplng : item?.eplng,
        }}
        containerStyle={styles.mapContainerStyle} // 스타일 이름 명확히 구분
      />

      {/* 👇 홈 버튼 그림자 구조 수정 */}
      <View style={[styles.homeButtonShadow, {marginTop: insets.top + PADDING1}]}>
        <TouchableHighlight
          underlayColor={colors.policy}
          onPress={() =>
            navigation.navigate(ROUTE_KEY.ParkingParkHome, {
              selectedTab: 1,
            })
          }
          style={styles.homeButtonContent}>
          <Icons.HomeOutline stroke={colors.black} />
        </TouchableHighlight>
      </View>

      {/* 👇 신고하기 버튼 그림자 구조 수정 */}
      <View
        style={[styles.reportShadow, {marginTop: insets.top + PADDING1, marginRight: PADDING1}]}>
        <TouchableHighlight
          underlayColor={colors.policy}
          onPress={() => {
            if (passengerInfo?.memberId && passengerInfo?.nic) {
              // 방어 코드 추가
              navigation.navigate(ROUTE_KEY.ReportPassStep1, {
                passengerID: passengerInfo.memberId,
                passengerName: passengerInfo.nic,
                routeID: item?.id,
              });
            }
          }}
          style={styles.reportContent}>
          <CustomText
            forDriveMe
            family={FONT_FAMILY.MEDIUM}
            string="신고하기"
            color={colors.lineCancel}
          />
        </TouchableHighlight>
      </View>

      <IconButton
        icon={<Icons.BubbleSingle width={24} height={24} />}
        position={{
          bottom: heightScale1(194),
          right: PADDING1,
        }}
        onPress={() => {
          messageOfReliefRef?.current?.show();
        }}
      />

      <IconButton
        icon={<Icons.Position />}
        position={{
          bottom: heightScale1(134),
          right: PADDING1,
        }}
        onPress={() => {
          navigationRef?.current?.show();
        }}
      />

      <CustomButton
        onPress={handleCompleteReservation}
        text="운행완료"
        buttonHeight={58}
        buttonStyle={styles.completeButtonStyle}
        isLoading={isLoading}
      />

      <NavigationSelectionModal
        arriveAdressName={item?.endPlace ?? ''}
        arriveCoord={{
          lat: item?.eplat,
          long: item?.eplng,
        }}
        ref={navigationRef}
      />

      <MessageOfRelief
        ref={messageOfReliefRef}
        mode="FOR_DRIVER"
        routeInfo={item}
        passengerInfo={passengerInfo}
        driverInfo={driverInfo}
      />
    </View>
  );
};

export default DriverRunning;

const styles = StyleSheet.create({
  containerStyle: {
    // 이 스타일은 BottomSheet 또는 다른 부모 컴포넌트에 의해 적용될 수 있음
    flex: 1,
  },
  mapContainerStyle: {
    // MapDirectionView에만 적용될 스타일
    flex: 1,
  },
  // 신고하기 버튼 그림자
  reportShadow: {
    position: 'absolute',
    right: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // 신고하기 버튼 내용
  reportContent: {
    backgroundColor: colors.white,
    paddingVertical: heightScale1(10),
    paddingHorizontal: widthScale1(18),
    borderRadius: 100,
    height: heightScale1(40),
    justifyContent: 'center',
    overflow: 'hidden',
  },
  completeButtonStyle: {
    position: 'absolute',
    bottom: heightScale1(42),
    left: 0,
    right: 0,
    marginHorizontal: PADDING1,
  },
  // 홈 버튼 그림자
  homeButtonShadow: {
    position: 'absolute',
    left: PADDING1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // 홈 버튼 내용
  homeButtonContent: {
    backgroundColor: colors.white,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: widthScale1(40),
    height: widthScale1(40),
    overflow: 'hidden',
  },
});
