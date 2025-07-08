import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {memo, useEffect, useMemo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {ChatRoomModel} from '~/model/chat-model';
import Avatar from '~components/commons/avatar';
import RouteBadge from '~components/commons/route-badge';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useGetReadDriverTokenQuery, useReadMyCarpoolInfoQuery} from '~services/carpoolServices';
import {useGetPayHistoryInfoQuery} from '~services/passengerServices';
import {useReadMyDriverQuery} from '~services/userServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {getTimeAgo} from '~utils/hourUtils';

interface Props {
  item: ChatRoomModel;
}

const RoomItem: React.FC<Props> = memo(props => {
  const {item} = props;

  const navigation: UseRootStackNavigation = useNavigation();
  const {userID} = userHook();

  const {data} = useGetReadDriverTokenQuery(
    {
      email: item?.userid as string,
    },
    {skip: !item?.userid},
  );

  const {
    data: payInfo,
    isUninitialized,
    isLoading,
    refetch,
  } = useGetPayHistoryInfoQuery(
    {
      hid: item?.resId ?? 0,
      requestBy: item?.isRequestedBy ?? 'PASSENGER',
    },
    {skip: !item?.resId},
  );

  useEffect(() => {
    if (!isUninitialized) {
      refetch();
    }
  }, [item, isUninitialized]);

  const isCancel = useMemo(
    () =>
      (payInfo?.rStatusCheck === 'C' && !item?.lastMsg?.includes('취소하였습니다')) ||
      item?.isCancelRequest,
    [payInfo?.rStatusCheck, item?.lastMsg, item?.isCancelRequest],
  );
  const isCompletePayment = useMemo(() => payInfo?.rStatusCheck === 'R', [payInfo?.rStatusCheck]);
  const isEndTrip = useMemo(() => payInfo?.rStatusCheck === 'E', [payInfo?.rStatusCheck]);
  const carpoolMode = useMemo(
    (): 'PASSENGER' | 'DRIVER' =>
      Number(item?.passengerID) === Number(userID) ? 'PASSENGER' : 'DRIVER',
    [userID, item?.passengerID],
  );

  const {data: driverInfo} = useReadMyDriverQuery(
    {
      memberId: item?.driverID?.toString(),
    },
    {skip: !item?.driverID},
  );
  const {data: passengerInfo} = useReadMyDriverQuery(
    {
      memberId: item?.passengerID?.toString(),
    },
    {skip: !item?.passengerID},
  );

  const {data: dataCarpool} = useReadMyCarpoolInfoQuery(
    {
      memberId: item?.driverID as number,
    },
    {skip: !item?.driverID},
  );

  const isPassengerBusinessCard = useMemo(
    (): boolean =>
      dataCarpool?.coAddress && dataCarpool?.job && dataCarpool?.coName && dataCarpool?.jobType
        ? true
        : false,
    [dataCarpool],
  );

  const getChatRoomTitle = useMemo(() => {
    if (carpoolMode === 'PASSENGER') {
      return driverInfo?.nic ?? '';
    }
    if (carpoolMode === 'DRIVER') {
      return passengerInfo?.nic ?? '';
    }
    return 'Room Chat';
  }, [carpoolMode, driverInfo?.nic, passengerInfo?.nic]);

  const renderReservationMark = useMemo(() => {
    if (isLoading) {
      return null;
    }

    if (isCompletePayment) {
      return (
        <HStack>
          <View
            style={{
              backgroundColor: colors.successBackdrop,
              paddingVertical: heightScale1(4),
              paddingHorizontal: widthScale1(6),
              borderRadius: scale1(4),
            }}>
            <CustomText
              color={colors.success}
              forDriveMe
              family={FONT_FAMILY.SEMI_BOLD}
              string="예약완료"
              size={FONT.CAPTION_4}
            />
          </View>
        </HStack>
      );
    }

    if (isEndTrip) {
      return (
        <HStack>
          <View
            style={{
              backgroundColor: colors.colorStatus,
              paddingVertical: heightScale1(4),
              paddingHorizontal: widthScale1(6),
              borderRadius: scale1(4),
            }}>
            <CustomText
              color={colors.lineCancel}
              forDriveMe
              family={FONT_FAMILY.SEMI_BOLD}
              string="카풀완료"
              size={FONT.CAPTION_4}
            />
          </View>
        </HStack>
      );
    }

    return null;
  }, [isCompletePayment, isEndTrip, isLoading]);

  const getTime = useMemo(() => {
    const selectedDay = payInfo?.selectDay
      ? payInfo?.selectDay
      : item?.temptRoute?.selectDay
        ? item?.temptRoute?.selectDay
        : '';

    return selectedDay ? `${getChatRoomTitle} • ${selectedDay}` : getChatRoomTitle;
  }, [getChatRoomTitle, payInfo?.selectDay, item?.temptRoute?.selectDay]);

  return (
    <Pressable
      disabled={isLoading}
      onPress={() => {
        if (isCancel) {
          showMessage({
            message: '취소된 카풀 내역입니다.',
          });
          firestore().collection('rooms').doc(item?.roomID).delete();
          return;
        }

        navigation.push(ROUTE_KEY.ChatDetail, {
          currentChatRoomInfo: {...item, title: data?.nic || 'Room Name'},
        });
      }}
      style={styles.containerStyle}>
      <HStack style={{gap: widthScale1(10)}}>
        <View style={{marginTop: heightScale1(5)}}>
          <Avatar
            disabled={isCancel}
            showVerifyMark={isPassengerBusinessCard as any}
            uri={data?.profileImageUrl}
            size={40}
          />
          <RouteBadge
            type={
              (payInfo?.carInOut ?? item?.temptRoute?.carInOut) === 'in' ? 'WAY_WORK' : 'WAY_HOME'
            }
            containerStyle={styles.badgeStyle}
            disabled={isCancel}
          />
        </View>

        <View style={styles.contentWrapperStyle}>
          {renderReservationMark}

          <HStack>
            <View style={styles.roomNameWrapperStyle}>
              <Text
                numberOfLines={1}
                style={[
                  styles.roomNameTextStyle,
                  {
                    color: isCancel ? colors.disableButton : colors.black,
                  },
                ]}>
                {getTime}
              </Text>
            </View>

            {isCancel ? null : (
              <Text style={styles.timeAgoStyle} numberOfLines={1}>
                {getTimeAgo(moment(item?.lastDatetime, 'YYYY.MM.DD HH:mm').valueOf())}
              </Text>
            )}
          </HStack>

          <HStack>
            <View style={styles.lastMsgWrapperStyle}>
              <Text
                style={[
                  styles.lastMsgTextStyle,
                  {
                    color: isCancel ? colors.disableButton : colors.black,
                  },
                ]}
                numberOfLines={1}>
                {item?.lastMsg ?? '...'}
              </Text>
            </View>

            {Number(item?.unreadCount) > 0 && (
              <View style={styles.unreadWrapperStyle}>
                <Text style={styles.unreadTextStyle} numberOfLines={1}>
                  {item?.unreadCount}
                </Text>
              </View>
            )}
          </HStack>
        </View>
      </HStack>
    </Pressable>
  );
});

export default RoomItem;

const styles = StyleSheet.create({
  containerStyle: {
    minHeight: heightScale1(89),
    justifyContent: 'center',
  },
  contentWrapperStyle: {
    flex: 1,
    gap: heightScale1(4),
  },
  roomNameWrapperStyle: {
    marginRight: widthScale1(4),
    flex: 1,
  },
  roomNameTextStyle: {
    fontSize: fontSize1(16),
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    color: colors.black,
  },
  timeAgoStyle: {
    fontSize: fontSize1(11),
    fontFamily: FONT_FAMILY.REGULAR,
    color: colors.grayText,
  },
  lastMsgWrapperStyle: {
    flex: 1,
  },
  lastMsgTextStyle: {
    fontSize: fontSize1(14),
    fontFamily: FONT_FAMILY.REGULAR,
    color: colors.black,
  },
  unreadWrapperStyle: {
    backgroundColor: colors.red,
    minWidth: widthScale1(16),
    minHeight: widthScale1(16),
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadTextStyle: {
    fontSize: fontSize1(11),
    fontFamily: FONT_FAMILY.REGULAR,
    color: colors.white,
  },
  badgeStyle: {
    top: -heightScale1(10),
    marginLeft: widthScale1(1.5),
  },
});
