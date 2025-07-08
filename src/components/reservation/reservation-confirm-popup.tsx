import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import {colors} from '~styles/colors';
import {PADDING, width} from '~constants/constant';
import CustomText from '~components/custom-text';
import {FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {Divider} from 'react-native-paper';

export interface ReservationConfirmRefs {
  show: (title: string, body: string) => void;
}

const ReservationConfirmPopup = forwardRef((_, ref) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');

  const show = (title: string, body: string) => {
    setTitle(title);
    setBody(body);
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
        <CustomText
          string={title}
          color={colors.red}
          family={FONT_FAMILY.BOLD}
          textStyle={{
            textAlign: 'center',
          }}
        />

        <CustomText
          string={body}
          textStyle={{
            marginVertical: PADDING,
            textAlign: 'center',
          }}
        />

        <CustomText
          string="감사합니다."
          textStyle={{
            marginBottom: PADDING,
            textAlign: 'center',
          }}
        />

        <Divider />

        <TouchableOpacity onPress={hide} style={styles.confirmButtonWrapper}>
          <CustomText string={strings?.general_text?.confirm} color={colors.red} />
        </TouchableOpacity>
      </View>
    </ReactNativeModal>
  );
});

export default ReservationConfirmPopup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: PADDING,
    width: width * 0.7,
    alignSelf: 'center',
  },
  confirmButtonWrapper: {
    alignSelf: 'center',
    paddingTop: PADDING,
  },
});
