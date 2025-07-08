import {FlashList} from '@shopify/flash-list';
import moment from 'moment';
import React, {memo, useCallback, useMemo} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Cell, Row, Table, TableWrapper} from 'react-native-table-component';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {PaymentHistoryProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetPaymentHistoryListQuery} from '~services/usageHistoryServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {fontSize} from '~styles/typography';
import {getNumberWithCommas} from '~utils/numberUtils';

const ValetPaymentHistoryAdmin = memo((props: RootStackScreenProps<'ValetPaymentHistoryAdmin'>) => {
  const {navigation, route} = props;
  const parkId = route?.params?.parkId;

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const {data, isFetching, refetch} = useGetPaymentHistoryListQuery({
    id: userToken?.id,
    pass: userToken?.password,
    parkId,
  });

  const renderHeader = useMemo(() => {
    return (
      <Table borderStyle={{borderWidth: 0.5, borderColor: colors.grayText}}>
        <Row
          data={['날짜', '입차일', '출차일', '차량번호', '결제금액', '자세히']}
          flexArr={[1, 1.2, 1.2, 1.2, 1.2, 0.8]}
          style={{
            backgroundColor: `${colors.red}10`,
            minHeight: heightScale(45),
          }}
          textStyle={{
            textAlign: 'center',
            fontFamily: FONT_FAMILY.BOLD,
            color: colors.black,
            fontSize: fontSize(12),
          }}
        />
      </Table>
    );
  }, []);

  const getTxtStDtm = (item: PaymentHistoryProps) => {
    let stDtmTxtO = item?.reservedStDtm;
    let stDtmTxt1 = stDtmTxtO?.substring(4, 6);
    let stDtmTxt2 = stDtmTxtO?.substring(6, 8);

    return stDtmTxt1 + '월 ' + stDtmTxt2 + '일';
  };

  const getTxtEtDtm = (item: PaymentHistoryProps) => {
    let etDtmTxtO = item.reservedEdDtm;
    let etDtmTxt1 = etDtmTxtO.substring(4, 6);
    let etDtmTxt2 = etDtmTxtO.substring(6, 8);

    return etDtmTxt1 + '월 ' + etDtmTxt2 + '일';
  };

  const getTextPriceColor = (price: string) => {
    if (price?.substring(0, 1) === '-') {
      return colors.red;
    }
    return colors.heavyGray;
  };

  const onPressDetail = useCallback(
    (item: PaymentHistoryProps) => {
      if (!parkId) {
        navigation.navigate(ROUTE_KEY.ReservationDetail, {item});
      } else {
        navigation.navigate(ROUTE_KEY.ValetParkingAdminReservation1, {
          payment: item,
          parkId,
        });
      }
    },
    [parkId],
  );

  const renderItem = useCallback(({item}: {item: PaymentHistoryProps}) => {
    return (
      <TableWrapper
        borderStyle={{
          borderColor: colors.grayText,
          borderWidth: 0.5,
        }}
        style={styles.itemWrapper}>
        <Cell
          data={
            <CustomText
              string={moment(item?.reservedEdDtm, 'YYYY/MM/DD').format('MM/DD')}
              size={FONT.CAPTION_3}
              textStyle={{
                textAlign: 'center',
              }}
              family={FONT_FAMILY.BOLD}
            />
          }
          flex={1}
        />

        <Cell
          data={
            <CustomText
              string={getTxtStDtm(item)}
              size={FONT.CAPTION_3}
              textStyle={{textAlign: 'center'}}
              family={FONT_FAMILY.BOLD}
              numberOfLines={1}
            />
          }
          flex={1.2}
        />

        <Cell
          data={
            <CustomText
              string={getTxtEtDtm(item)}
              size={FONT.CAPTION_3}
              textStyle={{textAlign: 'center'}}
              family={FONT_FAMILY.BOLD}
              numberOfLines={1}
            />
          }
          flex={1.2}
        />

        <Cell
          data={
            <CustomText
              string={item?.carNumber}
              size={FONT.CAPTION_3}
              textStyle={{textAlign: 'center'}}
              family={FONT_FAMILY.BOLD}
              numberOfLines={1}
            />
          }
          flex={1.2}
        />

        <Cell
          data={
            <CustomText
              string={`${getNumberWithCommas(Number(item?.amt))}${strings?.general_text?.won}`}
              size={FONT.CAPTION_3}
              color={getTextPriceColor(item?.amt)}
              textStyle={{textAlign: 'center'}}
              family={FONT_FAMILY.BOLD}
            />
          }
          flex={1.2}
        />

        <Cell
          data={
            <TouchableOpacity style={styles.buttonWrapper} onPress={() => onPressDetail(item)}>
              <Icon name="chevron-right" color={colors.darkBlue} size={widthScale(20)} />
            </TouchableOpacity>
          }
          flex={0.8}
        />
      </TableWrapper>
    );
  }, []);

  return (
    <FixedContainer>
      <CustomHeader text={strings.valet_payment_history_admin?.header} />

      {renderHeader}

      <FlashList
        data={data}
        estimatedItemSize={200}
        renderItem={renderItem}
        refreshing={isFetching}
        onRefresh={refetch}
      />
    </FixedContainer>
  );
});

export default ValetPaymentHistoryAdmin;

const styles = StyleSheet.create({
  itemWrapper: {
    flexDirection: 'row',
    minHeight: heightScale(50),
  },
  buttonWrapper: {
    backgroundColor: colors.gray,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 5,
  },
});
