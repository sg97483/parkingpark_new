import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import moment from 'moment';
import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {MessageModel} from '~/model/chat-model';
import Avatar from '~components/commons/avatar';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {AUTO_MESSAGE_TYPE, FONT, FONT_FAMILY} from '~constants/enum';
import {cacheCarpoolAlarmList} from '~reducers/termAndContionReducer';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {dayjs} from '~utils/dayjsUtil';
import {getFullHourName} from '~utils/hourUtils';
import ChatAlarmModal, {ChatAlarmModalRefs} from './chat-alarm-modal';

interface Props {
  item: MessageModel;
  otherAvatar?: string;
  nextMessageTime?: string;
  prevMessageTime?: string;
  roomID: string;
  routeSelectDay?: string;
  routeStartTime?: string;
  isShowAva: boolean;
}

interface ImageProps {
  height: number;
  url: string;
  width: number;
}

const MessageItem: React.FC<Props> = memo(props => {
  const {
    item,
    otherAvatar,
    nextMessageTime,
    prevMessageTime,
    roomID,
    routeSelectDay,
    routeStartTime,
    isShowAva,
  } = props;
  const dayTime = useMemo(
    () => routeSelectDay + ' ' + routeStartTime,
    [routeSelectDay, routeStartTime],
  );

  const my_uid = auth().currentUser?.uid;
  const isMyMessage = item?.uid === my_uid;
  const chatAlarmRef = useRef<ChatAlarmModalRefs>(null);
  const dispatch = useAppDispatch();

  const isShowTimePrev = !prevMessageTime
    ? true
    : dayjs(item?.timestamp).format('HH:mm') !== dayjs(prevMessageTime).format('HH:mm');

  const isShowTimeNext = !nextMessageTime
    ? true
    : dayjs(item?.timestamp).format('HH:mm') !== dayjs(nextMessageTime).format('HH:mm');

  const [imageURL, setImageURL] = useState<ImageProps>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentCarpoolAlarmList = useAppSelector(
    state => state?.termAndConditionReducer?.carpoolAlarmList,
  );
  const chatAlarm = useMemo(
    () => currentCarpoolAlarmList?.find(item => item?.roomID === roomID),
    [currentCarpoolAlarmList, roomID],
  );

  useEffect(() => {
    if (item?.msgtype === '1') {
      setIsLoading(true);
      storage()
        .ref()
        .child(`filesmall/${item?.msg}`)
        .getDownloadURL()
        .then(res => {
          setImageURL({
            url: res,
            width: 0, // 임시로 0
            height: 0, // 임시로 0
          });
          setIsLoading(false);
        })
        .catch(error => {
          console.log('🚀 ~ useEffect ~ error:', error);
          setIsLoading(false);
        });
    }
  }, []);

  const handleSettingCarpoolAlarm = useCallback(
    (value: string) => {
      switch (value) {
        case '':
          if (chatAlarm) {
            dispatch(
              cacheCarpoolAlarmList(
                currentCarpoolAlarmList?.filter(item => item?.roomID !== roomID) ?? [],
              ),
            );
          }
          break;
        case '5M':
          if (chatAlarm) {
            dispatch(
              cacheCarpoolAlarmList(
                currentCarpoolAlarmList?.map(item => {
                  if (item?.roomID === roomID) {
                    return {
                      roomID: roomID,
                      day: moment(dayTime, 'YYYY.MM.DD HH:mm')
                        .add(-5, 'minutes')
                        .format('YYYY.MM.DD'),
                      time: moment(dayTime, 'YYYY.MM.DD HH:mm').add(-5, 'minutes').format('HH:mm'),
                      type: '5M',
                    };
                  } else {
                    return item;
                  }
                }) ?? [],
              ),
            );
          } else {
            dispatch(
              cacheCarpoolAlarmList([
                ...(currentCarpoolAlarmList ?? []),
                {
                  roomID: roomID,
                  day: moment(dayTime, 'YYYY.MM.DD HH:mm').add(-5, 'minutes').format('YYYY.MM.DD'),
                  time: moment(dayTime, 'YYYY.MM.DD HH:mm').add(-5, 'minutes').format('HH:mm'),
                  type: '5M',
                },
              ]),
            );
          }
          break;
        case '15M':
          if (chatAlarm) {
            dispatch(
              cacheCarpoolAlarmList(
                currentCarpoolAlarmList?.map(item => {
                  if (item?.roomID === roomID) {
                    return {
                      roomID: roomID,
                      day: moment(dayTime, 'YYYY.MM.DD HH:mm')
                        .add(-15, 'minutes')
                        .format('YYYY.MM.DD'),
                      time: moment(dayTime, 'YYYY.MM.DD HH:mm').add(-15, 'minutes').format('HH:mm'),
                      type: '15M',
                    };
                  } else {
                    return item;
                  }
                }) ?? [],
              ),
            );
          } else {
            dispatch(
              cacheCarpoolAlarmList([
                ...(currentCarpoolAlarmList ?? []),
                {
                  roomID: roomID,
                  day: moment(dayTime, 'YYYY.MM.DD HH:mm').add(-15, 'minutes').format('YYYY.MM.DD'),
                  time: moment(dayTime, 'YYYY.MM.DD HH:mm').add(-15, 'minutes').format('HH:mm'),
                  type: '15M',
                },
              ]),
            );
          }
          break;
        case '30M':
          if (chatAlarm) {
            dispatch(
              cacheCarpoolAlarmList(
                currentCarpoolAlarmList?.map(item => {
                  if (item?.roomID === roomID) {
                    return {
                      roomID: roomID,
                      day: moment(dayTime, 'YYYY.MM.DD HH:mm')
                        .add(-30, 'minutes')
                        .format('YYYY.MM.DD'),
                      time: moment(dayTime, 'YYYY.MM.DD HH:mm').add(-30, 'minutes').format('HH:mm'),
                      type: '30M',
                    };
                  } else {
                    return item;
                  }
                }) ?? [],
              ),
            );
          } else {
            dispatch(
              cacheCarpoolAlarmList([
                ...(currentCarpoolAlarmList ?? []),
                {
                  roomID: roomID,
                  day: moment(dayTime, 'YYYY.MM.DD HH:mm').add(-30, 'minutes').format('YYYY.MM.DD'),
                  time: moment(dayTime, 'YYYY.MM.DD HH:mm').add(-30, 'minutes').format('HH:mm'),
                  type: '30M',
                },
              ]),
            );
          }
          break;
        case '1H':
          if (chatAlarm) {
            dispatch(
              cacheCarpoolAlarmList(
                currentCarpoolAlarmList?.map(item => {
                  if (item?.roomID === roomID) {
                    return {
                      roomID: roomID,
                      day: moment(dayTime, 'YYYY.MM.DD HH:mm')
                        .add(-1, 'hours')
                        .format('YYYY.MM.DD'),
                      time: moment(dayTime, 'YYYY.MM.DD HH:mm').add(-1, 'hours').format('HH:mm'),
                      type: '1H',
                    };
                  } else {
                    return item;
                  }
                }) ?? [],
              ),
            );
          } else {
            dispatch(
              cacheCarpoolAlarmList([
                ...(currentCarpoolAlarmList ?? []),
                {
                  roomID: roomID,
                  day: moment(dayTime, 'YYYY.MM.DD HH:mm').add(-1, 'hours').format('YYYY.MM.DD'),
                  time: moment(dayTime, 'YYYY.MM.DD HH:mm').add(-1, 'hours').format('HH:mm'),
                  type: '1H',
                },
              ]),
            );
          }
          break;
        case '2H':
          if (chatAlarm) {
            dispatch(
              cacheCarpoolAlarmList(
                currentCarpoolAlarmList?.map(item => {
                  if (item?.roomID === roomID) {
                    return {
                      roomID: roomID,
                      day: moment(dayTime, 'YYYY.MM.DD HH:mm')
                        .add(-2, 'hours')
                        .format('YYYY.MM.DD'),
                      time: moment(dayTime, 'YYYY.MM.DD HH:mm').add(-2, 'hours').format('HH:mm'),
                      type: '2H',
                    };
                  } else {
                    return item;
                  }
                }) ?? [],
              ),
            );
          } else {
            dispatch(
              cacheCarpoolAlarmList([
                ...(currentCarpoolAlarmList ?? []),
                {
                  roomID: roomID,
                  day: moment(dayTime, 'YYYY.MM.DD HH:mm').add(-2, 'hours').format('YYYY.MM.DD'),
                  time: moment(dayTime, 'YYYY.MM.DD HH:mm').add(-2, 'hours').format('HH:mm'),
                  type: '2H',
                },
              ]),
            );
          }
          break;
        default:
          break;
      }
    },
    [chatAlarm, roomID, currentCarpoolAlarmList, dayTime],
  );

  const carpoolAlarmText = useMemo(() => {
    if (chatAlarm?.type) {
      switch (chatAlarm?.type) {
        case '5M':
          return '카풀 시간  5분 전 알림이 울릴거에요!';
        case '15M':
          return '카풀 시간  15분 전 알림이 울릴거에요!';
        case '30M':
          return '카풀 시간  30분 전 알림이 울릴거에요!';
        case '1H':
          return '카풀 시간 1시간 전 알림이 울릴거에요!';
        case '2H':
          return '카풀 시간 2시간 전 알림이 울릴거에요!';
        default:
          return '카풀 시간 전 알림을 받아보세요';
      }
    }
    return '카풀 시간 전 알림을 받아보세요';
  }, [chatAlarm?.type]);

  const renderMessageImage = useMemo(() => {
    if (isLoading) {
      return (
        <View style={styles.placeholderView}>
          <ActivityIndicator color={colors.primary} />
        </View>
      );
    }

    if (imageURL) {
      return (
        <FastImage
          source={{uri: imageURL?.url}}
          style={{
            width: widthScale1(150), // 기본 크기 (로딩 후 수정)
            height: heightScale1(150),
            maxWidth: isMyMessage ? '75%' : '70%',
            marginVertical: heightScale1(10),
            borderRadius: scale1(8),
            marginLeft: widthScale1(10),
          }}
          resizeMode="cover"
          onLoad={event => {
            const {width, height} = event.nativeEvent;
            console.log('Loaded image size:', width, height);
            // 여기서 원래라면 동적으로 style을 수정해야 하는데,
            // 이미 렌더링 된 후라 setState 하려면 추가 로직 필요
            // 지금은 기본 150*150 으로 유지
          }}
        />
      );
    }
  }, [isLoading, imageURL, isMyMessage]);

  const getAutoMessageBackground = useMemo((): StyleProp<ViewStyle> => {
    if (
      item?.msgtype === AUTO_MESSAGE_TYPE.DRIVER_CANCEL_RESERVATION ||
      item?.msgtype === AUTO_MESSAGE_TYPE.PASSENGER_CANCEL_RESERVATION ||
      item?.msgtype === AUTO_MESSAGE_TYPE.PASSENGER_CANCEL_PAYMENT ||
      item?.msgtype === AUTO_MESSAGE_TYPE.DRIVER_CANCEL_PAYMENT
    ) {
      return {
        backgroundColor: colors.policy,
      };
    }
    if (item?.msgtype === AUTO_MESSAGE_TYPE.COMPLETE_PAYMENT) {
      return {
        backgroundColor: colors.verificationSuccess,
      };
    }
    return {
      backgroundColor: colors.successBackdrop,
    };
  }, []);

  const getAutoMessageText = useMemo((): StyleProp<TextStyle> => {
    if (
      item?.msgtype === AUTO_MESSAGE_TYPE.DRIVER_CANCEL_RESERVATION ||
      item?.msgtype === AUTO_MESSAGE_TYPE.PASSENGER_CANCEL_RESERVATION ||
      item?.msgtype === AUTO_MESSAGE_TYPE.PASSENGER_CANCEL_PAYMENT ||
      item?.msgtype === AUTO_MESSAGE_TYPE.DRIVER_CANCEL_PAYMENT
    ) {
      return {
        color: colors.heavyGray,
      };
    }
    if (item?.msgtype === AUTO_MESSAGE_TYPE.COMPLETE_PAYMENT) {
      return {
        color: colors.greenInteraction,
      };
    }
    return {
      color: colors.interection,
    };
  }, []);

  if (Number(item?.msgtype) === 13 || Number(item?.msgtype) === 14) {
    return (
      <HStack
        style={{
          marginVertical: heightScale1(5),
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
        }}>
        <CustomText
          string={item?.msg}
          forDriveMe
          size={FONT.CAPTION}
          family={FONT_FAMILY.MEDIUM}
          textStyle={{
            textAlign: 'center',
          }}
          color={colors.grayText}
          lineHeight={heightScale1(18)}
        />
      </HStack>
    );
  }

  if (Number(item?.msgtype) > 2) {
    return (
      <View>
        <View style={[styles.autoMessageWrapper, getAutoMessageBackground]}>
          <Text style={[styles.autoMessaheTextStyle, getAutoMessageText]}>
            <CustomText
              string={item?.msg?.split(' ')?.[0]}
              family={FONT_FAMILY.SEMI_BOLD}
              textStyle={getAutoMessageText}
              forDriveMe
            />{' '}
            {item?.msg
              ?.split(' ')
              ?.splice(1, item?.msg?.split(' ')?.length - 1)
              .join(' ')}
          </Text>
        </View>

        {/* Complete payment and set an alarm */}
        {Number(item?.msgtype) === 9 ? (
          <HStack
            style={{
              gap: widthScale1(10),
              alignSelf: 'center',
              marginVertical: heightScale1(10),
            }}>
            <CustomText
              string={carpoolAlarmText}
              forDriveMe
              size={FONT.CAPTION}
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText}
            />
            <Pressable
              onPress={() => {
                chatAlarmRef?.current?.show();
              }}>
              <CustomText
                string="알림설정"
                forDriveMe
                family={FONT_FAMILY.MEDIUM}
                color={colors.grayText2}
              />
            </Pressable>
          </HStack>
        ) : null}

        <ChatAlarmModal
          ref={chatAlarmRef}
          onChatAlarmPress={handleSettingCarpoolAlarm}
          selectedAlarm={chatAlarm}
        />
      </View>
    );
  }

  return (
    <View
      key={item?.chatID}
      style={{
        alignItems: isMyMessage ? 'flex-end' : 'flex-start',
      }}>
      <HStack
        style={[
          {
            alignItems: 'flex-start',
            marginVertical: isShowTimeNext ? heightScale1(10) : heightScale1(3),
          },
          {
            marginTop: isShowTimePrev ? heightScale1(10) : heightScale1(3),
            marginBottom: isShowTimeNext ? heightScale1(10) : heightScale1(3),
          },
        ]}>
        {!isMyMessage && (
          <View>
            {isShowAva ? (
              <Avatar uri={isShowAva ? otherAvatar : ' '} size={32} />
            ) : (
              <View style={{width: widthScale1(32)}} />
            )}
          </View>
        )}

        {isMyMessage && isShowTimeNext && (
          <View
            style={{
              alignSelf: 'flex-end',
              alignItems: 'flex-end',
              marginRight: widthScale1(6),
              gap: heightScale1(2),
            }}>
            {typeof item?.readUsers === 'object' &&
              item?.readUsers?.filter(item => item !== my_uid)?.length > 0 && (
                <CustomText
                  size={FONT.CAPTION_4}
                  family={FONT_FAMILY.SEMI_BOLD}
                  string="읽음"
                  color={colors.lineInput}
                  forDriveMe
                />
              )}

            <CustomText
              size={FONT.CAPTION_4}
              family={FONT_FAMILY.SEMI_BOLD}
              string={getFullHourName(Number(item?.timestamp), true)}
              color={colors.lineInput}
              forDriveMe
            />
          </View>
        )}

        {item?.msgtype === '1' ? (
          renderMessageImage
        ) : (
          <View style={isMyMessage ? styles.myMessageWrapperStyle : styles.messageWrapperStyle}>
            <Text style={isMyMessage ? styles.myMessageTextStyle : styles.messageTextStyle}>
              {item?.msg}
            </Text>
          </View>
        )}

        {!isMyMessage && isShowTimeNext && (
          <View
            style={{
              alignSelf: 'flex-end',
              alignItems: 'flex-end',
              marginLeft: widthScale1(6),
            }}>
            <Text style={styles.timeTextStyle}>
              {getFullHourName(Number(item?.timestamp), true)}
            </Text>
          </View>
        )}
      </HStack>
    </View>
  );
});

export default MessageItem;

const styles = StyleSheet.create({
  myMessageWrapperStyle: {
    backgroundColor: colors.primary,
    maxWidth: widthScale1(262),
    paddingHorizontal: widthScale1(12),
    paddingVertical: heightScale1(10),
    borderTopLeftRadius: scale1(8),
    borderTopRightRadius: scale1(8),
    borderBottomLeftRadius: scale1(8),
  },
  myMessageTextStyle: {
    fontSize: fontSize1(14),
    fontFamily: FONT_FAMILY.MEDIUM,
    color: colors.white,
    lineHeight: heightScale1(20),
  },
  messageWrapperStyle: {
    paddingHorizontal: widthScale1(12),
    paddingVertical: heightScale1(10),
    backgroundColor: colors.policy,
    maxWidth: widthScale1(228),
    borderTopLeftRadius: scale1(8),
    borderTopRightRadius: scale1(8),
    borderBottomRightRadius: scale1(8),
    marginLeft: widthScale1(10),
  },
  messageTextStyle: {
    fontSize: fontSize1(14),
    fontFamily: FONT_FAMILY.MEDIUM,
    color: colors.menuTextColor,
    lineHeight: heightScale1(20),
  },
  timeTextStyle: {
    fontSize: fontSize1(11),
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    color: colors.grayText,
  },
  placeholderView: {
    width: widthScale1(150),
    height: widthScale1(150),
    justifyContent: 'center',
    alignItems: 'center',
  },
  autoMessageWrapper: {
    paddingHorizontal: widthScale1(16),
    paddingVertical: heightScale1(14),
    backgroundColor: colors.successBackdrop,
    borderRadius: scale1(8),
    marginVertical: heightScale1(10),
  },
  autoMessaheTextStyle: {
    fontSize: fontSize1(14),
    fontFamily: FONT_FAMILY.REGULAR,
    lineHeight: heightScale1(20),
  },
});
