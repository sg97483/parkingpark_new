import {Pressable, StyleSheet} from 'react-native';
import React, {memo} from 'react';
import CustomText from '~components/custom-text';
import {colors} from '~styles/colors';
import {heightScale1, scale1} from '~styles/scaling-utils';
import {FONT, FONT_FAMILY} from '~constants/enum';

interface Props {
  title: string;
  subTitle: string;
  onPress: () => void;
}

const MenuBox: React.FC<Props> = memo(props => {
  const {title, subTitle, onPress} = props;

  return (
    <Pressable style={styles.containerStyle} onPress={onPress}>
      <CustomText
        color={colors.grayText}
        forDriveMe
        size={FONT.CAPTION}
        family={FONT_FAMILY.MEDIUM}
        string={title}
        textStyle={styles.textStyle}
        numberOfLines={1}
        lineHeight={heightScale1(18)}
      />
      <CustomText
        forDriveMe
        string={subTitle}
        family={FONT_FAMILY.MEDIUM}
        textStyle={styles.textStyle}
        numberOfLines={2}
        lineHeight={heightScale1(20)}
      />
    </Pressable>
  );
});

export default MenuBox;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: colors.policy,
    minHeight: heightScale1(96),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale1(8),
    flex: 1,
    gap: heightScale1(6),
  },
  textStyle: {
    textAlign: 'center',
  },
});
