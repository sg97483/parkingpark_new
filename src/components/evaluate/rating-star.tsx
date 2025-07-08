import React, {memo} from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  style?: StyleProp<ViewStyle>;
  text: string;
  star: number;
  onPress?: (value: number) => void;
  size?: number;
  iconStyle?: StyleProp<ViewStyle>;
}

const RatingStar = (props: Props) => {
  const {style, star, text, onPress, iconStyle, size = 35} = props;

  return (
    <View style={style}>
      {text ? <CustomText textStyle={styles.text} string={text} /> : null}
      <View style={styles.viewContent}>
        {Array.from({length: 5}).map((_, i) => (
          <Pressable
            onPress={() => {
              onPress && onPress(i + 1);
            }}
            key={i.toString()}>
            <Icons.StarFill
              width={widthScale1(size)}
              height={widthScale1(size)}
              style={[styles.icon, iconStyle]}
              fill={star >= i + 1 ? undefined : colors.white}
              stroke={star >= i + 1 ? undefined : colors.disableButton}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default memo(RatingStar);

const styles = StyleSheet.create({
  viewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  icon: {
    marginHorizontal: widthScale1(2),
  },
  text: {
    textAlign: 'center',
    marginBottom: heightScale1(8),
  },
});
