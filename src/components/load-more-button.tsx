import {ActivityIndicator, StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React, {memo} from 'react';
import CustomText from './custom-text';
import {colors} from '~styles/colors';
import {FONT_FAMILY} from '~constants/enum';
import {heightScale} from '~styles/scaling-utils';
import {strings} from '~constants/strings';

interface Props {
  onPress: () => void;
  isFetching: boolean;
  style?: StyleProp<ViewStyle>;
}

const LoadMoreButton: React.FC<Props> = memo(props => {
  const {isFetching, style, onPress} = props;
  return (
    <TouchableOpacity
      disabled={isFetching}
      onPress={onPress}
      style={[styles.showMoreButtonWrapper, style]}>
      {isFetching ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <CustomText
          string={strings?.general_text?.view_more}
          color={colors.white}
          family={FONT_FAMILY.SEMI_BOLD}
        />
      )}
    </TouchableOpacity>
  );
});

export default LoadMoreButton;

const styles = StyleSheet.create({
  showMoreButtonWrapper: {
    height: heightScale(45),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkBlue,
  },
});
