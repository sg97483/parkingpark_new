import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {WebView} from 'react-native-webview';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {height, PADDING, width} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {CordinateProps} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

interface Props {}

export interface RegisParkingSharedMapRef {
  show: (value: CordinateProps) => void;
  hide: () => void;
}

const RegisterParkingSharedModal = forwardRef((props: Props, ref) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currLocation, setCurrLocation] = useState<CordinateProps | undefined>(undefined);

  const show = (value: CordinateProps) => {
    setCurrLocation(value);
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
      onBackButtonPress={hide}
      onBackdropPress={hide}
      isVisible={isVisible}
      useNativeDriver={true}
      style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.headerWrapper}>
          <CustomText
            string="주차장 주소찾기"
            family={FONT_FAMILY.SEMI_BOLD}
            color={colors.white}
          />
        </View>

        {currLocation ? (
          <WebView
            source={{
              uri: `http://cafe.wisemobile.kr/imobile/partner_list/map_share_view.php?klat=${currLocation?.lat}&klng=${currLocation?.long}`,
            }}
            style={{width: width * 1.7}}
            originWhitelist={['*']}
          />
        ) : null}

        <View>
          <TouchableOpacity onPress={hide}>
            <HStack style={styles.closeButtonWrapper}>
              <Icon name="check" size={widthScale(20)} color={colors.white} />
              <CustomText
                string="확인"
                color={colors.white}
                textStyle={{
                  marginLeft: widthScale(5),
                }}
              />
            </HStack>
          </TouchableOpacity>
        </View>
      </View>
    </ReactNativeModal>
  );
});

export default RegisterParkingSharedModal;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    backgroundColor: 'white',
    minHeight: height * 0.6,
    width: width * 0.85,
  },
  headerWrapper: {
    height: heightScale(50),
    backgroundColor: colors.red,
    justifyContent: 'center',
    paddingHorizontal: PADDING,
  },
  closeButtonWrapper: {
    height: heightScale(40),
    backgroundColor: colors.blue,
    width: widthScale(90),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: widthScale(5),
    alignSelf: 'center',
    marginVertical: PADDING / 2,
  },
});
