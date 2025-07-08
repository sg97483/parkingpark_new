import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {Icons} from '~/assets/svgs';
import IconButton from '~components/commons/icon-button';
import {PADDING1} from '~constants/constant';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {changeCarpoolMode} from '~reducers/userReducer';
import {useGetMyDriverRoadQuery} from '~services/carpoolServices';
import {useCheckAuthDriverAndPassengerMutation} from '~services/userServices';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {heightScale1} from '~styles/scaling-utils';

interface BottomRightButtonsProps {
  isShowButtonScrollUp: boolean;
  isRunning: boolean;
  onPressGoToTop: () => void;
}

const BottomRightButtons = (props: BottomRightButtonsProps) => {
  const {isShowButtonScrollUp, onPressGoToTop, isRunning} = props;
  const dispatch = useAppDispatch();
  const navigation: UseRootStackNavigation = useNavigation();
  const {userID, CMemberID} = userHook();
  const unreadMessageTotal = useAppSelector(
    state => state?.carpoolReducer?.listChatData?.unreadTotal,
  );
  const isFirstTimeApproval = useAppSelector(state => state?.carpoolReducer?.isFirstTimeApproval);
  const [checkAuthDriverAndPassenger, {isLoading}] = useCheckAuthDriverAndPassengerMutation();

  const heightExtraIsRunning = isRunning ? 60 : 0; // 60: 40 IsRunningButton height + 20 padding

  const {
    data: myInfo,
    refetch,
    isUninitialized,
  } = useGetMyDriverRoadQuery(
    {
      memberId: userID as number,
      id: CMemberID as number,
    },
    {skip: !CMemberID || !userID, refetchOnFocus: true},
  );

  useFocusEffect(
    useCallback(() => {
      if (!isUninitialized) {
        refetch();
      }
    }, [isUninitialized]),
  );

  const onSwitchCarpoolMode = () => {
    checkAuthDriverAndPassenger({
      id: CMemberID,
      memberId: userID,
    })
      .unwrap()
      .then(returnedAuthValue => {
        console.log('returnedAuthValue', returnedAuthValue);

        const driverRegisterRoute =
          (myInfo?.startPlaceIn?.length as number) > 0 &&
          (myInfo?.endPlaceIn?.length as number) > 0 &&
          (myInfo?.startPlaceOut?.length as number) > 0 &&
          (myInfo?.endPlaceOut?.length as number) > 0
            ? true
            : false;

        if (returnedAuthValue?.authDriver === 'R') {
          navigation.navigate(ROUTE_KEY.DriverRejectApproval);
          return;
        }

        if (returnedAuthValue?.authDriver === 'C') {
          navigation.navigate(ROUTE_KEY.DriverWaitingApproved);
          return;
        }

        if (
          (returnedAuthValue.authDriver === 'Y' && !driverRegisterRoute) ||
          (isFirstTimeApproval && returnedAuthValue?.authDriver !== 'N')
        ) {
          navigation.navigate(ROUTE_KEY.DriverCompleteApproval);
          return;
        }

        if (returnedAuthValue?.authDriver === 'N') {
          navigation.navigate(ROUTE_KEY.DriverRegister);
          return;
        }
        showMessage({
          message: '드라이버 모드로 전환되었습니다.',
          position: 'bottom',
          style: {marginBottom: 30},
        });
        dispatch(changeCarpoolMode('DRIVER'));
      });
  };

  return (
    <View>
      {isShowButtonScrollUp ? (
        <IconButton
          onPress={onPressGoToTop}
          icon={<Icons.ChevronUp />}
          position={{
            right: PADDING1,
            bottom: heightScale1(56 + 20 + heightExtraIsRunning),
          }}
        />
      ) : (
        <>
          {/*Switch mode */}
          {/*
          <IconButton
            onPress={() => {
              onSwitchCarpoolMode();
            }}
            icon={<Icons.UserSwitch />}
            position={{
              right: PADDING1,
              bottom: heightScale1(112 + 20 + heightExtraIsRunning),
            }}
            isLoading={isLoading}
            disabled={isLoading}
          />
          */}

          {/* Chat */}
          <IconButton
            position={{
              bottom: heightScale1(56 + 20 + heightExtraIsRunning),
              right: PADDING1,
            }}
            onPress={() => navigation.navigate(ROUTE_KEY.ChatList)}
            icon={<Icons.Bubble />}
            badgeNum={unreadMessageTotal ?? 0}
          />
        </>
      )}
    </View>
  );
};

export default React.memo(BottomRightButtons);
