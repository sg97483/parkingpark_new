import {Modal, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {forwardRef, useCallback, useState} from 'react';
import {colors} from '~styles/colors';
import {widthScale, heightScale} from '~styles/scaling-utils';
import CustomText from './custom-text';
import {strings} from '~constants/strings';
import {FONT, FONT_FAMILY} from '~constants/enum';

const ModalHelpReservation = forwardRef((props, ref) => {
  const [showModal, setShowModal] = useState(false);

  React.useImperativeHandle(ref, () => ({
    show,
    hide,
  }));
  const show = useCallback(() => setShowModal(true), []);
  const hide = useCallback(() => setShowModal(false), []);

  return (
    <Modal
      animationType={'fade'}
      visible={showModal}
      onRequestClose={hide}
      hardwareAccelerated
      onDismiss={hide}
      transparent
      style={styles.view}>
      <Pressable onPress={hide} style={styles.viewContent}>
        <Pressable style={styles.viewContent1}>
          <CustomText
            size={FONT.TITLE_3}
            family={FONT_FAMILY.SEMI_BOLD}
            string={strings.reservation.help.title}
            color={colors.red}
            textStyle={styles.title}
          />
          <CustomText
            family={FONT_FAMILY.SEMI_BOLD}
            string={strings.reservation.help.content}
            textStyle={{textAlign: 'center'}}
          />
          <View style={styles.line} />
          <Text style={styles.text}>{strings.reservation.help.text1}</Text>
          <Text style={styles.text}>{strings.reservation.help.text2}</Text>
          <Text style={styles.text}>{strings.reservation.help.text3}</Text>
          <Text style={styles.text}>{strings.reservation.help.text4}</Text>
          {/* 👇 이 부분이 수정되었습니다. */}
          <View style={styles.shadow}>
            <TouchableOpacity onPress={hide} style={styles.buttonOK}>
              <CustomText
                size={FONT.TITLE_3}
                family={FONT_FAMILY.SEMI_BOLD}
                string={strings?.general_text?.confirm}
                color={colors.red}
              />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
});

export default ModalHelpReservation;
const styles = StyleSheet.create({
  shadow: {
    // 그림자 스타일은 그대로 유지합니다.
    shadowColor: colors.black,
    shadowRadius: 10,
    shadowOpacity: 0.6,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    // 버튼을 감싸기 위해 버튼의 레이아웃 속성을 가져옵니다.
    alignSelf: 'center',
    // 그림자가 버튼 모양을 따라갈 수 있도록 borderRadius를 추가해주는 것이 좋습니다.
    borderRadius: 4,
  },
  buttonOK: {
    backgroundColor: colors.white,
    width: widthScale(150),
    height: heightScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf는 그림자를 감싸는 View로 이동했습니다.
    // borderRadius를 추가하여 그림자 모양을 개선합니다.
    borderRadius: 4,
  },
  line: {
    height: heightScale(30),
  },
  text: {
    textAlign: 'center',
    fontSize: widthScale(14.5),
    marginBottom: heightScale(20),
  },
  title: {
    textAlign: 'center',
    marginVertical: heightScale(20),
  },
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  item: {
    backgroundColor: colors.white,
    padding: widthScale(10),
    borderBottomColor: colors.black,
    borderBottomWidth: widthScale(0.5),
    marginBottom: heightScale(1),
    paddingVertical: heightScale(23),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewContent: {
    padding: widthScale(30),
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: widthScale(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewContent1: {
    width: widthScale(300),
    backgroundColor: colors.white,
    borderRadius: widthScale(5),
    paddingBottom: heightScale(20),
  },
});
