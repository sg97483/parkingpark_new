import moment from 'moment';
import React, {memo, useEffect, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import InfoPriceRoute from '~components/commons/info-price-route';
import RouteBadge from '~components/commons/route-badge';
import CustomHeader from '~components/custom-header';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import LoadingComponent from '~components/loading-component';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import {PADDING1} from '~constants/constant';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetMyRiderRoadQuery} from '~services/carpoolServices';
import {useGetDrivingDirectionQuery} from '~services/naverMapServices';
import {useLazyReadMyDriverQuery} from '~services/userServices';

const RepresentativeRouteOfPassenger = memo(
  (props: RootStackScreenProps<'RepresentativeRouteOfPassenger'>) => {
    const {route} = props;
    const {passengerID} = route?.params;

    const [cMemberID, setCMemberID] = useState<number | null>(null);

    const [readMyDriver, {isLoading}] = useLazyReadMyDriverQuery();

    useEffect(() => {
      readMyDriver({
        memberId: passengerID.toString(),
      })
        .unwrap()
        .then(res => {
          if (res?.c_memberId) {
            setCMemberID(res?.c_memberId);
          }
        });
    }, []);

    const {data, isFetching} = useGetMyRiderRoadQuery(
      {
        memberId: passengerID,
        id: cMemberID as number,
      },
      {skip: !cMemberID},
    );

    const {data: directionIn} = useGetDrivingDirectionQuery(
      {
        start: `${data?.splngIn},${data?.splatIn}`,
        end: `${data?.eplngIn},${data?.eplatIn}`,
      },
      {skip: !data},
    );

    const {data: directionOut} = useGetDrivingDirectionQuery(
      {
        start: `${data?.splngOut},${data?.splatOut}`,
        end: `${data?.eplngOut},${data?.eplatOut}`,
      },
      {skip: !data},
    );

    return (
      <FixedContainer>
        <CustomHeader text="기본 등록경로" />

        {isLoading || isFetching ? (
          <LoadingComponent />
        ) : (
          <ScrollView
            contentContainerStyle={styles.containerStyle}
            showsVerticalScrollIndicator={false}>
            {/* Way to work */}
            <PaddingHorizontalWrapper containerStyles={{gap: PADDING1}} forDriveMe>
              <HStack>
                <RouteBadge />
              </HStack>
              <RoutePlanner
                startAddress={data?.startPlaceIn ?? ''}
                arriveAddress={data?.endPlaceIn ?? ''}
                timeStart={data?.startTimeIn ?? ''}
                timeArrive={moment(data?.startTimeIn, 'HH:mm')
                  .add(directionIn?.duration, 'minutes')
                  .format('HH:mm')}
              />
              <InfoPriceRoute price={data?.priceIn ?? ''} hideChevron />
            </PaddingHorizontalWrapper>

            <Divider insetsVertical={30} />

            {/* Way to home */}
            <PaddingHorizontalWrapper containerStyles={{gap: PADDING1}} forDriveMe>
              <HStack>
                <RouteBadge type="WAY_HOME" />
              </HStack>
              <RoutePlanner
                startAddress={data?.startPlaceOut ?? ''}
                arriveAddress={data?.endPlaceOut ?? ''}
                timeStart={data?.startTimeOut ?? ''}
                timeArrive={moment(data?.startTimeOut, 'HH:mm')
                  .add(directionOut?.duration, 'minutes')
                  .format('HH:mm')}
              />
              <InfoPriceRoute price={data?.priceIn ?? ''} hideChevron />
            </PaddingHorizontalWrapper>
          </ScrollView>
        )}
      </FixedContainer>
    );
  },
);
export default RepresentativeRouteOfPassenger;

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: PADDING1,
  },
});
