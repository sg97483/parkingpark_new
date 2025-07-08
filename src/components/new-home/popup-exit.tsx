import React, {forwardRef, memo, Ref, useCallback, useImperativeHandle, useState} from 'react';
import {
  BackHandler,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {IMAGES} from '~/assets/images-path';
import CustomText from '~components/custom-text';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

export interface ExitAppRefs {
  show: () => void;
  hide: () => void;
}
interface Props {}

const ExitApp = forwardRef(({}: Props, ref: Ref<ExitAppRefs>) => {
  const [showModal, setShowModal] = useState(false);

  useImperativeHandle(ref, () => ({
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
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            resizeMode="contain"
            source={IMAGES.exit_image}
            style={{
              width: '100%',
              height: heightScale(520),
            }}
          />
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              width: '100%',
              height: heightScale(50),
              borderBottomRightRadius: widthScale(10),
              borderBottomLeftRadius: widthScale(10),
              overflow: 'hidden',
            }}>
            <Button onPress={() => BackHandler.exitApp()} text="종료" />
            <Button onPress={hide} text="취소" />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
});

export default memo(ExitApp);
const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  viewContent: {
    padding: widthScale(30),
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: widthScale(50),
  },
  viewButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#2B2B2A',
  },
});

const Button = ({onPress, text}: {onPress: () => void; text: string}) => {
  return (
    <TouchableOpacity style={styles.viewButton} onPress={onPress}>
      <CustomText color={colors.white} string={text} family={FONT_FAMILY.BOLD} />
    </TouchableOpacity>
  );
};
