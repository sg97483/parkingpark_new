import {BottomSheetModal, BottomSheetView, useBottomSheetModal} from '@gorhom/bottom-sheet';
import React, {forwardRef, useCallback, useImperativeHandle, useRef} from 'react';
import {DeviceEventEmitter, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomButton from '~components/commons/custom-button';
import ToastMessage from '~components/commons/toast-message/toast-message';
import ToastMessageController from '~components/commons/toast-message/toast-message-controller';
import CustomBackdrop from '~components/custom-backdrop';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import {CreditCardProps, UserProps} from '~constants/types';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {cacheUserInfo} from '~reducers/userReducer';
import {useSetDefaultCardMutation} from '~services/paymentCardServices';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  listPaymentCard: CreditCardProps[] | undefined;
  navigation: UseRootStackNavigation;
}

export interface PaymentChangeCardRefs {
  show: () => void;
  hide: () => void;
}

const PaymentChangeCard = forwardRef((props: Props, ref) => {
  const {listPaymentCard, navigation} = props;
  const modalRef = useRef<BottomSheetModal>(null);
  const {dismissAll} = useBottomSheetModal();
  const {userToken} = userHook();
  const dispatch = useAppDispatch();
  const userData = useAppSelector(state => state?.userReducer?.user);

  const show = useCallback(() => {
    modalRef?.current?.present();
  }, []);

  const hide = useCallback(() => {
    modalRef?.current?.close();
  }, []);

  useImperativeHandle(ref, () => ({show, hide}), []);

  const [setDefaultCard, {isLoading}] = useSetDefaultCardMutation();

  const handleSetDefaultCard = useCallback(
    (item: CreditCardProps) => {
      return () => {
        if (item?.defaultYN === IS_ACTIVE.YES) {
          ToastMessageController.show('이미 기본으로 설정된 카드입니다.');
          return;
        }

        const allPromise = [];
        if (listPaymentCard) {
          for (let index = 0; index < listPaymentCard?.length; index++) {
            if (listPaymentCard[index]?.id === item?.id) {
              allPromise.push(
                setDefaultCard({
                  id: item?.id,
                  defaultYN: IS_ACTIVE.YES,
                  memberId: userToken?.id,
                  memberPwd: userToken?.password,
                }),
              );
            } else {
              allPromise.push(
                setDefaultCard({
                  id: listPaymentCard[index]?.id,
                  defaultYN: IS_ACTIVE.NO,
                  memberId: userToken?.id,
                  memberPwd: userToken?.password,
                }),
              );
            }
          }
          Promise.all(allPromise)
            .then(() => {
              dispatch(
                cacheUserInfo({
                  ...userData,
                  cardName: item?.cardName,
                } as UserProps),
              );
              setTimeout(() => {
                DeviceEventEmitter.emit(EMIT_EVENT.UPDATED_USER);
                DeviceEventEmitter.emit(EMIT_EVENT.PAYMENT_CARD);
              }, 250);
            })
            .finally(() => {
              ToastMessageController.show('대표 카드가 변경되었습니다.');
            });
        }
      };
    },
    [listPaymentCard, userData],
  );

  return (
    <BottomSheetModal
      backdropComponent={props => <CustomBackdrop {...props} onPressBackdrop={hide} />}
      enableDynamicSizing
      index={0}
      handleComponent={null}
      ref={modalRef}>
      <BottomSheetView
        pointerEvents={isLoading ? 'none' : undefined}
        style={{
          gap: heightScale1(30),
        }}>
        <CustomText
          string="결제수단선택"
          forDriveMe
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_7}
          textStyle={{
            marginTop: heightScale1(30),
            textAlign: 'center',
          }}
        />
        <PaddingHorizontalWrapper forDriveMe containerStyles={{gap: PADDING1}}>
          {listPaymentCard?.flatMap(item => {
            return (
              <HStack
                style={{
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  padding: PADDING1,
                  borderRadius: scale1(8),
                  borderColor: item?.defaultYN === 'Y' ? colors.primary : colors.grayCheckBox,
                }}
                key={item?.id}>
                <View style={{gap: heightScale1(4)}}>
                  <CustomText
                    string={`${item?.number1}-****-****-${item?.number4}`}
                    forDriveMe
                    family={FONT_FAMILY.MEDIUM}
                    size={FONT.CAPTION_7}
                  />

                  <HStack style={{gap: widthScale1(4)}}>
                    <CustomText
                      string={item?.cardName?.replace('[', '').replace(']', '')}
                      forDriveMe
                      family={FONT_FAMILY.MEDIUM}
                      color={colors.grayText}
                    />
                    <Icons.Dot fill={colors.grayText} />
                    <CustomText
                      string="신용"
                      forDriveMe
                      family={FONT_FAMILY.MEDIUM}
                      color={colors.grayText}
                    />
                  </HStack>
                </View>

                <CustomButton
                  text="선택"
                  buttonHeight={38}
                  textSize={FONT.CAPTION_6}
                  buttonStyle={{
                    paddingHorizontal: widthScale1(10),
                    minWidth: widthScale1(45),
                  }}
                  onPress={handleSetDefaultCard(item)}
                  type={item?.defaultYN === 'Y' ? 'PRIMARY' : 'TERTIARY'}
                  outLine={item?.defaultYN !== 'Y'}
                />
              </HStack>
            );
          })}
        </PaddingHorizontalWrapper>

        <PaddingHorizontalWrapper
          containerStyles={{
            gap: heightScale1(10),
            marginBottom: heightScale1(42),
            marginTop: heightScale1(10),
          }}
          forDriveMe>
          <CustomButton text="결제하기" buttonHeight={58} onPress={hide} isLoading={isLoading} />
          {listPaymentCard?.length === 3 ? null : (
            <CustomButton
              text="결제수단추가"
              buttonHeight={58}
              type="TERTIARY"
              outLine
              leftIconReload
              iconType="PLUS"
              onPress={() => {
                dismissAll();
                navigation.navigate(ROUTE_KEY.CardRegistration, {
                  listCards: listPaymentCard,
                });
              }}
            />
          )}
        </PaddingHorizontalWrapper>

        <ToastMessage
          containerStyle={{
            bottom: '50%',
          }}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default PaymentChangeCard;
