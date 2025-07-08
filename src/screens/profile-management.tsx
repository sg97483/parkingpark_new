import React from 'react';
import {DeviceEventEmitter, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {showMessage} from 'react-native-flash-message';
import {Icons} from '~/assets/svgs';
import AppModal from '~components/app-modal';
import CustomMenu from '~components/commons/custom-menu';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import Spinner from '~components/spinner';
import {PADDING1} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY, GENDER} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {
  useDeleteAccountMutation,
  useGetUserInfoQuery,
  useUpdateUserFCMTokenMutation,
} from '~services/userServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {formatPhoneNumber} from '~utils/common';
import {getImageURL} from '~utils/getImageURL';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ProfileManagement = (props: RootStackScreenProps<'ProfileManagement'>) => {
  const {navigation} = props;

  const {user: userData, userToken} = userHook();
  const firebaseInstance = auth().currentUser;

  useGetUserInfoQuery(
    {
      id: userToken?.id,
      password: userToken?.password,
    },
    {skip: !userToken?.id || !userToken?.password},
  );
  const [deleteAccount] = useDeleteAccountMutation();
  const [updateUserFCMToken] = useUpdateUserFCMTokenMutation();

  const handleLogout = async () => {
    Spinner.show();
    if (userToken?.id) {
      await updateUserFCMToken({
        memberId: `${userToken?.id}`,
        fcmToken: '',
      });
    }
    if (firebaseInstance?.uid) {
      await firestore().collection('users').doc(firebaseInstance?.uid).set({
        uid: firebaseInstance?.uid,
        userid: userData?.email,
        usernm: userData?.nic,
        token: '',
      });
    }
    DeviceEventEmitter.emit(EMIT_EVENT.LOGOUT);
  };

  const handleDeleteAccount = () => {
    AppModal.show({
      title: '탈퇴하기',
      content:
        '회원탈퇴를 하시면 계정의 정보는 복구할 수 없으며, 같은 이메일주소로 재가입할 수 없습니다.\n탈퇴가 완료 되어도 작성된 게시물이나 댓글은 삭제되지 않으니, 삭제를 원하실 경우 직접 삭제하신 후에 탈퇴를 진행해 주시기 바랍니다.\n탈퇴 하시겠습니까?',
      isTwoButton: true,
      textNo: '아니오',
      textYes: '예',
      yesFunc: () => {
        Spinner.show();
        deleteAccount({
          id: userToken?.id?.toString(),
          pwd: userToken.password,
        })
          .unwrap()
          .then(res => {
            if (res) {
              showMessage({
                message: '탈퇴 되었습니다.\n이용해 주셔서 감사합니다',
              });
              DeviceEventEmitter.emit(EMIT_EVENT.LOGOUT);
            }
          })
          .finally(() => Spinner.hide());
      },
    });
  };

  return (
    <FixedContainer>
      <CustomHeader text="프로필관리" />

      <ScrollView
        contentContainerStyle={{
          paddingTop: PADDING1,
        }}>
        {/* session user information */}
        <HStack style={styles.wrapSessionUser}>
          {userData?.photoId ? (
            <FastImage
              source={{
                uri: getImageURL(Number(userData?.photoId), true),
              }}
              style={styles.avatarStyle}
            />
          ) : (
            <Icons.NonProfile width={widthScale1(50)} height={widthScale1(50)} />
          )}

          <View style={styles.infoWrapperStyle}>
            <CustomText
              color={colors.menuTextColor}
              size={FONT.BODY}
              family={FONT_FAMILY.SEMI_BOLD}
              string={userData?.nic || '로그인하세요'}
              forDriveMe
            />
            <HStack>
              <CustomText
                color={colors.grayText}
                size={FONT.CAPTION_7}
                family={FONT_FAMILY.MEDIUM}
                string={`${userData?.gender === GENDER.MALE ? '남성' : '여성'}`}
              />

              <Text style={{fontSize: scale1(12), color: colors.grayText}}>{' • '}</Text>
              <CustomText
                color={colors.grayText}
                size={FONT.CAPTION_7}
                family={FONT_FAMILY.MEDIUM}
                string={`${userData?.age}`}
              />
            </HStack>
          </View>

          <Pressable
            onPress={() => {
              navigation.navigate(ROUTE_KEY.EditUserInfo);
            }}>
            <Icons.Pen />
          </Pressable>
        </HStack>

        {/* account */}
        <CustomMenu menuHeight={84} text="계정" subText={userData?.email} disabled hideChevron />
        <Divider />

        {/* phone number */}
        <CustomMenu
          menuHeight={84}
          text="전화번호"
          subText={formatPhoneNumber(userData?.pnum ?? '')}
          onPress={() => {
            navigation.navigate(ROUTE_KEY.EditPhoneNumber);
          }}
        />
        <Divider />

        {/* Certification Management */}
        <CustomMenu
          menuHeight={64}
          text="인증관리"
          onPress={() => {
            navigation.navigate(ROUTE_KEY.BusinessCardAndVaccineCertification);
          }}
        />
        <Divider />

        {/* Change Password */}
        <CustomMenu
          menuHeight={64}
          text="비밀번호 변경"
          onPress={() => {
            navigation.navigate(ROUTE_KEY.ChangePassword);
          }}
        />
        <Divider />

        {/* log out */}
        <CustomMenu menuHeight={64} text="로그아웃" onPress={handleLogout} />
        <Divider />
        {/* Unsubscribe */}

        {__DEV__ ? (
          <CustomMenu menuHeight={64} text="탈퇴하기" onPress={() => console.log('DELETED')} />
        ) : (
          <CustomMenu menuHeight={64} text="탈퇴하기" onPress={handleDeleteAccount} />
        )}

        <Divider />
      </ScrollView>
    </FixedContainer>
  );
};

export default ProfileManagement;

const styles = StyleSheet.create({
  wrapSessionUser: {
    marginHorizontal: PADDING1,
    padding: widthScale1(14),
    backgroundColor: colors.policy,
    borderRadius: scale1(8),
    marginBottom: heightScale1(10),
    gap: widthScale1(16),
  },
  avatarStyle: {
    width: widthScale1(50),
    height: widthScale1(50),
    borderRadius: 999,
  },
  infoWrapperStyle: {
    flex: 1,
    gap: heightScale1(4),
  },
  nicknameTextStyle: {
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    color: colors.menuTextColor,
    fontSize: fontSize1(18),
    lineHeight: heightScale1(25),
  },
  emailTextStyle: {
    fontFamily: FONT_FAMILY.MEDIUM,
    color: colors.grayText,
    fontSize: fontSize1(14),
    lineHeight: heightScale1(20),
  },
});
