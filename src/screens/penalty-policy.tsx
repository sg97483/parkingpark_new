import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import PenaltyPolicyItem from '~components/penalty-policy/penalty-policy-item';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

const PenaltyPolicy = (props: RootStackScreenProps<'PenaltyPolicy'>) => {
  return (
    <FixedContainer edges={['top']}>
      <CustomHeader text="수수료 및 패널티 정책" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.boxWrapperStyle}>
          <CustomText
            string={
              '예약 일정 취소 요청을 한 주체에게 탑승객이\n결제한 금액 기준으로 시간에 따라 수수료부과\n(NO SHOW의 경우 패널티 부과)'
            }
            forDriveMe
            size={FONT.CAPTION_7}
            family={FONT_FAMILY.SEMI_BOLD}
            lineHeight={heightScale1(22)}
          />
        </View>

        <View style={styles.boxWrapperStyle}>
          <CustomText
            string={'출근길 취소 수수료 및 패널티 안내'}
            forDriveMe
            size={FONT.CAPTION_7}
            family={FONT_FAMILY.SEMI_BOLD}
            lineHeight={heightScale1(22)}
          />

          <View style={styles.contentStyle}>
            <PenaltyPolicyItem
              value="10%"
              title={'카풀 확정후 카풀 예정일\n기준 1일전 22:00 전까지'}
            />
            <PenaltyPolicyItem
              value="100%"
              title={'카풀 예정일 기준 1일전\n22:00 이후 부터\n출근길 카풀 유효시간인\n09:00까지'}
            />
            <PenaltyPolicyItem
              value="200%"
              title={'NO-SHOW'}
              subTitle={'(카풀 예정일 출근길 카풀\n유효시간인 09:00이후 취소시\nNO-SHOW로 간주)'}
            />
          </View>
        </View>

        <View style={styles.boxWrapperStyle}>
          <CustomText
            string={'퇴근길 취소 수수료 및 패널티 안내'}
            forDriveMe
            size={FONT.CAPTION_7}
            family={FONT_FAMILY.SEMI_BOLD}
            lineHeight={heightScale1(22)}
          />

          <View style={styles.contentStyle}>
            <PenaltyPolicyItem value="10%" title={'카풀 확정후 카풀 예정일\n당일 16:00 전까지'} />
            <PenaltyPolicyItem
              value="100%"
              title={'카풀 예정일 당일\n16:00 이후 부터\n퇴근길 카풀 유효시간인\n20:00까지'}
            />
            <PenaltyPolicyItem
              value="200%"
              title={'NO-SHOW'}
              subTitle={'(카풀 예정일 퇴근길 카풀\n유효시간인 20:00이후 취소시\nNO-SHOW로 간주)'}
            />
          </View>
        </View>

        <View style={styles.boxWrapperStyle}>
          <CustomText
            string={'NO SHOW 패널티 처리 안내'}
            forDriveMe
            size={FONT.CAPTION_7}
            family={FONT_FAMILY.SEMI_BOLD}
            lineHeight={heightScale1(22)}
          />

          <HStack
            style={{
              gap: widthScale1(10),
              alignItems: 'flex-start',
            }}>
            <Icons.Dot style={{top: heightScale1(9)}} fill={colors.grayText2} />
            <CustomText
              string={
                '카풀 일정이 확정된 후 일방적인 일정 취소 요구 및 NO SHOW는 카풀 운영 규정을 심각하게 어긋나는 것으로, 일정 취소로 인해 피해를 입게 되는 당사자에게 부과된 패널티를 보상금(플랫폼수수료 20%제외한 금액)으로 지급합니다.'
              }
              textStyle={{flexShrink: 1}}
              forDriveMe
              lineHeight={heightScale1(20)}
              color={colors.grayText2}
            />
          </HStack>
        </View>
      </ScrollView>
    </FixedContainer>
  );
};

export default PenaltyPolicy;

const styles = StyleSheet.create({
  container: {
    paddingTop: PADDING1,
    paddingHorizontal: PADDING1,
    gap: heightScale1(30),
    paddingBottom: heightScale1(52),
  },
  boxWrapperStyle: {
    borderRadius: scale1(4),
    paddingHorizontal: PADDING1,
    paddingVertical: heightScale1(16),
    backgroundColor: colors.gray7,
    gap: heightScale1(17),
  },
  contentStyle: {
    gap: heightScale1(10),
  },
});
