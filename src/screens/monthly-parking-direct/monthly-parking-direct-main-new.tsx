import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import {IS_ANDROID, PADDING} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {ROUTE_KEY} from '~navigators/router';
import {useAppSelector} from '~store/storeHooks';

const MonthlyParkingDirectMain = memo((props: RootStackScreenProps<'MonthlyParkingDirectMain'>) => {
  const {navigation} = props;

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  return (
    <FixedContainer>
      <CustomHeader text="월주차 직거래 서비스" />

      <View style={styles.viewContent}>
        <CustomText string="편리하고 간편한" />
        <CustomText
          string="월주차 직거래 서비스"
          size={FONT.TITLE_3}
          family={FONT_FAMILY.SEMI_BOLD}
          textStyle={{marginTop: heightScale(10)}}
        />
      </View>
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
          <CustomText string="등록하기" color={colors.redSwitch} family={FONT_FAMILY.SEMI_BOLD} />
        </TouchableOpacity>
        {/* Go to parking list */}
        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTE_KEY.MonthlyParkingDirectList)}
          style={[
            styles.buttonWrapper,
            {
              marginTop: PADDING,
              backgroundColor: colors.redSwitch,
            },
          ]}>
          <CustomText
            string="주차장 보러가기"
            color={colors.white}
            family={FONT_FAMILY.SEMI_BOLD}
          />
        </TouchableOpacity>
      </View>
    </FixedContainer>
  );
});

export default MonthlyParkingDirectMain;

const styles = StyleSheet.create({
  content: {
    marginTop: 'auto',
    marginHorizontal: PADDING,
    marginBottom: PADDING,
  },
  buttonWrapper: {
    height: heightScale(IS_ANDROID ? 55 : 50),
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.redSwitch,
    backgroundColor: colors.white,
    borderRadius: widthScale(10),
  },
  viewContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
