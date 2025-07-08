import {BottomSheetModal, BottomSheetView, useBottomSheetModal} from '@gorhom/bottom-sheet';
import React, {forwardRef, useCallback, useImperativeHandle, useRef} from 'react';
import {Pressable, StatusBar, StyleSheet} from 'react-native';
import CustomBackdrop from '~components/custom-backdrop';
import CustomText from '~components/custom-text';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';

export interface ChatQuickActionRefs {
  show: () => void;
  hide: () => void;
}

interface Props {
  onCheckUserInfoPress?: () => void;
  onBlockDriverPress?: () => void;
  onLeftChatPress?: () => void;
}

const ChatQuickAction = forwardRef((props: Props, ref) => {
  const {onBlockDriverPress, onCheckUserInfoPress, onLeftChatPress} = props;
  const modalRef = useRef<BottomSheetModal>(null);
  const carpoolMode = useAppSelector(state => state?.userReducer?.carpoolMode);
  const {dismissAll} = useBottomSheetModal();

  const show = useCallback(() => {
    modalRef?.current?.present();
  }, []);

  const hide = useCallback(() => {
    dismissAll();
    modalRef?.current?.close();
  }, []);

  useImperativeHandle(ref, () => ({show, hide}), []);

  const DATA = [
    {
      title: carpoolMode === 'PASSENGER' ? '드라이버 정보 보기' : '탑승객 정보 보기',
      onPress: onCheckUserInfoPress,
    },
    {
      title: __DEV__ ? 'BLOCK' : '차단하기',
      onPress: onBlockDriverPress,
    },
    {
      title: __DEV__ ? 'LEFT CHAT' : '채팅 나가기',
      onPress: onLeftChatPress,
    },
    {
      title: '닫기',
      onPress: hide,
    },
  ];

  return (
    <BottomSheetModal
      backdropComponent={props => <CustomBackdrop {...props} onPressBackdrop={hide} />}
      index={0}
      enableDynamicSizing
      enablePanDownToClose={true}
      handleComponent={() => null}
      ref={modalRef}>
      <BottomSheetView style={styles.containerStyle}>
        <StatusBar backgroundColor={colors.transparent} />

        <PaddingHorizontalWrapper forDriveMe>
          {DATA?.map((item, index) => {
            return (
              <Pressable
                onPress={() => {
                  hide();
                  item?.onPress && item?.onPress();
                }}
                style={styles.itemStyle}
                key={index}>
                <CustomText
                  color={colors.black}
                  size={FONT.CAPTION_7}
                  forDriveMe
                  family={FONT_FAMILY.MEDIUM}
                  string={item?.title}
                />
              </Pressable>
            );
          })}
        </PaddingHorizontalWrapper>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default ChatQuickAction;

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: PADDING1,
    paddingBottom: heightScale1(52),
  },
  itemStyle: {
    minHeight: heightScale1(52),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
