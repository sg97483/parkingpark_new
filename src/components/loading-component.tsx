import React, {memo} from 'react';
import {ActivityIndicator, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {HEIGHT, WIDTH} from '~constants/constant';
import {colors} from '~styles/colors';

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
}

const LoadingComponent: React.FC<Props> = memo(props => {
  const {containerStyle} = props;

  return (
    <View style={[styles.container, containerStyle]}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
});

export default LoadingComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: WIDTH,
    height: HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});
