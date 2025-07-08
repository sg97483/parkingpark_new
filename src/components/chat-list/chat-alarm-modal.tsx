import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {forwardRef, memo, useCallback, useImperativeHandle, useRef} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomBackdrop from '~components/custom-backdrop';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  onChatAlarmPress: (value: string) => void;
  selectedAlarm:
    | {
        roomID: string;
        day: string;
        time: string;
        type: string;
      }
    | undefined;
}
interface ChartAlarmItem {
  title: string;
  isFocused: boolean;
  onPress: () => void;
}
export interface ChatAlarmModalRefs {
  show: () => void;
  hide: () => void;
}

const ALARM_DATA: {title: string; value: string}[] = [
  {
    title: '없음',
    value: '',
  },
  {
    title: '5분 전',
    value: '5M',
  },
  {
    title: '15분 전',
    value: '15M',
  },
  {
    title: '30분 전',
    value: '30M',
  },
  {
    title: '1시간 전',
    value: '1H',
  },
  {
    title: '2시간 전',
    value: '2H',
  },
];

const ChatAlarmItem: React.FC<ChartAlarmItem> = memo(props => {
  const {onPress, title, isFocused} = props;

  return (
    <Pressable onPress={onPress}>
      <HStack style={styles.chatItemContainerStyle}>
        <CustomText forDriveMe size={FONT.CAPTION_7} family={FONT_FAMILY.MEDIUM} string={title} />
        <Icons.Check opacity={isFocused ? 1 : 0} width={widthScale1(24)} height={widthScale1(24)} />
      </HStack>
    </Pressable>
  );
});

const ChatAlarmModal = forwardRef((props: Props, ref) => {
  const {onChatAlarmPress, selectedAlarm} = props;

  const modalRef = useRef<BottomSheetModal>(null);

  const show = useCallback(() => {
    modalRef?.current?.present();
  }, []);

  const hide = useCallback(() => {
    modalRef?.current?.close();
  }, []);

  useImperativeHandle(ref, () => ({show, hide}), [show, hide]);

  return (
    <BottomSheetModal
      backdropComponent={props => <CustomBackdrop {...props} onPressBackdrop={hide} />}
      enableDynamicSizing
      index={0}
      handleComponent={null}
      ref={modalRef}>
      <BottomSheetView style={styles.containerStyle}>
        <CustomText
          forDriveMe
          size={FONT.CAPTION_7}
          family={FONT_FAMILY.SEMI_BOLD}
          string="알림설정"
          textStyle={styles.headerTextStyle}
        />

        <View>
          {ALARM_DATA?.flatMap((item, index) => {
            return (
              <ChatAlarmItem
                key={index}
                title={item?.title}
                isFocused={(selectedAlarm?.type ?? '') === item?.value}
                onPress={() => {
                  hide();
                  onChatAlarmPress && onChatAlarmPress(item?.value);
                }}
              />
            );
          })}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default ChatAlarmModal;

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: PADDING1,
    paddingBottom: heightScale1(52),
  },
  headerTextStyle: {
    paddingTop: PADDING1,
    paddingBottom: heightScale1(30),
    textAlign: 'center',
  },
  chatItemContainerStyle: {
    height: heightScale1(50),
    justifyContent: 'space-between',
  },
});
