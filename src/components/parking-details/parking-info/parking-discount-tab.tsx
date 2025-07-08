import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomText from '~components/custom-text';
import {PADDING} from '~constants/constant';
import {IS_ACTIVE} from '~constants/enum';
import {ParkingProps} from '~constants/types';
import {colors} from '~styles/colors';

interface Props {
  data: ParkingProps;
}

const ParkingDiscountTab: React.FC<Props> = memo(props => {
  const {data} = props;

  const getFreeDiscount = () => {
    let freeDiscount = '';

    if (data?.others != null && data?.others.length != 0) {
      freeDiscount += `${data?.others}\n\n`;
    }

    if (data?.description != null && data?.description.length != 0) {
      freeDiscount += `${data?.description}\n\n`;
    }

    return freeDiscount;
  };

  const getBoxDiscount = () => {
    let boxDiscount = '';

    if (data?.free30YN != null && data?.free30YN === IS_ACTIVE.YES) {
      boxDiscount += '최초 30분 무료\n\n';
    }
    if (data?.free7AfterYN != null && data?.free7AfterYN === IS_ACTIVE.YES) {
      boxDiscount += '평일 저녁 근무시간 이후 무료\n\n';
    }
    if (data?.satFreeYN != null && data?.satFreeYN === IS_ACTIVE.YES) {
      boxDiscount += '토요일 무료\n\n';
    }
    if (data?.sunFreeYN != null && data?.sunFreeYN === IS_ACTIVE.YES) {
      boxDiscount += '일요일 무료\n\n';
    }
    if (data?.holidayFreeYN != null && data?.holidayFreeYN === IS_ACTIVE.YES) {
      boxDiscount += '공휴일 무료\n\n';
    }

    if (data?.others != null && data?.others.length != 0) {
      boxDiscount += `${data?.others}\n\n`;
    }

    return boxDiscount;
  };

  const getMarketDiscount = () => {
    let marketDiscount = '';
    if (data?.others != null && data?.others.length > 0) {
      marketDiscount += `${data?.others}\n\n`;
    } else {
      marketDiscount +=
        "일정한 금액의 상품을 구매하셔야 '무료주차' 이용이 가능합니다.\n\n'고객센터'방문을 통해서, 무료주차권을 받으실 수 있습니다.\n\n";
      if (data?.category === '조건부무료2') {
        marketDiscount +=
          '1시간 이내 : 무료 및 1만원 이상 구매해야 가능 (해당 점포에 따라 다르게 운영이 될 수 있음)\n2시간 : 3만원 이상 구매고객\n3시간 : 5만원 이상 (서울 및 주요도심지역에서는 7만원 이상)';
      }
      if (data?.category === '조건부무료4') {
        marketDiscount +=
          '1시간 : 3만원 이상 구매고객\n2시간 : 5만원 이상 구매고객\n3시간 : 10만원 이상 구매고객에 한하여 가능';
      }
    }

    return marketDiscount;
  };

  const getCoffeeDiscount = () => {
    let coffeeDiscount = '';

    if (data?.category === '조건부무료1') {
      if (data?.menuAmericano != null && data?.menuAmericano != -1) {
        coffeeDiscount += `아메리카노: ${data?.menuAmericano}\n\n`;
      }
      if (data?.menuCafemoca != null && data?.menuCafemoca != -1) {
        coffeeDiscount += `카페모카: ${data?.menuCafemoca}\n\n`;
      }
      if (data?.menuCaferatte != null && data?.menuCaferatte != -1) {
        coffeeDiscount += `카페라떼: ${data?.menuCaferatte}\n\n`;
      }
      if (data?.menuCafuchino != null && data?.menuCafuchino != -1) {
        coffeeDiscount += `카푸치노: ${data?.menuCafuchino}\n\n`;
      }
      if (data?.menuEspresso != null && data?.menuEspresso != -1) {
        coffeeDiscount += `에스프레소: ${data?.menuEspresso}\n\n`;
      }
    } else if (data?.category === '조건부무료3') {
      if (data?.menu1n != null && data?.menu1n.length > 0) {
        coffeeDiscount += `${data?.menu1n}: ${data?.menu1v}\n\n`;
      }
      if (data?.menu2n != null && data?.menu2n.length > 0) {
        coffeeDiscount += `${data?.menu2n}: ${data?.menu2v}\n\n`;
      }
      if (data?.menu3n != null && data?.menu3n.length > 0) {
        coffeeDiscount += `${data?.menu3n}: ${data?.menu3v}\n\n`;
      }
      if (data?.menu4n != null && data?.menu4n.length > 0) {
        coffeeDiscount += `${data?.menu4n}: ${data?.menu4v}\n\n`;
      }
      if (data?.menu5n != null && data?.menu5n.length > 0) {
        coffeeDiscount += `${data?.menu5n}: ${data?.menu5v}\n\n`;
      }
    }

    return coffeeDiscount;
  };

  const getGreenZoneDiscount = () => {
    const greenZoneDiscount = `그린존 명칭: ${data?.addressDesc}\n\n상세 위치: " ${data?.others}\n\n주차요금 : 추가 반영 예정`;
    return greenZoneDiscount;
  };

  const getContent = () => {
    if (data?.category === '무료') {
      return getFreeDiscount();
    } else if (data?.category?.includes('공영')) {
      return getBoxDiscount();
    } else if (data?.category === '민영') {
      return getBoxDiscount();
    } else if (data?.category === '조건부무료2' || data?.category === '조건부무료4') {
      return getMarketDiscount();
    } else if (data?.category === '조건부무료1' || data?.category === '조건부무료3') {
      return getCoffeeDiscount();
    } else if (data?.category === '카셰어링 그린카') {
      return getGreenZoneDiscount();
    }
    return '';
  };

  return data && !!getContent() ? (
    <View style={styles.container}>
      <CustomText string={getContent()} />
    </View>
  ) : (
    <></>
  );
});

export default ParkingDiscountTab;

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
    backgroundColor: colors.card,
    borderRadius: 5,
  },
});
