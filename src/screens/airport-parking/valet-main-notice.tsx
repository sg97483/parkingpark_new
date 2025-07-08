import {DeviceEventEmitter, StyleSheet, TouchableOpacity} from 'react-native';
import React, {memo, useCallback, useEffect} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {useAppSelector} from '~store/storeHooks';
import {useValetMainNoticeListQuery} from '~services/valetParkingServices';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HStack from '~components/h-stack';
import CustomText from '~components/custom-text';
import {EMIT_EVENT, FONT, IS_ACTIVE} from '~constants/enum';
import {widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import {PADDING} from '~constants/constant';
import {FlashList} from '@shopify/flash-list';
import {ValetMainNoticeProps} from '~constants/types';
import ValetMainNoticeItem from '~components/valet-main-notice/valet-main-notice-item';
import Divider from '~components/divider';
import {ROUTE_KEY} from '~navigators/router';

const ValetMainNotice = memo((props: RootStackScreenProps<'ValetMainNotice'>) => {
  const {navigation} = props;
  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const {data, refetch} = useValetMainNoticeListQuery();

  const renderItem = useCallback(({item}: {item: ValetMainNoticeProps}) => {
    return <ValetMainNoticeItem item={item} />;
  }, []);

  useEffect(() => {
    const listeners = DeviceEventEmitter.addListener(EMIT_EVENT.VALET_MAIN_NOTICE, () => {
      refetch();
    });

    return () => {
      listeners.remove();
    };
  }, []);

  return (
    <FixedContainer>
      <CustomHeader
        text="공지사항"
        rightContent={
          <>
            {userToken?.adminYN === IS_ACTIVE.YES ? (
              <TouchableOpacity
                onPress={() => navigation.navigate(ROUTE_KEY.ValetMainNoticeCreate)}
                style={styles.createButtonWrapper}>
                <HStack>
                  <Icon name="pencil" style={{marginRight: widthScale(3)}} color={colors.white} />
                  <CustomText string="글쓰기" size={FONT.CAPTION_2} color={colors.white} />
                </HStack>
              </TouchableOpacity>
            ) : null}
          </>
        }
      />

      <FlashList
        data={data}
        estimatedItemSize={200}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Divider />}
      />
    </FixedContainer>
  );
});

export default ValetMainNotice;

const styles = StyleSheet.create({
  createButtonWrapper: {
    backgroundColor: colors.red,
    borderRadius: widthScale(5),
    paddingVertical: widthScale(5),
    paddingHorizontal: PADDING / 2,
  },
});
