import {ActivityIndicator, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import HStack from '~components/h-stack';
import CustomText from '~components/custom-text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {PADDING, width} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import WebView from 'react-native-webview';

export interface ValetRecheckPhoneRefs {
  show: () => void;
}

interface Props {
  memberId: number;
  garageId: number;
  garageName: string;
  outFlightDate: string;
  inFlightDate: string;
  price: number;
  inFlightAndCityName: string;
  outFlightAndCityName: string;
  usepoint: number;
}

const ValetRecheckPhonePopup = forwardRef((props: Props, ref) => {
  const {
    memberId,
    garageId,
    garageName,
    inFlightAndCityName,
    inFlightDate,
    outFlightAndCityName,
    outFlightDate,
    price,
    usepoint,
  } = props;

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const show = () => {
    setIsVisible(true);
    setIsLoading(true);
  };

  const hide = () => {
    setIsVisible(false);
    setIsLoading(true);
  };

  useImperativeHandle(
    ref,
    () => ({
      show,
    }),
    [],
  );

  return (
    <ReactNativeModal isVisible={isVisible} useNativeDriver>
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <HStack>
            <Icon name="alert" size={widthScale(20)} color={colors.white} />
            <CustomText
              string=" 휴대폰 소액결제 서비스"
              color={colors.white}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </HStack>
        </View>
        <View
          style={{
            minHeight: heightScale(300),
          }}>
          <WebView
            source={{
              uri: `http://cafe.wisemobile.kr/imobile/hphone/web/mc_web_valet.php?memberId=${memberId}&garageId=${garageId}&garageName=${garageName}&outFlightDate=${outFlightDate}&inFlightDate=${inFlightDate}&price=${price}&inFlightAndCityName=${inFlightAndCityName}&outFlightAndCityName=${outFlightAndCityName}&usepoint=${usepoint}`,
            }}
            style={{
              width: width * 3,
            }}
            onLoadEnd={() => {
              setIsLoading(false);
            }}
            originWhitelist={['*']}
          />
          {isLoading ? (
            <View style={styles.placeholderView}>
              <ActivityIndicator color={colors.red} />
            </View>
          ) : null}
        </View>
        <View style={styles.textViewWrapper}>
          <HStack style={{alignItems: 'flex-start'}}>
            <Icon name="map-marker-alert" size={widthScale(35)} color={colors.darkGray} />
            <View style={{flex: 1, marginLeft: widthScale(5)}}>
              <CustomText
                string={
                  "- 주차장 이용약관을 지켜주시고, 주차장 내에서 발생하는 모든 사고에 대해서는 '파킹박'이 책임지지 않습니다.\n\n- 예약한 이용시간 이외에 출차할 경우에는 추가 주차요금이 과금되거나 출차가 제한될 수 있습니다.\n\n- 고객센터 : 02-707-3371"
                }
                size={FONT.CAPTION}
                family={FONT_FAMILY.SEMI_BOLD}
                color={colors.darkGray}
              />
            </View>
          </HStack>
        </View>

        <TouchableOpacity onPress={hide} style={styles.closeButton}>
          <CustomText string="닫기" />
        </TouchableOpacity>
      </View>
    </ReactNativeModal>
  );
});

export default ValetRecheckPhonePopup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  headerWrapper: {
    height: heightScale(45),
    backgroundColor: colors.red,
    justifyContent: 'center',
    paddingLeft: PADDING,
  },
  textViewWrapper: {
    backgroundColor: colors.gray,
    margin: PADDING / 3,
    padding: PADDING / 3,
  },
  closeButton: {
    borderWidth: 1,
    height: heightScale(35),
    width: widthScale(80),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: PADDING / 2,
    borderColor: colors.darkGray,
    backgroundColor: colors.gray,
    borderRadius: widthScale(5),
  },
  placeholderView: {
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
