import {Image, StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {ReplyNoticeProps} from '~constants/types';
import HStack from '~components/h-stack';
import {getImageURL} from '~utils/getImageURL';
import {FONT, FONT_FAMILY, GENDER} from '~constants/enum';
import {IMAGES} from '~/assets/images-path';
import {heightScale, widthScale} from '~styles/scaling-utils';
import CustomText from '~components/custom-text';
import moment from 'moment';
import {PADDING} from '~constants/constant';
import {colors} from '~styles/colors';

interface Props {
  item: ReplyNoticeProps;
  index: number;
}

const BBSReplyNoticeItem: React.FC<Props> = memo(props => {
  const {item, index} = props;

  return (
    <HStack
      style={[
        styles.container,
        {
          backgroundColor: index % 2 === 1 ? colors.gray : colors.white,
        },
      ]}>
      <View>
        {item?.memberPhotoId ? (
          <Image
            source={{
              uri: getImageURL(item?.memberPhotoId, true),
            }}
            resizeMode="contain"
            style={styles.avatar}
          />
        ) : item?.gender === GENDER?.MALE ? (
          <Image source={IMAGES.male} resizeMode="contain" style={styles.avatar} />
        ) : (
          <Image source={IMAGES.female} resizeMode="contain" style={styles.avatar} />
        )}
      </View>
      <View style={styles.content}>
        <CustomText string={item?.memberNic} family={FONT_FAMILY.BOLD} color={colors.darkBlue} />
        <CustomText
          string={moment(item?.regdate * 1000).format('DD.DD HH:mm')}
          color={colors.darkBlue}
          size={FONT.CAPTION}
        />
        <CustomText
          string={item?.text}
          textStyle={{
            marginTop: heightScale(5),
          }}
        />
      </View>
    </HStack>
  );
});
export default BBSReplyNoticeItem;

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
    alignItems: 'flex-start',
  },
  avatar: {
    width: widthScale(52),
    height: widthScale(52),
    borderRadius: 999,
  },
  content: {
    flex: 1,
    marginLeft: widthScale(10),
  },
});
