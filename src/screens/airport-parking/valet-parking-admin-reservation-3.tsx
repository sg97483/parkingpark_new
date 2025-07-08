import React, {memo} from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ICONS} from '~/assets/images-path';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import UsageHistoryMenuText from '~components/usage-history.tsx/usage-history-menu-text';
import {PADDING, PADDING_HEIGHT} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {RootStackScreenProps} from '~navigators/stack';
import {useParkingDetailsQuery} from '~services/parkingServices';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {getReservedDtm} from '~utils/index';
import {getNumberWithCommas} from '~utils/numberUtils';

const ValetParkingAdminReservation3 = memo(
  (props: RootStackScreenProps<'ValetParkingAdminReservation3'>) => {
    const {navigation, route} = props;

    const paymentHistory = route?.params?.paymentHistory;

    const {data: parkingLot} = useParkingDetailsQuery(
      {
        id: Number(paymentHistory?.parkingLotId),
      },
      {
        skip: !paymentHistory?.parkingLotId,
      },
    );

    return (
      <FixedContainer>
        <CustomHeader text={strings.valet_parking_admin_reservation_3.header} />

        <ScrollView>
          <UsageHistoryMenuText
            title={strings.valet_parking_admin_reservation_3.parking_lot_name}
            content={<CustomText string={parkingLot?.garageName || ''} size={FONT.CAPTION} />}
          />

          <UsageHistoryMenuText
            title={strings.valet_parking_admin_reservation_3.entry_date_and_time}
            content={
              <View style={styles.rowContainer}>
                <CustomText
                  string={getReservedDtm(paymentHistory?.reservedStDtm)}
                  size={FONT.CAPTION}
                />
                <Image source={ICONS.calendar} style={styles.iconStyle} resizeMode="contain" />
              </View>
            }
          />

          <UsageHistoryMenuText
            title={strings.valet_parking_admin_reservation_3.departure_date_and_time}
            content={
              <View style={styles.rowContainer}>
                <CustomText
                  string={getReservedDtm(paymentHistory?.reservedEdDtm)}
                  size={FONT.CAPTION}
                />
                <Image source={ICONS.calendar} style={styles.iconStyle} resizeMode="contain" />
              </View>
            }
            isLastIndex
          />

          <View style={{height: PADDING}} />

          <UsageHistoryMenuText
            title={strings.valet_parking_admin_reservation_3.reverse}
            content={
              <View style={{width: '100%'}}>
                <CustomText
                  string={`${getNumberWithCommas(paymentHistory?.usePoint)}${
                    strings?.general_text?.won
                  }`}
                  size={FONT.CAPTION}
                  textStyle={{
                    textAlign: 'right',
                    paddingHorizontal: PADDING / 2,
                  }}
                />
              </View>
            }
          />

          <UsageHistoryMenuText
            title={strings.valet_parking_admin_reservation_3.coupon}
            content={
              <View style={{width: '100%'}}>
                <CustomText
                  string={`${getNumberWithCommas(paymentHistory?.useCoupon)}${
                    strings?.general_text?.won
                  }`}
                  size={FONT.CAPTION}
                  textStyle={{
                    textAlign: 'right',
                    paddingHorizontal: PADDING / 2,
                  }}
                />
              </View>
            }
            isLastIndex
          />

          <UsageHistoryMenuText
            title={strings.valet_parking_admin_reservation_3.actual_payment_amount}
            pinkColor
            titleColor={colors.white}
            content={
              <View
                style={{
                  width: '100%',
                }}>
                <CustomText
                  string={`${getNumberWithCommas(paymentHistory?.amt)}${
                    strings?.general_text?.won
                  }`}
                  textStyle={{
                    textAlign: 'right',
                    paddingHorizontal: PADDING / 2,
                    marginVertical: PADDING / 2,
                  }}
                  color={colors.pink2}
                  size={FONT.TITLE_2}
                  family={FONT_FAMILY.BOLD}
                />
              </View>
            }
            style={{marginTop: PADDING_HEIGHT}}
            isLastIndex
          />

          <View style={styles.subTextView}>
            <CustomText
              string={
                '** 예약시 주의사항 !(필독) **\n예약 완료시 차량기사가 곧바로 배치 및 대기상태에 있게 되며 해당시간의 갑작스러운 취소요청이 들어오면 다음 차량에 대한 이송이 불가능해지기 때문에 부득이 아래와 같은 환불 규정을 두게 되었음을 공지합니다.'
              }
              size={FONT.CAPTION_2}
              color={colors.pink2}
              family={FONT_FAMILY.SEMI_BOLD}
            />

            <HStack
              style={{
                alignItems: 'flex-start',
                marginVertical: PADDING,
              }}>
              <Icon
                name="map-marker-alert"
                size={widthScale(30)}
                color={colors.darkGray}
                style={{
                  marginLeft: -widthScale(5),
                  marginRight: widthScale(5),
                }}
              />
              <View style={{flex: 1}}>
                <CustomText
                  size={FONT.CAPTION_2}
                  color={colors.darkGray}
                  family={FONT_FAMILY.SEMI_BOLD}
                  string={
                    '<예약 취소시 환불규정>\n- 입차 24시간 이전 취소시 전액 환불\n- 입차 3시간前 ~ 24시간前 : 1만원 공제 후 환불\n- 입차 3시간前 ~ 입차직전 : 50% 공제 후 환불\n- 입차 시간부터 그 이후 환불 불가'
                  }
                />
              </View>
            </HStack>
          </View>
        </ScrollView>
      </FixedContainer>
    );
  },
);

export default ValetParkingAdminReservation3;

const styles = StyleSheet.create({
  subTextView: {
    paddingHorizontal: PADDING,
    marginTop: PADDING_HEIGHT,
    paddingBottom: PADDING,
  },
  submitWrapper: {
    height: heightScale(45),
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: PADDING / 3,
  },
  rowContainer: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: widthScale(8),
  },
  iconStyle: {
    width: widthScale(20),
    height: heightScale(20),
  },
});
