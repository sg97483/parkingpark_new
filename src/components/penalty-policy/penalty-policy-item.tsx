import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import HStack from '~components/h-stack';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';

interface Props {
  title: string;
  subTitle?: string;
  value?: string;
}

const PenaltyPolicyItem: React.FC<Props> = memo(props => {
  const {title = '', subTitle = '', value = ''} = props;

  return (
    <View style={styles.containerStyle}>
      <HStack style={styles.contentContainerStyle}>
        <View style={styles.leftContentStyle}>
          <CustomText
            string={title}
            forDriveMe
            lineHeight={heightScale1(18)}
            size={FONT.CAPTION}
            family={FONT_FAMILY.MEDIUM}
            color={colors.lineCancel}
          />
          {subTitle ? (
            <CustomText
              string={subTitle}
              forDriveMe
              lineHeight={heightScale1(18)}
              size={FONT.CAPTION}
              family={FONT_FAMILY.MEDIUM}
              color={colors.lineInput}
            />
          ) : null}
        </View>

        <View>
          <CustomText
            forDriveMe
            family={FONT_FAMILY.MEDIUM}
            string="결제 금액의"
            lineHeight={heightScale1(20)}
          />
          <CustomText
            string={value}
            forDriveMe
            family={FONT_FAMILY.SEMI_BOLD}
            lineHeight={heightScale1(20)}
          />
        </View>
      </HStack>
    </View>
  );
});
export default PenaltyPolicyItem;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: colors.white,
    paddingHorizontal: widthScale1(16),
    paddingVertical: heightScale1(14),
    borderRadius: scale1(4),
  },
  contentContainerStyle: {
    gap: widthScale1(10),
  },
  leftContentStyle: {flex: 1},
});
