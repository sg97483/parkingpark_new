import {ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import React, {memo, useMemo, useRef, useState, useEffect} from 'react';
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

const ValetNobelParkingReservation2 = memo(
  (props: RootStackScreenProps<'ValetNobelParkingReservation2'>) => {
    const {navigation, route} = props;

    const departureDateTimePickerRef = useRef<DateTimePickerRefs>(null);
    const dateOfEntryRef = useRef<DateTimePickerRefs>(null);

    const userToken = useAppSelector(state => state?.userReducer?.userToken);

    const parkingLot = route?.params?.parkingLot;
    const carNumber = route?.params?.agCarNumber;
    const selectedTerminal = route?.params?.valetSel;
    const otherRequests = route?.params?.requirements;

    const [departureDate, setDepartureDate] = useState<number | null>(null);
    const [dateOfEntry, setDateOfEntry] = useState<number | null>(null);
    const [inFlightAndCity, setInFlightAndCity] = useState<string>('');
    const [outFlightAndCity, setOutFlightAndCity] = useState<string>('');
    const [selectedCouponMoney, setSelectedCouponMoney] = useState<number>(0);
    const [pointUse, setPointUse] = useState<string>('0');
    const [chargeUse, setChargeUse] = useState<string>('0');
    const [outNightFee, setOutNightFee] = useState<number>(0);
    const [inNightFee, setInNightFee] = useState<number>(0);

    const {data: listCoupon} = useGetParkingCouponQuery({
      memberId: userToken?.id,
      memberPwd: userToken?.password,
      parkingLotId: parkingLot?.id,
    });

    const userInfo = useAppSelector(state => state?.userReducer?.user);

    const cardName = userInfo?.cardName;

    useEffect(() => {
      // 로그를 통해 선택된 터미널 값 확인
      console.log('Selected Terminal:', selectedTerminal);
    }, [selectedTerminal]);

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

    const getInNightSurcharge = useMemo(() => {
      if (dateOfEntry) {
        if (
          moment(dateOfEntry).hour() >= 20 ||
          (moment(dateOfEntry).hour() <= 4 && moment(dateOfEntry).minute() <= 59) ||
          (moment(dateOfEntry).hour() == 5 && moment(dateOfEntry).minute() == 0)
        ) {
          if (parkingLot?.nightCharge) {
            setOutNightFee(parkingLot?.nightCharge);
            return `입국시할증료: ${getNumberWithCommas(parkingLot.nightCharge)}${
              strings?.general_text?.won
            }`;
          }
        }
      }

      return '';
    }, [dateOfEntry]);

    const getOutNightSurcharge = useMemo(() => {
      if (departureDate) {
        if (
          moment(departureDate).hour() >= 20 ||
          (moment(departureDate).hour() <= 4 && moment(departureDate).minute() <= 59) ||
          (moment(departureDate).hour() == 5 && moment(departureDate).minute() == 0)
        ) {
          if (parkingLot?.nightCharge) {
            setInNightFee(parkingLot?.nightCharge);
            return `출국시할증료: ${getNumberWithCommas(parkingLot.nightCharge)}${
              strings?.general_text?.won
            }`;
          }
        }
      }

      return '';
    }, [departureDate]);

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

      if (selectedCouponMoney === 1000) {
        showMessage({
          message: '해당 쿠폰은 제휴주차장 결제에서만 사용가능합니다.',
        });
        return;
      }

      if (parkingLot?.id === 70003) {
        if (Number(pointUse) > 1000) {
          showMessage({
            message: '해당 서비스는 적립금 1천원까지 사용가능합니다.',
          });
          return;
        }
      } else {
        if (Number(pointUse) > 2000) {
          showMessage({
            message: '해당 서비스는 적립금 2천원까지 사용가능합니다.',
          });
          return;
        }
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

      let nightFeeSum: number = 0;
      if (inNightFee && outNightFee) {
        nightFeeSum = 30000;
      } else if (inNightFee && !outNightFee) {
        nightFeeSum = 10000;
      } else if (!inNightFee && outNightFee) {
        nightFeeSum = 10000;
      } else if (!inNightFee && !outNightFee) {
        nightFeeSum = 0;
      }

      if (moment(dateOfEntry).isBefore(moment(departureDate))) {
        showMessage({
          message: '입국일시가 출국일시 이후여야 합니다.',
        });
        return;
      }

      if (moment(dateOfEntry).diff(moment(departureDate), 'day') + 3 > 13) {
        showMessage({
          message: '발렛파킹 주차는 최대 11일까지 가능합니다.',
        });
        return;
      }

      navigation.navigate(ROUTE_KEY.ValetNobelParkingReservation3, {
        agCarNumber: carNumber,
        inFlightAndCityName: inFlightAndCity,
        inFlightDate: `${moment(dateOfEntry).format('YYYY년 MM월 DD일 HH시 mm분')}`,
        inFlightDateTag: `${moment(dateOfEntry).format('YYYYMMDDHHmm')}`,
        inFlightTimeInMillis: dateOfEntry,
        nightFee: nightFeeSum,
        outFlightAndCityName: outFlightAndCity,
        outFlightDate: `${moment(departureDate).format('YYYY년 MM월 DD일 HH시 mm분')}`,
        outFlightDateTag: `${moment(departureDate).format('YYYYMMDDHHmm')}`,
        outFlightTimeInMillis: departureDate,
        parkingLot: parkingLot,
        requirements: otherRequests,
        useCoupon: selectedCouponMoney,
        usePoint: Number(pointUse),
        usePointSklent: Number(chargeUse),
        valetSel: selectedTerminal,
      });
    };

    return (
      <FixedContainer>
        <CustomHeader text="2단계 입/출차 정보 입력" />
        <ScrollView>
          {/* departure information */}
          <TitleWithIcon title="입차정보" subTitle="(주차장 도착 예정시간)" />
          <UsageHistoryMenuText
            title="입차시간"
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
                          : '일정입력 (주차장 도착 예정시간)'
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
                  placeholder="항공편 및 도시 입력"
                  value={inFlightAndCity}
                  onChangeText={setInFlightAndCity}
                  placeholderTextColor={colors.grayText}
                />
              </View>
            }
            isLastIndex
          />

          {/* Immigration information */}
          <TitleWithIcon title="출차정보" subTitle="(입국시 공항 도착 예정시간)" />
          <UsageHistoryMenuText
            title="출차시간"
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
                          : '일정입력 (입국시 공항 도착 예정시간)'
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
          />
          {/* Night surcharge */}
          <UsageHistoryMenuText
            title="야간할증료"
            titleColor={colors.red}
            content={
              <View style={{width: '100%'}}>
                <HStack>
                  <View style={{flex: 1}}>
                    <CustomText
                      string={getOutNightSurcharge}
                      color={colors.red}
                      size={FONT.CAPTION}
                      family={FONT_FAMILY.BOLD}
                      textStyle={{
                        textAlign: 'right',
                        paddingHorizontal: PADDING / 2,
                      }}
                    />
                  </View>

                  <View style={{flex: 1}}>
                    <CustomText
                      string={getInNightSurcharge}
                      color={colors.red}
                      size={FONT.CAPTION}
                      family={FONT_FAMILY.BOLD}
                      textStyle={{
                        textAlign: 'right',
                        paddingHorizontal: PADDING / 2,
                      }}
                    />
                  </View>
                </HStack>
              </View>
            }
            isLastIndex
          />
          <CustomText
            string={
              '* 야간 및 심야할증료 : 출국 및 입국 시간이 오후 8시부터 다음 날 \n   오전 5시 사이일 경우, 할증료가 부과됩니다. \n   출차와 입차 모두 해당 시간에 포함될 경우, 각각 10,000원씩 할증료가 적용됩니다. \n   (입국 항공편 20시 이후 및 지연시에는 출차시간 기준으로 적용됨)'
            }
            size={FONT.CAPTION_2}
            family={FONT_FAMILY.BOLD}
            textStyle={{
              paddingHorizontal: PADDING,
              paddingTop: PADDING / 2,
            }}
          />

          {/* Reserves */}
          <TitleWithIcon title="적립금" />
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
          {/*
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
            string={`1. 출국정보 입력시 항공편 및 목적지 도시 입력해주십시요.\n2. 입국(귀국) 정보 입력시에는 인천공항 비행기 도착시간을 입력해 주십시오.\n3. 출발 당일, 기사님께서 안내해드린 장소에서 고객님 차량을 픽업해 드리고, 귀국 시에는 1층 입국장에서 차량을 가져다 드립니다.`}
            size={FONT.CAPTION_2}
            family={FONT_FAMILY.BOLD}
            textStyle={{
              paddingHorizontal: PADDING,
            }}
          />*/}

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

export default ValetNobelParkingReservation2;

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
