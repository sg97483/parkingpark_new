import React, {forwardRef, memo, Ref, useImperativeHandle, useState} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import Button from '~components/button';
import CustomText from '~components/custom-text';
import {PADDING} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

export interface RefModal {
  show: (content?: any) => void;
  hide: () => void;
}
const PopupSuccessReport = forwardRef((props, ref: Ref<RefModal>) => {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState('더 나은 서비스를 위해 노력하겠습니다.');

  const show = (newContent?: string) => {
    setVisible(true);
    setContent(newContent || '더 나은 서비스를 위해 노력하겠습니다.');
  };
  const hide = () => setVisible(false);
  useImperativeHandle(ref, () => ({show, hide}), []);

  return (
    <Modal
      animationType={'fade'}
      visible={visible}
      onRequestClose={hide}
      hardwareAccelerated
      onDismiss={hide}
      transparent
      style={styles.view}>
      <View style={styles.viewContent}>
        <View style={styles.viewPopup}>
          <View style={{alignItems: 'center'}}>
            <CustomText
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.BODY}
              string="신고하기가 완료되었습니다."
            />
            <CustomText
              size={FONT.CAPTION_6}
              textStyle={styles.textContent}
              color={colors.grayText2}
              string={content}
            />
          </View>
          <Button text="버튼" onPress={hide} style={styles.button} />
        </View>
      </View>
    </Modal>
  );
});

export default memo(PopupSuccessReport);
const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  viewContent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewPopup: {
    width: widthScale(320),
    backgroundColor: colors.white,
    borderRadius: 10,
    justifyContent: 'space-between',
    padding: PADDING,
  },
  button: {
    borderRadius: 10,
    height: heightScale(55),
  },
  textContent: {
    marginTop: heightScale(10),
    marginBottom: heightScale(30),
    textAlign: 'center',
    lineHeight: heightScale(20),
  },
});
