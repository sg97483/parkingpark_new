import {View} from 'react-native';
import React, {memo, useCallback} from 'react';
import {FlashList} from '@shopify/flash-list';
import {PADDING1} from '~constants/constant';
import {DriverRoadDayModel} from '~model/driver-model';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import UserRequestCarpoolParkItem from './user-request-carpool-park-item';
import Divider from '~components/divider';

interface Props {
  data: DriverRoadDayModel[] | undefined;
  isLoading: boolean;
  onRefetch: () => void;
}

const CarpoolRequestParkList: React.FC<Props> = memo(props => {
  const {data, isLoading, onRefetch} = props;

  const renderItem = useCallback(({item}: {item: DriverRoadDayModel}) => {
    return (
      <View>
        <PaddingHorizontalWrapper forDriveMe>
          <UserRequestCarpoolParkItem item={item} />
        </PaddingHorizontalWrapper>
        <Divider insetsVertical={30} />
      </View>
    );
  }, []);

  return (
    <FlashList
      contentContainerStyle={{
        paddingTop: PADDING1,
      }}
      data={data}
      renderItem={renderItem}
      estimatedItemSize={250}
      refreshing={isLoading}
      onRefresh={onRefetch}
    />
  );
});
export default CarpoolRequestParkList;
