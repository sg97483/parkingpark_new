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
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {useCheckRoute} from '~hooks/carpoolHook';
import {userHook} from '~hooks/userHook';
import {DriverRoadDayModel} from '~model/driver-model';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {
  useAddFavoritePassengerMutation,
  useGetFavoritePassengerListQuery,
  useRemoveFavoritePassengerMutation,
  useGetMyDriverRoadQuery,
  useGetMyRiderRoadQuery,
} from '~services/carpoolServices';
import {useCheckAuthDriverAndPassengerMutation} from '~services/userServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {getRouteStateValue} from '~utils/getRouteStateValue';

interface Props {
  item: DriverRoadDayModel;
}

const UserRequestCarpoolParkItem: React.FC<Props> = memo(props => {
  const {item} = props;

  const navigation = useNavigation<UseRootStackNavigation>();
  const {userID, CMemberID} = userHook();

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

  const {data: driverDataRoad} = useGetMyDriverRoadQuery({
    memberId: userID as number,
    id: CMemberID as number,
  });

  const {data: passengerDataRoad} = useGetMyRiderRoadQuery({
    memberId: userID as number,
    id: CMemberID as number,
  });

  const userData = useAppSelector(state => state?.userReducer?.user);

  const [checkAuthDriverAndPassenger] = useCheckAuthDriverAndPassengerMutation();

  const {
    carpoolMode,
    driverRoad,
    isAgreeTerms,
    isRegisterRoute,
    isRegisteredBusinessCard,
    userToken,
  } = useCheckRoute();

  const isFirstTimeApproval = useAppSelector(state => state?.carpoolReducer?.isFirstTimeApproval);

  const isModeSelect = useMemo(() => {
    return (!passengerDataRoad?.startPlaceOut &&
      !passengerDataRoad?.startPlaceIn &&
      !passengerDataRoad?.endPlaceOut &&
      !passengerDataRoad?.endPlaceIn) ||
      (!driverDataRoad?.startPlaceIn &&
        !driverDataRoad?.startPlaceOut &&
        !driverDataRoad?.endPlaceIn &&
        !driverDataRoad?.endPlaceOut)
      ? true
      : false;
  }, [passengerDataRoad, driverDataRoad]);

  const haveRoadDriver = useMemo(() => {
    return driverDataRoad &&
      driverDataRoad?.startPlaceIn?.length > 0 &&
      driverDataRoad?.startPlaceOut?.length > 0 &&
      driverDataRoad?.endPlaceIn?.length > 0 &&
      driverDataRoad?.endPlaceOut?.length > 0
      ? true
      : false;
  }, [driverDataRoad]);

  const haveRoadPassenger = useMemo(() => {
    return (passengerDataRoad?.startPlaceIn?.length as number) > 0 &&
      (passengerDataRoad?.startPlaceOut?.length as number) > 0 &&
      (passengerDataRoad?.endPlaceIn?.length as number) > 0 &&
      (passengerDataRoad?.endPlaceOut?.length as number) > 0
      ? true
      : false;
  }, [passengerDataRoad]);

  const handleViewCarpoolDetail = useCallback(() => {
    if (userData) {
      checkAuthDriverAndPassenger({
        id: CMemberID,
        memberId: userID,
      })
        .unwrap()
        .then(returnedAuthValue => {
          if (isModeSelect && !haveRoadDriver && !haveRoadPassenger) {
            navigation.navigate(ROUTE_KEY.CarpoolModeSelect);
            return;
          }

          if (!isAgreeTerms) {
            // user do not agree terms
            navigation.navigate(ROUTE_KEY.DiverAgreeActivity, {
              isPassenger: carpoolMode === 'PASSENGER',
            });
            return;
          }

          if (carpoolMode === 'PASSENGER') {
            if (!isRegisteredBusinessCard && !isRegisterRoute) {
              navigation.navigate(ROUTE_KEY.BusinessCardAndVaccineRegistration, {
                isDriver: false,
              });
              return;
            }

            if (
              returnedAuthValue?.authDriver === 'Y' &&
              isFirstTimeApproval &&
              !haveRoadPassenger
            ) {
              navigation.navigate(ROUTE_KEY.DriverCompleteApproval);
              return;
            }

            if (returnedAuthValue?.authDriver === 'C' && haveRoadDriver && !haveRoadPassenger) {
              navigation.navigate(ROUTE_KEY.DriverWaitingApproved);
              return;
            }
            if (returnedAuthValue?.authDriver === 'R' && haveRoadDriver && !haveRoadPassenger) {
              navigation.navigate(ROUTE_KEY.DriverRejectApproval);
              return;
            }

            if (!isRegisterRoute) {
              navigation.navigate(ROUTE_KEY.DriverCommunicationRegistration, {
                isPassenger: true,
              });
              return;
            }
          }

          if (carpoolMode === 'DRIVER') {
            if (returnedAuthValue?.authDriver === 'R') {
              navigation.navigate(ROUTE_KEY.DriverRejectApproval);
              return;
            }

            if (returnedAuthValue?.authDriver === 'C') {
              navigation.navigate(ROUTE_KEY.DriverWaitingApproved);
              return;
            }

            if (
              (returnedAuthValue.authDriver === 'Y' && !haveRoadDriver) ||
              (isFirstTimeApproval && returnedAuthValue?.authDriver !== 'N')
            ) {
              navigation.navigate(ROUTE_KEY.DriverCompleteApproval);
              return;
            }

            if (returnedAuthValue?.authDriver === 'N') {
              navigation.navigate(ROUTE_KEY.DriverRegister);
              return;
            }
          }

          if (returnedAuthValue.authDriver === 'Y' && !haveRoadDriver) {
            navigation.navigate(ROUTE_KEY.CarpoolRequestDetail, {item});
            return;
          }
        });
    } else {
      navigation.navigate(ROUTE_KEY.Login);
    }
  }, [item]);

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

export default UserRequestCarpoolParkItem;

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
