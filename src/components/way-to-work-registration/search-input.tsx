import React, {memo} from 'react';
import {StyleSheet, TouchableHighlight, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import {PADDING1, WIDTH} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  onPress: () => void;
}

const SearchInput = (props: Props) => {
  const {onPress} = props;

  return (
    <TouchableHighlight
      underlayColor={colors.transparent}
      style={styles.container}
      onPress={onPress}>
      <View style={styles.view}>
        <Icons.MagnifyingGlass />
        <CustomText
          color={colors.lineCancel}
          family={FONT_FAMILY.MEDIUM}
          forDriveMe
          textStyle={styles.input}
          string="어디로 갈까요?"
        />
      </View>
    </TouchableHighlight>
  );
};

export default memo(SearchInput);
const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    backgroundColor: colors.policy,
    height: heightScale1(48),
    width: WIDTH - widthScale1(40),
    alignItems: 'center',
    paddingHorizontal: widthScale1(16),
    borderRadius: 8,
  },
  input: {
    padding: 0,
    marginLeft: widthScale1(10),
  },
  container: {
    alignSelf: 'center',
    marginTop: PADDING1,
  },
});
