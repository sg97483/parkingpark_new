import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {Icons} from '~/assets/svgs';
import AppModal from '~components/app-modal';
import CustomButton from '~components/commons/custom-button';
import CustomCheckbox from '~components/commons/custom-checkbox';
import CustomInput, {CustomInputRefs} from '~components/commons/custom-input';
import CustomRadio from '~components/commons/custom-radio';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import Spinner from '~components/spinner';
import {IS_IOS, PADDING1} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import API from '~services/api';
import {useSetDefaultCardMutation} from '~services/paymentCardServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

const CardRegistration = (props: RootStackScreenProps<'CardRegistration'>) => {
  const {navigation, route} = props;
  const {listCards, functionReservation} = route?.params;

  const {userToken} = userHook();

  const number1Ref = useRef<TextInput>(null);
  const number2Ref = useRef<TextInput>(null);
  const number3Ref = useRef<TextInput>(null);
  const number4Ref = useRef<TextInput>(null);
  const expireDayRef = useRef<CustomInputRefs>(null);
  const passCardRef = useRef<CustomInputRefs>(null);
  const residentRef = useRef<CustomInputRefs>(null);
  const nameCardRef = useRef<CustomInputRefs>(null);

  const [numberCard, setNumberCard] = useState({
    value1: '',
    value2: '',
    value3: '',
    value4: '',
  });
  const [cardName, setCardName] = useState<string>('');
  const [passwordCard, setPasswordCard] = useState<string>('');
  const [expireDay, setExpireDay] = useState<string>('');
  const [isCorporation, setIsCorporation] = useState<boolean>(false);
  const [isHaveNameOnCard, setIsHaveNameOnCard] = useState<boolean>(false);
  const [residentNumber, setResidentNumber] = useState<string>('');
  const [isAgreeTerms, setIsAgreeTerms] = useState<boolean>(false);
  const [isFocusCardNumKey, setIsFocusCardNumKey] = useState<boolean>(false);

  const [setDefaultCard] = useSetDefaultCardMutation();

  const handleChangeMode = useCallback(() => {
    if (isCorporation) {
      setIsCorporation(false);
      setResidentNumber('');
    } else {
      AppModal.show({
        title: '법인카드에 본인의 이름이 있나요?',
        content: '본인의 이름이 있으면 [법인개별카드],\n없으면 [법인공용카드]로 구분됩니다.',
        textNo: '없어요',
        textYes: '있어요',
        isTwoButton: true,
        yesFunc: () => {
          setIsCorporation(true);
          setIsHaveNameOnCard(true);
          setResidentNumber('');
        },
        noFunc: () => {
          setIsCorporation(true);
          setIsHaveNameOnCard(false);
          setResidentNumber('');
        },
      });
    }
  }, [isCorporation]);

  const checkData = () => {
    if (!numberCard.value1 || !numberCard.value2 || !numberCard.value3 || !numberCard.value4) {
      showMessage({message: '카드번호를 입력해 주세요'});
      return;
    }
    if (!cardName) {
      showMessage({message: '이름을 입력해주세요'});
      return;
    }
    if (!isAgreeTerms) {
      showMessage({message: '약관에 동의해 주시기 바랍니다'});
      return;
    }
    if (passwordCard.trim().length != 2) {
      showMessage({message: '신용카드 비밀번호 2자리를 입력해 주세요'});
      return;
    }
    if (isCorporation && !isHaveNameOnCard) {
      if (residentNumber.trim().length < 10) {
        showMessage({message: '사업자번호를 입력해 주세요'});
        return;
      }
    } else {
      if (residentNumber.trim().length < 6) {
        showMessage({message: '생년월일 6자리를 입력해 주세요'});
        return;
      }
    }
    submit();
  };

  const isDisableButton = useMemo((): boolean => {
    if (
      !numberCard?.value1 ||
      !numberCard?.value2 ||
      !numberCard?.value3 ||
      !numberCard?.value4 ||
      !expireDay ||
      !residentNumber ||
      !passwordCard ||
      !passwordCard ||
      !cardName ||
      !isAgreeTerms
    ) {
      return true;
    } else {
      return false;
    }
  }, [numberCard, expireDay, residentNumber, passwordCard, passwordCard, cardName, isAgreeTerms]);

  const submit = async () => {
    Spinner.show();
    const formData = new FormData();

    formData.append('number1', numberCard.value1);
    formData.append('number2', numberCard.value2);
    formData.append('number3', numberCard.value3);
    formData.append('number4', numberCard.value4);
    formData.append('expYear', expireDay.slice(-2));
    formData.append('expMonth', expireDay.substring(0, 2));
    formData.append('idNo', residentNumber);
    formData.append('cardPw', passwordCard);
    formData.append('defaultYN', IS_ACTIVE.YES);
    formData.append('buyerName', cardName);
    formData.append('memberId', userToken.id);
    formData.append('memberPwd', userToken.password);

    const res = await API.post('sMember/crateCreditCard', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.data?.statusCode == 200) {
      if (listCards) {
        const allPromise = [];
        for (let i = 0; i < listCards.length; i++) {
          const item = listCards[i];
          allPromise.push(
            setDefaultCard({
              id: item?.id,
              defaultYN: IS_ACTIVE.NO,
              memberId: userToken?.id,
              memberPwd: userToken?.password,
            }),
          );
        }
        Promise.all(allPromise).then(value => {
          console.log('🚀 ~ .then ~ value:', value);
        });
      }

      DeviceEventEmitter.emit(EMIT_EVENT.UPDATED_USER);
      DeviceEventEmitter.emit(EMIT_EVENT.PAYMENT_CARD);
      Spinner.hide();
      navigation.goBack();
      if (functionReservation) {
        functionReservation();
      }
    } else {
      Spinner.hide();
      showMessage({message: res.data?.statusMsg});
    }
  };

  const handleSetExpireDay = (input: string) => {
    const numericInput = input.replace(/[^0-9]/g, '');

    const truncatedInput = numericInput.substring(0, 4);

    const formattedInput = truncatedInput.replace(/^(\d{2})(\d{0,2})$/, '$1/$2');

    setExpireDay(formattedInput);

    if (formattedInput?.length === 5) {
      passCardRef?.current?.focusInput();
    }
  };

  return (
    <FixedContainer>
      <CustomHeader text="결제카드등록" />

      <KeyboardAvoidingView behavior={IS_IOS ? 'padding' : undefined} style={{flex: 1}}>
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={styles.containerStyle}>
          <PaddingHorizontalWrapper forDriveMe>
            <HStack
              style={{
                justifyContent: 'space-between',
                marginBottom: heightScale1(40),
              }}>
              <CustomText
                forDriveMe
                size={FONT.CAPTION_7}
                family={FONT_FAMILY.MEDIUM}
                string="신용/체크카드 등록 가능해요"
                lineHeight={heightScale1(22)}
              />

              <CustomRadio
                onPress={handleChangeMode}
                isChecked={isCorporation}
                text={
                  !isCorporation ? '법인카드' : isHaveNameOnCard ? '법인개별카드' : '법인공용카드'
                }
                type="PRIMARY"
              />
            </HStack>

            <View style={{gap: heightScale1(30)}}>
              {/* Card number */}
              <View>
                <CustomText
                  color={colors.black}
                  forDriveMe
                  string="카드번호"
                  family={FONT_FAMILY.MEDIUM}
                />
                <HStack
                  style={[
                    styles.cardNumberWrapperStyle,
                    {
                      borderColor: isFocusCardNumKey ? colors.menuTextColor : colors.disableButton,
                    },
                  ]}>
                  <TextInput
                    keyboardType="number-pad"
                    maxLength={4}
                    placeholder="0000"
                    style={styles.cardNumberInputStyle}
                    value={numberCard.value1}
                    ref={number1Ref}
                    onChangeText={text => {
                      setNumberCard({...numberCard, value1: text});
                      if (text.length >= 4) {
                        number2Ref.current?.focus();
                      }
                    }}
                    placeholderTextColor={colors.disableButton}
                    onFocus={() => setIsFocusCardNumKey(true)}
                    onBlur={() => setIsFocusCardNumKey(false)}
                  />
                  <CustomText
                    family={FONT_FAMILY.MEDIUM}
                    color={colors.disableButton}
                    string="-"
                    forDriveMe
                  />
                  <TextInput
                    keyboardType="number-pad"
                    maxLength={4}
                    placeholder="0000"
                    style={styles.cardNumberInputStyle}
                    value={numberCard.value2}
                    ref={number2Ref}
                    onChangeText={text => {
                      setNumberCard({...numberCard, value2: text});
                      if (text.length >= 4) {
                        number3Ref.current?.focus();
                      }
                      if (text?.length === 0) {
                        number1Ref?.current?.focus();
                      }
                    }}
                    placeholderTextColor={colors.disableButton}
                    onFocus={() => setIsFocusCardNumKey(true)}
                    onBlur={() => setIsFocusCardNumKey(false)}
                  />
                  <CustomText
                    family={FONT_FAMILY.MEDIUM}
                    color={colors.disableButton}
                    string="-"
                    forDriveMe
                  />
                  <TextInput
                    keyboardType="number-pad"
                    maxLength={4}
                    placeholder="0000"
                    style={styles.cardNumberInputStyle}
                    value={numberCard.value3}
                    ref={number3Ref}
                    onChangeText={text => {
                      setNumberCard({...numberCard, value3: text});
                      if (text.length >= 4) {
                        number4Ref.current?.focus();
                      }
                      if (text?.length === 0) {
                        number2Ref?.current?.focus();
                      }
                    }}
                    placeholderTextColor={colors.disableButton}
                    onFocus={() => setIsFocusCardNumKey(true)}
                    onBlur={() => setIsFocusCardNumKey(false)}
                  />
                  <CustomText
                    family={FONT_FAMILY.MEDIUM}
                    color={colors.disableButton}
                    string="-"
                    forDriveMe
                  />
                  <TextInput
                    keyboardType="number-pad"
                    maxLength={4}
                    placeholder="0000"
                    style={styles.cardNumberInputStyle}
                    value={numberCard.value4}
                    ref={number4Ref}
                    onChangeText={text => {
                      setNumberCard({...numberCard, value4: text});
                      if (text.length >= 4) {
                        expireDayRef?.current?.focusInput();
                      }
                      if (text?.length === 0) {
                        number3Ref?.current?.focus();
                      }
                    }}
                    placeholderTextColor={colors.disableButton}
                    onFocus={() => setIsFocusCardNumKey(true)}
                    onBlur={() => setIsFocusCardNumKey(false)}
                  />
                </HStack>
              </View>

              {/* expiration period and first 2 digits of password */}
              <HStack style={{gap: widthScale1(10)}}>
                <CustomInput
                  ref={expireDayRef}
                  title="유효기간"
                  placeholder="00/00"
                  keyboardType="number-pad"
                  maxLength={5}
                  value={expireDay}
                  onChangeText={handleSetExpireDay}
                />

                <CustomInput
                  title="비밀번호앞2자리"
                  placeholder="**"
                  secureTextEntry
                  keyboardType="number-pad"
                  maxLength={2}
                  value={passwordCard}
                  onChangeText={text => {
                    setPasswordCard(text);
                    if (text?.length === 2) {
                      residentRef?.current?.focusInput();
                    }
                  }}
                  ref={passCardRef}
                />
              </HStack>

              <CustomInput
                title={
                  !isCorporation
                    ? '주민번호 앞자리'
                    : isHaveNameOnCard
                      ? '주민번호 앞자리(기명식법인)'
                      : '사업자등록번호'
                }
                placeholder={
                  !isCorporation ? 'YYMMDD' : isHaveNameOnCard ? 'YYMMDD' : '사업자번호 10자리'
                }
                maxLength={!isCorporation ? 6 : isHaveNameOnCard ? 6 : 10}
                keyboardType="number-pad"
                value={residentNumber}
                onChangeText={text => {
                  setResidentNumber(text);
                  if (!isCorporation || isHaveNameOnCard) {
                    if (text?.length === 6) {
                      nameCardRef?.current?.focusInput();
                    }
                  } else {
                    if (text?.length === 10) {
                      nameCardRef?.current?.focusInput();
                    }
                  }
                }}
                ref={residentRef}
              />

              <CustomInput
                title={'카드소유자이름'}
                value={cardName}
                onChangeText={setCardName}
                placeholder="홍길동"
                placeholderTextColor={colors.disableButton}
                maxLength={20}
                ref={nameCardRef}
              />
            </View>
          </PaddingHorizontalWrapper>
        </ScrollView>
      </KeyboardAvoidingView>

      <PaddingHorizontalWrapper
        forDriveMe
        containerStyles={{
          marginBottom: PADDING1 / 2,
          marginTop: heightScale1(10),
          gap: PADDING1,
        }}>
        <HStack
          style={{
            justifyContent: 'space-between',
          }}>
          <CustomCheckbox
            onPress={() => setIsAgreeTerms(!isAgreeTerms)}
            isChecked={isAgreeTerms}
            text="전체 약관에 동의합니다."
          />
          <Pressable
            onPress={() => navigation.navigate(ROUTE_KEY.CardTermsAndConditions)}
            hitSlop={40}>
            <Icons.ChevronRight
              stroke={colors.grayText}
              width={widthScale1(16)}
              height={widthScale1(16)}
            />
          </Pressable>
        </HStack>

        <CustomButton
          disabled={isDisableButton}
          onPress={checkData}
          buttonHeight={58}
          text="등록하기"
        />
      </PaddingHorizontalWrapper>
    </FixedContainer>
  );
};

export default CardRegistration;

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: heightScale1(20),
  },
  cardNumberWrapperStyle: {
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: scale1(8),
    marginTop: heightScale1(10),
  },
  cardNumberInputStyle: {
    flex: 1,
    textAlign: 'center',
    minHeight: heightScale1(48),
    fontSize: fontSize1(15),
    fontFamily: FONT_FAMILY.MEDIUM,
    color: colors.menuTextColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputStyle: {
    flex: 1,
    minHeight: heightScale1(48),
    fontSize: fontSize1(14),
    fontFamily: FONT_FAMILY.MEDIUM,
    borderWidth: 1,
    borderColor: colors.disableButton,
    borderRadius: scale1(8),
    marginTop: heightScale1(10),
  },
});
