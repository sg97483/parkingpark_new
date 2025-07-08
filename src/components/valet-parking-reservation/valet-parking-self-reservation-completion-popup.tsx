import {useNavigation} from '@react-navigation/native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING, width} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

export interface ValetParkingSelfReservationCompletionRefs {
  show: () => void;
}

const ValetParkingSelfReservationCompletionPopup = forwardRef((_, ref) => {
  const navigation: UseRootStackNavigation = useNavigation();

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const show = () => {
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
            "출발시 목적지 입력을 인천공항이 아닌 \n인천광역시 중구 영종 해안남로40번길\n인천광역시 중구 운서동 2855-1(구주소) '뉴드림파킹 ' 주차장으로 찾아오시면됩니다."
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
      </View>
    </ReactNativeModal>
  );
});

export default ValetParkingSelfReservationCompletionPopup;

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
