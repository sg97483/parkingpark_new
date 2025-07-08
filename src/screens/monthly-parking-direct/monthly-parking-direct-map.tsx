import React, {memo, useRef} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import WebView from 'react-native-webview';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import Spinner from '~components/spinner';
import {PADDING} from '~constants/constant';
import {FONT} from '~constants/enum';
import {strings} from '~constants/strings';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

const MonthlyParkingDirectMap = memo((props: RootStackScreenProps<'MonthlyParkingDirectMap'>) => {
  const {navigation} = props;

  const webviewRef = useRef<WebView>(null);

  const userToken = useAppSelector(state => state?.userReducer?.userToken);
  const currentLocation = useAppSelector(state => state?.coordinateReducer?.userCordinate);

  return (
    <FixedContainer>
      <CustomHeader
        text="월주차 직거래 보기"
        rightContent={
          <TouchableOpacity
            onPress={() => {
              if (!userToken?.id || !userToken?.password) {
                showMessage({
                  message: strings?.general_text?.login_first,
                });
                navigation.navigate(ROUTE_KEY.Login);
              } else {
                navigation.navigate(ROUTE_KEY.MonthlyParkingDirectRegistration);
              }
            }}
            style={styles.createButtonWrapper}>
            <HStack>
              <Icon name="pencil" size={widthScale(15)} color={colors.white} />
              <CustomText
                string={` ${strings?.general_text?.writting}`}
                color={colors.white}
                size={FONT.CAPTION_2}
              />
            </HStack>
          </TouchableOpacity>
        }
      />

      <HStack style={styles.buttonWrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <HStack style={styles.button}>
            <Icon name="menu" color={colors.white} size={widthScale(20)} />
            <CustomText string=" 리스트" color={colors.white} />
          </HStack>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => webviewRef?.current?.reload()}
          style={{marginLeft: PADDING / 2}}>
          <HStack style={styles.button}>
            <Icon name="map-marker" color={colors.white} size={widthScale(20)} />
            <CustomText string=" 지도보기" color={colors.white} />
          </HStack>
        </TouchableOpacity>
      </HStack>
      <Divider />

      <WebView
        source={{
          uri: `http://cafe.wisemobile.kr/imobile/partner_list/month_list_view.php?klat=${currentLocation?.lat}&klng=${currentLocation?.long}`,
        }}
        ref={webviewRef}
        style={styles.content}
        onLayout={() => Spinner.show()}
        onLoadEnd={() => Spinner.hide()}
        originWhitelist={['*']}
      />
    </FixedContainer>
  );
});
export default MonthlyParkingDirectMap;

const styles = StyleSheet.create({
  createButtonWrapper: {
    backgroundColor: colors.red,
    height: heightScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: PADDING / 2,
    borderRadius: widthScale(5),
  },
  content: {
    flex: 1,
  },
  buttonWrapper: {
    paddingHorizontal: PADDING,
  },
  button: {
    backgroundColor: colors.heavyGray,
    minHeight: heightScale(35),
    paddingHorizontal: PADDING / 2,
    borderRadius: widthScale(5),
    marginBottom: PADDING / 2,
  },
});
