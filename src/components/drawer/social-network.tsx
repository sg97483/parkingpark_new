import React, {useCallback} from 'react';
import {Image, Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING} from '~constants/constant';
import {SOCIAL_DATA} from '~constants/data';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {heightScale, widthScale} from '~styles/scaling-utils';

const SocialNetwork = () => {
  const renderItem = useCallback((item: any, index: number) => {
    return (
      <View key={index} style={styles.itemWrapper}>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(item?.link);
          }}>
          <Image source={item?.icon} style={styles.icon} resizeMode="contain" />
        </TouchableOpacity>
        <CustomText
          string={item?.name}
          size={FONT.CAPTION_2}
          family={FONT_FAMILY.SEMI_BOLD}
          textStyle={{marginTop: heightScale(10)}}
        />
      </View>
    );
  }, []);

  return (
    <HStack style={{flexWrap: 'wrap', paddingVertical: PADDING}}>
      {SOCIAL_DATA.map((item, index) => renderItem(item, index))}
    </HStack>
  );
};

export default SocialNetwork;

const styles = StyleSheet.create({
  itemWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    width: widthScale(40),
    height: heightScale(40),
  },
});
