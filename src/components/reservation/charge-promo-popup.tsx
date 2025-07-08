import {ImageBackground, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import {IMAGES} from '~/assets/images-path';
import {height, PADDING, width} from '~constants/constant';
import CustomText from '~components/custom-text';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {UseRootStackNavigation} from '~navigators/stack';
import {useNavigation} from '@react-navigation/native';

interface Props {
  onConfirmPress: () => void;
}

export interface ChargePromoRefs {
  show: () => void;
}

const ChargePromoPopup = forwardRef((props: Props, ref) => {
  const {onConfirmPress} = props;
  const navigation: UseRootStackNavigation = useNavigation();

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const show = () => {
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
    navigation.goBack();
  };

  useImperativeHandle(ref, () => ({show}), []);

  return (
    <ReactNativeModal
      onBackButtonPress={hide}
      onBackdropPress={hide}
      isVisible={isVisible}
      useNativeDriver>
      <View style={styles.container}>
        <ImageBackground style={{flex: 1}} resizeMode="stretch" source={IMAGES.charge_promo}>
          <TouchableOpacity
            onPress={() => {
              hide();
              onConfirmPress && onConfirmPress();
            }}
            style={styles.buttonWrapper}>
            <CustomText string="충전 혜택 받으러 가기" color={colors.white} />
          </TouchableOpacity>
        </ImageBackground>
      </View>
    </ReactNativeModal>
  );
});

export default ChargePromoPopup;

const styles = StyleSheet.create({
  container: {
    height: height * 0.7,
    width: width * 0.8,
    alignSelf: 'center',
  },
  buttonWrapper: {
    backgroundColor: colors.red,
    marginTop: 'auto',
    bottom: PADDING * 3,
    width: width * 0.6,
    alignSelf: 'center',
    height: heightScale(45),
    borderRadius: widthScale(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
