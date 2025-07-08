import React, {useCallback} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import CustomMenu from '~components/commons/custom-menu';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY, REPORT_TYPE} from '~constants/enum';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {heightScale1} from '~styles/scaling-utils';

export const REPORT_DRIVER_DATA: {title: string; value: REPORT_TYPE}[] = [
  {
    title: '카풀 위치에 나타나지 않았어요.',
    value: REPORT_TYPE.NOT_APPEAR_AT_CARPOOL,
  },
  {
    title: '카풀 차량이 등록된 차량과 달라요.',
    value: REPORT_TYPE.CARPOOL_VEHICLE_IS_DIFFERENT,
  },
  {
    title: '불편한 대화를 해요.',
    value: REPORT_TYPE.UNPLEASANT_CONVERSATION,
  },
  {
    title: '개인적인 거래를 요구해요.',
    value: REPORT_TYPE.ADDITIONAL_PAYMENT_REQUEST,
  },
  {
    title: '차량사고가 발생했어요.',
    value: REPORT_TYPE.ACCIDENT_OCCURRED,
  },
  {
    title: '기타',
    value: REPORT_TYPE.OTHER,
  },
];

const ReportDriverStep1 = (props: RootStackScreenProps<'ReportDriverStep1'>) => {
  const {navigation, route} = props;
  const {driverID, driverName, routeID} = route?.params;

  const handleNextPage = useCallback(
    (value: REPORT_TYPE) => () => {
      navigation.navigate(ROUTE_KEY.ReportDriverStep2, {reportType: value, driverID, routeID});
    },
    [driverID, routeID],
  );

  return (
    <FixedContainer>
      <CustomHeader text="신고하기" />

      <ScrollView contentContainerStyle={styles.containerStyle}>
        <CustomText
          string={`${driverName} 드라이버님을\n신고하는 이유를 선택해주세요.`}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_8}
          textStyle={{
            paddingHorizontal: PADDING1,
          }}
          forDriveMe
          lineHeight={heightScale1(28)}
        />

        <Divider style={{marginTop: PADDING1}} />

        {REPORT_DRIVER_DATA?.flatMap(item => {
          return (
            <View key={item?.value}>
              <CustomMenu
                menuHeight={66}
                onPress={handleNextPage(item?.value)}
                text={item?.title}
              />
              <Divider />
            </View>
          );
        })}
      </ScrollView>
    </FixedContainer>
  );
};

export default ReportDriverStep1;

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: heightScale1(20),
  },
  menuWrapperStyle: {
    height: heightScale1(56),
    paddingHorizontal: PADDING1,
    justifyContent: 'center',
  },
});
