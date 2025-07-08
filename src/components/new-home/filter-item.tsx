import {StyleSheet, View, Platform} from 'react-native'; // 🚩 Platform import 추가
import React, {memo} from 'react';
import {PARKING_FILTER_TYPE} from '~constants/enum';
import CustomText from '~components/custom-text';
import {colors} from '~styles/colors';
import {PADDING} from '~constants/constant';
import {heightScale} from '~styles/scaling-utils';

interface Props {
  item: PARKING_FILTER_TYPE;
}

const FilterItem: React.FC<Props> = memo(props => {
  const {item} = props;

  const getFilterText = () => {
    switch (item) {
      case PARKING_FILTER_TYPE.ALLOWBOOKING:
        return '예약 가능';
      case PARKING_FILTER_TYPE.ALLOWBOOKINGPARTNER:
        return '제휴주차장';
      case PARKING_FILTER_TYPE.CARD:
        return '카드사 제휴 무료';
      case PARKING_FILTER_TYPE.CONNIGHT:
        return '연박권';
      case PARKING_FILTER_TYPE.DINNER:
        return '저녁권';
      case PARKING_FILTER_TYPE.ELEC:
        return '전기차 충전소';
      case PARKING_FILTER_TYPE.FREE:
        return '무료 주차장';
      case PARKING_FILTER_TYPE.GREENCAR:
        return '그린카 쉐어링';
      case PARKING_FILTER_TYPE.IFFREE:
        return '조건부 무료';
      case PARKING_FILTER_TYPE.MONTH:
        return '월주차권';
      case PARKING_FILTER_TYPE.NIGHT:
        return '심야권';
      case PARKING_FILTER_TYPE.PRIVATE:
        return '민영 주차장';
      case PARKING_FILTER_TYPE.PUBLIC:
        return '공영 주차장';
      case PARKING_FILTER_TYPE.SHARECAR:
        return '파킹박 공유 주차';
      case PARKING_FILTER_TYPE.WEEKDAY:
        return '평일 1일권';
      case PARKING_FILTER_TYPE.WEEKDAYTIME:
        return '평일 시간권';
      case PARKING_FILTER_TYPE.WEEKEND:
        return '주말 1일권';
      case PARKING_FILTER_TYPE.WEEKENDTIME:
        return '주말 시간권';
      default:
        return 'parkingFilter';
    }
  };

  // 🚩 [수정] 불필요한 View를 제거하고, 통합된 스타일(styles.container)을 적용합니다.
  return (
    <View style={styles.container}>
      <CustomText string={getFilterText()} />
    </View>
  );
});

export default FilterItem;

const styles = StyleSheet.create({
  // 🚩 [수정] shadowContainer와 contentContainer를 합친 새로운 스타일
  container: {
    // 내용 스타일
    backgroundColor: colors.white,
    paddingHorizontal: PADDING / 2,
    minHeight: heightScale(35),
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    // 그림자 스타일
    margin: PADDING / 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
        // 안드로이드에서도 둥근 모서리가 잘 보이도록 테두리 추가
        borderColor: '#f0f0f0',
        borderWidth: 1,
      },
    }),
  },
});
