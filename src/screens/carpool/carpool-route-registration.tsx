import {View} from 'react-native';
import React, {useCallback, useRef} from 'react';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {RecommendDriverProps} from '~constants/types';
import {dayjs} from '~utils/dayjsUtil';
import {RootStackScreenProps} from '~navigators/stack';
import {FlashList} from '@shopify/flash-list';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import ModalConfirm, {ModalConfirmRefs} from '~components/modal-confirm';
import {ROUTE_KEY} from '~navigators/router';
import ItemDriverReservation from '~components/cancel-reservation/item-driver-reservation';
import CustomButton from '~components/commons/custom-button';
import {PADDING1} from '~constants/constant';

const data: RecommendDriverProps[] = [
  {
    id: '2',
    arriveAddress: '서울대 입구역 1번출구',
    carpoolRequestAmount: 10000,
    date: dayjs().toString(),
    driverAvatar: 'https://i.pravatar.cc/300',
    driverName: '닉네임',
    isVerify: true,
    numOfCarpool: 3,
    startAddress: '성수역 2번 출구',
    timeArrive: '08:08',
    timeStart: '07:30',
    isParking: false,
  },
];

export interface TicketPriceModel {
  title: string;
  ticket: string;
  price: string;
}

const ticket: TicketPriceModel = {
  title: '하이파킹 D타워 서울포레스트',
  ticket: '평일 당일권',
  price: '25,000원',
};

const CarPoolRouteRegistration = (props: RootStackScreenProps<'CarPoolRouteRegistration'>) => {
  const {navigation} = props;

  const renderItems = useCallback(() => {
    return <ItemDriverReservation />;
  }, [data]);

  const modalRef = useRef<ModalConfirmRefs>(null);

  return (
    <FixedContainer edges={['top', 'bottom']}>
      <CustomHeader text="출근길 운행등록" />
      <View style={{flex: 1}}>
        <FlashList
          renderItem={renderItems}
          data={Array.from({length: 1})}
          keyExtractor={(_, index) => index.toString()}
          estimatedItemSize={200}
        />
      </View>

      <PaddingHorizontalWrapper containerStyles={{marginBottom: PADDING1 / 2}}>
        <CustomButton
          text="운행 등록하기"
          onPress={() => {
            // modalRef.current?.show()
            navigation.navigate(ROUTE_KEY.GeneralCarPoolRouteRegistration);
          }}
          buttonHeight={58}
        />
      </PaddingHorizontalWrapper>
      <ModalConfirm
        ref={modalRef}
        onConfirm={() => navigation.navigate(ROUTE_KEY.ParkingParkHome)}
        title={'파킹박 제휴 주차장을\n목적지로 등록하셨네요!\n주차장을 확인하시겠습니까?'}
        content={'파킹박을 통해 평균 60% 할인된 금액으로\n주차권을 구매하실수 있습니다.'}
        textConfirmButton={'주차장 보기'}
        textCancelButton={'닫기'}
        ticketBox={ticket}
      />
    </FixedContainer>
  );
};

export default CarPoolRouteRegistration;
