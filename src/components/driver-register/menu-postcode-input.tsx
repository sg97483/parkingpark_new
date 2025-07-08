import React, {memo, useEffect, useRef, useState} from 'react';
import {Pressable, StyleProp, StyleSheet, Text, TextInput, View, ViewStyle} from 'react-native';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import MaskInput from 'react-native-mask-input';
import {Icons} from '~/assets/svgs';

interface Props {
  title: string;
  containerStyle?: StyleProp<ViewStyle>;
  value: string;
  onChange: (value: string) => void;
  isAutoFocused: boolean;

  onPressKeyDone: () => void;
}

const MenuPostcodeInput: React.FC<Props> = memo(props => {
  const {title, containerStyle, value, onChange, isAutoFocused, onPressKeyDone} = props;

  const [input1, setInput1] = useState<string>(value?.slice(0, 6) || '');
  const [input2, setInput2] = useState<string>(value?.slice(6, 14) || '');
  const inputRef1 = useRef<TextInput>(null);
  const inputRef2 = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    onChange(input1 + input2);
  }, [value, input1, input2]);

  useEffect(() => {
    if (isAutoFocused) {
      handleOnPressSecret();
    }
  }, [isAutoFocused]);

  // On press secret input
  const handleOnPressSecret = () => {
    setIsFocused(true);
    if (!value) {
      inputRef1.current?.focus();
    } else if (value.length >= 6) {
      inputRef2.current?.focus();
    } else if (value?.length < 6) {
      inputRef1.current?.focus();
    }
  };

  const onClearText = () => {
    setInput1('');
    setInput2('');
    inputRef1.current?.focus();
  };

  return (
    <View style={containerStyle}>
      <CustomText
        string={title}
        family={FONT_FAMILY.MEDIUM}
        size={FONT.CAPTION_6}
        color={colors.black}
        textStyle={{marginBottom: heightScale1(10)}}
        lineHeight={fontSize1(20)}
      />
      <Pressable
        onPress={handleOnPressSecret}
        style={[styles.secretCodeInput, isFocused ? {borderColor: colors.menuTextColor} : {}]}>
        <HStack
          pointerEvents="none"
          style={{
            justifyContent: 'space-between',
          }}>
          <HStack style={{justifyContent: 'space-between', width: '50%'}}>
            <TextInput
              ref={inputRef1}
              pointerEvents="none"
              maxLength={6}
              placeholder={value?.length > 0 ? '' : '000000'}
              placeholderTextColor={colors.disableButton}
              style={{width: '50%', fontSize: widthScale1(14)}}
              value={input1}
              keyboardType="number-pad"
              onChangeText={val => {
                setInput1(val);
                if (val?.length === 6) {
                  inputRef2.current?.focus();
                }
              }}
              onBlur={() => setIsFocused(false)}
              onFocus={() => setIsFocused(true)}
              onSubmitEditing={() => {
                onPressKeyDone();
              }}
            />
            <Text
              style={[
                value?.length >= 6
                  ? styles.activeDash
                  : value?.length > 0
                    ? {color: colors.white}
                    : styles.dash,
                {
                  paddingBottom: heightScale1(3),
                },
              ]}>
              -
            </Text>
          </HStack>
          <MaskInput
            ref={inputRef2}
            placeholder={value?.length > 0 ? '' : '0*******'}
            placeholderTextColor={colors.disableButton}
            style={{width: '45%', paddingLeft: widthScale1(10), fontSize: widthScale1(14)}}
            value={input2}
            pointerEvents="none"
            keyboardType="number-pad"
            maxLength={8}
            onKeyPress={({nativeEvent}) => {
              if (nativeEvent.key === 'Backspace' && input2?.length === 0) {
                inputRef1.current?.focus();
                setInput1(input1.slice(0, 5));
              }
            }}
            onChangeText={(masked, unmasked, obfuscatedText) => {
              setInput2(unmasked);
            }}
            obfuscationCharacter="*"
            showObfuscatedValue
            mask={[/\d/, [/\d/], [/\d/], [/\d/], [/\d/], [/\d/], [/\d/], [/\d/]]}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            onSubmitEditing={() => {
              onPressKeyDone();
            }}
          />
        </HStack>
        {isFocused && value?.length > 0 ? (
          <Pressable onPress={onClearText} hitSlop={16} style={{paddingRight: widthScale1(0)}}>
            <Icons.CancelCircle />
          </Pressable>
        ) : null}
      </Pressable>
    </View>
  );
});

export default MenuPostcodeInput;

const styles = StyleSheet.create({
  textInput: {
    width: '100%',

    paddingHorizontal: widthScale1(16),
    paddingTop: heightScale1(15),
    paddingBottom: heightScale1(13),
    borderWidth: 1,
    borderColor: colors.disableButton,
    borderRadius: widthScale1(8),
  },
  secretCodeInput: {
    paddingHorizontal: widthScale1(16),

    borderWidth: 1,
    borderColor: colors.disableButton,
    borderRadius: widthScale1(8),
    flexDirection: 'row',
    alignItems: 'center',
    height: heightScale1(48),
  },
  dash: {
    color: colors.disableButton,
    fontSize: widthScale1(14),
  },
  activeDash: {
    color: colors.black,
    fontSize: widthScale1(14),
  },
});
