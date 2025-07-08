import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import {WebView} from 'react-native-webview';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {height, PADDING, width} from '~constants/constant';
import CustomText from '~components/custom-text';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import HStack from '~components/h-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {}

export interface ParkingVideoRefs {
  show: () => void;
  hide: () => void;
}

const ParkingVideo = forwardRef((props: Props, ref) => {
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

        <WebView
          source={{
            uri: 'https://m.blog.naver.com/parkingpark0413',
          }}
          originWhitelist={['*']}
        />

        <View>
          <View style={styles.noteWrapper}>
            <Text>
              <Text style={styles.text}>
                ※ 참고: 영상내 표시되는 가격은 주차장 사정에 따라 변경될 수 있으며, 정확한 금액은{' '}
              </Text>
              <Text
                style={[
                  styles.text,
                  {
                    color: colors.red,
                    textDecorationLine: 'underline',
                  },
                ]}>
                주차권 구매
              </Text>
              <Text style={styles.text}>에서 확인 부탁드립니다.</Text>
            </Text>
          </View>

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

export default ParkingVideo;

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
    minHeight: heightScale(650),
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
  noteWrapper: {
    marginHorizontal: PADDING,
    marginTop: PADDING / 2,
  },
  text: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.BOLD,
  },
});
