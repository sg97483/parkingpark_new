import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import moment from 'moment';
import React, {forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import CustomBackdrop from '~components/custom-backdrop';
import CustomButton from '~components/commons/custom-button';
import CustomText from '~components/custom-text';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface Props {
  onConfirm?: (date: Date) => void;
  selectedDate?: Date;
  initialTime?: Date;
  ticketStart?: string; // "HH:mm"
  ticketEnd?: string; // "HH:mm"
  minuteInterval?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30; // default 10
}

export interface TimeWheelPickerRefs {
  show: () => void;
  hide: () => void;
}

const clampToMinuteInterval = (d: moment.Moment, interval: number) => {
  const m = d.clone();
  const mod = m.minute() % interval;
  if (mod !== 0) {
    m.add(interval - mod, 'minutes');
  }
  m.second(0).millisecond(0);
  return m;
};

const parseHHmm = (hhmm?: string) => {
  if (!hhmm) return null;
  const m = moment(hhmm, 'HH:mm', true);
  return m.isValid() ? m : null;
};

const ModalTimeWheelPicker = forwardRef<TimeWheelPickerRefs, Props>((props, ref) => {
  const {onConfirm, selectedDate, initialTime, ticketStart, ticketEnd, minuteInterval = 10} = props;
  const {bottom} = useSafeAreaInsets();

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [time, setTime] = useState<Date>(() => initialTime ?? new Date());

  const show = useCallback(() => bottomSheetRef.current?.present(), []);
  const hide = useCallback(() => bottomSheetRef.current?.dismiss(), []);
  useImperativeHandle(ref, () => ({show, hide}), [show, hide]);

  const baseDay = useMemo(() => {
    const base = selectedDate ? moment(selectedDate) : moment();
    return base.startOf('day');
  }, [selectedDate]);

  const {minDate, maxDate, isOvernightRange} = useMemo(() => {
    const start = parseHHmm(ticketStart);
    const end = parseHHmm(ticketEnd);
    if (!start || !end) {
      return {minDate: undefined as Date | undefined, maxDate: undefined as Date | undefined, isOvernightRange: false};
    }

    const startAt = baseDay.clone().hour(start.hour()).minute(start.minute()).second(0).millisecond(0);
    let endAt = baseDay.clone().hour(end.hour()).minute(end.minute()).second(0).millisecond(0);

    // 기존 Reservation 검증 로직과 동일하게,
    // 00:00 ~ 00:00 은 "시간 제한 없음"으로 취급합니다.
    if (start.hour() === 0 && start.minute() === 0 && end.hour() === 0 && end.minute() === 0) {
      return {minDate: undefined, maxDate: undefined, isOvernightRange: false};
    }

    const overnight = endAt.isBefore(startAt);
    if (overnight) {
      // 자정 넘어가는 범위는 UI에서 min/max를 강제하기 어려워(하루 범위 초과),
      // 여기서는 제한 없이 두고 Reservation의 기존 검증 로직을 최종 방어로 둡니다.
      return {minDate: undefined, maxDate: undefined, isOvernightRange: true};
    }

    // 오늘인 경우 현재 시각 이후로만(피커 단계에서 반영)
    const now = moment();
    let min = startAt;
    if (baseDay.isSame(now, 'day')) {
      const nowRounded = clampToMinuteInterval(now, minuteInterval);
      if (nowRounded.isAfter(min)) {
        min = nowRounded;
      }
    }

    const max = endAt;
    return {minDate: min.toDate(), maxDate: max.toDate(), isOvernightRange: false};
  }, [ticketStart, ticketEnd, baseDay, minuteInterval]);

  const selectedLabel = useMemo(() => {
    const t = moment(time);
    return t.format('HH시mm분') + ' 선택';
  }, [time]);

  const onConfirmPress = useCallback(() => {
    hide();

    // 선택한 시간을 selectedDate의 날짜로 맞춰서 전달
    const t = moment(time);
    const combined = baseDay.clone().hour(t.hour()).minute(t.minute()).second(0).millisecond(0);
    onConfirm?.(combined.toDate());
  }, [hide, onConfirm, time, baseDay]);

  const headerRightText = isOvernightRange ? '※ 이용시간이 자정 이후까지 포함됩니다.' : '';

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
          <CustomText string="입차시간 선택" style={styles.title} />
          {headerRightText ? <CustomText string={headerRightText} style={styles.hint} /> : null}
        </View>

        <View style={styles.pickerWrapper}>
          <DatePicker
            date={time}
            onDateChange={setTime}
            locale="ko"
            mode="time"
            minuteInterval={minuteInterval}
            androidVariant="iosClone"
            theme="light"
            minimumDate={minDate}
            maximumDate={maxDate}
          />
        </View>

        <View style={[styles.footer, {paddingBottom: Math.max(bottom, heightScale(24)) + heightScale(12)}]}>
          <CustomButton
            text={selectedLabel}
            onPress={onConfirmPress}
            buttonHeight={52}
            buttonStyle={styles.confirmButton}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default ModalTimeWheelPicker;

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
  hint: {
    marginTop: heightScale(6),
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: widthScale(12),
    color: colors.grayText1,
  },
  pickerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: widthScale(20),
    paddingTop: heightScale(16),
  },
  confirmButton: {
    width: '100%',
  },
});

