import {
  Alert,
  DeviceEventEmitter,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import HStack from '~components/h-stack';
import {EMIT_EVENT, FONT, FONT_FAMILY, GENDER, IS_ACTIVE} from '~constants/enum';
import {ICONS, IMAGES} from '~/assets/images-path';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {PADDING} from '~constants/constant';
import CustomText from '~components/custom-text';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getTimeAgo} from '~utils/hourUtils';
import {colors} from '~styles/colors';
import Divider from '~components/divider';
import {
  useCreateParkingReplyMutation,
  useDeleteParkingReviewMutation,
  useLazyListParkingReplyQuery,
  useLikeReviewMutation,
} from '~services/parkingServices';
import {useAppSelector} from '~store/storeHooks';
import {showMessage} from 'react-native-flash-message';
import {ROUTE_KEY} from '~navigators/router';
import UserDetailModal, {UserDetailModalRefs} from '~components/parking-details/user-detail-modal';
import {ReplyProps} from '~constants/types';
import Spinner from '~components/spinner';
import ReplyItem from '~components/reply-review/reply-item';
import LoadMoreButton from '~components/load-more-button';
import {getImageURL} from '~utils/getImageURL';

const ReplyReview = memo((props: RootStackScreenProps<'ReplyReview'>) => {
  const {navigation, route} = props;
  const data = route?.params?.data;
  console.log('🚀 ~ file: reply-review.tsx:53 ~ ReplyReview ~ data:', data);
  const userDetailModalRef = useRef<UserDetailModalRefs>(null);

  const [deleteParkingReview] = useDeleteParkingReviewMutation();
  const [createReply] = useCreateParkingReplyMutation();
  const [likeReview] = useLikeReviewMutation();

  const [lastID, setLastID] = useState<number>(0);
  const [listReply, setListReply] = useState<ReplyProps[]>([]);
  const [getListReply, {isFetching}] = useLazyListParkingReplyQuery();

  const handleGetListReply = () => {
    if (lastID === 0) {
      setListReply([]);
    }
    getListReply({
      bbsId: data?.id,
      lastId: lastID,
    })
      .unwrap()
      .then(res => {
        setListReply(oldValue => [...oldValue, ...res]);
      });
  };

  useEffect(() => {
    handleGetListReply();
  }, [lastID]);

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const [numberOfLike, setNumberOfLike] = useState<number>(data?.likeCount ? data?.likeCount : 0);
  const [numberOfComment, setNumberOfComment] = useState<number>(
    data?.replyCount ? data?.replyCount : 0,
  );
  const [replyContent, setReplyContent] = useState<string>('');

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
          deleteParkingReview({
            id: data?.id,
            memberId: userToken?.id,
            memberPwd: userToken?.password,
          })
            .unwrap()
            .then(res => {
              Spinner.hide();
              if (res === '200') {
                DeviceEventEmitter.emit(EMIT_EVENT.ADD_REVIEW);
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

  const handleLike = () => {
    if (!userToken?.id || !userToken?.password) {
      showMessage({
        message: '로그인이 필요합니다.',
      });
      navigation.navigate(ROUTE_KEY.Login);
      return;
    }
    Spinner.show();
    likeReview({
      id: data?.id,
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
          DeviceEventEmitter.emit(EMIT_EVENT.ADD_REVIEW);
          setNumberOfLike(oldValue => oldValue + 1);
        }
      })
      .finally(() => {
        Spinner.hide();
      });
  };

  const handleAddReply = () => {
    if (!userToken?.id || !userToken?.password) {
      showMessage({
        message: '로그인이 필요합니다.',
      });
      navigation.navigate(ROUTE_KEY.Login);
      return;
    }

    if (!replyContent) {
      showMessage({
        message: '댓글을 입력해 주세요.',
      });
      return;
    }

    Spinner.show();
    createReply({
      bbsId: data?.id,
      memberId: userToken?.id,
      memberPwd: userToken?.password,
      text: replyContent,
    })
      .unwrap()
      .then(res => {
        if (res === '200') {
          setNumberOfComment(oldValue => oldValue + 1);
          DeviceEventEmitter.emit(EMIT_EVENT.ADD_REVIEW);
          setReplyContent('');
          if (lastID === 0) {
            handleGetListReply();
          } else {
            setLastID(0);
          }
        }
      })
      .catch(error => {
        Alert.alert(error);
      })
      .finally(() => {
        Spinner.hide();
      });
  };

  const renderReplyItem = useCallback(({item, index}: {item: ReplyProps; index: number}) => {
    return <ReplyItem item={item} index={index} />;
  }, []);

  const listFooter = useCallback(() => {
    return (
      <>
        {listReply?.length > 0 && listReply?.length % 10 === 0 ? (
          <LoadMoreButton
            isFetching={isFetching}
            onPress={() => {
              setLastID(listReply[listReply?.length - 1].id || 0);
            }}
          />
        ) : null}
      </>
    );
  }, [listReply, isFetching]);

  return (
    <FixedContainer>
      <CustomHeader text="이용후기" />
      <ScrollView nestedScrollEnabled={true} style={styles.container}>
        <HStack style={styles.headerWrapper}>
          <TouchableOpacity onPress={() => userDetailModalRef?.current?.show(data?.memberId)}>
            {data?.memberPhotoId ? (
              <Image
                source={{
                  uri: getImageURL(data?.memberPhotoId, true),
                }}
                style={styles.avatar}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={data?.gender === GENDER?.MALE ? IMAGES.male : IMAGES.female}
                style={styles.avatar}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLike}>
            <Image
              source={ICONS.btn_like}
              style={[styles.avatar, {marginLeft: widthScale(5)}]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={styles.rightContent}>
            <TouchableOpacity
              disabled={!data?.parkingLotName || !data?.parkingLotAddr}
              onPress={() =>
                navigation.navigate(ROUTE_KEY.ParkingDetails, {
                  id: data?.parkingLotId,
                })
              }>
              <CustomText
                string={data?.parkingLotName || data?.subject}
                family={FONT_FAMILY.SEMI_BOLD}
                color={colors.darkBlue}
              />
              <CustomText
                string={data?.parkingLotAddr || `${data?.state} ${data?.city}`}
                size={FONT.CAPTION}
                family={FONT_FAMILY.SEMI_BOLD}
                color={colors.darkBlue}
              />
            </TouchableOpacity>

            <HStack style={{marginTop: heightScale(5)}}>
              <CustomText
                string={data?.memberNic}
                size={FONT.CAPTION_2}
                color={data?.gender === GENDER.FEMALE ? colors.pink : colors.darkBlue}
                family={FONT_FAMILY.SEMI_BOLD}
              />
              <CustomText
                string={` | ${moment(data?.regdate * 1000).format('MM.DD HH:mm')} `}
                size={FONT.CAPTION_2}
                color={colors.darkGray}
                family={FONT_FAMILY.SEMI_BOLD}
              />
              {getTimeAgo(data?.regdate * 1000) ? (
                <HStack>
                  <Icon name="clock-outline" color={colors.darkGray} size={widthScale(13)} />
                  <CustomText
                    string={` ${getTimeAgo(data?.regdate * 1000)}`}
                    size={FONT.CAPTION_2}
                    color={colors.darkBlue}
                    family={FONT_FAMILY.SEMI_BOLD}
                  />
                </HStack>
              ) : null}
            </HStack>
          </View>
        </HStack>

        <Divider />

        <View style={styles.reviewContentWrapper}>
          {data?.photoId ? (
            <Image
              source={{
                uri: getImageURL(data?.photoId, false),
              }}
              style={styles.image}
            />
          ) : null}
          <CustomText string={data?.text} />

          <HStack style={styles.likeWrapper}>
            <Icon name="heart" size={widthScale(15)} />
            <CustomText
              string={`${numberOfLike}`}
              size={FONT.CAPTION_2}
              textStyle={{marginRight: widthScale(5)}}
            />
            <Icon name="chat-processing" size={widthScale(15)} />
            <CustomText string={`${numberOfComment}`} size={FONT.CAPTION_2} />
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
          {userToken?.adminYN === IS_ACTIVE.YES || userToken?.id === data?.memberId ? (
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

        {/* Reply input */}
        <View style={styles.replyWrapper}>
          <TextInput
            placeholder="댓글쓰기"
            multiline
            style={styles.input}
            value={replyContent}
            onChangeText={setReplyContent}
            placeholderTextColor={colors.grayText}
          />
          <TouchableOpacity onPress={handleAddReply} style={styles.createReplyButtonWrapper}>
            <CustomText string="전송" />
          </TouchableOpacity>
        </View>
        <Divider />

        <FlatList
          data={listReply}
          keyExtractor={item => `${item?.id}`}
          renderItem={renderReplyItem}
          scrollEnabled={false}
          ListFooterComponent={listFooter}
        />
      </ScrollView>

      {/* User detail modal */}
      <UserDetailModal ref={userDetailModalRef} />
    </FixedContainer>
  );
});

export default ReplyReview;

const styles = StyleSheet.create({
  container: {
    backgroundColor: `${colors.gray}70`,
  },
  avatar: {
    width: widthScale(52),
    height: widthScale(52),
    borderRadius: 999,
  },
  headerWrapper: {
    paddingBottom: PADDING,
    paddingHorizontal: PADDING,
    paddingTop: PADDING / 2,
    backgroundColor: colors.white,
  },
  rightContent: {
    flex: 1,
    marginLeft: PADDING / 3,
  },
  reviewContentWrapper: {
    padding: PADDING,
    backgroundColor: colors.white,
  },
  likeWrapper: {
    justifyContent: 'flex-end',
    marginTop: PADDING,
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
  replyWrapper: {
    padding: PADDING / 2,
  },
  input: {
    backgroundColor: colors.white,
    padding: PADDING / 2,
    minHeight: heightScale(100),
    textAlignVertical: 'top',
    fontFamily: FONT_FAMILY.REGULAR,
  },
  createReplyButtonWrapper: {
    backgroundColor: colors.white,
    width: widthScale(55),
    height: heightScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: widthScale(5),
    borderWidth: 1,
    borderColor: colors.darkGray,
    marginTop: PADDING / 2,
    alignSelf: 'flex-end',
  },
  showMoreButtonWrapper: {
    height: heightScale(45),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkBlue,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: PADDING,
  },
});
