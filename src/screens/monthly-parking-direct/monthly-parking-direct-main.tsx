import {ImageBackground, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {IMAGES} from '~/assets/images-path';
import CustomText from '~components/custom-text';
import {heightScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import {PADDING} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {ROUTE_KEY} from '~navigators/router';
import {useAppSelector} from '~store/storeHooks';

const MonthlyParkingDirectMain = memo((props: RootStackScreenProps<'MonthlyParkingDirectMain'>) => {
  const {navigation} = props;

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  return (
    <FixedContainer>
      <CustomHeader text="월주차 직거래 서비스" />
      <ImageBackground
        style={{flex: 1}}
        source={IMAGES.month_select_background}
        resizeMode="stretch">
        <View style={styles.content}>
          {/* Registration */}
          <TouchableOpacity
            onPress={() => {
              if (!userToken?.id || !userToken?.password) {
                navigation.navigate(ROUTE_KEY.Login);
              } else {
                navigation.navigate(ROUTE_KEY.MonthlyParkingDirectRegistration);
              }
            }}
            style={styles.buttonWrapper}>
            <CustomText string="등록하기" color={colors.red} family={FONT_FAMILY.SEMI_BOLD} />
          </TouchableOpacity>
          {/* Go to parking list */}
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTE_KEY.MonthlyParkingDirectList)}
            style={[
              styles.buttonWrapper,
              {
                marginTop: PADDING,
                backgroundColor: colors.red,
              },
            ]}>
            <CustomText
              string="주차장 보러가기"
              color={colors.white}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </FixedContainer>
  );
});

export default MonthlyParkingDirectMain;

const styles = StyleSheet.create({
  content: {
    top: '27%',
  },
  buttonWrapper: {
    height: heightScale(50),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.red,
    backgroundColor: colors.white,
    marginHorizontal: PADDING * 2,
  },
});
