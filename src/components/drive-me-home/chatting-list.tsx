import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import React, {FC, memo, useCallback} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import RoomItem from '~components/chat-list/room-item';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {ChatRoomModel} from '~model/chat-model';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

interface Props {}

const ChattingList: FC<Props> = memo(props => {
  const {} = props;
  const navigation = useNavigation<UseRootStackNavigation>();
  const listChatData = useAppSelector(state => state.carpoolReducer.listChatData?.data);

  const renderItem = useCallback(({item, index}: {item: ChatRoomModel; index: number}) => {
    if (index <= 4) {
      return <RoomItem item={item} />;
    }
    return null;
  }, []);

  return (
    <View style={styles.container}>
      <HStack style={{justifyContent: 'space-between'}}>
        <CustomText
          string={`채팅리스트(${listChatData?.length ?? 0})`}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_7}
          color={colors.heavyGray}
          lineHeight={fontSize1(22)}
          forDriveMe
        />

        <Pressable
          onPress={() => {
            navigation.navigate(ROUTE_KEY.ChatList);
          }}>
          <HStack>
            <CustomText
              string={'전체보기'}
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION_6}
              color={colors.menuTextColor}
              lineHeight={heightScale1(20)}
              forDriveMe
            />
            <View style={{marginLeft: widthScale1(2)}}>
              <Icons.ChevronRight width={scale1(16)} height={scale1(16)} />
            </View>
          </HStack>
        </Pressable>
      </HStack>

      {listChatData?.length > 0 ? (
        <View style={{minHeight: 2}}>
          <FlashList
            data={listChatData}
            renderItem={renderItem}
            estimatedItemSize={100}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>
      ) : null}
    </View>
  );
});

export default ChattingList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: scale1(8),
    marginVertical: PADDING1,
    padding: PADDING1,
    gap: PADDING1,
  },
});
