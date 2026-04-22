import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import moment from 'moment';
import {forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {LocaleConfig} from 'react-native-calendars';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomBackdrop from '~components/custom-backdrop';
import CustomButton from '~components/commons/custom-button';
import CustomText from '~components/custom-text';
import {FONT_FAMILY} from '~constants/enum';
import {ParkingRestrictionProps} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

LocaleConfig.locales['ko'] = {
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
  dayNamesShort: ['일','월','화','수','목','금','토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

interface Props {
  onConfirm?: (date: Date) => void;
  maximumDate?: number;
  soldOutDateStr?: string;
  disabledDayNames?: string;
  restrictedRanges?: ParkingRestrictionProps[];
}

export interface CalendarPickerRefs {
  show: () => void;
  hide: () => void;
}

const DAY_NAMES_KO = ['일', '월', '화', '수', '목', '금', '토'] as const;
const getDayNameKo = (date: moment.Moment): string => DAY_NAMES_KO[date.day()] ?? '';

const ModalCalendarPicker = forwardRef<CalendarPickerRefs, Props>((props, ref) => {
  const {onConfirm, maximumDate, soldOutDateStr, disabledDayNames, restrictedRanges} = props;
  const {bottom} = useSafeAreaInsets();

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selected, setSelected] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState<string>(moment().format('YYYY-MM-DD'));

  const show = useCallback(() => bottomSheetRef.current?.present(), []);
  const hide = useCallback(() => bottomSheetRef.current?.dismiss(), []);

  useImperativeHandle(ref, () => ({show, hide}), [show, hide]);

  const today = moment().format('YYYY-MM-DD');
  const maxDate =
    maximumDate != null && maximumDate > 0
      ? moment().add(maximumDate, 'days').format('YYYY-MM-DD')
      : today;

  const {disabledSet} = useMemo(() => {
    const set = new Set<string>();

    const addDisabled = (dateStr: string) => set.add(dateStr);

    if (soldOutDateStr) {
      soldOutDateStr.split('/').forEach(d => {
        if (!d) return;
        addDisabled(moment(d, 'YYMMDD').format('YYYY-MM-DD'));
      });
    }

    if (restrictedRanges) {
      restrictedRanges.forEach(range => {
        const start = moment(range.start_date, 'YYYYMMDD');
        const end = moment(range.end_date, 'YYYYMMDD');
        let cur = start.clone();
        while (cur.isSameOrBefore(end, 'day')) {
          addDisabled(cur.format('YYYY-MM-DD'));
          cur.add(1, 'day');
        }
      });
    }

    if (disabledDayNames) {
      const disabledNames = disabledDayNames.split('/');
      const maxDays = maximumDate != null ? maximumDate : 60;
      for (let i = 0; i <= maxDays; i++) {
        const d = moment().add(i, 'days');
        if (disabledNames.includes(getDayNameKo(d))) {
          addDisabled(d.format('YYYY-MM-DD'));
        }
      }
    }

    return {disabledSet: set};
  }, [soldOutDateStr, restrictedRanges, disabledDayNames, maximumDate, selected]);

  const onDayPress = useCallback(
    (day: {dateString: string}) => {
      if (disabledSet.has(day.dateString)) return;
      setSelected(day.dateString);
    },
    [disabledSet],
  );

  const onConfirmPress = useCallback(() => {
    if (!selected) return;
    hide();
    onConfirm?.(moment(selected).toDate());
  }, [selected, hide, onConfirm]);

  const renderHeader = useCallback(
    (_date: any) => {
      const m = moment(currentMonth);
      const min = moment(today, 'YYYY-MM-DD');
      const max = moment(maxDate, 'YYYY-MM-DD');

      const canGoPrev = m.clone().startOf('month').isAfter(min.clone().startOf('month'));
      const nextMonthStart = m.clone().add(1, 'month').startOf('month');
      const canGoNext = nextMonthStart.isSameOrBefore(max, 'day');

      return (
        <View>
          <View style={styles.headerRow}>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => {
                if (!canGoPrev) return;
                setCurrentMonth(m.clone().subtract(1, 'month').format('YYYY-MM-DD'));
              }}
              style={[styles.arrowBtn, !canGoPrev && styles.arrowBtnDisabled]}>
              <CustomText string="‹" style={styles.arrowText} />
            </TouchableOpacity>

            <CustomText string={m.format('YYYY년 MM월')} style={styles.headerText} />

            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => {
                if (!canGoNext) return;
                setCurrentMonth(m.clone().add(1, 'month').format('YYYY-MM-DD'));
              }}
              style={[styles.arrowBtn, !canGoNext && styles.arrowBtnDisabled]}>
              <CustomText string="›" style={styles.arrowText} />
            </TouchableOpacity>
          </View>

          <View style={styles.weekRow}>
            {DAY_NAMES_KO.map(d => (
              <View key={d} style={styles.weekCell}>
                <CustomText string={d} style={styles.weekText} />
              </View>
            ))}
          </View>
        </View>
      );
    },
    [currentMonth, today, maxDate],
  );

  const selectedLabel = selected
    ? `${moment(selected).format('M월 D일')} (${getDayNameKo(moment(selected))}) 선택`
    : '날짜를 선택해주세요';

  const calendarCells = useMemo(() => {
    const monthStart = moment(currentMonth, 'YYYY-MM-DD').startOf('month');
    const gridStart = monthStart.clone().startOf('week'); // 일요일 시작
    const cells: moment.Moment[] = [];
    for (let i = 0; i < 42; i++) {
      cells.push(gridStart.clone().add(i, 'day'));
    }
    return cells;
  }, [currentMonth]);

  const isDisabledDate = useCallback(
    (dateStr: string) => {
      if (moment(dateStr, 'YYYY-MM-DD').isBefore(today, 'day')) return true;
      if (moment(dateStr, 'YYYY-MM-DD').isAfter(maxDate, 'day')) return true;
      return disabledSet.has(dateStr);
    },
    [disabledSet, today, maxDate],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      backdropComponent={backdropProps => (
        <CustomBackdrop {...backdropProps} onPressBackdrop={hide} />
      )}
      enablePanDownToClose
      index={0}
      handleComponent={() => null}
      enableDynamicSizing>
      <BottomSheetView style={styles.container}>
        <View style={styles.titleRow}>
          <CustomText string="입차일 선택" style={styles.title} />
        </View>

        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: colors.primary}]} />
            <CustomText string="선택 가능" style={styles.legendText} />
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: colors.disableButton}]} />
            <CustomText string="매진/제한" style={styles.legendText} />
          </View>
        </View>

        {renderHeader(null)}

        <View style={styles.grid}>
          {Array.from({length: 6}).map((_, rowIdx) => (
            <View key={rowIdx} style={styles.week}>
              {calendarCells.slice(rowIdx * 7, rowIdx * 7 + 7).map(d => {
                const dateStr = d.format('YYYY-MM-DD');
                const inMonth = d.isSame(moment(currentMonth, 'YYYY-MM-DD'), 'month');
                const hidden = !inMonth; // hideExtraDays 처럼 처리
                const disabled = !hidden && isDisabledDate(dateStr);
                const isSelected = selected === dateStr;
                const isToday = d.isSame(moment(today, 'YYYY-MM-DD'), 'day');

                if (hidden) {
                  return <View key={dateStr} style={styles.dayCell} />;
                }

                return (
                  <TouchableOpacity
                    key={dateStr}
                    accessibilityRole="button"
                    onPress={() => {
                      if (disabled) return;
                      onDayPress({dateString: dateStr});
                    }}
                    style={[
                      styles.dayCell,
                      isToday && styles.todayCell,
                      isSelected && styles.selectedCell,
                      disabled && styles.disabledCell,
                    ]}>
                    <CustomText
                      string={d.format('D')}
                      style={[
                        styles.dayText,
                        disabled && styles.dayTextDisabled,
                        isSelected && styles.dayTextSelected,
                      ]}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        <View style={[styles.footer, {paddingBottom: Math.max(bottom, heightScale(24)) + heightScale(16)}]}>
          <CustomButton
            text={selectedLabel}
            onPress={onConfirmPress}
            disabled={!selected}
            buttonHeight={52}
            buttonStyle={styles.confirmButton}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default ModalCalendarPicker;

const styles = StyleSheet.create({
  container: {
    paddingTop: heightScale(20),
  },
  titleRow: {
    paddingHorizontal: widthScale(20),
    marginBottom: heightScale(8),
  },
  title: {
    fontFamily: FONT_FAMILY.BOLD,
    fontSize: widthScale(18),
    color: colors.menuTextColor,
  },
  legendRow: {
    flexDirection: 'row',
    gap: widthScale(16),
    paddingHorizontal: widthScale(20),
    marginBottom: heightScale(8),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthScale(4),
  },
  legendDot: {
    width: widthScale(8),
    height: widthScale(8),
    borderRadius: widthScale(4),
  },
  legendText: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: widthScale(12),
    color: colors.grayText1,
  },
  headerText: {
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    fontSize: widthScale(16),
    color: colors.menuTextColor,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: widthScale(12),
    paddingVertical: heightScale(8),
  },
  arrowBtn: {
    width: widthScale(44),
    height: heightScale(34),
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowBtnDisabled: {
    opacity: 0.3,
  },
  arrowText: {
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    fontSize: widthScale(22),
    color: colors.menuTextColor,
  },
  weekRow: {
    flexDirection: 'row',
    paddingHorizontal: widthScale(8),
    paddingBottom: heightScale(4),
  },
  weekCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: heightScale(6),
  },
  weekText: {
    fontFamily: FONT_FAMILY.MEDIUM,
    fontSize: widthScale(12),
    color: colors.grayText1,
  },
  grid: {
    paddingHorizontal: widthScale(8),
    paddingBottom: heightScale(8),
  },
  week: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: heightScale(4),
  },
  dayText: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: widthScale(14),
    color: colors.menuTextColor,
  },
  dayTextDisabled: {
    color: colors.disableButton,
  },
  todayCell: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: widthScale(999),
  },
  selectedCell: {
    backgroundColor: colors.primary,
    borderRadius: widthScale(999),
  },
  dayTextSelected: {
    color: colors.white,
    fontFamily: FONT_FAMILY.SEMI_BOLD,
  },
  disabledCell: {
    opacity: 0.9,
  },
  footer: {
    paddingHorizontal: widthScale(20),
    paddingTop: heightScale(16),
  },
  confirmButton: {
    width: '100%',
  },
});
