import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback, useEffect, useMemo, useRef} from 'react';
import {DeviceEventEmitter, StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import CustomButton from '~components/commons/custom-button';
import EmptyList from '~components/commons/empty-list';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import CreditCardItem from '~components/payment-infomation/credit-card-item';
import DeleteCardPopup, {
  DeleteCardPopupRefs,
} from '~components/payment-infomation/delete-card-popup';
import Spinner from '~components/spinner';
import {PADDING1} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import {CreditCardProps, UserProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheUserInfo} from '~reducers/userReducer';
import {useGetCreditCardListQuery, useSetDefaultCardMutation} from '~services/paymentCardServices';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1} from '~styles/scaling-utils';

const PaymentInfomation = (props: RootStackScreenProps<'PaymentInfomation'>) => {
  const {navigation} = props;
  const dispatch = useAppDispatch();
  const deletePaymentCardRef = useRef<DeleteCardPopupRefs>(null);

  const userToken = useAppSelector(state => state?.userReducer?.userToken);
  const userData = useAppSelector(state => state?.userReducer?.user);

  const {data, refetch, isFetching} = useGetCreditCardListQuery({
    memberId: userToken?.id,
    memberPwd: userToken?.password,
  });

  const [setDefaultCard] = useSetDefaultCardMutation();

  const onPressAddCard = () => {
    navigation.navigate(ROUTE_KEY.CardRegistration, {
      listCards: data as CreditCardProps[],
    });
  };

  const handleSetDefaultCard = async (item: CreditCardProps) => {
    if (item?.defaultYN === IS_ACTIVE.YES) {
      showMessage({
        message: '이미 기본으로 설정된 카드입니다.',
      });
      return;
    }

    if (data) {
      Spinner.show();
      const allPromise = [];
      for (let index = 0; index < data.length; index++) {
        if (data[index]?.id === item?.id) {
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
              id: data[index]?.id,
              defaultYN: IS_ACTIVE.NO,
              memberId: userToken?.id,
              memberPwd: userToken?.password,
            }),
          );
        }
      }
      Promise.all(allPromise)
        .then(() => {
          refetch();
          dispatch(
            cacheUserInfo({
              ...userData,
              cardName: item?.cardName,
            } as UserProps),
          );

          DeviceEventEmitter.emit(EMIT_EVENT.PAYMENT_CARD);
        })
        .finally(() => {
          Spinner.hide();

          showMessage({
            message: '대표 카드가 변경되었습니다.',
          });
        });
    }
  };

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

  const cardDefault = useMemo((): CreditCardProps => {
    return data?.find(item => item?.defaultYN === 'Y') as CreditCardProps;
  }, [data]);

  const remainingCard = useMemo((): CreditCardProps[] => {
    return data?.filter(item => item?.defaultYN !== 'Y') as CreditCardProps[];
  }, [data]);

  const renderDefaultCard = useMemo(() => {
    if (cardDefault) {
      const shouldShowDelete = data?.length === 1;

      return (
        <View>
          <PaddingHorizontalWrapper forDriveMe>
            <View style={styles.defaultCardWrapperStyle}>
              <CreditCardItem
                item={cardDefault}
                onDefaultPress={() => handleSetDefaultCard(cardDefault)}
                isDefaultCard
                {...(shouldShowDelete && {
                  onDeletePress: () => {
                    deletePaymentCardRef?.current?.show(cardDefault, true, data || []);
                  },
                })}
              />
            </View>
          </PaddingHorizontalWrapper>
          <Divider
            style={{
              marginVertical: heightScale1(30),
            }}
          />
        </View>
      );
    }
    return null;
  }, [cardDefault, data, handleSetDefaultCard]);

  const renderCard = useCallback(
    ({item, index}: {item: CreditCardProps; index: number}) => {
      return (
        <View>
          {index === 0 && (
            <CustomText
              string="대표 외 등록카드"
              family={FONT_FAMILY.BOLD}
              size={FONT.BODY}
              textStyle={{
                marginBottom: heightScale1(20),
                paddingHorizontal: PADDING1,
              }}
              forDriveMe
            />
          )}

          <View
            style={{
              marginBottom: heightScale1(30),
              paddingHorizontal: PADDING1,
            }}>
            <CreditCardItem
              item={item}
              onDefaultPress={() => handleSetDefaultCard(item)}
              onDeletePress={() => {
                deletePaymentCardRef?.current?.show(
                  item,
                  item?.defaultYN === IS_ACTIVE.YES,
                  data || [],
                );
              }}
            />
          </View>
        </View>
      );
    },
    [handleSetDefaultCard],
  );

  const renderEmptyList = useCallback(() => {
    return <EmptyList text="등록된 카드가 없습니다." top={heightScale1(304)} />;
  }, []);

  return (
    <FixedContainer>
      <CustomHeader text="결제카드관리" />

      <FlashList
        estimatedItemSize={70}
        data={remainingCard}
        ListHeaderComponent={renderDefaultCard}
        renderItem={renderCard}
        contentContainerStyle={styles.containerStyle}
        ListEmptyComponent={data?.length === 0 ? renderEmptyList : null}
        onRefresh={refetch}
        refreshing={isFetching}
      />

      <PaddingHorizontalWrapper forDriveMe>
        <CustomButton
          onPress={onPressAddCard}
          buttonStyle={styles.submitStyle}
          text="카드 등록하기"
          disabled={data && data?.length >= 3 ? true : false}
          buttonHeight={58}
          onDisabledButtonPress={() => {
            showMessage({
              message: '카드는 최대 3개까지 등록이 가능합니다.',
            });
          }}
        />
      </PaddingHorizontalWrapper>

      <DeleteCardPopup ref={deletePaymentCardRef} />
    </FixedContainer>
  );
};

export default memo(PaymentInfomation);

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: PADDING1,
  },
  defaultCardWrapperStyle: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: scale1(8),
    padding: PADDING1,
  },
  submitStyle: {
    marginVertical: PADDING1 / 2,
  },
  warningViewStyle: {
    backgroundColor: colors.heavyGray,
    minHeight: heightScale1(48),
    paddingHorizontal: PADDING1,
    justifyContent: 'center',
    borderRadius: scale1(8),
    marginBottom: heightScale1(10),
  },
});
