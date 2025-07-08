import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomText from '~components/custom-text';
import {PADDING, PADDING_HEIGHT} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {TicketProps} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale} from '~styles/scaling-utils';
import {getNumberWithCommas} from '~utils/numberUtils';

interface Props {
  data: TicketProps[];
}

const ParkingPayInfoTab: React.FC<Props> = memo(props => {
  const {data} = props;

  return data ? (
    <View style={styles.container}>
      {data?.map((item, index) => {
        return (
          <View key={index} style={{marginTop: index !== 0 ? heightScale(25) : 0}}>
            <CustomText
              key={index}
              string={`• ${item?.ticketName}: ${getNumberWithCommas(Number(item?.ticketAmt))}원`}
              family={FONT_FAMILY.SEMI_BOLD}
            />
            <CustomText
              string={`• ${item?.ticketStart} ~ ${item?.ticketEnd}`}
              textStyle={{marginTop: PADDING_HEIGHT / 2}}
              family={FONT_FAMILY.SEMI_BOLD}
            />
            <CustomText
              string={`• ${item?.ticketText}`}
              textStyle={{marginTop: PADDING_HEIGHT / 2}}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </View>
        );
      })}
    </View>
  ) : (
    <></>
  );
});

export default ParkingPayInfoTab;

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
    backgroundColor: colors.card,
    borderRadius: 5,
  },
});
