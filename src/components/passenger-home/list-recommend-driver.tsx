import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import LoadingComponent from '~components/loading-component';
import RecommendDriverItem from '~components/recommend-driver-list/recommend-driver-item';
import {PADDING1, WIDTH} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {DriverRoadDayModel} from '~model/driver-model';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

export interface ListRecommandDriverRefs {
  show: (topInsetValue: number) => void;
  hide: () => void;
  scrollToTop: () => void;
}

interface Props {
  listDriver: DriverRoadDayModel[];
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  isLoading?: boolean;
}

const ListRecommandDriver = forwardRef((props: Props, ref) => {
  const {listDriver, onScroll, isLoading} = props;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const listDriverRef = useRef<FlatList>(null);
  const transactionType = useAppSelector(
    state => state?.carpoolReducer?.passengerModeFilter?.carInOut,
  );

  const [topInset, setTopInset] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const snapPoints = useMemo(() => ['100%'], []);

  const show = useCallback((topInsetValue: number) => {
    setTopInset(topInsetValue);
    bottomSheetRef?.current?.snapToIndex(0);
  }, []);

  const hide = useCallback(() => {
    bottomSheetRef?.current?.close();
  }, []);

  const scrollToTop = useCallback(() => {
    listDriverRef.current?.scrollToIndex({index: 0, animated: true});
  }, []);

  useImperativeHandle(ref, () => ({show, hide, scrollToTop}), []);

  const renderItem = useCallback(({item}: {item: DriverRoadDayModel}) => {
    if (item?.splat && item?.splng) {
      return <RecommendDriverItem item={item} />;
    }
  }, []);

  const renderListEmpty = useCallback(() => {
    return (
      <View style={styles.listEmptyWrapperStyle}>
        <Text style={styles.emptyTextStyle}>{'탑승객님과 딱맞는\n드라이버를 찾지 못했어요.'}</Text>
      </View>
    );
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      handleIndicatorStyle={{
        backgroundColor: colors.transparent,
      }}
      onChange={index => {
        if (currentIndex === -1) {
          setCurrentIndex(index);
        }
      }}
      snapPoints={snapPoints}>
      <BottomSheetView
        style={[
          styles.contentContainer,
          {
            marginTop: topInset,
          },
        ]}>
        {isLoading || currentIndex === -1 ? (
          <LoadingComponent />
        ) : (
          <View>
            <FlatList
              ref={listDriverRef}
              data={listDriver.filter(item => item?.carInOut === transactionType)}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
              ListEmptyComponent={renderListEmpty}
              contentContainerStyle={{
                paddingTop: PADDING1,
                paddingBottom: heightScale1(150),
              }}
              onScroll={onScroll}
              initialNumToRender={5}
              keyExtractor={item => item?.id.toString()}
            />
          </View>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
});

export default React.memo(ListRecommandDriver);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.policy,
    width: WIDTH,
    minHeight: 2,
    paddingHorizontal: PADDING1,
  },
  listEmptyWrapperStyle: {
    marginTop: '60%',
    alignItems: 'center',
  },
  emptyTextStyle: {
    textAlign: 'center',
    fontFamily: FONT_FAMILY.REGULAR,
    color: colors.grayText,
    fontSize: fontSize1(16),
  },
});
