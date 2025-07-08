import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {ValetMainNoticeProps} from '~constants/types';
import HStack from '~components/h-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '~components/custom-text';
import moment from 'moment';
import {PADDING} from '~constants/constant';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {UseRootStackNavigation} from '~navigators/stack';
import {useNavigation} from '@react-navigation/native';
import {ROUTE_KEY} from '~navigators/router';

interface Props {
  item: ValetMainNoticeProps;
}

const ValetMainNoticeItem: React.FC<Props> = memo(props => {
  const {item} = props;

  const navigation: UseRootStackNavigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate(ROUTE_KEY.ValetMainNoticeDetail, {item})}>
      <HStack style={styles.container}>
        <View style={styles.iconWrapper}>
          <Icon name="bullhorn-variant-outline" size={widthScale(20)} color={colors.red} />
        </View>
        <View style={{flex: 1}}>
          <CustomText string={item?.subject} numberOfLines={1} family={FONT_FAMILY.BOLD} />
          <CustomText
            string={item?.text}
            numberOfLines={2}
            textStyle={{
              marginVertical: heightScale(5),
            }}
          />
          <CustomText
            string={`${moment(item?.regdate * 1000).format('MM.DD HH:mm')}`}
            size={FONT.CAPTION_2}
            color={colors.darkGray}
          />
        </View>
      </HStack>
    </TouchableOpacity>
  );
});

export default ValetMainNoticeItem;

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
    backgroundColor: `${colors.gray}50`,
    alignItems: 'flex-start',
  },
  iconWrapper: {
    borderWidth: 1,
    borderRadius: 999,
    width: widthScale(35),
    height: widthScale(35),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: widthScale(10),
    borderColor: colors.red,
  },
});
