import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import CustomText from '~components/custom-text';
import {strings} from '~constants/strings';
import {height, PADDING, width} from '~constants/constant';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {FONT, FONT_FAMILY} from '~constants/enum';
import WebView from 'react-native-webview';
import HStack from '~components/h-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface ViewParkingLocationModalRefs {
  show: (address: string) => void;
}

const ViewParkingLocationModal = forwardRef((_, ref) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');

  const show = (address: string) => {
    setAddress(address);
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
    setAddress('');
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
      onBackdropPress={hide}
      style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerWrapper}>
          <CustomText
            string={strings?.view_parking_location_modal?.view_parking_location_modal}
            family={FONT_FAMILY.SEMI_BOLD}
            color={colors.white}
          />
        </View>
        <WebView
          source={{
            uri: `http://cafe.wisemobile.kr/imobile/partner_list/map_share_view2.php?eAddress=${address}`,
          }}
          style={styles.mapView}
          originWhitelist={['*']}
        />

        <TouchableWithoutFeedback onPress={hide}>
          <HStack style={styles.confirmWrapper}>
            <Icon name="check" color={colors.white} size={widthScale(15)} />
            <CustomText
              string={` ${strings?.general_text?.confirm}`}
              color={colors.white}
              size={FONT.CAPTION_2}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </HStack>
        </TouchableWithoutFeedback>
      </View>
    </ReactNativeModal>
  );
});

export default ViewParkingLocationModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
  },
  content: {
    width: width * 0.8,
    backgroundColor: colors.white,
    alignSelf: 'center',
    height: height * 0.5,
    borderRadius: widthScale(5),
    overflow: 'hidden',
  },
  headerWrapper: {
    height: heightScale(40),
    backgroundColor: colors.red,
    justifyContent: 'center',
    paddingHorizontal: PADDING,
  },
  mapView: {
    width: width * 0.9,
    marginLeft: -PADDING,
  },
  confirmWrapper: {
    backgroundColor: colors.blue,
    width: widthScale(75),
    minHeight: heightScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: PADDING / 2,
    borderRadius: widthScale(5),
  },
});
