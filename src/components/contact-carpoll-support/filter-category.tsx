import React, {useCallback} from 'react';
import {FlatList, StyleProp, View, ViewStyle} from 'react-native';
import CustomBoxSelectButton from '~components/commons/custom-box-select-button';
import {widthScale1} from '~styles/scaling-utils';

interface FilterCategoryProps {
  data: string[];
  selected?: string;
  onChange?: (item: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
}
const FilterCategory = (props: FilterCategoryProps) => {
  const {data, selected, onChange, containerStyle} = props;

  const renderItem = useCallback(
    ({item}: {item: any}) => {
      const isSelect = selected === item;

      return (
        <CustomBoxSelectButton
          onSelected={() => onPressChange(item)}
          text={item}
          selected={isSelect}
        />
      );
    },
    [selected],
  );

  const onPressChange = useCallback(
    (item: string) => () => {
      onChange && onChange(item);
    },
    [],
  );

  return (
    <View style={containerStyle}>
      <FlatList
        horizontal={true}
        data={data}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        contentContainerStyle={{gap: widthScale1(10)}}
      />
    </View>
  );
};

export default React.memo(FilterCategory);
