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

const DriverCommunicationRegistration = (
  props: RootStackScreenProps<'DriverCommunicationRegistration'>,
) => {
  const {navigation, route} = props;

  const isPassenger = route.params.isPassenger;

  return (
    <FixedContainer>
      <CustomHeader
        hideBack
        rightContent={
          <LineButton
            text="닫기"
            onPress={() => {
              navigation.navigate(ROUTE_KEY.ParkingParkHome, {
                selectedTab: 2,
              });
            }}
          />
        }
      />

      <View style={styles.container}>
        <Image
          source={IMAGES.location}
          style={{height: heightScale1(120), width: widthScale1(190), resizeMode: 'contain'}}
        />

        <View style={{gap: heightScale1(10)}}>
          <CustomText
            string={'출퇴근길 등록후 카풀 서비스를\n이용할수 있어요.'}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_8}
            textStyle={{textAlign: 'center'}}
            color={colors.black}
            lineHeight={fontSize1(28)}
            forDriveMe
          />
          <CustomText
            string={'등록후 나에게 꼭 맞는 카풀을 찾아보세요.'}
            family={FONT_FAMILY.MEDIUM}
            size={FONT.CAPTION_7}
            textStyle={{textAlign: 'center'}}
            color={colors.grayText}
            lineHeight={fontSize1(28)}
            forDriveMe
          />
        </View>
      </View>

      <PaddingHorizontalWrapper containerStyles={{marginBottom: PADDING1 / 2}} forDriveMe>
        <CustomButton
          text={strings.driver_register.sign_up_routine}
          onPress={() => {
            if (isPassenger) {
              navigation.replace(ROUTE_KEY.WayToWorkRegistration1);
            } else {
              navigation.navigate(ROUTE_KEY.DriverWayToWork1);
            }
          }}
          buttonHeight={58}
        />
      </PaddingHorizontalWrapper>
    </FixedContainer>
  );
};

export default DriverCommunicationRegistration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    gap: heightScale1(30),
  },
});
