import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {forwardRef, useCallback, useImperativeHandle, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import CustomRadio from '~components/commons/custom-radio';
import CustomBackdrop from '~components/custom-backdrop';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';
import {getNumberWithCommas} from '~utils/numberUtils';
import CustomButton from './custom-button';

// Figma UI: https://prnt.sc/ggn0InQdse3n

interface Props {
  onSubmit: (value: 'E' | 'M') => void;
}

export interface SelectRequestPathModalRefs {
  show: (stopOverPrice: string, price: string) => void;
}

const SelectRequestPathModal = forwardRef((props: Props, ref) => {
  const {onSubmit} = props;
  const modalRef = useRef<BottomSheetModal>(null);

  const [pathPrice, setPathPrice] = useState<
    | {
        stopOverPrice: string;
        price: string;
      }
    | undefined
  >(undefined);
  const [selectedPath, setSelectedPath] = useState<'E' | 'M'>('E'); //E end point, M: stopover

  const show = useCallback((stopOverPrice: string, price: string) => {
    setPathPrice({
      price,
      stopOverPrice,
    });
    modalRef?.current?.present();
  }, []);

  const hide = useCallback(() => {
    modalRef?.current?.close();
  }, []);

  useImperativeHandle(ref, () => ({show}), []);

  return (
    <BottomSheetModal
      backdropComponent={props => <CustomBackdrop {...props} onPressBackdrop={hide} />}
      ref={modalRef}
      enableDynamicSizing
      handleComponent={() => null}
      index={0}>
      <BottomSheetView style={styles.containerStyle}>
        <CustomText
          size={FONT.CAPTION_7}
          family={FONT_FAMILY.SEMI_BOLD}
          forDriveMe
          string="요청경로 선택"
          textStyle={styles.headerTextStyle}
        />

        {/* End point */}
        <HStack style={styles.itemStyle}>
          <CustomRadio
            text="도착지까지 요청하기"
            onPress={() => setSelectedPath('E')}
            isChecked={selectedPath === 'E'}
          />
          <CustomText
            forDriveMe
            size={FONT.CAPTION_7}
            family={FONT_FAMILY.SEMI_BOLD}
            string={`${getNumberWithCommas(pathPrice?.price ?? '')}원`}
            color={selectedPath === 'E' ? colors.heavyGray : colors.grayText}
          />
        </HStack>

        {/* Stopover point */}
        <HStack style={styles.itemStyle}>
          <CustomRadio
            onPress={() => setSelectedPath('M')}
            text="경유지까지 요청하기"
            isChecked={selectedPath === 'M'}
          />
          <CustomText
            forDriveMe
            size={FONT.CAPTION_7}
            family={FONT_FAMILY.SEMI_BOLD}
            string={`${getNumberWithCommas(pathPrice?.stopOverPrice ?? '')}원`}
            color={selectedPath === 'M' ? colors.heavyGray : colors.grayText}
          />
        </HStack>

        <CustomButton
          text="카풀 요청하기"
          buttonHeight={58}
          buttonStyle={styles.submitButtonStyle}
          onPress={() => {
            hide();
            onSubmit && onSubmit(selectedPath);
          }}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});
export default SelectRequestPathModal;

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: PADDING1,
    paddingBottom: heightScale1(42),
    paddingTop: PADDING1,
    gap: heightScale1(30),
  },
  headerTextStyle: {
    textAlign: 'center',
  },
  submitButtonStyle: {
    marginTop: heightScale1(10),
  },
  itemStyle: {
    justifyContent: 'space-between',
  },
});
