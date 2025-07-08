import React, {forwardRef, memo, Ref, useImperativeHandle, useRef} from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale, scale, widthScale} from '~styles/scaling-utils';

interface Props {}

const InputRegistrationNumber = forwardRef((props: Props & TextInputProps, ref: Ref<TextInput>) => {
  const {style, ...rest} = props;

  const input = useRef<TextInput>(null);

  useImperativeHandle(ref, () => input.current!, []);

  return <TextInput ref={input} style={[styles.input, style]} {...rest} />;
});

export default memo(InputRegistrationNumber);
const styles = StyleSheet.create({
  input: {
    borderBottomColor: colors.lineInput,
    borderBottomWidth: 1,
    width: widthScale(60),
    padding: 0,
    height: heightScale(25),
    textAlign: 'center',
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    fontSize: scale(14),
  },
});
