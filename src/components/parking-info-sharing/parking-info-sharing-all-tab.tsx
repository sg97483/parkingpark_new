import {DeviceEventEmitter, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  useGetBBSNoticeListQuery,
  useLazyBbsListQuery,
  useLikeReviewMutation,
} from '~services/parkingServices';
import {BBSNoticeProps, ParkingEvalProps} from '~constants/types';
import {FlashList} from '@shopify/flash-list';
import CreatePostButton from './create-post-button';
import LoadMoreButton from '~components/load-more-button';
import ParkingInfoSharingItem from './parking-info-sharing-item';
import {useAppSelector} from '~store/storeHooks';
import {showMessage} from 'react-native-flash-message';
import {EMIT_EVENT} from '~constants/enum';
import PlaceHolderView from '~components/place-holder-view';
import {UseRootStackNavigation} from '~navigators/stack';
import {useNavigation} from '@react-navigation/native';
import {ROUTE_KEY} from '~navigators/router';
import BBSNoticeItem from './bbs-notice-item';
import Divider from '~components/divider';
import {strings} from '~constants/strings';
import Spinner from '~components/spinner';

const ParkingInfoSharingAllTab = () => {
  const navigation: UseRootStackNavigation = useNavigation();
  const [lastID, setLastID] = useState<number>(0);

  const [getBBSList, {isFetching}] = useLazyBbsListQuery();
  const [likeReview] = useLikeReviewMutation();
  const {data: listBBSNotice, refetch: refetchBBSNoticeList} = useGetBBSNoticeListQuery();

  const [listData, setListData] = useState<ParkingEvalProps[]>([]);
  const [isEndList, setIsEndList] = useState<boolean>(false);
  const [firstRender, setFirstRender] = useState<boolean>(true);

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

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
      })
      .catch(() => {
        Spinner.hide();
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

  const renderBBSNoticeItem = useCallback(({item}: {item: BBSNoticeProps}) => {
    return <BBSNoticeItem item={item} />;
  }, []);

  useEffect(() => {
    const bbsNoticeListeners = DeviceEventEmitter.addListener(EMIT_EVENT.BBS_NOTICE, () => {
      refetchBBSNoticeList();
    });

    return () => {
      bbsNoticeListeners.remove();
    };
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

  const handleCreateBBS = () => {
    if (!userToken?.id || !userToken?.password) {
      showMessage({
        message: strings?.general_text?.login_first,
      });
      navigation.navigate(ROUTE_KEY.Login);
      return;
    }
    navigation.navigate(ROUTE_KEY.CreateBBS, {city: '', state: ''});
  };

  return (
    <View style={styles.container}>
      {/* Create post */}
      <CreatePostButton onPress={handleCreateBBS} />

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
        refreshing={isFetching}
        nestedScrollEnabled
      />

      {isFetching && firstRender ? <PlaceHolderView /> : null}
    </View>
  );
};

export default ParkingInfoSharingAllTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
