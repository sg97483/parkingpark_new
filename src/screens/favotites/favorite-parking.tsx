import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback} from 'react';
import {View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import AppModal from '~components/app-modal';
import EmptyList from '~components/commons/empty-list';
import Divider from '~components/divider';
import FavoriteParkingItem from '~components/favorites/favorite-parking-item';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {FavoriteParkingParkModel} from '~model/parking-park-model';
import {
  useGetFavoriteParkingParkListQuery,
  useRemoveFavoriteParkingMutation,
} from '~services/parkingServices';
import {heightScale1} from '~styles/scaling-utils';

const FavoriteParking: React.FC = memo(() => {
  const {userID} = userHook();
  const {data, refetch, isFetching} = useGetFavoriteParkingParkListQuery({
    memberId: userID as number,
  });
  const [removeFavoriteParking] = useRemoveFavoriteParkingMutation();

  const handleRemoveFavoriteParking = useCallback(
    (parkingID: number) => {
      AppModal.show({
        title: '정말 즐겨찾기를 해제하시겠어요?',
        content: '주차장 정보 화면에서 즐겨찾기에\n다시 등록 가능합니다.',
        isTwoButton: true,
        textNo: '아니요',
        textYes: '해제하기',
        yesFunc: () => {
          removeFavoriteParking({
            memberId: userID as number,
            parkId: parkingID,
          })
            .unwrap()
            .then(res => {
              if (res !== '200') {
                showMessage({
                  message: strings.general_text?.please_try_again,
                });
                return;
              }
              refetch();
            });
        },
      });
    },
    [userID, refetch],
  );

  const renderItem = useCallback(
    ({item}: {item: FavoriteParkingParkModel}) => {
      return (
        <View>
          <FavoriteParkingItem
            item={item}
            onRemovePress={() => {
              handleRemoveFavoriteParking(item?.parkId);
            }}
          />
          <Divider />
        </View>
      );
    },
    [handleRemoveFavoriteParking],
  );

  return (
    <>
      <FlashList
        onRefresh={refetch}
        refreshing={isFetching}
        data={data}
        estimatedItemSize={83}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <EmptyList text="즐겨찾는 주차장이 없습니다." top={heightScale1(258)} />
        )}
      />
    </>
  );
});

export default FavoriteParking;
