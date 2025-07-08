import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {DateData, Direction, Theme} from 'react-native-calendars/src/types';
import {Icons} from '~/assets/svgs';
import CustomButton from '~components/commons/custom-button';
import ToastMessage from '~components/commons/toast-message/toast-message';
import ToastMessageController from '~components/commons/toast-message/toast-message-controller';
import CustomBackdrop from '~components/custom-backdrop';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {cachePassengerFilter} from '~reducers/carpoolReducer';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import CustomText from '../custom-text';

interface Props {
  onSubmit?: (data: DateData[]) => void;
}

export interface WorkdayCalendarModalRefs {
  show: (data: DateData[]) => void;
  hide: () => void;
}

const WorkdayCalendarModal = memo(
  forwardRef((props: Props, ref) => {
    const {onSubmit} = props;
    const currentPassengerModeFilter = useAppSelector(
      state => state?.carpoolReducer?.passengerModeFilter,
    );

    const modalRef = useRef<BottomSheetModal>(null);
    const dispatch = useAppDispatch();

    const [selectedDate, setSelectedDate] = useState<DateData[]>(
      currentPassengerModeFilter?.selectedDay ?? [],
    );

    useImperativeHandle(ref, () => ({
      show: show,
      hide: hide,
    }));

    const show = (data: DateData[]) => {
      setSelectedDate(data);
      modalRef?.current?.present();
    };
    const hide = () => {
      modalRef?.current?.close();
    };

    const renderArrow = useCallback((props: Direction) => {
      if (props === 'left') {
        return <Icons.ChevronLeft />;
      }
      return <Icons.ChevronRight width={widthScale1(24)} height={widthScale1(24)} />;
    }, []);

    const renderHeader = useCallback((date: any) => {
      return (
        <CustomText
          string={dayjs(date).format('YYYY년 MM월')}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.BODY}
          forDriveMe
        />
      );
    }, []);

    const calculateDate = (array: DateData[]) => {
      const newArray: DateData[] = [array[0]];

      while (newArray?.[newArray.length - 1]?.dateString !== array?.[1]?.dateString) {
        const newDate = dayjs(newArray?.[newArray.length - 1]?.dateString).add(1, 'day');
        const newObject: DateData = {
          dateString: newDate.format('YYYY-MM-DD'),
          month: Number(newDate.format('MM')),
          day: Number(newDate.format('DD').toString()),
          year: Number(newDate.format('YYYY').toString()),
          timestamp: Number(newDate.valueOf()),
        };
        newArray.push(newObject);
      }
      return newArray;
    };

    const markedDates = () => {
      const newSelectedDate = [...selectedDate];
      newSelectedDate.sort((a, b) => a.year - b.year);
      if (newSelectedDate?.length === 1) {
        return {
          [selectedDate[0].dateString]: {
            startingDay: true,
            textColor: colors.white,
            customContainerStyle: styles.customMarking,
            customFillerStyles: styles.customFiller,
          },
        };
      }
      if (newSelectedDate?.length === 2) {
        newSelectedDate.sort((a, b) => a.timestamp - b.timestamp);
        const listChoosedDate = calculateDate(newSelectedDate);

        const object = listChoosedDate.reduce((result, item, index) => {
          if (dayjs(item?.dateString).day() !== 0 && dayjs(item?.dateString).day() !== 6) {
            const newResult = {
              ...result,
              [item.dateString]: {
                startingDay: index === 0,
                endingDay: index === listChoosedDate.length - 1,
                color: '#FFF2F2',
                textColor:
                  index === 0 || index === listChoosedDate.length - 1
                    ? colors.white
                    : colors.menuTextColor,
                customContainerStyle: {
                  width: scale1(30),
                  height: scale1(30),
                  borderRadius: 99,
                  backgroundColor:
                    index === 0 || index === listChoosedDate.length - 1
                      ? colors.primary
                      : undefined,
                },
                customFillerStyles: styles.customFiller,
              },
            };
            return newResult;
          }
          return result;
        }, {});
        return object;
      }
      return {};
    };

    const onDayPress = (date: DateData) => {
      if (selectedDate && selectedDate?.length === 0) {
        setSelectedDate([date]);
        return;
      }
      if (selectedDate?.length === 2) {
        setSelectedDate([date]);
        return;
      }
      if (selectedDate?.find(d => d.dateString === date.dateString)) {
        setSelectedDate(selectedDate.filter(d => d.dateString !== date.dateString));
      } else {
        const temp = [...selectedDate, date];
        temp.sort((a, b) => {
          if (a.month !== a.month) {
            return a.month - b.month;
          } else {
            return a.day - b.day;
          }
        });
        setSelectedDate(temp);
      }
    };

    const onResetPress = () => {
      const currentDate: DateData = {
        dateString: dayjs().format('YYYY-MM-DD'),
        month: Number(dayjs().format('MM')),
        day: Number(dayjs().format('DD')),
        year: Number(dayjs().format('YYYY')),
        timestamp: Number(dayjs().valueOf()),
      };

      const maxDate = dayjs().subtract(-13, 'day');
      const maxDateObj: DateData = {
        dateString: maxDate.format('YYYY-MM-DD'),
        month: Number(maxDate.format('MM')),
        day: Number(maxDate.format('DD')),
        year: Number(maxDate.format('YYYY')),
        timestamp: Number(maxDate.valueOf()),
      };
      setSelectedDate([currentDate, maxDateObj]);
    };

    const onDonePress = () => {
      hide();
      const newArray = [...selectedDate];
      newArray.sort((a, b) => a.timestamp - b.timestamp);
      if (!newArray.length) {
        const currentDate: DateData = {
          dateString: dayjs().format('YYYY-MM-DD'),
          month: Number(dayjs().format('MM')),
          day: Number(dayjs().format('DD')),
          year: Number(dayjs().format('YYYY')),
          timestamp: Number(dayjs().valueOf()),
        };

        const maxDate = dayjs().subtract(-13, 'day');
        const maxDateObj: DateData = {
          dateString: maxDate.format('YYYY-MM-DD'),
          month: Number(maxDate.format('MM')),
          day: Number(maxDate.format('DD')),
          year: Number(maxDate.format('YYYY')),
          timestamp: Number(maxDate.valueOf()),
        };

        newArray.unshift(currentDate, maxDateObj);
      }

      if (onSubmit) {
        onSubmit(newArray);
        return;
      }

      dispatch(
        cachePassengerFilter({
          ...currentPassengerModeFilter,
          selectedDay: newArray,
        }),
      );
    };

    const theme: Theme = useMemo(
      () => ({
        dayTextColor: colors.menuTextColor,
        selectedDayTextColor: colors.white,
        textDayFontFamily: FONT_FAMILY.SEMI_BOLD,
        todayTextColor: colors.primary,
        periodContainerStyle: {
          marginVertical: heightScale1(18),
        },
        textDayFontWeight: '600',
        periodStyle: {
          height: scale1(30),
          width: scale1(30),
        },
        textDayFontSize: 18,
      }),
      [],
    );

    const onPressLeft = (subtractMonth: () => void, month: any) => {
      if (dayjs().month() === dayjs(month).month()) {
        ToastMessageController.show('카풀은 최대 2주이내로만 등록이 가능합니다.');
      } else {
        subtractMonth();
      }
    };

    const onPressRight = (addMonth: () => void, month: any) => {
      const maximumDate = dayjs().add(14, 'day');

      const maximumMonth = dayjs(maximumDate).month() + 1;

      const nextMonth = dayjs(month).month() + 2;

      if (nextMonth > maximumMonth) {
        ToastMessageController.show('카풀은 최대 2주이내로만 등록이 가능합니다.');
      } else if (
        (dayjs().year() !== dayjs(maximumDate).year() &&
          dayjs(month).year() !== dayjs(maximumDate).year()) ||
        (dayjs().year() === dayjs(maximumDate).year() && maximumMonth > dayjs(month).month() + 1)
      ) {
        addMonth();
      } else {
        ToastMessageController.show('카풀은 최대 2주이내로만 등록이 가능합니다.');
      }
    };

    return (
      <BottomSheetModal
        ref={modalRef}
        enableDynamicSizing
        enablePanDownToClose
        index={0}
        backdropComponent={props => <CustomBackdrop {...props} onPressBackdrop={hide} />}
        handleComponent={() => null}>
        <StatusBar backgroundColor={colors.transparent} />

        <BottomSheetView style={styles.contentStyle}>
          <Calendar
            renderArrow={renderArrow}
            renderHeader={renderHeader}
            firstDay={1}
            onDayPress={onDayPress}
            markedDates={markedDates()}
            onPressArrowLeft={onPressLeft}
            onPressArrowRight={onPressRight}
            markingType={'period'}
            hideExtraDays
            minDate={`${
              selectedDate?.length && selectedDate?.[0]?.timestamp < dayjs().valueOf()
                ? dayjs(selectedDate?.[0].dateString).format('YYYY-MM-DD')
                : dayjs().format('YYYY-MM-DD')
            }`}
            maxDate={`${dayjs().subtract(-13, 'day').format('YYYY-MM-DD')}`}
            theme={theme}
            style={styles.calendarContainer}
            dayNameStyle={{
              fontFamily: FONT_FAMILY.SEMI_BOLD,
              fontSize: fontSize1(11),
              color: colors.heavyGray,
              lineHeight: heightScale1(15),
              width: widthScale1(37),
            }}
            daysNameContainerStyle={{
              marginTop: heightScale1(20),
            }}
          />

          <HStack style={styles.buttonGroupContainer}>
            <CustomButton
              text="초기화"
              onPress={onResetPress}
              buttonHeight={58}
              leftIconReload
              outLine
              type={'TERTIARY'}
            />
            <CustomButton
              text="완료"
              onPress={onDonePress}
              buttonHeight={58}
              buttonStyle={{flex: 1}}
            />
          </HStack>
        </BottomSheetView>

        <ToastMessage
          containerStyle={{
            bottom: heightScale1(250),
          }}
        />
      </BottomSheetModal>
    );
  }),
);

export default WorkdayCalendarModal;

const styles = StyleSheet.create({
  containerStyle: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  contentStyle: {
    backgroundColor: colors.white,
    paddingTop: PADDING1,
    borderTopLeftRadius: scale1(16),
    borderTopRightRadius: scale1(16),
    paddingBottom: heightScale1(42),
  },
  calendarContainer: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  customMarking: {
    width: scale1(30),
    height: scale1(30),
    borderRadius: 99,
    backgroundColor: colors.primary,
  },
  customFiller: {
    height: scale1(30),
  },
  buttonGroupContainer: {
    marginTop: heightScale1(20),
    paddingHorizontal: PADDING1,
    gap: widthScale1(10),
  },
});
