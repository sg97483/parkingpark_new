import React, {memo} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Platform, // 🚩 [추가] Platform API를 import 합니다.
} from 'react-native';
import {TicketProps} from '~constants/types';
import CustomText from '~components/custom-text';
import {getNumberWithCommas} from '~utils/numberUtils';
import {strings} from '~constants/strings';
import {colors} from '~styles/colors';
import {PADDING, width} from '~constants/constant';
import {widthScale} from '~styles/scaling-utils';
import {FONT, FONT_FAMILY} from '~constants/enum';

interface Props {
  item: TicketProps;
  onItemPress: () => void;
  selectedItem: TicketProps | null;
}

const TicketItem: React.FC<Props> = memo(props => {
  const {item, onItemPress, selectedItem} = props;

  // 매진 표시는 기존 로직(ticketLimit === 0)만 사용
  const isSoldOut = item?.ticketLimit === 0;

  const formatTicketDayLimit = (dateString: string): string => {
    return (
      '해당 주차권 (' +
      dateString
        .split('/')
        .map((date: string) => {
          const month = date.slice(2, 4);
          const day = date.slice(4, 6);
          return `${month}월 ${day}일`;
        })
        .join(' / ') +
      ') 매진으로 구매불가'
    );
  };

  const isSelected = item?.ticketName === selectedItem?.ticketName;

  const dynamicBackgroundColor = isSelected ? colors.pink : colors.white;
  const dynamicTextColor = isSelected ? colors.white : isSoldOut ? colors.darkGray : colors.black;
  const dynamicDividerColor = isSelected ? colors.white : colors.darkGray;

  // 🚩 [수정] shadowContainer와 contentWrapper를 하나로 합치고, 플랫폼별 스타일을 적용합니다.
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: dynamicBackgroundColor,
          opacity: isSoldOut ? 0.5 : 1,
        },
      ]}
      onPress={isSoldOut ? undefined : onItemPress}
      disabled={isSoldOut}>
      <CustomText
        string={item?.ticketName}
        family={FONT_FAMILY.SEMI_BOLD}
        textStyle={{
          textAlign: 'center',
        }}
        color={dynamicTextColor}
      />
      <CustomText
        string={`${getNumberWithCommas(Number(item?.ticketAmt))}${strings?.general_text?.won}`}
        size={FONT.TITLE_2}
        family={FONT_FAMILY.BOLD}
        numberOfLines={1}
        textStyle={{
          marginVertical: PADDING / 2,
        }}
        color={dynamicTextColor}
      />
      <View
        style={[
          styles.divider,
          {
            borderColor: dynamicDividerColor,
          },
        ]}
      />
      <CustomText
        string={item?.ticketText ? item?.ticketText : `${item?.ticketStart} ~ ${item?.ticketEnd}`}
        textStyle={{
          textAlign: 'center',
        }}
        size={FONT.CAPTION}
        family={FONT_FAMILY.SEMI_BOLD}
        color={dynamicTextColor}
      />
      {item.ticketdayLimit && (
        <CustomText
          string={formatTicketDayLimit(item.ticketdayLimit)}
          textStyle={{
            textAlign: 'left',
            marginTop: PADDING / 4,
          }}
          size={FONT.CAPTION}
          family={FONT_FAMILY.BOLD}
          color={isSelected ? colors.white : isSoldOut ? colors.darkGray : colors.blue}
        />
      )}
    </TouchableOpacity>
  );
});

export default TicketItem;

const styles = StyleSheet.create({
  // 🚩 [수정] shadowContainer와 contentWrapper를 합친 새로운 컨테이너 스타일
  container: {
    width: (width - PADDING * 3) / 2,
    height: (width - PADDING * 3) / 2,
    marginVertical: PADDING / 2,
    marginLeft: PADDING,
    borderRadius: widthScale(10),
    padding: widthScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    // 🚩 Platform.select를 사용하여 OS에 따라 다른 스타일을 적용합니다.
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
      },
      android: {
        // 안드로이드에서는 그림자 대신 얇은 테두리를 사용합니다.
        elevation: 3, // elevation은 유지하되, 테두리를 추가하여 렌더링을 보장합니다.
        borderColor: '#E0E0E0', // 연한 회색 테두리
        borderWidth: 1,
      },
    }),
  },
  divider: {
    borderWidth: StyleSheet.hairlineWidth,
    width: '100%',
    borderStyle: 'dashed',
    borderRadius: 1,
    marginBottom: PADDING / 2,
  },
});
