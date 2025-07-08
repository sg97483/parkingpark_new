import React, {memo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import CustomText from '~components/custom-text';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  star: string;
  text: string;
  style?: StyleProp<ViewStyle>;
}

const RenderProgress = (props: Props) => {
  const {star, text, style} = props;

  return (
    <View style={[styles.view, style]}>
      <View>
        <CustomText
          forDriveMe
          textStyle={{width: widthScale1(90)}}
          string={text}
          family={FONT_FAMILY.MEDIUM}
          numberOfLines={1}
        />
      </View>

      <View style={styles.progress}>
        <View
          style={[
            styles.line,
            {
              width: `${(Number(star) / 5) * 100}%`,
            },
          ]}
        />
      </View>

      <View
        style={{
          minWidth: widthScale1(22),
          alignItems: 'flex-end',
        }}>
        <CustomText string={star} forDriveMe family={FONT_FAMILY.SEMI_BOLD} />
      </View>
    </View>
  );
};

export default memo(RenderProgress);

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: widthScale1(10),
    minHeight: heightScale1(20),
  },
  progress: {
    height: heightScale1(6.5),
    backgroundColor: colors.grayCheckBox,
    borderRadius: 100,
    flex: 1,
  },
  line: {
    backgroundColor: colors.progressBar,
    height: '100%',
    borderRadius: 100,
  },
});
