import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {
  Ref,
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {StyleSheet, View} from 'react-native';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {heightScale1} from '~styles/scaling-utils';
import {generateRandomId} from '~utils/encrypt';
import ViewCard from './bottom-sheet-select-payment-method/view-card';
import CustomBackdrop from './custom-backdrop';
import CustomText from './custom-text';
import CustomButton from './commons/custom-button';

const arrayCard = [
  {number: '1111-****-****-1111', name: 'KB국민 • 신용', id: 'akjdbakjb'},
  {number: '1111-****-****-9999', name: 'KB국민 • 신용', id: 'okokkbhvkmk'},
];

const BottomSheetSelectPaymentMethod = forwardRef((props, ref: Ref<BottomSheetModal>) => {
  const {} = props;

  const [idCardChoose, setIdCardChoose] = useState(arrayCard[0].id);

  const bottomSheet = useRef<BottomSheetModal>(null);

  useImperativeHandle(ref, () => bottomSheet.current as any, []);

  const onPressPayment = useCallback(() => {
    bottomSheet.current?.close();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <CustomBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior={'none'}
        onPressBackdrop={() => bottomSheet.current?.close()}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheet}
      index={0}
      handleComponent={() => null}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      enableDynamicSizing>
      <BottomSheetView style={styles.containerStyle}>
        <CustomText
          size={FONT.CAPTION_7}
          family={FONT_FAMILY.SEMI_BOLD}
          string={'결제수단선택'}
          textStyle={styles.title}
          forDriveMe
        />

        <View style={styles.viewListCard}>
          {arrayCard.map(item => (
            <ViewCard
              onPress={() => setIdCardChoose(item.id)}
              key={generateRandomId()}
              isChecked={idCardChoose === item.id}
              numberCard={item.number}
              name={item.name}
            />
          ))}
        </View>

        <View style={styles.buttonWrapperStyle}>
          <CustomButton text="결제하기" onPress={onPressPayment} buttonHeight={58} />
          <CustomButton
            iconType="PLUS"
            type="TERTIARY"
            outLine
            leftIconReload
            text="결제수단추가"
            onPress={onPressPayment}
            buttonHeight={58}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default memo(BottomSheetSelectPaymentMethod);

const styles = StyleSheet.create({
  containerStyle: {
    gap: heightScale1(30),
  },
  title: {marginTop: heightScale1(30), textAlign: 'center'},
  viewListCard: {marginHorizontal: PADDING1, gap: heightScale1(30)},
  buttonWrapperStyle: {
    gap: heightScale1(10),
    marginTop: heightScale1(10),
    marginBottom: heightScale1(42),
    marginHorizontal: PADDING1,
  },
});
