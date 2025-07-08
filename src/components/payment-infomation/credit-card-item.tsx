import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomButton from '~components/commons/custom-button';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {CreditCardProps} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  item: CreditCardProps;
  isDefaultCard?: boolean;
  onDefaultPress: () => void;
  onDeletePress?: () => void;
}

const CreditCardItem: React.FC<Props> = memo(props => {
  const {item, isDefaultCard, onDefaultPress, onDeletePress} = props;

  return (
    <HStack style={styles.containerStyle}>
      <View style={styles.leftContentStyle}>
        <CustomText
          numberOfLines={1}
          string={`${item?.number1}-****-****-${item?.number4}`}
          family={FONT_FAMILY.MEDIUM}
          size={FONT.CAPTION_7}
          forDriveMe
          lineHeight={heightScale1(22)}
        />
        <CustomText
          numberOfLines={1}
          string={`${item?.cardName.replace('[', '').replace(']', '')} • 신용`}
          family={FONT_FAMILY.MEDIUM}
          color={colors.grayText}
          forDriveMe
          lineHeight={heightScale1(20)}
        />
      </View>

      <HStack style={{gap: widthScale1(10)}}>
        <CustomButton
          text="대표"
          textSize={FONT.CAPTION_6}
          buttonHeight={38}
          onPress={onDefaultPress}
          outLine={item?.defaultYN === 'N'}
          buttonStyle={styles.buttonStyle}
        />

        {onDeletePress && (
          <CustomButton
            type="TERTIARY"
            text="삭제"
            textSize={FONT.CAPTION_6}
            buttonHeight={38}
            onPress={onDeletePress}
            buttonStyle={styles.buttonStyle}
          />
        )}
      </HStack>
    </HStack>
  );
});

export default CreditCardItem;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    paddingVertical: heightScale1(4),
  },
  leftContentStyle: {
    flex: 1,
    marginRight: widthScale1(10),
    gap: heightScale1(4),
  },
  buttonStyle: {
    paddingHorizontal: widthScale1(10),
    minWidth: widthScale1(45),
  },
});
