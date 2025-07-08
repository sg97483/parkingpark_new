import React, {forwardRef, useCallback, useImperativeHandle, useState} from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icons} from '~/assets/svgs';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY, REPORT_TYPE} from '~constants/enum';
import {REPORT_DRIVER_DATA} from '~screens/report-driver/report-driver-step-1';
import {REPORT_PASSENGER_DATA} from '~screens/report-passenger.tsx/report-pass-step-1';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import CustomText from './custom-text';
import HStack from './h-stack';

interface Props {
  type: 'REPORT_PASSENGER' | 'REPORT_DRIVER';
  onSelectedType: (value: REPORT_TYPE) => void;
}

export interface SelectReportTypeModalRefs {
  show: (value: REPORT_TYPE) => void;
  hide: () => void;
}

const SelectReportTypeModal = forwardRef((props: Props, ref) => {
  const {type, onSelectedType} = props;
  const insets = useSafeAreaInsets();

  const [selectedType, setSelectedType] = useState<REPORT_TYPE | undefined>(undefined);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const show = useCallback((value: REPORT_TYPE) => {
    setSelectedType(value);
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    setSelectedType(undefined);
    setIsVisible(false);
  }, []);

  useImperativeHandle(ref, () => ({show, hide}), []);

  const renderItem = useCallback(
    ({item}: {item: {title: string; value: REPORT_TYPE}}) => {
      return (
        <Pressable
          onPress={() => {
            hide();
            onSelectedType && onSelectedType(item?.value);
          }}>
          <HStack style={styles.menuWrapperStyle}>
            <CustomText
              string={item?.title}
              size={FONT.CAPTION_7}
              color={selectedType === item?.value ? colors.primary : colors.black}
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              lineHeight={heightScale1(22)}
            />
            <Icons.Check
              width={widthScale1(24)}
              height={widthScale1(24)}
              stroke={selectedType === item?.value ? colors.primary : colors.transparent}
            />
          </HStack>
        </Pressable>
      );
    },
    [selectedType],
  );

  return (
    <ReactNativeModal
      style={styles.containerStyle}
      isVisible={isVisible}
      useNativeDriver
      onBackdropPress={hide}
      onBackButtonPress={hide}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}>
      <View style={styles.contentStyle}>
        <CustomText
          string="신고내용"
          size={FONT.CAPTION_7}
          textStyle={{
            textAlign: 'center',
            marginVertical: heightScale1(30),
          }}
          forDriveMe
          family={FONT_FAMILY.SEMI_BOLD}
        />

        <FlatList
          data={type === 'REPORT_PASSENGER' ? REPORT_PASSENGER_DATA : REPORT_DRIVER_DATA}
          keyExtractor={item => item?.value}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingBottom: heightScale1(42),
          }}
          scrollEnabled={false}
        />
      </View>
    </ReactNativeModal>
  );
});

export default SelectReportTypeModal;

const styles = StyleSheet.create({
  containerStyle: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  contentStyle: {
    backgroundColor: colors.white,
    paddingHorizontal: PADDING1,
    borderTopLeftRadius: scale1(16),
    borderTopRightRadius: scale1(16),
  },
  menuWrapperStyle: {
    minHeight: heightScale1(50),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
