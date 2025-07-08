import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  memo,
  Ref,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {View} from 'react-native';
import CustomButton from '~components/commons/custom-button';
import CustomInput, {CustomInputRefs} from '~components/commons/custom-input';
import CustomRadio from '~components/commons/custom-radio';
import CustomBackdrop from '~components/custom-backdrop';
import CustomText from '~components/custom-text';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {IS_IOS} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';
import {makeCommaNumber} from '~utils/common';

interface Props {
  onSelectPrice?: (price?: string) => void;
}

const BottomSheetChooseDesiredAmount = forwardRef((props: Props, ref: Ref<BottomSheetModal>) => {
  const {onSelectPrice} = props;
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const inputPriceRef = useRef<CustomInputRefs>(null);

  const [priceFare, setPriceFare] = useState(true);
  const [priceInput, setPriceInput] = useState('');

  const disable = useMemo(
    () =>
      !priceFare &&
      !(
        Number(priceInput.replace(/,/g, '')) >= 5000 &&
        Number(priceInput.replace(/,/g, '')) <= 100000
      ),
    [priceFare, priceInput],
  );

  useImperativeHandle(ref, () => bottomSheetRef.current as any, []);

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
      backdropComponent={renderBackdrop}
      handleComponent={() => null}
      enableDynamicSizing>
      <BottomSheetView>
        <CustomText
          forDriveMe
          family={FONT_FAMILY.SEMI_BOLD}
          textStyle={{textAlign: 'center', marginTop: heightScale1(30)}}
          string="희망금액"
          size={FONT.CAPTION_7}
          lineHeight={heightScale1(22)}
        />

        <PaddingHorizontalWrapper
          forDriveMe
          containerStyles={{marginTop: heightScale1(30), gap: heightScale1(30)}}>
          <View style={{gap: heightScale1(10)}}>
            <CustomRadio
              text="표준운임"
              onPress={() => {
                setPriceFare(true);
                setPriceInput('');
              }}
              isChecked={priceFare}
            />

            <CustomText
              forDriveMe
              color={colors.lineCancel}
              string="표준운임은 현 시간 기준 거리와 시간을 고려한 택시 요금의 70% 금액입니다. 단, 카풀 최소금액은 5,000원 이상으로 5,000원 이내의 경로는 5,000원으로 적용됩니다.’"
              lineHeight={heightScale1(20)}
            />
          </View>

          <View style={{gap: heightScale1(6)}}>
            <CustomRadio
              text="선택요금"
              onPress={() => {
                setPriceFare(false);
                setTimeout(() => {
                  inputPriceRef.current?.focusInput();
                }, 100);
              }}
              isChecked={!priceFare}
            />

            <CustomInput
              ref={inputPriceRef}
              isBottomSheet={IS_IOS}
              editable={!priceFare}
              style={{flex: undefined}}
              value={priceInput}
              onChangeText={text => {
                if (text) {
                  setPriceInput(makeCommaNumber(parseInt(text.replace(/,/g, ''), 10)));
                } else {
                  setPriceInput('');
                }
              }}
              placeholder="최소 5,000원 이상 최대 100,000원 이하 금액입력"
              keyboardType="number-pad"
              maxLength={10}
            />
          </View>

          <CustomButton
            onPress={() => {
              if (priceFare) {
                onSelectPrice?.(undefined);
              } else {
                onSelectPrice?.(priceInput.replace(/,/g, ''));
              }
              bottomSheetRef.current?.close();
            }}
            text="등록하기"
            buttonHeight={58}
            disabled={disable}
            buttonStyle={{
              marginTop: heightScale1(10),
              marginBottom: heightScale1(42),
            }}
          />
        </PaddingHorizontalWrapper>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default memo(BottomSheetChooseDesiredAmount);
