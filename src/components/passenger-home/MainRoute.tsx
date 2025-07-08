import React, {memo, useCallback, useMemo, useRef} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {DateData} from 'react-native-calendars';
import {Icons} from '~/assets/svgs';
import {MyDriverModel} from '~/model/driver-model';
import WorkdayCalendarModal, {
  WorkdayCalendarModalRefs,
} from '~components/calendar/workday-calendar-modal';
import CustomButton from '~components/commons/custom-button';
import ToastMessageController from '~components/commons/toast-message/toast-message-controller';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING, WIDTH} from '~constants/constant'; // PADDING1 추가
import {FONT, FONT_FAMILY} from '~constants/enum';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {cachePassengerFilter} from '~reducers/carpoolReducer';
import {clearTemporaryRoute} from '~reducers/userReducer';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils'; // heightScale 추가
import {dayjs} from '~utils/dayjsUtil';
import {getDayName} from '~utils/hourUtils';
import {useNavigation} from '@react-navigation/native'; // useNavigation 추가

interface Props {
  myRoadInfo?: MyDriverModel;
}

const MainRoute: React.FC<Props> = memo(props => {
  const {myRoadInfo} = props;
  const navigation = useNavigation<UseRootStackNavigation>();
  const dispatch = useAppDispatch();

  const currentPassengerModeFilter = useAppSelector(
    state => state?.carpoolReducer?.passengerModeFilter,
  );
  const selectedDay = currentPassengerModeFilter?.selectedDay;
  const transactionType = useAppSelector(
    state => state?.carpoolReducer?.passengerModeFilter?.carInOut,
  );
  const temporaryRoute = useAppSelector(state => state.userReducer.temporaryRoute);

  const calendarRef = useRef<WorkdayCalendarModalRefs>(null);

  const isWayHome = useMemo(() => transactionType === 'out', [transactionType]);

  const textStart = useMemo(() => {
    const startPlaceOut = temporaryRoute?.startPlaceOut || myRoadInfo?.startPlaceOut;
    const startPlaceIn = temporaryRoute?.startPlaceIn || myRoadInfo?.startPlaceIn;
    return isWayHome ? startPlaceOut : startPlaceIn;
  }, [isWayHome, temporaryRoute, myRoadInfo]);

  const textEnd = useMemo(() => {
    const endPlaceOut = temporaryRoute?.endPlaceOut || myRoadInfo?.endPlaceOut;
    const endPlaceIn = temporaryRoute?.endPlaceIn || myRoadInfo?.endPlaceIn;
    return isWayHome ? endPlaceOut : endPlaceIn;
  }, [isWayHome, temporaryRoute, myRoadInfo]);

  const onShowCalendar = () => {
    if (!currentPassengerModeFilter?.routeRegistrationComplete) {
      ToastMessageController.show(
        '모든 드라이버 선택시 기간 설정이 제한됩니다.\n등록 완료로 필터링 값을 변경한 후에는\n기간을 설정할 수 있습니다.',
      );
      return;
    }
    calendarRef?.current?.show(selectedDay);
  };

  const getRouteDefault = useCallback(() => {
    // useCallback으로 감싸기
    dispatch(clearTemporaryRoute());
  }, [dispatch]);

  const getDayFilterText = useMemo((): string => {
    const currentDate: DateData = {
      dateString: dayjs().format('YYYY-MM-DD'),
      month: Number(dayjs().format('MM')),
      day: Number(dayjs().format('DD')),
      year: Number(dayjs().format('YYYY')),
      timestamp: Number(dayjs().valueOf()),
    };

    const maxDate = dayjs().add(13, 'day'); // subtract(-13) -> add(13)
    const maxDateObj: DateData = {
      dateString: maxDate.format('YYYY-MM-DD'),
      month: Number(maxDate.format('MM')),
      day: Number(maxDate.format('DD')),
      year: Number(maxDate.format('YYYY')),
      timestamp: Number(maxDate.valueOf()),
    };

    if (selectedDay && selectedDay?.length === 1) {
      const retunredDay =
        dayjs(selectedDay[0]?.dateString, 'YYYY-MM-DD').format('MM월DD일') +
        `(${getDayName(dayjs(selectedDay[0]?.dateString, 'YYYY-MM-DD').valueOf())})`;
      return retunredDay;
    }

    if (selectedDay && selectedDay?.length === 2) {
      const checkCurrentDay = selectedDay[0]?.dateString === currentDate?.dateString;
      const checkMaxDay = selectedDay[1]?.dateString === maxDateObj?.dateString;
      if (checkCurrentDay && checkMaxDay) {
        return '전체기간';
      }

      const diffDate = dayjs(selectedDay?.[1].timestamp).diff(selectedDay?.[0].timestamp, 'day');
      if (diffDate > 13) {
        // '전체기간' 조건 우선
        return '전체기간';
      } else {
        const retunredFirstDay =
          dayjs(selectedDay[0]?.dateString, 'YYYY-MM-DD').format('MM월DD일') +
          `(${getDayName(dayjs(selectedDay[0]?.dateString, 'YYYY-MM-DD').valueOf())})`;
        const retunredSecondDay =
          dayjs(selectedDay[1]?.dateString, 'YYYY-MM-DD').format('MM월DD일') +
          `(${getDayName(dayjs(selectedDay[1]?.dateString, 'YYYY-MM-DD').valueOf())})`;
        return `${retunredFirstDay}\n~${retunredSecondDay}`;
      }
    }
    return '전체기간';
  }, [selectedDay, currentPassengerModeFilter]);

  const getButtonType = useMemo(() => {
    const commonButtonStyle = {
      borderRadius: 999,
      paddingHorizontal: widthScale1(14),
    };
    let isActive = false;

    if (isWayHome) {
      isActive = !temporaryRoute?.endCoordOut || !temporaryRoute?.startCoordOut;
    } else {
      isActive = !temporaryRoute?.endCoordIn || !temporaryRoute?.startCoordIn;
    }

    return (
      <CustomButton
        text="내경로"
        onPress={getRouteDefault}
        buttonHeight={32}
        textSize={FONT.CAPTION_6}
        buttonStyle={commonButtonStyle}
        type={isActive ? undefined : 'TERTIARY'} // 기본 타입을 undefined로 설정
        outLine={!isActive}
      />
    );
  }, [temporaryRoute, isWayHome, getRouteDefault]);

  return (
    // 👇 메인 컨테이너 그림자 구조 수정
    <View style={styles.shadowWrapper}>
      <View style={styles.contentWrapper}>
        <HStack style={styles.contentContainerStyle}>
          <Pressable onPress={onShowCalendar}>
            <HStack style={{gap: widthScale1(6)}}>
              <CustomText
                string={getDayFilterText}
                family={FONT_FAMILY.SEMI_BOLD}
                color={colors.heavyGray}
                forDriveMe
                lineHeight={20}
                numberOfLines={2} // 여러 줄 표시 허용
                textStyle={{textAlign: 'left'}} // 텍스트 정렬
              />
              <Icons.ChevronDown />
            </HStack>
          </Pressable>

          <HStack style={styles.buttonGroupWrapperStyle}>
            {/* 👇 출근길 버튼 그림자 구조 수정 */}
            <View style={!isWayHome ? styles.activeButtonShadowWrapper : {}}>
              <Pressable
                onPress={() => {
                  dispatch(
                    cachePassengerFilter({
                      ...currentPassengerModeFilter,
                      carInOut: 'in',
                    }),
                  );
                }}
                style={[
                  styles.buttonStyle,
                  {backgroundColor: !isWayHome ? colors.white : colors.transparent},
                ]}>
                <CustomText
                  size={FONT.CAPTION_6}
                  forDriveMe
                  color={!isWayHome ? colors.black : colors.disableButton}
                  string={'출근길'}
                  family={!isWayHome ? FONT_FAMILY.SEMI_BOLD : FONT_FAMILY.MEDIUM}
                />
              </Pressable>
            </View>
            {/* 👇 퇴근길 버튼 그림자 구조 수정 */}
            <View style={isWayHome ? styles.activeButtonShadowWrapper : {}}>
              <Pressable
                onPress={() => {
                  dispatch(
                    cachePassengerFilter({
                      ...currentPassengerModeFilter,
                      carInOut: 'out',
                    }),
                  );
                }}
                style={[
                  styles.buttonStyle,
                  {backgroundColor: isWayHome ? colors.white : colors.transparent},
                ]}>
                <CustomText
                  size={FONT.CAPTION_6}
                  forDriveMe
                  color={isWayHome ? colors.black : colors.disableButton}
                  string={'퇴근길'}
                  family={isWayHome ? FONT_FAMILY.SEMI_BOLD : FONT_FAMILY.MEDIUM}
                />
              </Pressable>
            </View>
          </HStack>
        </HStack>

        <HStack style={{justifyContent: 'space-between'}}>
          <Pressable
            onPress={() => {
              navigation.navigate(ROUTE_KEY.WayToWorkRegistration2, {
                textSearchFromValue: textStart,
                textSearchToValue: textEnd,
                isReturnRoute: isWayHome,
                focusTo: false,
              });
            }}
            style={styles.viewWrapperStyle}>
            <CustomText
              lineHeight={heightScale1(20)}
              numberOfLines={1}
              size={FONT.CAPTION_6}
              family={FONT_FAMILY.REGULAR}
              forDriveMe
              color={colors.black}
              string={textStart!}
            />
          </Pressable>

          <Icons.ChevronRight width={scale1(16)} height={scale1(16)} />

          <Pressable
            onPress={() => {
              navigation.navigate(ROUTE_KEY.WayToWorkRegistration2, {
                textSearchFromValue: textStart,
                textSearchToValue: textEnd,
                isReturnRoute: isWayHome,
                focusTo: true,
              });
            }}
            style={styles.viewWrapperStyle}>
            <CustomText
              lineHeight={heightScale1(20)}
              numberOfLines={1}
              size={FONT.CAPTION_6}
              family={FONT_FAMILY.REGULAR}
              forDriveMe
              color={colors.black}
              string={textEnd!}
            />
          </Pressable>

          {getButtonType}
        </HStack>

        <WorkdayCalendarModal ref={calendarRef} />
      </View>
    </View>
  );
});

export default MainRoute;

const styles = StyleSheet.create({
  // 메인 컨테이너의 그림자를 담당
  shadowWrapper: {
    marginHorizontal: PADDING,
    width: WIDTH - PADDING * 2,
    shadowColor: colors.shadowColor,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 10,
    // borderRadius: scale1(8), // 그림자 컨테이너에도 borderRadius를 주면 그림자가 더 자연스러울 수 있습니다.
  },
  // 메인 컨테이너의 실제 내용(배경, 패딩 등)을 담당
  contentWrapper: {
    backgroundColor: colors.white,
    paddingHorizontal: PADDING,
    paddingVertical: heightScale1(12),
    borderRadius: scale1(8),
    overflow: 'hidden', // 내부 요소가 borderRadius를 벗어나지 않도록
  },
  contentContainerStyle: {
    justifyContent: 'space-between',
    marginBottom: heightScale1(20),
  },
  // timeTextWrapperStyle, timeTextStyle는 getDayFilterText에서 CustomText의 props로 직접 관리
  buttonGroupWrapperStyle: {
    backgroundColor: colors.policy,
    padding: widthScale1(4),
    borderRadius: 999,
    overflow: 'hidden', // 내부 버튼이 부모의 borderRadius를 따르도록
  },
  // 출퇴근 버튼의 그림자를 담당 (활성화될 때만 적용)
  activeButtonShadowWrapper: {
    shadowColor: colors.shadowColor,
    shadowOffset: {width: 0, height: 1}, // 그림자 미세 조정
    shadowOpacity: 0.08, // 그림자 미세 조정
    shadowRadius: 5, // 그림자 미세 조정
    elevation: 5, // 그림자 미세 조정
    borderRadius: 999, // 그림자 모양을 위해 Pressable과 동일하게
  },
  buttonStyle: {
    minWidth: widthScale1(76),
    minHeight: heightScale1(30),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    paddingHorizontal: widthScale1(5), // 텍스트가 잘리지 않도록 약간의 패딩 추가
  },
  // buttonTextStyle은 CustomText props로 직접 관리
  viewWrapperStyle: {
    width: widthScale1(100),
  },
  // addressTextStyle은 CustomText props로 직접 관리
});
