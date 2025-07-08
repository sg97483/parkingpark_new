import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {DeviceEventEmitter, StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import ReactNativeModal from 'react-native-modal';
import CustomButton from '~components/commons/custom-button';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import {strings} from '~constants/strings';
import {CreditCardProps} from '~constants/types';
import {
  useDeletePaymentCardMutation,
  useSetDefaultCardMutation,
} from '~services/paymentCardServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

export interface DeleteCardPopupRefs {
  show: (card: CreditCardProps, isDeleteDefaultCard: boolean, listCards: CreditCardProps[]) => void;
}

const DeleteCardPopup = forwardRef((_, ref) => {
  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const [deletePaymentCard, {isLoading}] = useDeletePaymentCardMutation();
  const [setDefaultCard, {isLoading: isSettingDefault}] = useSetDefaultCardMutation();

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<CreditCardProps | null>(null);
  const [isDeleteDefaultCard, setIsDeleteDefaultCard] = useState<boolean>(false);
  const [listCards, setListCards] = useState<CreditCardProps[]>([]);

  const show = (
    card: CreditCardProps,
    isDeleteDefaultCard: boolean,
    listCards: CreditCardProps[],
  ) => {
    setIsVisible(true);
    setSelectedCard(card);
    setIsDeleteDefaultCard(isDeleteDefaultCard);
    setListCards(listCards);
  };

  const hide = () => {
    setIsVisible(false);
    setSelectedCard(null);
  };

  useImperativeHandle(
    ref,
    () => ({
      show,
    }),
    [],
  );

  const handleDeletePaymentCard = () => {
    deletePaymentCard({
      id: selectedCard?.id,
      memberId: userToken?.id,
      memberPwd: userToken?.password,
    })
      .unwrap()
      .then(async res => {
        if (res === '200') {
          if (isDeleteDefaultCard) {
            const tempt = listCards.filter(item => item?.id !== selectedCard?.id) || [];
            if (tempt?.length > 0) {
              await setDefaultCard({
                defaultYN: IS_ACTIVE.YES,
                id: tempt[0]?.id,
                memberId: userToken?.id,
                memberPwd: userToken?.password,
              });
            }
          }
          DeviceEventEmitter.emit(EMIT_EVENT.UPDATED_USER);
          DeviceEventEmitter.emit(EMIT_EVENT.PAYMENT_CARD);
        } else {
          showMessage({
            message: strings?.general_text?.please_try_again,
          });
        }
      })
      .finally(() => {
        hide();
      });
  };

  return (
    <ReactNativeModal
      onBackButtonPress={() => (isLoading || isSettingDefault ? () => {} : hide())}
      onBackdropPress={() => (isLoading || isSettingDefault ? () => {} : hide())}
      isVisible={isVisible}
      useNativeDriver>
      <View style={styles.containerStyle}>
        <CustomText
          textStyle={styles.headerTextStyle}
          size={FONT.BODY}
          family={FONT_FAMILY.SEMI_BOLD}
          string="카드를 삭제하시겠습니까?"
          forDriveMe
        />
        <CustomText
          string={'삭제된 카드는 복구할수 없습니다.\n삭제를 원하시면 삭제하기를 클릭해주세요!'}
          textStyle={styles.textStyle}
          forDriveMe
          lineHeight={heightScale1(20)}
          color={colors.grayText2}
        />

        <HStack style={{gap: widthScale1(10)}}>
          <CustomButton
            buttonHeight={58}
            onPress={hide}
            type="TERTIARY"
            text="취소하기"
            disabled={isLoading}
            buttonStyle={{flex: 1}}
          />

          <CustomButton
            buttonHeight={58}
            onPress={handleDeletePaymentCard}
            text="삭제하기"
            isLoading={isLoading}
            buttonStyle={{flex: 1}}
          />
        </HStack>
      </View>
    </ReactNativeModal>
  );
});

export default DeleteCardPopup;

const styles = StyleSheet.create({
  containerStyle: {
    padding: PADDING1,
    backgroundColor: colors.white,
    borderRadius: scale1(8),
  },
  headerTextStyle: {
    textAlign: 'center',
    marginBottom: heightScale1(10),
  },
  textStyle: {
    textAlign: 'center',
    color: colors.grayText2,
    marginBottom: heightScale1(30),
  },
  buttonStyle: {
    flex: 1,
    borderRadius: scale1(8),
  },
});
