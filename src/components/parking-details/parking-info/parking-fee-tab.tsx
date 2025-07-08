import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomText from '~components/custom-text';
import {PADDING} from '~constants/constant';
import {FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import {ParkingProps} from '~constants/types';
import {colors} from '~styles/colors';
import {getNumberWithCommas} from '~utils/numberUtils';

interface Props {
  data: ParkingProps;
}

const ParkingFeeTab: React.FC<Props> = memo(props => {
  const {data} = props;

  const getFee = () => {
    let ratingPay = '';
    let boxFee = '';

    if (data?.charge == null || data?.charge == -1) {
      boxFee += '• 기본요금: -\n\n';
    } else if (data?.id == 57241 || data?.id == 57242) {
      ratingPay = '50';
      boxFee += `• 기본요금: ${getNumberWithCommas(
        Number(data?.charge),
      )}원 / 5분 당 추가요금: ${ratingPay}원\n\n`;
    } else if (data?.id == 57234 || data?.id == 57235 || data?.id == 57236) {
      ratingPay = '200';
      boxFee += `• 기본요금: ${getNumberWithCommas(
        Number(data?.charge),
      )}원 / 5분 당 추가요금: ${ratingPay}원\n\n`;
    } else if (data?.id == 57248) {
      ratingPay = '200';
      boxFee += `• 기본요금: ${getNumberWithCommas(
        Number(data?.charge),
      )}원 / 10분 당 추가요금: ${ratingPay}원\n\n`;
    } else if (data?.agency === '청주시시설관리공단') {
      ratingPay = '100';
      boxFee += `• 기본요금: ${getNumberWithCommas(
        Number(data?.charge),
      )}원 / 5분 당 추가요금: ${ratingPay}원\n\n`;
    } else if (data?.ticketPartnerYN === 'Y') {
      // charge의 마지막 자릿수에 따라 텍스트 설정
      const chargeSuffix = String(data?.charge).slice(-1);
      let suffixText = '';

      switch (chargeSuffix) {
        case '1':
          suffixText = '5분';
          break;
        case '2':
          suffixText = '10분';
          break;
        case '3':
          suffixText = '15분';
          break;
        case '4':
          suffixText = '20분';
          break;
        case '5':
          suffixText = '25분';
          break;
        case '6':
          suffixText = '30분';
          break;
        case '7':
          suffixText = '45분';
          break;
        case '8':
          suffixText = '60분';
          break;
        case '9':
          suffixText = '90분';
          break;
        default:
          suffixText = '';
          break;
      }

      // charge 값의 마지막 자릿수를 0으로 변경하여 표출
      const adjustedCharge = Math.floor(Number(data?.charge) / 10) * 10;

      if (adjustedCharge === 0) {
        boxFee += '• 기본요금 : 정보없음\n\n'; // adjustedCharge가 0일 때 "정보없음" 표시
      } else if (suffixText) {
        boxFee += `• 기본요금 : ${suffixText} ${getNumberWithCommas(adjustedCharge)}원\n\n`;
      } else {
        boxFee += `• 기본요금 : ${getNumberWithCommas(adjustedCharge)}원\n\n`;
      }
    } else {
      boxFee += `• 기본 : 10분 당 ${getNumberWithCommas(Number(data?.charge))}원\n\n`;
    }

    let first30 = '• 추가요금 : ';

    if (data?.first30 == null || data?.first30 == -1) {
      first30 += '-\n\n';
    } else if (data?.ticketPartnerYN === 'Y') {
      // first30 값의 마지막 자릿수에 따라 텍스트 설정
      const first30Suffix = String(data?.first30).slice(-1);
      let suffixText = '';

      switch (first30Suffix) {
        case '1':
          suffixText = '5분 당';
          break;
        case '2':
          suffixText = '10분 당';
          break;
        case '3':
          suffixText = '15분 당';
          break;
        case '4':
          suffixText = '20분 당';
          break;
        case '5':
          suffixText = '25분 당';
          break;
        case '6':
          suffixText = '30분 당';
          break;
        case '7':
          suffixText = '45분 당';
          break;
        case '8':
          suffixText = '60분 당';
          break;
        case '9':
          suffixText = '90분 당';
          break;
        default:
          suffixText = '';
          break;
      }

      // first30 값의 마지막 자릿수를 0으로 변경하여 표출
      const adjustedFirst30 = Math.floor(Number(data?.first30) / 10) * 10;

      if (adjustedFirst30 === 0) {
        first30 += '정보없음\n\n'; // adjustedFirst30이 0일 경우 "정보없음" 표시
      } else if (suffixText) {
        first30 += `${suffixText} ${getNumberWithCommas(adjustedFirst30)}원\n\n`;
      } else {
        first30 += `${getNumberWithCommas(adjustedFirst30)}원\n\n`;
      }
    } else {
      first30 += `${getNumberWithCommas(Number(data?.first30))}원\n\n`;
    }

    let chargeAfter = '• 2시간 초과: ';
    if (data?.chargeAfter == null || data?.chargeAfter == -1) {
      console.log(
        '🚀 ~ file: parking-fee-tab.tsx:58 ~ getFee ~ data?.chargeAfter',
        data?.chargeAfter,
      );
      chargeAfter += '-\n\n';
    } else {
      chargeAfter += `10분 당 ${getNumberWithCommas(Number(data?.chargeAfter))}원\n\n`;
    }

    let chargeOneDay = '• 일 정액: ';
    if (data?.chargeOneDay == null || data?.chargeOneDay == -1) {
      chargeOneDay += '-\n\n';
    } else {
      chargeOneDay += `${getNumberWithCommas(Number(data?.chargeOneDay))}원\n\n`;
    }

    let monthText = '';
    let monthOneDay = '';
    let monthDay = '';
    let monthNight = '';
    let monthCharge = '-';

    if (data?.monthOneDay != null && data?.monthOneDay != -1) {
      monthOneDay = `${getNumberWithCommas(Number(data?.monthOneDay))}원(전일)`;
    }
    if (data?.monthDay != null && data?.monthDay != -1) {
      monthDay = `${getNumberWithCommas(Number(data?.monthDay))}원(주간)`;
    }
    if (data?.monthNight != null && data?.monthNight != -1) {
      monthNight = `${getNumberWithCommas(Number(data?.monthNight))}원(야간)`;
    }
    if (monthOneDay?.length > 0 && monthDay?.length > 0 && monthNight?.length > 0) {
      monthCharge = monthOneDay + '/ ' + monthDay + '/ ' + monthNight;
    } else if (monthOneDay?.length > 0 && monthDay?.length > 0) {
      monthCharge = monthOneDay + '/ ' + monthDay;
    } else if (monthOneDay?.length > 0 && monthNight?.length > 0) {
      monthCharge = monthOneDay + '/ ' + monthNight;
    } else if (monthDay?.length > 0 && monthNight?.length > 0) {
      monthCharge = monthDay + '/ ' + monthNight;
    } else if (monthOneDay?.length > 0) {
      monthCharge = monthOneDay;
    } else if (monthDay?.length > 0) {
      monthCharge = monthDay;
    } else if (monthNight?.length > 0) {
      monthCharge = monthNight;
    }
    if (monthCharge == '') {
      monthText += `• 월 정액: ${monthCharge}\n\n`;
    }

    let etc = '';
    if (data?.id == 57248) {
      etc += '단, 도매시장 부설주차장 : 1시간 무료\n\n';
    } else if (data?.agency === '청주시시설관리공단') {
      etc += '주차시간 10분 이하 : 무료\n\n';
    }

    let addressDesc = '';
    if (data?.addressDesc != null && data?.addressDesc?.length > 0) {
      addressDesc += `위치안내 : ${data?.addressDesc}`;
    }

    if (data?.ticketPartnerYN === IS_ACTIVE.YES) {
      let oneDayMaxAmt = '';

      if (data?.chargeOneDay == null || data?.chargeOneDay == -1) {
        oneDayMaxAmt = '-';
      } else if (data?.chargeOneDay == 0) {
        oneDayMaxAmt = '없음';
      } else {
        oneDayMaxAmt = `${getNumberWithCommas(Number(data?.chargeOneDay))}원`;
      }

      oneDayMaxAmt = `• 일최대요금 : ${oneDayMaxAmt}\n\n`;

      if (data?.etc != null) {
        etc += data?.etc;
      }

      return boxFee + first30 + oneDayMaxAmt + etc + addressDesc;
    }

    return boxFee + first30 + chargeOneDay + monthText + etc + addressDesc;
  };

  return data && !!getFee() ? (
    <View style={styles.container}>
      <CustomText string={getFee()} family={FONT_FAMILY.SEMI_BOLD} />
    </View>
  ) : (
    <></>
  );
});

export default ParkingFeeTab;

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
    backgroundColor: colors.card,
    borderRadius: 5,
  },
});
