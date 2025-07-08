import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {heightScale} from '~styles/scaling-utils';
import {ParkingFilterProps} from '~constants/types';
import CustomFilterCheckbox from '~components/custom-filter-checkbox';
interface Props {
  item: ParkingFilterProps;
  onPress: () => void;
  isSelected: boolean;
}

const ItemTicket = ({item, onPress, isSelected}: Props) => {
  return (
    <View key={JSON.stringify(item)} style={styles.itemTicket}>
      <CustomFilterCheckbox
        isChecked={isSelected}
        text={item.title}
        onPress={() => {
          onPress && onPress();
        }}
      />
    </View>
  );
};

export default memo(ItemTicket);

const styles = StyleSheet.create({
  itemTicket: {
    height: heightScale(30),
    width: '100%',
    marginVertical: heightScale(10),
  },
});
