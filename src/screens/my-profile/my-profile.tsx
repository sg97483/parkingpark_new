import {useNavigation} from '@react-navigation/native';
import React, {memo, useMemo} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, Linking} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {Icons} from '~/assets/svgs';
import {ICONS, IMAGES} from '~/assets/images-path';
import CustomHeader from '~components/custom-header';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import ManagementTabBar from '~components/my-profile/management-tab-bar';
import MenuSection from '~components/my-profile/menu-section';
import MyCoupon from '~components/my-profile/my-coupon';
import UserSession from '~components/my-profile/user-session';
import {strings} from '~constants/strings';
import {MenuProps} from '~constants/types';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useGetListReadYNQuery} from '~services/userServices';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

const MyProfile: React.FC = memo(() => {
  const navigation: UseRootStackNavigation = useNavigation();
  const {isLogin, userID} = userHook();

  const handleBannerPress = () => {
    const url = 'https://abr.ge/v0vt9f';
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const handlerulletBannerPress = () => {
    navigation.navigate(ROUTE_KEY.EventGame);
  };

  const {data: dataQnA} = useGetListReadYNQuery({memberId: userID!}, {skip: !userID});

  const DRIVE_ME_MENU_LIST: MenuProps[] = [
    {
      title: '출퇴근경로',
      onPress: () => {
        if (!isLogin) {
          showMessage({
            message: strings.general_text.login_first,
          });
          navigation.navigate(ROUTE_KEY.Login);
          return;
        }
        navigation.navigate(ROUTE_KEY.MyRoute);
      },
    },
    {
      title: '정산내역',
      onPress: () => {
        if (!isLogin) {
          showMessage({
            message: strings.general_text.login_first,
          });
          navigation.navigate(ROUTE_KEY.Login);
          return;
        }
        navigation.navigate(ROUTE_KEY.AccountSettlement);
      },
    },
    {
      title: '패널티정책',
      onPress: () => navigation.navigate(ROUTE_KEY.PenaltyPolicy),
    },
  ];

  const CUSTOMER_SERVICE_CENTER_MENU_LIST: MenuProps[] = [
    {
      title: '공지사항',
      onPress: () => {
        navigation.navigate(ROUTE_KEY.Notice);
      },
    },
    {
      title: '자주묻는질문',
      onPress: () => {
        navigation.navigate(ROUTE_KEY.FAQ);
      },
    },
    {
      title: '문의하기',
      onPress: () => {
        if (!isLogin) {
          showMessage({
            message: strings.general_text.login_first,
          });
          navigation.navigate(ROUTE_KEY.Login);
          return;
        }
        navigation.navigate(ROUTE_KEY.ContactUs);
      },
      isShowDot: dataQnA?.some(item => item.readYN === 'N'),
    },
    {
      title: '고객센터',
      onPress: () => {
        navigation.navigate(ROUTE_KEY.CustomerServiceDetails);
      },
    },
  ];

  const SETTING_MENU_LIST: MenuProps[] = [
    {
      title: '환경설정',
      onPress: () => {
        if (!isLogin) {
          showMessage({
            message: strings.general_text.login_first,
          });
          navigation.navigate(ROUTE_KEY.Login);
          return;
        }
        navigation.navigate(ROUTE_KEY.Setting);
      },
    },
    {
      title: '약관 및 정책정보',
      onPress: () => {
        navigation.navigate(ROUTE_KEY.TermsAndPolicies);
      },
    },
  ];

  const renderRightMenu = useMemo(() => {
    return (
      <HStack style={{gap: widthScale1(24)}}>
        <Pressable onPress={() => navigation.navigate(ROUTE_KEY.Notice)}>
          <Icons.Bell />
        </Pressable>

        <Pressable
          onPress={() => {
            if (!isLogin) {
              showMessage({
                message: strings.general_text.login_first,
              });
              navigation.navigate(ROUTE_KEY.Login);
              return;
            }
            navigation.navigate(ROUTE_KEY.Setting);
          }}>
          <Icons.Settings />
        </Pressable>
      </HStack>
    );
  }, [isLogin]);

  return (
    <FixedContainer edges={['top']}>
      <CustomHeader text="내정보" hideBack rightContent={renderRightMenu} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <UserSession />

        <MyCoupon />

        <Divider
          style={{
            marginBottom: heightScale1(0),
          }}
        />

        <ScrollView style={{paddingHorizontal: widthScale1(20)}}>
          <Pressable onPress={handlerulletBannerPress}>
            <Image source={IMAGES.rullet_banner} style={styles.image2} />
          </Pressable>
        </ScrollView>

        <Divider
          style={{
            marginBottom: heightScale1(15),
          }}
        />

        <ManagementTabBar />

        <Divider
          style={{
            marginBottom: heightScale1(20),
          }}
        />

        <MenuSection
          icon={<Image source={ICONS.profile_qna_title} style={styles.icon} />}
          title="고객센터"
          menuList={CUSTOMER_SERVICE_CENTER_MENU_LIST}
          subTitle="문의"
        />

        {/* 여백을 적용한 ScrollView 안에 클릭 가능한 이미지 삽입 */}
        <ScrollView style={{paddingHorizontal: widthScale1(20)}}>
          <Pressable onPress={handleBannerPress}>
            <Image source={IMAGES.banner_event_welcome1} style={styles.image1} />
          </Pressable>
        </ScrollView>

        <MenuSection
          icon={<Image source={ICONS.profile_carpool_title} style={styles.icon} />}
          title="카풀 서비스"
          menuList={DRIVE_ME_MENU_LIST}
        />

        <Divider
          style={{
            marginBottom: heightScale1(20),
          }}
        />

        <MenuSection
          icon={<Image source={ICONS.profile_setting_title} style={styles.icon} />}
          title="설정"
          menuList={SETTING_MENU_LIST}
          subTitle="기타"
        />
      </ScrollView>
    </FixedContainer>
  );
});

export default MyProfile;

const styles = StyleSheet.create({
  icon: {
    width: widthScale1(24),
    height: widthScale1(24),
    marginRight: widthScale1(0),
  },
  image1: {
    width: '100%', // 부모 뷰의 너비에 맞춤
    height: undefined, // 자동으로 비율 유지
    aspectRatio: 4, // 이미지의 비율에 맞게 설정 (예: 4:1 비율)
    resizeMode: 'contain', // 이미지가 전체 뷰를 덮도록 설정
    marginTop: 0, // 상단 여백
    marginBottom: 20, // 하단 여백
  },
  image2: {
    width: '100%', // 부모 뷰의 너비에 맞춤
    height: undefined, // 자동으로 비율 유지
    aspectRatio: 4, // 이미지의 비율에 맞게 설정 (예: 4:1 비율)
    resizeMode: 'contain', // 이미지가 전체 뷰를 덮도록 설정
    marginTop: 0, // 상단 여백
    marginBottom: 2, // 하단 여백
  },
});
