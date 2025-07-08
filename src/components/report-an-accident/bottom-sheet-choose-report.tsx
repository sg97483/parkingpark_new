import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {forwardRef, memo, Ref, useCallback, useImperativeHandle, useRef} from 'react';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomBackdrop from '~components/custom-backdrop';
import CustomText from '~components/custom-text';
import {FONT_FAMILY} from '~constants/enum';
import {heightScale, widthScale1} from '~styles/scaling-utils';
import {strings} from '~constants/strings';
import {generateRandomId} from '~utils/encrypt';
import {PADDING} from '~constants/constant';
import {Icons} from '~/assets/svgs';
import {colors} from '~styles/colors';

interface Props {
  reportType: string;
  chooseReport: (report: string) => void;
}

const text = strings.report_an_accident;
const BottomSheetChooseReport = forwardRef((props: Props, ref: Ref<BottomSheetModal>) => {
  const {reportType, chooseReport} = props;

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const insertSafe = useSafeAreaInsets();
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
      index={0}
      backdropComponent={renderBackdrop}
      handleComponent={() => null}
      topInset={insertSafe.top}
      enablePanDownToClose={false}
      snapPoints={[heightScale(600)]}>
      <BottomSheetScrollView>
        <CustomText
          family={FONT_FAMILY.SEMI_BOLD}
          textStyle={{textAlign: 'center', marginVertical: heightScale(30)}}
          string="희망금액"
        />
        <View style={{marginHorizontal: PADDING}}>
          {text.question.map(item => (
            <TouchableOpacity
              onPress={() => {
                chooseReport?.(item);
                bottomSheetRef.current?.close();
              }}
              style={styles.item}
              key={generateRandomId()}>
              <CustomText
                color={reportType === item ? colors.redButton : colors.black}
                string={item}
              />
              {reportType === item && (
                <Icons.Check width={widthScale1(24)} height={widthScale1(24)} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

export default memo(BottomSheetChooseReport);
const styles = StyleSheet.create({
  item: {
    paddingVertical: heightScale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
