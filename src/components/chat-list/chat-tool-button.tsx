import {Pressable, StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import CustomText from '~components/custom-text';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';

interface Props {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
}

const ChatToolButton: React.FC<Props> = memo(props => {
  const {icon, onPress, title} = props;

  return (
    <Pressable onPress={onPress} style={styles.containerStyle}>
      <View style={styles.iconWrapperStyle}>{icon}</View>
      <CustomText
        forDriveMe
        family={FONT_FAMILY.MEDIUM}
        string={title}
        lineHeight={heightScale1(20)}
      />
    </Pressable>
  );
});

export default ChatToolButton;

const styles = StyleSheet.create({
  containerStyle: {
    width: widthScale1(73),
    height: heightScale1(68),
    justifyContent: 'center',
    alignItems: 'center',
    gap: heightScale1(4),
  },
  iconWrapperStyle: {
    borderRadius: 999,
    width: widthScale1(44),
    height: widthScale1(44),
    backgroundColor: colors.policy,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
