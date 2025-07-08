import React, {useCallback, useImperativeHandle, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import CustomBoxSelectButton from '~components/commons/custom-box-select-button';
import CustomButton from '~components/commons/custom-button';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {PointFilterModel} from '~model/carpool-filter-model';
import {cachePointFilter} from '~reducers/carpoolReducer';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

const PointFilter = React.forwardRef((_, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const pointFilter = useAppSelector(state => state?.carpoolReducer?.pointFilter);
  const dispatch = useAppDispatch();

  const [currentFilter, setCurrentFilter] = useState<PointFilterModel>(pointFilter);

  useImperativeHandle(ref, () => ({show, hide}), []);

  const show = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  const onComplete = useCallback(() => {
    hide();
    dispatch(cachePointFilter(currentFilter));
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
      <View
        style={[
          styles.contentContainerStyle,
          {
            paddingBottom: heightScale1(42),
          },
        ]}>
        {/* header title */}
        <CustomText
          forDriveMe
          size={FONT.CAPTION_7}
          family={FONT_FAMILY.SEMI_BOLD}
          string="필터링"
          textStyle={{marginTop: heightScale1(30), textAlign: 'center'}}
        />
        <Text style={styles.titleTextStyle} />

        {/* body content */}
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
                selected={currentFilter?.situation === 'ACCUMULATE'}
                onSelected={() => {
                  setCurrentFilter(prev => {
                    return {...prev, situation: 'ACCUMULATE'};
                  });
                }}
                text="충전"
              />
              <CustomBoxSelectButton
                selected={currentFilter?.situation === 'USED'}
                onSelected={() => {
                  setCurrentFilter(prev => {
                    return {...prev, situation: 'USED'};
                  });
                }}
                text="사용"
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
                selected={currentFilter?.viewingPeriod === '12M'}
                onSelected={() => {
                  setCurrentFilter(prev => {
                    return {...prev, viewingPeriod: '12M'};
                  });
                }}
                text="12개월"
              />
              <CustomBoxSelectButton
                selected={currentFilter?.viewingPeriod === '6M'}
                onSelected={() => {
                  setCurrentFilter(prev => {
                    return {...prev, viewingPeriod: '6M'};
                  });
                }}
                text="6개월"
              />
              <CustomBoxSelectButton
                selected={currentFilter?.viewingPeriod === '3M'}
                onSelected={() => {
                  setCurrentFilter(prev => {
                    return {...prev, viewingPeriod: '3M'};
                  });
                }}
                text="3개월"
              />
              <CustomBoxSelectButton
                selected={currentFilter?.viewingPeriod === '1M'}
                onSelected={() => {
                  setCurrentFilter(prev => {
                    return {...prev, viewingPeriod: '1M'};
                  });
                }}
                text="1개월"
              />
            </HStack>
          </View>
        </View>

        {/* bottom */}
        <HStack style={styles.footerStyle}>
          <CustomButton
            onPress={clearAll}
            text="초기화"
            buttonHeight={58}
            type="TERTIARY"
            outLine
            leftIconReload
            buttonStyle={{width: widthScale1(100)}}
          />

          <CustomButton
            onPress={onComplete}
            text="완료"
            buttonHeight={58}
            buttonStyle={{flex: 1}}
          />
        </HStack>
      </View>
    </ReactNativeModal>
  );
});

export default React.memo(PointFilter);

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
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    color: colors.menuTextColor,
    fontSize: fontSize1(16),
    alignSelf: 'center',
  },
  footerStyle: {
    marginTop: heightScale1(40),
    gap: widthScale1(10),
  },
  filterWrapperStyle: {
    gap: widthScale1(10),
    flexWrap: 'wrap',
  },
  filterGroupStyle: {
    gap: heightScale1(10),
  },
});
