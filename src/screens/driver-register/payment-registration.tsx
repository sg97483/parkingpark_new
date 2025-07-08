import storage from '@react-native-firebase/storage';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {BackHandler, Keyboard} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppModal from '~components/app-modal';
import CustomButton from '~components/commons/custom-button';
import CustomInput from '~components/commons/custom-input';
import SelectBox from '~components/commons/select-box';
import ViewCardImage from '~components/commons/view-card-image';
import CustomHeader from '~components/custom-header';
import BottomSheetPaymentRegistration, {
  ModalBottomPaymentRefs,
} from '~components/driver-register/bottom-sheet-payment-registration';
import FixedContainer from '~components/fixed-container';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import Spinner from '~components/spinner';
import {IS_IOS, PADDING1} from '~constants/constant';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {RootStackScreenProps} from '~navigators/stack';
import {onSavePaymentAccount} from '~reducers/settlementReducer';
import {cacheMyDriverInfo} from '~reducers/userReducer';
import {
  useLazyReadMyDriverQuery,
  useUpdateDriverAuthMutation,
  useUpdateDriverBankImageMutation,
  useUpdateDriverBankMutation,
} from '~services/userServices';
import {useAppDispatch} from '~store/storeHooks';
import {heightScale1} from '~styles/scaling-utils';
import {sleep} from '~utils/index';

const PaymentRegistration = (props: RootStackScreenProps<'PaymentRegistration'>) => {
  const text = strings.driver_register;
  const {navigation, route} = props;

  const isCarpoolPayment = route.params?.isCarpoolPayment;
  const {myDriverInfo, userID, CMemberID} = userHook();
  const [updateDriverAuth] = useUpdateDriverAuthMutation();
  const dispatch = useAppDispatch();
  const paymentRefs = useRef<ModalBottomPaymentRefs>(null);

  const [accountNumber, setAccountNumber] = useState<string>(
    (myDriverInfo?.bankNum as string) || '',
  );
  const [ownerName, setOwnerName] = useState<string>((myDriverInfo?.pName as string) || '');
  const [cardAuthentication, setCardAuthentication] = useState<any>(
    myDriverInfo?.bankImageUrl ? {uri: myDriverInfo?.bankImageUrl as string} : null,
  );

  const [bankName, setBankName] = useState<string>((myDriverInfo?.bankName as string) || '');
  const [updateDriverBank] = useUpdateDriverBankMutation();
  const [updateDriverBankImage] = useUpdateDriverBankImageMutation();
  const [updateDriverProfile] = useLazyReadMyDriverQuery();

  const imgPickerRefs = useRef<ImagePickerModalRefs>(null);

  const isUrlFirebaseStorage = useMemo(() => {
    const cardAuth = cardAuthentication?.uri?.includes('https://firebasestorage.googleapis.com');

    return cardAuth;
  }, [cardAuthentication]);

  // back handler - android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      AppModal.show({
        title: '정말 나가시겠습니까?',
        content: '입력된 내용은 저장되지 않습니다.',
        textNo: '취소',
        textYes: '확인',
        isTwoButton: true,
        yesFunc() {
          navigation.goBack();
        },
      });
      return true;
    });

    return () => backHandler.remove();
  }, []);

  const handleSubmit = async () => {
    Spinner.show();

    if (!isCarpoolPayment) {
      updateDriverAuth({authYN: 'N', memberId: userID?.toString()})
        .unwrap()
        .then(res => {});
    }

    updateDriverBank({
      memberId: userID?.toString(),
      bankName: bankName,
      bankNum: accountNumber,
      pName: ownerName,
      calYN: 'M',
    })
      .unwrap()
      .then(async res => {
        if (!isUrlFirebaseStorage) {
          const paymentUrl = await handleUploadImage();

          await updateDriverBankImage({
            c_memberId: CMemberID?.toString(),
            bankImageUrl: paymentUrl,
          })
            .unwrap()
            .then(res => {
              console.log('🚀 ~ file: payment-registration.tsx:84 ~ awaitPromise.all ~ res:', res);
            })
            .catch(err => {
              console.log('🚀 ~ file: payment-registration.tsx:87 ~ handleSubmit ~ err:', err);
            });
        }

        // update my driver profile
        await updateDriverProfile({
          memberId: userID?.toString(),
        })
          .unwrap()
          .then(res => {
            dispatch(cacheMyDriverInfo(res));
          })
          .finally(async () => {
            await sleep(200);
            navigation.goBack();
            Spinner.hide();
          });

        dispatch(
          onSavePaymentAccount({
            bankName: bankName,
            accountNumber: accountNumber,
            ownerName: ownerName,
          }),
        );
      });
  };

  const handleUploadImage = async () => {
    if (cardAuthentication) {
      const url = IS_IOS ? cardAuthentication?.uri.replace('file://', '') : cardAuthentication?.uri;
      const storageImg = storage().ref(`/Bank/${userID}`);

      await storageImg.putFile(url as string);

      return await storageImg.getDownloadURL();
    } else {
      return '';
    }
  };

  return (
    <FixedContainer edges={['top', 'bottom']}>
      <CustomHeader
        text={text.sign_up_payment}
        onPressBack={() => {
          AppModal.show({
            title: '정말 나가시겠습니까?',
            content: '입력된 내용은 저장되지 않습니다.',
            textNo: '취소',
            textYes: '확인',
            isTwoButton: true,
            yesFunc() {
              navigation.goBack();
            },
          });
        }}
      />

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={{paddingTop: heightScale1(20)}}>
        <PaddingHorizontalWrapper forDriveMe containerStyles={{gap: heightScale1(30)}}>
          <SelectBox
            onPress={() => {
              Keyboard.dismiss();
              paymentRefs.current?.show();
            }}
            placeholderText="은행을 선택해주세요."
            value={bankName}
            title={text.choose_bank}
          />

          <CustomInput
            title={text.account_number}
            placeholder="계좌번호를 입력해주세요."
            value={accountNumber}
            onChangeText={setAccountNumber}
            // maxLength={}
            keyboardType="number-pad"
          />

          <CustomInput
            title={text.owner_account}
            placeholder="예금주를 입력해주세요."
            value={ownerName}
            onChangeText={setOwnerName}
            maxLength={20}
          />

          <ViewCardImage
            onPress={() => {
              Keyboard.dismiss();
              imgPickerRefs.current?.show();
            }}
            title={text.attach_image_bank_card}
            subTitle="첨부해주신 이미지는 통장인증을 위해 사용되니 정확한 계좌 정보가 확인되는 이미지를 첨부 바랍니다."
            content="계좌번호 사본을 등록해주세요."
            sourceImage={cardAuthentication}
          />
        </PaddingHorizontalWrapper>
      </KeyboardAwareScrollView>

      <PaddingHorizontalWrapper containerStyles={{marginVertical: PADDING1 / 2}}>
        <CustomButton
          buttonHeight={58}
          text={'등록하기'}
          onPress={handleSubmit}
          disabled={bankName && ownerName && accountNumber && cardAuthentication ? false : true}
        />
      </PaddingHorizontalWrapper>

      <BottomSheetPaymentRegistration ref={paymentRefs} onSelectBankName={setBankName} />

      <ImagePickerModal ref={imgPickerRefs} onImage={image => setCardAuthentication(image)} />
    </FixedContainer>
  );
};

export default PaymentRegistration;
