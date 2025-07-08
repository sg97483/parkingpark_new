import moment from 'moment';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CustomButton from '~components/commons/custom-button';
import Divider from '~components/divider';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, scale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

interface ContactStatusItemProps {
  showButton?: boolean;
}
const ContactStatusItem = ({showButton}: ContactStatusItemProps) => {
  return (
    <View>
      <HStack style={styles.wrapHStack}>
        <View>
          <Text style={styles.title}>기타 • 처리예정</Text>
          <Text style={styles.subtitle}>{moment().format('YY.MM.DD(ddd) HH:mm')}</Text>
        </View>
        {!!showButton && (
          <CustomButton onPress={() => {}} text="삭제" type="TERTIARY" outLine buttonHeight={38} />
        )}
      </HStack>

      <Divider />
    </View>
  );
};

export default React.memo(ContactStatusItem);

const styles = StyleSheet.create({
  wrapHStack: {
    paddingHorizontal: PADDING1,
    paddingVertical: heightScale1(24),
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: fontSize1(14),
    color: colors.titleNotice,
  },
  subtitle: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: fontSize1(13),
    color: colors.grayText,
    marginTop: scale1(4),
  },
  textButton: {
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    fontSize: fontSize1(14),
    color: colors.lineCancel,
  },
  button: {
    paddingVertical: scale1(9),
    paddingHorizontal: scale1(10),
    borderWidth: 1,
    borderColor: colors.disableButton,
    borderRadius: scale1(6),
  },
});
