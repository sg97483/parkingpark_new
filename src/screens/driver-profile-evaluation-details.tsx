import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import ItemRating from '~components/driver-profile-evaluation-details/item-rating';
import RenderProgress from '~components/driver-profile-evaluation-details/render-progress';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import RatingDisplay from '~components/rating';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {DriverEvaluationModel} from '~model/driver-model';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetDriverEvaluationListQuery} from '~services/driverServices';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

const DriverProfileEvaluationDetails = memo(
  (props: RootStackScreenProps<'DriverProfileEvaluationDetails'>) => {
    const {route} = props;
    const {driverID, evaluationAvg} = route?.params;

    const {data: listDriverEvaluation} = useGetDriverEvaluationListQuery(
      {
        driverID,
      },
      {skip: !driverID},
    );

    const listHeader = useCallback(() => {
      return (
        <PaddingHorizontalWrapper forDriveMe>
          <CustomText
            textStyle={styles.content}
            size={FONT.CAPTION_9}
            family={FONT_FAMILY.SEMI_BOLD}
            string={`총 ${listDriverEvaluation?.length ?? 0}건의 상세후기가 있어요.`}
            forDriveMe
          />

          <View style={styles.viewTop}>
            <RatingDisplay
              rating={
                (Number(evaluationAvg?.avg1 ?? 0) +
                  Number(evaluationAvg?.avg2 ?? 0) +
                  Number(evaluationAvg?.avg3 ?? 0)) /
                3
              }
            />
            <RenderProgress
              style={{marginTop: heightScale1(20)}}
              text={'친절해요'}
              star={Number(evaluationAvg?.avg1 ?? 0).toFixed(1)}
            />
            <RenderProgress
              style={{marginTop: heightScale1(10)}}
              text={'차안이 청결해요'}
              star={Number(evaluationAvg?.avg2 ?? 0).toFixed(1)}
            />
            <RenderProgress
              style={{marginTop: heightScale1(10)}}
              text={'시간을 잘지켜요'}
              star={Number(evaluationAvg?.avg3 ?? 0).toFixed(1)}
            />
          </View>
        </PaddingHorizontalWrapper>
      );
    }, [evaluationAvg, listDriverEvaluation?.length]);

    const renderRatingItem = useCallback(({item}: {item: DriverEvaluationModel}) => {
      return <ItemRating item={item} />;
    }, []);

    return (
      <FixedContainer edges={['top']}>
        <CustomHeader />

        <FlashList
          data={listDriverEvaluation}
          estimatedItemSize={70}
          renderItem={renderRatingItem}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={listHeader}
        />
      </FixedContainer>
    );
  },
);

export default DriverProfileEvaluationDetails;
const styles = StyleSheet.create({
  view: {
    paddingHorizontal: PADDING1,
  },
  content: {
    marginTop: PADDING1,
    marginBottom: heightScale1(30),
  },
  viewTop: {
    backgroundColor: colors.evaluateBackground,
    padding: widthScale1(22),
    borderRadius: 8,
    marginBottom: heightScale1(30),
  },
});
