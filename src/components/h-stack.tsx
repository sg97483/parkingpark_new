import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

interface Props {}

const HStack: React.FC<React.ComponentProps<typeof View> & Props> = memo(props => {
  const {style, children, ...rest} = props;
  return (
    <View
      {...rest}
      style={StyleSheet.flatten([{flexDirection: 'row', alignItems: 'center'}, style])}>
      {children}
    </View>
  );
});

export default HStack;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
