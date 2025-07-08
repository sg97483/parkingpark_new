import {
  Alert,
  DeviceEventEmitter,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useCallback, useEffect, useState} from 'react';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {RootStackScreenProps} from '~navigators/stack';
import HStack from '~components/h-stack';
import {ICONS} from '~/assets/images-path';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {PADDING} from '~constants/constant';
import CustomText from '~components/custom-text';
import {EMIT_EVENT, FONT, FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import moment from 'moment';
import {colors} from '~styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Divider from '~components/divider';
import {useAppSelector} from '~store/storeHooks';
import {showMessage} from 'react-native-flash-message';
import {ROUTE_KEY} from '~navigators/router';
import Spinner from '~components/spinner';
import {useDeleteBBSNoticeMutation, useGetListReplyNoticeQuery} from '~services/noticeServices';
import {FlashList} from '@shopify/flash-list';
import {ReplyNoticeProps} from '~constants/types';
import BBSReplyNoticeItem from '~components/parking-info-sharing/bbs-reply-notice-item';
import LoadMoreButton from '~components/load-more-button';
import BBSNoticeReplyInput from '~components/parking-info-sharing/bbs-notice-reply-input';
import {getImageURL} from '~utils/getImageURL';

const BBSNoticeDetail = memo((props: RootStackScreenProps<'BBSNoticeDetail'>) => {
  const {navigation, route} = props;

  const item = route?.params?.item;

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const [lastID, setLastID] = useState<number>(0);
  const [listReply, setListReply] = useState<ReplyNoticeProps[]>([]);
  const [canLoadMore, setCanLoadMore] = useState<boolean>(false);
  const [numComments, setNumComments] = useState<number>(item?.replyCount ? item?.replyCount : 0);

  const [deleteBBSNotice] = useDeleteBBSNoticeMutation();

  const {
    data: replyData,
    isFetching,
    refetch: refetchReplyList,
  } = useGetListReplyNoticeQuery({
    lastId: lastID,
    noticeId: item?.id,
  });

  useEffect(() => {
    if (replyData) {
      if (replyData?.length >= 10) {
        const temp = [...listReply];
        setListReply([...temp, ...(replyData as any)]);
        setCanLoadMore(true);
      } else {
        const temp = [...listReply];
        setListReply([...temp, ...(replyData as any)]);
        setCanLoadMore(false);
      }
    }
  }, [replyData]);

  const handleDeleteReview = () => {
    if (!userToken?.id || !userToken?.password) {
      showMessage({
        message: '로그인이 필요합니다.',
      });
      navigation.navigate(ROUTE_KEY.Login);
      return;
    }

    Alert.alert('삭제 하시겠습니까?', '', [
      {
        text: '예',
        onPress: () => {
          Spinner.show();
          deleteBBSNotice({
            id: item?.id,
            memberId: userToken?.id,
            memberPwd: userToken?.password,
          })
            .unwrap()
            .then(res => {
              if (res === '200') {
                DeviceEventEmitter.emit(EMIT_EVENT.BBS_NOTICE);
                navigation.goBack();
              }
            })
            .catch(error => {
              Alert.alert(error);
            })
            .finally(() => {
              Spinner.hide();
            });
        },
      },
      {
        text: '아니오',
        style: 'cancel',
      },
    ]);
  };

  const renderReplyItem = useCallback(({item, index}: {item: ReplyNoticeProps; index: number}) => {
    return <BBSReplyNoticeItem item={item} index={index} />;
  }, []);

  const handleLoadMore = () => {
    setLastID(listReply[listReply?.length - 1]?.noticeId);
  };

  const renderReplyFooter = () => {
    if (canLoadMore) {
      return <LoadMoreButton isFetching={isFetching} onPress={handleLoadMore} />;
    }
    return <View />;
  };

  return (
    <FixedContainer>
      <CustomHeader text="공지사항" />
      <ScrollView>
        <HStack style={styles.titleWrapper}>
          <Image source={ICONS.icon_notice} style={styles.noticeIcon} resizeMode="contain" />
          <View style={styles.rightContentWrapper}>
            <CustomText string={item?.subject || ''} family={FONT_FAMILY.BOLD} color={'#D75E0E'} />
            <CustomText
              string={moment(item?.regdate * 1000).format('MM.DD HH:mm')}
              size={FONT.CAPTION_2}
              color={colors.darkGray}
              textStyle={{
                marginTop: PADDING / 3,
              }}
            />
          </View>
        </HStack>
        <Divider />
        {item?.photoId && (
          <Image style={styles.image} source={{uri: getImageURL(item?.photoId!, false)}} />
        )}
        <View style={styles.contentWrapper}>
          <CustomText string={item?.text} color={'#8C5A43'} />
          <HStack
            style={{
              alignSelf: 'flex-end',
              marginTop: PADDING / 2,
            }}>
            <Icon name="chat-processing" size={widthScale(15)} color={'#E58603'} />
            <CustomText string={` ${numComments}`} size={FONT.CAPTION_2} color={'#E58603'} />
          </HStack>
        </View>
        <Divider />
        <HStack style={styles.buttonsWrapper}>
          {/* View list */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
            <HStack>
              <Icon name="menu" size={widthScale(15)} color={colors.white} />
              <CustomText string=" 목록" color={colors.white} />
            </HStack>
          </TouchableOpacity>
          {/* Delete review */}
          {userToken?.adminYN === IS_ACTIVE.YES ? (
            <TouchableOpacity
              onPress={handleDeleteReview}
              style={[
                styles.button,
                {
                  backgroundColor: colors.blue,
                },
              ]}>
              <HStack>
                <Icon name="close" size={widthScale(15)} color={colors.white} />
                <CustomText string=" 삭제" color={colors.white} />
              </HStack>
            </TouchableOpacity>
          ) : null}
        </HStack>
        <BBSNoticeReplyInput
          BBSID={item?.id}
          onReplySuccess={() => {
            DeviceEventEmitter.emit(EMIT_EVENT.BBS_NOTICE);
            setNumComments(oldValue => oldValue + 1);
            setListReply([]);
            if (lastID === 0) {
              refetchReplyList();
            } else {
              setLastID(0);
            }
          }}
        />
        <FlashList
          data={listReply}
          estimatedItemSize={200}
          renderItem={renderReplyItem}
          ListFooterComponent={renderReplyFooter}
          scrollEnabled={false}
        />
      </ScrollView>
    </FixedContainer>
  );
});
export default BBSNoticeDetail;

const styles = StyleSheet.create({
  noticeIcon: {
    width: widthScale(40),
    aspectRatio: 1,
  },
  titleWrapper: {
    padding: PADDING,
  },
  rightContentWrapper: {
    flex: 1,
    marginLeft: widthScale(15),
  },
  contentWrapper: {
    padding: PADDING,
  },
  buttonsWrapper: {
    padding: PADDING,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  button: {
    backgroundColor: colors.darkGray,
    height: heightScale(30),
    justifyContent: 'center',
    paddingHorizontal: PADDING / 2,
    borderRadius: widthScale(5),
  },
  image: {
    width: '100%',
    alignSelf: 'center',
    aspectRatio: 1,
  },
});
