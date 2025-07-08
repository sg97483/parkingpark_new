import {View} from 'react-native';
import React, {memo, useCallback} from 'react';
import {FlashList} from '@shopify/flash-list';
import {PADDING1} from '~constants/constant';
import {DriverRoadDayModel} from '~model/driver-model';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import UserRequestCarpoolItem from './user-request-carpool-item';
import Divider from '~components/divider';

interface Props {
  data: DriverRoadDayModel[] | undefined;
  isLoading: boolean;
  onRefetch: () => void;
}

const CarpoolRequestList: React.FC<Props> = memo(props => {
  const {data, isLoading, onRefetch} = props;

  const renderItem = useCallback(({item}: {item: DriverRoadDayModel}) => {
    return (
      <View>
        <PaddingHorizontalWrapper forDriveMe>
          <UserRequestCarpoolItem item={item} />
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
export default CarpoolRequestList;
