import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import moment from 'moment';
import React, {Ref, forwardRef, useCallback, useImperativeHandle, useRef} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Icons} from '~/assets/svgs';
import Check from '~/assets/svgs/Check';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';
import CustomBackdrop from './custom-backdrop';
import CustomText from './custom-text';

interface Props {
  selected: number | undefined;
  onSelected: (value: number) => void;
  isSelectingEnd?: boolean;
}

export interface MenuDateModelRefs {
  show: () => void;
  hide: () => void;
}

interface MenuDateModel {
  id: string;
  date: number;
}

const ModalMenuDate = forwardRef((props: Props, ref: Ref<any>) => {
  const bottomModalRefs = useRef<BottomSheetModal>(null);
  const {selected, onSelected, isSelectingEnd} = props;

  const show = () => {
    bottomModalRefs.current?.present();
  };

  const hide = () => {
    bottomModalRefs.current?.close();
  };

  useImperativeHandle(ref, () => ({show, hide}), []);

  const data: MenuDateModel[] = Array.from({length: 12}, (_, index) => {
    return {
      id: index.toString(),
      date: isSelectingEnd
        ? moment().subtract(index, 'months').endOf('months').valueOf()
        : moment().subtract(index, 'months').startOf('months').valueOf(),
    };
  });

  const renderBackdrop = useCallback(
    (props: any) => <CustomBackdrop {...props} onPressBackdrop={hide} />,
    [],
  );

  const renderDateItem = useCallback(({item}: {item: MenuDateModel}) => {
    return (
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: heightScale1(50),
        }}
        onPress={() => {
          onSelected(item.date);
          hide();
        }}>
        <CustomText
          string={moment(item.date).format('YYYY년 MM월')}
          color={
            selected && moment(selected).format('YYYYMMDD') === moment(item.date).format('YYYYMMDD')
              ? colors.redSwitch
              : colors.menuTextColor
          }
          size={FONT.CAPTION_7}
          lineHeight={heightScale1(22)}
          forDriveMe
          family={FONT_FAMILY.MEDIUM}
        />
        {selected &&
        moment(selected).format('YYYYMMDD') === moment(item.date).format('YYYYMMDD') ? (
          <Check width={24} height={24} />
        ) : null}
      </Pressable>
    );
  }, []);

  return (
    <BottomSheetModal
      ref={bottomModalRefs}
      handleComponent={() => null}
      snapPoints={['60%']}
      backdropComponent={renderBackdrop}>
      <BottomSheetView style={{flex: 1}}>
        <View style={{marginVertical: heightScale1(30)}}>
          <CustomText
            string="조회기간"
            color={colors.menuTextColor}
            size={FONT.CAPTION_7}
            family={FONT_FAMILY.SEMI_BOLD}
            textStyle={{textAlign: 'center'}}
            forDriveMe
          />
          <Pressable hitSlop={40} onPress={hide} style={styles.backButtonStyle}>
            <Icons.ChevronLeft />
          </Pressable>
        </View>

        <FlatList
          keyExtractor={(_, index) => index.toString()}
          data={data}
          renderItem={renderDateItem}
          contentContainerStyle={styles.containerStyle}
          showsVerticalScrollIndicator={false}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default ModalMenuDate;

const styles = StyleSheet.create({
  backButtonStyle: {
    position: 'absolute',
    left: PADDING1,
  },
  containerStyle: {
    paddingHorizontal: PADDING1,
    paddingBottom: heightScale1(42),
  },
});
