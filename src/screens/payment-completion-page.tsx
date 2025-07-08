import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomButton from '~components/commons/custom-button';
import LineButton from '~components/commons/line-button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';

const PaymentCompletionPage = (props: RootStackScreenProps<'PaymentCompletionPage'>) => {
  const {navigation} = props;

  return (
    <FixedContainer>
      <CustomHeader
        hideBack
        rightContent={<LineButton text="닫기" onPress={() => navigation.goBack()} />}
      />

      <View style={styles.viewFlex}>
        <View style={styles.viewContent}>
          <Icons.TickPayment />

          <View style={{gap: heightScale1(4), alignItems: 'center'}}>
            <CustomText
              forDriveMe
              size={FONT.CAPTION_9}
              family={FONT_FAMILY.SEMI_BOLD}
              string="결제 완료"
            />

            <CustomText
              forDriveMe
              string="카풀 예약이 완료되었어요!"
              color={colors.grayText}
              size={FONT.CAPTION_7}
            />
          </View>
        </View>
      </View>

      <PaddingHorizontalWrapper forDriveMe>
        <View style={{gap: heightScale1(10), marginBottom: PADDING1 / 2}}>
          <CustomButton text="확인" buttonHeight={58} onPress={() => navigation.goBack()} />
        </View>
      </PaddingHorizontalWrapper>
    </FixedContainer>
  );
};

export default PaymentCompletionPage;

const styles = StyleSheet.create({
  viewContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: heightScale1(30),
  },
  viewFlex: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
