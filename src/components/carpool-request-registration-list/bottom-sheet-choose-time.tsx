import dayjs from 'dayjs';
import React, {forwardRef, memo, useCallback, useImperativeHandle, useMemo, useState} from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {DateData, Direction, MarkedDates, Theme} from 'react-native-calendars/src/types';
import ReactNativeModal from 'react-native-modal';
import {Icons} from '~/assets/svgs';
import CustomButton from '~components/commons/custom-button';
import {PADDING, PADDING1} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize, fontSize1} from '~styles/typography';

interface PropsWithoutNoButton {
  onChoose?: (date: DateData) => void;
  isShowButton?: false | undefined;
}
interface PropsWithoutButton {
  onChoose?: (date: DateData) => void;
  isShowButton: true;
  textButton: string;
  onPressButton?: () => void;
}

export type BottomSheetChooseTimeProps = PropsWithoutButton | PropsWithoutNoButton;

export interface BottomSheetChooseTimeRef {
  show: (date?: DateData) => void;
  hide: () => void;
}

const BottomSheetChooseTime = forwardRef<BottomSheetChooseTimeRef, BottomSheetChooseTimeProps>(
  (props, ref) => {
    const {onChoose, isShowButton, onPressButton, textButton} = props as any;

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<DateData[]>([]);

    const show = (date?: DateData) => {
      setSelectedDate(date ? [date] : []);
      setIsVisible(true);
    };
    const hide = () => {
      setIsVisible(false);
    };
    useImperativeHandle(ref, () => ({show: show, hide: hide}), []);

    const renderArrow = useCallback((props: Direction) => {
      if (props === 'left') {
        return <Icons.ChevronLeft />;
      }
      return <Icons.ChevronRight width={widthScale1(24)} height={widthScale1(24)} />;
    }, []);

    const renderHeader = useCallback((date: any) => {
      return <Text style={styles.headerTextStyle}>{dayjs(date).format('YYYY년 MM월')}</Text>;
    }, []);

    const markedDates: MarkedDates = useMemo(() => {
      if (selectedDate?.length === 1) {
        return {
          [selectedDate[0].dateString]: {
            startingDay: true,
            textColor: colors.white,
            customContainerStyle: styles.customMarking,
            customFillerStyles: styles.customFiller,
          },
        };
      }

      return {};
    }, [selectedDate]);

    const onDayPress = (date: DateData) => {
      setSelectedDate([date]);
      !isShowButton && hide();
      !isShowButton && onChoose?.(date);
    };

    const theme: Theme = useMemo(
      () => ({
        dayTextColor: colors.menuTextColor,
        selectedDayTextColor: colors.white,
        todayTextColor: colors.primary,
        textDayFontFamily: FONT_FAMILY.SEMI_BOLD,
        textDayFontSize: fontSize(18),
        textDayFontWeight: '600',
        periodContainerStyle: {marginVertical: heightScale1(5)},
        periodStyle: {height: scale1(25), width: scale1(25)},
      }),
      [],
    );

    return (
      <ReactNativeModal
        useNativeDriver
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropOpacity={0.6}
        backdropColor={colors.black}
        style={styles.containerStyle}
        isVisible={isVisible}
        onBackButtonPress={hide}
        onBackdropPress={hide}>
        <Pressable onPress={hide} style={styles.viewContent}>
          <Pressable style={[styles.contentStyle, {paddingBottom: heightScale1(42)}]}>
            <Calendar
              renderArrow={renderArrow}
              renderHeader={renderHeader}
              firstDay={1}
              onDayPress={onDayPress}
              markedDates={markedDates}
              markingType={'period'}
              hideExtraDays
              minDate={`${dayjs().format('YYYY-MM-DD')}`}
              maxDate={`${dayjs().subtract(-14, 'day').format('YYYY-MM-DD')}`}
              theme={theme}
              style={styles.calendarContainer}
              dayNameStyle={{
                fontFamily: FONT_FAMILY.SEMI_BOLD,
                fontSize: fontSize1(11),
                color: colors.heavyGray,
                lineHeight: heightScale1(15),
                width: widthScale1(37),
              }}
            />
            {isShowButton && (
              <CustomButton
                text={textButton}
                onPress={() => {
                  // onPressButton?.();
                  onChoose?.(selectedDate[0]);
                  hide();
                }}
                buttonHeight={58}
                buttonStyle={{marginHorizontal: PADDING1, marginTop: heightScale1(30)}}
              />
            )}
          </Pressable>
        </Pressable>
      </ReactNativeModal>
    );
  },
);

export default memo(BottomSheetChooseTime);

const styles = StyleSheet.create({
  viewContent: {
    backgroundColor: colors.modal,
    flex: 1,
    justifyContent: 'flex-end',
  },
  containerStyle: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  contentStyle: {
    backgroundColor: colors.white,
    paddingTop: PADDING,
    borderTopLeftRadius: scale1(16),
    borderTopRightRadius: scale1(16),
  },
  headerTextStyle: {
    fontSize: fontSize1(18),
    fontFamily: FONT_FAMILY.SEMI_BOLD,
  },
  calendarContainer: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  customMarking: {
    width: scale1(25),
    height: scale1(25),
    borderRadius: 99,
    backgroundColor: colors.primary,
  },
  customFiller: {
    height: scale1(25),
  },
  button: {
    marginHorizontal: PADDING,
    height: heightScale1(55),
    borderRadius: 8,
    marginTop: heightScale1(20),
  },
});
