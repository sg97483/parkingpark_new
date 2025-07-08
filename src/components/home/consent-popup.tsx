import React, {forwardRef, memo, useImperativeHandle, useState} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch} from 'react-redux';
import CustomButton from '~components/commons/custom-button';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {cacheIsAgreeTerms} from '~reducers/termAndContionReducer';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

export interface ConsentPopupRefs {
  show: () => void;
  hide: () => void;
}

const ConsentPopup = forwardRef((_, ref) => {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useImperativeHandle(
    ref,
    () => ({
      show,
      hide,
    }),
    [],
  );

  const show = () => {
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
  };

  const onPressAgree = () => {
    hide();
    dispatch(cacheIsAgreeTerms(true));
  };

  return (
    <Modal style={styles.containerStyle} isVisible={isVisible} useNativeDriver={true}>
      <View style={styles.contentContainerStyle}>
        <CustomText
          forDriveMe
          color={colors.black}
          size={FONT.BODY}
          family={FONT_FAMILY.SEMI_BOLD}
          string="파킹박 서비스 이용동의"
          textStyle={{
            textAlign: 'center',
          }}
        />

        <View style={styles.contentStyle}>
          <HStack style={styles.itemStyle}>
            <CustomText forDriveMe family={FONT_FAMILY.MEDIUM} string="이용약관" />
            <CustomButton
              type="TERTIARY"
              outLine
              textSize={FONT.CAPTION_2}
              buttonHeight={30}
              text="내용보기"
              rightIconReload
              iconType="CHEVRON"
              buttonStyle={{
                paddingHorizontal: widthScale1(10),
              }}
              onPress={() => {
                Linking.openURL(
                  'https://wisemobile.notion.site/b3c3bb0d254c41ccb0cd810d2888b6ac?pvs=4',
                );
              }}
            />
          </HStack>
          <HStack style={styles.itemStyle}>
            <CustomText forDriveMe family={FONT_FAMILY.MEDIUM} string="개인정보 취급방침" />
            <CustomButton
              type="TERTIARY"
              outLine
              textSize={FONT.CAPTION_2}
              buttonHeight={30}
              text="내용보기"
              rightIconReload
              iconType="CHEVRON"
              buttonStyle={{
                paddingHorizontal: widthScale1(10),
              }}
              onPress={() => {
                Linking.openURL(
                  'https://wisemobile.notion.site/c0d7df4d63e64e1db545f01b83f05e30?pvs=4',
                );
              }}
            />
          </HStack>
          <HStack style={styles.itemStyle}>
            <CustomText forDriveMe family={FONT_FAMILY.MEDIUM} string="위치정보 서비스 이용약관" />
            <CustomButton
              type="TERTIARY"
              outLine
              textSize={FONT.CAPTION_2}
              buttonHeight={30}
              text="내용보기"
              rightIconReload
              iconType="CHEVRON"
              buttonStyle={{
                paddingHorizontal: widthScale1(10),
              }}
              onPress={() => {
                Linking.openURL(
                  'https://wisemobile.notion.site/c451c8d33b4146eab6c0e76886b36452?pvs=4',
                );
              }}
            />
          </HStack>
        </View>

        <CustomButton
          onPress={onPressAgree}
          text="동의합니다."
          buttonHeight={59}
          buttonStyle={{
            marginTop: heightScale1(10),
          }}
        />
      </View>
    </Modal>
  );
});

export default memo(ConsentPopup);

const styles = StyleSheet.create({
  containerStyle: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainerStyle: {
    width: widthScale1(311),
    backgroundColor: colors.white,
    borderRadius: scale1(8),
    padding: PADDING1,
    gap: PADDING1,
  },
  contentStyle: {
    padding: widthScale1(16),
    borderRadius: scale1(8),
    backgroundColor: colors.policy,
    gap: heightScale1(14),
  },
  itemStyle: {
    justifyContent: 'space-between',
  },
});
