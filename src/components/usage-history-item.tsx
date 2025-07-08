import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {PaymentHistoryProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {getDayOfWeek} from '~utils/index';
import {getNumberWithCommas} from '~utils/numberUtils';
import CustomButton from './commons/custom-button';
import CustomText from './custom-text';
import Divider from './divider';
import HStack from './h-stack';
import PaddingHorizontalWrapper from './padding-horizontal-wrapper';

interface Props {
  item: PaymentHistoryProps;
}

const UsageHistoryItem: React.FC<Props> = memo(props => {
  const {item} = props;

  const navigation: UseRootStackNavigation = useNavigation();

  const handleGoToDetail = () => {
    navigation.navigate(ROUTE_KEY.ReservationDetail, {item});
  };

  const dateOfWeek = getDayOfWeek(moment(item?.reservedEdDtm, 'YYYYMMDDHHmm').valueOf());
  const isMonthlyParkingTicket = useMemo(
    (): boolean => item?.TotalTicketType?.includes('월주차권'),
    [item?.TotalTicketType],
  );

  return (
    <View>
      <PaddingHorizontalWrapper forDriveMe>
        <HStack>
          <View
            style={[
              styles.ticketTypeWrapperStyle,
              {
                backgroundColor: isMonthlyParkingTicket ? colors.white : colors.primary,
              },
            ]}>
            <CustomText
              forDriveMe
              size={FONT.CAPTION_4}
              string={isMonthlyParkingTicket ? '월주차권' : '주차권'}
              color={isMonthlyParkingTicket ? colors.primary : colors.white}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </View>

          <CustomText
            string={`${moment(item?.reservedEdDtm, 'YYYYMMDDHHmm').format(
              'YY.MM.DD',
            )}${dateOfWeek}`}
            forDriveMe
            textStyle={styles.timeTextStyle}
            color={colors.menuTextColor}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.BODY}
            lineHeight={heightScale1(25)}
          />
          <CustomButton
            buttonStyle={styles.goDetailButton}
            buttonHeight={38}
            onPress={handleGoToDetail}
            type="TERTIARY"
            outLine
            text="자세히"
            textSize={FONT.CAPTION_6}
            borderRadiusValue={6}
          />
        </HStack>

        <CustomText
          string={item?.parkNm}
          forDriveMe
          size={FONT.CAPTION_7}
          family={FONT_FAMILY.SEMI_BOLD}
          lineHeight={heightScale1(22)}
        />

        <CustomText
          string={item?.TotalTicketType}
          color={colors.grayText2}
          forDriveMe
          family={FONT_FAMILY.MEDIUM}
          lineHeight={heightScale1(20)}
        />

        <HStack
          style={{
            justifyContent: 'space-between',
          }}>
          <CustomText
            string={item?.agCarNumber}
            color={colors.grayText2}
            forDriveMe
            family={FONT_FAMILY.MEDIUM}
            lineHeight={heightScale1(20)}
          />
          <CustomText
            forDriveMe
            size={FONT.CAPTION_8}
            family={FONT_FAMILY.SEMI_BOLD}
            string={`${getNumberWithCommas(
              Number(item?.amt || 0) +
                Number(item?.usePoint || 0) +
                Number(item?.usePointSklent || 0),
            )}원`}
            textStyle={{
              marginTop: heightScale1(3),
            }}
            lineHeight={heightScale1(28)}
          />
        </HStack>
      </PaddingHorizontalWrapper>

      <Divider insetsVertical={30} />
    </View>
  );
});

export default UsageHistoryItem;

const styles = StyleSheet.create({
  timeTextStyle: {
    marginHorizontal: widthScale1(6),
  },
  ticketTypeWrapperStyle: {
    borderWidth: 1,
    minHeight: heightScale1(27),
    paddingHorizontal: widthScale1(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale1(4),
    borderColor: colors.primary,
  },
  goDetailButton: {
    paddingHorizontal: widthScale1(10),
    marginLeft: 'auto',
  },
});
