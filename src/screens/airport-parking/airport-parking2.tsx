import React, {memo, useState} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import Divider from '~components/divider';
import HStack from '~components/h-stack';
import CustomBoxSelectButton from '~components/commons/custom-box-select-button';
import {heightScale, heightScale1} from '~styles/scaling-utils';
import {ROUTE_KEY} from '~navigators/router';
import {IMAGES} from '~/assets/images-path';
import {RootStackScreensParams} from '~navigators/stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import CustomButton from '~components/commons/custom-button';
import {useAppSelector} from '~store/storeHooks';
import {useParkingDetailsQuery} from '~services/parkingServices';
import {showMessage} from 'react-native-flash-message';
import {strings} from '~constants/strings';

// useNavigation 타입 지정
type NavigationProp = StackNavigationProp<RootStackScreensParams, 'DirectIndoorParkingAtGimpo'>;

const AirportParking2 = memo(() => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedAirport, setSelectedAirport] = useState<'INCHEON' | 'GIMPO'>('INCHEON');
  const parkingID = 70007;

  // 유저 토큰 가져오기
  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  // ValetParkingDetail 기능: 데이터 조회 및 유저 검증
  const {data} = useParkingDetailsQuery({id: parkingID}, {skip: !parkingID});

  const handleReservation = () => {
    if (!userToken?.id || !userToken?.password) {
      // 로그인 확인
      navigation.navigate(ROUTE_KEY.Login);
      showMessage({
        message: strings?.general_text?.login_first,
      });
      return;
    }

    if (data) {
      // 데이터가 존재하면 바로 ValetNobelParkingReservation1로 이동
      navigation.navigate(ROUTE_KEY.ValetNobelParkingReservation1, {
        parkingLot: data,
      });
    } else {
      showMessage({
        message: strings?.general_text?.please_try_again,
      });
    }
  };

  return (
    <FixedContainer>
      <CustomHeader text="공항 주차" />

      {/* 공항 선택 버튼 */}
      <HStack style={styles.headerStyle}>
        <CustomBoxSelectButton
          onSelected={() => setSelectedAirport('INCHEON')}
          text="인천공항"
          selected={selectedAirport === 'INCHEON'}
        />
        <CustomBoxSelectButton
          onSelected={() => setSelectedAirport('GIMPO')}
          text="김포공항"
          selected={selectedAirport === 'GIMPO'}
        />
      </HStack>

      {/* 이미지 섹션 */}
      <ScrollView showsVerticalScrollIndicator={true}>
        <View style={styles.imageWrapper}>
          <Image source={IMAGES.incheon_guide} style={styles.incheon_guide} resizeMode="contain" />
          <Image
            source={IMAGES.incheon_content1}
            style={styles.incheon_content1}
            resizeMode="contain"
          />
          <Image
            source={IMAGES.incheon_content2}
            style={styles.incheon_content2}
            resizeMode="contain"
          />
          {selectedAirport === 'INCHEON' ? (
            <Pressable onPress={() => navigation.navigate(ROUTE_KEY.ParkingDetails, {id: 19634})}>
              <Image source={IMAGES.kimpo_share} style={styles.kimpo_share} resizeMode="contain" />
            </Pressable>
          ) : (
            <Pressable onPress={() => navigation.navigate(ROUTE_KEY.ParkingDetails, {id: 19952})}>
              <Image
                source={IMAGES.kimpo_balsan}
                style={styles.kimpo_balsan}
                resizeMode="contain"
              />
            </Pressable>
          )}
          <Divider style={styles.divider} />
        </View>
      </ScrollView>

      {/* 예약하기 버튼 */}
      <PaddingHorizontalWrapper
        containerStyles={{marginTop: heightScale(20), marginBottom: 10}}
        forDriveMe>
        <CustomButton
          text="예약하기"
          buttonHeight={58}
          onPress={handleReservation} // ValetParkingDetail 없이 바로 이동
        />
      </PaddingHorizontalWrapper>
    </FixedContainer>
  );
});

export default AirportParking2;

const styles = StyleSheet.create({
  headerStyle: {
    padding: heightScale1(10),
    gap: heightScale1(10),
  },
  divider: {
    marginVertical: heightScale1(30),
  },
  imageWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  incheon_guide: {
    width: '100%',
    height: undefined,
    aspectRatio: 750 / 402,
  },
  incheon_content1: {
    width: '100%',
    height: undefined,
    aspectRatio: 1500 / 4228,
  },
  incheon_content2: {
    width: '100%',
    height: undefined,
    aspectRatio: 1500 / 4860,
  },
  kimpo_share: {
    width: '100%',
    height: undefined,
    aspectRatio: 750 / 320,
  },
  kimpo_balsan: {
    width: '100%',
    height: undefined,
    aspectRatio: 750 / 320,
  },
});
