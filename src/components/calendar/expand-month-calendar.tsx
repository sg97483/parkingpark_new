import React, {memo, useCallback, useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {ExpandableCalendar} from 'react-native-calendars';
import {DateData, Theme} from 'react-native-calendars/src/types';
import {showMessage} from 'react-native-flash-message';
import {Icons} from '~/assets/svgs';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {DriverRoadDayModel} from '~model/driver-model';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {dayjs} from '~utils/dayjsUtil';
import CustomDot from '../custom-dot';
import CustomText from '../custom-text';
import HStack from '../h-stack';
import BookingStatus from './booking-status';
import moment from 'moment';
import LoadingComponent from '~components/loading-component';

interface Props {
  myRoadRegisterd: DriverRoadDayModel[];
  selectedDate: DateData;
  onDateChange: (newDate: DateData) => void;
  isLoading: boolean;
}

const ExpandMonthCalendar: React.FC<Props> = memo(props => {
  const {myRoadRegisterd, selectedDate, onDateChange, isLoading} = props;

  const onDayPress = useCallback((date: DateData) => {
    onDateChange && onDateChange(date);
  }, []);

  const maximumDate = moment().add(13, 'days');

  const renderCalendarHeader = useCallback(
    (onPressLeft: () => void, onPressRight: () => void, month: number) => {
      return (
        <HStack style={styles.headerContainer}>
          <HStack>
            <Pressable
              hitSlop={20}
              onPress={() => {
                onPressLeft();
              }}>
              <Icons.ChevronLeft width={scale1(16)} height={scale1(16)} />
            </Pressable>

            <View style={{paddingHorizontal: widthScale1(6)}}>
              <CustomText
                string={dayjs(month).format('YYYY년 MM월')}
                size={FONT.CAPTION_7}
                family={FONT_FAMILY.SEMI_BOLD}
                forDriveMe
              />
            </View>

            <Pressable
              hitSlop={20}
              onPress={() => {
                const currentDate = moment(new Date(month));

                if (
                  moment(currentDate).isBefore(maximumDate) &&
                  moment(currentDate).format('YYYYMM') !== moment(maximumDate).format('YYYYMM')
                ) {
                  onPressRight();
                  return;
                }
                showMessage({
                  message: '카풀은 최대 2주이내로만 등록이 가능합니다.',
                });
              }}>
              <Icons.ChevronRight width={scale1(16)} height={scale1(16)} />
            </Pressable>
          </HStack>
          <HStack>
            <HStack style={styles.bookingDoneContainer}>
              <CustomDot style={styles.dotContainer} color={colors.success} size={scale1(10)} />
              <CustomText
                string="예약완료"
                family={FONT_FAMILY.MEDIUM}
                color={colors.grayText2}
                forDriveMe
              />
            </HStack>
            <HStack>
              <CustomDot
                style={styles.dotContainer}
                color={colors.disableButton}
                size={scale1(10)}
              />
              <CustomText
                string="등록완료"
                family={FONT_FAMILY.MEDIUM}
                color={colors.grayText2}
                forDriveMe
              />
            </HStack>
          </HStack>
        </HStack>
      );
    },
    [maximumDate, onDayPress],
  );

  const renderBookingStatus = useCallback(
    (date: DateData) => {
      return <BookingStatus date={date} bookingData={myRoadRegisterd} />;
    },
    [myRoadRegisterd],
  );

  const theme: Theme = useMemo(
    () => ({
      dayTextColor: colors.menuTextColor,
      selectedDayTextColor: colors.white,
      todayTextColor: colors.primary,
      textDayFontFamily: FONT_FAMILY.SEMI_BOLD,
      textDayFontSize: fontSize1(18),
      textDayFontWeight: '600',
      periodStyle: {
        height: scale1(30),
        width: scale1(30),
        justifyContent: 'center',
      },
    }),
    [],
  );

  const markedDates = useMemo(() => {
    return {
      [`${selectedDate?.dateString}`]: {
        customStyles: {
          container: {
            backgroundColor: colors.primary,
          },
          text: {
            color: colors.white,
            marginTop: 0,
          },
        },
      },
    };
  }, [selectedDate, myRoadRegisterd]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <View style={styles.containerStyle}>
      <ExpandableCalendar
        firstDay={1}
        theme={theme}
        markedDates={markedDates}
        customNewHeader={renderCalendarHeader}
        onDayPress={onDayPress}
        dayNameStyle={styles.dayName}
        renderBookingStatus={renderBookingStatus}
        daysNameContainerStyle={styles.daysNameContainer}
        basicDayContainerStyle={styles.basicDayContainer}
        knobHeight={heightScale1(31)}
        allowShadow={false}
        knobUnnecessaryHeight={heightScale1(5)}
        knobStyle={styles.knobStyle}
        maxDate={maximumDate.format('YYYY-MM-DD')}
        blurPastDay
      />
    </View>
  );
});

export default ExpandMonthCalendar;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
    borderBottomEndRadius: scale1(16),
    borderBottomStartRadius: scale1(16),
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 2,
      height: 15,
    },
    shadowRadius: 10,
    shadowOpacity: 0.04,
    elevation: 5,
  },
  bookingDoneContainer: {marginRight: scale1(16)},
  dotContainer: {
    marginRight: scale1(5),
  },
  miniDotContainer: {
    marginRight: scale1(4),
  },
  dayName: {
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    fontSize: fontSize1(11),
    fontWeight: '600',
    color: colors.heavyGray,
    lineHeight: heightScale1(15),
    width: widthScale1(37),
  },
  basicDayContainer: {
    height: heightScale1(30),
    width: widthScale1(37),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: heightScale1(10),
  },
  daysNameContainer: {
    marginTop: heightScale1(20),
  },
  headerContainer: {
    justifyContent: 'space-between',
    paddingHorizontal: widthScale1(20),
    paddingTop: heightScale1(20),
  },
  knobStyle: {
    height: heightScale1(5),
    width: widthScale1(40),
    backgroundColor: colors.disableButton,
    marginBottom: heightScale1(10),
  },
});
