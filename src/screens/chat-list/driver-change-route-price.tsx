import {BottomSheetModal} from '@gorhom/bottom-sheet';
import React, {memo, useCallback, useRef, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import CustomButton from '~components/commons/custom-button';
import SelectBox from '~components/commons/select-box';
import CustomHeader from '~components/custom-header';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import BottomSheetChooseDesiredAmount from '~components/way-to-work-registration/bottom-sheet-choose-desired-amount';
import {PADDING1} from '~constants/constant';
import {RootStackScreenProps} from '~navigators/stack';
import {useDrivingRoadPriceUpdateMutation} from '~services/driverServices';
import {useGetDrivingDirectionQuery} from '~services/naverMapServices';
import {heightScale1} from '~styles/scaling-utils';
import {getNumberWithCommas} from '~utils/numberUtils';

const DriverChangeRoutePrice = memo((props: RootStackScreenProps<'DriverChangeRoutePrice'>) => {
  const {navigation, route} = props;
  const {onChangeNewPrice, routeRequestInfo, tempRoute, endTime, roadInfoID} = route.params;
  const chooseDesiredAmountRef = useRef<BottomSheetModal>(null);

  const [drivingRoadPriceUpdate, {isLoading}] = useDrivingRoadPriceUpdateMutation();

  const [newPrice, setNewPrice] = useState<number>();

  const {data: direction} = useGetDrivingDirectionQuery({
    start: `${routeRequestInfo?.splng ?? tempRoute?.splng},${
      routeRequestInfo?.splat ?? tempRoute?.splat
    }`,
    end:
      routeRequestInfo?.priceSelect === 'E'
        ? `${routeRequestInfo?.eplng ?? tempRoute?.eplng},${
            routeRequestInfo?.eplat ?? tempRoute?.eplat
          }`
        : `${routeRequestInfo?.soplng ?? tempRoute?.soplng},${
            routeRequestInfo?.soplat ?? tempRoute?.soplat
          }`,
    waypoints: '',
  });

  const handleUpdateNewPrice = useCallback(() => {
    if (newPrice) {
      drivingRoadPriceUpdate(
        routeRequestInfo?.priceSelect === 'E'
          ? {
              id: roadInfoID,
              price: newPrice,
            }
          : {id: roadInfoID, soPrice: newPrice},
      );
      navigation.goBack();
      onChangeNewPrice && onChangeNewPrice(newPrice);
    } else {
      navigation.goBack();
    }
  }, [newPrice, routeRequestInfo?.priceSelect, roadInfoID]);

  return (
    <FixedContainer>
      <CustomHeader text="출근길 등록" />

      <ScrollView
        contentContainerStyle={styles.containerStyle}
        showsVerticalScrollIndicator={false}>
        <PaddingHorizontalWrapper forDriveMe>
          <RoutePlanner
            timeStart={routeRequestInfo?.startTime ?? tempRoute?.startTime ?? ''}
            startAddress={routeRequestInfo?.startPlace ?? tempRoute?.startPlace ?? ''}
            arriveAddress={
              routeRequestInfo?.priceSelect === 'E'
                ? (routeRequestInfo?.endPlace ?? tempRoute?.endPlace ?? '')
                : (routeRequestInfo?.stopOverPlace ?? tempRoute?.stopOverPlace ?? '')
            }
            timeArrive={endTime ?? ''}
          />
        </PaddingHorizontalWrapper>

        <Divider style={{marginTop: PADDING1, marginBottom: heightScale1(30)}} />

        <PaddingHorizontalWrapper forDriveMe containerStyles={{gap: heightScale1(30)}}>
          <SelectBox
            title="출발시간"
            subTitle="여객운수법현행법상 오전 7시-9시까지 카풀이 가능합니다."
            value={routeRequestInfo?.startTime ?? tempRoute?.startTime ?? ''}
            disabled
          />

          <SelectBox
            title="희망금액"
            value={
              newPrice
                ? getNumberWithCommas(newPrice)
                : routeRequestInfo?.priceSelect === 'E'
                  ? getNumberWithCommas(routeRequestInfo?.price ?? tempRoute?.price ?? '')
                  : getNumberWithCommas(routeRequestInfo?.soPrice ?? tempRoute?.soPrice ?? '')
            }
            onPress={() => chooseDesiredAmountRef?.current?.present(0)}
          />
        </PaddingHorizontalWrapper>
      </ScrollView>

      <PaddingHorizontalWrapper forDriveMe>
        <CustomButton
          buttonStyle={{marginBottom: heightScale1(PADDING1 / 2), marginTop: heightScale1(10)}}
          text="등록하기"
          buttonHeight={58}
          onPress={handleUpdateNewPrice}
          isLoading={isLoading}
        />
      </PaddingHorizontalWrapper>

      <BottomSheetChooseDesiredAmount
        onSelectPrice={(price?: string) => {
          if (price) {
            setNewPrice(Number(price));
          } else {
            setNewPrice(Number(direction?.taxiFare) < 5000 ? 5000 : direction?.taxiFare);
          }
        }}
        ref={chooseDesiredAmountRef}
      />
    </FixedContainer>
  );
});
export default DriverChangeRoutePrice;

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: PADDING1,
  },
});
