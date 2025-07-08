import React, {memo} from 'react';
import {KeyboardAvoidingView, StyleSheet} from 'react-native';
import {IS_IOS} from '~constants/constant';

const KeyBoardInputView = ({children, behavior, style}: any) => {
  return (
    <KeyboardAvoidingView
      style={[styles.view, style]}
      behavior={IS_IOS ? behavior || 'padding' : undefined}>
      {children}
    </KeyboardAvoidingView>
  );
};

export default memo(KeyBoardInputView);
const styles = StyleSheet.create({view: {flex: 1}});
