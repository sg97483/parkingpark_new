import appleAuth from '@invertase/react-native-apple-authentication';
import {getMessaging} from '@react-native-firebase/messaging';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {getProfile, loginWithKakaoAccount, logout} from '@react-native-seoul/kakao-login';
import NaverLogin from '@react-native-seoul/naver-login';
import jwt_decode from 'jwt-decode';
import React, {memo, useCallback, useState} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {ICONS} from '~/assets/images-path';
import {Icons} from '~/assets/svgs';
import CustomButton from '~components/commons/custom-button';
import CustomInput from '~components/commons/custom-input';
import LineButton from '~components/commons/line-button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import {IS_ANDROID, IS_IOS, NAVER_KEY, PADDING1} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {SNSUserProfile} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheFCMToken, cacheUserToken} from '~reducers/userReducer';
import {
  useLoginWithEmailAndPassMutation,
  useUpdateUserFCMTokenMutation,
} from '~services/userServices';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {encrypt} from '~utils/encrypt';

// zealand1212@gmail.com
// whatthehell3

// sg97483@gmail.com
// 1234

// phung060699@gmail.com
// 12345678

const Login = memo((props: RootStackScreenProps<'Login'>) => {
  const {navigation} = props;
  const dispatch = useAppDispatch();
  const FCMToken = useAppSelector(state => state?.userReducer?.FCMToken);

  const [loginWithEmailAndPass, {isLoading}] = useLoginWithEmailAndPassMutation();
  const [updateUserFCMToken] = useUpdateUserFCMTokenMutation();

  const [email, setEmail] = useState<string>(__DEV__ ? 'sg97483@gmail.com' : '');
  const [password, setPassword] = useState<string>(__DEV__ ? '1234' : '');

  const handleLoginByGoogle = useCallback(async () => {
    GoogleSignin.configure({
      webClientId: IS_ANDROID
        ? '569856446356-52mei7h3r2opnol422olnje6o53qh7h3.apps.googleusercontent.com'
        : '569856446356-7vgpr21i18gf3skkm6uluag40mh35q47.apps.googleusercontent.com',
      offlineAccess: false,
    });
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const {user} = await GoogleSignin.signIn();

      navigation.navigate(ROUTE_KEY.Register, {
        data: {
          email: user?.email || '',
          loginType: IS_ANDROID ? 'G' : 'g',
          nickname: user?.name || '',
          phoneNumber: '',
        },
      });
    } catch (error: any) {
      if (error.toString().includes('cancelled') || error.toString().includes('user canceled')) {
        console.log('CANCELED');
      } else {
        console.log('google login error', error);
      }
    }
  }, []);

  const handleLoginByNaver = useCallback(async () => {
    try {
      NaverLogin.login(NAVER_KEY)
        .then(async ({failureResponse, successResponse}) => {
          if (successResponse?.accessToken) {
            const profileUser = await NaverLogin.getProfile(successResponse?.accessToken);
            if (profileUser?.response) {
              var mobile = '';
              if (profileUser?.response?.mobile && profileUser?.response?.mobile !== 'null') {
                if (profileUser?.response?.mobile?.charAt(0) == '+') {
                  mobile =
                    '0' + profileUser?.response?.mobile?.replace(/[^a-zA-Z0-9+]/g, '').substr(3);
                } else if (
                  profileUser?.response?.mobile &&
                  profileUser?.response?.mobile.match(/^(\d{3})-(\d{4})-(\d{4})$/)
                ) {
                  mobile = profileUser?.response?.mobile?.replace(/-/g, '');
                  console.log('Naver mobile number 테스트', mobile);
                } else {
                  mobile = '0' + profileUser?.response?.mobile?.replace(/[^a-zA-Z0-9]/g, '');
                }
              } else {
                mobile = '';
              }

              const data: SNSUserProfile = {
                email: profileUser?.response?.email || '',
                nickname: profileUser?.response?.name || '',
                phoneNumber: mobile || '',
                loginType: IS_ANDROID ? 'N' : 'n',
              };
              navigation.navigate(ROUTE_KEY.Register, {data});
              console.log('Naver GetProfile Success', {data});
            }
          } else {
            showMessage({
              message: strings?.general_text?.please_try_again,
            });
          }
        })
        .catch(() => {
          showMessage({
            message: strings?.general_text?.please_try_again,
          });
        });
    } catch (error) {}
  }, []);

  const handleLoginByKakao = useCallback(async () => {
    try {
      loginWithKakaoAccount()
        .then(() => {
          getProfile().then(res => {
            var mobile = '';
            if (res?.phoneNumber && res?.phoneNumber !== 'null') {
              if (res?.phoneNumber.charAt(0) == '+') {
                mobile = '0' + res?.phoneNumber.replace(/[^a-zA-Z0-9+]/g, '').substr(3);
              } else {
                mobile = '0' + res?.phoneNumber.replace(/[^a-zA-Z0-9]/g, '');
              }
            } else {
              mobile = '';
            }

            const data: SNSUserProfile = {
              email: res?.email || '',
              nickname: res?.nickname || '',
              phoneNumber: mobile,
              loginType: IS_ANDROID ? 'K' : 'k',
            };

            navigation.navigate(ROUTE_KEY.Register, {data});
            console.log('kakao GetProfile Success', {data});
          });
        })
        .catch(() => {
          showMessage({
            message: strings?.general_text?.please_try_again,
          });
        })
        .finally(async () => {
          await logout();
        });
    } catch (error) {
      console.log('🚀 ~ file: login.tsx:118 ~ handleLoginByKakao ~ error:', error);
    }
  }, []);

  const handleLoginByApple = useCallback(async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      const decodeData: any =
        appleAuthRequestResponse?.identityToken &&
        jwt_decode(appleAuthRequestResponse?.identityToken);

      const data: SNSUserProfile = {
        email: appleAuthRequestResponse?.email || decodeData?.email || '',
        loginType: 'A',
        nickname:
          appleAuthRequestResponse?.fullName?.familyName &&
          appleAuthRequestResponse?.fullName?.givenName
            ? `${appleAuthRequestResponse?.fullName?.familyName} ${appleAuthRequestResponse?.fullName?.givenName}`
            : '',
        phoneNumber: '',
      };

      navigation.navigate(ROUTE_KEY.Register, {data});
    } catch (error) {
      console.log('🚀 ~ file: login.tsx:154 ~ handleLoginByApple ~ error:', error);
    }
  }, []);

  const handleChangePassword = useCallback((text: string) => {
    if (text !== '') {
      setPassword(text?.trim());
    } else {
      setPassword('');
    }
  }, []);

  const handleLoginEmail = async () => {
    if (!email) {
      return;
    }
    if (!password) {
      return;
    }
    if (!password && !email) {
      return;
    }

    const body = {
      email: email,
      password: encrypt(password),
    };

    getMessaging()
      .getToken()
      .then(fcmValue => {
        if (!FCMToken) {
          dispatch(cacheFCMToken(fcmValue));
        }
      })
      .catch(error => {
        console.log('🚀 ~ handleLoginEmail ~ error:', error);
      });

    loginWithEmailAndPass(body)
      .unwrap()
      .then(async res => {
        if (res?.id && res.pwd) {
          dispatch(
            cacheUserToken({
              id: res?.id,
              password: res?.pwd,
              adminYN: res?.adminYN,
              adminValetParkingId: res?.adminValetParkingId,
              parkingLotId: res?.parkingLotId,
            }),
          );
          await updateUserFCMToken({
            memberId: res?.id as any,
            fcmToken: FCMToken,
          });
          navigation.goBack();
        } else {
          showMessage({
            message: '입력하신 계정이 존재하지 않습니다',
          });
        }
      })
      .catch(error => {
        console.log('🚀 ~ file: login.tsx:102 ~ handleLoginEmail ~ error', error);
      });
  };

  return (
    <FixedContainer>
      <CustomHeader text="로그인" />

      <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.containerStyle}>
        <Icons.ParkingPark
          style={{
            alignSelf: 'center',
          }}
        />
        <View style={styles.inputWrapperStyle}>
          <CustomInput
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            title="이메일"
            placeholder="이메일(아이디)를 입력해주세요."
          />
          <CustomInput
            secureTextEntry={true}
            value={password}
            onChangeText={handleChangePassword}
            title="비밀번호"
            placeholder="비밀번호를 입력해주세요."
          />
        </View>

        <CustomButton
          isLoading={isLoading}
          text="로그인"
          buttonHeight={58}
          onPress={handleLoginEmail}
        />

        <View style={styles.footerWrapperStyle}>
          <CustomText
            forDriveMe
            family={FONT_FAMILY.MEDIUM}
            color={colors.lineCancel}
            string="간편 회원가입"
          />

          <HStack style={{gap: PADDING1}}>
            <Pressable onPress={handleLoginByGoogle}>
              <Image source={ICONS.google} style={styles.snsIconStyle} />
            </Pressable>

            <Pressable onPress={handleLoginByKakao}>
              <Image source={ICONS.kakao} style={styles.snsIconStyle} />
            </Pressable>

            <Pressable onPress={handleLoginByNaver}>
              <Image source={ICONS.naver} style={styles.snsIconStyle} />
            </Pressable>

            {IS_IOS && (
              <Pressable onPress={handleLoginByApple}>
                <Image source={ICONS.apple} style={styles.snsIconStyle} />
              </Pressable>
            )}
          </HStack>

          <HStack style={{gap: widthScale1(10)}}>
            <LineButton
              onPress={() => navigation.navigate(ROUTE_KEY.ActivityCheckPnum)}
              text="비밀번호 변경"
              buttonColor={colors.grayText}
            />
            <View style={styles.dividerLine} />
            <LineButton
              onPress={() => navigation.navigate(ROUTE_KEY.Register)}
              text="회원가입"
              buttonColor={colors.grayText}
            />
          </HStack>
        </View>
      </ScrollView>
    </FixedContainer>
  );
});

export default Login;

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: heightScale1(30),
    paddingHorizontal: PADDING1,
  },
  inputWrapperStyle: {
    gap: PADDING1,
    marginVertical: heightScale1(30),
  },
  footerWrapperStyle: {
    marginTop: heightScale1(41),
    gap: PADDING1,
    alignItems: 'center',
  },
  snsIconStyle: {
    width: widthScale1(50),
    height: widthScale1(50),
  },
  dividerLine: {
    width: widthScale1(1),
    height: heightScale1(10),
    backgroundColor: '#C6C6C6',
  },
});
