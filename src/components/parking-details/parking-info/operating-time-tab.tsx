import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomText from '~components/custom-text';
import {PADDING} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {ParkingProps} from '~constants/types';
import {colors} from '~styles/colors';
import {hourIndexToTime} from '~utils/hourUtils';

interface Props {
  data: ParkingProps;
}

enum TYPE {
  PUBLIC = 1001,
  PRIVATE = 1002,
}

const OperatingTimeTab: React.FC<Props> = memo(props => {
  const {data} = props;

  const getBoxTime = () => {
    let weekTime = '• 평일: ';
    let satTime = '• 토요일: ';
    let sunTime = '• 일요일: ';

    if (data?.weekStart != null && data?.weekStart != -1) {
      weekTime += `${hourIndexToTime(data?.weekStart)} ~ ${hourIndexToTime(data?.weekEnd)}\n\n`;
    } else {
      weekTime += '-' + '\n\n';
    }

    if (data?.saturStart != null && data?.saturStart != -1) {
      satTime += `${hourIndexToTime(data?.saturStart)} ~ ${hourIndexToTime(data?.saturEnd)}\n\n`;
    } else {
      satTime += '-' + '\n\n';
    }

    if (
      data?.sunStart != null &&
      data?.sunStart != -1 &&
      data?.sunEnd != null &&
      data?.sunEnd != -1
    ) {
      sunTime += `${hourIndexToTime(data?.sunStart)} ~ ${hourIndexToTime(data?.sunEnd)}\n\n`;
    } else {
      sunTime += '-' + '\n\n';
    }

    return weekTime + satTime + sunTime;
  };

  const getAddTime = (value: TYPE) => {
    let holidayTime = '• 휴무일: ';
    let agency = '\n• 운영주체: ';
    let etc = '';

    if (data?.holiday == null || data?.holiday?.length == 0) {
      holidayTime += '-\n\n';
    } else {
      holidayTime += `${data?.holiday}\n\n`;
    }

    if (data?.agency == null || data?.agency?.length == 0) {
      agency += '-\n\n';
    } else {
      agency += `${data?.agency}\n\n`;
    }

    let availablePlace = '• 주차면수: ';
    if (data?.availablePlace == null || data?.availablePlace == -1 || data?.availablePlace == 0) {
      availablePlace += '-\n\n';
    } else {
      availablePlace += `${data?.availablePlace}대\n\n`;
    }

    if (value == TYPE.PUBLIC) {
      etc =
        '동절기, 하절기에 따라 운영시간이 1시간씩 차이가 날 수가 있습니다. 이용에 참고 부탁드리겠습니다.' +
        '\n\n';
    }

    return holidayTime + agency + availablePlace + etc;
  };

  const getMartTime = () => {
    let weekTime = '• 평일: ';
    let holidayTime = '• 휴무일: ';

    if (
      data?.businesStart != null &&
      data?.businesStart != -1 &&
      data?.businesEnd != null &&
      data?.businesEnd != -1
    ) {
      weekTime += `${hourIndexToTime(data?.businesStart)} ~ ${hourIndexToTime(
        data?.businesEnd,
      )}\n\n`;
    } else {
      weekTime += '-\n\n';
    }

    if (data?.holiday == null || data?.holiday?.length == 0) {
      holidayTime += '-\n\n';
    } else {
      holidayTime += `${data?.holiday}\n\n`;
    }

    return weekTime + holidayTime;
  };

  const getGreenZoneTime = () => {
    return '• 그린존 운영시간 : 평일 24시간, 토요일/일요일 24시간';
  };

  const getContent = () => {
    if (data?.category === '무료') {
      return getBoxTime();
    } else if (data?.category?.includes('공영')) {
      return getBoxTime() + getAddTime(TYPE.PUBLIC);
    } else if (data?.category === '민영') {
      return getBoxTime() + getAddTime(TYPE.PRIVATE);
    } else if (data?.category === '조건부무료2' || data?.category === '조건부무료4') {
      return getMartTime();
    } else if (data?.category === '조건부무료1' || data?.category === '조건부무료3') {
      return getBoxTime();
    } else if (data?.category === '카셰어링 그린카') {
      return getGreenZoneTime();
    }
    return '';
  };

  return data && !!getContent() ? (
    <View style={styles.container}>
      <CustomText string={getContent()} family={FONT_FAMILY.SEMI_BOLD} />
    </View>
  ) : (
    <></>
  );
});

export default OperatingTimeTab;

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
    backgroundColor: colors.card,
    borderRadius: 5,
  },
});
