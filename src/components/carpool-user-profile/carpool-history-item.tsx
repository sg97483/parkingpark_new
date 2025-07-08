import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {memo, useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import InfoPriceRoute from '~components/commons/info-price-route';
import RouteBadge from '~components/commons/route-badge';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {DriverRoadDayModel} from '~model/driver-model';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useGetDrivingDirectionQuery} from '~services/naverMapServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {getRouteStateValue} from '~utils/getRouteStateValue';

interface Props {
  item: DriverRoadDayModel;
  hidePriceSection?: boolean;
}

const CarpoolHistoryItem: React.FC<Props> = memo(props => {
  const {item, hidePriceSection} = props;

  const navigation = useNavigation<UseRootStackNavigation>();

  const {data: direction} = useGetDrivingDirectionQuery({
    start: `${item?.splng},${item?.splat}`,
    end: `${item?.eplng},${item?.eplat}`,
  });

  const timeEnd = useMemo((): string => {
    return (
      moment(item?.startTime, 'HH:mm').add(direction?.duration, 'minutes').format('HH:mm') ?? ''
    );
  }, [direction?.duration, item]);

  return (
    <Pressable>
      <PaddingHorizontalWrapper containerStyles={styles.containerStyle} forDriveMe>
        <View style={{gap: heightScale1(4)}}>
          <HStack style={{gap: widthScale1(10)}}>
            <RouteBadge type={item?.carInOut === 'in' ? 'WAY_WORK' : 'WAY_HOME'} />

            <CustomText
              string={`${getRouteStateValue(item?.rStatusCheck ?? '')}`}
              color={colors.heavyGray}
              family={FONT_FAMILY.SEMI_BOLD}
              forDriveMe
            />
          </HStack>

          <CustomText
            forDriveMe
            size={FONT.BODY}
            family={FONT_FAMILY.SEMI_BOLD}
            string={item?.selectDay}
          />
        </View>
        <RoutePlanner
          arriveAddress={item?.endPlace}
          startAddress={item?.startPlace}
          stopOverAddress={item?.stopOverPlace}
          timeStart={item?.startTime}
          timeArrive={timeEnd}
        />

        {hidePriceSection ? null : (
          <InfoPriceRoute
            price={item?.price ?? ''}
            soPrice={item?.stopOverPlace && item?.soPrice ? item?.soPrice : ''}
            onPress={() => {
              navigation.navigate(ROUTE_KEY.RouteRequestRegistrationDetail, {
                routeInfo: item,
              });
            }}
          />
        )}
      </PaddingHorizontalWrapper>

      <Divider style={styles.dividerStyle} />
    </Pressable>
  );
});

export default CarpoolHistoryItem;

const styles = StyleSheet.create({
  dividerStyle: {
    marginVertical: heightScale1(30),
  },
  containerStyle: {
    gap: PADDING1,
  },
  reservationTypeStyle: {
    minHeight: heightScale1(27),
    minWidth: widthScale1(48),
    paddingHorizontal: widthScale1(8),
    borderRadius: scale1(4),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: widthScale1(10),
    marginBottom: heightScale1(4),
  },
  priceStyle: {
    gap: widthScale1(6),
    justifyContent: 'flex-end',
  },
});
