import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {forwardRef, useCallback, useImperativeHandle, useMemo, useRef} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import CustomBackdrop from '~components/custom-backdrop';
import CustomText from '~components/custom-text';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

const PASSENGER_LIST_MESSAGE = [
  '안녕하세요. 저랑 출퇴근길이 비슷하시네요!',
  '경로 위치 조정 가능하실까요?',
  '출발 시간을 조금만 변경할수 있을까요?',
  '5분내 카풀 출발지에 도착합니다.',
  '카풀 출발지에서 기다리고 있습니다.',
  '조금만 기다려 주세요.',
];

const DRIVER_LIST_MESSAGE = [
  '안녕하세요. 저랑 출퇴근길이 비슷하시네요!',
  '경로 위치 조정 가능하실까요?',
  '출발 시간을 조금만 변경할수 있을까요?',
  '5분내 카풀 출발지에 도착합니다.',
  '카풀 출발지에서 기다리고 있습니다.',
  '조금만 기다려 주세요.',
];

export interface FrequentlyUsedPhrasesRefs {
  show: () => void;
  hide: () => void;
}

interface Props {
  onSelectMessage: (value: string) => void;
}

const FrequentlyUsedPhrases = forwardRef((props: Props, ref) => {
  const {onSelectMessage} = props;

  const modalRef = useRef<BottomSheetModal>(null);
  const carpoolMode = useAppSelector(state => state?.userReducer?.carpoolMode);

  const listMessages = useMemo(() => {
    if (carpoolMode === 'PASSENGER') {
      return PASSENGER_LIST_MESSAGE;
    }
    return DRIVER_LIST_MESSAGE;
  }, [carpoolMode]);

  const show = useCallback(() => {
    modalRef?.current?.present();
  }, []);

  const hide = useCallback(() => {
    modalRef?.current?.close();
  }, []);

  useImperativeHandle(ref, () => ({show, hide}), []);

  return (
    <BottomSheetModal
      ref={modalRef}
      enableDynamicSizing
      handleComponent={() => null}
      enablePanDownToClose
      index={0}
      backdropComponent={props => <CustomBackdrop {...props} onPressBackdrop={hide} />}>
      <BottomSheetView style={styles.containerStyle}>
        <CustomText
          string="자주쓰는 문구"
          forDriveMe
          size={FONT.CAPTION_7}
          family={FONT_FAMILY.SEMI_BOLD}
          textStyle={styles.headerStyle}
        />
        <PaddingHorizontalWrapper forDriveMe>
          {listMessages?.map((item, index) => {
            return (
              <Pressable
                onPress={() => {
                  hide();
                  onSelectMessage && onSelectMessage(item);
                }}
                style={styles.itemStyle}
                key={index}>
                <CustomText
                  forDriveMe
                  size={FONT.CAPTION_7}
                  family={FONT_FAMILY.MEDIUM}
                  string={item}
                />
              </Pressable>
            );
          })}
        </PaddingHorizontalWrapper>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default FrequentlyUsedPhrases;

const styles = StyleSheet.create({
  containerStyle: {
    paddingBottom: heightScale1(52),
    paddingTop: PADDING1,
  },
  handleIndicatorStyle: {
    width: widthScale1(83),
    height: heightScale1(6),
    borderRadius: 999,
    backgroundColor: colors.grayCheckBox,
    marginVertical: heightScale1(30),
    alignSelf: 'center',
  },
  headerStyle: {
    textAlign: 'center',
    marginBottom: heightScale1(30),
  },
  itemStyle: {
    minHeight: heightScale1(52),
  },
});
