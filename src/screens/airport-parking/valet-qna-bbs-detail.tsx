import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  DeviceEventEmitter,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {useSelector} from 'react-redux';
import CustomHeader from '~components/custom-header';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import LoadMoreButton from '~components/load-more-button';
import UserDetailModal, {UserDetailModalRefs} from '~components/parking-details/user-detail-modal';
import Spinner from '~components/spinner';
import ValetQnaBbsDetailContent from '~components/valet-qna-bbs-detail/valet-qna-bbs-detail-content';
import ValetQnaBbsDetailProfile from '~components/valet-qna-bbs-detail/valet-qna-bbs-detail-profile';
import ValetQnaBbsDetailReply from '~components/valet-qna-bbs-detail/valet-qna-bbs-detail-reply';
import ValetQnaBbsDetailReplyItem from '~components/valet-qna-bbs-detail/valet-qna-bbs-detail-reply-item';
import {PADDING, PADDING_HEIGHT} from '~constants/constant';
import {EMIT_EVENT} from '~constants/enum';
import {strings} from '~constants/strings';
import {ReplyProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {
  useCreateValetQnaBbsReplyMutation,
  useDeleteQnaBbsMutation,
  useDeleteValetBbsReplyMutation,
  useLazyValetQnaBbsReplyQuery,
} from '~services/parkingServices';
import {RootState} from '~store/store';
import {colors} from '~styles/colors';
import {AlertYesNo, isEmpty} from '~utils/index';

const ValetQnaBbsDetail = memo((props: RootStackScreenProps<'ValetQnaBbsDetail'>) => {
  const {navigation, route} = props;

  const bbs = route?.params?.bbs;

  const userDetailModalRef = useRef<UserDetailModalRefs>(null);

  const userToken = useSelector((state: RootState) => state.userReducer.userToken);

  console.log('userToken: ', userToken);

  const [replyText, setReplyText] = useState<string>('');

  const [deleteQnaBbs] = useDeleteQnaBbsMutation();
  const [deleteReplyItem] = useDeleteValetBbsReplyMutation();
  const [createBbsReply] = useCreateValetQnaBbsReplyMutation();
  const [getListReply, {isFetching}] = useLazyValetQnaBbsReplyQuery();

  const [lastID, setLastID] = useState<number>(0);
  const [listReply, setListReply] = useState<ReplyProps[]>([]);
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);

  const handleGetListReply = () => {
    if (lastID === 0) {
      setListReply([]);
      setCanLoadMore(false);
    }
    getListReply({
      bbsId: bbs?.id,
      lastId: lastID,
    })
      .unwrap()
      .then(res => {
        if (res?.length === 0 && listReply?.length === 0) {
          showMessage({
            message: strings.valet_qna_bbs_detail?.empty_reply_list,
          });
          return;
        }
        if (res?.length && res?.length % 10 === 0) {
          setCanLoadMore(true);
        } else {
          setCanLoadMore(false);
        }
        setListReply(oldValue => [...oldValue, ...res]);
      });
  };

  useEffect(() => {
    handleGetListReply();
  }, [lastID]);

  const onRefresh = () => {
    if (lastID === 0) {
      handleGetListReply();
    } else {
      setLastID(0);
    }
  };

  const onPressDelete = () => {
    AlertYesNo(strings.parking_request_notice_board.delete_confirmation, handleDelete);
  };

  const handleDelete = () => {
    if (userToken?.id && userToken?.password && bbs?.id) {
      const body = {
        memberId: userToken?.id.toString(),
        memberPwd: userToken.password,
        id: bbs?.id + '',
      };
      deleteQnaBbs(body)
        .unwrap()
        .then(res => {
          if (res === '200') {
            DeviceEventEmitter.emit(EMIT_EVENT.CHANGE_QNA_BBS_REPLY_LIST);
            navigation.goBack();
          }
        });
    }
  };

  const onPressDeleteReplyItem = (item: ReplyProps) => {
    Alert.alert('삭제 하시겠습니까?', '', [
      {
        text: '예',
        onPress: () => handleDeleteReplyItem(item),
      },
      {
        text: '아니오',
        style: 'cancel',
      },
    ]);
  };

  const handleDeleteReplyItem = (item: ReplyProps) => {
    deleteReplyItem({
      memberId: userToken?.id,
      memberPwd: userToken?.password,
      id: item?.id,
    })
      .unwrap()
      .then(res => {
        if (res === '200') {
          setLastID(0);
          handleGetListReply();
          DeviceEventEmitter.emit(EMIT_EVENT.CHANGE_QNA_BBS_REPLY_LIST);
        }
      });
  };

  const onCreateReply = () => {
    if (!userToken?.id || !userToken?.password) {
      navigation.navigate(ROUTE_KEY.Login);
    } else {
      if (isEmpty(replyText)) {
        showMessage({
          message: strings.monthly_parking_direct_reply_modal.please_enter_your_comment,
        });
        return;
      }
      const data = {
        bbsId: bbs?.id + '',
        memberId: userToken?.id + '',
        memberPwd: userToken?.password,
        text: replyText,
      };
      Spinner.show();
      createBbsReply(data)
        .unwrap()
        .then(res => {
          if (res === '200') {
            setReplyText('');
            setLastID(0);
            handleGetListReply();
            DeviceEventEmitter.emit(EMIT_EVENT.CHANGE_QNA_BBS_REPLY_LIST);
          }
        })
        .finally(() => {
          Spinner.hide();
        });
    }
  };

  const renderItem = useCallback(({item}: {item: ReplyProps}) => {
    return (
      <ValetQnaBbsDetailReplyItem
        item={item}
        onPressReview={() => userDetailModalRef?.current?.show(item?.memberId)}
        onPressDelete={onPressDeleteReplyItem}
      />
    );
  }, []);

  const renderFooter = useCallback(() => {
    if (canLoadMore) {
      return (
        <LoadMoreButton
          onPress={() => {
            setLastID(listReply[listReply?.length - 1]?.id);
          }}
          style={{marginBottom: PADDING_HEIGHT / 2}}
          isFetching={isFetching}
        />
      );
    }
    return null;
  }, [canLoadMore, listReply]);

  return (
    <FixedContainer>
      <CustomHeader text={strings.parking_request_notice_board_detail.list_question} />

      <KeyboardAvoidingView style={{flex: 1}}>
        <ScrollView style={{backgroundColor: `${colors.gray}50`}}>
          {/* info */}
          <ValetQnaBbsDetailProfile
            data={bbs}
            onPressShowPopupProfile={() => userDetailModalRef?.current?.show(bbs?.memberId)}
          />

          <Divider />

          {/* questions */}
          <ValetQnaBbsDetailContent
            data={bbs}
            replyCount={listReply?.length}
            onPressDelete={onPressDelete}
          />

          {/* reply question */}
          <ValetQnaBbsDetailReply
            text={replyText}
            onPress={onCreateReply}
            onChangeText={setReplyText}
          />

          <Divider />

          {/* reply question list */}
          <FlashList
            data={listReply}
            renderItem={renderItem}
            ListFooterComponent={renderFooter}
            onEndReachedThreshold={1}
            onRefresh={onRefresh}
            estimatedItemSize={200}
            refreshing={isFetching}
            scrollEnabled={false}
            contentContainerStyle={styles.listView}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* User detail modal */}
      <UserDetailModal ref={userDetailModalRef} />
    </FixedContainer>
  );
});

export default ValetQnaBbsDetail;

const styles = StyleSheet.create({
  listView: {
    paddingHorizontal: PADDING / 2,
    paddingTop: PADDING_HEIGHT,
  },
});
