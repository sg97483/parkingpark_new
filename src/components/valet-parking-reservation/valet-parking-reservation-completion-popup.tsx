import {useNavigation} from '@react-navigation/native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import WebView from 'react-native-webview';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING, width} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

export interface ValetParkingReservationCompletionRefs {
  show: (userID: number) => void;
}

const ValetParkingReservationCompletionPopup = forwardRef((_, ref) => {
  const navigation: UseRootStackNavigation = useNavigation();

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [userID, setUserID] = useState<number | null>(null);

  const show = (userID: number) => {
    setUserID(userID);
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
    navigation.reset({
      index: 0,
      routes: [{name: ROUTE_KEY.ParkingParkHome}],
    });
  };

  useImperativeHandle(
    ref,
    () => ({
      show,
    }),
    [],
  );

  return (
    <ReactNativeModal
      isVisible={isVisible}
      onBackButtonPress={hide}
      onBackdropPress={hide}
      useNativeDriver>
      <View style={styles.container}>
        <CustomText
          string="결제완료!"
          family={FONT_FAMILY.SEMI_BOLD}
          color={colors.blue}
          textStyle={{
            textAlign: 'center',
          }}
        />

        <CustomText
          string={
            '(발렛파킹일 경우) 담당기사님 배정 후 상세 안내전화를 통해서 차량 인도장소 및 예약시간을 확인해 드리겠습니다.\n (직접주차일 경우) 해당 주차장에 예약하신 날짜에 직접 입차해주시면 됩니다.'
          }
          textStyle={{
            textAlign: 'center',
            marginVertical: PADDING / 2,
          }}
        />

        <CustomText
          string="감사합니다."
          textStyle={{
            textAlign: 'center',
            marginBottom: PADDING / 2,
          }}
        />

        <Divider />

        <TouchableOpacity onPress={hide} style={styles.confirmButtonWrapper}>
          <HStack>
            <Icon name="check" size={widthScale(20)} color={colors.white} />
            <CustomText string={` ${strings?.general_text?.confirm}`} color={colors.white} />
          </HStack>
        </TouchableOpacity>

        {userID ? (
          <WebView
            source={{
              uri: `http://cafe.wisemobile.kr/imobile/pay_lite/valetAndSelfSendKakao.php?mid=${userID}`,
            }}
            originWhitelist={['*']}
          />
        ) : null}
      </View>
    </ReactNativeModal>
  );
});

export default ValetParkingReservationCompletionPopup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    width: width * 0.7,
    alignSelf: 'center',
    padding: PADDING,
  },
  confirmButtonWrapper: {
    height: heightScale(40),
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    width: widthScale(90),
    borderRadius: widthScale(5),
    alignSelf: 'center',
    marginTop: PADDING / 2,
  },
});
