import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import CustomText from '~components/custom-text';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {PADDING} from '~constants/constant';
import {colors} from '~styles/colors';
import Divider from '~components/divider';

interface Props {
  onPress: () => void;
}

const CreatePostButton: React.FC<Props> = memo(props => {
  const {onPress} = props;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.buttonWrapper}>
        <CustomText string="글쓰기" color={colors.white} />
      </TouchableOpacity>
      <Divider />
    </View>
  );
});

export default CreatePostButton;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  buttonWrapper: {
    backgroundColor: colors.red,
    minHeight: heightScale(30),
    justifyContent: 'center',
    paddingHorizontal: PADDING,
    borderRadius: widthScale(5),
    paddingVertical: widthScale(3),
    marginVertical: PADDING / 2,
    marginRight: PADDING,
  },
});
