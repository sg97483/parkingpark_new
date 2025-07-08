import {Image, StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {ReplyProps} from '~constants/types';
import HStack from '~components/h-stack';
import {FONT, FONT_FAMILY, GENDER} from '~constants/enum';
import {IMAGES} from '~/assets/images-path';
import {widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import moment from 'moment';
import CustomText from '~components/custom-text';
import {getTimeAgo} from '~utils/hourUtils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {PADDING} from '~constants/constant';

interface Props {
  item: ReplyProps;
  index: number;
}

const ReplyItem: React.FC<Props> = memo(props => {
  const {index, item} = props;

  return (
    <View
      style={[
        styles.replyItemWrapper,
        {
          backgroundColor: index % 2 === 0 ? colors.gray : colors.white,
        },
      ]}>
      <HStack>
        <Image
          source={item?.gender === GENDER?.MALE ? IMAGES.male : IMAGES.female}
          style={styles.avatar}
          resizeMode="contain"
        />
        <View style={{marginLeft: widthScale(10)}}>
          <CustomText
            string={item?.memberNic}
            color={colors.darkBlue}
            family={FONT_FAMILY.SEMI_BOLD}
          />
          <HStack>
            <CustomText
              string={`${moment(item?.regdate * 1000).format('MM.DD HH:mm')} `}
              size={FONT.CAPTION_2}
              color={colors.darkBlue}
            />
            {getTimeAgo(item?.regdate * 1000) ? (
              <HStack>
                <Icon name="clock-outline" size={widthScale(14)} color={colors.darkBlue} />
                <CustomText
                  string={` ${getTimeAgo(item?.regdate * 1000)}`}
                  size={FONT.CAPTION_2}
                  color={colors.darkBlue}
                />
              </HStack>
            ) : null}
          </HStack>
        </View>
      </HStack>
      <View style={styles.replyContentWrapper}>
        <CustomText string={item?.text} />
      </View>
    </View>
  );
});

export default ReplyItem;

const styles = StyleSheet.create({
  replyItemWrapper: {
    padding: PADDING,
  },
  replyContentWrapper: {
    marginTop: PADDING / 2,
    marginLeft: widthScale(55),
  },
  avatar: {
    width: widthScale(52),
    height: widthScale(52),
    borderRadius: 999,
  },
});
