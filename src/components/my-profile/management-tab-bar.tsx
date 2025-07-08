import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {ICONS} from '~/assets/images-path';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1, widthScale, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

const ManagementTabBar = () => {
  const navigation: UseRootStackNavigation = useNavigation();
  const {isLogin} = userHook();

  return (
    <View style={styles.container}>
      <HStack style={styles.wrapHorizontal}>
        {/* vehicle management */}
        <Pressable
          style={styles.wrapButton}
          onPress={() => {
            if (!isLogin) {
              showMessage({
                message: strings?.general_text?.login_first,
              });
              navigation.navigate(ROUTE_KEY.Login);
              return;
            }
            navigation.navigate(ROUTE_KEY.VehicleManagement);
          }}>
          <Image source={ICONS.profile_car} style={styles.icon} />
          <Text style={styles.title}>차량관리</Text>
        </Pressable>

        {/* payment management */}
        <Pressable
          style={styles.wrapButton}
          onPress={() => {
            if (!isLogin) {
              showMessage({
                message: strings?.general_text?.login_first,
              });
              navigation.navigate(ROUTE_KEY.Login);
              return;
            }
            navigation.navigate(ROUTE_KEY.PaymentInfomation);
          }}>
          {/*<Icons.Card />*/}
          <Image source={ICONS.profile_card} style={styles.icon} />
          <Text style={styles.title}>결제관리</Text>
        </Pressable>

        {/* usage management */}
        <Pressable
          onPress={() => {
            if (!isLogin) {
              showMessage({
                message: strings?.general_text?.login_first,
              });
              navigation.navigate(ROUTE_KEY.Login);
              return;
            }
            navigation.navigate(ROUTE_KEY.UsageHistory);
          }}
          style={styles.wrapButton}>
          {/*<Icons.History stroke={colors.black} />*/}
          <Image source={ICONS.profile_plist} style={styles.icon} />
          <Text style={styles.title}>이용내역</Text>
        </Pressable>

        {/* favorites */}
        <Pressable
          onPress={() => {
            if (!isLogin) {
              showMessage({
                message: strings?.general_text?.login_first,
              });
              navigation.navigate(ROUTE_KEY.Login);
              return;
            }
            navigation.navigate(ROUTE_KEY.Favorites);
          }}
          style={styles.wrapButton}>
          {/*<Icons.Star stroke={colors.black} />*/}
          <Image source={ICONS.profile_fav} style={styles.icon} />
          <Text style={styles.title}>즐겨찾기</Text>
        </Pressable>
      </HStack>
    </View>
  );
};

export default memo(ManagementTabBar);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: PADDING1,
    marginBottom: heightScale1(20),
  },
  wrapHorizontal: {
    paddingHorizontal: widthScale1(10),
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: FONT_FAMILY.MEDIUM,
    fontSize: fontSize1(14),
    color: colors.lineCancel,
    marginTop: widthScale1(4),
  },
  wrapButton: {
    alignItems: 'center',
  },
  icon: {
    width: widthScale(38),
    height: widthScale(38),
    marginBottom: widthScale1(0),
  },
});
