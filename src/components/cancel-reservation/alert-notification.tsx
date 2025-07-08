import React, {forwardRef, memo, Ref, useImperativeHandle, useState} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import Button from '~components/button';
import CustomText from '~components/custom-text';
import {RefModal} from '~components/report-an-accident/popup-success-report';
import {PADDING} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

const AlertNotification = forwardRef((props, ref: Ref<RefModal>) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState<string>();
  const [content, setContent] = useState<string>();

  const show = (text: any) => {
    setVisible(true);
    setTitle(text?.title);
    setContent(text?.content);
  };
  const hide = () => {
    setVisible(false);
  };
  useImperativeHandle(ref, () => ({show, hide}), []);

  return (
    <Modal
      visible={visible}
      animationType={'fade'}
      onRequestClose={hide}
      hardwareAccelerated
      onDismiss={hide}
      transparent
      style={styles.view}>
      <View style={styles.content}>
        <View style={styles.popup}>
          <CustomText string={title!} family={FONT_FAMILY.SEMI_BOLD} size={FONT.BODY} />
          <CustomText
            string={content!}
            size={FONT.CAPTION_6}
            textStyle={{marginTop: heightScale(10)}}
          />
          <Button onPress={hide} text="예약취소" style={styles.button} />
        </View>
      </View>
    </Modal>
  );
});

export default memo(AlertNotification);
const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: heightScale(55),
    borderRadius: 10,
    marginTop: heightScale(30),
  },
  popup: {
    backgroundColor: colors.white,
    width: widthScale(310),
    padding: PADDING,
    borderRadius: 10,
    alignItems: 'center',
  },
});
