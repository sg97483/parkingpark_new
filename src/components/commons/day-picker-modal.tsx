import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
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
import CustomBackdrop from '~components/custom-backdrop';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {dayjs} from '~utils/dayjsUtil';
import CustomButton from './custom-button';
import ToastMessage from './toast-message/toast-message';
import ToastMessageController from './toast-message/toast-message-controller';

interface Props {
  onSubmitPress: (value?: DateData) => void;
  onlyTwoWeeks?: boolean;
  specMinDate?: string; //YYYY-MM-DD
  showResetButton?: boolean;
  onPressRouteRequest?: (value?: DateData) => void;
}

export interface DayPickerModalRefs {
  show: (selectedDay?: DateData) => void;
  hide: () => void;
}

const DayPickerModal = forwardRef((props: Props, ref) => {
  const {
    onSubmitPress,
    onlyTwoWeeks = false,
    specMinDate,
    showResetButton,
    onPressRouteRequest,
  } = props;

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const minDate = specMinDate ? specMinDate : dayjs().format('YYYY-MM-DD');

  const maxDate = dayjs().add(14, 'days').format('YYYY-MM-DD');

  const [day, setDay] = useState<DateData>();

  const show = useCallback((selectedDay?: DateData) => {
    if (selectedDay) {
      setDay(selectedDay);
    }
    bottomSheetRef?.current?.present();
  }, []);

  const hide = useCallback(() => {
    setDay(undefined);
    bottomSheetRef?.current?.dismiss();
  }, []);

  useImperativeHandle(ref, () => ({show, hide}), []);

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

  const renderArrow = useCallback((props: Direction) => {
    if (props === 'left') {
      return <Icons.ChevronLeft />;
    }
    return <Icons.ChevronRight width={widthScale1(24)} height={widthScale1(24)} />;
  }, []);

  const onDayPress = (date: DateData) => {
    if (day) {
      setDay(undefined);
    } else {
      setDay(date);
    }
  };

  const renderMarkedDate = useMemo(() => {
    return {
      [`${day?.dateString}`]: {
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
  }, [day]);

  const onResetPress = () => {
    setDay(undefined);
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      backdropComponent={props => <CustomBackdrop {...props} onPressBackdrop={hide} />}
      enablePanDownToClose
      index={0}
      handleComponent={() => null}
      enableDynamicSizing>
      <BottomSheetView style={styles.containerStyle}>
        <StatusBar backgroundColor={colors.transparent} />
        <Calendar
          theme={theme}
          renderArrow={renderArrow}
          dayNameStyle={{
            fontFamily: FONT_FAMILY.SEMI_BOLD,
            fontSize: fontSize1(11),
            fontWeight: '600',
            color: colors.heavyGray,
            lineHeight: heightScale1(15),
            width: widthScale1(37),
            marginBottom: 0,
          }}
          hideExtraDays
          renderHeader={renderHeader}
          basicDayContainerStyle={styles.basicDayContainer}
          daysNameContainerStyle={styles.daysNameContainer}
          onDayPress={onDayPress}
          markedDates={renderMarkedDate}
          minDate={onlyTwoWeeks ? minDate : undefined}
          maxDate={`${dayjs().subtract(-13, 'day').format('YYYY-MM-DD')}`}
          onPressArrowLeft={(prevMonth, month) => {
            if (!onlyTwoWeeks) {
              prevMonth();
              return;
            }
            const currentMonth = dayjs(month).month() + 1;
            const minMonth = dayjs(minDate).month() + 1;
            if (currentMonth > minMonth) {
              prevMonth();
              return;
            }
            ToastMessageController.show('카풀은 최대 2주이내로만 등록이 가능합니다.');
          }}
          onPressArrowRight={(nextMonth, month) => {
            if (!onlyTwoWeeks) {
              nextMonth();
              return;
            }
            const currentMonth = dayjs(month).month() + 1;
            const maxMonth = dayjs(maxDate).month() + 1;
            if (currentMonth < maxMonth) {
              nextMonth();
              return;
            }
            ToastMessageController.show('카풀은 최대 2주이내로만 등록이 가능합니다.');
          }}
        />
        <HStack style={styles.buttonGroupContainer}>
          {showResetButton ? (
            <CustomButton
              text="초기화"
              onPress={onResetPress}
              buttonHeight={58}
              leftIconReload
              outLine
              type={'TERTIARY'}
            />
          ) : null}

          <CustomButton
            onPress={() => {
              if (onPressRouteRequest) {
                onPressRouteRequest(day);
              } else {
                hide();
                onSubmitPress && onSubmitPress(day);
              }
            }}
            text="완료"
            buttonHeight={58}
            buttonStyle={styles.submitButtonStyle}
          />
        </HStack>

        <ToastMessage
          containerStyle={{
            marginBottom: heightScale1(90),
          }}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});
export default DayPickerModal;

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: heightScale1(40),
    borderTopLeftRadius: scale1(16),
    borderTopRightRadius: scale1(16),
  },
  buttonGroupContainer: {
    marginTop: heightScale1(20),
    paddingHorizontal: PADDING1,
    marginBottom: heightScale1(42),
    gap: widthScale1(10),
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
    marginBottom: heightScale1(6),
  },
  submitButtonStyle: {
    flex: 1,
  },
});
