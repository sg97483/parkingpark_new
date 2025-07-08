import {
  DeviceEventEmitter,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {IMAGES} from '~/assets/images-path';
import {heightScale, widthScale} from '~styles/scaling-utils';
import CustomText from '~components/custom-text';
import {useAppSelector} from '~store/storeHooks';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {PADDING, width} from '~constants/constant';
import Divider from '~components/divider';
import MenuItem from '~components/user-profile/menu-item';
import HStack from '~components/h-stack';
import {getNumberWithCommas} from '~utils/numberUtils';
import {ROUTE_KEY} from '~navigators/router';
import {getImageURL} from '~utils/getImageURL';
import {AlertYesNo} from '~utils/index';
import {useDeleteAccountMutation, useUpdateUserFCMTokenMutation} from '~services/userServices';
import Spinner from '~components/spinner';
import {showMessage} from 'react-native-flash-message';
import {useGetUserInfoQuery} from '~services/userServices';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ProfileManagementOld = memo((props: RootStackScreenProps<'ProfileManagementOld'>) => {
  const {navigation} = props;

  const userData = useAppSelector(state => state?.userReducer?.user);
  const userToken = useAppSelector(state => state?.userReducer?.userToken);
  const [deleteAccount] = useDeleteAccountMutation();
  const [updateUserFCMToken] = useUpdateUserFCMTokenMutation();
  const firebaseInstance = auth().currentUser;

  useGetUserInfoQuery(
    {
      id: userToken?.id,
      password: userToken?.password,
    },
    {skip: !userToken?.id || !userToken?.password},
  );

  const handleLogout = async () => {
    Spinner.show();
    await updateUserFCMToken({
      memberId: `${userToken?.id}`,
      fcmToken: '',
    });
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
    AlertYesNo(
      '회원탈퇴를 하시면 계정의 정보는 복구할 수 없으며, 같은 이메일주소로 재가입할 수 없습니다.\n탈퇴가 완료 되어도 작성된 게시물이나 댓글은 삭제되지 않으니, 삭제를 원하실 경우 직접 삭제하신 후에 탈퇴를 진행해 주시기 바랍니다.\n탈퇴 하시겠습니까?',
      () => {
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
      undefined,
      '예',
      '아니오',
    );
  };

  const onPressPaymentInfomation = () => {
    navigation.navigate(ROUTE_KEY.PaymentInfomation);
  };

  const mPoint = Number(userData?.mpoint) || 0;
  let usePoint = 0;
  if (userData?.usePointSum) {
    usePoint = Number(userData?.usePointSum);
  }

  const mCharge = Number(userData?.chargeMoney) || 0;

  let mChargeSum = 0;
  if (userData?.usePointSumSklent) {
    mChargeSum = Number(userData?.usePointSumSklent);
  }

  let cancelPoint = 0;
  if (userData?.cancelPoint) {
    cancelPoint = Number(userData?.cancelPoint);
  }

  let cancelCharge = 0;
  if (userData?.cancelPointSklent) {
    cancelCharge = Number(userData?.cancelPointSklent);
  }

  const userPoint = mPoint - usePoint + cancelPoint;
  const userCharge = mCharge - mChargeSum + cancelCharge || 0;

  return (
    <FixedContainer>
      <CustomHeader text="개인정보 보기" />
      <ScrollView style={styles.container}>
        <Image
          source={
            userData?.photoId
              ? {
                  uri: getImageURL(Number(userData?.photoId), false),
                }
              : IMAGES.profile_face
          }
          style={styles.profileImage}
        />

        <View style={styles.infoWrapper}>
          <CustomText
            string={userData?.nic as string}
            size={FONT.BODY}
            family={FONT_FAMILY.SEMI_BOLD}
          />
          <CustomText
            string={`(${userData?.email})`}
            color={colors.darkGray}
            textStyle={{
              marginVertical: heightScale(5),
            }}
          />
          <CustomText string={userData?.pnum as string} color={colors.darkGray} />
        </View>

        <Divider />

        <View style={styles.menuWrapper}>
          {/* Payment infomation */}
          <MenuItem
            title="결제 정보"
            subTitle={userData?.cardName ? userData?.cardName : '카드를등록해 주세요'}
            onPress={onPressPaymentInfomation}
          />
          {/* Vehicle information */}
          <MenuItem
            title="차량 정보"
            subTitle={userData?.carNumber ? userData?.carNumber : '차량정보를 등록해 주세요'}
            onPress={() => {
              navigation.navigate(ROUTE_KEY.VehicleManagement);
            }}
          />
          {/* Edit info */}
          <MenuItem
            title="개인정보 수정"
            onPress={() => {
              navigation.navigate(ROUTE_KEY.EditUserInfoOld);
            }}
          />
        </View>

        <Divider />

        {/* Reserves and charge */}
        <HStack style={styles.menuItemWrapper}>
          <CustomText string="적립금" family={FONT_FAMILY.SEMI_BOLD} />
          <CustomText string={`${getNumberWithCommas(userPoint)}원`} color={colors.blue} />
        </HStack>
        <HStack style={styles.menuItemWrapper}>
          <CustomText string="충전금" family={FONT_FAMILY.SEMI_BOLD} />
          <CustomText string={`${getNumberWithCommas(userCharge)}원`} color={colors.blue} />
        </HStack>
        <CustomText
          textStyle={styles.description}
          color={colors.darkGray}
          size={FONT.CAPTION_2}
          string="*회원 가입시 지급되는 적립금은 동일한 차량번호 및 휴대폰번호 1회만 지급 및 사용가능합니다.(결제 시 중복 차량번호가 확인되면, 적립금 결제분은 취소됩니다)"
        />

        <Divider />

        {/* Logout */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutWrapper}>
          <CustomText string="로그아웃" family={FONT_FAMILY.SEMI_BOLD} />
        </TouchableOpacity>

        {/* Delete Account */}

        <TouchableOpacity onPress={handleDeleteAccount} style={styles.logoutWrapper}>
          <CustomText string="탈퇴하기" family={FONT_FAMILY.SEMI_BOLD} />
        </TouchableOpacity>
      </ScrollView>
      <Image source={IMAGES.profile_banner2} style={styles.adBanner} resizeMode="stretch" />
    </FixedContainer>
  );
});

export default ProfileManagementOld;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: PADDING,
  },
  profileImage: {
    width: widthScale(90),
    height: widthScale(90),
    alignSelf: 'center',
    borderRadius: 999,
  },
  infoWrapper: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: PADDING,
  },
  menuWrapper: {
    marginVertical: PADDING,
  },
  menuItemWrapper: {
    justifyContent: 'space-between',
    marginLeft: PADDING,
    minHeight: heightScale(50),
  },
  description: {
    marginVertical: PADDING,
  },
  logoutWrapper: {
    marginVertical: PADDING,
    marginLeft: PADDING,
  },
  adBanner: {
    width: width,
    height: heightScale(70),
  },
});
