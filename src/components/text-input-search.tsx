import {StyleSheet, TextInputProps, View} from 'react-native';
import React, {Ref, forwardRef} from 'react';
import {TextInput} from 'react-native';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import Search from '~/assets/svgs/Search';
import {colors} from '~styles/colors';

interface Props {
  // value: string;
  // onChangeText: (value: string) => void;
}

const TextInputSearch = forwardRef((props: Props & TextInputProps, ref: Ref<any>) => {
  // const {} = props;

  return (
    <View style={styles.container}>
      <Search />
      <TextInput
        style={styles.inputStyle}
        placeholder="어디로 갈까요?"
        placeholderTextColor={colors.lineCancel}
        {...props}
      />
    </View>
  );
});

export default TextInputSearch;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: widthScale1(19),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.policy,
    borderRadius: widthScale1(8),
    height: heightScale1(48),
  },
  inputStyle: {
    marginLeft: widthScale1(10),
  },
});
