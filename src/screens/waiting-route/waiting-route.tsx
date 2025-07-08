import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import AppModal from '~components/app-modal';
import CustomButton from '~components/commons/custom-button';
import PageButton from '~components/commons/page-button';
import RouteBadge from '~components/commons/route-badge';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import {PADDING, PADDING1} from '~constants/constant';
import {AUTO_MESSAGE_TYPE, FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetDrivingDirectionQuery} from '~services/naverMapServices';
import {useSendFCMNotiMutation} from '~services/notiServices';
import {useUpdateRequestStateCheckMutation} from '~services/passengerServices';
import {useReadMyDriverQuery} from '~services/userServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

const WaitingRoute = (props: RootStackScreenProps<'WaitingRoute'>) => {
  const {navigation, route} = props;
  const waitingRouteInfo = route?.params?.route;
  console.log('🚀 ~ WaitingRoute ~ waitingRouteInfo:', waitingRouteInfo);
  const chatID = useMemo(() => waitingRouteInfo?.chatId, [waitingRouteInfo?.chatId]);
  const my_uid = auth().currentUser?.uid;

  const [passengerFCMToken, setPassengerFCMToken] = useState<string>('');

  const [sendFCM] = useSendFCMNotiMutation();

  useEffect(() => {
    firestore()
      .collection('rooms')
      .doc(chatID)
      .get()
      .then(value => {
        const otherUID = Object.keys(value?.data()?.users).find(it => it !== my_uid); // PASSENGER ID
        if (otherUID) {
          firestore()
            .collection('users')
            .doc(otherUID)
            .get()
            .then(user => {
              if (!user.metadata.hasPendingWrites) {
                setPassengerFCMToken(user?.data()?.token || '');
              }
            });
        }
      });
  }, [chatID, my_uid]);

  const {data: passengerInfo} = useReadMyDriverQuery(
    {
      memberId: waitingRouteInfo?.r_memberId?.toString(),
    },
    {skip: !waitingRouteInfo?.r_memberId},
  );
  const [updatePaymentHistory, {isLoading}] = useUpdateRequestStateCheckMutation();

  const startPlaceCoord = useMemo(
    () => `${waitingRouteInfo?.splng},${waitingRouteInfo?.splat}` ?? '',
    [waitingRouteInfo],
  );
  const endPlaceCoord = useMemo(
    () => `${waitingRouteInfo?.eplng},${waitingRouteInfo?.eplat}` ?? '',
    [waitingRouteInfo],
  );
  const stopoverPlaceCoord = useMemo(
    () =>
      waitingRouteInfo?.soplng && waitingRouteInfo?.soplat
        ? `${waitingRouteInfo?.soplng},${waitingRouteInfo?.soplat}`
        : '',
    [waitingRouteInfo],
  );

  const {data: direction} = useGetDrivingDirectionQuery({
    start: startPlaceCoord,
    end: stopoverPlaceCoord ? stopoverPlaceCoord : endPlaceCoord,
  });

  const endTime = useMemo(
    () =>
      moment(waitingRouteInfo?.startTime, 'HH:mm')
        .add(direction?.duration, 'minutes')
        .format('HH:mm'),
    [waitingRouteInfo?.startTime, direction?.duration],
  );

  const handleRunReservation = useCallback(() => {
    updatePaymentHistory({
      resId: waitingRouteInfo?.id,
      rStatusCheck: 'O',
    })
      .unwrap()
      .then(async res => {
        if (res === '200') {
          sendFCM({
            userToken: passengerFCMToken,
            title: '카풀 운행이 시작되었습니다.',
            body: '친구 또는 가족에게 안심 메세지를 전달해보세요.',
            data: {
              type: AUTO_MESSAGE_TYPE.CARPOOL_RUNNING,
              carpool: waitingRouteInfo,
            },
          })
            .unwrap()
            .then(() => {
              AppModal.show({
                title:
                  '운행이 시작되었습니다.\n탑승객과 경로를 공유하기 위해\n거치대에 핸드폰을 거치해주세요.',
                content: '',
                yesFunc: () => {
                  navigation.navigate(ROUTE_KEY.DriverRunning, {
                    item: waitingRouteInfo,
                  });
                },
                textYes: '확인',
              });
            });
        } else {
          showMessage({
            message: strings.general_text?.please_try_again,
          });
        }
      });
  }, [waitingRouteInfo, passengerFCMToken, navigation]);

  return (
    <FixedContainer>
      <CustomHeader />

      <PaddingHorizontalWrapper containerStyles={{marginTop: heightScale1(20)}}>
        <View>
          <CustomText
            string={`${passengerInfo?.nic} 님이`}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_9}
            color={colors.menuTextColor}
            lineHeight={fontSize1(31)}
            textStyle={{width: widthScale1(290), flexShrink: 1}}
            numberOfLines={1}
            forDriveMe
          />
          <CustomText
            string={'카풀탑승을 하셨나요?'}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_9}
            color={colors.menuTextColor}
            lineHeight={fontSize1(31)}
            forDriveMe
          />
        </View>

        <HStack
          style={{
            marginTop: heightScale1(30),
            marginBottom: heightScale1(20),
            gap: widthScale1(10),
          }}>
          <RouteBadge type={waitingRouteInfo?.carInOut === 'in' ? 'WAY_WORK' : 'WAY_HOME'} />
          <CustomText
            string={waitingRouteInfo?.selectDay ?? ''}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.BODY}
            color={colors.menuTextColor}
            lineHeight={fontSize1(25.2)}
            forDriveMe
          />
        </HStack>

        <RoutePlanner
          startAddress={waitingRouteInfo?.startPlace ?? ''}
          arriveAddress={
            waitingRouteInfo?.amt === waitingRouteInfo?.soPrice
              ? waitingRouteInfo?.stopOverPlace
              : waitingRouteInfo?.endPlace
          }
          timeStart={waitingRouteInfo?.startTime}
          stopOverAddress={
            waitingRouteInfo?.rStatusCheck !== 'R' || waitingRouteInfo?.soPrice
              ? ''
              : (waitingRouteInfo?.stopOverPlace ?? '')
          }
          timeArrive={endTime ?? ' '}
        />

        <View style={styles.inforContainer}>
          <CustomText
            string="카풀 드라이버 에티켓"
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_7}
            color={colors.menuTextColor}
            lineHeight={fontSize1(22)}
            forDriveMe
          />

          <HStack style={{marginTop: heightScale1(16)}}>
            <View style={styles.dot} />
            <CustomText
              string="안전운전은 운전자의 기본 수칙!"
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION_6}
              lineHeight={fontSize1(20)}
              color={colors.lineCancel}
              forDriveMe
            />
          </HStack>
          <HStack style={{marginVertical: heightScale1(4)}}>
            <View style={styles.dot} />
            <CustomText
              string="불편한 대화는 삼가해주세요."
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION_6}
              lineHeight={fontSize1(20)}
              color={colors.lineCancel}
              forDriveMe
            />
          </HStack>
          <HStack>
            <View style={styles.dot} />
            <CustomText
              string="탑승객을 위해 쾌적한 실내를 유지해주세요."
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION_6}
              lineHeight={fontSize1(20)}
              color={colors.lineCancel}
              forDriveMe
            />
          </HStack>
        </View>

        <PageButton
          text="혹시 탑승하지 않으셨나요?"
          onPress={() => {
            navigation.navigate(ROUTE_KEY.ReportPassStep1, {
              passengerID: waitingRouteInfo?.r_memberId ?? 0,
              passengerName: passengerInfo?.nic ?? '',
              routeID: waitingRouteInfo?.id ?? 0,
            });
          }}
        />
      </PaddingHorizontalWrapper>

      <PaddingHorizontalWrapper
        forDriveMe
        containerStyles={{marginTop: 'auto', marginBottom: PADDING1 / 2}}>
        <CustomButton
          text="탑승완료"
          buttonHeight={58}
          onPress={handleRunReservation}
          isLoading={isLoading}
        />
      </PaddingHorizontalWrapper>
    </FixedContainer>
  );
};

export default WaitingRoute;

const styles = StyleSheet.create({
  dot: {
    height: scale1(2),
    aspectRatio: 1,
    backgroundColor: colors.lineCancel,
    borderRadius: 99,
    marginRight: widthScale1(6),
  },
  inforContainer: {
    marginTop: heightScale1(30),
    borderRadius: scale1(4),
    backgroundColor: colors.gray7,
    paddingHorizontal: PADDING,
    paddingVertical: heightScale1(16),
    marginBottom: PADDING1,
  },
});
