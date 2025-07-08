import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {forwardRef, useCallback, useImperativeHandle, useRef} from 'react';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import CustomText from '~components/custom-text';
import {colors} from '~styles/colors';
import {PADDING1} from '~constants/constant';
import {heightScale1, scale1} from '~styles/scaling-utils';
import CustomBackdrop from '~components/custom-backdrop';
import {FONT, FONT_FAMILY} from '~constants/enum';

interface Props {
  onSelectPath: (value: string) => void;
}

export interface SubscriptionPathModalRefs {
  show: () => void;
}

const DATA = ['웹검색(네이버)', '지인추천', 'SNS', '광고글', '직접입력'];

const SubscriptionPathModal = forwardRef((props: Props, ref) => {
  const {onSelectPath} = props;

  const modalRef = useRef<BottomSheetModal>(null);

  const show = useCallback(() => {
    modalRef?.current?.present();
  }, []);

  const hide = useCallback(() => {
    modalRef?.current?.dismiss();
  }, []);

  useImperativeHandle(ref, () => ({show}), []);

  return (
    <BottomSheetModal
      backdropComponent={props => <CustomBackdrop {...props} onPressBackdrop={hide} />}
      ref={modalRef}
      enableDynamicSizing
      index={0}
      handleComponent={() => null}>
      <BottomSheetView style={styles.containerStyle}>
        {DATA?.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                hide();
                onSelectPath && onSelectPath(item);
              }}
              onPressOut={hide}>
              <CustomText
                forDriveMe
                size={FONT.CAPTION_7}
                family={FONT_FAMILY.MEDIUM}
                string={item}
                textStyle={{
                  textAlign: 'center',
                }}
              />
            </TouchableOpacity>
          );
        })}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default SubscriptionPathModal;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: colors.white,
    paddingHorizontal: PADDING1,
    paddingTop: heightScale1(30),
    paddingBottom: heightScale1(52),
    gap: heightScale1(30),
    borderTopLeftRadius: scale1(16),
    borderTopRightRadius: scale1(16),
  },
});
