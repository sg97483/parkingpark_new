import {DeviceEventEmitter, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo, useMemo, useRef} from 'react';
import {ParkingEvalProps} from '~constants/types';
import HStack from '~components/h-stack';
import {EMIT_EVENT, FONT, GENDER} from '~constants/enum';
import {ICONS, IMAGES} from '~/assets/images-path';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {PADDING} from '~constants/constant';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '~styles/colors';
import CustomText from '~components/custom-text';
import moment from 'moment';
import Divider from '~components/divider';
import {getTimeAgo} from '~utils/hourUtils';
import {useAppSelector} from '~store/storeHooks';
import {UseRootStackNavigation} from '~navigators/stack';
import {useNavigation} from '@react-navigation/native';
import {ROUTE_KEY} from '~navigators/router';
import {useLikeReviewMutation} from '~services/parkingServices';
import {showMessage} from 'react-native-flash-message';
import UserDetailModal, {UserDetailModalRefs} from './user-detail-modal';
import {strings} from '~constants/strings';
import {getImageURL} from '~utils/getImageURL';

interface Props {
  item: ParkingEvalProps;
  index: number;
}

const ParkingEvalItem: React.FC<Props> = memo(props => {
  const {item, index} = props;

  const navigation: UseRootStackNavigation = useNavigation();

  const userDetailModalRef = useRef<UserDetailModalRefs>(null);

  const [likeReview] = useLikeReviewMutation();

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const renderStar = useMemo(() => {
    if (!item?.eval) {
      return (
        <HStack>
          {Array.from({length: 5}).map((_, index) => {
            return (
              <Icon
                key={`star-icon-${index}`}
                name="star"
                size={widthScale(20)}
                color={colors.yellow}
              />
            );
          })}
        </HStack>
      );
    } else {
      if (item?.eval?.startsWith('4')) {
        return (
          <HStack>
            {Array.from({length: 5}).map((_, index) => {
              return (
                <Icon
                  key={`star-icon-${index}`}
                  name="star"
                  size={widthScale(20)}
                  color={index <= 3 ? colors.yellow : colors.darkGray}
                />
              );
            })}
          </HStack>
        );
      } else if (item?.eval?.startsWith('5')) {
        return (
          <HStack>
            {Array.from({length: 5}).map((_, index) => {
              return (
                <Icon
                  key={`star-icon-${index}`}
                  name="star"
                  size={widthScale(20)}
                  color={colors.yellow}
                />
              );
            })}
          </HStack>
        );
      } else if (item?.eval?.startsWith('3')) {
        return (
          <HStack>
            {Array.from({length: 5}).map((_, index) => {
              return (
                <Icon
                  key={`star-icon-${index}`}
                  name="star"
                  size={widthScale(20)}
                  color={index <= 2 ? colors.yellow : colors.darkGray}
                />
              );
            })}
          </HStack>
        );
      } else if (item?.eval?.startsWith('2')) {
        return (
          <HStack>
            {Array.from({length: 5}).map((_, index) => {
              return (
                <Icon
                  key={`star-icon-${index}`}
                  name="star"
                  size={widthScale(20)}
                  color={index <= 1 ? colors.yellow : colors.darkGray}
                />
              );
            })}
          </HStack>
        );
      } else if (item?.eval?.startsWith('1')) {
        return (
          <HStack>
            {Array.from({length: 5}).map((_, index) => {
              return (
                <Icon
                  key={`star-icon-${index}`}
                  name="star"
                  size={widthScale(20)}
                  color={index <= 0 ? colors.yellow : colors.darkGray}
                />
              );
            })}
          </HStack>
        );
      } else {
        return (
          <HStack>
            {Array.from({length: 5}).map((_, index) => {
              return (
                <Icon
                  key={`star-icon-${index}`}
                  name="star"
                  size={widthScale(20)}
                  color={colors.yellow}
                />
              );
            })}
          </HStack>
        );
      }
    }
  }, [item]);

  const handleLikeReview = () => {
    if (!userToken?.id || !userToken?.password) {
      showMessage({
        message: strings.general_text.login_first,
      });
      navigation.navigate(ROUTE_KEY.Login);
    } else {
      likeReview({
        id: item?.id,
        userID: userToken?.id,
      })
        .unwrap()
        .then(res => {
          if (res === '502') {
            showMessage({
              message: strings.general_text.you_already_like_it,
            });
          }
          if (res === '200') {
            DeviceEventEmitter.emit(EMIT_EVENT.ADD_REVIEW);
          }
        });
    }
  };

  return (
    <TouchableOpacity
      disabled={!item?.isReview}
      onPress={() => navigation.navigate(ROUTE_KEY.ReplyReview, {data: item})}
      style={[
        styles.container,
        {
          backgroundColor: index % 2 == 0 ? `${colors.gray}70` : colors.white,
        },
      ]}>
      <HStack style={{marginBottom: heightScale(10)}}>
        <TouchableOpacity onPress={() => userDetailModalRef?.current?.show(item?.memberId)}>
          {item?.memberPhotoId ? (
            <Image
              source={{
                uri: getImageURL(item?.memberPhotoId, false),
              }}
              style={styles.avatar}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={item?.gender === GENDER?.MALE ? IMAGES.male : IMAGES.female}
              style={styles.avatar}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>

        {item?.isReview ? (
          <TouchableOpacity onPress={handleLikeReview}>
            <Image
              source={ICONS.btn_like}
              style={[styles.avatar, {marginLeft: widthScale(5)}]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : null}
        <View style={styles.userInfoWrapper}>
          {renderStar}
          <HStack style={{marginTop: heightScale(5)}}>
            <CustomText string={item?.memberNic} color={colors.blue} size={FONT.CAPTION_2} />
            <CustomText
              string={` | ${moment(item?.regdate * 1000).format('MM.DD HH:mm')}`}
              color={colors.darkGray}
              size={FONT.CAPTION_2}
            />
          </HStack>
          {item?.isReview ? (
            <HStack style={styles.timeWrapper}>
              <Icon name="clock-outline" size={widthScale(12)} color={colors.darkBlue} />
              <CustomText
                string={getTimeAgo(item?.regdate * 1000)}
                size={FONT.CAPTION_3}
                textStyle={{marginLeft: widthScale(3)}}
                color={colors.darkBlue}
              />
            </HStack>
          ) : null}
        </View>
      </HStack>
      <Divider />
      <CustomText string={item?.text} textStyle={styles.text} />
      {item?.isReview ? (
        <HStack style={styles.likeWrapper}>
          <Icon name="heart" size={widthScale(15)} />
          <CustomText
            string={`${item?.likeCount}`}
            size={FONT.CAPTION_2}
            textStyle={{marginRight: widthScale(5)}}
          />
          <Icon name="chat-processing" size={widthScale(15)} />
          <CustomText string={`${item?.replyCount}`} size={FONT.CAPTION_2} />
        </HStack>
      ) : null}

      {/* User detail modal */}
      <UserDetailModal ref={userDetailModalRef} />
    </TouchableOpacity>
  );
});

export default ParkingEvalItem;

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
  },
  avatar: {
    width: widthScale(52),
    height: widthScale(52),
    borderRadius: 999,
  },
  userInfoWrapper: {
    marginLeft: PADDING,
    flex: 1,
  },
  text: {
    marginTop: heightScale(10),
  },
  likeWrapper: {
    justifyContent: 'flex-end',
  },
  timeWrapper: {
    justifyContent: 'flex-end',
    marginTop: PADDING / 2,
  },
});
