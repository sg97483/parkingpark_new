import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {PADDING_HEIGHT} from '~constants/constant';
import {colors} from '~styles/colors';
import HStack from './h-stack';
import CustomText from './custom-text';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ICONS} from '~/assets/images-path';

interface IProps {
  item: any;
}

const PointManagementItem = ({item}: IProps) => {
  return (
    <View style={styles.container}>
      <HStack style={{justifyContent: 'space-between'}}>
        <Image
          source={item.money > 0 ? ICONS.plus : ICONS.sub}
          style={styles.icon}
          resizeMode="contain"
        />

        <View style={{flex: 1, marginHorizontal: widthScale(10)}}>
          <CustomText string={item.title} />
          <CustomText
            string={item?.date}
            color={colors.grayText}
            textStyle={{marginTop: heightScale(5)}}
          />
        </View>

        <View style={{alignItems: 'flex-end'}}>
          <CustomText
            string={`${item.money > 0 ? '+' : ''}${item.money}${strings.general_text.won}`}
            family={FONT_FAMILY.SEMI_BOLD}
            color={item.money > 0 ? colors.primary : colors.black}
          />
          <CustomText string={item.type} color={item.money > 0 ? colors.primary : colors.black} />
        </View>
      </HStack>
    </View>
  );
};

export default PointManagementItem;

const styles = StyleSheet.create({
  container: {
    paddingVertical: PADDING_HEIGHT / 2,
    marginTop: heightScale(16),
  },
  icon: {
    width: widthScale(20),
    height: heightScale(20),
  },
});
