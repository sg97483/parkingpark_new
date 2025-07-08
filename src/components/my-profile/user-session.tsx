import {useNavigation} from '@react-navigation/native';
import React, {memo, useEffect, useMemo} from 'react';
import {DeviceEventEmitter, Pressable, StyleSheet, Text, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import Avatar from '~components/commons/avatar';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useGetUserInfoQuery} from '~services/userServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {getImageURL} from '~utils/getImageURL';

const UserSession: React.FC = memo(() => {
  const navigation: UseRootStackNavigation = useNavigation();

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const {refetch} = useGetUserInfoQuery(
    {
      id: userToken?.id,
      password: userToken?.password,
    },
    {skip: !userToken?.id || !userToken?.password},
  );

  useEffect(() => {
    const userUpdateListener = DeviceEventEmitter.addListener('UPDATED_USER', () => {
      refetch();
    });

    return () => {
      userUpdateListener.remove();
    };
  }, []);

  const userData = useAppSelector(state => state?.userReducer?.user);

  const handleLogin = () => {
    if (userData) {
      navigation.navigate(ROUTE_KEY.ProfileManagement);
    } else {
      navigation.navigate(ROUTE_KEY.Login);
    }
  };

  const renderUserSession = useMemo(() => {
    if (userData) {
      return (
        <Pressable onPress={handleLogin}>
          <HStack style={{gap: widthScale1(10)}}>
            <Avatar
              uri={userData?.photoId ? getImageURL(Number(userData?.photoId), true) : ''}
              size={60}
            />

            <View style={styles.infoWrapperStyle}>
              <CustomText
                forDriveMe
                size={FONT.CAPTION_7}
                string={userData?.nic || '로그인하세요'}
                family={FONT_FAMILY.MEDIUM}
              />

              <CustomText forDriveMe string={userData?.email ?? ''} color={colors.grayText} />
            </View>

            <Icons.ChevronRight width={widthScale1(16)} height={widthScale1(16)} />
          </HStack>
        </Pressable>
      );
    }

    return (
      <Pressable onPress={handleLogin}>
        <HStack>
          <View style={styles.infoWrapperStyle}>
            <Text style={styles.nicknameTextStyle}>로그인 해주세요.</Text>
            <Text style={styles.emailTextStyle}>가입후 즐거운 모빌리티 생활을 누려보세요.</Text>
          </View>

          <Icons.ChevronRight />
        </HStack>
      </Pressable>
    );
  }, [userData]);

  return <View style={styles.containerStyle}>{renderUserSession}</View>;
});

export default UserSession;

const styles = StyleSheet.create({
  containerStyle: {
    marginTop: heightScale1(10),
    marginBottom: heightScale1(20),
    paddingHorizontal: PADDING1,
  },
  infoWrapperStyle: {
    flex: 1,
    gap: heightScale1(4),
  },
  nicknameTextStyle: {
    fontFamily: FONT_FAMILY.MEDIUM,
    color: colors.menuTextColor,
    fontSize: fontSize1(16),
    lineHeight: heightScale1(22),
  },
  emailTextStyle: {
    fontFamily: FONT_FAMILY.REGULAR,
    color: colors.grayText,
    fontSize: fontSize1(14),
    lineHeight: heightScale1(20),
  },
});
