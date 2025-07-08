import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import {CordinateProps} from '~constants/types';
import {WebView} from 'react-native-webview';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {height, PADDING, width} from '~constants/constant';
import CustomText from '~components/custom-text';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import HStack from '~components/h-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  cordinate: CordinateProps;
}

export interface ParkingStreetViewRefs {
  show: (value: CordinateProps) => void;
  hide: () => void;
}

const ParkingStreetView = forwardRef((props: Props, ref) => {
  const {cordinate} = props;
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
      onBackButtonPress={hide}
      onBackdropPress={hide}
      isVisible={isVisible}
      useNativeDriver={true}
      style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.headerWrapper}>
          <CustomText
            string="주차장 주변 거리뷰 보기"
            family={FONT_FAMILY.SEMI_BOLD}
            color={colors.white}
          />
        </View>
        {cordinate ? (
          <WebView
            source={{
              uri: `http://cafe.wisemobile.kr/imobile/partner_list/map_daum_view.php?klat=${cordinate?.lat}&klng=${cordinate?.long}`,
            }}
            style={{width: width + PADDING * 1.2}}
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

export default ParkingStreetView;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  webWrapper: {
    maxHeight: height * 0.5,
    zIndex: 1,
  },
  contentWrapper: {
    backgroundColor: 'white',
    minHeight: heightScale(450),
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
