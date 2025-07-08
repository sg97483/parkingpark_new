import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  memo,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomBackdrop from '~components/custom-backdrop';
import CustomText from '~components/custom-text';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {heightScale1} from '~styles/scaling-utils';
import {generateRandomId} from '~utils/encrypt';
import ItemTick from './item-tick';

const text = strings.business_card_and_vaccine_registration.bottom_sheet;

interface Props {
  onPressChoose: (text: string) => void;
  tick: string;
}
const BottomSheetListOccupation = forwardRef((props: Props, ref: Ref<any>) => {
  const {onPressChoose, tick} = props;

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const insert = useSafeAreaInsets();
  const currentIndex = useRef(-1);

  const show = () => {
    bottomSheetRef.current?.present();
  };

  const hide = () => {
    bottomSheetRef.current?.close();
  };

  useImperativeHandle(ref, () => ({show, hide}), []);

  useEffect(() => {
    const onBackPress = () => {
      bottomSheetRef.current?.close();
      return currentIndex.current !== -1;
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
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
      enableDynamicSizing
      onChange={i => {
        currentIndex.current = i;
      }}>
      <BottomSheetView>
        <CustomText
          forDriveMe
          size={FONT.CAPTION_7}
          family={FONT_FAMILY.SEMI_BOLD}
          string={text.title}
          textStyle={styles.title}
        />
        <View style={[styles.list, {marginBottom: heightScale1(52)}]}>
          {text.contents.map(item => (
            <ItemTick
              key={generateRandomId()}
              isChecked={item === tick}
              text={item}
              onPress={() => {
                onPressChoose(item);
                hide();
              }}
            />
          ))}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default memo(BottomSheetListOccupation);

const styles = StyleSheet.create({
  title: {
    marginVertical: heightScale1(30),
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: PADDING1,
  },
});
