import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomBoxSelectButton from '~components/commons/custom-box-select-button';
import CustomButton from '~components/commons/custom-button';
import EmptyList from '~components/commons/empty-list';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import ParkingQuestionNoticeItem from '~components/parking-question-notice-board/parking-question-notice-item';
import {PADDING1} from '~constants/constant';
import {ValetQnaBbsProps} from '~constants/types';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useGetListReportQuery} from '~services/noticeServices';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

const Report: React.FC = memo(() => {
  const navigation: UseRootStackNavigation = useNavigation();
  const [selectedItem, setSelectedItem] = useState(1);
  const {userID} = userHook();

  const {data} = useGetListReportQuery({
    memberId: userID as number,
    gubun: selectedItem,
  });

  const renderItem = useCallback(({item}: {item: ValetQnaBbsProps}) => {
    return (
      <View>
        <ParkingQuestionNoticeItem
          onPressShowDetail={() => {
            navigation.navigate(ROUTE_KEY.ParkingRequestNoticeBoardDetail, {
              notice: item,
              isReport: true,
            });
          }}
          item={item}
          viewMode
        />
        <Divider />
      </View>
    );
  }, []);

  return (
    <FixedContainer edges={['left', 'right']}>
      <HStack style={styles.wrap}>
        <CustomBoxSelectButton
          text="드라이버"
          selected={selectedItem === 1}
          onSelected={() => {
            setSelectedItem(1);
          }}
        />
        <CustomBoxSelectButton
          text="탑승객"
          selected={selectedItem === 2}
          onSelected={() => {
            setSelectedItem(2);
          }}
        />
      </HStack>

      <Divider />

      <FlashList
        estimatedItemSize={70}
        data={data}
        renderItem={renderItem}
        ListEmptyComponent={() => {
          return <EmptyList text="신고내역이 없습니다." top={heightScale1(186)} />;
        }}
      />

      <CustomButton
        type="TERTIARY"
        onPress={() => navigation.navigate(ROUTE_KEY.FAQ)}
        text="자주 묻는 질문 보기"
        buttonStyle={[
          styles.buttonStyle,
          {
            marginVertical: PADDING1 / 2,
          },
        ]}
        outLine
        buttonHeight={58}
      />
    </FixedContainer>
  );
});

export default Report;

const styles = StyleSheet.create({
  wrap: {
    padding: PADDING1,
    gap: widthScale1(10),
  },
  buttonStyle: {
    marginHorizontal: PADDING1,
  },
  emptyListViewStyle: {
    alignItems: 'center',
    marginTop: '60%',
  },
});
