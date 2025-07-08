import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import {colors} from '~styles/colors';
import CustomText from '~components/custom-text';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {PADDING} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import Divider from '~components/divider';
import HStack from '~components/h-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {strings} from '~constants/strings';

export interface RefundPolicyRefs {
  show: () => void;
}

const RefundPolicyPopup = forwardRef((_, ref) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const show = () => {
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
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
      onBackButtonPress={hide}
      onBackdropPress={hide}
      isVisible={isVisible}
      useNativeDriver>
      <View style={styles.container}>
        <View style={styles.titleViewWrapper}>
          <CustomText string="환불규정" color={colors.white} family={FONT_FAMILY.SEMI_BOLD} />
        </View>
        <View style={styles.content}>
          <CustomText
            string={'예약취소시 입차시간 기준으로 다음과 같이 환불합니다.\n'}
            family={FONT_FAMILY.BOLD}
          />
          <CustomText
            string={
              '- 입차 24시간 이전 취소시 전액 환불\n- 입차 3시간前~24시간前 : 1만원 공제 후 환불\n- 입차3시간前~입차직전 : 50% 공제 후 환불\n- 입차 시간부터 그 이후 환불 불가'
            }
          />
        </View>
        <Divider />
        <View>
          <TouchableOpacity onPress={hide} style={styles.confirmButtonWrapper}>
            <HStack>
              <Icon name="check" color={colors.white} size={widthScale(20)} />
              <CustomText
                string={strings?.general_text?.confirm}
                color={colors.white}
                textStyle={{marginLeft: widthScale(5)}}
              />
            </HStack>
          </TouchableOpacity>
        </View>
      </View>
    </ReactNativeModal>
  );
});

export default RefundPolicyPopup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  titleViewWrapper: {
    height: heightScale(45),
    backgroundColor: colors.red,
    justifyContent: 'center',
    paddingHorizontal: PADDING,
  },
  content: {
    padding: PADDING,
  },
  confirmButtonWrapper: {
    minWidth: widthScale(90),
    backgroundColor: colors.blue,
    marginVertical: PADDING / 2,
    height: heightScale(35),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: widthScale(5),
  },
});
