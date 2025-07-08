import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import React, {forwardRef, memo, Ref, useCallback, useImperativeHandle, useRef} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomBackdrop from '~components/custom-backdrop';
import CustomText from '~components/custom-text';
import {RefModal} from '~components/report-an-accident/popup-success-report';
import {PADDING} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {colors} from '~styles/colors';
import {heightScale, widthScale1} from '~styles/scaling-utils';

const text = strings.register_inquiry;
interface Props {
  itemChoose?: string;
  onChoose?: (_: string) => void;
}
const ChooseInquiryDetail = forwardRef((props: Props, ref: Ref<RefModal>) => {
  const {itemChoose, onChoose} = props;
  const bottomSheet = useRef<BottomSheetModal>(null);

  const show = () => bottomSheet.current?.present();
  const hide = () => bottomSheet.current?.close();
  useImperativeHandle(ref, () => ({show, hide}), []);

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
      backdropComponent={renderBackdrop}
      handleComponent={() => null}
      snapPoints={[heightScale(400)]}>
      <BottomSheetScrollView style={styles.view}>
        <CustomText family={FONT_FAMILY.SEMI_BOLD} textStyle={styles.title} string="상세문의내역" />
        {text.inquiry.map(item => (
          <TouchableOpacity
            onPress={() => {
              onChoose?.(item);
              hide();
            }}
            style={styles.item}
            key={item}>
            <CustomText
              color={itemChoose === item ? colors.redButton : colors.black}
              string={item}
            />
            {itemChoose === item && (
              <Icons.Check width={widthScale1(24)} height={widthScale1(24)} />
            )}
          </TouchableOpacity>
        ))}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

export default memo(ChooseInquiryDetail);
const styles = StyleSheet.create({
  view: {
    paddingHorizontal: PADDING,
  },
  item: {
    height: heightScale(55),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginVertical: heightScale(30),
  },
});
