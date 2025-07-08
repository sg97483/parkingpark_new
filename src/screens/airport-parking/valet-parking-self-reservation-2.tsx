import {ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import React, {memo, useRef, useState} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import HStack from '~components/h-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import CustomText from '~components/custom-text';
import {PADDING} from '~constants/constant';
import TitleWithIcon from '~components/valet-parking-reservation/title-with-icon';
import UsageHistoryMenuText from '~components/usage-history.tsx/usage-history-menu-text';
import moment from 'moment';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {useGetParkingCouponQuery} from '~services/couponServices';
import {useAppSelector} from '~store/storeHooks';
import CouponSelector from '~components/valet-parking-reservation/coupon-selector';
import {CouponProps} from '~constants/types';
import {getNumberWithCommas} from '~utils/numberUtils';
import {strings} from '~constants/strings';
import NextPreviousButtons from '~components/valet-parking-reservation/next-previous-buttons';
import DateTimePicker, {DateTimePickerRefs} from '~components/date-time-picker';
import {showMessage} from 'react-native-flash-message';
import {ROUTE_KEY} from '~navigators/router';

const ValetParkingSelfReservation2 = memo(
  (props: RootStackScreenProps<'ValetParkingSelfReservation2'>) => {
    const {navigation, route} = props;

    const departureDateTimePickerRef = useRef<DateTimePickerRefs>(null);
    const dateOfEntryRef = useRef<DateTimePickerRefs>(null);

    const userToken = useAppSelector(state => state?.userReducer?.userToken);

    const parkingLot = route?.params?.parkingLot;
    const carNumber = route?.params?.agCarNumber;
    const otherRequests = route?.params?.requirements;

    const [departureDate, setDepartureDate] = useState<number | null>(null);
    const [dateOfEntry, setDateOfEntry] = useState<number | null>(null);
    const [inFlightAndCity, setInFlightAndCity] = useState<string>('');
    const [outFlightAndCity, setOutFlightAndCity] = useState<string>('');
    const [selectedCouponMoney, setSelectedCouponMoney] = useState<number>(0);
    const [pointUse, setPointUse] = useState<string>('0');
    const [chargeUse, setChargeUse] = useState<string>('0');

    const {data: listCoupon} = useGetParkingCouponQuery({
      memberId: userToken?.id,
      memberPwd: userToken?.password,
      parkingLotId: parkingLot?.id,
    });

    const userInfo = useAppSelector(state => state?.userReducer?.user);

    const cardName = userInfo?.cardName;

    const mPoint = Number(userInfo?.mpoint) || 0;
    let usePoint = 0;
    if (userInfo?.usePointSum) {
      usePoint = Number(userInfo?.usePointSum);
    }

    const mCharge = Number(userInfo?.chargeMoney) || 0;

    let mChargeSum = 0;
    if (userInfo?.usePointSumSklent) {
      mChargeSum = Number(userInfo?.usePointSumSklent);
    }

    let cancelPoint = 0;
    if (userInfo?.cancelPoint) {
      cancelPoint = Number(userInfo?.cancelPoint);
    }

    let cancelCharge = 0;
    if (userInfo?.cancelPointSklent) {
      cancelCharge = Number(userInfo?.cancelPointSklent);
    }

    const userPoint = mPoint - usePoint + cancelPoint;
    const userCharge = mCharge - mChargeSum + cancelCharge || 0;

    const handleNext = () => {
      if (!inFlightAndCity || !outFlightAndCity) {
        showMessage({
          message: '항공편 및 도시명을 입력해 주십시오.',
        });
        return;
      }

      if (!departureDate) {
        showMessage({
          message: '출국일시를 입력해 주십시오.',
        });
        return;
      }

      if (!dateOfEntry) {
        showMessage({
          message: '입국일시를 입력해 주십시오.',
        });
        return;
      }

      if (!cardName) {
        showMessage({
          message:
            '결제카드 등록시 주차권구매가 가능합니다. 메인화면 -> 좌측상단 메뉴 -> 나의 정보 관리 결제카드 등록후 이용하시기바랍니다.',
        });
        return;
      }

      if (!pointUse) {
        setPointUse('0');
      }

      if (!chargeUse) {
        setChargeUse('0');
      }

      let pointString = pointUse;
      pointString = pointString && pointString.substring(pointString.length - 1);
      if (pointString !== '0') {
        showMessage({
          message: '1원단위는 사용불가능합니다.',
        });
      }

      let chargeString = chargeUse;
      chargeString = chargeString && chargeString.substring(chargeString.length - 1);
      if (chargeString !== '0') {
        showMessage({
          message: '1원단위는 사용불가능합니다.',
        });
      }

      if (Number(pointUse) > 2000) {
        showMessage({
          message: '해당 서비스는 적립금 2천원까지 사용가능합니다.',
        });
        return;
      }

      if (Number(pointUse) > userPoint) {
        showMessage({
          message: '입력하신 적립금이 적립금 잔액보다 작습니다.',
        });
        return;
      }

      if (Number(chargeUse) > userCharge) {
        showMessage({
          message: '입력하신 적립금이 적립금 잔액보다 작습니다.',
        });
        return;
      }

      if (moment(dateOfEntry).isBefore(moment(departureDate))) {
        showMessage({
          message: '입국일시가 출국일시 이후여야 합니다.',
        });
        return;
      }

      if (moment(dateOfEntry).diff(moment(departureDate), 'day') + 2 > 13) {
        showMessage({
          message: '발렛파킹 주차는 최대 13일까지 가능합니다.',
        });
        return;
      }

      navigation.navigate(ROUTE_KEY.ValetParkingSelfReservation3, {
        agCarNumber: carNumber,
        inFlightAndCityName: inFlightAndCity,
        inFlightDate: `${moment(dateOfEntry).format('YYYY년 MM월 DD일 HH시 mm분')}`,
        inFlightDateTag: `${moment(dateOfEntry).format('YYYYMMDDHHmm')}`,
        inFlightTimeInMillis: dateOfEntry,
        nightFee: 0,
        outFlightAndCityName: outFlightAndCity,
        outFlightDate: `${moment(departureDate).format('YYYY년 MM월 DD일 HH시 mm분')}`,
        outFlightDateTag: `${moment(departureDate).format('YYYYMMDDHHmm')}`,
        outFlightTimeInMillis: departureDate,
        parkingLot: parkingLot,
        requirements: otherRequests,
        useCoupon: selectedCouponMoney,
        usePoint: Number(pointUse),
        usePointSklent: Number(chargeUse),
      });
    };

    return (
      <FixedContainer>
        <CustomHeader text="2단계. 입/출국 정보" />
        <ScrollView>
          {/* departure information */}
          <TitleWithIcon title="출국정보" />
          <UsageHistoryMenuText
            title="출국일시"
            content={
              <View
                style={{
                  width: '100%',
                }}>
                <HStack>
                  <View style={{flex: 1, marginRight: widthScale(5)}}>
                    <CustomText
                      string={
                        departureDate
                          ? `${moment(departureDate).format('YYYY년 MM월 DD일 HH시 mm분')}`
                          : '날짜를 선택해 주세요.'
                      }
                      size={FONT.CAPTION}
                      numberOfLines={1}
                    />
                  </View>

                  <TouchableOpacity onPress={() => departureDateTimePickerRef?.current?.show()}>
                    <Icon name="calendar-month-outline" size={widthScale(25)} />
                  </TouchableOpacity>
                </HStack>
              </View>
            }
          />
          {/* In flight and city name */}
          <UsageHistoryMenuText
            title="출국항공편"
            content={
              <View style={{width: '100%'}}>
                <TextInput
                  placeholder="항공편 및 도시 입력 / 주차장  도착 예정시간"
                  value={inFlightAndCity}
                  onChangeText={setInFlightAndCity}
                  placeholderTextColor={colors.grayText}
                />
              </View>
            }
            isLastIndex
          />

          {/* Immigration information */}
          <TitleWithIcon title="입국정보" />
          <UsageHistoryMenuText
            title="입국일시"
            content={
              <View
                style={{
                  width: '100%',
                }}>
                <HStack>
                  <View style={{flex: 1, marginRight: widthScale(5)}}>
                    <CustomText
                      string={
                        dateOfEntry
                          ? `${moment(dateOfEntry).format('YYYY년 MM월 DD일 HH시 mm분')}`
                          : '날짜를 선택해 주세요.'
                      }
                      size={FONT.CAPTION}
                      numberOfLines={1}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      dateOfEntryRef?.current?.show();
                    }}>
                    <Icon name="calendar-month-outline" size={widthScale(25)} />
                  </TouchableOpacity>
                </HStack>
              </View>
            }
          />
          {/* Out flight and city name */}
          <UsageHistoryMenuText
            title="입국항공편"
            content={
              <View style={{width: '100%'}}>
                <TextInput
                  placeholder="항공편 및 도시 입력"
                  value={outFlightAndCity}
                  onChangeText={setOutFlightAndCity}
                  placeholderTextColor={colors.grayText}
                />
              </View>
            }
            isLastIndex
          />

          {/* Reserves */}
          <TitleWithIcon title="적립금" subTitle="(해당 서비스는 적립금 2천원까지 사용가능)" />
          <UsageHistoryMenuText
            title="적립금사용"
            titleColor={colors.red}
            content={
              <View style={{width: '100%'}}>
                <HStack>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      value={pointUse}
                      onChangeText={setPointUse}
                      placeholder="사용 입력란"
                      style={styles.input}
                      keyboardType="numeric"
                      maxLength={4}
                      placeholderTextColor={colors.grayText}
                    />
                  </View>

                  <CustomText
                    size={FONT.CAPTION}
                    family={FONT_FAMILY.BOLD}
                    string={`${strings?.general_text?.won} / `}
                  />
                  <CustomText
                    string={`${getNumberWithCommas(userPoint)}${strings?.general_text?.won}`}
                    size={FONT.CAPTION}
                    family={FONT_FAMILY.BOLD}
                  />
                </HStack>
              </View>
            }
          />
          <UsageHistoryMenuText
            title="충전금액"
            content={
              <View style={{width: '100%'}}>
                <HStack>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      value={chargeUse}
                      onChangeText={setChargeUse}
                      placeholder="사용 입력란"
                      style={styles.input}
                      keyboardType="numeric"
                      maxLength={6}
                      placeholderTextColor={colors.grayText}
                    />
                  </View>

                  <CustomText
                    size={FONT.CAPTION}
                    family={FONT_FAMILY.BOLD}
                    string={`${strings?.general_text?.won} / `}
                  />
                  <CustomText
                    size={FONT.CAPTION}
                    family={FONT_FAMILY.BOLD}
                    string={`${getNumberWithCommas(userCharge)}${strings?.general_text?.won}`}
                  />
                </HStack>
              </View>
            }
          />
          <UsageHistoryMenuText
            title="쿠폰사용"
            content={
              <View style={{width: '100%'}}>
                {listCoupon?.length ? (
                  <CouponSelector
                    data={listCoupon as CouponProps[]}
                    onSelect={(value: number) => {
                      setSelectedCouponMoney(value);
                    }}
                  />
                ) : (
                  <CustomText
                    string="쿠폰없음"
                    textStyle={{
                      textAlign: 'center',
                    }}
                    size={FONT.CAPTION}
                    family={FONT_FAMILY.BOLD}
                  />
                )}
              </View>
            }
            isLastIndex
          />
          <CustomText
            string={'※ 입/출국정보 입력시 유의사항 (필독)'}
            size={FONT.CAPTION_2}
            family={FONT_FAMILY.BOLD}
            textStyle={{
              paddingHorizontal: PADDING,
              paddingTop: PADDING / 2,
            }}
            color={colors.red}
          />
          <CustomText
            string={
              '1.출국정보  입력시 항공편 및 도시입력 / 주차장 도착예정 시간을 입력해 주십시오.\n2.입국(귀국) 정보 입력시에는 인천공항 비행기 도착시간을 입력해 주십시오'
            }
            size={FONT.CAPTION_2}
            family={FONT_FAMILY.BOLD}
            textStyle={{
              paddingHorizontal: PADDING,
            }}
          />

          <NextPreviousButtons onNextPress={handleNext} />
        </ScrollView>

        {/* Departure date */}
        <DateTimePicker ref={departureDateTimePickerRef} onSelect={setDepartureDate} />
        {/* Date of entry */}
        <DateTimePicker ref={dateOfEntryRef} onSelect={setDateOfEntry} />
      </FixedContainer>
    );
  },
);

export default ValetParkingSelfReservation2;

const styles = StyleSheet.create({
  inputWrapper: {
    backgroundColor: colors.gray,
    paddingHorizontal: widthScale(10),
    minHeight: heightScale(35),
    marginRight: widthScale(5),
    minWidth: widthScale(50),
  },
  input: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.BOLD,
    color: colors.red,
    textAlign: 'center',
    flex: 1,
  },
});
