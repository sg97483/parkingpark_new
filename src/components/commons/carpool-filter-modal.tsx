import {BottomSheetBackdropProps, BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {forwardRef, memo, useCallback, useImperativeHandle, useRef} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import CustomBoxSelectButton from '~components/commons/custom-box-select-button';
import CustomButton from '~components/commons/custom-button';
import DateFilter from '~components/commons/date-filter';
import CustomBackdrop from '~components/custom-backdrop';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  onConfirmPress?: () => void;
  onSelectFromDate?: () => void;
  onSelectToDate?: () => void;
}

export interface CarpoolFilterModalRefs {
  show: () => void;
  hide: () => void;
}

const CarpoolFilterModal = forwardRef((props: Props, ref) => {
  const {onConfirmPress, onSelectFromDate, onSelectToDate} = props;
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const show = () => {
    bottomSheetRef?.current?.present();
  };

  const hide = () => {
    bottomSheetRef?.current?.close();
  };

  useImperativeHandle(ref, () => ({show, hide}), []);

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => {
    return <CustomBackdrop {...props} onPressBackdrop={hide} />;
  }, []);

  return (
    <BottomSheetModal
      handleComponent={() => null}
      enablePanDownToClose
      index={0}
      ref={bottomSheetRef}
      backdropComponent={renderBackdrop}
      enableDynamicSizing>
      <BottomSheetView style={styles.contentContainerStyle}>
        <StatusBar backgroundColor={colors.transparent} />

        <CustomText
          size={FONT.CAPTION_7}
          forDriveMe
          family={FONT_FAMILY.SEMI_BOLD}
          string="필터링"
          textStyle={styles.headerTextStyle}
        />
        <View style={{gap: heightScale1(30)}}>
          <View style={styles.menuItemWrapperStyle}>
            <CustomText
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION_7}
              string="경로"
            />

            <HStack style={styles.rowStyle}>
              <CustomBoxSelectButton text="출근길" />
              <CustomBoxSelectButton text="퇴근길" />
            </HStack>
          </View>

          <DateFilter
            type={'TWO_WEEKS'}
            onStartDatePress={onSelectFromDate}
            onEndDatePress={onSelectToDate}
          />
        </View>

        <HStack style={styles.buttonGroupStyle}>
          <CustomButton
            leftIconReload
            type="TERTIARY"
            outLine
            buttonHeight={58}
            text="초기화"
            buttonStyle={styles.resetButtonStyle}
            onPress={() => {}}
          />
          <CustomButton
            onPress={hide}
            buttonHeight={58}
            text="초기화"
            buttonStyle={styles.confirmButtonStyle}
          />
        </HStack>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default memo(CarpoolFilterModal);

const styles = StyleSheet.create({
  contentContainerStyle: {
    backgroundColor: colors.white,
    paddingHorizontal: PADDING1,
    paddingBottom: heightScale1(42),
    borderTopLeftRadius: scale1(16),
    borderTopRightRadius: scale1(16),
  },
  headerTextStyle: {
    textAlign: 'center',
    marginVertical: heightScale1(30),
  },
  menuItemWrapperStyle: {
    gap: heightScale1(10),
  },
  rowStyle: {
    gap: widthScale1(10),
    flexWrap: 'wrap',
  },
  buttonGroupStyle: {
    marginTop: heightScale1(40),
    gap: widthScale1(10),
  },
  confirmButtonStyle: {
    flex: 1,
  },
  resetButtonStyle: {
    minWidth: widthScale1(100),
  },
});
