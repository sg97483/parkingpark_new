import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1, scale} from '~styles/scaling-utils';
import {fontSize} from '~styles/typography';
import {dayjs} from '~utils/dayjsUtil';
import {getDayName} from '~utils/hourUtils';

const NoticeDetail = (props: RootStackScreenProps<'NoticeDetail'>) => {
  const {navigation, route} = props;
  const {item} = route?.params;

  return (
    <FixedContainer>
      <CustomHeader text="공지사항" />

      <PaddingHorizontalWrapper containerStyles={styles.wrapperContent} forDriveMe>
        <CustomText
          forDriveMe
          size={FONT.BODY}
          family={FONT_FAMILY.SEMI_BOLD}
          string={`[공지]${item?.subject}`}
          lineHeight={heightScale1(25)}
        />
        <CustomText
          string={`${dayjs(item?.regdate * 1000).format('YYYY.MM.DD')}(${getDayName(
            item?.regdate * 1000,
          )})`}
          size={FONT.CAPTION}
          forDriveMe
          family={FONT_FAMILY.MEDIUM}
          color={colors.grayText}
        />
      </PaddingHorizontalWrapper>

      <Divider style={styles.dividerStyle} />

      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <PaddingHorizontalWrapper forDriveMe>
          <CustomText string={item?.text} forDriveMe lineHeight={heightScale1(20)} />
        </PaddingHorizontalWrapper>
      </ScrollView>
    </FixedContainer>
  );
};

export default NoticeDetail;

const styles = StyleSheet.create({
  wrapperContent: {
    paddingTop: PADDING1,
    gap: heightScale1(10),
  },
  dividerStyle: {
    marginVertical: PADDING1,
  },
  title: {
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    fontSize: fontSize(18),
    color: colors.menuTextColor,
  },
  textDate: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: fontSize(13),
    color: colors.grayText,

    marginTop: scale(10),
  },
  textContent: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: fontSize(14),
    color: colors.menuTextColor,
  },
});
