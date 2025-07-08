import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native'; // View import 추가
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
// import {useNavigation} from '@react-navigation/native'; // props에서 navigation을 받으므로 이 줄은 필요 없습니다.

const CarPoolRouteChoice = (props: RootStackScreenProps<'CarPoolRouteChoice'>) => {
  const {navigation, route} = props;
  const myRoute = route?.params?.route;
  const routeInRegistered = route?.params?.routeInRegistered;

  return (
    <FixedContainer>
      <CustomHeader />

      <PaddingHorizontalWrapper>
        <CustomText
          forDriveMe
          string={'카풀 경로를 등록 방식을\n선택해주세요!'}
          family={FONT_FAMILY.SEMI_BOLD}
          color={colors.menuTextColor}
          size={FONT.CAPTION_9}
          textStyle={{marginTop: heightScale1(10), marginBottom: heightScale1(30)}}
          lineHeight={heightScale1(31)}
        />

        {/* 👇 기본 경로 등록 버튼 그림자 구조 수정 */}
        <View style={styles.boxShadowWrapper}>
          <Pressable
            style={styles.boxContentWrapper}
            onPress={() =>
              navigation.navigate(ROUTE_KEY.CarPoolWayToWorkRegistration, {
                route: myRoute,
              })
            }>
            <CustomText
              string={'기본 경로 등록'}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.CAPTION_8}
              color={colors.black}
              textStyle={{paddingBottom: heightScale1(8)}}
              lineHeight={heightScale1(28)}
              forDriveMe
            />
            <CustomText
              string={'등록된 출퇴근길 경로로 간편하게 등록'}
              color={colors.grayText2}
              lineHeight={heightScale1(20)}
              forDriveMe
            />
          </Pressable>
        </View>

        {/* 👇 새로운 경로 등록 버튼 그림자 구조 수정 */}
        <View style={[styles.boxShadowWrapper, {marginTop: heightScale1(18)}]}>
          <Pressable
            style={styles.boxContentWrapper}
            onPress={() =>
              navigation.navigate(ROUTE_KEY.DriverWayToWork1, {
                isReturnRoute: myRoute?.carInOut === 'out',
                selectedDate: myRoute?.selectDate,
                isDailyRegistration: true,
                previousRoute: routeInRegistered,
                isNewRoute: true,
              })
            }>
            <CustomText
              string={'새로운 경로 등록'}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.CAPTION_8}
              color={colors.black}
              textStyle={{paddingBottom: heightScale1(8)}}
              lineHeight={heightScale1(28)}
              forDriveMe
            />
            <CustomText
              string={'새로운 출퇴근길 경로로 매칭률 업그레이드'}
              color={colors.grayText2}
              lineHeight={heightScale1(20)}
              forDriveMe
            />
          </Pressable>
        </View>
      </PaddingHorizontalWrapper>
    </FixedContainer>
  );
};

export default CarPoolRouteChoice;

const styles = StyleSheet.create({
  // 그림자를 담당하는 외부 컨테이너
  boxShadowWrapper: {
    shadowColor: colors.shadowColor,
    shadowOffset: {height: 2, width: 2},
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
    // borderRadius를 여기에 적용하면 그림자가 해당 모양을 따릅니다.
    // 실제 내용물의 borderRadius와 일치시키는 것이 좋습니다.
    borderRadius: widthScale1(8),
  },
  // 실제 버튼의 내용과 모양을 담당
  boxContentWrapper: {
    padding: widthScale1(18),
    borderRadius: widthScale1(8),
    backgroundColor: colors.white,
    minHeight: heightScale1(92),
    overflow: 'hidden', // 내용물이 borderRadius를 벗어나지 않도록
  },
});
