import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import UsageHistoryMenuText from '~components/usage-history.tsx/usage-history-menu-text';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY, TERMINAL_SELECT} from '~constants/enum';
import {PADDING} from '~constants/constant';
import {strings} from '~constants/strings';
import {colors} from '~styles/colors';
import {getNumberWithCommas} from '~utils/numberUtils';
import moment from 'moment';
import HStack from '~components/h-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {showMessage} from 'react-native-flash-message';
import {ROUTE_KEY} from '~navigators/router';

const ValetParkingReservation3 = memo((props: RootStackScreenProps<'ValetParkingReservation3'>) => {
  const {navigation, route} = props;

  const parkingLot = route?.params?.parkingLot;
  const requirements = route?.params?.requirements;
  const agCarNumber = route?.params?.agCarNumber;
  const nightFee = route?.params?.nightFee;
  const inFlightDate = route?.params?.inFlightDate;
  const outFlightDate = route?.params?.outFlightDate;
  const inFlightDateTag = route?.params?.inFlightDateTag;
  const outFlightDateTag = route?.params?.outFlightDateTag;
  const valetSel = route?.params?.valetSel;
  const usePoint = route?.params?.usePoint;
  const usePointSklent = route?.params?.usePointSklent;
  const useCoupon = route?.params?.useCoupon;
  const inFlightAndCityName = route?.params?.inFlightAndCityName;
  const outFlightAndCityName = route?.params?.outFlightAndCityName;
  const inFlightTimeInMillis = route?.params?.inFlightTimeInMillis;
  const outFlightTimeInMillis = route?.params?.outFlightTimeInMillis;

  const getTotalMoney = () => {
    const diffDays = moment(inFlightTimeInMillis).diff(moment(outFlightTimeInMillis), 'day') + 3;

    let totalPrice: number = 0;

    if (diffDays === 1) {
      if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge1day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge1day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else {
        totalPrice =
          Number(parkingLot?.valetCharge1day) + nightFee - usePoint - useCoupon - usePointSklent;
      }
    }

    if (diffDays === 2) {
      if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge1day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge1day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else {
        totalPrice =
          Number(parkingLot?.valetCharge1day) + nightFee - usePoint - useCoupon - usePointSklent;
      }
    }

    if (diffDays === 3) {
      if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge2day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge2day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else {
        totalPrice =
          Number(parkingLot?.valetCharge2day) + nightFee - usePoint - useCoupon - usePointSklent;
      }
    }

    if (diffDays === 4) {
      if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge3day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge3day) +
          Number(nightFee) -
          Number(usePoint) -
          Number(useCoupon) -
          Number(usePointSklent);
      } else {
        totalPrice =
          Number(parkingLot?.valetCharge3day) + nightFee - usePoint - useCoupon - usePointSklent;
      }
    }

    if (diffDays === 5) {
      if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge4day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge4day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else {
        totalPrice =
          Number(parkingLot?.valetCharge4day) + nightFee - usePoint - useCoupon - usePointSklent;
      }
    }

    if (diffDays === 6) {
      if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge5day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge5day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else {
        totalPrice =
          Number(parkingLot?.valetCharge5day) + nightFee - usePoint - useCoupon - usePointSklent;
      }
    }

    if (diffDays === 7) {
      if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge6day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge6day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else {
        totalPrice =
          Number(parkingLot?.valetCharge6day) + nightFee - usePoint - useCoupon - usePointSklent;
      }
    }

    if (diffDays === 8) {
      if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge7day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge7day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else {
        totalPrice =
          Number(parkingLot?.valetCharge7day) + nightFee - usePoint - useCoupon - usePointSklent;
      }
    }

    if (diffDays === 9) {
      if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge8day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge8day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else {
        totalPrice =
          Number(parkingLot?.valetCharge8day) + nightFee - usePoint - useCoupon - usePointSklent;
      }
    }

    if (diffDays === 10) {
      if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge9day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge9day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else {
        totalPrice =
          Number(parkingLot?.valetCharge9day) + nightFee - usePoint - useCoupon - usePointSklent;
      }
    }

    if (diffDays === 11) {
      if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge10day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge10day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else {
        totalPrice =
          Number(parkingLot?.valetCharge10day) + nightFee - usePoint - useCoupon - usePointSklent;
      }
    }

    if (diffDays === 12) {
      if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge11day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge11day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else {
        totalPrice =
          Number(parkingLot?.valetCharge11day) + nightFee - usePoint - useCoupon - usePointSklent;
      }
    }

    if (diffDays === 13) {
      if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge12day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else if (valetSel === TERMINAL_SELECT.VALET_TWO && parkingLot?.id === 70001) {
        totalPrice =
          Number(parkingLot?.valetCharge12day) + nightFee - usePoint - useCoupon - usePointSklent;
      } else {
        totalPrice =
          Number(parkingLot?.valetCharge12day) + nightFee - usePoint - useCoupon - usePointSklent;
      }
    }

    // 터미널이 VALET_TWO 또는 valetTwo 라면 1만원 추가
    if (valetSel === TERMINAL_SELECT.VALET_TWO) {
      totalPrice += 10000; // 1만원 추가
    }

    if (useCoupon > 1 && useCoupon < 100) {
      const cperPriceOri = totalPrice + 30;
      const cperPrice = (cperPriceOri * useCoupon) / 100;
      const cperEndPrice = cperPriceOri - cperPrice;

      if (cperPrice > 10000) {
        totalPrice = totalPrice + 30 - 10000;
      } else {
        totalPrice = cperEndPrice;
      }
    }

    return totalPrice;
  };

  const handleSubmit = () => {
    if (Number(getTotalMoney()) < 34000 && Number(useCoupon) === 200) {
      showMessage({
        message: 'KB카드제휴쿠폰 사용시 실결제금액이 36,000원이상이 되어야 가능합니다.',
      });
      return;
    }

    navigation.navigate(ROUTE_KEY.ValetParkingReservation4, {
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
      valetSel: valetSel,
    });
  };

  return (
    <FixedContainer>
      <CustomHeader text="3단계. 발렛예약 및 가격확인" />
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
        {/*<UsageHistoryMenuText
            title="주차대행료"
            content={
              <View style={{ width: '100%' }}>
                <CustomText
                  string={`15.000${strings?.general_text?.won}`}
                  size={FONT.CAPTION}
                  textStyle={{
                    textAlign: 'right',
                    paddingHorizontal: PADDING / 2,
                    textDecorationLine: 'line-through',
                  }}
                />
              </View>
            }
          />*/}
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
          <CustomText
            size={FONT.CAPTION_2}
            color={colors.pink2}
            family={FONT_FAMILY.SEMI_BOLD}
            string={
              '* 파킹박 요금체계는 차량을 넘겨받는 시점과 귀국시 넘겨 드리는 시점이 됩니다.\n* 특히, 귀국(입국)하시는 날에는 비행기 착륙시간이 아닌 짐을 찾으신 후   고객님에게 차를 넘겨드리는 실제 시간이 적용됩니다.\n따라서,고객님께서 귀국하시는 일정이 밤 7시 20분 이후시면 짐을 찾으시고 나오시면 밤 8시 이후가 되실것 같습니다.\n* 밤 8시 이후부터 새벽 5시전까지는 심야할증료 10,000원이 추가로 부과 됩니다.\n\n추가 할증 금액은 사전에 결제를 해주셔야 되며, 예정보다 연착 또는 늦게 차를 넘겨받는 시점에는 발렛기사님에게 직접 현금으로 자급해 주셔야 됩니다.'
            }
          />
        </View>
      </ScrollView>

      <TouchableOpacity onPress={handleSubmit} style={styles.submitWrapper}>
        <CustomText
          string="발렛주차 예약결제"
          color={colors.white}
          family={FONT_FAMILY.SEMI_BOLD}
        />
      </TouchableOpacity>
    </FixedContainer>
  );
});

export default ValetParkingReservation3;

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
