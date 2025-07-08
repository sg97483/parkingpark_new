import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {FavoriteUserModel} from '~/model/driver-model';
import AppModal from '~components/app-modal';
import EmptyList from '~components/commons/empty-list';
import Divider from '~components/divider';
import FavoriteUserItem from '~components/favorites/favorite-user-item';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {
  useGetFavoriteDriverListQuery,
  useRemoveFavoriteDriverMutation,
} from '~services/carpoolServices';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';

const FavoriteDriver: React.FC = memo(() => {
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
  const {userID} = userHook();
  const navigation = useNavigation<UseRootStackNavigation>();

  const {data, isLoading, isFetching, refetch} = useGetFavoriteDriverListQuery({
    memberId: userID || 0,
  });
  const [removeFavoriteDriver] = useRemoveFavoriteDriverMutation();

  const handleRemoveFavoriteDriver = useCallback(
    (driverID: number) => {
      AppModal.show({
        title: '정말 즐겨찾기를 해제하시겠어요?',
        content: '해제된 즐겨찾기 내역은 복구될수 없습니다.',
        isTwoButton: true,
        textNo: '아니요',
        textYes: '해제하기',
        yesFunc: () => {
          removeFavoriteDriver({
            driverId: driverID,
            memberId: userID as number,
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
    [removeFavoriteDriver, userID, refetch],
  );

  useEffect(() => {
    if (isFirstTime && !isLoading && !isFetching) {
      setIsFirstTime(false);
    }
  }, [isLoading, isFetching, isFirstTime]);

  const renderItem = useCallback(
    ({item}: {item: FavoriteUserModel}) => {
      return (
        <View>
          <FavoriteUserItem
            onPress={() => {
              navigation.navigate(ROUTE_KEY.DriverProfile, {
                driverID: item?.driverId as number,
                driverName: item?.nic,
              });
            }}
            item={item}
            onRemoveFavoritePress={() => handleRemoveFavoriteDriver(item?.driverId as number)}
          />
          <Divider />
        </View>
      );
    },
    [handleRemoveFavoriteDriver, navigation],
  );

  const keyExtractor = useCallback((item: FavoriteUserModel, index: number) => {
    return item?.id?.toString();
  }, []);

  return (
    <View style={styles.containerStyle}>
      <FlashList
        data={data}
        estimatedItemSize={85}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onRefresh={refetch}
        refreshing={!isFirstTime && (isLoading || isFetching)}
        ListEmptyComponent={() => (
          <EmptyList text="즐겨찾는 드라이버가 없습니다." top={heightScale1(258)} />
        )}
      />
    </View>
  );
});

export default FavoriteDriver;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
