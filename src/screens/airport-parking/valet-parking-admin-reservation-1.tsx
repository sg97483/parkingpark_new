import React, {memo, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import UsageHistoryMenuText from '~components/usage-history.tsx/usage-history-menu-text';
import ValetParkingAdminReservationImageList from '~components/valet-parking-admin-reservation/valet-parking-admin-reservation-image-list';
import NextPreviousButtons from '~components/valet-parking-reservation/next-previous-buttons';
import {PADDING, PADDING_HEIGHT} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ImageProps, ParkingProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useLazyParkingDetailsQuery} from '~services/parkingServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {fontSize} from '~styles/typography';

const ValetParkingAdminReservation1 = memo(
  (props: RootStackScreenProps<'ValetParkingAdminReservation1'>) => {
    const {navigation, route} = props;

    const payment = route?.params?.payment;

    const userInfo = useAppSelector(state => state?.userReducer?.user);

    const [getParkingLot] = useLazyParkingDetailsQuery();

    const [parkingLot, setParkingLot] = useState<ParkingProps>();

    const [carImageNumber, setCarImageNumber] = useState<number>(0);

    const [image1, setImage1] = useState<ImageProps | null>(null);
    const [image2, setImage2] = useState<ImageProps | null>(null);
    const [image3, setImage3] = useState<ImageProps | null>(null);
    const [image4, setImage4] = useState<ImageProps | null>(null);
    const [image5, setImage5] = useState<ImageProps | null>(null);

    const getImageCar = () => {
      switch (carImageNumber) {
        case 1:
          return image1;
        case 2:
          return image2;
        case 3:
          return image3;
        case 4:
          return image4;
        case 5:
          return image5;
      }
      return null;
    };
    const fetchParkingLot = () => {
      getParkingLot({id: Number(payment?.parkingLotId)})
        .unwrap()
        .then(res => {
          if (!res?.id) {
            showMessage({
              message: strings.valet_parking_admin_reservation_1.parking_not_not_existed,
            });
          } else {
            setParkingLot(res);
          }
        });
    };

    useEffect(() => {
      fetchParkingLot();
    }, []);

    const handleNext = () => {
      navigation.navigate(ROUTE_KEY.ValetParkingAdminReservation2, {
        paymentHistory: payment,
      });
    };

    return (
      <FixedContainer>
        <CustomHeader text={strings.valet_parking_admin_reservation_1.header} />

        <ScrollView>
          <UsageHistoryMenuText
            title={strings.valet_parking_admin_reservation_1.parking_lot_name}
            content={
              <Text style={styles.parkingLotName} numberOfLines={1}>
                {parkingLot?.garageName || ''}
              </Text>
            }
            style={{marginHorizontal: PADDING / 2}}
            contentStyle={{
              alignItems: 'flex-start',
            }}
          />

          <UsageHistoryMenuText
            title={strings.valet_parking_admin_reservation_1.car_number}
            content={
              <View style={styles.menuTextWrapper}>
                <CustomText
                  string={userInfo?.carNumber || ''}
                  size={FONT.CAPTION}
                  numberOfLines={1}
                />
              </View>
            }
            style={{marginHorizontal: PADDING / 2}}
          />

          <UsageHistoryMenuText
            title={strings.valet_parking_admin_reservation_1.car_model}
            content={
              <View style={styles.menuTextWrapper}>
                <CustomText
                  string={userInfo?.carModel || ''}
                  size={FONT.CAPTION}
                  numberOfLines={1}
                />
              </View>
            }
            style={{marginHorizontal: PADDING / 2}}
          />

          <UsageHistoryMenuText
            title={strings.valet_parking_admin_reservation_1.car_color}
            content={
              <View style={styles.menuTextWrapper}>
                <CustomText
                  string={userInfo?.carColor || ''}
                  size={FONT.CAPTION}
                  numberOfLines={1}
                />
              </View>
            }
            style={{marginHorizontal: PADDING / 2}}
          />

          <UsageHistoryMenuText
            title={strings.valet_parking_admin_reservation_1.contact}
            content={
              <View style={styles.menuTextWrapper}>
                <CustomText string={userInfo?.pnum || ''} size={FONT.CAPTION} numberOfLines={1} />
              </View>
            }
            style={{marginHorizontal: PADDING / 2}}
          />

          {/* Accompanying vehicle */}
          <UsageHistoryMenuText
            title={strings?.valet_parking_admin_reservation_1.car_together}
            content={
              <View>
                <HStack style={styles.inputWrapper}>
                  <View style={styles.menuTextWrapper}>
                    <CustomText
                      string={userInfo?.partnerCarList?.split(',')[0] || ''}
                      size={FONT.CAPTION}
                      numberOfLines={1}
                    />
                  </View>
                </HStack>

                <HStack style={[styles.inputWrapper, {marginTop: heightScale(5)}]}>
                  <View style={styles.menuTextWrapper}>
                    <CustomText
                      string={userInfo?.partnerCarList?.split(',')[1] || ''}
                      size={FONT.CAPTION}
                      numberOfLines={1}
                    />
                  </View>
                </HStack>

                <HStack style={[styles.inputWrapper, {marginTop: heightScale(5)}]}>
                  <View style={styles.menuTextWrapper}>
                    <CustomText
                      string={userInfo?.partnerCarList?.split(',')[2] || ''}
                      size={FONT.CAPTION}
                      numberOfLines={1}
                    />
                  </View>
                </HStack>
              </View>
            }
            style={{marginHorizontal: PADDING / 2}}
          />

          {/* Other requests */}
          <UsageHistoryMenuText
            title={strings.valet_parking_admin_reservation_1.other_request}
            content={
              <View style={styles.menuTextWrapper}>
                <CustomText
                  string={payment?.requirements || ''}
                  size={FONT.CAPTION}
                  numberOfLines={1}
                />
              </View>
            }
            style={{marginHorizontal: PADDING / 2}}
            isLastIndex
          />

          {/* Images */}
          <ValetParkingAdminReservationImageList
            payment={payment}
            setImage1={setImage1}
            setImage2={setImage2}
            setImage3={setImage3}
            setImage4={setImage4}
            setImage5={setImage5}
            getImageCar={getImageCar}
            setCarImageNumber={setCarImageNumber}
            style={{marginTop: PADDING_HEIGHT / 2}}
          />

          {/* Next page / go back */}
          <View style={{marginTop: PADDING_HEIGHT}}>
            <NextPreviousButtons onNextPress={handleNext} />
          </View>
        </ScrollView>
      </FixedContainer>
    );
  },
);

export default ValetParkingAdminReservation1;

const styles = StyleSheet.create({
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.gray,
    paddingHorizontal: PADDING / 2,
    justifyContent: 'center',
    alignItems: 'center',
    height: heightScale(40),
  },
  inputContainer: {},
  inputWrapper: {
    width: '100%',
  },
  registrationButton: {
    width: widthScale(50),
    borderWidth: 1,
    borderColor: colors.darkGray,
    height: heightScale(35),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: widthScale(5),
    borderRadius: widthScale(5),
  },
  dotWrapper: {
    width: widthScale(18),
    height: widthScale(18),
    borderWidth: 1,
    borderRadius: 999,
    borderColor: colors.darkGray,
    marginRight: widthScale(5),
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  dot: {
    width: widthScale(12),
    height: widthScale(12),
    borderRadius: 999,
  },
  parkingLotName: {
    color: colors.blue,
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    fontSize: fontSize(12),
    marginHorizontal: PADDING / 2,
  },
  menuTextWrapper: {
    width: '100%',
    paddingHorizontal: PADDING / 2,
    borderWidth: 1,
    borderColor: colors.gray,
    justifyContent: 'center',
    height: heightScale(40),
  },
});
