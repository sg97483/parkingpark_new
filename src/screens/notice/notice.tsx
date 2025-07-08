import {FlashList} from '@shopify/flash-list';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import CustomMenu from '~components/commons/custom-menu';
import CustomHeader from '~components/custom-header';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import {ValetMainNoticeProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useValetMainNoticeListQuery} from '~services/valetParkingServices';
import {dayjs} from '~utils/dayjsUtil';
import {getDayName} from '~utils/hourUtils';

const Notice = (props: RootStackScreenProps<'Notice'>) => {
  const {navigation} = props;

  const {data} = useValetMainNoticeListQuery();

  const renderItem = useCallback(({item}: {item: ValetMainNoticeProps}) => {
    return (
      <View>
        <CustomMenu
          onPress={() => {
            navigation.navigate(ROUTE_KEY.NoticeDetail, {
              item: item,
            });
          }}
          text={`[공지]${item?.subject}`}
          subText={`${dayjs(item?.regdate * 1000).format('YYYY.MM.DD')}(${getDayName(
            item?.regdate * 1000,
          )})`}
          hideChevron
          menuHeight={86}
          normalText
        />
        <Divider />
      </View>
    );
  }, []);

  return (
    <FixedContainer>
      <CustomHeader text="공지사항" />

      <FlashList estimatedItemSize={86} data={data} renderItem={renderItem} />
    </FixedContainer>
  );
};

export default Notice;
