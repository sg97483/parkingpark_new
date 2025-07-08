import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomBoxSelectButton from '~components/commons/custom-box-select-button';
import InfoPriceRoute from '~components/commons/info-price-route';
import PageButton from '~components/commons/page-button';
import RouteBadge from '~components/commons/route-badge';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {SettlementModel} from '~model/settlement-model';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetSettlementHistoryQuery} from '~services/carpoolServices';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {getNumberWithCommas} from '~utils/numberUtils';

const ScheduledSettlementDetails = memo(
  (props: RootStackScreenProps<'ScheduledSettlementDetails'>) => {
    const {navigation} = props;
    const {userID} = userHook();

    const [mode, setMode] = useState<'IN_APP' | 'CREDIT_CARD'>('IN_APP');

    const {data, isFetching, refetch} = useGetSettlementHistoryQuery(
      {
        memberId: userID as any,
        calYNfilter: mode,
      },
      {skip: !userID},
    );

    const settlementData = useMemo(() => {
      return data?.filter(item => item?.payStatus !== 'Y') ?? [];
    }, [data]);

    const totalIncome = useMemo(() => {
      return settlementData?.reduce((prev, next) => prev + Number(next?.estPrice ?? 0), 0) ?? 0;
    }, [settlementData]);

    const renderHeader = useMemo(() => {
      return (
        <PaddingHorizontalWrapper
          forDriveMe
          containerStyles={{
            marginTop: heightScale1(10),
            gap: PADDING1,
          }}>
          <View style={{gap: heightScale1(10)}}>
            <HStack style={{gap: widthScale1(10)}}>
              <CustomBoxSelectButton
                text="충전금입금"
                selected={mode === 'IN_APP'}
                onSelected={() => {
                  setMode('IN_APP');
                }}
              />
              <CustomBoxSelectButton
                text="계좌입금"
                selected={mode === 'CREDIT_CARD'}
                onSelected={() => {
                  setMode('CREDIT_CARD');
                }}
              />
            </HStack>
            <View style={{gap: heightScale1(6)}}>
              <HStack style={{gap: widthScale1(4)}}>
                {mode === 'IN_APP' ? (
                  <Icons.Coin width={widthScale1(16)} height={widthScale1(16)} />
                ) : (
                  <Icons.Card width={widthScale1(16)} height={widthScale1(16)} />
                )}
                <CustomText
                  family={FONT_FAMILY.MEDIUM}
                  forDriveMe
                  string={mode === 'IN_APP' ? '충전금정산 예정 수익금' : '계좌정산 예정 수익금'}
                />
              </HStack>
              <HStack style={{gap: widthScale1(4), alignItems: 'baseline'}}>
                <CustomText
                  string={getNumberWithCommas(totalIncome)}
                  forDriveMe
                  family={FONT_FAMILY.SEMI_BOLD}
                  size={FONT.CAPTION_11}
                  lineHeight={heightScale1(36)}
                />
                <CustomText
                  string="원"
                  forDriveMe
                  family={FONT_FAMILY.MEDIUM}
                  lineHeight={heightScale1(20)}
                />
              </HStack>
            </View>
          </View>

          <PageButton
            text={
              mode === 'IN_APP'
                ? '충전금으로 카풀 금액의 80%가 입금됩니다.'
                : '입력하신 계좌로 카풀 금액의 75%가 입금됩니다.'
            }
            onPress={() => {
              navigation.navigate(ROUTE_KEY.PaymentNotice);
            }}
          />
        </PaddingHorizontalWrapper>
      );
    }, [mode, totalIncome, navigation]);

    const renderItem = useCallback(
      ({item}: {item: SettlementModel}) => {
        const endTime = item?.endTime || '--:--';

        return (
          <View>
            <PaddingHorizontalWrapper containerStyles={{gap: PADDING1}} forDriveMe>
              <View style={{gap: heightScale1(4)}}>
                <HStack style={{gap: widthScale1(10)}}>
                  <RouteBadge type={item?.carInOut === 'in' ? 'WAY_WORK' : 'WAY_HOME'} />
                  <CustomText
                    string="카풀완료"
                    forDriveMe
                    family={FONT_FAMILY.SEMI_BOLD}
                    color={colors.disableButton}
                  />
                </HStack>
                <CustomText
                  string={item?.selectDay}
                  forDriveMe
                  family={FONT_FAMILY.SEMI_BOLD}
                  size={FONT.BODY}
                />
              </View>
              <RoutePlanner
                timeStart={item?.startTime}
                timeArrive={endTime}
                hideExpectations
                startAddress={item?.startPlace}
                arriveAddress={item?.endplace}
                stopOverAddress={item?.stopOverPlace ?? ''}
              />
              <InfoPriceRoute
                originalPrice={
                  Number(item?.price) > Number(item?.estPrice) ? item?.price : undefined
                }
                price={item?.estPrice as string}
                onPress={() =>
                  navigation.navigate(ROUTE_KEY.RouteRequestRegistrationDetail, {
                    routeInfo: {
                      ...item,
                      endPlace: item?.endplace,
                    } as any,
                    viewMode: true,
                  })
                }
              />
            </PaddingHorizontalWrapper>
            <Divider insetsVertical={30} />
          </View>
        );
      },
      [navigation],
    );

    const renderEmpty = useCallback(() => {
      return (
        <CustomText string="정산 내역이 없습니다." forDriveMe textStyle={styles.emptyTextStyle} />
      );
    }, []);

    return (
      <FixedContainer>
        <CustomHeader text="정산 예정 내역" />
        <View style={{gap: PADDING1}}>
          {renderHeader}
          <Divider />
        </View>

        <FlashList
          contentContainerStyle={{paddingTop: PADDING1}}
          data={settlementData}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          estimatedItemSize={300}
          refreshing={isFetching}
          onRefresh={refetch}
        />
      </FixedContainer>
    );
  },
);

export default ScheduledSettlementDetails;

const styles = StyleSheet.create({
  emptyTextStyle: {
    marginTop: heightScale1(141),
    textAlign: 'center',
    color: colors.grayText,
    fontSize: fontSize1(16),
    fontFamily: FONT_FAMILY.MEDIUM,
  },
});
