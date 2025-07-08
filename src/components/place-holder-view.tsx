import {ActivityIndicator, StyleSheet, View} from 'react-native';
import React from 'react';
import {colors} from '~styles/colors';

const PlaceHolderView = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.red} />
    </View>
  );
};

export default PlaceHolderView;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: colors.white,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
