import {useFocusEffect} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import React, {useCallback, useMemo} from 'react';
import {DeviceEventEmitter, StyleSheet} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import AppModal from '~components/app-modal';
import CustomButton from '~components/commons/custom-button';
import EmptyList from '~components/commons/empty-list';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import VehicleItem from '~components/vehicle-payment-usage-favorite-management/vehicle-item';
import {PADDING1} from '~constants/constant';
import {EMIT_EVENT} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {CarModel} from '~model/car-model';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {
  useDeleteMyCarMutation,
  useGetMyRegisterdCarQuery,
  useSetDefaultCardMutation,
  useUpdateCarUserMutation,
} from '~services/userServices';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';

const VehicleManagement = (props: RootStackScreenProps<'VehicleManagement'>) => {
  const {navigation} = props;
  const {userID, userToken} = userHook();

  const {data, refetch, isUninitialized} = useGetMyRegisterdCarQuery({
    memberId: userID as number,
  });

  const listCar = useMemo(() => {
    return [
      ...(data?.filter(item => item?.mainCarYN === 'Y') ?? []),
      ...(data?.filter(item => item?.mainCarYN !== 'Y') ?? []),
    ];
  }, [data]);

  const [deleteCar] = useDeleteMyCarMutation();
  const [setDefaultCar] = useSetDefaultCardMutation();
  const [updateCarInfo] = useUpdateCarUserMutation();

  useFocusEffect(
    useCallback(() => {
      if (!isUninitialized) {
        refetch();
      }
    }, [isUninitialized]),
  );

  const onSelectItem = useCallback(
    (item: CarModel) => () => {
      AppModal.show({
        title: `${item?.carNumber} 차량을\n대표차량으로 변경 하시겠습니까?`,
        isTwoButton: true,
        textNo: '닫기',
        textYes: '변경',
        yesFunc: async () => {
          await setDefaultCar({
            id: item?.id,
            memberId: userToken?.id as number,
          });
          await updateCarInfo({
            carColor: item?.carColor ?? '',
            carCompany: item?.carCompany ?? '',
            carModel: item?.carModel ?? '',
            carNumber: item?.carNumber ?? '',
            carYear: item?.carYear ?? '',
            id: userToken?.id as number,
            pwd: userToken?.password,
          });
          DeviceEventEmitter.emit(EMIT_EVENT.UPDATED_USER);
          DeviceEventEmitter.emit(EMIT_EVENT.UPDATED_CAR); // 차량 정보 업데이트 이벤트 발생
          refetch();
        },
        content: '',
      });
    },
    [setDefaultCar, refetch, userToken],
  );

  const handleDeleteCar = useCallback(
    (item: CarModel) => {
      return () => {
        AppModal.show({
          title: `${item?.carNumber} 차량을\n삭제하시겠습니까?`,
          isTwoButton: true,
          textNo: '닫기',
          textYes: '삭제',
          yesFunc: () => {
            deleteCar({
              id: item?.id,
              memberId: userID as number,
            })
              .unwrap()
              .then(res => {
                if (res !== '200') {
                  showMessage({
                    message: strings?.general_text?.please_try_again,
                  });
                  return;
                }
                refetch();
              });
          },
          content: '',
        });
      };
    },
    [deleteCar, userID, refetch],
  );

  const renderCarItem = useCallback(
    ({item}: {item: CarModel}) => {
      return (
        <VehicleItem
          item={item}
          onDefaultPress={onSelectItem(item)}
          onDeletePress={handleDeleteCar(item)}
        />
      );
    },
    [onSelectItem, handleDeleteCar],
  );

  return (
    <FixedContainer>
      <CustomHeader text="차량번호관리" />

      <FlashList
        data={data}
        estimatedItemSize={90}
        renderItem={renderCarItem}
        contentContainerStyle={{
          paddingHorizontal: PADDING1,
          paddingTop: PADDING1,
        }}
        scrollEnabled={false}
        ListEmptyComponent={() => (
          <EmptyList text={'등록된 차량번호가 없습니다.\n차량번호를 등록해주세요.'} />
        )}
      />

      <CustomButton
        text="차량 등록하기"
        buttonHeight={58}
        onPress={() => {
          navigation.navigate(ROUTE_KEY.VehicleRegistration, {
            isAddNewCar: true,
          });
        }}
        buttonStyle={styles.completeButton}
        disabled={listCar && listCar?.length >= 3}
        onDisabledButtonPress={() => {
          showMessage({
            message: '차량정보는 최대 3대까지 등록이 가능합니다.',
            backgroundColor: colors.heavyGray,
          });
        }}
      />
    </FixedContainer>
  );
};

export default VehicleManagement;

const styles = StyleSheet.create({
  completeButton: {
    marginHorizontal: PADDING1,
    marginBottom: PADDING1 / 2,
    marginTop: heightScale1(10),
  },
});
