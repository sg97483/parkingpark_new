import moment from 'moment';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Button from '~components/button';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {MyListValetQnaBbsProps} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

interface IProps {
  item: MyListValetQnaBbsProps;
  onPressDelete: (item: MyListValetQnaBbsProps) => void;
  onPressNoticeDetail: (item: MyListValetQnaBbsProps) => void;
}

const RequestChangeAndCancelItem = ({item, onPressDelete, onPressNoticeDetail}: IProps) => {
  return (
    <TouchableOpacity onPress={() => onPressNoticeDetail(item)}>
      <HStack style={styles.container}>
        <View style={{flex: 1}}>
          <CustomText string={item?.subject} family={FONT_FAMILY.SEMI_BOLD} />

          <HStack
            style={{
              marginTop: PADDING / 2,
              flexWrap: 'wrap',
            }}>
            <CustomText
              string={item?.memberNic}
              size={FONT.CAPTION}
              color={colors.grayText}
              textStyle={{marginRight: heightScale(12)}}
            />
            <CustomText
              string={`${moment(item?.regdate * 1000).format('MM.DD HH:mm')}`}
              color={colors.grayText}
              size={FONT.CAPTION}
            />
          </HStack>
        </View>

        <Button
          text={strings.request_change_and_cancel_list.delete_item}
          style={styles.button}
          borderColor={colors.transparent}
          color={colors.blackGray}
          onPress={() => onPressDelete(item)}
        />
      </HStack>
    </TouchableOpacity>
  );
};

export default RequestChangeAndCancelItem;

const styles = StyleSheet.create({
  container: {
    paddingVertical: PADDING,
  },
  completedText: {
    borderWidth: 1,
    borderColor: colors.red,
    paddingVertical: heightScale(2),
    paddingHorizontal: widthScale(2),
  },
  button: {
    width: widthScale(70),
    borderRadius: widthScale(5),
    minHeight: heightScale(40),
  },
});
