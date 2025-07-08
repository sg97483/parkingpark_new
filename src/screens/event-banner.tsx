import React, {memo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // useNavigation 훅 추가
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import {strings} from '~constants/strings';
import {heightScale1} from '~styles/scaling-utils';
import AdBannersEvent from '~components/new-home/ad-banners-event';

const EventBanner = memo(() => {
  const navigation = useNavigation(); // useNavigation 사용하여 navigation 객체 가져오기

  return (
    <FixedContainer>
      <CustomHeader text={strings.drawer.event_banner} />
      <ScrollView showsVerticalScrollIndicator={true}>
        <View style={styles.imageWrapper}>
          {/*<Image
            source={IMAGES.kimpo_guide}
            style={styles.kimpo_guide}
            resizeMode="contain"
            resizeMethod="resize"
          />



          <Divider style={styles.divider} />

          <Image
            source={IMAGES.kimpo_explain}
            style={styles.kimpo_explain}
            resizeMode="contain"
            resizeMethod="resize"
          />*/}
        </View>

        <AdBannersEvent />
      </ScrollView>
    </FixedContainer>
  );
});

export default EventBanner;

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
