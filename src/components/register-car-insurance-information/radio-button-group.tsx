import {StyleSheet, View, ViewStyle} from 'react-native';
import React, {forwardRef, memo, Ref, useEffect, useImperativeHandle, useState} from 'react';
import RadioButton from '~components/radio-button';

interface Props {
  data: string[];
  style?: ViewStyle;
  onPressItem?: (item: string) => void;
  chooseData?: number;
}
export interface RadioButtonRef {
  dataChoose: string;
}

const RadioButtonGroup = forwardRef(
  ({data, style, onPressItem, chooseData}: Props, ref: Ref<RadioButtonRef>) => {
    const [itemChose, setItemChose] = useState(data[chooseData || 0]);

    useImperativeHandle(ref, () => ({dataChoose: itemChose}));

    useEffect(() => {
      setItemChose(data[chooseData || 0]);
    }, [chooseData]);

    const onPressRadioButton = (item: string) => {
      setItemChose(item);
      onPressItem?.(item);
    };

    return (
      <View style={[styles.view, style]}>
        {data.map((item, index) => (
          <RadioButton
            key={item + new Date().valueOf()}
            isFocus={itemChose === item}
            text={item}
            onPress={() => onPressRadioButton(item)}
          />
        ))}
      </View>
    );
  },
);

export default memo(RadioButtonGroup);

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
