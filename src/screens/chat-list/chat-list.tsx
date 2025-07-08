import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {ChatRoomModel} from '~/model/chat-model';
import RoomItem from '~components/chat-list/room-item';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import LoadingComponent from '~components/loading-component';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {FONT_FAMILY} from '~constants/enum';
import {RootStackScreenProps} from '~navigators/stack';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

const ChatList = memo((props: RootStackScreenProps<'ChatList'>) => {
  const listChatData = useAppSelector(state => state.carpoolReducer.listChatData);

  const renderEmptyList = useCallback(() => {
    return <CustomText string="채팅방이 없습니다." forDriveMe textStyle={styles.emptyTextStyle} />;
  }, []);

  const renderItem = useCallback(({item}: {item: ChatRoomModel}) => {
    return (
      <View>
        <PaddingHorizontalWrapper forDriveMe>
          <RoomItem item={item} />
        </PaddingHorizontalWrapper>
        <Divider />
      </View>
    );
  }, []);

  return (
    <FixedContainer>
      <CustomHeader text="채팅" />

      {listChatData?.isFetching ? (
        <LoadingComponent />
      ) : (
        listChatData?.data && (
          <FlashList
            data={listChatData?.data}
            renderItem={renderItem}
            estimatedItemSize={100}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyList}
          />
        )
      )}
    </FixedContainer>
  );
});

export default ChatList;

const styles = StyleSheet.create({
  emptyTextStyle: {
    marginTop: heightScale1(258),
    textAlign: 'center',
    color: colors.grayText,
    fontSize: fontSize1(16),
    fontFamily: FONT_FAMILY.MEDIUM,
  },
});
