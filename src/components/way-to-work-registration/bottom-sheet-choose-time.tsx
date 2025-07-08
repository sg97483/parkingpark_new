import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {forwardRef, memo, Ref, useCallback, useImperativeHandle, useRef} from 'react';
import {FlatList, Pressable, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icons} from '~/assets/svgs';
import CustomBackdrop from '~components/custom-backdrop';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  onPressChoose: (item: any) => void;
  itemChoose?: any;
  timeList: string[];
}

const BottomSheetChooseTime = forwardRef((props: Props, ref: Ref<BottomSheetModal>) => {
  const {onPressChoose, itemChoose, timeList} = props;
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
      enableDynamicSizing>
      <BottomSheetView>
        <CustomText
          forDriveMe
          family={FONT_FAMILY.SEMI_BOLD}
          textStyle={{textAlign: 'center', marginVertical: heightScale1(30)}}
          string="출발시간"
          size={FONT.CAPTION_7}
        />

        <FlatList
          contentContainerStyle={{paddingHorizontal: PADDING1, paddingBottom: heightScale1(52)}}
          scrollEnabled={false}
          renderItem={({item}) => (
            <Pressable
              onPress={() => {
                onPressChoose?.(item);
                bottomSheetRef.current?.close();
              }}>
              <HStack style={styles.viewItem}>
                <CustomText
                  size={FONT.CAPTION_7}
                  family={FONT_FAMILY.MEDIUM}
                  forDriveMe
                  color={itemChoose === item ? colors.primary : undefined}
                  string={item}
                  lineHeight={heightScale1(22)}
                />
                {itemChoose === item && (
                  <Icons.Check width={widthScale1(24)} height={widthScale1(24)} />
                )}
              </HStack>
            </Pressable>
          )}
          data={timeList}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default memo(BottomSheetChooseTime);

const styles = StyleSheet.create({
  viewContent: {
    marginTop: heightScale1(30),
  },
  viewItem: {
    paddingVertical: heightScale1(15),
    justifyContent: 'space-between',
  },
});
