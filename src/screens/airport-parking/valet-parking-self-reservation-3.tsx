import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import UsageHistoryMenuText from '~components/usage-history.tsx/usage-history-menu-text';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {PADDING} from '~constants/constant';
import {strings} from '~constants/strings';
import {colors} from '~styles/colors';
import {getNumberWithCommas} from '~utils/numberUtils';
import moment from 'moment';
import HStack from '~components/h-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {ROUTE_KEY} from '~navigators/router';

const ValetParkingSelfReservation3 = memo(
  (props: RootStackScreenProps<'ValetParkingSelfReservation3'>) => {
    const {navigation, route} = props;

    const parkingLot = route?.params?.parkingLot;
    const requirements = route?.params?.requirements;
    const agCarNumber = route?.params?.agCarNumber;
    const nightFee = route?.params?.nightFee;
    const inFlightDate = route?.params?.inFlightDate;
    const outFlightDate = route?.params?.outFlightDate;
    const inFlightDateTag = route?.params?.inFlightDateTag;
    const outFlightDateTag = route?.params?.outFlightDateTag;
    const usePoint = route?.params?.usePoint;
    const usePointSklent = route?.params?.usePointSklent;
    const useCoupon = route?.params?.useCoupon;
    const inFlightAndCityName = route?.params?.inFlightAndCityName;
    const outFlightAndCityName = route?.params?.outFlightAndCityName;
    const inFlightTimeInMillis = route?.params?.inFlightTimeInMillis;
    const outFlightTimeInMillis = route?.params?.outFlightTimeInMillis;

    const getTotalMoney = () => {
      const diffDays = moment(inFlightTimeInMillis).diff(moment(outFlightTimeInMillis), 'day') + 2;

      let totalPrice: number = 0;

      if (diffDays === 1) {
        totalPrice = parkingLot?.valetCharge1day + nightFee - usePoint - useCoupon - usePointSklent;
      }

      if (diffDays === 2) {
        totalPrice = parkingLot?.valetCharge2day + nightFee - usePoint - useCoupon - usePointSklent;
      }

      if (diffDays === 3) {
        totalPrice = parkingLot?.valetCharge3day + nightFee - usePoint - useCoupon - usePointSklent;
      }

      if (diffDays === 4) {
        totalPrice = parkingLot?.valetCharge4day + nightFee - usePoint - useCoupon - usePointSklent;
      }

      if (diffDays === 5) {
        totalPrice = parkingLot?.valetCharge5day + nightFee - usePoint - useCoupon - usePointSklent;
      }

      if (diffDays === 6) {
        totalPrice = parkingLot?.valetCharge6day + nightFee - usePoint - useCoupon - usePointSklent;
      }

      if (diffDays === 7) {
        totalPrice = parkingLot?.valetCharge7day + nightFee - usePoint - useCoupon - usePointSklent;
      }

      if (diffDays === 8) {
        totalPrice = parkingLot?.valetCharge8day + nightFee - usePoint - useCoupon - usePointSklent;
      }

      if (diffDays === 9) {
        totalPrice = parkingLot?.valetCharge9day + nightFee - usePoint - useCoupon - usePointSklent;
      }

      if (diffDays === 10) {
        totalPrice =
          parkingLot?.valetCharge10day + nightFee - usePoint - useCoupon - usePointSklent;
      }

      if (diffDays === 11) {
        totalPrice =
          parkingLot?.valetCharge11day + nightFee - usePoint - useCoupon - usePointSklent;
      }

      if (diffDays === 12) {
        totalPrice =
          parkingLot?.valetCharge12day + nightFee - usePoint - useCoupon - usePointSklent;
      }

      return totalPrice;
    };

    const handleSubmit = () => {
      navigation.navigate(ROUTE_KEY.ValetParkingSelfReservation4, {
        parkingLot: parkingLot,
        agCarNumber: agCarNumber,
        inFlightAndCityName: inFlightAndCityName,
        inFlightDate: inFlightDate,
        inFlightDateTag: inFlightDateTag,
        inFlightTimeInMillis: inFlightTimeInMillis,
        outFlightAndCityName: outFlightAndCityName,
        outFlightDate: outFlightDate,
        outFlightDateTag: outFlightDateTag,
        outFlightTimeInMillis: outFlightTimeInMillis,
        requirements: requirements,
        totalPrice: Number(getTotalMoney()),
        useCoupon: useCoupon,
        usePoint: usePoint,
        usePointSklent: usePointSklent,
      });
    };

    return (
      <FixedContainer>
        <CustomHeader text="3단계. 직접(셀프)주차 예약" />
        <ScrollView>
          <UsageHistoryMenuText
            title="주차장명"
            content={<CustomText string={parkingLot?.garageName} size={FONT.CAPTION} />}
          />
          <UsageHistoryMenuText
            title="입차일시"
            content={<CustomText string={outFlightDate} size={FONT.CAPTION} />}
          />
          <UsageHistoryMenuText
            title="출차일시"
            content={<CustomText string={inFlightDate} size={FONT.CAPTION} />}
            isLastIndex
          />
          <View style={{height: PADDING}} />
          <UsageHistoryMenuText
            title="주차대행료"
            content={
              <View
                style={{
                  width: '100%',
                  alignItems: 'flex-end',
                  paddingHorizontal: PADDING / 1.5,
                }}>
                <HStack>
                  <CustomText
                    string={`15.000${strings?.general_text?.won}`}
                    size={FONT.CAPTION}
                    textStyle={{
                      textAlign: 'right',
                      paddingHorizontal: PADDING / 2,
                      textDecorationLine: 'line-through',
                    }}
                  />
                  <CustomText string="(무료)" size={FONT.CAPTION} />
                </HStack>
              </View>
            }
          />
          <UsageHistoryMenuText
            title="총 결제요금"
            pinkColor
            titleColor={colors.white}
            content={
              <View
                style={{
                  width: '100%',
                }}>
                <CustomText
                  string={`${getNumberWithCommas(getTotalMoney())}${strings?.general_text?.won}`}
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
            isLastIndex
          />
          <View style={styles.subTextView}>
            <HStack
              style={{
                alignItems: 'flex-start',
                marginVertical: PADDING / 2,
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

        <TouchableOpacity onPress={handleSubmit} style={styles.submitWrapper}>
          <CustomText
            string="직접주차 예약결제"
            color={colors.white}
            family={FONT_FAMILY.SEMI_BOLD}
          />
        </TouchableOpacity>
      </FixedContainer>
    );
  },
);

export default ValetParkingSelfReservation3;

const styles = StyleSheet.create({
  subTextView: {
    paddingHorizontal: PADDING,
    paddingTop: PADDING / 2,
    paddingBottom: PADDING,
  },
  submitWrapper: {
    height: heightScale(45),
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: PADDING / 3,
  },
});
