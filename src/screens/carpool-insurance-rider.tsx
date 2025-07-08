import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {KeyboardAvoidingView, ScrollView, StyleSheet, TextInput, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import CustomButton from '~components/commons/custom-button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import InputRegistrationNumber from '~components/service-terms-and-conditions/input-registration-number';
import Spinner from '~components/spinner';
import {IS_IOS, PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {CarpoolInsuranceRiderPolicyText} from '~constants/policy-data';
import {strings} from '~constants/strings';
import {RootStackScreenProps} from '~navigators/stack';
import {useCreateCMemberMutation} from '~services/userServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {dayjs} from '~utils/dayjsUtil';

const regex = /^-?\d+(\.\d+)?$/;

export interface InsuranceProps {
  accept: {'1': boolean; '2': boolean; '3': boolean};
  realname: string;
  jumin1: string;
  jumin2: string;
}

const CarpoolInsuranceRider = (props: RootStackScreenProps<'CarpoolInsuranceRider'>) => {
  const {navigation, route} = props;
  const {acceptCarpool, data, disagreeCarpool} = route.params;

  const isFocused = useIsFocused();

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const inputJumin1 = useRef<TextInput>(null);
  const inputJumin2 = useRef<TextInput>(null);
  const inputRealName = useRef<TextInput>(null);
  const scrollView = useRef<ScrollView>(null);

  const [accept, setAccept] = useState(data?.accept);

  const [realname, setRealname] = useState(data.realname);
  const [jumin1, setJumin1] = useState(data.jumin1);
  const [jumin2, setJumin2] = useState(data.jumin2);

  const [createCMember] = useCreateCMemberMutation();

  useEffect(() => {
    if (!isFocused && disableButon) {
      const data = {
        accept: accept,
        jumin1: jumin1,
        jumin2: jumin2,
        realname: realname,
      };

      disagreeCarpool?.(data);
    }
  }, [isFocused]);

  const disableButon = useMemo(
    () =>
      !accept[1] ||
      !accept[2] ||
      !accept[3] ||
      jumin1.length !== 6 ||
      jumin2.length !== 7 ||
      !realname,
    [accept, realname, jumin1, jumin2],
  );

  const onChangeTextJumin1 = (text: string) => {
    const newText = regex.test(text) ? text : '';
    setJumin1(newText);
    if (newText.length === 6) {
      inputJumin2.current?.focus();
    }
  };
  const onChangeTextJumin2 = (text: string) => {
    const newText = regex.test(text) ? text : '';
    setJumin2(newText);
    if (newText.length === 7) {
      scrollView.current?.scrollToEnd({animated: true});
      setTimeout(() => {
        inputRealName.current?.focus();
      }, 100);
    }
  };

  const onPressButton = () => {
    if (!realname.trim()) {
      showMessage({message: '성함을 입력해주세요.'});
      return;
    }
    Spinner.show();
    const jumin = `${jumin1}${jumin2}`;
    createCMember({jumin: jumin, memberId: userToken.id?.toString(), realName: realname})
      .unwrap()
      .then(res => {
        if (res) {
          showMessage({message: '카풀 안심 보험 가입 동의완료'});
          acceptCarpool?.({accept: accept, jumin1: jumin1, jumin2: jumin2, realname: realname});
          navigation.goBack();
        }
      })
      .finally(() => Spinner.hide());
  };

  return (
    <FixedContainer>
      <CustomHeader text="태워줘-카풀 안심보험 가입동의" headerTextStyle={styles.textHeader} />

      <KeyboardAvoidingView behavior={IS_IOS ? 'padding' : undefined} style={{flex: 1}}>
        <ScrollView
          ref={scrollView}
          keyboardShouldPersistTaps={'handled'}
          style={styles.contentView}>
          <CarpoolInsuranceRiderPolicyText onChangeAccept={setAccept} accept={accept} />

          <View style={styles.viewBottom}>
            <CustomText
              family={FONT_FAMILY.SEMI_BOLD}
              forDriveMe
              color={colors.grayText2}
              string={`${dayjs().format('YYYY년 MM월 DD일')}`}
              textStyle={{
                textAlign: 'right',
              }}
              lineHeight={heightScale1(20)}
            />

            <View style={{gap: PADDING1}}>
              <View style={styles.viewInput}>
                <CustomText
                  family={FONT_FAMILY.MEDIUM}
                  size={FONT.CAPTION_6}
                  forDriveMe
                  color={colors.grayText2}
                  string={strings.agree_to_subscribe_to_carpool.resident_registration_number}
                />

                <InputRegistrationNumber
                  ref={inputJumin1}
                  keyboardType="numeric"
                  maxLength={6}
                  onChangeText={onChangeTextJumin1}
                  value={jumin1}
                  style={styles.inputBottom}
                  placeholder={strings.agree_to_subscribe_to_carpool.placeholder}
                  placeholderTextColor={colors.disableButton}
                />

                <CustomText
                  family={FONT_FAMILY.MEDIUM}
                  size={FONT.CAPTION_6}
                  forDriveMe
                  color={colors.grayText2}
                  string={' - '}
                />

                <InputRegistrationNumber
                  ref={inputJumin2}
                  keyboardType="numeric"
                  maxLength={7}
                  onChangeText={onChangeTextJumin2}
                  value={jumin2}
                  style={styles.inputBottom}
                  placeholder={'0000000'}
                  placeholderTextColor={colors.disableButton}
                />
              </View>

              <View style={styles.viewInput}>
                <CustomText
                  family={FONT_FAMILY.MEDIUM}
                  size={FONT.CAPTION_6}
                  forDriveMe
                  color={colors.grayText2}
                  string={strings.agree_to_subscribe_to_carpool.principle}
                />

                <InputRegistrationNumber
                  ref={inputRealName}
                  value={realname}
                  onChangeText={setRealname}
                  style={styles.inputBottom}
                  placeholder={strings.agree_to_subscribe_to_carpool.placeholderName}
                  placeholderTextColor={colors.disableButton}
                  maxLength={5}
                />

                <CustomText
                  family={FONT_FAMILY.MEDIUM}
                  forDriveMe
                  color={colors.grayText2}
                  string={strings.agree_to_subscribe_to_carpool.name}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomButton
        buttonStyle={{marginHorizontal: PADDING1, marginVertical: heightScale1(10)}}
        onPress={onPressButton}
        text={'확인'}
        type="PRIMARY"
        disabled={disableButon}
        buttonHeight={58}
      />
    </FixedContainer>
  );
};

export default CarpoolInsuranceRider;

const styles = StyleSheet.create({
  textHeader: {
    textAlign: 'center',
  },
  contentView: {
    paddingHorizontal: PADDING1,
  },
  viewInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  viewBottom: {
    marginTop: heightScale1(40),
    marginBottom: heightScale1(50),
    gap: heightScale1(16),
  },
  inputBottom: {
    fontFamily: FONT_FAMILY.MEDIUM,
    fontSize: fontSize1(14),
    lineHeight: heightScale1(20),
    width: widthScale1(70),
    textAlign: 'center',
  },
});
