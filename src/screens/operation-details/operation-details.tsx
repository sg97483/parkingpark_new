import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback} from 'react';
import {StyleSheet} from 'react-native';
import CarpoolHistoryItem from '~components/carpool-user-profile/carpool-history-item';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {CarpoolPayHistoryModel} from '~model/passenger-model';
import {RootStackScreenProps} from '~navigators/stack';
import {heightScale1} from '~styles/scaling-utils';

const OperationDetails = memo((props: RootStackScreenProps<'OperationDetails'>) => {
  const {navigation, route} = props;
  const {data, driverName} = route?.params;

  const renderHeader = useCallback(() => {
    return (
      <PaddingHorizontalWrapper>
        <CustomText
          string={`${driverName} 드라이버님은\n총 ${data?.length}회의 카풀완료 내역이 있어요!`}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_9}
          textStyle={styles.headerTextStyle}
          forDriveMe
        />
      </PaddingHorizontalWrapper>
    );
  }, []);

  const renderItem = useCallback(({item}: {item: CarpoolPayHistoryModel}) => {
    return <CarpoolHistoryItem item={item} hidePriceSection />;
  }, []);

  return (
    <FixedContainer>
      <CustomHeader text="" />

      <FlashList
        data={data}
        estimatedItemSize={100}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
      />
    </FixedContainer>
  );
});

export default OperationDetails;

const styles = StyleSheet.create({
  headerTextStyle: {
    marginTop: PADDING1,
    marginBottom: heightScale1(30),
  },
  itemWrapperStyle: {
    paddingHorizontal: PADDING1,
    marginVertical: heightScale1(30),
  },
});
