import {useIsFocused} from '@react-navigation/native';
import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {NativeSafeAreaViewProps, SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '~styles/colors';

const FixedContainer: React.FC<NativeSafeAreaViewProps> = ({
  children,
  style,
  edges = ['bottom', 'left', 'right', 'top'],
  ...rest
}) => {
  const isFocused = useIsFocused();

  return (
    <SafeAreaView style={[styles.safeareaview, style]} edges={edges} {...rest}>
      {isFocused ? (
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
      ) : (
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
      )}

      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeareaview: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default FixedContainer;
