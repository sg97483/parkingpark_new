import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import BlockedUserItem from '~components/block-user/blocked-user-item';
import EmptyList from '~components/commons/empty-list';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import {FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {BlockedUserModel} from '~model/driver-model';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetBlockedUserListQuery, useUnblockUserMutation} from '~services/carpoolServices';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

const BlockUser = memo((props: RootStackScreenProps<'BlockUser'>) => {
  const {navigation} = props;
  const {userID} = userHook();

  const {
    data: listBlockedUser,
    isFetching,
    refetch,
  } = useGetBlockedUserListQuery(
    {
      memberId: userID as number,
    },
    {skip: !userID},
  );

  const [unblockUser] = useUnblockUserMutation();

  const handleUnblockUser = useCallback(
    (id: number) => {
      return () => {
        unblockUser({
          blockMId: id,
          memberId: userID as number,
        })
          .unwrap()
          .then((res: string) => {
            if (res === '200') {
              refetch();
            } else {
              showMessage({
                message: strings.general_text.please_try_again,
              });
              return;
            }
          })
          .catch(err => {
            showMessage({
              message: err?.message,
            });
          });
      };
    },
    [userID],
  );

  const renderItem = useCallback(
    ({item}: {item: BlockedUserModel}) => {
      return <BlockedUserItem item={item} onUnlockPress={handleUnblockUser(item?.blockMId)} />;
    },
    [handleUnblockUser],
  );

  const renderEmpty = useCallback(() => {
    return <EmptyList text="차단한 사용자가 없습니다." top={heightScale1(303)} />;
  }, []);

  return (
    <FixedContainer>
      <CustomHeader text="차단 사용자 관리" />

      <FlashList
        refreshing={isFetching}
        onRefresh={refetch}
        data={listBlockedUser}
        renderItem={renderItem}
        estimatedItemSize={94}
        ListEmptyComponent={renderEmpty}
      />
    </FixedContainer>
  );
});

export default BlockUser;

const styles = StyleSheet.create({
  emptyTextStyle: {
    marginTop: heightScale1(258),
    textAlign: 'center',
    color: colors.grayText,
    fontSize: fontSize1(16),
    fontFamily: FONT_FAMILY.MEDIUM,
  },
});
