import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {Icons} from '~/assets/svgs';
import CarpoolHistoryItem from '~components/carpool-user-profile/carpool-history-item';
import CustomCheckbox from '~components/commons/custom-checkbox';
import PageButton from '~components/commons/page-button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import DriverMenuOption, {
  DriverMenuOptionRefs,
} from '~components/driver-profile/driver-menu-option';
import DriverProfileSection from '~components/driver-profile/driver-profile-section';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import LoadingComponent from '~components/loading-component';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useBlockUserMutation} from '~services/carpoolServices';
import {
  useGetPayHistoryDriverQuery,
  useGetRouteRegistrationListOfDriverQuery,
} from '~services/driverServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1} from '~styles/scaling-utils';

export type CARPOOL_TYPE = 'ALL' | 'WAY_WORK' | 'WAY_HOME';

const DriverProfile = (props: RootStackScreenProps<'DriverProfile'>) => {
  const {navigation, route} = props;
  const driverID = route?.params?.driverID;

  const driverName = route?.params?.driverName;
  const driverMenuOption = useRef<DriverMenuOptionRefs>(null);
  const {userID} = userHook();

  const [filterType, setFilterType] = useState<CARPOOL_TYPE>('ALL');

  const [totalCarpoolHistory, setTotalCarpoolHistory] = useState(0);

  const {
    data: listCarpoolHistory,
    isFetching,
    refetch,
  } = useGetRouteRegistrationListOfDriverQuery(
    {
      memberId: driverID as number,
      carInOut: filterType === 'ALL' ? '0' : filterType === 'WAY_WORK' ? '1' : '2',
    },
    {skip: !driverID},
  );

  useEffect(() => {
    filterType === 'ALL' && setTotalCarpoolHistory(listCarpoolHistory?.length || 0);
  }, [listCarpoolHistory]);

  const {data: listPaymentHistory} = useGetPayHistoryDriverQuery(
    {
      d_memberId: driverID as number,
    },
    {skip: !driverID},
  );

  const [blockUser] = useBlockUserMutation();

  const handleBlockDriver = useCallback(() => {
    blockUser({
      blockMId: driverID,
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
          message: '해당 드라이버를 차단했습니다.',
        });
        navigation.goBack();
      });
  }, [blockUser, driverID, userID]);

  return (
    <FixedContainer edges={['top']}>
      <CustomHeader
        text="프로필"
        rightContent={
          <Pressable
            onPress={() => {
              driverMenuOption?.current?.show();
            }}>
            <Icons.Elipses />
          </Pressable>
        }
      />

      <ScrollView
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        contentContainerStyle={styles.containerStyle}>
        <DriverProfileSection
          driverID={driverID}
          listCarpoolHistory={listPaymentHistory ? listPaymentHistory : []}
          numOfRequestCarpool={totalCarpoolHistory}
        />

        <PaddingHorizontalWrapper containerStyles={styles.filterHeaderWrapperStyle} forDriveMe>
          <HStack style={styles.headerStyle}>
            <CustomText
              forDriveMe
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.BODY}
              string={`이 드라이버의 카풀등록 내역 ${listCarpoolHistory?.length ?? 0}`}
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(ROUTE_KEY.RouteHistoryDriver, {
                  driverName: driverName,
                  driverID: driverID,
                })
              }>
              <CustomText forDriveMe string="전체보기" family={FONT_FAMILY.MEDIUM} />
            </TouchableOpacity>
          </HStack>

          <HStack>
            <CustomCheckbox
              style={styles.filterWrapperStyle}
              text={'전체'}
              isChecked={filterType === 'ALL'}
              onPress={() => setFilterType('ALL')}
            />

            <CustomCheckbox
              style={styles.filterWrapperStyle}
              text={'출근길'}
              isChecked={filterType === 'WAY_WORK'}
              onPress={() => setFilterType('WAY_WORK')}
            />

            <CustomCheckbox
              style={styles.filterWrapperStyle}
              text={'퇴근길'}
              isChecked={filterType === 'WAY_HOME'}
              onPress={() => setFilterType('WAY_HOME')}
            />
          </HStack>

          <PageButton
            text="대표경로 확인하고 운행 등록 요청하기"
            onPress={() => navigation.navigate(ROUTE_KEY.RepresentativeRouteOfDriver, {driverID})}
          />
        </PaddingHorizontalWrapper>

        {isFetching ? (
          <LoadingComponent containerStyle={{height: heightScale1(50)}} />
        ) : (
          <View>
            {listCarpoolHistory && listCarpoolHistory?.length > 0 ? (
              <View>
                {listCarpoolHistory?.flatMap((item, index) => {
                  if (index <= 4) {
                    return (
                      <CarpoolHistoryItem item={{...item, rStatusCheck: 'N'}} key={item?.id} />
                    );
                  }
                })}
              </View>
            ) : (
              <CustomText
                string={'드라이버의 경로를 확인하고\n운행등록을 요청해보세요!'}
                forDriveMe
                family={FONT_FAMILY.MEDIUM}
                textStyle={styles.emptyTextStyle}
                color={colors.grayText}
                lineHeight={20}
              />
            )}
          </View>
        )}
      </ScrollView>

      <DriverMenuOption ref={driverMenuOption} onBlock={handleBlockDriver} />
    </FixedContainer>
  );
};

export default DriverProfile;

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: heightScale1(10),
  },
  filterHeaderWrapperStyle: {
    gap: PADDING1,
    marginBottom: PADDING1,
  },
  headerStyle: {
    justifyContent: 'space-between',
  },
  filterWrapperStyle: {
    marginRight: PADDING1,
  },
  buttonStyle: {
    backgroundColor: colors.policy,
    minHeight: heightScale1(52),
    justifyContent: 'space-between',
    paddingHorizontal: PADDING1,
    borderRadius: scale1(4),
  },
  emptyTextStyle: {
    textAlign: 'center',
    marginTop: heightScale1(100),
    lineHeight: heightScale1(20),
  },
});
