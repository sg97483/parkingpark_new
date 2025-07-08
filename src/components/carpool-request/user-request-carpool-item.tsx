import {useNavigation} from '@react-navigation/native';
import React, {memo, useCallback, useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import Avatar from '~components/commons/avatar';
import InfoPriceRoute from '~components/commons/info-price-route';
import RouteBadge from '~components/commons/route-badge';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import Spinner from '~components/spinner';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {DriverRoadDayModel} from '~model/driver-model';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {
  useAddFavoritePassengerMutation,
  useGetFavoritePassengerListQuery,
  useRemoveFavoritePassengerMutation,
} from '~services/carpoolServices';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {getRouteStateValue} from '~utils/getRouteStateValue';

interface Props {
  item: DriverRoadDayModel;
}

const UserRequestCarpoolItem: React.FC<Props> = memo(props => {
  const {item} = props;

  const navigation = useNavigation<UseRootStackNavigation>();
  const {userID} = userHook();

  const [createFavoritePassenger] = useAddFavoritePassengerMutation();
  const [removeFavoritePassenger] = useRemoveFavoritePassengerMutation();

  const {data, refetch} = useGetFavoritePassengerListQuery(
    {
      memberId: userID as number,
    },
    {skip: !userID},
  );

  const isFavoritePassenger = useMemo(
    () => data?.find(it => it?.riderId === item?.c_memberId)?.favStatus === 'Y',
    [data, item?.memberId],
  );

  const handleViewCarpoolDetail = useCallback(() => {
    navigation.navigate(ROUTE_KEY.CarpoolRequestDetail, {item});
  }, [item]);

  const handleAddFavoritePassenger = useCallback(async () => {
    Spinner.show();
    if (isFavoritePassenger && item?.c_memberId) {
      removeFavoritePassenger({
        memberId: userID as number,
        riderId: item?.c_memberId as number,
      })
        .unwrap()
        .then(res => {
          if (res === '200') {
            refetch();
          }
          Spinner.hide();
        });
    } else {
      const body = {
        memberId: userID as number,
        riderId: item?.c_memberId as number,
      };
      createFavoritePassenger(body)
        .unwrap()
        .then(res => {
          if (res === '200') {
            refetch();
          }
          Spinner.hide();
        });
    }
  }, [item, isFavoritePassenger, refetch]);

  return (
    <Pressable onPress={handleViewCarpoolDetail} style={styles.containerStyle}>
      <View style={{gap: heightScale1(4)}}>
        <HStack style={styles.headerStyle}>
          <RouteBadge type={item?.carInOut === 'in' ? 'WAY_WORK' : 'WAY_HOME'} />
          <CustomText
            forDriveMe
            string={item?.selectDay}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.BODY}
            lineHeight={heightScale1(25)}
          />
          <CustomText
            forDriveMe
            string={getRouteStateValue(item?.state)}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_7}
            color={colors.heavyGray}
          />
        </HStack>
        <HStack style={styles.userInfoStyle}>
          <Avatar uri={item?.profileImageUrl} size={20} />

          <CustomText
            forDriveMe
            string={`${item?.nic ?? ''} 탑승객님`}
            family={FONT_FAMILY.MEDIUM}
            textStyle={{
              flexShrink: 1,
            }}
            numberOfLines={1}
          />

          {item?.authYN === 'Y' ? <Icons.VerificationMark /> : null}

          <CustomText
            forDriveMe
            string={`총 카풀횟수 ${item?.driverCnt}회`}
            size={FONT.CAPTION}
            color={colors.lineCancel}
            family={FONT_FAMILY.MEDIUM}
            numberOfLines={1}
          />

          <Pressable onPress={handleAddFavoritePassenger} style={styles.favoriteBtnStyle}>
            {isFavoritePassenger ? (
              <Icons.StarFill width={25} height={24} />
            ) : (
              <Icons.Star stroke={colors.menuTextColor} />
            )}
          </Pressable>
        </HStack>
      </View>

      <RoutePlanner
        timeStart={item?.startTime}
        timeArrive={item?.endTime}
        startAddress={item?.startPlace}
        arriveAddress={item?.endPlace}
      />

      <InfoPriceRoute price={item?.price} onPress={handleViewCarpoolDetail} />
    </Pressable>
  );
});

export default UserRequestCarpoolItem;

const styles = StyleSheet.create({
  containerStyle: {
    gap: PADDING1,
  },
  headerStyle: {
    gap: widthScale1(10),
  },
  userInfoStyle: {
    gap: widthScale1(6),
  },
  favoriteBtnStyle: {
    marginLeft: 'auto',
  },
});
