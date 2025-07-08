import {useNavigation} from '@react-navigation/native';
import React, {FC, memo, useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import Avatar from '~components/commons/avatar';
import CustomButton from '~components/commons/custom-button';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {CarpoolPayHistoryModel} from '~model/passenger-model';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useGetSettlementHistoryQuery} from '~services/carpoolServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {getNumberWithCommas} from '~utils/numberUtils';

interface Props {
  carpoolWaitingToday: CarpoolPayHistoryModel | null;
  carpoolRunning: CarpoolPayHistoryModel | null;
  listPaymentHistory: CarpoolPayHistoryModel[];
}

const DriverInformationCard: FC<Props> = memo(props => {
  const {carpoolRunning, carpoolWaitingToday, listPaymentHistory} = props;
  const navigation = useNavigation<UseRootStackNavigation>();
  const {myDriverInfo, user, userID} = userHook();

  const {data} = useGetSettlementHistoryQuery(
    {
      calYNfilter: 'ALL',
      memberId: userID as number,
    },
    {refetchOnFocus: true},
  );

  const totalIncome = useMemo(() => {
    return data?.reduce(
      (prevValue, nextValue) => prevValue + Number(nextValue?.incomePrice ?? 0),
      0 ?? 0,
    );
  }, [data]);

  const completeCarpoolList = useMemo(() => {
    return listPaymentHistory?.filter(item => item?.rStatusCheck === 'E').length;
  }, [listPaymentHistory]);

  return (
    <View style={styles.container}>
      <HStack style={styles.headerContainer}>
        <Avatar uri={myDriverInfo?.profileImageUrl} size={40} />

        <View style={{flex: 1, gap: heightScale1(2)}}>
          <HStack style={{gap: widthScale1(4)}}>
            <CustomText
              string={`${myDriverInfo?.nic} 드라이버님`}
              family={FONT_FAMILY.MEDIUM}
              size={FONT.SUB_HEAD}
              color={colors.menuTextColor}
              lineHeight={heightScale1(21)}
              forDriveMe
              textStyle={{flexShrink: 1}}
              numberOfLines={1}
            />

            <Icons.VerificationMark />
          </HStack>

          <HStack style={{gap: widthScale1(6)}}>
            <CustomText
              string={user?.carNumber ?? ''}
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText2}
              lineHeight={scale1(18)}
              forDriveMe
            />
            <Icons.Dot fill={colors.grayText2} />
            <CustomText
              string={user?.carModel ?? ''}
              family={FONT_FAMILY.MEDIUM}
              color={colors.grayText2}
              lineHeight={scale1(18)}
              forDriveMe
            />
          </HStack>
        </View>

        <Pressable
          hitSlop={40}
          onPress={() => {
            navigation.navigate(ROUTE_KEY.DriverRegister);
          }}>
          <Icons.Settings />
        </Pressable>
      </HStack>

      {carpoolWaitingToday || carpoolRunning ? (
        <Pressable
          style={{
            marginTop: heightScale1(20),
          }}
          onPress={() => {
            if (carpoolRunning) {
              navigation.navigate(ROUTE_KEY.DriverRunning, {
                item: carpoolRunning,
              });
              return;
            }
            if (carpoolWaitingToday) {
              navigation.navigate(ROUTE_KEY.WaitingRoute, {
                route: carpoolWaitingToday,
              });
            }
          }}>
          <HStack style={styles.timeToDriveContainer}>
            <CustomText
              string={
                carpoolRunning
                  ? '카풀 운행중이에요.\n카풀 에티켓을 지켜주세요.'
                  : '카풀 예정 시간이에요!\n탑승객이 탑승하셨나요?'
              }
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION_6}
              color={colors.primary}
              lineHeight={fontSize1(20)}
              forDriveMe
            />
            <Icons.ChevronRight stroke={colors.primary} width={scale1(16)} height={scale1(16)} />
          </HStack>
        </Pressable>
      ) : null}

      <HStack style={styles.footerContainer}>
        <View>
          <CustomText
            string={'전체 운행내역'}
            family={FONT_FAMILY.MEDIUM}
            size={FONT.CAPTION_6}
            color={colors.grayText2}
            lineHeight={scale1(20)}
            forDriveMe
          />
          <Pressable
            style={styles.informationContainer}
            onPress={() => navigation.navigate(ROUTE_KEY.UsageHistory, {focusTab: 3})}>
            <HStack style={styles.spaceBetween}>
              <HStack>
                <CustomText
                  string={completeCarpoolList.toString() ?? '0'}
                  family={FONT_FAMILY.SEMI_BOLD}
                  size={FONT.BODY}
                  color={colors.menuTextColor}
                  lineHeight={fontSize1(25.2)}
                  forDriveMe
                />
                <View
                  style={{
                    width: widthScale1(4),
                  }}
                />
                <CustomText
                  string={'건'}
                  family={FONT_FAMILY.MEDIUM}
                  size={FONT.CAPTION_6}
                  color={colors.menuTextColor}
                  lineHeight={fontSize1(20)}
                  forDriveMe
                />
              </HStack>
              <Icons.ChevronRight stroke={colors.grayText} width={scale1(16)} height={scale1(16)} />
            </HStack>
          </Pressable>
        </View>

        <View>
          <CustomText
            string={'전체 정산금액'}
            family={FONT_FAMILY.MEDIUM}
            size={FONT.CAPTION_6}
            color={colors.grayText2}
            lineHeight={scale1(20)}
            forDriveMe
          />
          <Pressable
            style={styles.informationContainer}
            onPress={() => {
              navigation.navigate(ROUTE_KEY.AccountSettlement);
            }}>
            <HStack style={styles.spaceBetween}>
              <HStack>
                <CustomText
                  string={getNumberWithCommas(totalIncome ?? 0)}
                  family={FONT_FAMILY.SEMI_BOLD}
                  size={FONT.BODY}
                  color={colors.menuTextColor}
                  lineHeight={fontSize1(25.2)}
                  forDriveMe
                />
                <View
                  style={{
                    width: widthScale1(4),
                  }}
                />
                <CustomText
                  string={'원'}
                  family={FONT_FAMILY.MEDIUM}
                  size={FONT.CAPTION_6}
                  color={colors.menuTextColor}
                  lineHeight={fontSize1(20)}
                  forDriveMe
                />
              </HStack>
              <Icons.ChevronRight stroke={colors.grayText} width={scale1(16)} height={scale1(16)} />
            </HStack>
          </Pressable>
        </View>
      </HStack>

      <CustomButton
        buttonStyle={styles.buttonContainer}
        onPress={() => navigation.navigate(ROUTE_KEY.CarpoolRequest)}
        type="SECONDARY"
        buttonHeight={58}
        text="카풀 요청찾기"
      />
    </View>
  );
});

export default DriverInformationCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: scale1(8),
    marginBottom: heightScale1(20),
    paddingHorizontal: widthScale1(20),
    paddingVertical: heightScale1(20),
  },
  headerContainer: {
    justifyContent: 'space-between',
    gap: widthScale1(6),
  },
  dot: {
    height: scale1(2),
    aspectRatio: 1,
    backgroundColor: colors.grayText2,
    marginHorizontal: widthScale1(6),
  },
  informationContainer: {
    borderColor: colors.grayCheckBox,
    borderWidth: scale1(1),
    borderRadius: scale1(4),
    paddingVertical: heightScale1(14),
    paddingHorizontal: widthScale1(16),
    width: widthScale1(142.5),
    marginTop: heightScale1(10),
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  footerContainer: {justifyContent: 'space-between', marginTop: heightScale1(20)},
  buttonContainer: {
    marginTop: heightScale1(20),
  },
  timeToDriveContainer: {
    borderColor: colors.primary,
    borderRadius: scale1(4),
    borderWidth: scale1(1),
    paddingHorizontal: widthScale1(20),
    paddingVertical: heightScale1(16),
    justifyContent: 'space-between',
  },
});
