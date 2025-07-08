import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {ItemOfListParkingLotsProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale} from '~styles/scaling-utils';
import {formatDistance} from '~utils/format';
import {getNumberWithCommas} from '~utils/numberUtils';

interface Props {
  item: ItemOfListParkingLotsProps;
}

const ListOfParkingLotsItem: React.FC<Props> = memo(props => {
  const {item} = props;

  const navigation: UseRootStackNavigation = useNavigation();

  const onItemPress = (value: ItemOfListParkingLotsProps) => {
    if (!value?.id) {
      showMessage({
        message:
          '운영이 중지된 주차장입니다. 실제와 정보가 다를 경우 관리자에게 문의 부탁드립니다.',
      });
      return;
    }
    navigation.navigate(ROUTE_KEY.ParkingDetails, {id: value?.id});
  };

  return (
    <TouchableOpacity onPress={() => onItemPress(item)}>
      <HStack style={styles.container}>
        <View style={styles.leftContent}>
          <CustomText
            string={item?.garageName}
            family={FONT_FAMILY.BOLD}
            color={colors.black}
            size={FONT.SUB_HEAD}
          />
          <CustomText
            string={item?.category}
            family={FONT_FAMILY.REGULAR}
            size={FONT.CAPTION}
            color={colors.darkGray}
            textStyle={styles.textStyle}
          />
          <CustomText
            string={
              item?.ticketName && item?.ticketAmt
                ? `${item?.ticketName} ${getNumberWithCommas(
                    Number(item?.ticketAmt),
                  )}원 (다른주차권보기)`
                : ''
            }
            family={FONT_FAMILY.BOLD}
            size={FONT.CAPTION_2}
          />
        </View>
        <CustomText
          string={formatDistance(item?.distance)}
          family={FONT_FAMILY.BOLD}
          size={FONT.CAPTION}
        />
      </HStack>
    </TouchableOpacity>
  );
});

export default ListOfParkingLotsItem;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: PADDING / 2,
    paddingVertical: heightScale(14),
    alignItems: 'flex-start',
  },
  leftContent: {
    flex: 1,
    justifyContent: 'space-between',
    marginRight: PADDING / 2,
  },
  textStyle: {
    paddingTop: heightScale(8),
    paddingBottom: heightScale(16),
  },
});
