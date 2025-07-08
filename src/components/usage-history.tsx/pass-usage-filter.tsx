import {BottomSheetBackdropProps, BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import moment from 'moment';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import CustomBoxSelectButton from '~components/commons/custom-box-select-button';
import CustomButton from '~components/commons/custom-button';
import DateFilter from '~components/commons/date-filter';
import ToastMessage from '~components/commons/toast-message/toast-message';
import ToastMessageController from '~components/commons/toast-message/toast-message-controller';
import CustomBackdrop from '~components/custom-backdrop';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import ModalMenuDate, {MenuDateModelRefs} from '~components/modal-menu-date';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {UsageHistoryFilterModel} from '~model/carpool-filter-model';
import {cachePassengerUsageHistoryFilter} from '~reducers/carpoolReducer';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

export interface PassUsageFilterRefs {
  show: () => void;
  hide: () => void;
}

interface Props {
  filterScrollRef: React.RefObject<ScrollView>;
}

const PassUsageFilter = forwardRef<PassUsageFilterRefs, Props>(({filterScrollRef}, ref) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const menuStartDateRef = useRef<MenuDateModelRefs>(null);
  const menuEndDateRef = useRef<MenuDateModelRefs>(null);
  const passUsageFilter = useAppSelector(
    state => state?.carpoolReducer?.passengerUsageHistoryFilter,
  );
  const dispatch = useAppDispatch();

  const [currentFilter, setCurrentFilter] = useState<UsageHistoryFilterModel>(passUsageFilter);

  useEffect(() => {
    setCurrentFilter(passUsageFilter);
  }, [passUsageFilter]);

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
          {/* Car in/out */}
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
                onSelected={() => {
                  setCurrentFilter(prev => {
                    return {
                      ...prev,
                      carInOut: 'in',
                    };
                  });
                }}
                selected={currentFilter?.carInOut === 'in'}
              />
              <CustomBoxSelectButton
                text="퇴근길"
                onSelected={() => {
                  setCurrentFilter(prev => {
                    return {
                      ...prev,
                      carInOut: 'out',
                    };
                  });
                }}
                selected={currentFilter?.carInOut === 'out'}
              />
            </HStack>
          </View>

          <View style={styles.menuItemWrapperStyle}>
            <CustomText
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION_7}
              string="진행상태"
            />
            <HStack style={styles.rowStyle}>
              <CustomBoxSelectButton
                text="예약완료"
                onSelected={() => {
                  setCurrentFilter(prev => {
                    return {
                      ...prev,
                      statusBooking: 'R',
                    };
                  });
                }}
                selected={currentFilter?.statusBooking === 'R'}
              />
              <CustomBoxSelectButton
                text="카풀완료"
                onSelected={() => {
                  setCurrentFilter(prev => {
                    return {
                      ...prev,
                      statusBooking: 'E',
                    };
                  });
                }}
                selected={currentFilter?.statusBooking === 'E'}
              />
              <CustomBoxSelectButton
                text="예약취소"
                onSelected={() => {
                  setCurrentFilter(prev => {
                    return {
                      ...prev,
                      statusBooking: 'C',
                    };
                  });
                }}
                selected={currentFilter?.statusBooking === 'C'}
              />
              <CustomBoxSelectButton
                text="패널티 부과"
                onSelected={() => {
                  setCurrentFilter(prev => {
                    return {
                      ...prev,
                      statusBooking: 'P',
                    };
                  });
                }}
                selected={currentFilter?.statusBooking === 'P'}
              />
            </HStack>
          </View>

          <DateFilter
            type={'ONE_YEAR'}
            onStartDatePress={() => {
              menuStartDateRef?.current?.show();
            }}
            onEndDatePress={() => {
              if (!currentFilter?.startDate) {
                ToastMessageController.show('시작 시간과 마지막 시간을 먼저 선택해주세요.');
                return;
              }
              menuEndDateRef?.current?.show();
            }}
            startDateValue={
              currentFilter?.startDate
                ? moment(currentFilter?.startDate).format('YYYY년 MM월')
                : undefined
            }
            endDateValue={
              currentFilter?.endDate
                ? moment(currentFilter?.endDate).format('YYYY년 MM월')
                : undefined
            }
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
              setCurrentFilter({
                carInOut: '',
                statusBooking: '',
                startDate: undefined,
                endDate: undefined,
              });
            }}
          />
          <CustomButton
            onPressOut={hide}
            onPress={() => {
              if (currentFilter.startDate && !currentFilter.endDate) {
                ToastMessageController.show('마지막 날짜를 선택해주세요.');
                return;
              }
              if (currentFilter.endDate && !currentFilter.startDate) {
                ToastMessageController.show('시작 날짜를 선택해주세요.');
                return;
              }
              dispatch(cachePassengerUsageHistoryFilter(currentFilter));
              filterScrollRef.current?.scrollTo({x: 0});
              hide();
            }}
            buttonHeight={58}
            text="완료"
            buttonStyle={styles.confirmButtonStyle}
          />
        </HStack>
      </BottomSheetView>

      {/* Start date */}
      <ModalMenuDate
        ref={menuStartDateRef}
        onSelected={value => {
          if (currentFilter.endDate && moment(value).isAfter(moment(currentFilter?.endDate))) {
            ToastMessageController.show(
              '시작 시간은 마지막 시간 이전이어야 됩니다. 다시 확인해주세요.',
            );
            return;
          }

          setCurrentFilter(prev => {
            return {
              ...prev,
              startDate: value,
            };
          });
        }}
        selected={currentFilter?.startDate}
      />

      {/* End date */}
      <ModalMenuDate
        isSelectingEnd
        ref={menuEndDateRef}
        onSelected={value => {
          if (currentFilter.startDate && moment(value).isBefore(moment(currentFilter?.startDate))) {
            ToastMessageController.show(
              '마지막 시간은 시작 시간 이후여야 됩니다. 다시 확인해주세요.',
            );

            return;
          }
          setCurrentFilter(prev => {
            return {
              ...prev,
              endDate: value,
            };
          });
        }}
        selected={currentFilter?.endDate}
      />

      <ToastMessage containerStyle={{bottom: '50%'}} />
    </BottomSheetModal>
  );
});

export default memo(PassUsageFilter);

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
