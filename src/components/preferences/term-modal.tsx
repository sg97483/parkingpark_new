import {ScrollView, StyleSheet, View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import {colors} from '~styles/colors';
import {height, PADDING} from '~constants/constant';
import HStack from '~components/h-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '~components/custom-text';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {months_rule} from '~constants/months-rule';
import {FONT_FAMILY} from '~constants/enum';

export interface TermModalRefs {
  show: () => void;
  hide: () => void;
}

interface Props {
  content?: string;
}

const TermModal = forwardRef((props: Props, ref) => {
  const {content} = props;
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
      hide,
    }),
    [],
  );

  return (
    <ReactNativeModal
      onBackdropPress={hide}
      onBackButtonPress={hide}
      isVisible={isVisible}
      useNativeDriver={true}>
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <HStack>
            <Icon name="alert" color={colors.white} size={widthScale(20)} />
            <CustomText
              string="월주차 이용안내 및 취소, 환불 규정"
              color={colors.white}
              textStyle={{marginLeft: widthScale(10)}}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </HStack>
        </View>
        <ScrollView style={styles.content}>
          <CustomText string={content ? content : months_rule} />
        </ScrollView>
      </View>
    </ReactNativeModal>
  );
});

export default TermModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    maxHeight: height * 0.85,
  },
  headerWrapper: {
    height: heightScale(50),
    backgroundColor: colors.red,
    justifyContent: 'center',
    paddingHorizontal: PADDING,
  },
  content: {
    paddingHorizontal: PADDING / 2,
  },
});
