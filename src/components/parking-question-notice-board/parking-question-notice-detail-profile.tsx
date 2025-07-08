import moment from 'moment';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ICONS, IMAGES} from '~/assets/images-path';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {BASE_URL, PADDING} from '~constants/constant';
import {FONT, FONT_FAMILY, GENDER} from '~constants/enum';
import {ValetQnaBbsProps} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {getBeforeTime} from '~utils/hourUtils';

interface IProps {
  data: ValetQnaBbsProps;
  onPressShowPopupProfile: () => void;
}

const ParkingQuestionNoticeDetailProfile = ({data, onPressShowPopupProfile}: IProps) => {
  const subject = data?.subject?.trim() || '';
  const memberNic = data?.memberNic || '';
  const gender = data?.gender || '';
  const regDate = data?.regdate || 0;
  const beforeTime = getBeforeTime(regDate * 1000);
  const memberPhotoId = data?.memberPhotoId || null;

  const getFacePhoto = () => {
    if (!memberPhotoId) {
      return IMAGES.profile_face;
    } else {
      return {
        uri: `${BASE_URL}photo/view?id=${memberPhotoId}&thumbnail=true`,
      };
    }
  };
  return (
    <View style={styles.container}>
      <HStack style={styles.info}>
        <TouchableOpacity onPress={onPressShowPopupProfile}>
          <Image source={getFacePhoto()} style={styles.avatar} />
        </TouchableOpacity>

        <View style={styles.marginLeft}>
          <CustomText string={subject} color={colors.blue} family={FONT_FAMILY.SEMI_BOLD} />

          <HStack style={styles.bottomContent}>
            <CustomText
              string={memberNic}
              color={gender === GENDER.MALE ? colors.littlePurple : colors.originalPink}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.CAPTION}
            />

            <CustomText
              string={`${moment(regDate * 1000).format('MM.DD HH:mm')}`}
              size={FONT.CAPTION_2}
              color={colors.darkGray}
              textStyle={{marginHorizontal: widthScale(5)}}
            />

            {beforeTime ? (
              <HStack>
                <Image source={ICONS.icon_time} style={styles.iconTime} resizeMode="contain" />
                <CustomText
                  string={beforeTime}
                  size={FONT.CAPTION_2}
                  family={FONT_FAMILY.SEMI_BOLD}
                  color={colors.blue}
                  textStyle={{marginLeft: widthScale(2)}}
                />
              </HStack>
            ) : null}
          </HStack>
        </View>
      </HStack>
    </View>
  );
};

export default ParkingQuestionNoticeDetailProfile;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: PADDING / 2,
    backgroundColor: colors.white,
    paddingBottom: PADDING,
  },
  avatar: {
    width: widthScale(80),
    height: heightScale(80),
    borderRadius: 9999,
  },
  iconTime: {
    width: widthScale(14),
    height: heightScale(14),
    tintColor: colors.darkGray,
  },
  info: {
    justifyContent: 'space-between',
  },
  marginLeft: {
    flex: 1,
    marginLeft: PADDING / 2,
  },
  marginTop: {
    marginTop: PADDING / 2,
  },
  bottomContent: {
    marginTop: PADDING / 2,
    flexWrap: 'wrap',
  },
});
