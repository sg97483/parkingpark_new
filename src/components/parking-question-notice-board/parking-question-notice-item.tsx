import moment from 'moment';
import React, {memo, useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomButton from '~components/commons/custom-button';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {ValetQnaBbsProps} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale1, widthScale, widthScale1} from '~styles/scaling-utils';
import {getDayName} from '~utils/hourUtils';

interface IProps {
  item: ValetQnaBbsProps;
  onPressShowDetail?: (item: ValetQnaBbsProps) => void;
  onPressButtonActions?: () => void;
  viewMode?: boolean;
}

const ParkingQuestionNoticeItem: React.FC<IProps> = memo(props => {
  const {item, onPressButtonActions, onPressShowDetail, viewMode} = props;

  const isReply = useMemo((): boolean => item?.replyCount > 0, [item?.replyCount]);

  const renderStatus = useMemo(() => {
    if (viewMode) {
      if (isReply) {
        return '처리완료';
      } else {
        return '처리예정';
      }
    } else {
      if (isReply) {
        return '답변완료';
      } else {
        return '답변대기';
      }
    }
  }, [isReply, viewMode]);

  return (
    <Pressable onPress={() => onPressShowDetail && onPressShowDetail(item)}>
      <HStack style={styles.container}>
        <View style={{flex: 1}}>
          <HStack style={{gap: widthScale1(4)}}>
            <CustomText
              numberOfLines={1}
              string={`${item?.subject}`}
              textStyle={{
                flexShrink: 1,
              }}
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
            />
            <Icons.Dot width={widthScale1(2)} height={widthScale1(2)} fill={colors.lineCancel} />
            <CustomText
              string={renderStatus}
              color={isReply ? colors.disableButton : colors.heavyGray}
              family={FONT_FAMILY.SEMI_BOLD}
              textStyle={{
                marginRight: widthScale(6),
              }}
              forDriveMe
            />
          </HStack>

          <CustomText
            string={`${moment(item?.regdate * 1000).format('YY.MM.DD')}(${getDayName(
              moment(item?.regdate * 1000).valueOf(),
            )}) ${moment(item?.regdate * 1000).format('HH:mm')}`}
            color={colors.grayText}
            textStyle={styles.timeTextStyle}
            forDriveMe
            family={FONT_FAMILY.MEDIUM}
            size={FONT.CAPTION}
          />
        </View>

        {viewMode ? null : (
          <CustomButton
            type="TERTIARY"
            outLine
            text="삭제"
            onPress={onPressButtonActions}
            buttonStyle={styles.deleteButtonStyle}
            textSize={FONT.CAPTION_6}
            buttonHeight={38}
            borderRadiusValue={6}
          />
        )}
      </HStack>
    </Pressable>
  );
});

export default ParkingQuestionNoticeItem;

const styles = StyleSheet.create({
  container: {
    padding: PADDING1,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  timeTextStyle: {
    marginTop: heightScale1(4),
  },
  deleteButtonStyle: {
    minWidth: widthScale1(45),
    paddingHorizontal: widthScale1(10),
  },
});
