import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import LineButton from '~components/commons/line-button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import ModeSelectionItem from '~components/mode-selection-modal/mode-selection-item';
import Spinner from '~components/spinner';
import {FONT, FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {changeCarpoolMode} from '~reducers/userReducer';
import {
  useGetMyDriverRoadQuery,
  useLazyGetMyRiderRoadQuery,
  useReadMyCarpoolInfoQuery,
} from '~services/carpoolServices';
import {useCheckAuthDriverAndPassengerMutation} from '~services/userServices';
import {useAppDispatch} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

const CarpoolModeSelect = memo((props: RootStackScreenProps<'CarpoolModeSelect'>) => {
  const {navigation} = props;
  const dispatch = useAppDispatch();
  const {myDriverInfo, userID, CMemberID} = userHook();
  const {data: dataCarpool} = useReadMyCarpoolInfoQuery({memberId: userID as number});
  const {data: driverRoad} = useGetMyDriverRoadQuery({id: CMemberID!, memberId: userID!});
  const [roadRider] = useLazyGetMyRiderRoadQuery();
  const [checkAuthDriverAndPassenger, {isLoading}] = useCheckAuthDriverAndPassengerMutation();

  const isRegisteredBusinessCard = useMemo(
    () =>
      !!dataCarpool?.coAddress &&
      !!dataCarpool?.coName &&
      !!dataCarpool?.job &&
      !!dataCarpool?.jobType,
    [dataCarpool, myDriverInfo],
  );

  const isAgreeTerms = useMemo(() => {
    return myDriverInfo?.termsYN === IS_ACTIVE.YES;
  }, [myDriverInfo]);

  const handleDriver = () => {
    checkAuthDriverAndPassenger({
      id: CMemberID,
      memberId: userID,
    })
      .unwrap()
      .then(returnAuthValue => {
        if (driverRoad?.startPlaceIn) {
          navigation.navigate(ROUTE_KEY.DriverWayToWork1, {
            isReturnRoute: true,
            previousRoute: driverRoad as any,
          });
          return;
        }

        if (returnAuthValue?.authDriver === 'C') {
          navigation.navigate(ROUTE_KEY.DriverWaitingApproved);
          return;
        }

        if (returnAuthValue?.authDriver === 'R') {
          navigation.navigate(ROUTE_KEY.DriverRejectApproval);
          return;
        }

        if (returnAuthValue?.authDriver === 'Y') {
          navigation.navigate(ROUTE_KEY.DriverCompleteApproval);
          return;
        }

        if (isAgreeTerms) {
          navigation.navigate(ROUTE_KEY.DriverRegister);
        } else {
          dispatch(changeCarpoolMode('DRIVER'));
          navigation.navigate(ROUTE_KEY.DiverAgreeActivity, {isPassenger: false});
        }
      });
  };

  const handlePassenger = () => {
    if (isAgreeTerms && !isRegisteredBusinessCard) {
      navigation.navigate(ROUTE_KEY.BusinessCardAndVaccineRegistration, {
        isDriver: false,
      });
      return;
    }

    if (isRegisteredBusinessCard) {
      Spinner.show();
      roadRider({memberId: userID!, id: CMemberID!})
        .unwrap()
        .then(res => {
          const haveIn = !!(res?.startPlaceIn && res?.endPlaceIn);
          const haveOut = !!(res?.startPlaceOut && res?.endPlaceOut);

          if (!haveIn) {
            navigation.navigate(ROUTE_KEY.DriverCommunicationRegistration, {isPassenger: true});
            return;
          }

          if (!haveOut) {
            navigation.navigate(ROUTE_KEY.WayToWorkRegistration1, {
              isReturnRoute: true,
              previousRoute: res as any,
            });
            return;
          }

          navigation.navigate(ROUTE_KEY.MyWorkRoute, {isPassenger: true});
        })
        .finally(() => Spinner.hide());
    } else {
      dispatch(changeCarpoolMode('PASSENGER'));
      navigation.navigate(ROUTE_KEY.DiverAgreeActivity, {isPassenger: true});
    }
  };

  return (
    <FixedContainer>
      <CustomHeader
        hideBack
        rightContent={
          <LineButton
            text="닫기"
            onPress={() => {
              navigation.goBack();
            }}
          />
        }
      />

      <View style={styles.view}>
        <View style={{gap: heightScale1(10)}}>
          <CustomText
            size={FONT.CAPTION_9}
            family={FONT_FAMILY.SEMI_BOLD}
            string={'카풀 서비스 첫 이용을 위해\n원하는 모드를 선택해주세요!'}
            forDriveMe
            lineHeight={heightScale1(31)}
          />
          <CustomText
            color={colors.grayText2}
            string={'드라이버 모드로 신청시 자동으로 탑승객 모드도 신청됩니다.'}
            forDriveMe
            lineHeight={heightScale1(20)}
          />
        </View>

        <View style={{gap: heightScale1(12), marginTop: heightScale1(30)}}>
          <ModeSelectionItem
            title="드라이버 신청하기"
            subTitle={'출퇴근길 내차로\n부가수익 창출'}
            onPress={handleDriver}
            isLoading={isLoading}
          />

          <ModeSelectionItem
            iconType="USER"
            title="탑승객 신청하기"
            subTitle={'편안하고 저렴한\n출퇴근'}
            onPress={handlePassenger}
          />
        </View>
      </View>
    </FixedContainer>
  );
});

export default CarpoolModeSelect;

const styles = StyleSheet.create({
  view: {
    marginHorizontal: widthScale1(20),
    marginTop: heightScale1(50),
  },
});
