import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {memo} from 'react';
import {TicketProps} from '~constants/types';
import {widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {PADDING, width} from '~constants/constant';
import {getNumberWithCommas} from '~utils/numberUtils';
import {strings} from '~constants/strings';
import Divider from '~components/divider';

interface Props {
  item: TicketProps;
  index: number;
  onItemPress: () => void;
  selectedTicket: TicketProps;
}

const TicketAutoItem: React.FC<Props> = memo(props => {
  const {index, item, onItemPress, selectedTicket} = props;
  return (
    <TouchableOpacity
      onPress={onItemPress}
      style={[
        styles.itemWrapper,
        {
          marginRight: index === 0 || index % 2 != 0 ? widthScale(3) : 0,
          marginBottom: widthScale(1.5),
          backgroundColor:
            selectedTicket?.ticketName === item?.ticketName ? colors?.pink : colors.white,
        },
      ]}>
      <CustomText
        string={item?.ticketName}
        family={FONT_FAMILY.BOLD}
        textStyle={{
          textAlign: 'center',
        }}
        numberOfLines={1}
        color={selectedTicket?.ticketName === item?.ticketName ? colors?.white : colors.black}
      />

      <CustomText
        string={`${getNumberWithCommas(Number(item?.ticketAmt))}${strings?.general_text?.won}`}
        family={FONT_FAMILY.BOLD}
        textStyle={{
          marginVertical: PADDING / 3,
          textAlign: 'center',
        }}
        color={selectedTicket?.ticketName === item?.ticketName ? colors?.white : colors.black}
      />

      <Divider />

      <CustomText
        string={item?.ticketText ? item?.ticketText : `${item?.ticketStart} ~ ${item?.ticketEnd}`}
        family={FONT_FAMILY.SEMI_BOLD}
        size={FONT.CAPTION_3}
        textStyle={{
          marginTop: PADDING / 3,
          textAlign: 'center',
        }}
        numberOfLines={2}
        color={selectedTicket?.ticketName === item?.ticketName ? colors?.white : colors.black}
      />
    </TouchableOpacity>
  );
});

export default TicketAutoItem;

const styles = StyleSheet.create({
  itemWrapper: {
    borderWidth: 1,
    borderColor: colors.gray,
    padding: widthScale(3),
    aspectRatio: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    maxHeight: (width - PADDING * 4) / 3,
  },
});
