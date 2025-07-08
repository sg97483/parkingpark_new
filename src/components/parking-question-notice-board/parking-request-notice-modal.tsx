import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Dimensions, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import Button from '~components/button';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {colors} from '~styles/colors';

export interface ParkingRequestNoticeModalRefs {
  show: () => void;
  hide: () => void;
}

const ParkingRequestNoticeModal = forwardRef((_, ref) => {
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
      hide,
    }),
    [],
  );

  return (
    <ReactNativeModal
      onBackdropPress={hide}
      onBackButtonPress={hide}
      isVisible={isVisible}
      useNativeDriver={true}
      useNativeDriverForBackdrop
      customBackdrop={
        <TouchableWithoutFeedback onPress={hide}>
          <View style={{backgroundColor: 'black', ...Dimensions.get('screen')}} />
        </TouchableWithoutFeedback>
      }>
      <View style={styles.container}>
        <CustomText
          string={strings.parking_request_notice_board.modal_title}
          family={FONT_FAMILY.BOLD}
        />
        <View style={{marginTop: PADDING * 2}}>
          <CustomText string={strings.parking_request_notice_board.modal_content} />
          <CustomText
            string={strings.parking_request_notice_board.modal_sub_content}
            textStyle={{marginTop: PADDING}}
          />

          <HStack style={{alignSelf: 'flex-end', marginTop: PADDING / 2}}>
            <Button
              text={strings.parking_request_notice_board.not_confirm}
              onPress={() => {}}
              color={colors.transparent}
              borderColor={colors.transparent}
              textColor={colors.red}
            />
            <Button
              text={strings.parking_request_notice_board.confirm}
              onPress={() => {}}
              color={colors.transparent}
              borderColor={colors.transparent}
              textColor={colors.red}
              style={{marginLeft: PADDING * 2}}
            />
          </HStack>
        </View>
      </View>
    </ReactNativeModal>
  );
});

export default ParkingRequestNoticeModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: PADDING,
  },
});
