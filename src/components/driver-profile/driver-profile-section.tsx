import {useNavigation} from '@react-navigation/native';
import React, {memo, useCallback, useMemo} from 'react';
import {Pressable, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {showMessage} from 'react-native-flash-message';
import {Icons} from '~/assets/svgs';
import CustomBoxSelectButton from '~components/commons/custom-box-select-button';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import LoadingComponent from '~components/loading-component';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {CarDriverModel, CarpoolPayHistoryModel} from '~model/passenger-model';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {
  useAddFavoriteDriverMutation,
  useGetFavoriteDriverListQuery,
  useReadMyDriverQuery,
  useRemoveFavoriteDriverMutation,
} from '~services/carpoolServices';
import {useGetDriverEvaluationQuery} from '~services/passengerServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {getCarpoolDriverStyle} from '~utils/getCarpoolDriverStyle';

interface Props {
  driverID: number;
  listCarpoolHistory: CarpoolPayHistoryModel[];
  numOfRequestCarpool: number;
}

const DriverProfileSection: React.FC<Props> = memo(props => {
  const {driverID, listCarpoolHistory, numOfRequestCarpool} = props;

  const {userID, user} = userHook();

  const navigation = useNavigation<UseRootStackNavigation>();

  const [addFavoriteDriver] = useAddFavoriteDriverMutation();
  const [removeFavoriteDriver] = useRemoveFavoriteDriverMutation();

  const {data: listFavoriteDriver, refetch} = useGetFavoriteDriverListQuery({
    memberId: userID as number,
  });

  const isFavoriteDriver = useMemo(
    () => listFavoriteDriver?.find(item => item?.driverId === driverID)?.favStatus === 'Y',
    [listFavoriteDriver, driverID],
  );

  const {data: driverInfo, isFetching} = useReadMyDriverQuery(
    {
      memberId: driverID,
    },
    {skip: !driverID},
  );

  const {data: driverEvaluationAvg} = useGetDriverEvaluationQuery(
    {
      driverID,
    },
    {skip: !driverID},
  );

  const numOfCarpool = useMemo(
    (): number => listCarpoolHistory?.filter(item => item?.rStatusCheck === 'E')?.length ?? 0,
    [listCarpoolHistory],
  );

  const carInfomation = useMemo(
    (): CarDriverModel => ({
      carNumber: driverInfo?.carNumber ?? '',
      carModel: driverInfo?.carModel ?? '',
      carYear: driverInfo?.carYear ?? '',
      carColor: driverInfo?.carColor ?? '',
      carImages: [
        driverInfo?.carImageUrl ?? '',
        driverInfo?.carImageUrl2 ?? '',
        driverInfo?.carImageUrl3 ?? '',
        driverInfo?.carImageUrl4 ?? '',
      ],
      authYN: driverInfo?.authYN as IS_ACTIVE,
    }),
    [driverInfo, user],
  );

  const driverStyle = useMemo(
    (): string[] => getCarpoolDriverStyle(driverInfo?.style ?? '') as string[],
    [driverInfo?.style],
  );

  const showDriverStyle = useMemo(
    () => driverStyle?.some(item => typeof item === 'string' && item.trim() !== ''),
    [driverStyle],
  );

  const handleAddFavoriteDriver = useCallback(() => {
    if (isFavoriteDriver) {
      removeFavoriteDriver({
        driverId: driverID as number,
        memberId: userID as number,
      })
        .unwrap()
        .then(res => {
          console.log(
            '🚀 ~ file: driver-profile-section.tsx:106 ~ handleAddFavoriteDriver ~ res:',
            res,
          );
          if (res !== '200') {
            showMessage({
              message: strings.general_text?.please_try_again,
            });
            return;
          }
          refetch();
        });
    } else {
      const body = {
        driverId: driverID as number,
        memberId: userID as number,
      };
      console.log(
        '🚀 ~ file: driver-profile-section.tsx:123 ~ handleAddFavoriteDriver ~ body:',
        body,
      );
      addFavoriteDriver({
        driverId: driverID as number,
        memberId: userID as number,
      })
        .unwrap()
        .then(res => {
          console.log(
            '🚀 ~ file: driver-profile-section.tsx:125 ~ handleAddFavoriteDriver ~ res:',
            res,
          );
          if (res !== '200') {
            showMessage({
              message: strings.general_text?.please_try_again,
            });
            return;
          }
          refetch();
        });
    }
  }, [isFavoriteDriver, removeFavoriteDriver, addFavoriteDriver, userID, driverID, refetch]);

  if (isFetching) {
    return <LoadingComponent containerStyle={{height: heightScale1(397)}} />;
  }

  return (
    <View>
      <PaddingHorizontalWrapper forDriveMe>
        <HStack>
          {driverInfo?.profileImageUrl ? (
            <FastImage
              source={{
                uri: driverInfo?.profileImageUrl,
              }}
              style={styles.avatarStyle}
            />
          ) : (
            <View style={styles.avatarStyle}>
              <Icons.NonProfile width={widthScale1(45)} height={widthScale1(45)} />
            </View>
          )}

          <View
            style={{
              flex: 1,
              marginHorizontal: widthScale1(6),
              gap: heightScale1(2),
            }}>
            <HStack style={{gap: widthScale1(4)}}>
              <CustomText
                size={FONT.SUB_HEAD}
                family={FONT_FAMILY.MEDIUM}
                numberOfLines={1}
                string={driverInfo?.nic ?? ''}
                forDriveMe
                textStyle={{
                  flexShrink: 1,
                }}
              />
              {driverInfo?.badge && <Icons.VerifivationMarkText />}
            </HStack>
            <CustomText
              size={FONT.CAPTION}
              string="드라이버님"
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText}
              forDriveMe
            />
          </View>

          <Pressable onPress={handleAddFavoriteDriver}>
            {isFavoriteDriver ? <Icons.StarFill width={25} height={24} /> : <Icons.Star />}
          </Pressable>
        </HStack>
      </PaddingHorizontalWrapper>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {/* Rating */}
        <Pressable
          onPress={() =>
            navigation.navigate(ROUTE_KEY.DriverProfileEvaluationDetails, {
              driverID,
              evaluationAvg: driverEvaluationAvg,
            })
          }
          style={[
            styles.operationMenuStyle,
            {
              marginLeft: PADDING1,
            },
          ]}>
          <CustomText
            color={colors.grayText}
            size={FONT.CAPTION}
            string="평점"
            forDriveMe
            family={FONT_FAMILY.MEDIUM}
          />
          <CustomText
            size={FONT.CAPTION_6}
            color={colors.menuTextColor}
            family={FONT_FAMILY.SEMI_BOLD}
            string={`${(
              (Number(driverEvaluationAvg?.avg1 ?? 0) +
                Number(driverEvaluationAvg?.avg2 ?? 0) +
                Number(driverEvaluationAvg?.avg3 ?? 0)) /
              3
            ).toFixed(1)}`}
            textStyle={{marginTop: heightScale1(4)}}
            forDriveMe
            numberOfLines={1}
          />
        </Pressable>

        {/* Registered Carpool */}
        <Pressable
          onPress={() => {
            navigation.navigate(ROUTE_KEY.RouteHistoryDriver, {
              driverID: driverID,
              driverName: driverInfo?.nic ?? '',
            });
          }}
          style={styles.operationMenuStyle}>
          <CustomText
            forDriveMe
            color={colors.grayText}
            size={FONT.CAPTION}
            string="등록카풀"
            family={FONT_FAMILY.MEDIUM}
          />
          <CustomText
            size={FONT.CAPTION_6}
            color={colors.menuTextColor}
            family={FONT_FAMILY.SEMI_BOLD}
            string={numOfRequestCarpool.toString()}
            textStyle={{marginTop: heightScale1(4)}}
            forDriveMe
            numberOfLines={1}
          />
        </Pressable>

        {/* Operation details */}
        <Pressable
          onPress={() =>
            navigation.navigate(ROUTE_KEY.OperationDetails, {
              driverName: driverInfo?.nic ?? '',
              data: listCarpoolHistory?.filter(item => item?.rStatusCheck === 'E'),
            })
          }
          style={styles.operationMenuStyle}>
          <CustomText
            forDriveMe
            color={colors.grayText}
            size={FONT.CAPTION}
            string="카풀횟수"
            family={FONT_FAMILY.MEDIUM}
          />
          <CustomText
            size={FONT.CAPTION_6}
            color={colors.menuTextColor}
            family={FONT_FAMILY.SEMI_BOLD}
            string={numOfCarpool.toString()}
            textStyle={{marginTop: heightScale1(4)}}
            forDriveMe
            numberOfLines={1}
          />
        </Pressable>

        {/* Representative route */}
        <Pressable
          onPress={() =>
            navigation.navigate(ROUTE_KEY.RepresentativeRouteOfDriver, {
              driverID: driverID as number,
            })
          }
          style={styles.operationMenuStyle}>
          <CustomText
            forDriveMe
            color={colors.grayText}
            size={FONT.CAPTION}
            string="대표경로"
            family={FONT_FAMILY.MEDIUM}
          />
          <CustomText
            size={FONT.CAPTION_6}
            color={colors.menuTextColor}
            family={FONT_FAMILY.SEMI_BOLD}
            string="등록"
            textStyle={{marginTop: heightScale1(4)}}
            forDriveMe
            numberOfLines={1}
          />
        </Pressable>

        {/* Car number */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(ROUTE_KEY.DriverProfileCarInformation, {
              carInfomation: carInfomation,
            })
          }
          style={[
            styles.operationMenuStyle,
            {
              marginRight: PADDING1,
            },
          ]}>
          <CustomText
            forDriveMe
            color={colors.grayText}
            size={FONT.CAPTION}
            string="차량번호"
            family={FONT_FAMILY.MEDIUM}
          />
          <CustomText
            size={FONT.CAPTION_6}
            color={colors.menuTextColor}
            family={FONT_FAMILY.SEMI_BOLD}
            string={driverInfo?.carNumber || ''}
            textStyle={{marginTop: heightScale1(4)}}
            forDriveMe
            numberOfLines={1}
          />
        </TouchableOpacity>
      </ScrollView>

      <PaddingHorizontalWrapper forDriveMe>
        <HStack
          style={[
            styles.viewDriverStyle,
            showDriverStyle ? {marginTop: heightScale1(20)} : undefined,
          ]}>
          {driverStyle.flatMap((item, index) => {
            if (item?.length > 0) {
              return (
                <CustomBoxSelectButton key={index} text={item} selected={false} darkText={true} />
              );
            }
          })}
        </HStack>
      </PaddingHorizontalWrapper>
    </View>
  );
});

export default DriverProfileSection;

const styles = StyleSheet.create({
  avatarStyle: {
    width: widthScale1(40),
    height: widthScale1(40),
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  operationMenuStyle: {
    minHeight: heightScale1(75),
    minWidth: widthScale1(78),
    backgroundColor: colors.policy,
    borderRadius: scale1(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: PADDING1,
    // marginBottom: heightScale1(20),
    marginRight: widthScale1(10),
    paddingHorizontal: widthScale1(10),
    paddingVertical: PADDING1,
  },
  introStyle: {
    borderWidth: 1,
    borderColor: colors.disableButton,
    padding: PADDING1,
    borderRadius: scale1(8),
    minHeight: heightScale1(110),
    marginBottom: heightScale1(10),
  },
  itemDriverStyle: {
    borderWidth: 1,
    paddingHorizontal: PADDING1,
    paddingVertical: heightScale1(6),
    borderRadius: 999,
    marginRight: widthScale1(10),
    minHeight: heightScale1(32),
    borderColor: colors.disableButton,
    marginBottom: heightScale1(10),
  },
  viewDriverStyle: {
    marginBottom: heightScale1(30),
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: widthScale1(10),
  },
});
