import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import SendSMS from 'react-native-sms';
import CustomButton from '~components/commons/custom-button';
import PageButton from '~components/commons/page-button';
import RouteBadge from '~components/commons/route-badge';
import CustomBackdrop from '~components/custom-backdrop';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {MyDriverModel} from '~model/driver-model';
import {CarpoolPayHistoryModel} from '~model/passenger-model';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useGetDrivingDirectionQuery} from '~services/naverMapServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import KakaoShareLink from 'react-native-kakao-share-link';

interface Props {
  routeInfo: CarpoolPayHistoryModel | undefined;
  driverInfo?: MyDriverModel | undefined;
  passengerInfo?: MyDriverModel | undefined;
  mode: 'FOR_DRIVER' | 'FOR_PASSENGER';
}

export interface MessageOfReliefRefs {
  show: () => void;
  hide: () => void;
}

const MessageOfRelief = forwardRef((props: Props, ref) => {
  const {driverInfo, routeInfo, mode = 'FOR_DRIVER', passengerInfo} = props;

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const navigation = useNavigation<UseRootStackNavigation>();

  const {data: direction} = useGetDrivingDirectionQuery({
    start: `${routeInfo?.splng},${routeInfo?.splat}`,
    end: `${routeInfo?.eplng},${routeInfo?.eplat}`,
  });

  const timeStart = useMemo(() => routeInfo?.startTime, [routeInfo?.startTime]);
  const timeEnd = useMemo((): string => {
    return moment(timeStart, 'HH:mm').add(direction?.duration, 'minutes').format('HH:mm') ?? '';
  }, [direction?.duration, timeStart]);

  const onReportPress = useCallback(() => {
    bottomSheetRef?.current?.close();
    if (mode === 'FOR_DRIVER') {
      navigation.navigate(ROUTE_KEY.ReportPassStep1, {
        passengerID: passengerInfo?.memberId as number,
        passengerName: passengerInfo?.nic ?? '',
        routeID: routeInfo?.id as number,
      });
      return;
    } else {
      navigation.navigate(ROUTE_KEY.ReportDriverStep1, {
        driverID: driverInfo?.memberId as number,
        driverName: driverInfo?.nic ?? '',
        routeID: routeInfo?.id as number,
      });
      return;
    }
  }, [mode, driverInfo, passengerInfo]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <CustomBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior={'none'}
        onPressBackdrop={() => bottomSheetRef.current?.close()}
      />
    ),
    [],
  );

  const show = useCallback(() => {
    bottomSheetRef?.current?.present();
  }, []);

  const hide = useCallback(() => {
    bottomSheetRef?.current?.close();
  }, []);

  useImperativeHandle(ref, () => ({show, hide}), []);

  const messageContent = useMemo((): string => {
    const reportDriverContent = `${driverInfo?.nic ?? ''} 드라이버님과\n${
      routeInfo?.startPlace
    }에서\n${routeInfo?.endPlace}로 가는\n카풀이 시작되었습니다.\n\n차량번호: ${
      driverInfo?.carNumber
    }\n운행시작시간: ${timeStart}\n예상 도착 시간은 ${timeEnd} 입니다.`;

    const reportPassengerContent = `${passengerInfo?.nic ?? ''} 탑승객님과\n${
      routeInfo?.startPlace
    }에서\n${
      routeInfo?.endPlace
    }로 가는\n카풀이 시작되었습니다.\n\n운행시작시간: ${timeStart}\n예상 도착 시간은 ${timeEnd} 입니다.`;

    return mode === 'FOR_PASSENGER' ? reportDriverContent : reportPassengerContent;
  }, [mode, routeInfo, driverInfo, timeStart, timeEnd, passengerInfo]);

  const handleSendSMS = () => {
    SendSMS.send(
      {
        body: messageContent,
        recipients: [],
        successTypes: ['sent', 'queued'] as any,
        allowAndroidSendWithoutReadPermission: true,
      },
      (completed, cancelled, error) => {
        console.log(
          'SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error,
        );
      },
    );
  };

  const handleSendKakaoTalk = async () => {
    try {
      await KakaoShareLink.sendText({
        text: messageContent,
        link: {},
      });
    } catch (error) {
      console.log('🚀 ~ file: message-of-relief.tsx:135 ~ handleSendKakaoTalk ~ error:', error);
    }
  };

  return (
    <BottomSheetModal
      index={0}
      handleComponent={() => null}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      enableDynamicSizing
      ref={bottomSheetRef}>
      <BottomSheetView style={{paddingHorizontal: PADDING1}}>
        <CustomText
          string="안심메세지"
          textStyle={{marginVertical: heightScale1(30), textAlign: 'center'}}
          size={FONT.CAPTION_7}
          family={FONT_FAMILY.SEMI_BOLD}
          forDriveMe
        />

        <CustomText
          string="가족 및 친구에게 안심메세지를 보내보세요."
          family={FONT_FAMILY.MEDIUM}
          color={colors.lineCancel}
          forDriveMe
        />

        <View style={styles.routeInfoWrapperStyle}>
          <HStack style={{gap: widthScale1(10)}}>
            <RouteBadge type={routeInfo?.carInOut === 'in' ? 'WAY_WORK' : 'WAY_HOME'} />
            <CustomText
              forDriveMe
              size={FONT.BODY}
              family={FONT_FAMILY.SEMI_BOLD}
              string={routeInfo?.selectDay ?? ''}
            />
          </HStack>

          <RoutePlanner
            startAddress={routeInfo?.startPlace ?? ''}
            arriveAddress={routeInfo?.endPlace ?? ''}
            timeStart={timeStart ?? ''}
            timeArrive={timeEnd ?? ''}
            stopOverAddress={routeInfo?.stopOverPlace ?? ''}
          />

          <HStack
            style={{
              justifyContent: 'space-between',
            }}>
            <CustomText
              forDriveMe
              size={FONT.BODY}
              family={FONT_FAMILY.SEMI_BOLD}
              string="탑승차량"
              color={colors.blackGray}
              lineHeight={heightScale1(25)}
            />
            <CustomText
              string={driverInfo?.carNumber ?? ''}
              forDriveMe
              size={FONT.BODY}
              family={FONT_FAMILY.SEMI_BOLD}
              color={colors.black}
              lineHeight={heightScale1(25)}
            />
          </HStack>
        </View>

        <PageButton text="아직 탑승하지 않으셨나요?" onPress={onReportPress} />

        <HStack
          style={{
            marginTop: heightScale1(40),
            marginBottom: heightScale1(42),
            gap: widthScale1(10),
          }}>
          {/* Send SMS */}
          <CustomButton
            type="TERTIARY"
            outLine
            buttonHeight={58}
            text="문자메세지"
            buttonStyle={styles.buttonStyle}
            onPress={handleSendSMS}
          />

          {/* Send Kakao */}
          <CustomButton
            onPress={handleSendKakaoTalk}
            buttonHeight={58}
            text="카카오톡"
            buttonStyle={styles.buttonStyle}
          />
        </HStack>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default memo(MessageOfRelief);

const styles = StyleSheet.create({
  routeInfoWrapperStyle: {
    backgroundColor: colors.policy,
    padding: PADDING1,
    borderRadius: scale1(8),
    marginTop: PADDING1,
    gap: PADDING1,
    marginBottom: PADDING1,
  },
  buttonStyle: {
    flex: 1,
  },
});
