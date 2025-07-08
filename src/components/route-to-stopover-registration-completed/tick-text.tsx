import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import {heightScale, widthScale, widthScale1} from '~styles/scaling-utils';
import {FONT} from '~constants/enum';

interface Props {
  text: string;
}
const TickText = (props: Props) => {
  const {text} = props;

  return (
    <View style={styles.view}>
      <Icons.Check width={widthScale1(24)} height={widthScale1(24)} />
      <CustomText forDriveMe size={FONT.CAPTION_6} string={text} textStyle={styles.text} />
    </View>
  );
};

export default memo(TickText);
const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightScale(10),
  },
  text: {
    marginLeft: widthScale(4),
  },
});
