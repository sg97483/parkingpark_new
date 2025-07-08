import {useFocusEffect} from '@react-navigation/native';
import {uniqueId} from 'lodash';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import CustomBoxSelectButton from '~components/commons/custom-box-select-button';
import CustomButton from '~components/commons/custom-button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import ConfirmMoneyPopup, {ConfirmMoneyRefs} from '~components/deposit-money/confirm-money-popup';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import Spacer from '~components/spacer';
import {IS_IOS, PADDING1} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetCreditCardListQuery} from '~services/paymentCardServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {getNumberWithCommas, getStringWithoutCommas} from '~utils/numberUtils';

const RECOMMEND_DEPOSIT: {id: string; title: string; value: string}[] = [
  {
    id: uniqueId(),
    title: '3만원',
    value: '30,000',
  },
  {
    id: uniqueId(),
    title: '5만원',
    value: '50,000',
  },
  {
    id: uniqueId(),
    title: '8만원',
    value: '80,000',
  },
  {
    id: uniqueId(),
    title: '10만원',
    value: '100,000',
  },
];

const DepositMoney = memo((props: RootStackScreenProps<'DepositMoney'>) => {
  const {navigation} = props;
  const confirmMoneyRef = useRef<ConfirmMoneyRefs>(null);
  const userToken = useAppSelector(state => state?.userReducer?.userToken);
  const inputRef = useRef<TextInput>(null);

  const [money, setMoney] = useState<string>('');

  const {data: listPaymentCard, refetch} = useGetCreditCardListQuery(
    {
      memberId: userToken?.id,
      memberPwd: userToken?.password,
    },
    {refetchOnFocus: true},
  );

  useEffect(() => {
    const paymentCardChangeListeners = DeviceEventEmitter.addListener(
      EMIT_EVENT.PAYMENT_CARD,
      () => {
        refetch();
      },
    );
    return () => {
      paymentCardChangeListeners.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      inputRef?.current?.focus();
      refetch();
    }, []),
  );

  const handleSepositMoney = () => {
    if (!userToken?.id || !userToken?.password) {
      navigation.navigate(ROUTE_KEY.Login);
      showMessage({
        message: strings?.general_text?.login_first,
      });
      return;
    }

    if (Number(getStringWithoutCommas(money)) < 30000) {
      showMessage({
        message: '3만원 이하는 충전이 불가능합니다.',
      });
      return;
    }

    if (listPaymentCard?.length === 0) {
      navigation.navigate(ROUTE_KEY.PaymentInfomation);
      showMessage({
        message: '충전하기 전에 신용카드를 추가 부탁드립니다.',
      });
      return;
    }

    const defaultCard = listPaymentCard?.find(item => item?.defaultYN === 'Y');

    if (!defaultCard) {
      navigation.navigate(ROUTE_KEY.PaymentInfomation);
      showMessage({
        message: '충전하기 전에 디폴트 신용카드를 설정해주시기 바랍니다.',
      });
      return;
    } else {
      Keyboard.dismiss();
      confirmMoneyRef?.current?.show(Number(getStringWithoutCommas(money)), defaultCard);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <FixedContainer>
        <CustomHeader text="충전금충전" />

        <KeyboardAvoidingView
          behavior={IS_IOS ? 'padding' : undefined}
          style={{
            flex: 1,
          }}>
          <View style={styles.displayMoneyWrapperStyle}>
            <CustomText
              forDriveMe
              string="얼마를 충전할까요?"
              size={FONT.CAPTION_9}
              family={FONT_FAMILY.SEMI_BOLD}
              lineHeight={heightScale1(31)}
            />

            <Pressable onPress={() => inputRef?.current?.focus()}>
              <HStack style={{marginTop: heightScale1(10)}}>
                <TextInput
                  placeholder="0"
                  style={styles.inputStyle}
                  placeholderTextColor={colors.menuTextColor}
                  value={money}
                  onChangeText={value => {
                    const oriText = getStringWithoutCommas(value);
                    setMoney(getNumberWithCommas(oriText));
                  }}
                  maxLength={10}
                  keyboardType="number-pad"
                  ref={inputRef}
                />
                <Spacer insetNumber={10} />
                <CustomText
                  numberOfLines={1}
                  string={'원'}
                  size={FONT.CAPTION_11}
                  family={FONT_FAMILY.SEMI_BOLD}
                  forDriveMe
                />
              </HStack>
            </Pressable>
          </View>

          <PaddingHorizontalWrapper forDriveMe>
            <HStack style={{gap: widthScale1(10)}}>
              {RECOMMEND_DEPOSIT?.flatMap(item => {
                return (
                  <CustomBoxSelectButton
                    onSelected={() => setMoney(item?.value)}
                    text={item?.title}
                    selected={false}
                    key={item?.id}
                  />
                );
              })}
            </HStack>
          </PaddingHorizontalWrapper>

          <View style={styles.termViewStyle}>
            <CustomText
              forDriveMe
              string="- 현재 최소 충전금액은 3만원 이상입니다."
              color={colors.lineCancel}
              family={FONT_FAMILY.MEDIUM}
              lineHeight={heightScale1(20)}
            />
            <CustomText
              forDriveMe
              string="  (충전 정책은 변경될 수 있으며, 최소 충전금액도 조정될 수 있습니다.)  "
              color={colors.lineCancel}
              family={FONT_FAMILY.MEDIUM}
              lineHeight={heightScale1(20)}
            />

            <CustomText
              forDriveMe
              string="- 충전금 결제시 충전금 2% 추가 충전 및 적립금 1%가 추가 적립됩니다."
              color={colors.lineCancel}
              family={FONT_FAMILY.MEDIUM}
              lineHeight={heightScale1(20)}
            />
          </View>

          <CustomButton
            type="PRIMARY"
            onPress={handleSepositMoney}
            text="충전하기"
            buttonStyle={styles.submitButtonStyle}
            buttonHeight={58}
          />
        </KeyboardAvoidingView>

        {/* Confirm */}
        <ConfirmMoneyPopup
          listPaymentCard={listPaymentCard}
          ref={confirmMoneyRef}
          onSuccess={() => navigation.goBack()}
        />
      </FixedContainer>
    </TouchableWithoutFeedback>
  );
});

export default DepositMoney;

const styles = StyleSheet.create({
  displayMoneyWrapperStyle: {
    paddingHorizontal: PADDING1,
    marginVertical: PADDING1,
  },
  depositButtonStyle: {
    minHeight: heightScale1(32),
    borderWidth: 1,
    borderRadius: 999,
    justifyContent: 'center',
    paddingHorizontal: widthScale1(14),
    paddingVertical: heightScale1(6),
    borderColor: colors.disableButton,
  },
  keyboardWrapperStyle: {
    flex: 1,
  },
  submitButtonStyle: {
    marginHorizontal: PADDING1,
    marginTop: 'auto',
    marginVertical: PADDING1 / 2,
  },
  inputStyle: {
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    fontSize: fontSize1(26),
  },
  termViewStyle: {
    marginTop: PADDING1,
    borderRadius: scale1(4),
    backgroundColor: colors.policy,
    paddingHorizontal: PADDING1,
    paddingVertical: heightScale1(16),
    marginHorizontal: PADDING1,
  },
});
