import React, {forwardRef, useCallback, useImperativeHandle, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {REPORT_QNA_LIST} from '~constants/data';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {ReportTypeModel} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  onItemPress: (value: ReportTypeModel) => void;
}

export interface ParkingQuestionNoticeSubjectSelectorRefs {
  show: (selectedValue: ReportTypeModel) => void;
}

const ParkingQuestionNoticeSubjectSelector = forwardRef((props: Props, ref) => {
  const {onItemPress} = props;

  const [selectedValue, setSelectedValue] = useState<ReportTypeModel | undefined>(undefined);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const show = useCallback((value: ReportTypeModel) => {
    setSelectedValue(value);
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    setSelectedValue(undefined);
    setIsVisible(false);
  }, []);

  useImperativeHandle(ref, () => ({show}), []);

  const handlePressItem = useCallback(
    (value: ReportTypeModel) => () => {
      onItemPress && onItemPress(value);
      hide();
    },
    [onItemPress, hide],
  );

  return (
    <ReactNativeModal
      onBackButtonPress={hide}
      onBackdropPress={hide}
      useNativeDriver
      style={styles.containerStyle}
      isVisible={isVisible}>
      <View
        style={[
          styles.contentStyle,
          {
            paddingBottom: heightScale1(52),
          },
        ]}>
        <CustomText
          string="상세문의내역"
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.BODY}
          forDriveMe
          textStyle={styles.headerStyle}
        />

        {REPORT_QNA_LIST?.flatMap((item, index) => {
          return (
            <Pressable onPress={handlePressItem(item)} key={index}>
              <HStack style={styles.itemWrapperStyle}>
                <CustomText
                  size={FONT.CAPTION_7}
                  forDriveMe
                  string={item?.title}
                  family={FONT_FAMILY.MEDIUM}
                  color={item?.title === selectedValue?.title ? colors.primary : colors.black}
                />
                <Icons.Check
                  stroke={
                    item?.title === selectedValue?.title ? colors.primary : colors.transparent
                  }
                  width={widthScale1(24)}
                  height={widthScale1(24)}
                />
              </HStack>
            </Pressable>
          );
        })}
      </View>
    </ReactNativeModal>
  );
});

export default ParkingQuestionNoticeSubjectSelector;

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
  headerStyle: {
    textAlign: 'center',
    marginVertical: heightScale1(30),
  },
  itemWrapperStyle: {
    justifyContent: 'space-between',
    minHeight: heightScale1(50),
  },
});
