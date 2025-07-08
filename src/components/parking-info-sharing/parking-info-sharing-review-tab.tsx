import {DeviceEventEmitter, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  useGetBBSNoticeListQuery,
  useLazyBbsListQuery,
  useLikeReviewMutation,
} from '~services/parkingServices';
import {BBSNoticeProps, ParkingEvalProps} from '~constants/types';
import {FlashList} from '@shopify/flash-list';
import LoadMoreButton from '~components/load-more-button';
import ParkingInfoSharingItem from './parking-info-sharing-item';
import {useAppSelector} from '~store/storeHooks';
import {showMessage} from 'react-native-flash-message';
import {EMIT_EVENT} from '~constants/enum';
import PlaceHolderView from '~components/place-holder-view';
import {Divider} from 'react-native-paper';
import BBSNoticeItem from './bbs-notice-item';

const ParkingInfoSharingReviewTab = () => {
  const [lastID, setLastID] = useState<number>(0);
  const [getBBSList, {isFetching}] = useLazyBbsListQuery();
  const [likeReview] = useLikeReviewMutation();

  const [listData, setListData] = useState<ParkingEvalProps[]>([]);
  const [isEndList, setIsEndList] = useState<boolean>(false);
  const [firstRender, setFirstRender] = useState<boolean>(true);

  const userToken = useAppSelector(state => state?.userReducer?.userToken);
  const {data: listBBSNotice, refetch: refetchBBSNoticeList} = useGetBBSNoticeListQuery();

  const handleGetData = () => {
    if (lastID === 0) {
      setListData([]);
      setFirstRender(true);
    }
    getBBSList({
      count: 10,
      lastID: lastID,
      parkingID: -1,
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

  useEffect(() => {
    handleGetData();
  }, [lastID]);

  useEffect(() => {
    const addReviewListeners = DeviceEventEmitter.addListener(EMIT_EVENT.ADD_REVIEW, () => {
      setLastID(0);
      handleGetData();
    });

    return () => {
      addReviewListeners.remove();
    };
  }, []);

  const renderItem = useCallback(
    ({item, index}: {item: ParkingEvalProps; index: number}) => {
      return (
        <ParkingInfoSharingItem
          index={index}
          item={item}
          onLike={() => {
            handleLike(item?.id);
          }}
          isReview={true}
        />
      );
    },
    [listData],
  );

  const renderFooter = useCallback(() => {
    return (
      <>
        {isEndList ? null : (
          <LoadMoreButton
            isFetching={isFetching}
            onPress={() => {
              setLastID(listData[listData?.length - 1]?.id);
            }}
          />
        )}
      </>
    );
  }, [isEndList, listData, isFetching]);

  const handleLike = (id: number) => {
    console.log('🚀 ~ file: parking-info-sharing-review-tab.tsx:100 ~ handleLike ~ id', id);
    likeReview({
      id: id,
      userID: userToken?.id,
    })
      .unwrap()
      .then(res => {
        console.log('🚀 ~ file: parking-info-sharing-review-tab.tsx:105 ~ .then ~ res', res);
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
      <FlashList
        data={listData}
        renderItem={renderItem}
        estimatedItemSize={200}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={headerComponent}
        onRefresh={() => {
          if (lastID === 0) {
            handleGetData();
          } else {
            setLastID(0);
          }
        }}
        refreshing={isFetching}
      />

      {isFetching && firstRender ? <PlaceHolderView /> : null}
    </View>
  );
};

export default ParkingInfoSharingReviewTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
