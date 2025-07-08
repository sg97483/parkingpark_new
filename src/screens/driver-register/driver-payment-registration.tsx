import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomButton from '~components/commons/custom-button';
import PageButton from '~components/commons/page-button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import MenuTextBoxRadius from '~components/menu-text-border-radius';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import Spinner from '~components/spinner';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheMyDriverInfo} from '~reducers/userReducer';
import {
  useLazyReadMyDriverQuery,
  useUpdateDriverAuthMutation,
  useUpdateDriverBankImageMutation,
  useUpdateDriverBankMutation,
} from '~services/userServices';
import {useAppDispatch} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

const DriverPaymentRegistration = (props: RootStackScreenProps<'DriverPaymentRegistration'>) => {
  const [selectedPayment, setSelectedPayment] = useState<string>(
    strings.driver_register.payment_registration[0],
  );

  const {navigation, route} = props;
  const isEditPaymentMethod = route.params?.isEditPaymentMethod;
  const {userID, myDriverInfo, CMemberID} = userHook();

  const [updateDriverBank] = useUpdateDriverBankMutation();
  const [updateDriverAuth] = useUpdateDriverAuthMutation();
  const [updateDriverProfile] = useLazyReadMyDriverQuery();
  const [updateDriverBankImage] = useUpdateDriverBankImageMutation();

  const dispatch = useAppDispatch();

  const renderTextBank = useCallback(() => {
    return (
      <View style={{marginBottom: heightScale1(30)}}>
        <HStack>
          <CustomText
            string="계좌번호"
            family={FONT_FAMILY.REGULAR}
            size={FONT.CAPTION_6}
            color={colors.grayText}
            lineHeight={fontSize1(20)}
            textStyle={{width: widthScale1(49)}}
            forDriveMe
          />
          <CustomText
            string={`${myDriverInfo?.bankName} ${myDriverInfo?.bankNum}`}
            family={FONT_FAMILY.MEDIUM}
            size={FONT.CAPTION_6}
            color={colors.menuTextColor}
            lineHeight={fontSize1(20)}
            textStyle={{paddingLeft: widthScale1(20)}}
            forDriveMe
          />
        </HStack>
        <HStack style={{paddingTop: heightScale1(6)}}>
          <CustomText
            string="예금주"
            family={FONT_FAMILY.REGULAR}
            size={FONT.CAPTION_6}
            color={colors.grayText}
            lineHeight={fontSize1(20)}
            textStyle={{width: widthScale1(49)}}
            forDriveMe
          />
          <CustomText
            string={myDriverInfo?.pName as string}
            family={FONT_FAMILY.MEDIUM}
            size={FONT.CAPTION_6}
            color={colors.menuTextColor}
            lineHeight={fontSize1(20)}
            textStyle={{paddingLeft: widthScale1(20)}}
            forDriveMe
          />
        </HStack>
      </View>
    );
  }, [myDriverInfo]);

  const handleSelectedPayment = (item: string) => {
    setSelectedPayment(item);
  };

  const isHaveBankCard = useMemo(() => {
    return !!myDriverInfo?.bankName && !!myDriverInfo?.bankNum && !!myDriverInfo?.pName;
  }, [myDriverInfo]);

  console.log('🚀 ~ isHaveBankCard ~ isHaveBankCard:', isHaveBankCard);

  const renderRegisterCardPayment = useCallback(() => {
    return (
      <View style={{marginTop: heightScale1(30)}}>
        {!!myDriverInfo?.bankName && !!myDriverInfo?.bankNum && !!myDriverInfo?.pName
          ? renderTextBank()
          : null}

        <PageButton
          text={
            myDriverInfo?.bankName && myDriverInfo?.bankNum
              ? '정산계좌정보 변경'
              : '계좌정보를 등록해주세요.'
          }
          onPress={() =>
            navigation.navigate(ROUTE_KEY.PaymentRegistration, {
              isCarpoolPayment: isEditPaymentMethod as any,
            })
          }
        />

        <View style={[styles.paymentText, {marginTop: heightScale1(20)}]}>
          <CustomText
            string="수수료를 제외한 카풀 금액의 75%가 등록된 계좌로 매주 화요일 지급됩니다."
            family={FONT_FAMILY.MEDIUM}
            size={FONT.CAPTION_6}
            color={colors.lineCancel}
            lineHeight={heightScale1(20)}
            forDriveMe
          />
        </View>
      </View>
    );
  }, [selectedPayment, myDriverInfo]);
  console.log('🚀 ~ DriverPaymentRegistration ~ myDriverInfo?.bankName:', myDriverInfo?.bankName);

  // upload type driver bank
  const registerPayment = () => {
    Spinner.show();

    if (!isEditPaymentMethod) {
      updateDriverAuth({authYN: 'N', memberId: userID?.toString()}).unwrap();
    }

    updateDriverBank({
      memberId: userID?.toString(),
      bankName: !myDriverInfo?.bankName ? '' : myDriverInfo?.bankName,
      bankNum: !myDriverInfo?.bankNum ? '' : myDriverInfo?.bankNum,
      pName: !myDriverInfo?.pName ? '' : myDriverInfo?.pName,
      calYN: 'C',
    })
      .unwrap()
      .then(() => {
        // update my driver profile
        updateDriverBankImage({
          c_memberId: CMemberID?.toString(),
          bankImageUrl: !myDriverInfo?.bankImageUrl ? '' : myDriverInfo?.bankImageUrl,
        }).unwrap();
        2;
        updateDriverProfile({
          memberId: userID?.toString(),
        })
          .unwrap()
          .then(res => {
            dispatch(cacheMyDriverInfo(res));
          });
      })
      .finally(() => {
        Spinner.hide();
        navigation.goBack();
      });
  };

  return (
    <FixedContainer edges={['top', 'bottom']}>
      <CustomHeader />

      <PaddingHorizontalWrapper>
        <CustomText
          string={'카풀 운행을 통해 발생한 수익금을\n지급받을 방식을 선택해주세요.'}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_8}
          color={colors.menuTextColor}
          textStyle={{marginTop: heightScale1(20)}}
          lineHeight={heightScale1(28)}
          forDriveMe
        />

        <MenuTextBoxRadius
          data={strings.driver_register.payment_registration}
          onPress={handleSelectedPayment}
          selected={selectedPayment}
          title=""
          containerStyle={{marginTop: heightScale1(20)}}
        />

        {selectedPayment === strings.driver_register.payment_registration[0] ? (
          <CustomText
            string="수수료를 제외한 카풀 금액의 80%가 충전금으로 운행 다음날 즉시 지급됩니다."
            family={FONT_FAMILY.MEDIUM}
            size={FONT.CAPTION_6}
            color={colors.lineCancel}
            textStyle={[styles.paymentText, {marginTop: heightScale1(30)}]}
            lineHeight={fontSize1(20)}
            forDriveMe
          />
        ) : (
          renderRegisterCardPayment()
        )}
      </PaddingHorizontalWrapper>

      <PaddingHorizontalWrapper containerStyles={{marginTop: 'auto', marginBottom: PADDING1 / 2}}>
        {selectedPayment === strings.driver_register.payment_registration[0] ? (
          <CustomButton
            text={strings.driver_register.register}
            onPress={() => {
              registerPayment();
            }}
            buttonStyle={{
              borderRadius: widthScale1(8),
              paddingVertical: heightScale1(18),
            }}
            buttonHeight={58}
          />
        ) : (
          <CustomButton
            text={'등록하기'}
            onPress={() => {
              Spinner.show();

              if (!isEditPaymentMethod) {
                updateDriverAuth({authYN: 'N', memberId: userID?.toString()}).unwrap();
              }

              updateDriverBank({
                memberId: userID?.toString(),
                bankName: myDriverInfo?.bankName,
                bankNum: myDriverInfo?.bankNum,
                pName: myDriverInfo?.pName,
                calYN: 'M',
              })
                .unwrap()
                .then(() => {
                  // update my driver profile
                  updateDriverBankImage({
                    c_memberId: CMemberID?.toString(),
                    bankImageUrl: myDriverInfo?.bankImageUrl,
                  }).unwrap();
                  updateDriverProfile({
                    memberId: userID?.toString(),
                  })
                    .unwrap()
                    .then(res => {
                      dispatch(cacheMyDriverInfo(res));
                    });
                })
                .finally(() => {
                  Spinner.hide();
                  navigation.goBack();
                });
            }}
            disabled={myDriverInfo?.bankName && myDriverInfo?.bankNum ? false : true}
            buttonHeight={58}
          />
        )}
      </PaddingHorizontalWrapper>
    </FixedContainer>
  );
};

export default DriverPaymentRegistration;

const styles = StyleSheet.create({
  paymentText: {
    paddingVertical: heightScale1(16),
    paddingHorizontal: widthScale1(20),
    backgroundColor: colors.policy,
    borderRadius: widthScale1(4),
    borderWidth: 1,
    borderColor: colors.policy,
  },
});
