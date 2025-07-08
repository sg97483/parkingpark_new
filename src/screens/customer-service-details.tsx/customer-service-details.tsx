import React, {useCallback} from 'react';
import {Image, Linking, Pressable, StyleSheet, View} from 'react-native';
import {ICONS} from '~/assets/images-path';
import {Icons} from '~/assets/svgs';
import CustomHeader from '~components/custom-header';
import MenuBox from '~components/custom-service-detail/menu-box';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {SOCIAL_DATA} from '~constants/data';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

const CustomerServiceDetails = (props: RootStackScreenProps<'CustomerServiceDetails'>) => {
  const {user} = userHook();

  const getSocialIcon = useCallback((index: number) => {
    switch (index) {
      case 0:
        return <Image style={styles.snsIconStyle} source={ICONS.facebook} />;

      case 1:
        return <Image style={styles.snsIconStyle} source={ICONS.blog} />;

      case 2:
        return <Image style={styles.snsIconStyle} source={ICONS.youtube} />;

      case 3:
        return <Image style={styles.snsIconStyle} source={ICONS.twitter} />;
      default:
        break;
    }
  }, []);

  return (
    <FixedContainer>
      <CustomHeader text="고객센터" />

      <View style={styles.containerStyle}>
        <CustomText
          string={user ? `${user?.nic} 님,\n무엇을 도와드릴까요?` : '무엇을 도와드릴까요?'}
          size={FONT.CAPTION_9}
          family={FONT_FAMILY.SEMI_BOLD}
          forDriveMe
          lineHeight={heightScale1(31)}
        />

        <CustomText
          string={'주차서비스 파킹박 문의하기'}
          size={FONT.CAPTION_7}
          family={FONT_FAMILY.REGULAR}
          forDriveMe
          lineHeight={heightScale1(31)}
          style={{marginTop: 30}} // 원하는 marginTop 값 설정
        />

        <HStack
          style={{
            marginTop: heightScale1(12),
            marginBottom: heightScale1(20),
            gap: widthScale1(12),
          }}>
          <MenuBox
            onPress={() => {
              Linking.openURL('tel:027073371');
            }}
            title="주차서비스"
            subTitle={'파킹박\n고객센터'}
          />

          <MenuBox
            onPress={() => {
              Linking.openURL('http://pf.kakao.com/_Sxdjxij/chat');
            }}
            title="채팅문의"
            subTitle={'파킹박\n카톡채널'}
          />
        </HStack>

        <CustomText
          string={'카풀서비스 태워줘 문의하기'}
          size={FONT.CAPTION_7}
          family={FONT_FAMILY.REGULAR}
          forDriveMe
          lineHeight={heightScale1(31)}
          style={{marginTop: 0}} // 원하는 marginTop 값 설정
        />

        <HStack
          style={{
            marginTop: heightScale1(12),
            marginBottom: heightScale1(20),
            gap: widthScale1(12),
          }}>
          <MenuBox
            onPress={() => {
              Linking.openURL('tel:15330981');
            }}
            title="전화문의"
            subTitle={'태워줘\n고객센터'}
          />

          <MenuBox
            onPress={() => {
              Linking.openURL('http://pf.kakao.com/_maAGG/chat');
            }}
            title="채팅문의"
            subTitle={'태워줘\n카톡채널'}
          />
        </HStack>

        <HStack
          style={{marginBottom: heightScale1(50), gap: widthScale1(4), justifyContent: 'center'}}>
          <CustomText string="평일 09:00-18:00" color={colors.grayText} forDriveMe />
          <Icons.Dot width={2} height={2} fill={colors.grayText} />
          <CustomText string="주말 10:00-15:00" color={colors.grayText} forDriveMe />
        </HStack>

        <CustomText
          string="파킹박이 궁금하신가요?"
          size={FONT.CAPTION_9}
          family={FONT_FAMILY.SEMI_BOLD}
          forDriveMe
        />

        <HStack
          style={{
            marginTop: heightScale1(30),
            gap: widthScale1(10),
          }}>
          {SOCIAL_DATA?.flatMap((item, index) => {
            return (
              <Pressable
                onPress={() => {
                  Linking.openURL(item?.link);
                }}
                key={item?.name}
                style={styles.buttonWrapperStyle}>
                <View>{getSocialIcon(index)}</View>

                <CustomText
                  string={item?.name}
                  color={colors.grayText}
                  forDriveMe
                  size={FONT.CAPTION}
                  family={FONT_FAMILY.MEDIUM}
                  lineHeight={heightScale1(18)}
                />
              </Pressable>
            );
          })}
        </HStack>
      </View>
    </FixedContainer>
  );
};

export default CustomerServiceDetails;

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: PADDING1,
    paddingTop: PADDING1,
  },
  buttonWrapperStyle: {
    backgroundColor: colors.policy,
    flex: 1,
    justifyContent: 'center',
    borderRadius: scale1(8),
    alignItems: 'center',
    paddingVertical: PADDING1,
    minHeight: heightScale1(94),
    gap: heightScale1(4),
  },
  snsIconStyle: {
    width: widthScale1(32),
    height: widthScale1(32),
    borderRadius: 999,
  },
});
