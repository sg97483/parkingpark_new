import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useMemo} from 'react';
import {IS_ACTIVE} from '~constants/enum';
import {
  useGetMyDriverRoadQuery,
  useGetMyRiderRoadQuery,
  useReadMyCarpoolInfoQuery,
} from '~services/carpoolServices';
import {useAppSelector} from '~store/storeHooks';
import {userHook} from './userHook';
import {skipToken} from '@reduxjs/toolkit/query';

export const useCheckRoute = () => {
  const CMemberInfo = useAppSelector(state => state?.userReducer?.myDriverInfo);
  const carpoolMode = useAppSelector(state => state?.userReducer?.carpoolMode);
  const isFirstTimeApproval = useAppSelector(state => state?.carpoolReducer?.isFirstTimeApproval);
  const {userToken, userID, CMemberID} = userHook();

  const {
    data: passengerRoad,
    refetch: refetchPassengerRoad,
    isUninitialized: isFetchingPassengerRoad,
  } = useGetMyRiderRoadQuery(
    {memberId: userID!, id: CMemberID!},
    {skip: !CMemberID || !userID || carpoolMode === 'DRIVER', refetchOnFocus: true},
  );

  const {
    data: driverRoad,
    refetch: refetchDriverRoad,
    isUninitialized: isFetchingDriverRoad,
  } = useGetMyDriverRoadQuery(
    {memberId: userID!, id: CMemberID!},
    {skip: !CMemberID || !userID || carpoolMode === 'PASSENGER', refetchOnFocus: true},
  );

  const {data: businessCardInfo} = useReadMyCarpoolInfoQuery(
    userID ? {memberId: userID!} : skipToken, // userID가 없을 경우 호출하지 않음
  );

  const hideModeSelect = useMemo(() => {
    return passengerRoad || driverRoad?.startPlaceIn || driverRoad?.startPlaceOut ? true : false;
  }, [driverRoad, passengerRoad]);

  useFocusEffect(
    useCallback(() => {
      if (carpoolMode === 'PASSENGER' && !isFetchingPassengerRoad) {
        refetchPassengerRoad();
      }
      if (carpoolMode === 'DRIVER' && !isFetchingDriverRoad) {
        refetchDriverRoad();
      }
    }, [
      carpoolMode,
      isFetchingDriverRoad,
      isFetchingPassengerRoad,
      refetchPassengerRoad,
      refetchDriverRoad,
    ]),
  );

  const isFirstTimeRegister = useMemo(
    () => (driverRoad || passengerRoad || CMemberInfo ? false : true),
    [driverRoad, passengerRoad, CMemberInfo],
  );

  const isAgreeTerms = useMemo(
    () => CMemberInfo?.termsYN === IS_ACTIVE.YES,
    [CMemberInfo?.termsYN],
  );

  const isRegisterRoute = useMemo(() => {
    switch (carpoolMode) {
      case 'DRIVER':
        return driverRoad &&
          driverRoad?.startPlaceIn?.length > 0 &&
          driverRoad?.startPlaceOut?.length > 0 &&
          driverRoad?.endPlaceIn?.length > 0 &&
          driverRoad?.endPlaceOut?.length > 0
          ? true
          : false;

      case 'PASSENGER':
        return passengerRoad &&
          passengerRoad?.startPlaceIn?.length > 0 &&
          passengerRoad?.startPlaceOut?.length > 0 &&
          passengerRoad?.endPlaceIn?.length > 0 &&
          passengerRoad?.endPlaceOut?.length > 0
          ? true
          : false;

      default:
        return false;
    }
  }, [driverRoad, passengerRoad, carpoolMode]);

  const isRegisteredBusinessCard = useMemo(() => {
    if (
      businessCardInfo?.coAddress &&
      businessCardInfo?.coName &&
      businessCardInfo?.job &&
      businessCardInfo?.jobType
    ) {
      return true;
    } else {
      return false;
    }
  }, [businessCardInfo]);

  return {
    userToken,
    isFirstTimeRegister,
    isAgreeTerms,
    carpoolMode,
    isRegisterRoute,
    driverRoad,
    isFirstTimeApproval,
    isRegisteredBusinessCard,
    hideModeSelect,
  };
};
