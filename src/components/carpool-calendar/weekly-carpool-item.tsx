import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {memo, useCallback, useMemo} from 'react';
import {Pressable} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import AppModal from '~components/app-modal';
import CustomButton from '~components/commons/custom-button';
import InfoPriceRoute from '~components/commons/info-price-route';
import RouteBadge from '~components/commons/route-badge';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import Spinner from '~components/spinner';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {DriverRoadDayModel} from '~model/driver-model';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useDeleteDailyRouteMutation} from '~services/carpoolServices';
import {useGetPayHistoryDriverQuery} from '~services/driverServices';
import {useGetDrivingDirectionQuery} from '~services/naverMapServices';
import {colors} from '~styles/colors';
import {widthScale1} from '~styles/scaling-utils';
import {carpoolStatusValue} from '~utils/getRouteStateValue';

interface Props {
  item: DriverRoadDayModel;
  onDeleteRouteSuccess: () => void;
  isPastDay?: boolean;
}

const WeeklyCarpoolItem: React.FC<Props> = memo(props => {
  const {item, onDeleteRouteSuccess, isPastDay = false} = props;
  const navigation: UseRootStackNavigation = useNavigation();
  const {userID, myDriverInfo} = userHook();

  const startDirection = useMemo(() => {
    return `${item.splng},${item.splat}`;
  }, [item]);

  const endDirection = useMemo(() => {
    return `${item.eplng},${item.eplat}`;
  }, [item]);

  const stopDirection = useMemo(() => {
    return `${item.soplng},${item.soplat}`;
  }, [item]);

  const {data: direction} = useGetDrivingDirectionQuery({
    start: startDirection,
    end: item?.amt === item?.soPrice ? stopDirection : endDirection,
    waypoints: item?.soplat ? stopDirection : '',
  });

  const [deleteDailyRoute] = useDeleteDailyRouteMutation();
  const {data: paymentHistoryList} = useGetPayHistoryDriverQuery({
    d_memberId: userID,
    filterftDate: 1,
    filterInOut: item?.carInOut === 'in' ? 1 : 0,
    filterState: 2,
    frDate: moment(item?.selectDay?.slice(0, 10), 'YYYY.MM.DD').format('YYYY-MM-DD'),
    toDate: moment(item?.selectDay?.slice(0, 10), 'YYYY.MM.DD').format('YYYY-MM-DD'),
  });
  const paymentHistory = useMemo(() => {
    if (paymentHistoryList && paymentHistoryList?.length > 0) {
      return paymentHistoryList[0];
    }
    return null;
  }, [paymentHistoryList]);

  const endTime = useMemo((): string => {
    return item?.endTime
      ? item?.endTime
      : item?.startTime && direction?.duration
        ? moment(item?.startTime, 'HH:mm').add(direction?.duration, 'minutes').format('HH:mm')
        : '';
  }, [direction?.duration, item?.startTime, item?.endTime]);

  const onDeleteRoute = () => {
    AppModal.show({
      title: '등록된 운행내역을 삭제하시겠습니까?',
      content: '삭제된 운행 등록내역은 복구 불가합니다.',
      textYes: '삭제',
      yesFunc: () => {
        Spinner.show();
        deleteDailyRoute({id: item?.id, cMemberId: item?.c_memberId})
          .unwrap()
          .then(() => {
            onDeleteRouteSuccess && onDeleteRouteSuccess();
          })
          .finally(() => {
            Spinner.hide();
          });
      },
      textNo: '닫기',
      isTwoButton: true,
    });
  };

  const handleGoToPaymentHistory = useCallback(() => {
    if (paymentHistory) {
      navigation.navigate(ROUTE_KEY.DetailContentCarpool, {
        type: 'DRIVER_HISTORY',
        item: paymentHistory,
      });
    } else {
      showMessage({
        message: '해당 카풀 관련 이용내역이 없습니다. 다시 확인해주세요.',
      });
    }
  }, [paymentHistory]);

  const paymentPrice = useMemo(() => {
    return item?.amt ? (item?.amt === item?.price ? item?.price : item?.soPrice) : item?.price;
  }, [item]);

  const payCardMethod = useMemo(() => {
    return myDriverInfo?.calYN === 'M' ? true : false;
  }, [myDriverInfo]);

  const cancelPricePayment = useMemo(() => {
    // CANCEL
    if (item?.state === 'C') {
      if (item?.cancelRequestBy === 'DRIVER') {
        if (item?.cancelAmt) {
          return `${Number(paymentPrice) - Number(item?.cancelAmt)}`;
        }
        return `${paymentPrice}`;
      } else {
        return '0';
      }
    }

    // COMPLETE
    if (item?.state === 'E' || item?.state === 'R' || item?.state === 'O') {
      if (payCardMethod) {
        const price = Number(paymentPrice) - Number(paymentPrice) * 0.25;
        return `${price}`;
      }
      const price = Number(paymentPrice) - Number(paymentPrice) * 0.2;
      return `${price}`;
    }

    // PENALTY
    if (
      (item?.state === 'P' && item?.cancelRequestBy === 'DRIVER') ||
      item?.penaltyRequestBy === 'DRIVER'
    ) {
      return `${Number(paymentPrice) * 2}`;
    }
    if (
      (item?.state === 'P' && item?.cancelRequestBy === 'PASSENGER') ||
      item?.penaltyRequestBy === 'PASSENGER'
    ) {
      return '0';
    }

    return `${paymentPrice}`;
  }, [item, payCardMethod, paymentPrice]);

  return (
    <Pressable
      onPress={handleGoToPaymentHistory}
      disabled={item?.state !== 'E'}
      style={{gap: PADDING1}}>
      <HStack
        style={{
          justifyContent: 'space-between',
        }}>
        <HStack style={{gap: widthScale1(10)}}>
          <RouteBadge
            disabled={isPastDay}
            type={item?.carInOut === 'in' ? 'WAY_WORK' : 'WAY_HOME'}
          />
          <CustomText
            string={isPastDay && item?.state === 'N' ? '기한만료' : carpoolStatusValue(item?.state)}
            forDriveMe
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_7}
            color={
              isPastDay || item?.state === 'E' || item?.state === 'C'
                ? colors.disableButton
                : colors.heavyGray
            }
          />
        </HStack>
        {/* Delete route */}
        {(item?.state === 'N' || item?.state === 'A') && !isPastDay ? (
          <CustomButton
            type="TERTIARY"
            outLine
            buttonHeight={38}
            text="삭제"
            buttonStyle={{
              paddingHorizontal: widthScale1(10),
              minWidth: widthScale1(45),
            }}
            borderRadiusValue={6}
            onPress={onDeleteRoute}
          />
        ) : null}
      </HStack>

      {isPastDay && item?.state === 'N' ? (
        <CustomText
          forDriveMe
          family={FONT_FAMILY.MEDIUM}
          string="일정 등록내역 기간만료로 삭제처리 되었습니다."
          color={colors.disableButton}
        />
      ) : (
        <>
          <RoutePlanner
            arriveAddress={
              item?.amt === item?.soPrice ? (item?.stopOverPlace ?? '') : (item?.endPlace ?? '')
            }
            startAddress={item?.startPlace}
            timeStart={item?.startTime}
            timeArrive={endTime ? endTime : '--:--'}
            stopOverAddress={
              item?.state !== 'N' && item?.state !== 'A' ? '' : (item?.stopOverPlace ?? '')
            }
            isParkingFrom={item?.startParkId ? true : false}
            isParking={item?.endParkId ? true : false}
            hideExpectations={item?.endTime ? true : false}
          />

          <InfoPriceRoute
            price={cancelPricePayment as string}
            soPrice={
              (item?.state === 'N' || item?.state === 'A') && item?.soplat && item?.soplng
                ? (item?.soPrice ?? '')
                : ''
            }
            completePayment={item?.state === 'R' || item?.state === 'O' || item?.state === 'E'}
            // carpoolPrice={item?.state === 'R'}
            isRegistrationCompleted={item?.state === 'A'}
            type={'FOR_DRIVER'}
            hideChevron={item?.state === 'E' ? false : true}
          />
        </>
      )}
    </Pressable>
  );
});

export default WeeklyCarpoolItem;
