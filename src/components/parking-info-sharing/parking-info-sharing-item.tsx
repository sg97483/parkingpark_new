import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo, useRef} from 'react';
import {ParkingEvalProps} from '~constants/types';
import {BASE_URL, PADDING} from '~constants/constant';
import {colors} from '~styles/colors';
import HStack from '~components/h-stack';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {FONT, FONT_FAMILY, GENDER} from '~constants/enum';
import {ICONS, IMAGES} from '~/assets/images-path';
import CustomText from '~components/custom-text';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getTimeAgo} from '~utils/hourUtils';
import Divider from '~components/divider';
import {width} from '~constants/constant';
import UserDetailModal, {UserDetailModalRefs} from '~components/parking-details/user-detail-modal';
import {UseRootStackNavigation} from '~navigators/stack';
import {useNavigation} from '@react-navigation/native';
import {ROUTE_KEY} from '~navigators/router';

interface Props {
  item: ParkingEvalProps;
  index: number;
  onLike: () => void;
  isReview?: boolean;
}

const ParkingInfoSharingItem: React.FC<Props> = memo(props => {
  const {index, item, onLike, isReview} = props;
  const navigation: UseRootStackNavigation = useNavigation();

  const userDetailModalRef = useRef<UserDetailModalRefs>(null);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: index % 2 === 0 ? `${colors.gray}50` : colors.white,
        },
      ]}
      onPress={() => navigation.navigate(ROUTE_KEY.ReplyReview, {data: item})}>
      <HStack style={{marginBottom: heightScale(10)}}>
        <TouchableOpacity onPress={() => userDetailModalRef?.current?.show(item?.memberId)}>
          {item?.memberPhotoId ? (
            <Image
              source={{
                uri: `${BASE_URL}photo/view?id=${item?.memberPhotoId}&thumbnail=true`,
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

        <TouchableOpacity onPress={onLike}>
          <Image
            source={ICONS.btn_like}
            style={[styles.avatar, {marginLeft: widthScale(5)}]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.userInfoWrapper}>
          <CustomText
            string={isReview ? item?.parkingLotName : item?.subject}
            color={colors.darkBlue}
            size={FONT.CAPTION}
            family={FONT_FAMILY.SEMI_BOLD}
          />
          <CustomText
            string={isReview ? item?.parkingLotAddr : `${item?.state || ''} ${item?.city || ''}`}
            color={colors.darkBlue}
            size={FONT.CAPTION_2}
            family={FONT_FAMILY.SEMI_BOLD}
          />
          <HStack style={{marginTop: heightScale(5)}}>
            <CustomText
              string={item?.memberNic}
              color={item?.gender === GENDER.FEMALE ? colors.pink : colors.blue}
              size={FONT.CAPTION_2}
            />
            <CustomText
              string={` | ${moment(item?.regdate * 1000).format('MM.DD HH:mm')}`}
              color={colors.darkGray}
              size={FONT.CAPTION_2}
            />
            {getTimeAgo(item?.regdate * 1000) ? (
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
          </HStack>
        </View>
      </HStack>

      <Divider />

      <View style={styles.content}>
        {item?.photoId ? (
          <Image
            source={{
              uri: `${BASE_URL}photo/view?id=${item?.photoId}&thumbnail=true`,
            }}
            style={styles.image}
          />
        ) : null}

        <CustomText string={item?.text || ''} />

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
      </View>

      {/* User detail modal */}
      <UserDetailModal ref={userDetailModalRef} />
    </TouchableOpacity>
  );
});

export default ParkingInfoSharingItem;

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
    marginTop: PADDING,
  },
  timeWrapper: {
    marginLeft: widthScale(5),
  },
  content: {
    marginTop: PADDING,
  },
  image: {
    width: width - PADDING * 2,
    aspectRatio: 1,
    marginBottom: PADDING,
  },
});
