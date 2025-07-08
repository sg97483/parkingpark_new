import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {Icons} from '~/assets/svgs';
import ItemRequestRegistration from '~components/carpool-request-registration-list/item-request-registration';
import Avatar from '~components/commons/avatar';
import CustomCheckbox from '~components/commons/custom-checkbox';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import DriverMenuOption, {
  DriverMenuOptionRefs,
} from '~components/driver-profile/driver-menu-option';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import LoadingComponent from '~components/loading-component';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {DriverRoadDayModel} from '~model/driver-model';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {CARPOOL_TYPE} from '~screens/driver-profile/driver-profile';
import {
  useAddFavoritePassengerMutation,
  useBlockUserMutation,
  useGetFavoritePassengerListQuery,
  useGetMyRiderRoadQuery,
  useRemoveFavoritePassengerMutation,
} from '~services/carpoolServices';
import {useGetMyDailyRouteCommuteQuery} from '~services/passengerServices';
import {useLazyReadMyDriverQuery} from '~services/userServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

const PassengerProfile = (props: RootStackScreenProps<'PassengerProfile'>) => {
  const {navigation, route} = props;
  const {passengerID, passengerName} = route?.params;
  const {userID} = userHook();
  const driverMenuOption = useRef<DriverMenuOptionRefs>(null);

  const [cMemberID, setCMemberID] = useState<number | null>(null);

  const [readMyDriver] = useLazyReadMyDriverQuery();

  useEffect(() => {
    if (passengerID) {
      readMyDriver({
        memberId: passengerID.toString(),
      })
        .unwrap()
        .then(res => {
          if (res?.c_memberId) {
            setCMemberID(res?.c_memberId);
          }
        });
    }
  }, []);

  const {data: representativeRoute} = useGetMyRiderRoadQuery(
    {
      memberId: passengerID as number,
      id: cMemberID as number,
    },
    {skip: !cMemberID || !passengerID},
  );

  const {
    data,
    isFetching,
    refetch: refetchPassengerDailyRoute,
  } = useGetMyDailyRouteCommuteQuery(
    {
      c_memberId: passengerID as number,
    },
    {skip: !passengerID},
  );

  const {data: listFavoritePass, refetch} = useGetFavoritePassengerListQuery(
    {
      memberId: userID || 0,
    },
    {skip: !userID},
  );

  const isFavoritePassenger = useMemo(
    () => listFavoritePass?.find(item => item?.riderId === passengerID)?.favStatus === 'Y',
    [listFavoritePass, passengerID],
  );

  const [removeFavorite] = useRemoveFavoritePassengerMutation();
  const [addFavoritePassenger] = useAddFavoritePassengerMutation();

  const handleRemoveFavoritePassenger = useCallback(() => {
    if (isFavoritePassenger) {
      removeFavorite({
        memberId: userID as number,
        riderId: passengerID as number,
      })
        .unwrap()
        .then(res => {
          if (res !== '200') {
            showMessage({
              message: strings.general_text?.please_try_again,
            });
            return;
          }
          refetch();
        });
    } else {
      addFavoritePassenger({
        memberId: userID as number,
        riderId: passengerID as number,
      })
        .unwrap()
        .then(res => {
          if (res !== '200') {
            showMessage({
              message: strings.general_text?.please_try_again,
            });
            return;
          }
          refetch();
        });
    }
  }, [refetch, userID, removeFavorite, passengerID, addFavoritePassenger, isFavoritePassenger]);

  const [filterType, setFilterType] = useState<CARPOOL_TYPE>('ALL');

  const listCarpoolHistory = useMemo((): DriverRoadDayModel[] => {
    if (data) {
      switch (filterType) {
        case 'ALL':
          return data;
        case 'WAY_WORK':
          return data?.filter(item => item?.carInOut === 'in');
        case 'WAY_HOME':
          return data?.filter(item => item?.carInOut === 'out');
        default:
          return [];
      }
    } else {
      return [];
    }
  }, [data, filterType]);

  const [blockUser] = useBlockUserMutation();

  const handleBlockPassenger = useCallback(() => {
    blockUser({
      blockMId: passengerID,
      memberId: userID,
    })
      .unwrap()
      .then((res: string) => {
        if (res !== '200') {
          showMessage({
            message: strings.general_text.please_try_again,
          });
          return;
        }
        showMessage({
          message: '해당 탑승객을 차단했습니다.',
        });
        navigation.goBack();
      });
  }, [blockUser, passengerID, userID]);

  const renderUserInfo = useMemo(() => {
    return (
      <HStack style={{gap: widthScale1(6)}}>
        <Avatar uri={representativeRoute?.profileImageUrl} size={40} />

        <View style={{flex: 1, gap: heightScale1(2)}}>
          <HStack style={{gap: widthScale1(4)}}>
            <CustomText
              family={FONT_FAMILY.MEDIUM}
              numberOfLines={1}
              string={passengerName ?? ''}
              forDriveMe
              size={FONT.SUB_HEAD}
              textStyle={{
                flexShrink: 1,
                maxWidth: widthScale1(182),
              }}
            />
            {representativeRoute?.authYN === 'Y' ? <Icons.VerifivationMarkText /> : null}
          </HStack>
          <CustomText
            string="탑승객님"
            family={FONT_FAMILY.MEDIUM}
            color={colors.grayText}
            forDriveMe
            size={FONT.CAPTION}
          />
        </View>

        <Pressable onPress={handleRemoveFavoritePassenger}>
          {isFavoritePassenger ? <Icons.StarFill width={25} height={24} /> : <Icons.Star />}
        </Pressable>
      </HStack>
    );
  }, [representativeRoute, isFavoritePassenger, handleRemoveFavoritePassenger]);

  const renderHeader = useCallback(() => {
    return (
      <PaddingHorizontalWrapper containerStyles={{gap: heightScale1(10)}} forDriveMe>
        {renderUserInfo}

        <HStack style={{gap: widthScale1(10)}}>
          <Pressable
            onPress={() => {
              navigation.navigate(ROUTE_KEY.RouteHistoryPassenger, {
                passengerID: passengerID as number,
                passengerName: passengerName ?? '',
              });
            }}
            style={styles.operationMenuStyle}>
            <CustomText
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText}
              size={FONT.CAPTION}
              string="카풀요청"
            />
            <CustomText forDriveMe family={FONT_FAMILY.SEMI_BOLD} string={`${data?.length ?? 0}`} />
          </Pressable>

          <View style={styles.operationMenuStyle}>
            <CustomText
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText}
              size={FONT.CAPTION}
              string="카풀횟수"
            />
            <CustomText
              forDriveMe
              family={FONT_FAMILY.SEMI_BOLD}
              string={representativeRoute?.driverCnt?.toString() ?? '0'}
            />
          </View>

          <Pressable
            onPress={() => {
              navigation.navigate(ROUTE_KEY.RepresentativeRouteOfPassenger, {
                passengerID: passengerID as number,
              });
            }}
            style={styles.operationMenuStyle}>
            <CustomText
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText}
              size={FONT.CAPTION}
              string="대표경로"
            />
            <CustomText forDriveMe family={FONT_FAMILY.SEMI_BOLD} string="등록" />
          </Pressable>
        </HStack>

        <View>
          <HStack
            style={{
              justifyContent: 'space-between',
              marginTop: heightScale1(10),
            }}>
            <CustomText
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.BODY}
              forDriveMe
              string={`이 탑승객의 카풀요청 내역 ${listCarpoolHistory?.length}`}
            />
            <Pressable
              onPress={() => {
                navigation.navigate(ROUTE_KEY.RouteHistoryPassenger, {
                  passengerID: passengerID as number,
                  passengerName: passengerName ?? '',
                });
              }}>
              <CustomText forDriveMe family={FONT_FAMILY.MEDIUM} string="전체보기" />
            </Pressable>
          </HStack>

          {/* Filter */}
          <HStack
            style={{
              marginVertical: PADDING1,
              gap: PADDING1,
            }}>
            <CustomCheckbox
              isChecked={filterType === 'ALL'}
              text="전체"
              onPress={() => setFilterType('ALL')}
            />
            <CustomCheckbox
              isChecked={filterType === 'WAY_WORK'}
              text="출근길"
              onPress={() => setFilterType('WAY_WORK')}
            />
            <CustomCheckbox
              isChecked={filterType === 'WAY_HOME'}
              text="퇴근길"
              onPress={() => setFilterType('WAY_HOME')}
            />
          </HStack>
        </View>
      </PaddingHorizontalWrapper>
    );
  }, [listCarpoolHistory?.length, filterType, representativeRoute, renderUserInfo]);

  return (
    <FixedContainer>
      <CustomHeader
        text="프로필"
        rightContent={
          <Pressable
            onPress={() => {
              driverMenuOption?.current?.show();
            }}
            hitSlop={40}>
            <Icons.Elipses />
          </Pressable>
        }
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetchPassengerDailyRoute} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: heightScale1(10),
        }}>
        {renderHeader()}

        {isFetching ? (
          <LoadingComponent containerStyle={{height: heightScale1(50)}} />
        ) : (
          <View>
            {listCarpoolHistory?.length > 0 ? (
              <View>
                {listCarpoolHistory?.flatMap((item, index) => {
                  if (index <= 4) {
                    return (
                      <View key={index}>
                        <ItemRequestRegistration item={item} viewMode />
                        <Divider insetsVertical={30} />
                      </View>
                    );
                  }
                })}
              </View>
            ) : (
              <View>
                <CustomText
                  string={'카풀 요청 내역이 없습니다.'}
                  forDriveMe
                  family={FONT_FAMILY.MEDIUM}
                  textStyle={styles.emptyTextStyle}
                  color={colors.grayText}
                  lineHeight={20}
                  size={FONT.CAPTION_7}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <DriverMenuOption ref={driverMenuOption} onBlock={handleBlockPassenger} />
    </FixedContainer>
  );
};

export default PassengerProfile;

const styles = StyleSheet.create({
  operationMenuStyle: {
    flex: 1,
    minHeight: heightScale1(75),
    backgroundColor: colors.policy,
    borderRadius: scale1(8),
    justifyContent: 'center',
    alignItems: 'center',
    gap: heightScale1(4),
  },
  introStyle: {
    borderWidth: 1,
    borderColor: colors.disableButton,
    paddingHorizontal: widthScale1(16),
    paddingVertical: heightScale1(15),
    borderRadius: scale1(8),
    minHeight: heightScale1(110),
    marginBottom: heightScale1(40),
  },
  emptyTextStyle: {
    textAlign: 'center',
    marginTop: heightScale1(100),
    lineHeight: heightScale1(20),
  },
});
