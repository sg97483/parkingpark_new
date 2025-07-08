import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import HStack from '~components/h-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '~components/custom-text';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {PADDING} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {getNumberWithCommas} from '~utils/numberUtils';
import {strings} from '~constants/strings';
import Divider from '~components/divider';

interface Props {
  onConfirm: () => void;
}

export interface ValetParkingReservationRefs {
  show: (outTime: string, inTime: string, totalPrice: number) => void;
}

const ValetParkingReservationPopup = forwardRef((props: Props, ref) => {
  const {onConfirm} = props;

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [outTime, setOutTime] = useState<string>('');
  const [inTime, setInTime] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const show = (outTime: string, inTime: string, totalPrice: number) => {
    setOutTime(outTime);
    setInTime(inTime);
    setTotalPrice(totalPrice);
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
  };

  useImperativeHandle(ref, () => ({show}), []);

  return (
    <ReactNativeModal isVisible={isVisible} onBackButtonPress={hide} onBackdropPress={hide}>
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <HStack>
            <Icon name="alert" size={widthScale(20)} color={colors.white} />
            <CustomText
              string=" 결제전 한번 더 확인하세요."
              color={colors.white}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </HStack>
        </View>
        <View style={styles.content}>
          <CustomText string="결제안내" color={colors.blue} />
          <CustomText
            string={`· 입차시간: ${outTime}`}
            textStyle={styles.text}
            family={FONT_FAMILY.SEMI_BOLD}
          />
          <CustomText
            string={`· 출차시간: ${inTime}`}
            textStyle={styles.text}
            family={FONT_FAMILY.SEMI_BOLD}
          />
          <CustomText
            string={`· 결제금액: ${getNumberWithCommas(totalPrice)}${strings?.general_text?.won}`}
            textStyle={styles.text}
            family={FONT_FAMILY.SEMI_BOLD}
          />
          <CustomText
            string="결제 하시겠습니까?"
            textStyle={{
              textAlign: 'center',
              paddingTop: PADDING,
            }}
            color={colors.red}
          />
        </View>
        <View
          style={{
            alignItems: 'center',
            marginBottom: PADDING,
          }}>
          <Divider />
          <HStack>
            <TouchableOpacity
              style={[
                styles.buttonWrapper,
                {
                  backgroundColor: colors.blue,
                },
              ]}
              onPress={() => {
                hide();
                onConfirm && onConfirm();
              }}>
              <HStack>
                <Icon name="check" size={widthScale(20)} color={colors.white} />
                <CustomText string={` ${strings?.general_text?.confirm}`} color={colors.white} />
              </HStack>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={hide}
              style={[
                styles.buttonWrapper,
                {
                  marginLeft: PADDING / 2,
                },
              ]}>
              <CustomText
                string={strings?.valet_parking_reservation_popup?.cancel}
                color={colors.blue}
              />
            </TouchableOpacity>
          </HStack>
        </View>
      </View>
    </ReactNativeModal>
  );
});

export default ValetParkingReservationPopup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  headerWrapper: {
    height: heightScale(45),
    backgroundColor: colors.red,
    justifyContent: 'center',
    paddingHorizontal: PADDING,
  },
  content: {
    padding: PADDING,
  },
  text: {
    paddingVertical: PADDING / 3,
  },
  buttonWrapper: {
    width: widthScale(120),
    borderWidth: 1,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.blue,
    height: heightScale(45),
    marginTop: PADDING,
  },
});
