import React, {useCallback, useImperativeHandle, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import CustomBoxSelectButton from '~components/commons/custom-box-select-button';
import CustomButton from '~components/commons/custom-button';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {ChargeFilterModel} from '~model/carpool-filter-model';
import {cacheChargeFilter} from '~reducers/carpoolReducer';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

export interface FilterModalRefs {
  show: () => void;
  hide: () => void;
}
interface Props {
  onCancel: () => void;
  onComplete: () => void;
}

const RechargeFilter = React.forwardRef((props: Props, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const chargeFilter = useAppSelector(state => state?.carpoolReducer?.chargeFilter);
  const dispatch = useAppDispatch();

  const [currentFilter, setCurrentFilter] = useState<ChargeFilterModel>(chargeFilter);

  useImperativeHandle(ref, () => ({show, hide}), []);

  const show = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  const onComplete = useCallback(() => {
    dispatch(cacheChargeFilter(currentFilter));
    hide();
  }, [currentFilter]);

  const clearAll = useCallback(() => {
    setCurrentFilter({
      situation: '',
      viewingPeriod: '',
    });
  }, []);

  return (
    <ReactNativeModal
      style={styles.containerStyle}
      isVisible={isVisible}
      onBackdropPress={hide}
      onBackButtonPress={hide}
      useNativeDriver
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}>
      <View style={styles.contentContainerStyle}>
        {/* header title */}
        <CustomText
          forDriveMe
          textStyle={styles.titleTextStyle}
          string="필터링"
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_7}
        />

        <View style={{gap: heightScale1(30)}}>
          <View style={styles.filterGroupStyle}>
            <CustomText
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION_7}
              string="상태"
            />
            <HStack style={styles.filterWrapperStyle}>
              <CustomBoxSelectButton
                selected={currentFilter?.situation === 'DIRECT_CHARGING'}
                onSelected={() => {
                  setCurrentFilter(prev => {
                    return {
                      ...prev,
                      situation: 'DIRECT_CHARGING',
                    };
                  });
                }}
                text="직접충전"
              />
              <CustomBoxSelectButton
                text="정산충전"
                selected={currentFilter?.situation === 'SETTLEMENT_RECHARGE'}
                onSelected={() => {
                  setCurrentFilter(prev => {
                    return {
                      ...prev,
                      situation: 'SETTLEMENT_RECHARGE',
                    };
                  });
                }}
              />
              <CustomBoxSelectButton
                text="사용"
                selected={currentFilter?.situation === 'USED'}
                onSelected={() => {
                  setCurrentFilter(prev => {
                    return {
                      ...prev,
                      situation: 'USED',
                    };
                  });
                }}
              />
            </HStack>
          </View>

          <View style={styles.filterGroupStyle}>
            <CustomText
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION_7}
              string="조회기간"
            />
            <HStack style={styles.filterWrapperStyle}>
              <CustomBoxSelectButton
                text="12개월"
                selected={currentFilter?.viewingPeriod === '12M'}
                onSelected={() => {
                  setCurrentFilter(prev => {
                    return {
                      ...prev,
                      viewingPeriod: '12M',
                    };
                  });
                }}
              />
              <CustomBoxSelectButton
                text="6개월"
                selected={currentFilter?.viewingPeriod === '6M'}
                onSelected={() => {
                  setCurrentFilter(prev => {
                    return {
                      ...prev,
                      viewingPeriod: '6M',
                    };
                  });
                }}
              />
              <CustomBoxSelectButton
                text="3개월"
                selected={currentFilter?.viewingPeriod === '3M'}
                onSelected={() => {
                  setCurrentFilter(prev => {
                    return {
                      ...prev,
                      viewingPeriod: '3M',
                    };
                  });
                }}
              />
              <CustomBoxSelectButton
                text="1개월"
                selected={currentFilter?.viewingPeriod === '1M'}
                onSelected={() => {
                  setCurrentFilter(prev => {
                    return {
                      ...prev,
                      viewingPeriod: '1M',
                    };
                  });
                }}
              />
            </HStack>
          </View>
        </View>

        {/* bottom */}
        <HStack style={styles.footerStyle}>
          <CustomButton
            onPress={clearAll}
            type="TERTIARY"
            outLine
            text="초기화"
            leftIconReload
            buttonHeight={58}
            buttonStyle={styles.resetButtonStyle}
          />
          <CustomButton
            buttonStyle={styles.confirmButtonStyle}
            onPress={onComplete}
            type="PRIMARY"
            text="완료"
            buttonHeight={58}
          />
        </HStack>
      </View>
    </ReactNativeModal>
  );
});

export default React.memo(RechargeFilter);

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
  titleTextStyle: {
    marginVertical: heightScale1(30),
    textAlign: 'center',
  },
  footerStyle: {
    marginTop: heightScale1(40),
    marginBottom: heightScale1(42),
    gap: widthScale1(10),
  },
  resetButtonStyle: {
    minWidth: widthScale1(100),
  },
  confirmButtonStyle: {
    flex: 1,
  },
  filterGroupStyle: {
    gap: heightScale1(10),
  },
  filterWrapperStyle: {
    gap: widthScale1(10),
    flexWrap: 'wrap',
  },
});
