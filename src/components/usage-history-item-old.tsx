import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {PADDING, PADDING_HEIGHT} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {PaymentHistoryProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {getDayOfWeek} from '~utils/index';
import {getNumberWithCommas} from '~utils/numberUtils';
import Button from './button';
import CustomText from './custom-text';
import HStack from './h-stack';

interface Props {
  item: PaymentHistoryProps;
}

const UsageHistoryItemOld: React.FC<Props> = memo(props => {
  const {item} = props;

  const navigation: UseRootStackNavigation = useNavigation();

  const handleGoToDetail = () => {
    navigation.navigate(ROUTE_KEY.ReservationDetail, {item});
  };

  const dateOfWeek = getDayOfWeek(moment(item?.reservedEdDtm, 'YYYYMMDDHHmm').valueOf());

  return (
    <View style={styles.container}>
      <HStack style={{justifyContent: 'space-between'}}>
        <View style={{flex: 1}}>
          <CustomText
            string={`${moment(item?.reservedEdDtm, 'YYYYMMDDHHmm').format(
              'YY.MM.DD',
            )}${dateOfWeek}`}
            color={colors.grayText}
          />
          <CustomText
            string={item?.parkNm}
            family={FONT_FAMILY.SEMI_BOLD}
            textStyle={{marginTop: heightScale(5)}}
          />
          <CustomText
            string={item?.TotalTicketType}
            color={colors.grayText}
            textStyle={{marginTop: heightScale(5)}}
          />
          <CustomText
            string={item?.carNumber}
            color={colors.grayText}
            textStyle={{marginTop: heightScale(5)}}
          />
        </View>

        <View style={{alignItems: 'center', marginLeft: widthScale(10)}}>
          <Button
            text={strings.usage_history.detail}
            style={styles.button}
            color={colors.black}
            onPress={handleGoToDetail}
          />
          <CustomText
            string={`${getNumberWithCommas(Number(item?.amt))}${strings?.general_text?.won}`}
            family={FONT_FAMILY.SEMI_BOLD}
            textStyle={{marginTop: heightScale(10)}}
          />
        </View>
      </HStack>
    </View>
  );
});

export default UsageHistoryItemOld;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: PADDING,
    paddingVertical: PADDING_HEIGHT,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    // overflow: 'hidden',
    marginTop: heightScale(16),
    borderRadius: widthScale(10),
  },
  button: {
    minWidth: widthScale(80),
    minHeight: heightScale(40),
    borderRadius: widthScale(5),
    borderColor: colors.transparent,
  },
});
