import React, {memo} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack'; // StackNavigationProp 추가
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import {strings} from '~constants/strings';
import {IMAGES} from '~/assets/images-path';
import Divider from '~components/divider';
import {heightScale1} from '~styles/scaling-utils';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreensParams} from '~navigators/stack'; // RootStackScreensParams 추가

// useNavigation의 타입 지정
type NavigationProp = StackNavigationProp<RootStackScreensParams, 'DirectIndoorParkingAtGimpo'>;

const AirportParking = memo(() => {
  const navigation = useNavigation<NavigationProp>(); // useNavigation에 타입 지정

  const handleParkingDetailsPress = (id: number) => {
    navigation.navigate(ROUTE_KEY.ParkingDetails, {id}); // 고정된 id 값을 사용하여 ParkingDetails로 이동
  };

  return (
    <FixedContainer>
      <CustomHeader text={strings.drawer.airport} />
      <ScrollView showsVerticalScrollIndicator={true}>
        <View style={styles.imageWrapper}>
          <Image
            source={IMAGES.kimpo_guide}
            style={styles.kimpo_guide}
            resizeMode="contain"
            resizeMethod="resize"
          />

          {/* 클릭 가능한 영역으로 변경 */}
          <Pressable onPress={() => handleParkingDetailsPress(19634)}>
            <Image
              source={IMAGES.kimpo_share}
              style={styles.kimpo_share}
              resizeMode="contain"
              resizeMethod="resize"
            />
          </Pressable>

          <Divider style={styles.divider} />

          {/* 클릭 가능한 영역으로 변경 */}
          <Pressable onPress={() => handleParkingDetailsPress(19952)}>
            <Image
              source={IMAGES.kimpo_balsan}
              style={styles.kimpo_balsan}
              resizeMode="contain"
              resizeMethod="resize"
            />
          </Pressable>

          <Divider style={styles.divider} />

          <Pressable onPress={() => handleParkingDetailsPress(19322)}>
            <Image
              source={IMAGES.kimpo_ecomagok}
              style={styles.kimpo_ecomagok}
              resizeMode="contain"
              resizeMethod="resize"
            />
          </Pressable>

          <Divider style={styles.divider} />

          <Pressable onPress={() => handleParkingDetailsPress(19071)}>
            <Image
              source={IMAGES.kimpo_gmg}
              style={styles.kimpo_gmg}
              resizeMode="contain"
              resizeMethod="resize"
            />
          </Pressable>

          <Divider style={styles.divider} />

          <Pressable onPress={() => handleParkingDetailsPress(19426)}>
            <Image
              source={IMAGES.kimpo_center}
              style={styles.kimpo_center}
              resizeMode="contain"
              resizeMethod="resize"
            />
          </Pressable>

          <Divider style={styles.divider} />

          <Image
            source={IMAGES.kimpo_explain}
            style={styles.kimpo_explain}
            resizeMode="contain"
            resizeMethod="resize"
          />
        </View>
      </ScrollView>
    </FixedContainer>
  );
});

export default AirportParking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  divider: {
    marginVertical: heightScale1(30),
  },
  imageWrapper: {
    width: '100%',
    alignItems: 'center', // 이미지를 중앙 정렬
  },
  kimpo_guide: {
    width: '100%', // 가로를 부모 뷰에 맞춤
    height: undefined,
    aspectRatio: 750 / 438, // 이미지의 가로 세로 비율 설정
  },
  kimpo_share: {
    width: '100%', // 가로를 부모 뷰에 맞춤
    height: undefined,
    aspectRatio: 750 / 320, // 이미지의 가로 세로 비율 설정
  },
  kimpo_balsan: {
    width: '100%', // 가로를 부모 뷰에 맞춤
    height: undefined,
    aspectRatio: 750 / 320, // 이미지의 가로 세로 비율 설정
  },
  kimpo_ecomagok: {
    width: '100%', // 가로를 부모 뷰에 맞춤
    height: undefined,
    aspectRatio: 750 / 320, // 이미지의 가로 세로 비율 설정
  },
  kimpo_gmg: {
    width: '100%', // 가로를 부모 뷰에 맞춤
    height: undefined,
    aspectRatio: 750 / 320, // 이미지의 가로 세로 비율 설정
  },
  kimpo_center: {
    width: '100%', // 가로를 부모 뷰에 맞춤
    height: undefined,
    aspectRatio: 750 / 320, // 이미지의 가로 세로 비율 설정
  },
  kimpo_explain: {
    width: '100%', // 가로를 부모 뷰에 맞춤
    height: undefined,
    aspectRatio: 750 / 244, // 이미지의 가로 세로 비율 설정
  },
});
