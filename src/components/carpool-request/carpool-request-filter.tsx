import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {StyleSheet, View} from 'react-native';
import WorkdayCalendarModal, {
  WorkdayCalendarModalRefs,
} from '~components/calendar/workday-calendar-modal';
import CustomBoxSelectButton from '~components/commons/custom-box-select-button';
import CustomButton from '~components/commons/custom-button';
import DateFilter from '~components/commons/date-filter';
import CustomBackdrop from '~components/custom-backdrop';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {CarpoolRequestFilterModel} from '~screens/carpool/carpool-request';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {dayjs} from '~utils/dayjsUtil';

interface Props {
  onSubmit: (value: CarpoolRequestFilterModel) => void;
}

export interface CarpoolRequestFilterRefs {
  show: (filterValue: CarpoolRequestFilterModel) => void;
  hide: () => void;
}

const CarpoolRequestFilter = forwardRef((props: Props, ref) => {
  const {onSubmit} = props;

  const modalRef = useRef<BottomSheetModal>(null);
  const dayPickerRef = useRef<WorkdayCalendarModalRefs>(null);

  const [currentFilter, setcurrentFilter] = useState<CarpoolRequestFilterModel>({
    carInOut: 'ALL',
    date: [],
    gender: 'ALL',
  });

  const show = useCallback((filterValue: CarpoolRequestFilterModel) => {
    setcurrentFilter(filterValue);
    modalRef?.current?.present();
  }, []);

  const hide = useCallback(() => {
    modalRef?.current?.close();
  }, []);

  useImperativeHandle(ref, () => ({show, hide}), []);

  const getStartDayValue = useMemo(() => {
    if (currentFilter?.date?.length === 1) {
      return dayjs(currentFilter?.date[0]?.timestamp).format('MM월DD일');
    }

    if (currentFilter?.date?.length === 2) {
      return dayjs(currentFilter?.date[0]?.timestamp).format('MM월DD일');
    }

    return '';
  }, [currentFilter?.date]);

  const getEndDayValue = useMemo(() => {
    if (currentFilter?.date?.length === 1) {
      return dayjs(currentFilter?.date[0]?.timestamp).format('MM월DD일');
    }

    if (currentFilter?.date?.length === 2) {
      return dayjs(currentFilter?.date[1]?.timestamp).format('MM월DD일');
    }

    return '';
  }, [currentFilter?.date]);

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      enableDynamicSizing
      handleComponent={null}
      backdropComponent={props => <CustomBackdrop {...props} onPressBackdrop={hide} />}>
      <BottomSheetView style={styles.containerStyle}>
        <CustomText
          string="필터링"
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_7}
          textStyle={{
            paddingTop: PADDING1,
            textAlign: 'center',
          }}
        />

        <View style={styles.boxWrapperStyle}>
          <CustomText string="경로" textStyle={styles.menuTextStyle} />
          <HStack style={styles.boxWrapperStyle}>
            <CustomBoxSelectButton
              onSelected={() => {
                setcurrentFilter(prev => {
                  return {
                    ...prev,
                    carInOut: 'IN',
                  };
                });
              }}
              selected={currentFilter?.carInOut === 'IN'}
              text="출근길"
            />
            <CustomBoxSelectButton
              onSelected={() => {
                setcurrentFilter(prev => {
                  return {
                    ...prev,
                    carInOut: 'OUT',
                  };
                });
              }}
              selected={currentFilter?.carInOut === 'OUT'}
              text="퇴근길"
            />
          </HStack>
        </View>

        <View style={styles.boxWrapperStyle}>
          <CustomText string="성별" textStyle={styles.menuTextStyle} />
          <HStack style={styles.boxWrapperStyle}>
            <CustomBoxSelectButton
              onSelected={() => {
                setcurrentFilter(prev => {
                  return {
                    ...prev,
                    gender: 'FEMALE',
                  };
                });
              }}
              selected={currentFilter?.gender === 'FEMALE'}
              text="여성만"
            />
            <CustomBoxSelectButton
              onSelected={() => {
                setcurrentFilter(prev => {
                  return {
                    ...prev,
                    gender: 'MALE',
                  };
                });
              }}
              selected={currentFilter?.gender === 'MALE'}
              text="남성만"
            />
          </HStack>
        </View>

        <DateFilter
          type="TWO_WEEKS"
          onEndDatePress={() => {
            dayPickerRef?.current?.show(currentFilter?.date);
          }}
          onStartDatePress={() => {
            dayPickerRef?.current?.show(currentFilter?.date);
          }}
          startDateValue={getStartDayValue}
          endDateValue={getEndDayValue}
        />

        <HStack style={styles.buttonsStyle}>
          <CustomButton
            type="TERTIARY"
            outLine
            leftIconReload
            iconType="RELOAD"
            buttonHeight={58}
            text="초기화"
            onPress={() => {
              setcurrentFilter({
                carInOut: 'ALL',
                date: [],
                gender: 'ALL',
              });
            }}
          />
          <CustomButton
            onPress={() => {
              hide();
              onSubmit && onSubmit(currentFilter);
            }}
            buttonHeight={58}
            text="완료"
            buttonStyle={styles.submitButtonStyle}
          />
        </HStack>

        <WorkdayCalendarModal
          ref={dayPickerRef}
          onSubmit={value => {
            setcurrentFilter(prev => {
              return {
                ...prev,
                date: value,
              };
            });
          }}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default CarpoolRequestFilter;

const styles = StyleSheet.create({
  containerStyle: {
    paddingBottom: heightScale1(42),
    gap: PADDING1,
    paddingHorizontal: PADDING1,
  },
  menuTextStyle: {
    fontSize: fontSize1(16),
    fontFamily: FONT_FAMILY.MEDIUM,
  },
  boxWrapperStyle: {
    gap: heightScale1(10),
  },
  buttonsStyle: {
    marginTop: heightScale1(10),
    gap: widthScale1(10),
  },
  submitButtonStyle: {
    flex: 1,
  },
});
