import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {heightScale} from '~styles/scaling-utils';
import {ParkingFilterProps} from '~constants/types';
import CustomFilterCheckBox from '~components/custom-filter-checkbox';

interface Props {
  item: ParkingFilterProps;
  onPress: () => void;
  isSelected: boolean;
  disabled: boolean;
}

const ItemCondition = ({item, onPress, isSelected, disabled}: Props) => {
  return (
    <View key={JSON.stringify(item)} style={styles.itemCondition}>
      <CustomFilterCheckBox
        isChecked={isSelected}
        text={item.title}
        onPress={() => {
          if (!disabled) {
            onPress && onPress();
          }
        }}
        isDisable={disabled}
      />
    </View>
  );
};

export default memo(ItemCondition);

const styles = StyleSheet.create({
  itemCondition: {
    height: heightScale(30),
    width: '100%',
    marginVertical: heightScale(10),
  },
});
