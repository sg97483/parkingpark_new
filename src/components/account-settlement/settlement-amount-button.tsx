import {Pressable, StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import HStack from '~components/h-stack';
import CustomText from '~components/custom-text';
import {getNumberWithCommas} from '~utils/numberUtils';
import {heightScale1, scale, widthScale1} from '~styles/scaling-utils';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {Icons} from '~/assets/svgs';

interface Props {
  title: string;
  amount: number;
  onPress?: () => void;
}

const SettlementAmountButton = memo((props: Props) => {
  const {amount = 0, onPress, title = ''} = props;

  return (
    <View style={styles.containerStyle}>
      <CustomText
        string={title}
        forDriveMe
        family={FONT_FAMILY.SEMI_BOLD}
        size={FONT.CAPTION_7}
        color={colors.heavyGray}
      />

      <Pressable style={styles.buttonStyle} onPress={onPress}>
        <HStack style={{gap: widthScale1(10)}}>
          <HStack style={{gap: widthScale1(4), flex: 1}}>
            <CustomText
              string={`${getNumberWithCommas(amount)}`}
              numberOfLines={1}
              textStyle={{flexShrink: 1}}
              forDriveMe
              size={FONT.BODY}
              family={FONT_FAMILY.SEMI_BOLD}
            />

            <CustomText string="원" forDriveMe family={FONT_FAMILY.MEDIUM} />
          </HStack>

          <Icons.ChevronRight
            width={widthScale1(16)}
            height={widthScale1(16)}
            stroke={colors.grayText}
          />
        </HStack>
      </Pressable>
    </View>
  );
});

export default SettlementAmountButton;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    gap: heightScale1(10),
  },
  buttonStyle: {
    borderWidth: 1,
    minHeight: heightScale1(54),
    justifyContent: 'center',
    borderRadius: scale(4),
    paddingHorizontal: widthScale1(16),
    paddingVertical: heightScale1(14),
    borderColor: colors.grayCheckBox,
  },
});
