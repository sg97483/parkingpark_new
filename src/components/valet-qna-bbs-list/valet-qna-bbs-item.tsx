import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {ValetQnaBbsProps} from '~constants/types';
import {PADDING, PADDING_HEIGHT} from '~constants/constant';
import HStack from '~components/h-stack';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {ICONS} from '~/assets/images-path';
import {heightScale, widthScale} from '~styles/scaling-utils';
import moment from 'moment';

interface IProps {
  item: ValetQnaBbsProps;
  index: number;
  length: number;
  onPress: () => void;
}

const ValetQnaBbsItem = ({item, index, length, onPress}: IProps) => {
  const getCarNumber = () => {
    if (item?.memberNic && item?.carNumber) {
      return `${item?.memberNic} / ${item?.carNumber}`;
    }
    if (!item?.carNumber) {
      return `${item?.memberNic} / 없음`;
    }
    if (!item?.memberNic) {
      return `${item?.carNumber}`;
    }
    return '';
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: index % 2 === 0 ? `${colors.gray}80` : colors.white,
          borderBottomWidth: index === length - 1 ? 1 : 0,
        },
      ]}
      onPress={onPress}>
      <HStack style={{justifyContent: 'space-between'}}>
        <CustomText
          string={'Q.'}
          size={FONT.TITLE_1}
          family={FONT_FAMILY.SEMI_BOLD}
          color={`${colors.grayText}40`}
        />

        <View style={{flex: 1, marginLeft: PADDING / 2}}>
          <CustomText
            string={item?.subject}
            color={colors.blueText}
            family={FONT_FAMILY.SEMI_BOLD}
          />

          <HStack style={{marginTop: PADDING_HEIGHT / 2}}>
            <CustomText
              string={getCarNumber()}
              color={colors.blue}
              size={FONT.CAPTION}
              family={FONT_FAMILY.SEMI_BOLD}
            />

            {item?.regdate ? (
              <CustomText
                string={` | ${moment(item?.regdate * 1000).format('MM.DD HH:mm')}`}
                color={colors.grayText}
                size={FONT.CAPTION}
              />
            ) : null}
          </HStack>
        </View>

        <HStack style={{alignItems: 'flex-end'}}>
          <Image source={ICONS.icon__comment} style={styles.iconComment} resizeMode="contain" />
          <CustomText string={` ${item?.replyCount}`} size={FONT.CAPTION_4} />
        </HStack>
      </HStack>
    </TouchableOpacity>
  );
};

export default memo(ValetQnaBbsItem);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: PADDING / 2,
    paddingVertical: PADDING_HEIGHT,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    borderBottomColor: colors.gray,
  },
  iconComment: {
    width: widthScale(16),
    height: heightScale(16),
  },
});
