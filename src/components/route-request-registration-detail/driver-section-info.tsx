import {useNavigation} from '@react-navigation/native';
import React, {memo, useCallback, useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {Icons} from '~/assets/svgs';
import Avatar from '~components/commons/avatar';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {DriverRoadDayModel, MyDriverModel} from '~model/driver-model';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {
  useAddFavoriteDriverMutation,
  useGetFavoriteDriverListQuery,
  useRemoveFavoriteDriverMutation,
} from '~services/carpoolServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import DriverAuthCheckItem from './driver-auth-check-item';

interface Props {
  carpoolCount: number;
  routeDetail: DriverRoadDayModel | undefined;
  driverInfo: MyDriverModel | undefined;
}

const DriverSectionInfo: React.FC<Props> = memo(props => {
  const {carpoolCount, routeDetail, driverInfo} = props;

  const {userID} = userHook();
  const navigation = useNavigation<UseRootStackNavigation>();
  const driverID = useMemo(() => driverInfo?.memberId, [driverInfo]);
  const {data: listFavoriteDriver, refetch} = useGetFavoriteDriverListQuery({
    memberId: userID as number,
  });
  const [addFavoriteDriver] = useAddFavoriteDriverMutation();
  const [removeFavoriteDriver] = useRemoveFavoriteDriverMutation();

  const isAuthAcc = useMemo(
    () => (driverInfo?.authYN === IS_ACTIVE.YES ? true : false),
    [driverInfo?.authYN],
  );
  const isAuthCar = useMemo(
    () => (driverInfo?.carAuthYN === IS_ACTIVE.YES ? true : false),
    [driverInfo?.carAuthYN],
  );
  const isAuthLicense = useMemo(
    () => (driverInfo?.licenseAuthYN === IS_ACTIVE.YES ? true : false),
    [driverInfo?.licenseAuthYN],
  );
  const isAuthInsurence = useMemo(
    () => (driverInfo?.insurAuthYN === IS_ACTIVE.YES ? true : false),
    [driverInfo?.insurAuthYN],
  );
  const isAuthCal = useMemo(
    () => (driverInfo?.calAuthYN === IS_ACTIVE.YES ? true : false),
    [driverInfo?.calAuthYN],
  );
  const isAuthVaccine = useMemo(
    () => (driverInfo?.vcAuthYN === IS_ACTIVE.YES ? true : false),
    [driverInfo?.vcAuthYN],
  );

  const isVerified = useMemo(() => {
    return isAuthCar || isAuthLicense || isAuthInsurence || isAuthCal || isAuthVaccine;
  }, [isAuthCar, isAuthLicense, isAuthInsurence, isAuthCal, isAuthVaccine]);

  const isFavoriteDriver = useMemo(
    () => listFavoriteDriver?.find(item => item?.driverId === driverID)?.favStatus === 'Y',
    [driverID, listFavoriteDriver],
  );

  const handleFavoriteDriver = useCallback(() => {
    if (isFavoriteDriver) {
      removeFavoriteDriver({
        driverId: driverID as number,
        memberId: userID as number,
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
      addFavoriteDriver({
        driverId: driverID as number,
        memberId: userID as number,
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
  }, [isFavoriteDriver, driverID, userID, removeFavoriteDriver, addFavoriteDriver]);

  return (
    <View style={styles.containerStyle}>
      <Pressable
        onPress={() => {
          navigation.navigate(ROUTE_KEY.DriverProfile, {
            driverID: driverID as number,
            driverName: driverInfo?.nic ?? '',
          });
        }}>
        <HStack style={{gap: widthScale1(6)}}>
          <Avatar uri={driverInfo?.profileImageUrl} size={40} />

          <View style={{flex: 1, gap: heightScale1(2)}}>
            <HStack style={{gap: widthScale1(4)}}>
              <CustomText
                string={driverInfo?.nic ?? ''}
                family={FONT_FAMILY.MEDIUM}
                size={FONT.SUB_HEAD}
                forDriveMe
                numberOfLines={1}
                textStyle={{
                  maxWidth: widthScale1(80),
                }}
              />

              <CustomText
                string="드라이버님"
                family={FONT_FAMILY.MEDIUM}
                size={FONT.SUB_HEAD}
                forDriveMe
                numberOfLines={1}
              />

              {isAuthAcc && <Icons.VerifivationMarkText />}
            </HStack>

            <CustomText
              string={`총 카풀횟수 ${carpoolCount}회`}
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION}
              color={colors.lineCancel}
            />
          </View>

          <Pressable hitSlop={40} onPress={handleFavoriteDriver}>
            {isFavoriteDriver ? <Icons.StarFill width={25} height={24} /> : <Icons.Star />}
          </Pressable>
        </HStack>
      </Pressable>

      {/* Introduce */}
      <View style={{gap: heightScale1(10)}}>
        <CustomText string="코멘트" forDriveMe family={FONT_FAMILY.MEDIUM} />

        <View style={styles.introduceStyle}>
          <CustomText
            string={routeDetail?.introduce ? routeDetail?.introduce : '등록한 코멘트가 없습니다.'}
            forDriveMe
            family={FONT_FAMILY.MEDIUM}
            lineHeight={20}
            color={routeDetail?.introduce ? colors.menuTextColor : colors.grayText}
          />
        </View>
      </View>

      {/* verification */}

      <View style={{gap: heightScale1(10)}}>
        {isAuthCar && <DriverAuthCheckItem text="차량정보 인증완료" />}
        {isAuthLicense && <DriverAuthCheckItem text="운전면허증 정보 인증완료" />}
        {isAuthInsurence && <DriverAuthCheckItem text="보험정보 인증완료" />}
        {isAuthCal && <DriverAuthCheckItem text="정산정보 인증완료" />}
        {isAuthVaccine && <DriverAuthCheckItem text="백신접종 인증완료" />}
      </View>
    </View>
  );
});

export default DriverSectionInfo;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: colors.policy,
    padding: PADDING1,
    borderRadius: scale1(8),
    gap: PADDING1,
  },
  avatarStyle: {
    width: widthScale1(40),
    height: widthScale1(40),
    borderRadius: 999,
  },
  introduceStyle: {
    borderWidth: 1,
    paddingHorizontal: widthScale1(16),
    paddingVertical: widthScale1(15),
    borderRadius: scale1(8),
    minHeight: heightScale1(110),
    borderColor: colors.disableButton,
  },
  driverAuthCheckViewStyle: {
    gap: heightScale1(4),
    minHeight: heightScale1(20),
  },
});
