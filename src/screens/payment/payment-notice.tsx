import {ScrollView, StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {PADDING1} from '~constants/constant';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import HStack from '~components/h-stack';

const PAYMENT_NOTICE_DATA = [
  {
    title: '카풀 수익금 정산 및 수수료 안내',
    content: [
      '‘파킹박 태워줘’에서는 ‘드라이버’에게 ’탑승객’으로부터 수령한 수익금 중 수수료를 포함한 기타 제반 비용 및 패널티 제도에 규정되어 있는 금액을 공제 후 정산합니다.',
    ],
  },
  {
    title: '충전금 정산 안내',
    content: [
      '충전금 정산의 경우 결제 금액의 20% 수수료를  공제후 정산합니다.',
      '충전금 정산은 카풀 운행이 종료된 다음날 지급을 원칙으로 합니다. 다만 지급일이 주말,공휴일 또는 회사의 휴무일인 경우 지급일이 지연될수 있으며, 회사는 변경 된 지급일을 공지를 통해 안내합니다.',
    ],
  },
  {
    title: '계좌 정산 안내',
    content: [
      '계좌 정산의 경우 결제 금액의 25% 수수료를 공제후 정산합니다.(기타 소득세 4.4% 별도)',
      '계좌 정산은 매주 월요일부터 금요일까지(공휴일 제외) 발생한 수익금을 차주 월요일부터 정산 요청을 통해 등록한 계좌로 정산받을수 있습니다.',
    ],
  },
];

const PaymentNotice = memo((props: RootStackScreenProps<'PaymentNotice'>) => {
  return (
    <FixedContainer>
      <CustomHeader text="수익금 정산 및 수수료 안내" />

      <ScrollView contentContainerStyle={styles.containerStyle}>
        {PAYMENT_NOTICE_DATA?.flatMap((item, index) => {
          return (
            <View key={index} style={styles.itemWrapperStyle}>
              <CustomText
                size={FONT.CAPTION_7}
                forDriveMe
                family={FONT_FAMILY.SEMI_BOLD}
                string={item?.title}
                lineHeight={heightScale1(22)}
              />
              <View>
                {item?.content?.map((item, index) => {
                  return (
                    <HStack style={styles.contentWrapperStyle} key={index}>
                      <CustomText
                        family={FONT_FAMILY.MEDIUM}
                        forDriveMe
                        color={colors.grayText2}
                        string={` • ${item}`}
                        lineHeight={heightScale1(20)}
                      />
                    </HStack>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </FixedContainer>
  );
});

export default PaymentNotice;

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: PADDING1,
    paddingHorizontal: PADDING1,
    gap: heightScale1(30),
  },
  itemWrapperStyle: {
    backgroundColor: colors.policy,
    paddingVertical: heightScale1(16),
    paddingHorizontal: widthScale1(20),
    borderRadius: scale1(4),
    gap: heightScale1(17),
  },
  contentWrapperStyle: {
    alignItems: 'flex-start',
  },
});
