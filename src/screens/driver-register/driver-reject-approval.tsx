import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {IMAGES} from '~/assets/images-path';
import CustomButton from '~components/commons/custom-button';
import LineButton from '~components/commons/line-button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

const DriverRejectApproval = (props: RootStackScreenProps<'DriverRejectApproval'>) => {
  const {navigation} = props;

  return (
    <FixedContainer edges={['top', 'bottom']}>
      <CustomHeader
        hideBack
        rightContent={
          <LineButton
            text="닫기"
            onPress={() => navigation.navigate(ROUTE_KEY.ParkingParkHome, {selectedTab: 2})}
          />
        }
      />
      <View style={styles.container}>
        <Image
          source={IMAGES.reject_approval}
          style={{width: widthScale1(100), height: heightScale1(120)}}
          resizeMode="contain"
        />

        <CustomText
          string="드라이버 승인 등록이 거절되었습니다."
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_8}
          color={colors.black}
          textStyle={{marginTop: heightScale1(30), textAlign: 'center'}}
          lineHeight={fontSize1(28)}
          forDriveMe
        />
      </View>

      <PaddingHorizontalWrapper
        containerStyles={{
          marginBottom: PADDING1 / 2,
        }}
        forDriveMe>
        <CustomButton
          text={strings.driver_register.sign_up_communicate}
          onPress={() => {
            navigation.navigate(ROUTE_KEY.DriverRegister);
          }}
          buttonHeight={58}
        />
      </PaddingHorizontalWrapper>
    </FixedContainer>
  );
};

export default DriverRejectApproval;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
