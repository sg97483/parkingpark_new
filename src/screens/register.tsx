import React, {memo, useEffect, useRef, useState} from 'react';
import {DeviceEventEmitter, KeyboardAvoidingView, Platform, ScrollView, StyleSheet} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {useDispatch} from 'react-redux';
import CustomButton from '~components/commons/custom-button';
import CustomCheckbox from '~components/commons/custom-checkbox';
import CustomInput from '~components/commons/custom-input';
import LineButton from '~components/commons/line-button';
import SelectBox from '~components/commons/select-box';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import SubscriptionPathModal, {
  SubscriptionPathModalRefs,
} from '~components/register/subscription-path-modal';
import {IS_IOS, PADDING1} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {UserProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheUserToken} from '~reducers/userReducer';
import API from '~services/api';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {encrypt} from '~utils/encrypt';
import {checkValidateEmail, randomRecomCode} from '~utils/index';

const Register = (props: RootStackScreenProps<'Register'>) => {
  const {navigation, route} = props;
  const userData = route?.params?.data;

  const subPathModal = useRef<SubscriptionPathModalRefs>(null);

  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>('');
  const [nickname, setNickName] = useState<string>('');
  const [agree, setAgree] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>(__DEV__ ? '' : '');
  const [refernce, setRefernce] = useState<string>('');
  const [loginType, setLoginType] = useState<string>(IS_IOS ? 'i' : 'a');

  const [editSubscription, setEditSubscription] = useState(false);

  useEffect(() => {
    console.log('Platform.OS:', Platform.OS); // ✅ 여기에 추가

    if (userData?.email) {
      setEmail(userData?.email);
    }
    if (userData?.nickname) {
      setNickName(userData?.nickname);
    }
    if (userData?.phoneNumber) {
      setPhoneNumber(userData?.phoneNumber);
    }
    if (userData?.loginType) {
      setLoginType(userData?.loginType);
    }
  }, [userData]);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(EMIT_EVENT.VERIFY_PHONE_NUMBER_DONE, (value: string) => {
      setPhoneNumber(value);
    });
    return () => sub.remove();
  }, []);

  const onPressVerifyPhoneNumber = async () => {
    navigation.navigate(ROUTE_KEY.VerifyPhoneNumber, {});
  };

  const onChangeValueDropdow = (item: any) => {
    setRefernce(item);
  };

  const checkData = () => {
    //const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

    const jointext = refernce;

    if (!email) {
      showMessage({message: '이메일 주소를 입력해 주세요'});
      return;
    }
    if (!nickname) {
      showMessage({message: '이름 또는 닉네임을 입력해 주세요'});
      return;
    }
    if (!jointext) {
      showMessage({message: '가입경로를 입력해 주세요'});
      return;
    }
    if (!password) {
      showMessage({message: '비밀번호를 입력해 주세요'});
      return;
    }
    if (!phoneNumber) {
      showMessage({message: '휴대폰인증을 해주세요'});
      return;
    }
    if (phoneNumber == '0') {
      showMessage({message: '휴대폰인증을 다시 해주세요'});
      return;
    }

    if (!passwordRegex.test(password)) {
      console.log('비밀번호 규칙이 다름', password);
      showMessage({
        message: '비밀번호 입력시 영문, 숫자, 특수문자 혼용하여 8자이상 입력하셔야합니다.',
      });
      return;
    }

    if (password.trim().length < 8) {
      showMessage({message: '비밀번호는 8자 이상 입력해 주셔야 합니다'});
      return;
    }
    if (!agree) {
      showMessage({message: '이용약관에 동의해 주세요'});
      return;
    }
    if (!checkValidateEmail(email)) {
      showMessage({message: '이메일 주소의 형식이 올바르지 않습니다'});
      return;
    }
    if (password !== confirmPassword) {
      showMessage({message: '비밀번호와 재확인 비밀번호가 서로 다릅니다'});
      return;
    }

    submit();
  };

  const submit = async () => {
    const formData = new FormData();
    formData.append('recomCode', randomRecomCode());
    formData.append('email', email);
    formData.append('nic', nickname);
    formData.append('jointext', refernce);
    formData.append('phonetext', phoneNumber);
    formData.append('pwd', encrypt(password));
    formData.append('deviceToken', null);
    formData.append('socialLoginType', loginType);

    const res = await API.post('sMember/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('🚀 ~ file: register.tsx:158 ~ submit ~ res:', res?.data);
    if (res.data.statusCode == '503') {
      showMessage({
        message: '이미 사용중인 이름(닉네임)입니다. 이름이 중복일시 닉네임으로 입력바랍니다',
      });
      return;
    }
    if (res.data.statusCode == '504') {
      showMessage({
        message: '이미 가입된 이메일 주소 입니다',
      });
      return;
    }
    if (res.data.statusCode === '200') {
      showMessage({
        message: '회원가입이 완료 되었습니다.\n적립금 1,000원이 적립되었습니다',
      });
      const data: UserProps = res.data?.listMember;
      dispatch(
        cacheUserToken({
          id: data?.id,
          password: encrypt(password),
          adminYN: data?.adminYN,
          adminValetParkingId: data?.adminValetParkingId,
          parkingLotId: data?.parkingLotId,
        }),
      );
      navigation.goBack();
    }
  };

  return (
    <FixedContainer>
      <CustomHeader text="회원가입" />

      <KeyboardAvoidingView behavior={IS_IOS ? 'padding' : undefined} style={styles.containerStyle}>
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}>
          {/* Nickname */}
          <CustomInput
            title="닉네임"
            value={nickname}
            onChangeText={setNickName}
            placeholder="이름 또는 닉네임을 입력해주세요."
          />

          {/* Email */}
          <CustomInput
            title="이메일"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="이메일을 입력해주세요."
          />

          {/* Password */}
          <CustomInput
            title="비밀번호 입력"
            onChangeText={setPassword}
            secureTextEntry={true}
            value={password}
            placeholder="비밀번호 입력(영문,숫자,특수문자 혼용하여 8자 이상)"
          />

          {/* Verify Password */}
          <CustomInput
            title="비밀번호 확인"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            placeholder="비밀번호 확인을 위해 한번 더 입력해주세요."
          />

          {/* Phone */}
          <HStack style={{gap: widthScale1(10), alignItems: 'flex-end'}}>
            <CustomInput
              title="휴대폰 번호"
              editable={false}
              value={phoneNumber}
              placeholder="휴대폰인증 버튼을 눌러주세요."
            />

            <CustomButton
              type="SECONDARY"
              text="휴대폰인증"
              buttonHeight={48}
              textSize={FONT.SUB_HEAD}
              buttonStyle={{
                paddingHorizontal: widthScale1(16),
                top: -heightScale1(1),
              }}
              onPress={onPressVerifyPhoneNumber}
            />
          </HStack>

          {/* Subscription Path. */}
          <SelectBox
            onChangeText={setRefernce}
            isEdit={editSubscription}
            title="가입경로"
            placeholderText={editSubscription ? '직접입력' : '가입경로를 선택해주세요.'}
            value={refernce}
            onPress={() => {
              subPathModal?.current?.show();
            }}
          />

          {/* Terms and policy */}
          <HStack
            style={{
              gap: widthScale1(4),
            }}>
            <CustomCheckbox
              text=""
              style={{top: 1}}
              isChecked={agree}
              onPress={() => setAgree(!agree)}
            />
            <LineButton
              onPress={() => {
                // Linking.openURL('http://cafe.wisemobile.kr/parkingpark_temrs/tab2.html')
                navigation.navigate(ROUTE_KEY.TermsAndPolicies);
              }}
              text="파킹박 이용안내 및 약관"
              fontSize={FONT.CAPTION_6}
            />
            <CustomText
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText}
              string="에 동의합니다."
            />
          </HStack>
        </ScrollView>

        <PaddingHorizontalWrapper
          containerStyles={{
            marginTop: heightScale1(10),
            marginBottom: PADDING1 / 2,
          }}
          forDriveMe>
          <CustomButton onPress={checkData} buttonHeight={58} text="회원가입" />
        </PaddingHorizontalWrapper>
      </KeyboardAvoidingView>

      <SubscriptionPathModal
        onSelectPath={path => {
          setRefernce(path === '직접입력' ? '' : path);
          setEditSubscription(path === '직접입력');
        }}
        ref={subPathModal}
      />
    </FixedContainer>
  );
};

export default memo(Register);

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  contentContainerStyle: {
    padding: PADDING1,
    gap: heightScale1(30),
  },
});
