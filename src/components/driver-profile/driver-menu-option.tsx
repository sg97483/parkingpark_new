import React, {forwardRef, useCallback, useImperativeHandle, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import CustomText from '~components/custom-text';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, scale1} from '~styles/scaling-utils';

interface Props {
  onBlock: () => void;
  onReport: () => void; // 추가
}

export interface DriverMenuOptionRefs {
  show: () => void;
}

const DriverMenuOption = forwardRef((props: Props, ref) => {
  const {onBlock, onReport} = props;

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const show = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  useImperativeHandle(ref, () => ({show}), []);

  const onReportPress = useCallback(() => {
    hide();
    onReport && onReport();
  }, []);

  const onBlockPress = useCallback(() => {
    hide();
    onBlock && onBlock();
  }, []);

  return (
    <ReactNativeModal
      onBackButtonPress={hide}
      onBackdropPress={hide}
      style={styles.containerStyle}
      isVisible={isVisible}>
      <View style={styles.contentStyle}>
        {/* Block */}
        <TouchableOpacity onPress={onBlockPress} style={styles.memuStyle}>
          <CustomText
            forDriveMe
            string="차단하기"
            size={FONT.CAPTION_7}
            family={FONT_FAMILY.MEDIUM}
          />
        </TouchableOpacity>

        {/* Close */}
        <TouchableOpacity onPress={hide} style={styles.memuStyle}>
          <CustomText forDriveMe string="닫기" size={FONT.CAPTION_7} family={FONT_FAMILY.MEDIUM} />
        </TouchableOpacity>
      </View>
    </ReactNativeModal>
  );
});

export default DriverMenuOption;

const styles = StyleSheet.create({
  containerStyle: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  contentStyle: {
    backgroundColor: colors.white,
    paddingHorizontal: PADDING1,
    paddingTop: PADDING1,
    paddingBottom: heightScale1(52),
    borderTopLeftRadius: scale1(16),
    borderTopRightRadius: scale1(16),
  },
  memuStyle: {
    minHeight: heightScale1(52),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
