import React, {useCallback, useMemo} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomSearchInput from '~components/commons/custom-search-input';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import LoadingComponent from '~components/loading-component';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetMyDriverRoadQuery, useGetMyRiderRoadQuery} from '~services/carpoolServices';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

const DriverWayToWork1 = (props: RootStackScreenProps<'DriverWayToWork1'>) => {
  const {navigation, route} = props;

  const previousRoute = route.params?.previousRoute; // data of the route to work
  const isRoadOut = route.params?.isReturnRoute; // check road go home
  const dataOldRoute = route.params?.dataOldRoute; // data old route
  const selectedDate = route?.params?.selectedDate;
  const isDailyRegistration = route?.params?.isDailyRegistration;
  const isNewRoute = route?.params?.isNewRoute;

  // data address stop
  const addressStop = route.params?.addressStop;

  const {CMemberID, userID} = userHook();
  const {data: roadRider, isLoading} = useGetMyRiderRoadQuery({memberId: userID!, id: CMemberID!});
  const {data: roadDriver} = useGetMyDriverRoadQuery({
    memberId: userID!,
    id: CMemberID!,
  });

  const haveRoadRider = useMemo(() => {
    if (!isRoadOut) {
      const check =
        roadRider?.startPlaceIn &&
        roadRider?.startTimeIn &&
        roadRider?.splatIn &&
        roadRider?.splngIn &&
        roadRider?.endPlaceIn &&
        roadRider?.eplatIn &&
        roadRider?.eplngIn &&
        roadRider?.priceIn;

      return !!check;
    } else {
      const check =
        roadRider?.startPlaceOut &&
        roadRider?.startTimeOut &&
        roadRider?.splatOut &&
        roadRider?.splngOut &&
        roadRider?.endPlaceOut &&
        roadRider?.eplatOut &&
        roadRider?.eplngOut &&
        roadRider?.priceOut;

      return !!check;
    }
  }, [roadRider, isRoadOut]);

  // has stop over place
  const hasStopOverPlace = useMemo(
    () => !!previousRoute?.soPriceIn && !!previousRoute?.stopOverPlaceIn,

    [previousRoute, isRoadOut],
  );

  // register same passenger way to work - home
  const handleRegisterSamePassengerRoad = () => {
    navigation.navigate(ROUTE_KEY.DriverWayToWork4, {
      dataOldRoute: roadRider,
      selectedDate: selectedDate,
      isDailyRegistration: isDailyRegistration,
      isRoadOut: isRoadOut,
    });
  };

  // register road out same road in
  const handleRegisterRoadOutSameRoadIn = () => {
    const newPreviousRoute = {
      ...previousRoute,
      startPlaceIn: previousRoute?.startPlaceIn!,
      endPlaceIn: previousRoute?.endPlaceIn!,
      startTimeIn: '',
      startParkIdOut: previousRoute?.endParkIdIn,
      endParkIdOut: previousRoute?.startParkIdIn,
    };

    if (addressStop) {
      navigation.navigate(ROUTE_KEY.DriverWayToWork4, {
        previousRoute: newPreviousRoute as any,
        isRoadOut: isRoadOut,
        searchStop: addressStop,
        selectedDate: selectedDate,
        isDailyRegistration: isDailyRegistration,
        hasAddressStop: hasStopOverPlace,
      });
    } else {
      navigation.navigate(ROUTE_KEY.DriverWayToWork4, {
        previousRoute: newPreviousRoute as any,
        isRoadOut: isRoadOut,
        selectedDate: selectedDate,
        isDailyRegistration: isDailyRegistration,
        hasAddressStop: hasStopOverPlace,
      });
    }
  };

  // on press search
  const onPressSearch = () => {
    navigation.navigate(ROUTE_KEY.DriverWayToWork2, {
      isReturnRoute: isRoadOut,
      dataOldRoute: dataOldRoute,
      selectedDate: selectedDate,
      isDailyRegistration: isDailyRegistration,
    });
  };

  // handle render road out same road in
  const renderIsRoadOut = useCallback(() => {
    if (isRoadOut) {
      return (
        <Pressable onPress={handleRegisterRoadOutSameRoadIn}>
          <HStack style={styles.viewCheckBox}>
            <CustomText
              string={'클릭 한번으로 출근길과 동일한 경로 반대로\n퇴근길 등록할수 있어요!'}
              family={FONT_FAMILY.MEDIUM}
              lineHeight={heightScale1(20)}
              color={colors.grayText2}
              forDriveMe
            />
            <Icons.ChevronRight
              width={widthScale1(16)}
              height={heightScale1(16)}
              stroke={colors.lineCancel}
            />
          </HStack>
        </Pressable>
      );
    }
  }, [isRoadOut, roadRider]);

  // handle render road out passenger and road in passenger
  const renderHasRoadPassenger = useCallback(() => {
    return (
      <>
        {haveRoadRider && !isNewRoute ? (
          <Pressable onPress={handleRegisterSamePassengerRoad}>
            <HStack style={styles.viewCheckBox}>
              <CustomText
                string={
                  isRoadOut
                    ? '등록된 탑승객 퇴근길 경로가 있어요!\n같은 경로로 퇴근길 등록하시겠어요?'
                    : '등록된 탑승객 출근길 경로가 있어요!\n같은 경로로 출근길 등록하시겠어요?'
                }
                family={FONT_FAMILY.MEDIUM}
                lineHeight={heightScale1(20)}
                color={colors.grayText2}
                forDriveMe
              />
              <Icons.ChevronRight
                width={widthScale1(16)}
                height={heightScale1(16)}
                stroke={colors.lineCancel}
              />
            </HStack>
          </Pressable>
        ) : null}
      </>
    );
  }, [isRoadOut, haveRoadRider, roadRider]);

  return (
    <FixedContainer>
      <CustomHeader text={isRoadOut ? '퇴근길 등록' : '출근길 등록'} />
      <PaddingHorizontalWrapper containerStyles={{marginVertical: PADDING1}}>
        <CustomSearchInput
          onPress={onPressSearch}
          placeholder="어디로 갈까요?"
          placeholderTextColor={colors.lineCancel}
          editable={false}
          pointerEvents="none"
        />
      </PaddingHorizontalWrapper>

      {previousRoute && isRoadOut ? renderIsRoadOut() : null}

      {isLoading ? <LoadingComponent /> : renderHasRoadPassenger()}

      <PaddingHorizontalWrapper
        forDriveMe
        containerStyles={{
          backgroundColor: colors.gray7,
          borderRadius: widthScale1(8),
          marginHorizontal: PADDING1,
        }}>
        <CustomText
          string={'카풀 매칭 높이는 꿀TIP'}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_7}
          color={colors.menuTextColor}
          textStyle={{paddingVertical: heightScale1(17)}}
          lineHeight={fontSize1(22)}
          forDriveMe
        />
        <CustomText
          string={'   \u2022  경유지를 등록해보세요!'}
          size={FONT.CAPTION_6}
          color={colors.grayText2}
          textStyle={{paddingBottom: heightScale1(4)}}
          lineHeight={fontSize1(20)}
          family={FONT_FAMILY.MEDIUM}
          forDriveMe
        />
        <CustomText
          string={'   \u2022  지하철역 등 유동인구가 많은 곳으로 등록해보세요.'}
          size={FONT.CAPTION_6}
          color={colors.grayText2}
          textStyle={{paddingBottom: heightScale1(16)}}
          lineHeight={fontSize1(20)}
          family={FONT_FAMILY.MEDIUM}
          forDriveMe
        />
      </PaddingHorizontalWrapper>
    </FixedContainer>
  );
};

export default DriverWayToWork1;

const styles = StyleSheet.create({
  viewCheckBox: {
    // paddingHorizontal: PADDING1,
    marginHorizontal: PADDING1,
    paddingVertical: heightScale1(16),
    paddingHorizontal: widthScale1(20),
    justifyContent: 'space-between',
    marginBottom: heightScale1(20),
    borderWidth: 1,
    borderRadius: widthScale1(4),
    borderColor: colors.colorStatus,
  },
});
