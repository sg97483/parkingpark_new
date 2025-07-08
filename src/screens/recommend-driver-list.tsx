import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomButton from '~components/commons/custom-button';
import EmptyList from '~components/commons/empty-list';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import LoadingComponent from '~components/loading-component';
import RecommendDriverItem from '~components/recommend-driver-list/recommend-driver-item';
import {PADDING, PADDING1} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {DriverRoadDayModel} from '~model/driver-model';
import {RootStackScreenProps} from '~navigators/stack';
import {useReadAllDriverRoadDayInfoQuery} from '~services/carpoolServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

const RecommendDriverList = memo((props: RootStackScreenProps<'RecommendDriverList'>) => {
  const transactionType = useAppSelector(
    state => state?.carpoolReducer?.passengerModeFilter?.carInOut,
  );

  const {data: listDriver, refetch, isFetching} = useReadAllDriverRoadDayInfoQuery();

  const renderItem = useCallback(({item}: {item: DriverRoadDayModel}) => {
    return <RecommendDriverItem item={item} />;
  }, []);

  const renderListEmpty = useCallback(() => {
    return (
      <EmptyList text={'탑승객님과 딱맞는\n드라이버를 찾지 못했어요.'} top={heightScale1(292)} />
    );
  }, []);

  return (
    <FixedContainer edges={['top']}>
      <CustomHeader text="추천 드라이버" />

      <View style={styles.containerStyle}>
        <FixedContainer
          style={[
            styles.containerStyle,
            {
              paddingHorizontal: PADDING,
              paddingBottom: PADDING / 2,
            },
          ]}
          edges={['bottom']}>
          {isFetching ? (
            <LoadingComponent />
          ) : (
            <FlashList
              data={listDriver?.filter(item => item?.carInOut === transactionType) || []}
              renderItem={renderItem}
              estimatedItemSize={heightScale1(100)}
              ListEmptyComponent={renderListEmpty}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: PADDING1,
              }}
            />
          )}

          <CustomButton
            text="다시 추천받기"
            onPress={refetch}
            buttonStyle={{
              borderRadius: scale1(8),
              marginTop: heightScale1(10),
              marginBottom: PADDING1 / 2,
            }}
            type="TERTIARY"
            outLine
            leftIconReload
            buttonHeight={58}
          />
        </FixedContainer>
      </View>
    </FixedContainer>
  );
});

export default RecommendDriverList;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: colors.policy,
  },
  listEmptyWrapperStyle: {
    marginTop: '80%',
    alignItems: 'center',
  },
  emptyTextStyle: {
    textAlign: 'center',
    fontFamily: FONT_FAMILY.MEDIUM,
    color: colors.grayText,
    fontSize: fontSize1(16),
  },
});
