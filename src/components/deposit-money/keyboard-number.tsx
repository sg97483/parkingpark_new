import {FlatList, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {ICONS} from '~/assets/images-path';
import {heightScale, widthScale} from '~styles/scaling-utils';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
interface Props {
  onPressItem: (number: number | string) => void;
  onPressDelete: () => void;
}
const KeyboardNumber = ({onPressItem, onPressDelete}: Props) => {
  const onPress = (item: number | string) => {
    if (item != 'null') {
      onPressItem(item);
    } else {
      onPressDelete();
    }
  };

  return (
    <View>
      <FlatList
        scrollEnabled={false}
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, '00', '0', 'null']}
        numColumns={3}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => onPress(item)} style={styles.viewItem}>
            {item != 'null' ? (
              <CustomText string={`${item}`} family={FONT_FAMILY.BOLD} size={FONT.TITLE_3} />
            ) : (
              <Image resizeMode="contain" source={ICONS.icons8_left_arrow} style={styles.img} />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default KeyboardNumber;

const styles = StyleSheet.create({
  viewItem: {
    flex: 1,
    height: heightScale(65),
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: widthScale(20),
    height: widthScale(20),
  },
});
