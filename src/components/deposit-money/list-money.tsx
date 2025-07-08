import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {colors} from '~styles/colors';
import {widthScale, heightScale} from '~styles/scaling-utils';
import CustomText from '~components/custom-text';
import {FONT} from '~constants/enum';
interface Props {
  onPressItem: (money: number) => void;
}
const ListMoney = ({onPressItem}: Props) => {
  return (
    <View style={styles.view}>
      {[10, 7, 5, 3, 1].map(item => (
        <TouchableOpacity
          key={item + new Date().valueOf()}
          onPress={() => onPressItem(item)}
          style={styles.item}>
          <CustomText string={`${item}만원`} size={FONT.CAPTION} />
        </TouchableOpacity>
      ))}
    </View>
  );
};
export default memo(ListMoney);
const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: heightScale(15),
  },
  item: {
    flex: 1,
    marginHorizontal: widthScale(3),
    height: heightScale(35),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: widthScale(5),
    borderWidth: widthScale(1),
    borderColor: colors.gray,
  },
});
