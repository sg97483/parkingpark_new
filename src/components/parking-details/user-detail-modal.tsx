import {Alert, Image, ImageBackground, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import {BASE_URL, PADDING, width} from '~constants/constant';
import {colors} from '~styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {ICONS, IMAGES} from '~/assets/images-path';
import {useGetProfileUserMutation} from '~services/userServices';
import {UserProps} from '~constants/types';
import {FONT, FONT_FAMILY, GENDER} from '~constants/enum';
import HStack from '~components/h-stack';
import CustomText from '~components/custom-text';

interface Props {}

export interface UserDetailModalRefs {
  show: (userID: number) => void;
}

const UserDetailModal = forwardRef((props: Props, ref) => {
  const [getProfile] = useGetProfileUserMutation();

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [data, setData] = useState<UserProps | null>(null);

  const show = (userID: number) => {
    setIsVisible(true);
    getProfile({
      id: userID,
    })
      .unwrap()
      .then(res => {
        setData(res);
      })
      .catch(error => {
        Alert.alert(error);
      });
  };

  const hide = () => {
    setIsVisible(false);
    setData(null);
  };

  useImperativeHandle(
    ref,
    () => ({
      show,
      hide,
    }),
    [],
  );

  const getWeather = () => {
    switch (data?.weatherCode) {
      case 1:
        return ICONS.img_weather1_off;
      case 2:
        return ICONS.img_weather2_off;
      case 3:
        return ICONS.img_weather3_off;
      case 4:
        return ICONS.img_weather4_off;
      case 5:
        return ICONS.img_weather5_off;
      case 6:
        return ICONS.img_weather6_off;
      case 7:
        return ICONS.img_weather7_off;
      default:
        return ICONS.img_weather8_off;
    }
  };

  return (
    <ReactNativeModal
      onBackButtonPress={hide}
      onBackdropPress={hide}
      isVisible={isVisible}
      useNativeDriver
      style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity onPress={hide} style={styles.closeIcon}>
            <Icon name="close" size={widthScale(25)} color={colors.white} />
          </TouchableOpacity>
          <ImageBackground style={styles.profileImageWrapper} source={IMAGES.img_profile2}>
            {data && data?.photoId ? (
              <Image
                style={styles.profileImage}
                source={{
                  uri: `${BASE_URL}photo/view?id=${data?.photoId}&thumbnail=false`,
                }}
              />
            ) : data?.gender === GENDER.MALE ? (
              <Image style={styles.profileImage} source={IMAGES.male} />
            ) : (
              <Image style={styles.profileImage} source={IMAGES.female} />
            )}
          </ImageBackground>
          <HStack style={styles.profileNameWrapper}>
            <CustomText
              size={FONT.BODY}
              string={data?.nic || ''}
              family={FONT_FAMILY.SEMI_BOLD}
              color={colors.white}
              textStyle={{marginRight: widthScale(3)}}
            />
            <CustomText string="(" color={colors.white} />
            {data?.gender && data?.gender === GENDER.MALE ? (
              <HStack>
                <Icon name="gender-male" size={widthScale(18)} color={colors.darkBlue} />
                <CustomText string=" 남성)" color={colors.white} />
              </HStack>
            ) : (
              <HStack>
                <Icon name="gender-female" color={colors.darkBlue} />
                <CustomText string=" 여성)" color={colors.white} />
              </HStack>
            )}
          </HStack>
        </View>
        {/* age */}
        <HStack style={styles.itemWrapper}>
          <View style={styles.leftItemWrapper}>
            <CustomText string="나이" family={FONT_FAMILY.SEMI_BOLD} />
          </View>
          <CustomText
            string={data?.age ? `${data?.age}세` : '미입력'}
            family={FONT_FAMILY.SEMI_BOLD}
          />
        </HStack>
        {/* living area */}
        <HStack
          style={[
            styles.itemWrapper,
            {
              backgroundColor: colors.white,
            },
          ]}>
          <View style={styles.leftItemWrapper}>
            <CustomText string="사는 지역" family={FONT_FAMILY.SEMI_BOLD} />
          </View>
          <CustomText string={data?.location || '미입력'} family={FONT_FAMILY.SEMI_BOLD} />
        </HStack>
        {/* weather */}
        <HStack style={styles.itemWrapper}>
          <View style={styles.leftItemWrapper}>
            <CustomText string="좋아하는 날씨" family={FONT_FAMILY.SEMI_BOLD} />
          </View>
          <Image source={getWeather()} style={styles.weatherIcon} resizeMode="contain" />
        </HStack>
      </View>
    </ReactNativeModal>
  );
});

export default UserDetailModal;

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {
    width: width * 0.75,
    backgroundColor: colors.white,
    alignSelf: 'center',
  },
  headerWrapper: {
    padding: PADDING / 2,
    backgroundColor: colors.red,
  },
  closeIcon: {
    alignSelf: 'flex-end',
  },
  profileImageWrapper: {
    height: heightScale(200),
    marginTop: PADDING / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: widthScale(130),
    height: widthScale(130),
    top: -widthScale(24),
    right: -widthScale(1),
    borderRadius: 999,
  },
  profileNameWrapper: {
    justifyContent: 'center',
    marginTop: PADDING / 2,
  },
  itemWrapper: {
    height: heightScale(50),
    paddingHorizontal: PADDING,
    backgroundColor: `${colors.gray}70`,
  },
  leftItemWrapper: {
    minWidth: widthScale(135),
  },
  weatherIcon: {
    height: heightScale(30),
    marginLeft: -widthScale(35),
  },
});
