import {ScrollView, StyleSheet, View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import {colors} from '~styles/colors';
import {height, PADDING} from '~constants/constant';
import HStack from '~components/h-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '~components/custom-text';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {terms_and_conditions} from '~constants/terms-and-conditions';

export interface ViewTermsRefs {
  show: () => void;
}

const ViewTermsPopup = forwardRef((_, ref) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const show = () => {
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
  };

  useImperativeHandle(
    ref,
    () => ({
      show,
    }),
    [],
  );

  return (
    <ReactNativeModal
      isVisible={isVisible}
      useNativeDriver
      onBackButtonPress={hide}
      onBackdropPress={hide}>
      <View style={styles.container}>
        <View style={styles.headerView}>
          <HStack>
            <Icon name="alert" size={widthScale(20)} color={colors.white} />
            <CustomText
              string=" 파킹박 이용약관"
              color={colors.white}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </HStack>
        </View>
        <ScrollView>
          <View style={styles.content}>
            <CustomText string={terms_and_conditions} size={FONT.CAPTION} />
          </View>
        </ScrollView>
      </View>
    </ReactNativeModal>
  );
});

export default ViewTermsPopup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    maxHeight: height * 0.85,
  },
  headerView: {
    height: heightScale(40),
    backgroundColor: colors.red,
    justifyContent: 'center',
    paddingHorizontal: PADDING,
  },
  content: {
    backgroundColor: `${colors.gray}90`,
    margin: PADDING / 2,
    padding: PADDING / 3,
  },
});
