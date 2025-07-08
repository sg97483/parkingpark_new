import moment from 'moment';
import React, {memo, useMemo} from 'react';
import {View} from 'react-native';
import {Icons} from '~/assets/svgs';
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
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetDrivingDirectionQuery} from '~services/naverMapServices';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {getNumberWithCommas} from '~utils/numberUtils';

const AccountSettlementDetails = memo((props: RootStackScreenProps<'AccountSettlementDetails'>) => {
  const {navigation, route} = props;
  const {item} = route?.params;
  const {myDriverInfo} = userHook();

  const {data: direction} = useGetDrivingDirectionQuery({
    start: `${item?.splng},${item?.splat}`,
    end: `${item?.eplng},${item?.eplat}`,
    waypoints: item?.soplat && item?.soplng ? `${item?.soplng},${item?.soplat}` : '',
  });

  const endTime = useMemo(() => {
    return moment(item?.startTime, 'HH:mm').add(direction?.duration, 'minutes').format('HH:mm');
  }, [direction]);

  const daysOfWeek = (day: number) => {
    switch (day) {
      case 1:
        return '월';
      case 2:
        return '화';
      case 3:
        return '수';
      case 4:
        return '목';
      default:
        return '금';
    }
  };

  const payCardMethod = useMemo(() => {
    return item?.calYN === 'M' ? true : false;
  }, [myDriverInfo, item]);

  const paymentDate = useMemo(() => {
    const selectDate = item?.selectDay.slice(0, (item?.selectDay.length as number) - 3);
    const dateTime = new Date(moment(selectDate, 'YYYY.MM.DD') as any);
    if (!payCardMethod) {
      const nextDay = dateTime.getTime() + 60 * 60 * 24 * 1000;
      const nextDate = new Date(nextDay);

      if (nextDate.getDay() === 6) {
        const nextMonday = nextDay + 60 * 60 * 24 * 1000 * 2;
        const strNextDate = moment(nextMonday as any).format('YYYY.MM.DD');
        const monday = new Date(nextMonday).getDay();

        return `${strNextDate}(${daysOfWeek(monday)})`;
      } else {
        const strNextDate = moment(nextDate as any).format('YYYY.MM.DD');
        const strNextDay = daysOfWeek(nextDate.getDay());
        return `${strNextDate}(${strNextDay})`;
      }
    }

    let nextMonday = dateTime.getTime() + 60 * 60 * 24 * 1000 * 2;

    do {
      nextMonday += 60 * 60 * 24 * 1000;
    } while (new Date(nextMonday).getDay() !== 2);

    return `${moment(nextMonday).format('YYYY.MM.DD')}`;
  }, [item, payCardMethod]);

  const textPaymentCompleted = useMemo(() => {
    if (payCardMethod) {
      return '계좌 입금 완료되었습니다.';
    }
    return '충전금 충전 완료되었습니다.';
  }, [payCardMethod]);

  const textPaymentHeader = useMemo(() => {
    if (payCardMethod) {
      return '차주 화요일에 계좌 정산 예정입니다.';
    }
    return '카풀 완료후 2영업일이내 충전금 충전 예정입니다.';
  }, [payCardMethod]);

  const renderHeader = useMemo(() => {
    return (
      <PaddingHorizontalWrapper
        containerStyles={{paddingTop: heightScale1(10), gap: heightScale1(10)}}
        forDriveMe>
        <View>
          <HStack style={{gap: widthScale1(4)}}>
            {payCardMethod ? (
              <>
                <Icons.Wallet width={widthScale1(16)} height={widthScale1(16)} />
                <CustomText
                  forDriveMe
                  family={FONT_FAMILY.MEDIUM}
                  string="계좌 정산"
                  lineHeight={heightScale1(20)}
                />
              </>
            ) : (
              <>
                <Icons.Coin width={widthScale1(16)} height={widthScale1(16)} />
                <CustomText
                  forDriveMe
                  family={FONT_FAMILY.MEDIUM}
                  string="충전금 정산"
                  lineHeight={heightScale1(20)}
                />
              </>
            )}
          </HStack>

          <HStack
            style={{
              justifyContent: 'space-between',
            }}>
            <HStack style={{gap: widthScale1(6)}}>
              <CustomText
                string={paymentDate}
                forDriveMe
                size={FONT.CAPTION_7}
                family={FONT_FAMILY.MEDIUM}
              />
              <Icons.Dot />
              <CustomText
                string={Number(item?.incomePrice) > 0 ? '정산완료' : '정산예정'}
                forDriveMe
                family={FONT_FAMILY.MEDIUM}
                color={item?.payStatus !== 'Y' ? colors.disableButton : colors.heavyGray}
              />
            </HStack>
            <CustomText
              string={
                Number(item?.incomePrice) > 0
                  ? `${getNumberWithCommas(item?.incomePrice)}원`
                  : `${getNumberWithCommas(item?.estPrice)}원`
              }
              forDriveMe
              size={FONT.BODY}
              family={FONT_FAMILY.SEMI_BOLD}
              lineHeight={heightScale1(25)}
            />
          </HStack>
        </View>
        <PageButton
          text={item?.payStatus !== 'Y' ? textPaymentHeader : textPaymentCompleted}
          hideChevron
        />
      </PaddingHorizontalWrapper>
    );
  }, [item]);

  return (
    <FixedContainer>
      <CustomHeader text="상세정산내역" />

      <View>
        {renderHeader}
        <Divider insetsVertical={PADDING1} />
      </View>

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
          arriveAddress={item?.endPlace as any}
          stopOverAddress={item?.stopOverPlace ?? ''}
        />
        <InfoPriceRoute
          // originalPrice={Number(item?.price) > Number(item?.incomePrice) ? item?.price : undefined}
          originalPrice={Number(item?.price) > Number(item?.incomePrice) ? item?.price : undefined}
          price={Number(item?.incomePrice) > 0 ? item?.incomePrice : (item?.estPrice as string)}
          completePayment
          type={'FOR_DRIVER'}
          onPress={
            () =>
              navigation.navigate(ROUTE_KEY.DetailContentCarpool, {
                item: item as any,
                type: 'DRIVER_HISTORY',
              })
            // navigation.navigate(ROUTE_KEY.RouteRequestRegistrationDetail, {
            //   routeInfo: {
            //     ...item,
            //     endPlace: item?.endplace,
            //   } as any,
            //   viewMode: true,
            // })
          }
        />
      </PaddingHorizontalWrapper>
    </FixedContainer>
  );
});

export default AccountSettlementDetails;
