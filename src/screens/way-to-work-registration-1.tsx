import {useIsFocused} from '@react-navigation/native';
import React, {memo, useEffect, useMemo} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import SearchInput from '~components/way-to-work-registration/search-input';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetMyDriverRoadQuery} from '~services/carpoolServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1} from '~styles/scaling-utils';

const WayToWorkRegistration1 = (props: RootStackScreenProps<'WayToWorkRegistration1'>) => {
  const {navigation, route} = props;

  const isFocused = useIsFocused();

  const previousRoute = route.params?.previousRoute; // data of the route to work
  const isRoadOut = route.params?.isReturnRoute; // check road go home
  const dataOldRoute = route.params?.dataOldRoute; // data old route
  const hidePrice = route.params?.hidePrice; // hide price when edit old route

  const {userID, CMemberID} = userHook();

  const {data: roadDriver, refetch} = useGetMyDriverRoadQuery({memberId: userID!, id: CMemberID!});

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused]);

  const haveRoadDriver = useMemo(
    (): boolean =>
      (roadDriver?.endPlaceIn?.length ?? 0) > 0 &&
      (roadDriver?.endPlaceOut?.length ?? 0) > 0 &&
      (roadDriver?.startPlaceIn?.length ?? 0) > 0 &&
      (roadDriver?.startPlaceOut?.length ?? 0) > 0,
    [roadDriver],
  );

  const onPressRoadDriver = () => {
    navigation.navigate(ROUTE_KEY.WayToWorkRegistration5, {
      dataEdit: roadDriver,
      isRoadOut: isRoadOut,
    });
  };

  const onPressRevertCommunicate = () => {
    const newPreviousRoute = {
      ...previousRoute,
      startPlaceIn: decodeURIComponent(previousRoute?.startPlaceIn!),
      endPlaceIn: decodeURIComponent(previousRoute?.endPlaceIn!),
      introduce: decodeURIComponent(previousRoute?.introduce!),
      startTimeIn: decodeURIComponent(previousRoute?.startTimeIn!),
      startParkIdOut: previousRoute?.endParkIdIn,
      endParkIdOut: previousRoute?.startParkIdIn,
    };

    navigation.navigate(ROUTE_KEY.WayToWorkRegistration5, {
      previousRoute: newPreviousRoute as any,
      isRoadOut: isRoadOut,
    });
  };

  const onPressSearch = () => {
    navigation.navigate(ROUTE_KEY.WayToWorkRegistration2, {
      isReturnRoute: isRoadOut,
      dataOldRoute: dataOldRoute,
      hidePrice: hidePrice,
    });
  };

  return (
    <FixedContainer>
      <CustomHeader text={isRoadOut ? '퇴근길 등록' : '출근길 등록'} />

      <SearchInput onPress={onPressSearch} />

      {!!isRoadOut && !!previousRoute && (
        <Pressable onPress={onPressRevertCommunicate} style={styles.viewCheckBox}>
          <HStack style={styles.viewButton}>
            <CustomText
              size={FONT.CAPTION_6}
              string={'클릭 한번으로 출근길과 동일한 경로 반대로\n퇴근길 등록할수 있어요!'}
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText2}
              lineHeight={20}
            />
            <Icons.ChevronRight width={16} height={16} stroke={colors.grayText2} />
          </HStack>
        </Pressable>
      )}

      {!!haveRoadDriver && (
        <Pressable onPress={onPressRoadDriver} style={styles.viewCheckBox}>
          <HStack style={styles.viewButton}>
            <CustomText
              size={FONT.CAPTION_6}
              string={'등록된 드라이버 퇴근길 경로가 있어요!\n같은 경로로 퇴근길 등록하시겠어요?'}
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText2}
              lineHeight={20}
            />
            <Icons.ChevronRight width={16} height={16} stroke={colors.grayText2} />
          </HStack>
        </Pressable>
      )}
    </FixedContainer>
  );
};

export default memo(WayToWorkRegistration1);
const styles = StyleSheet.create({
  viewCheckBox: {
    justifyContent: 'center',
    borderRadius: scale1(4),
    borderColor: colors.colorStatus,
    borderWidth: 1,
    marginHorizontal: PADDING1,
    marginTop: PADDING1,
  },
  viewButton: {
    justifyContent: 'space-between',
    paddingHorizontal: PADDING1,
    paddingVertical: heightScale1(16),
  },
});
