import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {memo, useMemo, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import CustomBoxSelectButton from '~components/commons/custom-box-select-button';
import CustomTopTabItem from '~components/commons/custom-top-tab-item';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {strings} from '~constants/strings';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';
import {widthScale1} from '~styles/scaling-utils';
import {WEBVIEW_URL} from '~utils/webviewLink';

const Tab = createMaterialTopTabNavigator();

const ParkingParkTab = memo(() => {
  return (
    <WebView
      startInLoadingState={true}
      renderLoading={() => (
        <View style={{flex: 1, backgroundColor: colors.white}}>
          <ActivityIndicator />
        </View>
      )}
      source={{
        uri: WEBVIEW_URL.FAQ,
      }}
      originWhitelist={['*']}
    />
  );
});

const CarpoolTab = memo(() => {
  const [selectedTab, setSelectedTab] = useState<number>(1);

  const renderButton = useMemo(() => {
    return (
      <PaddingHorizontalWrapper forDriveMe>
        <HStack
          style={{
            paddingTop: PADDING1,
            gap: widthScale1(10),
          }}>
          <CustomBoxSelectButton
            selected={selectedTab === 1}
            onSelected={() => {
              setSelectedTab(1);
            }}
            text="공통"
          />
          <CustomBoxSelectButton
            selected={selectedTab === 2}
            onSelected={() => {
              setSelectedTab(2);
            }}
            text="드라이버"
          />
          <CustomBoxSelectButton
            selected={selectedTab === 3}
            onSelected={() => {
              setSelectedTab(3);
            }}
            text="탑승객"
          />
        </HStack>
      </PaddingHorizontalWrapper>
    );
  }, [selectedTab]);

  if (selectedTab === 1) {
    return (
      <View style={styles.containerStyle}>
        {renderButton}

        <WebView
          startInLoadingState={true}
          renderLoading={() => (
            <View style={{flex: 1, backgroundColor: colors.white}}>
              <ActivityIndicator />
            </View>
          )}
          source={{
            uri: 'http://cafe.wisemobile.kr/imobile/partner_list/carpool_qna1.html',
          }}
        />
      </View>
    );
  }

  if (selectedTab === 2) {
    return (
      <View style={styles.containerStyle}>
        {renderButton}

        <WebView
          startInLoadingState={true}
          renderLoading={() => (
            <View style={{flex: 1, backgroundColor: colors.white}}>
              <ActivityIndicator />
            </View>
          )}
          source={{
            uri: 'http://cafe.wisemobile.kr/imobile/partner_list/carpool_qna2.html',
          }}
        />
      </View>
    );
  }

  if (selectedTab === 3) {
    return (
      <View style={styles.containerStyle}>
        {renderButton}

        <WebView
          startInLoadingState={true}
          renderLoading={() => (
            <View style={{flex: 1, backgroundColor: colors.white}}>
              <ActivityIndicator />
            </View>
          )}
          source={{
            uri: 'http://cafe.wisemobile.kr/imobile/partner_list/carpool_qna3.html',
          }}
        />
      </View>
    );
  }
});

const FAQ = memo((props: RootStackScreenProps<'FAQ'>) => {
  console.log('🚀 ~ file: FAQ.tsx:73 ~ FAQ ~ FAQ:', FAQ);

  return (
    <FixedContainer edges={['top']}>
      <CustomHeader text={strings.parking_request_notice_question.question} />

      <Tab.Navigator
        screenOptions={{
          lazy: true,
        }}
        tabBar={props => <CustomTopTabItem {...props} />}>
        <Tab.Screen name="주차" component={ParkingParkTab} />
        <Tab.Screen name="카풀" component={CarpoolTab} />
      </Tab.Navigator>
    </FixedContainer>
  );
});

export default FAQ;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
