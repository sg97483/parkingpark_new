import {Image, ScrollView, StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {IMAGES} from '~/assets/images-path';
import {heightScale} from '~styles/scaling-utils';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import CustomButton from '~components/commons/custom-button';

const ValetParkingAtIncheon = memo((props: RootStackScreenProps<'ValetParkingAtIncheon'>) => {
  const {navigation} = props;

  return (
    <FixedContainer>
      <CustomHeader text="인천공항 발렛파킹 서비스" />

      <ScrollView showsVerticalScrollIndicator={true}>
        <View style={styles.imageWrapper}>
          <Image
            source={IMAGES.valet_guide1} // 경로 수정
            style={styles.image1}
            resizeMode="contain" // 비율을 유지하며 이미지가 화면 안에 맞도록 설정
            resizeMethod="resize" // 크기를 조정할 때 좀 더 나은 퀄리티 제공
          />
          <Image
            source={IMAGES.valet_guide2} // 경로 수정
            style={styles.image2}
            resizeMode="contain" // 비율을 유지하며 이미지가 화면 안에 맞도록 설정
            resizeMethod="resize" // 크기를 조정할 때 좀 더 나은 퀄리티 제공
          />

          <Image
            source={IMAGES.valet_guide3} // 경로 수정
            style={styles.image3}
            resizeMode="contain" // 비율을 유지하며 이미지가 화면 안에 맞도록 설정
            resizeMethod="resize" // 크기를 조정할 때 좀 더 나은 퀄리티 제공
          />
        </View>
      </ScrollView>

      <PaddingHorizontalWrapper
        containerStyles={{marginTop: heightScale(20), marginBottom: 10}}
        forDriveMe>
        <CustomButton
          text="발렛파킹 예약하기"
          buttonHeight={58}
          onPress={() =>
            navigation.navigate('ValetParkingDetail', {
              parkingID: 70001,
            })
          }
        />
      </PaddingHorizontalWrapper>
    </FixedContainer>
  );
});

export default ValetParkingAtIncheon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageWrapper: {
    width: '100%',
    alignItems: 'center', // 이미지를 중앙 정렬
  },
  image1: {
    width: '100%', // 가로를 부모 뷰에 맞춤
    height: undefined,
    aspectRatio: 1500 / 876, // 이미지의 가로 세로 비율 설정
  },
  image2: {
    width: '100%', // 가로를 부모 뷰에 맞춤
    height: undefined,
    aspectRatio: 1501 / 2064, // 이미지의 가로 세로 비율 설정
  },
  image3: {
    width: '100%', // 가로를 부모 뷰에 맞춤
    height: undefined,
    aspectRatio: 1501 / 3312, // 이미지의 가로 세로 비율 설정
  },
});
