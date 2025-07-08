import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  memo,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {BackHandler, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomButton from '~components/commons/custom-button';
import CustomRadio from '~components/commons/custom-radio';
import CustomBackdrop from '~components/custom-backdrop';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale, heightScale1} from '~styles/scaling-utils';

interface Props {
  onPressRequestCarpool: () => void;
}
const BottomSheetSelectRequestPath = forwardRef((props: Props, ref: Ref<BottomSheetModal>) => {
  const {onPressRequestCarpool} = props;

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const currentIndex = useRef(-1);

  const insert = useSafeAreaInsets();

  const [isDestination, setIsDestination] = useState(true);

  useImperativeHandle(ref, () => bottomSheetRef.current!, []);

  useEffect(() => {
    const subBack = BackHandler.addEventListener('hardwareBackPress', () => {
      bottomSheetRef.current?.close();
      return currentIndex.current !== -1;
    });
    return () => subBack.remove();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <CustomBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior={'none'}
        onPressBackdrop={() => bottomSheetRef.current?.close()}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      handleComponent={() => null}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onChange={i => {
        currentIndex.current = i;
      }}
      enableDynamicSizing>
      <BottomSheetView style={styles.view}>
        <CustomText
          size={FONT.CAPTION_7}
          family={FONT_FAMILY.SEMI_BOLD}
          string={'요청경로 선택'}
          textStyle={styles.title}
        />
        <HStack style={styles.viewRadio}>
          <CustomRadio
            isChecked={isDestination}
            text={'도착지까지 요청하기'}
            onPress={() => setIsDestination(true)}
          />
          <CustomText
            color={isDestination ? colors.black : colors.grayText}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_7}
            string={'13,000원'}
            forDriveMe
          />
        </HStack>

        <HStack style={styles.viewRadio}>
          <CustomRadio
            isChecked={!isDestination}
            text={'경유지까지 요청하기'}
            onPress={() => setIsDestination(false)}
          />
          <CustomText
            color={!isDestination ? colors.black : colors.grayText}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_7}
            string={'9,000원'}
            forDriveMe
          />
        </HStack>

        <CustomButton
          buttonHeight={58}
          buttonStyle={{
            marginBottom: insert.bottom + heightScale1(10),
            // alignItems: 'flex-start',
            marginTop: heightScale1(10),
          }}
          onPress={onPressRequestCarpool}
          text="카풀 요청하기"
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default memo(BottomSheetSelectRequestPath);
const styles = StyleSheet.create({
  title: {
    marginVertical: heightScale(30),
    textAlign: 'center',
  },
  view: {
    paddingHorizontal: PADDING,
  },
  radio: {
    marginBottom: heightScale(30),
  },
  viewRadio: {
    justifyContent: 'space-between',
    marginBottom: heightScale1(30),
  },
});
