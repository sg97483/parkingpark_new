import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {Divider} from 'react-native-paper';
import LoadMoreButton from '~components/load-more-button';
import {BBSNoticeProps, ParkingEvalProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {
  useGetBBSNoticeListQuery,
  useGetParkingSharingLocationMutation,
  useLazyBbsListQuery,
  useLikeReviewMutation,
} from '~services/parkingServices';
import {useAppSelector} from '~store/storeHooks';
import BBSNoticeItem from './bbs-notice-item';
import CreatePostButton from './create-post-button';
import ParkingInfoSharingItem from './parking-info-sharing-item';

const ParkingInfoSharingLocationTab = () => {
  const navigation: UseRootStackNavigation = useNavigation();
  const regionData = useAppSelector(state => state?.weatherReducer?.codeRegion);
  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const [listData, setListData] = useState<ParkingEvalProps[]>([]);
  const [likeReview] = useLikeReviewMutation();
  const [getBBSList, {isFetching}] = useLazyBbsListQuery();
  const [getParkingSharingLocation, {isLoading}] = useGetParkingSharingLocationMutation();
  const {data: listBBSNotice, refetch: refetchBBSNoticeList} = useGetBBSNoticeListQuery();

  const [isEndList, setIsEndList] = useState<boolean>(false);
  const [lastID, setLastID] = useState<number>(0);
  const [firstRender, setFirstRender] = useState<boolean>(true);

  useEffect(() => {
    getParkingSharingLocation({
      state: regionData.state,
      city: regionData.city,
      count: 10,
      lastId: 0,
    })
      .unwrap()
      .then(res => {
        if (res) {
          setListData(res);
        } else {
          showMessage({message: '네트워크 연결상태를 확인해 주세요'});
        }
      });
  }, [regionData]);

  useEffect(() => {
    handleGetData();
  }, [lastID]);

  const handleGetData = () => {
    if (lastID === 0) {
      setListData([]);
      setFirstRender(true);
    }
    getBBSList({
      count: 10,
      lastID: lastID,
    })
      .unwrap()
      .then(res => {
        if (res?.length < 10) {
          setIsEndList(true);
        }
        setListData(oldValue => {
          if (oldValue?.length > 0) {
            return [...oldValue, ...res];
          } else {
            return res;
          }
        });
        setFirstRender(false);
      });
  };

  const renderItem = useCallback(
    ({item, index}: {item: ParkingEvalProps; index: number}) => {
      return (
        <ParkingInfoSharingItem
          index={index}
          item={item}
          onLike={() => {
            handleLike(item?.id);
          }}
        />
      );
    },
    [listData],
  );

  const handleLike = (id: number) => {
    likeReview({
      id: id,
      userID: userToken?.id,
    })
      .unwrap()
      .then(res => {
        if (res === '502') {
          showMessage({
            message: '이미 좋아요를 누르셨습니다.',
          });
        }
        if (res === '200') {
          const tempt = [...listData].map(item => {
            if (item?.id === id) {
              return {
                ...item,
                likeCount: item?.likeCount + 1,
              };
            } else {
              return {
                ...item,
              };
            }
          });
          setListData(tempt);
        }
      });
  };

  const renderFooter = useCallback(() => {
    return (
      <>
        {isEndList ? null : (
          <LoadMoreButton
            isFetching={isLoading}
            onPress={() => {
              setLastID(listData[listData?.length - 1]?.id);
            }}
          />
        )}
      </>
    );
  }, [isEndList, listData, isLoading]);

  const renderBBSNoticeItem = useCallback(({item}: {item: BBSNoticeProps}) => {
    return <BBSNoticeItem item={item} />;
  }, []);

  const headerComponent = useCallback(() => {
    return (
      <FlashList
        data={listBBSNotice}
        estimatedItemSize={200}
        renderItem={renderBBSNoticeItem}
        scrollEnabled={false}
        ItemSeparatorComponent={() => {
          return <Divider />;
        }}
        ListFooterComponent={() => {
          return <Divider />;
        }}
      />
    );
  }, [listBBSNotice]);

  return (
    <View style={styles.container}>
      <CreatePostButton
        onPress={() => navigation.navigate(ROUTE_KEY.CreateBBS, {city: '', state: ''})}
      />

      <FlashList
        data={listData}
        renderItem={renderItem}
        estimatedItemSize={200}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={headerComponent}
        onRefresh={() => {
          refetchBBSNoticeList();
          if (lastID === 0) {
            handleGetData();
          } else {
            setLastID(0);
          }
        }}
        refreshing={isLoading}
        nestedScrollEnabled
      />
    </View>
  );
};

export default ParkingInfoSharingLocationTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
