import React, {memo} from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {ICONS} from '~/assets/images-path';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import UsageHistoryMenuText from '~components/usage-history.tsx/usage-history-menu-text';
import NextPreviousButtons from '~components/valet-parking-reservation/next-previous-buttons';
import TitleWithIcon from '~components/valet-parking-reservation/title-with-icon';
import {PADDING, PADDING_HEIGHT} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {getReservedDtm} from '~utils/index';

const ValetParkingAdminReservation2 = memo(
  (props: RootStackScreenProps<'ValetParkingAdminReservation2'>) => {
    const {navigation, route} = props;

    const userToken = useAppSelector(state => state?.userReducer?.userToken);

    const paymentHistory = route?.params?.paymentHistory;

    const handleNext = () => {
      navigation.navigate(ROUTE_KEY.ValetParkingAdminReservation3, {
        paymentHistory,
      });
    };

    const getNightFee = () => {
      let hourOfDay = Number(paymentHistory.reservedEdDtm.substring(8, 10));
      let minute = Number(paymentHistory.reservedEdDtm.substring(10, 12));
      if (hourOfDay >= 22 || (hourOfDay <= 4 && minute <= 59) || (hourOfDay == 5 && minute == 0)) {
        return '10,000';
      }
      return '';
    };

    return (
      <FixedContainer>
        <CustomHeader text={strings.valet_parking_admin_reservation_2.header} />

        <ScrollView>
          <TitleWithIcon title={strings.valet_parking_admin_reservation_2.departure_information} />
          <UsageHistoryMenuText
            title={strings.valet_parking_admin_reservation_2.departure_date}
            content={
              <View style={styles.rowContainer}>
                <CustomText
                  string={getReservedDtm(paymentHistory?.reservedStDtm)}
                  size={FONT.CAPTION}
                  numberOfLines={1}
                />
                <Image source={ICONS.calendar} style={styles.iconStyle} resizeMode="contain" />
              </View>
            }
          />

          {/* In flight and city name */}
          <UsageHistoryMenuText
            title={strings.valet_parking_admin_reservation_2.outbound_flight}
            content={
              <View
                style={{
                  width: '100%',
                  marginHorizontal: PADDING / 2,
                }}>
                <CustomText
                  string={paymentHistory?.inFlightAndCityName}
                  size={FONT.CAPTION}
                  numberOfLines={1}
                />
              </View>
            }
            isLastIndex
          />

          <View style={{height: heightScale(10)}} />

          {/* Immigration information */}
          <TitleWithIcon title={strings.valet_parking_admin_reservation_2.immigration} />
          <UsageHistoryMenuText
            title={strings.valet_parking_admin_reservation_2.date_of_entry}
            content={
              <View style={styles.rowContainer}>
                <CustomText
                  string={getReservedDtm(paymentHistory?.reservedEdDtm)}
                  size={FONT.CAPTION}
                  numberOfLines={1}
                />
                <Image source={ICONS.calendar} style={styles.iconStyle} resizeMode="contain" />
              </View>
            }
          />

          <UsageHistoryMenuText
            title={strings.valet_parking_admin_reservation_2.night_departure}
            titleColor={colors.red}
            content={
              <View style={{width: '100%', marginHorizontal: PADDING / 2}}>
                <CustomText
                  string={getNightFee()}
                  size={FONT.CAPTION}
                  color={colors.red}
                  numberOfLines={1}
                />
              </View>
            }
          />

          {/* Out flight and city name */}
          <UsageHistoryMenuText
            title={strings.valet_parking_admin_reservation_2.outbound_flight}
            content={
              <View style={{width: '100%', marginHorizontal: PADDING / 2}}>
                <CustomText
                  string={paymentHistory?.outFlightAndCityName}
                  size={FONT.CAPTION}
                  numberOfLines={1}
                />
              </View>
            }
            isLastIndex
          />

          <View style={{marginTop: PADDING_HEIGHT / 2}}>
            <NextPreviousButtons onNextPress={handleNext} />
          </View>
        </ScrollView>
      </FixedContainer>
    );
  },
);

export default ValetParkingAdminReservation2;

const styles = StyleSheet.create({
  inputWrapper: {
    backgroundColor: colors.gray,
    paddingHorizontal: widthScale(10),
    height: heightScale(35),
    marginRight: widthScale(5),
    minWidth: widthScale(50),
  },
  input: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.BOLD,
    color: colors.red,
    textAlign: 'center',
  },
  iconStyle: {
    width: widthScale(20),
    height: heightScale(20),
  },
  rowContainer: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: widthScale(8),
  },
});
