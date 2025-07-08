import React, {memo, useState} from 'react';
import {Platform, StyleSheet, UIManager, View} from 'react-native';
import ParkingInfoTabItem from '~components/parking-details/parking-info-tab-item';
import {PADDING, PADDING_HEIGHT} from '~constants/constant';
import {ParkingProps, TicketProps} from '~constants/types';
import {useTicketInfoQuery} from '~services/parkingServices';
import {heightScale} from '~styles/scaling-utils';
import OperatingTimeTab from './parking-info/operating-time-tab';
import ParkingDiscountTab from './parking-info/parking-discount-tab';
import ParkingFeeTab from './parking-info/parking-fee-tab';
import ParkingPayInfoTab from './parking-info/parking-pay-info-tab';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface Props {
  data: ParkingProps;
}

const ParkingInfoTab: React.FC<Props> = memo(props => {
  const {data} = props;

  const parkingID = data?.id;

  const {data: TICKET_INFO_LIST} = useTicketInfoQuery(
    {
      id: parkingID,
    },
    {skip: !parkingID},
  );

  const [isShowFee, setIsShowFee] = useState<boolean>(false);
  const [isShowTime, setIsShowTime] = useState<boolean>(false);
  const [isShowDiscount, setIsShowDiscount] = useState<boolean>(false);
  const [isShowPayInfo, setIsShowPayInfo] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <ParkingInfoTabItem
        title="1. 주차요금"
        isSelected={isShowFee}
        onPress={() => setIsShowFee(!isShowFee)}
      />
      {isShowFee ? <ParkingFeeTab data={data} /> : null}

      <ParkingInfoTabItem
        title="2. 운영시간"
        isSelected={isShowTime}
        onPress={() => setIsShowTime(!isShowTime)}
      />
      {isShowTime ? <OperatingTimeTab data={data} /> : null}

      <ParkingInfoTabItem
        title="3. 할인정보"
        isSelected={isShowDiscount}
        onPress={() => setIsShowDiscount(!isShowDiscount)}
      />
      {isShowDiscount ? <ParkingDiscountTab data={data} /> : null}

      <ParkingInfoTabItem
        title="4. 주차권정보"
        disabled={data?.category !== '민영'}
        isSelected={isShowPayInfo}
        onPress={() => setIsShowPayInfo(!isShowPayInfo)}
      />
      {isShowPayInfo ? <ParkingPayInfoTab data={TICKET_INFO_LIST as TicketProps[]} /> : null}
    </View>
  );
});

export default ParkingInfoTab;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: PADDING / 2,
    marginTop: PADDING_HEIGHT / 2,
  },
  divider: {
    height: heightScale(2),
    borderRadius: 999,
    marginTop: heightScale(5),
  },
  tabViewWrapper: {},
});
