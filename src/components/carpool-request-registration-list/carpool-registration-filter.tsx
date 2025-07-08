import {BottomSheetBackdropProps, BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
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
import {CarpoolRegistationFilterModel} from '~model/carpool-filter-model';
import {cacheCarpoolRegistrationFilter} from '~reducers/carpoolReducer';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {dayjs} from '~utils/dayjsUtil';

interface Props {}

export interface CarpoolRegistrationFilterRefs {
  show: () => void;
  hide: () => void;
}

const CarpoolRegistrationFilter = forwardRef((props: Props, ref) => {
  const {} = props;

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const dayPickerRef = useRef<WorkdayCalendarModalRefs>(null);
  const currentFilter = useAppSelector(state => state?.carpoolReducer?.carpoolRegistrationFilter);
  const dispatch = useAppDispatch();

  const [filter, setFilter] = useState<CarpoolRegistationFilterModel>(currentFilter);

  const show = () => {
    bottomSheetRef?.current?.present();
  };

  const hide = () => {
    bottomSheetRef?.current?.close();
  };

  useImperativeHandle(ref, () => ({show, hide}), []);

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => {
    return <CustomBackdrop {...props} onPressBackdrop={hide} />;
  }, []);

  const getStartDayValueText = useMemo(() => {
    if (filter?.selectedDay?.length > 0) {
      return dayjs(filter?.selectedDay[0]?.timestamp).format('YY년M월D일');
    }
    return '';
  }, [filter?.selectedDay]);

  const getEndDayValueText = useMemo(() => {
    if (filter?.selectedDay?.length === 1) {
      return dayjs(filter?.selectedDay[0]?.timestamp).format('YY년M월D일');
    }
    if (filter?.selectedDay?.length === 2) {
      return dayjs(filter?.selectedDay[1]?.timestamp).format('YY년M월D일');
    }

    return '';
  }, [filter?.selectedDay]);

  return (
    <BottomSheetModal
      handleComponent={() => null}
      enablePanDownToClose
      index={0}
      ref={bottomSheetRef}
      backdropComponent={renderBackdrop}
      enableDynamicSizing>
      <BottomSheetView style={styles.contentContainerStyle}>
        <StatusBar backgroundColor={colors.transparent} />

        <CustomText
          size={FONT.CAPTION_7}
          forDriveMe
          family={FONT_FAMILY.SEMI_BOLD}
          string="필터링"
          textStyle={styles.headerTextStyle}
        />
        <View style={{gap: heightScale1(30)}}>
          <View style={styles.menuItemWrapperStyle}>
            <CustomText
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION_7}
              string="경로"
            />

            <HStack style={styles.rowStyle}>
              <CustomBoxSelectButton
                text="출근길"
                selected={filter?.carInOut === 'in'}
                onSelected={() => {
                  setFilter(prev => {
                    return {
                      ...prev,
                      carInOut: 'in',
                    };
                  });
                }}
              />
              <CustomBoxSelectButton
                text="퇴근길"
                selected={filter?.carInOut === 'out'}
                onSelected={() => {
                  setFilter(prev => {
                    return {
                      ...prev,
                      carInOut: 'out',
                    };
                  });
                }}
              />
            </HStack>
          </View>

          <DateFilter
            type={'TWO_WEEKS'}
            onStartDatePress={() => {
              dayPickerRef?.current?.show(filter?.selectedDay);
            }}
            onEndDatePress={() => {
              dayPickerRef?.current?.show(filter?.selectedDay);
            }}
            startDateValue={getStartDayValueText}
            endDateValue={getEndDayValueText}
          />
        </View>

        <HStack style={styles.buttonGroupStyle}>
          <CustomButton
            leftIconReload
            type="TERTIARY"
            outLine
            buttonHeight={58}
            text="초기화"
            buttonStyle={styles.resetButtonStyle}
            onPress={() => {
              setFilter({
                carInOut: '',
                selectedDay: [],
              });
            }}
          />
          <CustomButton
            onPress={() => {
              dispatch(cacheCarpoolRegistrationFilter(filter));
              hide();
            }}
            buttonHeight={58}
            text="초기화"
            buttonStyle={styles.confirmButtonStyle}
          />
        </HStack>

        <WorkdayCalendarModal
          ref={dayPickerRef}
          onSubmit={data => {
            setFilter(prev => {
              return {
                ...prev,
                selectedDay: data,
              };
            });
          }}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default memo(CarpoolRegistrationFilter);

const styles = StyleSheet.create({
  contentContainerStyle: {
    backgroundColor: colors.white,
    paddingHorizontal: PADDING1,
    paddingBottom: heightScale1(42),
    borderTopLeftRadius: scale1(16),
    borderTopRightRadius: scale1(16),
  },
  headerTextStyle: {
    textAlign: 'center',
    marginVertical: heightScale1(30),
  },
  menuItemWrapperStyle: {
    gap: heightScale1(10),
  },
  rowStyle: {
    gap: widthScale1(10),
    flexWrap: 'wrap',
  },
  buttonGroupStyle: {
    marginTop: heightScale1(40),
    gap: widthScale1(10),
  },
  confirmButtonStyle: {
    flex: 1,
  },
  resetButtonStyle: {
    minWidth: widthScale1(100),
  },
});
