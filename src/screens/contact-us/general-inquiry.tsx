import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {DeviceEventEmitter, StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import AppModal from '~components/app-modal';
import CustomBoxSelectButton from '~components/commons/custom-box-select-button';
import CustomButton from '~components/commons/custom-button';
import EmptyList from '~components/commons/empty-list';
import Divider from '~components/divider';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import ParkingQuestionNoticeItem from '~components/parking-question-notice-board/parking-question-notice-item';
import {PADDING1} from '~constants/constant';
import {EMIT_EVENT, IS_ACTIVE} from '~constants/enum';
import {strings} from '~constants/strings';
import {ValetQnaBbsProps} from '~constants/types';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {
  useDeleteQnaBbsMutation,
  useGetListValetQnaBbsQuery,
  useLazyGetMyListValetQnaBbsQuery,
} from '~services/parkingServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  onModeChange: (value: 'PARKING' | 'DRIVER' | 'PASSENGER') => void;
}

const GeneralInquiry: React.FC<Props> = memo(props => {
  const {onModeChange} = props;
  const navigation: UseRootStackNavigation = useNavigation();
  const {userToken, user} = userHook();

  const [deleteQnaBbs] = useDeleteQnaBbsMutation();

  const listQNA = useAppSelector(state => state?.parkingReducer?.listQNA);

  const [lastID, setLastID] = useState<number>(0);
  const [QNAFor, setQNAFor] = useState<string>('PARKING');

  const [trigger, {data: myData, isFetching: isMyFetching}] = useLazyGetMyListValetQnaBbsQuery();
  const {
    data: otherData,
    refetch,
    isFetching: isOtherFetching,
  } = useGetListValetQnaBbsQuery({
    count: 10,
    lastID: lastID,
    parkId: QNAFor === 'DRIVER' ? 70031 : 70032,
  });

  const isParkingMode = QNAFor === 'PARKING';

  useEffect(() => {
    const listeners = DeviceEventEmitter.addListener(EMIT_EVENT.RELOAD_QNA_BBS, () => {
      onRefresh();
    });

    return () => {
      listeners.remove();
    };
  }, []);

  useEffect(() => {
    if (isParkingMode) {
      trigger({
        count: 10,
        lastID: lastID,
        parkId: 70004,
        memberId: userToken?.id,
        memberPwd: userToken?.password,
      });
    } else {
      refetch();
    }
  }, [lastID, QNAFor, trigger, refetch, isParkingMode, userToken?.id, userToken?.password]);

  const onRefresh = useCallback(() => {
    if (lastID === 0) {
      if (isParkingMode) {
        trigger({
          count: 10,
          lastID: 0,
          parkId: 70004,
          memberId: userToken?.id,
          memberPwd: userToken?.password,
        });
      } else {
        refetch();
      }
    } else {
      setLastID(0);
    }
  }, [lastID, isParkingMode, trigger, refetch, userToken?.id, userToken?.password]);

  const onEndReached = useCallback(() => {
    const currentData = isParkingMode ? myData : otherData;
    if (currentData?.length === 10) {
      setLastID(currentData[currentData?.length - 1]?.id);
    } else {
      return;
    }
  }, [myData, otherData, isParkingMode]);

  const renderItem = useCallback(({item, index}: {item: ValetQnaBbsProps; index: number}) => {
    return (
      <View>
        <ParkingQuestionNoticeItem
          key={index}
          item={item}
          onPressButtonActions={() => onPressDeleteItem(item)}
          onPressShowDetail={onPressNoticeDetail}
        />
        <Divider />
      </View>
    );
  }, []);

  const onPressDeleteItem = (item: ValetQnaBbsProps) => {
    AppModal.show({
      title: '문의내용을 삭제하시겠습니까?',
      content: '삭제된 내용을 복구할수 없습니다.\n삭제를 원하시면 삭제하기를 클릭해주세요.',
      isTwoButton: true,
      textNo: '닫기',
      textYes: '삭제',
      yesFunc: () => handleDelete(item),
    });
  };

  const handleDelete = (item: ValetQnaBbsProps) => {
    if (userToken?.id && userToken?.password && item?.id) {
      const body = {
        memberId: userToken?.id + '',
        memberPwd: userToken.password,
        id: item?.id + '',
      };
      deleteQnaBbs(body)
        .unwrap()
        .then(res => {
          if (res === '200') {
            onRefresh();
          } else {
            showMessage({
              message: strings?.general_text?.please_try_again,
            });
          }
        });
    }
  };

  const onPressNoticeDetail = (item: ValetQnaBbsProps) => {
    let isSameMemberId = false;
    if (item?.memberId === userToken?.id) {
      isSameMemberId = true;
    }

    let isAdmin = false;
    if (userToken?.adminYN === IS_ACTIVE.YES) {
      isAdmin = true;
    }

    let isValetParkingAdmin = false;
    if (user?.adminValetParkingId) {
      isValetParkingAdmin = true;
    }

    if (isSameMemberId || isAdmin || isValetParkingAdmin) {
      navigation.navigate(ROUTE_KEY.ParkingRequestNoticeBoardDetail, {
        notice: item,
      });
    } else {
      showMessage({
        message: strings.parking_request_notice_board.permission,
      });
    }
  };

  const renderHeaderList = useMemo(() => {
    return (
      <View>
        <HStack style={styles.headerStyle}>
          <CustomBoxSelectButton
            onSelected={() => {
              setLastID(0);
              setQNAFor('PARKING');
              onModeChange('PARKING');
            }}
            text="주차"
            selected={QNAFor === 'PARKING'}
          />

          <CustomBoxSelectButton
            onSelected={() => {
              setLastID(0);
              setQNAFor('DRIVER');
              onModeChange('DRIVER');
            }}
            text="드라이버"
            selected={QNAFor === 'DRIVER'}
          />

          <CustomBoxSelectButton
            onSelected={() => {
              setLastID(0);
              setQNAFor('PASSENGER');
              onModeChange('PASSENGER');
            }}
            text="탑승객"
            selected={QNAFor === 'PASSENGER'}
          />
        </HStack>
        <Divider />
      </View>
    );
  }, [QNAFor, onModeChange]);

  const formatList = useMemo((): ValetQnaBbsProps[] => {
    const currentData = isParkingMode ? myData : otherData;
    if (userToken?.adminYN === IS_ACTIVE.YES) {
      return currentData as ValetQnaBbsProps[];
    } else {
      return currentData?.filter(
        (it: ValetQnaBbsProps) => it?.memberId === userToken?.id,
      ) as ValetQnaBbsProps[];
    }
  }, [userToken, myData, otherData, isParkingMode]);

  return (
    <View style={styles.containerStyle}>
      {renderHeaderList}

      <FlashList
        data={formatList}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onRefresh={onRefresh}
        estimatedItemSize={70}
        refreshing={isMyFetching || isOtherFetching}
        ListEmptyComponent={() => {
          return <EmptyList text="문의 내역이 없습니다." top={heightScale1(186)} />;
        }}
      />

      <PaddingHorizontalWrapper forDriveMe>
        <CustomButton
          text="자주 묻는 질문 보기"
          type="TERTIARY"
          outLine
          buttonStyle={[
            styles.buttonStyle,
            {
              marginVertical: heightScale1(10),
            },
          ]}
          onPress={() => navigation.navigate(ROUTE_KEY.FAQ)}
        />
      </PaddingHorizontalWrapper>
    </View>
  );
});

export default GeneralInquiry;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: colors.white,
  },
  buttonStyle: {
    minHeight: heightScale1(58),
  },
  emptyListViewStyle: {
    alignItems: 'center',
    marginTop: '60%',
  },
  headerStyle: {
    padding: PADDING1,
    gap: widthScale1(10),
  },
  filterButtonStyle: {
    minHeight: heightScale1(32),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: widthScale1(14),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.disableButton,
  },
});
