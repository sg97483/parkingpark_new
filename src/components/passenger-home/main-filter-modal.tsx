import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {StyleSheet} from 'react-native';
import {DateData} from 'react-native-calendars';
import CustomBoxSelectButton from '~components/commons/custom-box-select-button';
import CustomButton from '~components/commons/custom-button';
import ToastMessage from '~components/commons/toast-message/toast-message';
import ToastMessageController from '~components/commons/toast-message/toast-message-controller';
import CustomBackdrop from '~components/custom-backdrop';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {PassengerFilterModel} from '~model/carpool-filter-model';
import {cachePassengerFilter} from '~reducers/carpoolReducer';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {dayjs} from '~utils/dayjsUtil';

export interface MainFilterModalRefs {
  show: () => void;
  hide: () => void;
}

const MainFilterModal = forwardRef((_, ref) => {
  const modalRef = useRef<BottomSheetModal>(null);
  const savedPassengerFilter = useAppSelector(state => state?.carpoolReducer.passengerModeFilter);
  const dispatch = useAppDispatch();

  const [currentFilter, setCurrentFilter] = useState<PassengerFilterModel>(savedPassengerFilter);
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
    day: Number(maxDate.valueOf()),
    year: Number(maxDate.valueOf()),
    timestamp: Number(maxDate.valueOf()),
  };

  useEffect(() => {
    setCurrentFilter(savedPassengerFilter);
  }, [savedPassengerFilter]);

  const show = useCallback(() => {
    modalRef?.current?.present();
  }, []);

  const hide = useCallback(() => {
    modalRef?.current?.dismiss();
  }, []);

  useImperativeHandle(ref, () => ({show, hide}), []);

  const handleSubmitFilter = useCallback(() => {
    dispatch(cachePassengerFilter(currentFilter));
    hide();
  }, [currentFilter, hide, dispatch]);

  const handleResetFilter = useCallback(() => {
    setCurrentFilter({
      ...savedPassengerFilter,
      gender: '',
      destinationDistanceRange: '',
      distanceRangeFromDeparturePoint: '',
      routeRegistrationComplete: false,
      selectedDay: [],
    });
  }, [savedPassengerFilter]);

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      enableDynamicSizing
      enablePanDownToClose
      handleComponent={() => null}
      backdropComponent={props => <CustomBackdrop {...props} onPressBackdrop={hide} />}>
      <BottomSheetView style={styles.contentContainerStyle}>
        <CustomText
          string="필터링"
          forDriveMe
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_7}
          textStyle={{
            textAlign: 'center',
            marginVertical: heightScale1(30),
          }}
        />

        <BottomSheetView style={{gap: heightScale1(30)}}>
          {/* Route registration complete */}
          <BottomSheetView style={{gap: heightScale1(10)}}>
            <CustomText
              string="운행등록 여부"
              forDriveMe
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.MEDIUM}
              lineHeight={heightScale1(22)}
            />
            <HStack style={{gap: widthScale1(10)}}>
              <CustomBoxSelectButton
                text="모든 드라이버"
                selected={!currentFilter?.routeRegistrationComplete}
                onSelected={() => {
                  const checkCurrentDay =
                    currentFilter?.selectedDay[0]?.dateString === currentDate?.dateString;

                  const checkMaxDay =
                    currentFilter?.selectedDay[1]?.dateString === maxDateObj?.dateString;

                  if (
                    (!checkCurrentDay || !checkMaxDay) &&
                    (savedPassengerFilter?.selectedDay?.length as number) > 0
                  ) {
                    ToastMessageController.show(
                      '기간 설정값이 등록되어 있습니다.\n기간 설정을 초기화 후 모든 드라이버를\n필터링 할수 있습니다.',
                    );
                    return;
                  }
                  setCurrentFilter(curr => {
                    return {
                      ...curr,
                      routeRegistrationComplete: false,
                    };
                  });
                }}
              />

              <CustomBoxSelectButton
                text="운행등록 완료만"
                selected={currentFilter?.routeRegistrationComplete}
                onSelected={() => {
                  setCurrentFilter(curr => {
                    return {
                      ...curr,
                      routeRegistrationComplete: true,
                    };
                  });
                }}
              />
            </HStack>
          </BottomSheetView>

          {/* Gender */}
          <BottomSheetView style={{gap: heightScale1(10)}}>
            <CustomText
              string="성별"
              forDriveMe
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.MEDIUM}
              lineHeight={heightScale1(22)}
            />

            <HStack style={{gap: widthScale1(10)}}>
              <CustomBoxSelectButton
                text="성별무관"
                selected={currentFilter?.gender === ''}
                onSelected={() => {
                  setCurrentFilter(curr => {
                    return {
                      ...curr,
                      gender: '',
                    };
                  });
                }}
              />

              {/* women only */}
              <CustomBoxSelectButton
                text="여성만"
                selected={currentFilter?.gender === 'FEMALE'}
                onSelected={() => {
                  setCurrentFilter(curr => {
                    return {
                      ...curr,
                      gender: 'FEMALE',
                    };
                  });
                }}
              />

              {/* Men only */}
              <CustomBoxSelectButton
                text="남성만"
                selected={currentFilter?.gender === 'MALE'}
                onSelected={() => {
                  setCurrentFilter(curr => {
                    return {
                      ...curr,
                      gender: 'MALE',
                    };
                  });
                }}
              />
            </HStack>
          </BottomSheetView>

          {/* Distance range from departure point */}
          <BottomSheetView style={{gap: heightScale1(10)}}>
            <CustomText
              string="출발지 거리범위"
              forDriveMe
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.MEDIUM}
              lineHeight={heightScale1(22)}
            />

            <HStack style={{gap: widthScale1(10)}}>
              <CustomBoxSelectButton
                text="거리무관"
                selected={currentFilter?.distanceRangeFromDeparturePoint === ''}
                onSelected={() => {
                  setCurrentFilter(curr => {
                    return {
                      ...curr,
                      distanceRangeFromDeparturePoint: '',
                    };
                  });
                }}
              />

              <CustomBoxSelectButton
                text="3km 이내"
                selected={currentFilter?.distanceRangeFromDeparturePoint === '3KM'}
                onSelected={() => {
                  setCurrentFilter(curr => {
                    return {
                      ...curr,
                      distanceRangeFromDeparturePoint: '3KM',
                    };
                  });
                }}
              />

              <CustomBoxSelectButton
                text="5km 이내"
                selected={currentFilter?.distanceRangeFromDeparturePoint === '5KM'}
                onSelected={() => {
                  setCurrentFilter(curr => {
                    return {
                      ...curr,
                      distanceRangeFromDeparturePoint: '5KM',
                    };
                  });
                }}
              />
            </HStack>
          </BottomSheetView>

          {/* Destination distance range */}
          <BottomSheetView style={{gap: heightScale1(10)}}>
            <CustomText
              string="도착지 거리범위"
              forDriveMe
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.MEDIUM}
              lineHeight={heightScale1(22)}
            />

            <HStack style={{gap: widthScale1(10)}}>
              <CustomBoxSelectButton
                text="거리무관"
                selected={currentFilter?.destinationDistanceRange === ''}
                onSelected={() => {
                  setCurrentFilter(curr => {
                    return {
                      ...curr,
                      destinationDistanceRange: '',
                    };
                  });
                }}
              />

              <CustomBoxSelectButton
                text="3km 이내"
                selected={currentFilter?.destinationDistanceRange === '3KM'}
                onSelected={() => {
                  setCurrentFilter(curr => {
                    return {
                      ...curr,
                      destinationDistanceRange: '3KM',
                    };
                  });
                }}
              />

              <CustomBoxSelectButton
                text="5km 이내"
                selected={currentFilter?.destinationDistanceRange === '5KM'}
                onSelected={() => {
                  setCurrentFilter(curr => {
                    return {
                      ...curr,
                      destinationDistanceRange: '5KM',
                    };
                  });
                }}
              />
            </HStack>
          </BottomSheetView>
        </BottomSheetView>

        <HStack style={styles.footerStyle}>
          <CustomButton
            buttonStyle={{
              minWidth: widthScale1(100),
            }}
            type="TERTIARY"
            text="초기화"
            leftIconReload
            buttonHeight={58}
            onPress={handleResetFilter}
            outLine
          />

          <CustomButton
            buttonStyle={{
              flex: 1,
            }}
            text="완료"
            buttonHeight={58}
            onPress={handleSubmitFilter}
          />
        </HStack>
        {(savedPassengerFilter?.selectedDay?.length as number) > 0 ? (
          <ToastMessage containerStyle={{bottom: '50%'}} />
        ) : null}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default MainFilterModal;

const styles = StyleSheet.create({
  containerStyle: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  contentContainerStyle: {
    backgroundColor: colors.white,
    paddingHorizontal: PADDING1,
    borderTopLeftRadius: scale1(16),
    borderTopRightRadius: scale1(16),
  },
  textStyle: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: fontSize1(14),
    color: colors.lineCancel,
  },
  footerStyle: {
    marginTop: heightScale1(40),
    gap: widthScale1(10),
    marginBottom: heightScale1(42),
  },
  resetButtonStyle: {
    flex: 3,
    borderRadius: scale1(8),
  },
  confirmButtonStyle: {
    flex: 7,
    borderRadius: scale1(8),
    marginLeft: widthScale1(10),
  },
  titleTextStyle: {
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    fontSize: fontSize1(16),
    textAlign: 'center',
    marginBottom: heightScale1(25),
  },
  menuWrapperStyle: {
    marginTop: heightScale1(30),
  },
  menuTitleTextStyle: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: fontSize1(16),
    marginBottom: heightScale1(10),
  },
  menuItemStyle: {
    borderWidth: 1,
    paddingHorizontal: widthScale1(14),
    paddingVertical: heightScale1(6),
    borderRadius: 999,
    minHeight: heightScale1(32),
    borderColor: colors.disableButton,
  },
});
