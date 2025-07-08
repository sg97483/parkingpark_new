import React, {memo, useRef} from 'react';
import {Pressable, StyleSheet, TextInput, TextInputProps, TouchableOpacity} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import {WIDTH} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

interface Props {
  disable?: boolean;
}

const ViewInputSearch = (props: Props & TextInputProps) => {
  const {style, editable = true, value, placeholder, disable, ...rest} = props;

  const inputRef = useRef<TextInput>(null);

  return (
    <Pressable
      onPress={() => {
        inputRef.current?.focus();
      }}
      style={[styles.viewInput1, style]}>
      {editable ? (
        <TextInput
          editable={true}
          placeholderTextColor={colors.grayText}
          value={value}
          style={styles.input}
          placeholder={placeholder}
          {...rest}
        />
      ) : (
        <CustomText
          family={FONT_FAMILY.MEDIUM}
          forDriveMe
          string={value || placeholder || ''}
          textStyle={{flex: 1}}
          color={value ? colors.menuTextColor : colors.grayText}
          size={FONT.CAPTION_6}
        />
      )}

      {!disable && editable && !!value && (
        <TouchableOpacity
          onPress={() => {
            rest?.onChangeText?.('');
          }}>
          <Icons.DeleteText />
        </TouchableOpacity>
      )}
    </Pressable>
  );
};

export default memo(ViewInputSearch);
const styles = StyleSheet.create({
  viewInput1: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.disableButton,
    width: WIDTH - widthScale1(65),
    height: heightScale1(50),
    justifyContent: 'center',
    paddingHorizontal: widthScale1(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 0,
    fontFamily: FONT_FAMILY.MEDIUM,
    fontSize: fontSize1(14),
  },
});
