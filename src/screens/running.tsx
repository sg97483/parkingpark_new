import {activateKeepAwake, deactivateKeepAwake} from '@sayem314/react-native-keep-awake';
import React, {useCallback, useEffect, useRef} from 'react';
import {DeviceEventEmitter, StyleSheet, TouchableHighlight, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icons} from '~/assets/svgs';
import Avatar from '~components/commons/avatar';
import CustomButton from '~components/commons/custom-button';
import IconButton from '~components/commons/icon-button';
import MapDirectionView from '~components/commons/map-direction-view';
import NavigationSelectionModal, {
  NavigationSelectionModalRefs,
} from '~components/commons/navigation-selection';
import PageButton from '~components/commons/page-button';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import MessageOfRelief, {MessageOfReliefRefs} from '~components/running/message-of-relief';
import {PADDING, PADDING1, WIDTH} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useReadMyDriverQuery} from '~services/carpoolServices';
import {colors} from '~styles/colors';
import {heightScale1, widthScale, widthScale1} from '~styles/scaling-utils';
import firestore from '@react-native-firebase/firestore';
import Spinner from '~components/spinner';

const Running = (props: RootStackScreenProps<'Running'>) => {
  const {navigation, route} = props;
  const {item} = route?.params;

  const insets = useSafeAreaInsets();
  const messageOfReliefRef = useRef<MessageOfReliefRefs>(null);
  const navigationRef = useRef<NavigationSelectionModalRefs>(null);

  const onPressMessage = () => {
    messageOfReliefRef.current?.show();
  };

  const {data: driverInfo} = useReadMyDriverQuery({
    memberId: item?.d_memberId,
  });

  useEffect(() => {
    const carpoolCompleteListener = DeviceEventEmitter.addListener(
      EMIT_EVENT.CARPOOL_COMPLETED,
      () => {
        navigation.replace(ROUTE_KEY.Evaluation, {
          driverID: item?.d_memberId,
          resId: item?.id,
        });
      },
    );
    activateKeepAwake();

    return () => {
      carpoolCompleteListener.remove();
      deactivateKeepAwake();
    };
  }, []);

  const handleGoToChatRoom = useCallback(() => {
    Spinner.show();
    firestore()
      .collection('rooms')
      .doc(item?.chatId)
      .get()
      .then(res => {
        navigation.push(ROUTE_KEY.ChatDetail, {
          currentChatRoomInfo: {
            cDayId: res.data()?.cDayId,
            temptRoute: res.data()?.temptRoute,
            driverID: res.data()?.driverID,
            roomID: item?.chatId,
            lastDatetime: res.data()?.lastDatetime,
            isRequestedBy: res.data()?.isRequestedBy,
            lastMsg: res.data()?.msg,
            otherUID: Object.keys(res.data()?.users).find(it => it !== res.data()?.uid), //uid of driver
            passengerID: res.data()?.passengerID,
            userid: item?.email ?? '', //email of driver
            uid: res.data()?.uid,
            resId: item?.id,
            users: res.data()?.users,
            routeRegisterByPassengerID: res.data()?.routeRegisterByPassengerID,
            unreadCount: 0,
            userCount: Object.keys(res.data()?.users)?.length,
          },
        });
      })
      .finally(() => {
        Spinner.hide();
      });
  }, []);

  return (
    <View style={styles.view}>
      <MapDirectionView
        startPoint={{
          latitude: item?.splat,
          longitude: item?.splng,
        }}
        endPoint={{
          latitude: item?.eplat,
          longitude: item?.eplng,
        }}
        containerStyle={styles.map}
      />

      {/* Go home */}
      <TouchableHighlight
        underlayColor={colors.policy}
        onPress={() =>
          navigation.navigate(ROUTE_KEY.ParkingParkHome, {
            selectedTab: 1,
          })
        }
        style={[styles.homeButtonStyle, {marginTop: insets.top + PADDING1}]}>
        <Icons.HomeOutline stroke={colors.black} />
      </TouchableHighlight>

      {/* Report Driver */}
      <TouchableHighlight
        underlayColor={colors.policy}
        onPress={() =>
          navigation.navigate(ROUTE_KEY.ReportDriverStep1, {
            driverID: item?.c_memberId as number,
            driverName: item?.nic ?? '',
            routeID: item?.id,
          })
        }
        style={[styles.report, {marginTop: insets.top + PADDING1}]}>
        <CustomText
          forDriveMe
          family={FONT_FAMILY.MEDIUM}
          string="신고하기"
          color={colors.lineCancel}
        />
      </TouchableHighlight>

      <IconButton
        icon={<Icons.Position />}
        position={{
          bottom: heightScale1(200) + PADDING1 / 2,
          right: PADDING1,
        }}
        onPress={() => {
          navigationRef?.current?.show();
        }}
      />

      <View style={[styles.viewBottom, {paddingBottom: heightScale1(42), gap: PADDING1}]}>
        <HStack style={styles.bottom}>
          <Avatar uri={item?.profileImageUrl} size={50} />

          <View style={{flex: 1, gap: heightScale1(4)}}>
            <HStack>
              <CustomText
                string={item?.nic + ' ' ?? ''}
                size={FONT.CAPTION_7}
                family={FONT_FAMILY.MEDIUM}
                forDriveMe
                textStyle={{
                  maxWidth: widthScale1(110),
                }}
                numberOfLines={1}
              />
              <CustomText
                string="님의 차량 탑승중"
                size={FONT.CAPTION_7}
                family={FONT_FAMILY.MEDIUM}
                forDriveMe
              />
            </HStack>

            <CustomText
              family={FONT_FAMILY.MEDIUM}
              string={driverInfo?.carNumber ?? ''}
              color={colors.grayText}
              forDriveMe
            />
          </View>

          {/* Chat detail */}
          <CustomButton
            type="TERTIARY"
            outLine
            buttonHeight={38}
            borderRadiusValue={6}
            text="채팅하기"
            textSize={FONT.CAPTION_6}
            buttonStyle={{
              paddingHorizontal: widthScale1(10),
            }}
            onPress={handleGoToChatRoom}
          />
        </HStack>

        <PageButton onPress={onPressMessage} text="친구 및 가족에게 안심 메세지를 보내보세요." />
      </View>

      <NavigationSelectionModal
        arriveAdressName={item?.endPlace ?? ''}
        arriveCoord={{
          lat: item?.eplat,
          long: item?.eplng,
        }}
        ref={navigationRef}
      />

      <MessageOfRelief
        mode="FOR_PASSENGER"
        ref={messageOfReliefRef}
        driverInfo={driverInfo}
        routeInfo={item}
      />
    </View>
  );
};

export default Running;

const styles = StyleSheet.create({
  map: {flex: 1},
  view: {flex: 1, backgroundColor: colors.white},
  report: {
    backgroundColor: colors.white,
    paddingVertical: heightScale1(10),
    paddingHorizontal: widthScale1(18),
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
    right: PADDING1,
    minHeight: heightScale1(40),
    justifyContent: 'center',
  },
  homeButtonStyle: {
    backgroundColor: colors.white,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
    left: PADDING1,
    justifyContent: 'center',
    alignItems: 'center',
    width: widthScale1(40),
    height: widthScale1(40),
  },
  viewBottom: {
    position: 'absolute',
    paddingHorizontal: PADDING,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: WIDTH,
    bottom: 0,
    backgroundColor: colors.white,
  },
  bottom: {
    marginTop: heightScale1(30),
    gap: widthScale1(10),
  },
  image: {
    width: widthScale(50),
    height: widthScale(50),
    borderRadius: 100,
    marginRight: widthScale(10),
  },
  chat: {
    borderWidth: 1,
    borderColor: colors.disableButton,
    padding: widthScale(10),
    borderRadius: 6,
  },
  position: {
    position: 'absolute',
    backgroundColor: colors.white,
    width: widthScale(40),
    height: widthScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    right: PADDING,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
