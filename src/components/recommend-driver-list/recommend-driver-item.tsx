import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {memo, useCallback, useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {Icons} from '~/assets/svgs';
import Avatar from '~components/commons/avatar';
import InfoPriceRoute from '~components/commons/info-price-route';
import RouteBadge from '~components/commons/route-badge';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1, WIDTH} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {DriverRoadDayModel} from '~model/driver-model';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {
  useAddFavoriteDriverMutation,
  useGetFavoriteDriverListQuery,
  useRemoveFavoriteDriverMutation,
} from '~services/carpoolServices';
import {useGetDrivingDirectionQuery} from '~services/naverMapServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {getRouteStateValue} from '~utils/getRouteStateValue';
import RoutePlanner from './route-planner';

interface Props {
  item: DriverRoadDayModel;
}

const RecommendDriverItem: React.FC<Props> = memo(props => {
  const {item} = props;
  const driverID = item?.c_memberId;

  const navigation: UseRootStackNavigation = useNavigation();
  const {userID} = userHook();

  const {data: listFavoriteDriver, refetch} = useGetFavoriteDriverListQuery({
    memberId: userID as number,
  });
  const [addFavoriteDriver] = useAddFavoriteDriverMutation();
  const [removeFavoriteDriver] = useRemoveFavoriteDriverMutation();
  const {data: direction} = useGetDrivingDirectionQuery({
    start: `${item?.splng},${item?.splat}`,
    waypoints: item?.soplat ? `${item?.soplng},${item?.soplat}` : '',
    end: `${item?.eplng},${item?.eplat}`,
  });

  const isHaveStopOverPlace = useMemo(
    (): boolean =>
      item?.stopOverPlace && item?.soplat && item?.soplng && item?.soPrice && item?.soPrice !== '0'
        ? true
        : false,
    [item],
  );

  const isFavoriteDriver = useMemo(() => {
    return listFavoriteDriver?.find(item => item?.driverId === driverID)?.favStatus === 'Y';
  }, [listFavoriteDriver, driverID]);

  const handleFavoriteDriver = useCallback(() => {
    if (isFavoriteDriver) {
      removeFavoriteDriver({
        driverId: driverID,
        memberId: userID as number,
      })
        .unwrap()
        .then(res => {
          if (res !== '200') {
            showMessage({
              message: strings.general_text.please_try_again,
            });
            return;
          }
          refetch();
        });
    } else {
      addFavoriteDriver({
        driverId: driverID,
        memberId: userID as number,
      })
        .unwrap()
        .then(res => {
          if (res !== '200') {
            showMessage({
              message: strings.general_text.please_try_again,
            });
            return;
          }
          refetch();
        });
    }
  }, [isFavoriteDriver, refetch, addFavoriteDriver, removeFavoriteDriver, driverID, userID]);

  return (
    <Pressable
      onPress={() => {
        navigation.navigate(ROUTE_KEY.RouteRequestRegistrationDetail, {
          routeInfo: item,
        });
      }}
      style={styles.containerStyle}>
      <HStack style={{gap: widthScale1(10)}}>
        <RouteBadge type={item?.carInOut === 'in' ? 'WAY_WORK' : 'WAY_HOME'} />

        {item?.selectDay ? (
          <CustomText
            forDriveMe
            string={item?.selectDay}
            size={FONT.BODY}
            family={FONT_FAMILY.SEMI_BOLD}
            numberOfLines={1}
            textStyle={{flexShrink: 1}}
          />
        ) : null}

        <CustomText
          forDriveMe
          string={getRouteStateValue(item?.state ?? '')}
          family={FONT_FAMILY.SEMI_BOLD}
          color={item?.selectDay ? colors.heavyGray : colors.lineInput}
          textStyle={{flexShrink: 1}}
          numberOfLines={1}
        />
      </HStack>

      <View style={styles.driverInfoWrapperStyle}>
        <HStack style={{gap: widthScale1(6)}}>
          <Avatar uri={item?.profileImageUrl} size={22} />

          <CustomText
            textStyle={{flexShrink: 1}}
            forDriveMe
            string={`${item?.nic} 드라이버님`}
            family={FONT_FAMILY.MEDIUM}
            numberOfLines={1}
          />

          <CustomText
            textStyle={{flexShrink: 1}}
            forDriveMe
            string={`총 카풀횟수 ${item?.driverCnt ?? 0}회`}
            family={FONT_FAMILY.MEDIUM}
            size={FONT.CAPTION}
            numberOfLines={1}
            color={colors.lineCancel}
          />

          {item?.carInOut === 'in' ? (
            <Pressable onPress={handleFavoriteDriver} style={styles.favoriteStyle} hitSlop={40}>
              {isFavoriteDriver ? <Icons.StarFill width={25} height={24} /> : <Icons.Star />}
            </Pressable>
          ) : null}
        </HStack>
      </View>

      <RoutePlanner
        timeStart={item?.startTime}
        timeArrive={moment(item?.startTime, 'HH:mm')
          .add(direction?.duration ?? 0, 'minutes')
          .format('HH:mm')}
        startAddress={item?.startPlace}
        arriveAddress={item?.endPlace}
        stopOverAddress={isHaveStopOverPlace ? item?.stopOverPlace : ''}
      />

      <View style={styles.priceWrapperStyle}>
        <View
          style={{
            alignItems: 'flex-end',
          }}>
          <InfoPriceRoute
            onPress={() => {
              navigation.navigate(ROUTE_KEY.RouteRequestRegistrationDetail, {
                routeInfo: item,
              });
            }}
            price={item?.price}
            soPrice={isHaveStopOverPlace ? item?.soPrice : ''}
          />
        </View>
      </View>
    </Pressable>
  );
});

export default RecommendDriverItem;

const styles = StyleSheet.create({
  containerStyle: {
    width: WIDTH - PADDING1 - PADDING1,
    backgroundColor: colors.white,
    marginBottom: PADDING1,
    padding: widthScale1(16),
    borderRadius: scale1(8),
  },
  driverInfoWrapperStyle: {
    marginTop: heightScale1(4),
    marginBottom: heightScale1(16),
  },
  avatarStyle: {
    width: widthScale1(22),
    height: widthScale1(22),
    borderRadius: 999,
    borderCurve: 'continuous',
  },
  priceWrapperStyle: {
    marginTop: heightScale1(16),
    alignItems: 'flex-end',
  },
  favoriteStyle: {
    marginLeft: 'auto',
  },
});
