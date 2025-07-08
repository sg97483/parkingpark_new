import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {colors} from '~styles/colors';
import {widthScale} from '~styles/scaling-utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  onPressChooseStar: (star: number) => void;
  star: number;
}
const ChooseStar = ({onPressChooseStar, star}: Props) => {
  return (
    <View style={styles.view}>
      {Array.from({length: 5}).map((_, index) => (
        <TouchableOpacity
          key={index + new Date().valueOf()}
          onPress={() => onPressChooseStar(index + 1)}>
          <Icon
            name="star"
            key={index * 3}
            color={star - 1 >= index ? colors.green : colors.gray}
            size={widthScale(35)}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ChooseStar;

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
