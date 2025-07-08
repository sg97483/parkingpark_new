import {Image, ScrollView, StyleSheet, View} from 'react-native';
import React, {memo, useState} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import {PADDING} from '~constants/constant';
import {ROUTE_KEY} from '~navigators/router';
import {useAppSelector} from '~store/storeHooks';
import {showMessage} from 'react-native-flash-message';
import {strings} from '~constants/strings';
import {useParkingDetailsQuery} from '~services/parkingServices';
import {IMAGES} from '~/assets/images-path';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import CustomButton from '~components/commons/custom-button';

const ValetParkingDetail = memo((props: RootStackScreenProps<'ValetParkingDetail'>) => {
  const {navigation, route} = props;
  const parkingID = route?.params?.parkingID;

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const [imageIndex, setImageIndex] = useState<number>(1);

  const {data} = useParkingDetailsQuery(
    {
      id: parkingID,
    },
    {
      skip: !parkingID,
    },
  );

  const handleGoToUsageHistory = () => {
    if (!userToken?.id || !userToken?.password) {
      navigation.navigate(ROUTE_KEY.Login);
      showMessage({
        message: strings?.general_text?.login_first,
      });
      return;
    }

    navigation.navigate(ROUTE_KEY.UsageHistory);
  };

  const handleNextImage = () => {
    if (imageIndex < 5) {
      setImageIndex(oldIndex => oldIndex + 1);
    } else {
      setImageIndex(1);
    }
  };

  const handlePreviousImage = () => {
    if (imageIndex > 1) {
      setImageIndex(oldIndex => oldIndex - 1);
    } else {
      setImageIndex(5);
    }
  };

  const handleSubmit = () => {
    if (!userToken?.id || !userToken?.password) {
      navigation.navigate(ROUTE_KEY.Login);
      showMessage({
        message: strings?.general_text?.login_first,
      });
      return;
    }

    if (data) {
      navigation.navigate(ROUTE_KEY.ValetParkingReservation1, {
        parkingLot: data,
      });
    }
  };

  return (
    <FixedContainer>
      <CustomHeader text="발렛파킹 주차장 정보" />

      <ScrollView showsVerticalScrollIndicator={true}>
        <View style={styles.imageWrapper}>
          <Image
            source={IMAGES.valet_guide4} // 경로 수정
            style={styles.image1}
            resizeMode="contain" // 비율을 유지하며 이미지가 화면 안에 맞도록 설정
            resizeMethod="resize" // 크기를 조정할 때 좀 더 나은 퀄리티 제공
          />
          <Image
            source={IMAGES.valet_guide5} // 경로 수정
            style={styles.image2}
            resizeMode="contain" // 비율을 유지하며 이미지가 화면 안에 맞도록 설정
            resizeMethod="resize" // 크기를 조정할 때 좀 더 나은 퀄리티 제공
          />

          <Image
            source={IMAGES.valet_guide6} // 경로 수정
            style={styles.image3}
            resizeMode="contain" // 비율을 유지하며 이미지가 화면 안에 맞도록 설정
            resizeMethod="resize" // 크기를 조정할 때 좀 더 나은 퀄리티 제공
          />
        </View>
      </ScrollView>

      <PaddingHorizontalWrapper
        containerStyles={{marginTop: heightScale(20), marginBottom: 10}}
        forDriveMe>
        <CustomButton text="예약하기" buttonHeight={58} onPress={handleSubmit} />
      </PaddingHorizontalWrapper>
    </FixedContainer>
  );
});

export default ValetParkingDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomMenuWrapper: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    paddingVertical: PADDING / 2,
  },
  button: {
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginBottom: heightScale(5),
  },
  submitButton: {
    backgroundColor: colors.red,
    height: heightScale(50),
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: widthScale(5),
    alignSelf: 'center',
    marginVertical: PADDING / 3,
  },
  imageViewWrapper: {
    borderWidth: 1,
    marginHorizontal: PADDING,
    minHeight: heightScale(150),
    borderColor: colors.gray,
    marginTop: PADDING,
    paddingVertical: heightScale(5),
  },
  leftIcon: {
    position: 'absolute',
    top: heightScale(150 / 2) - widthScale(30),
  },
  rightIcon: {
    position: 'absolute',
    right: 0,
    top: heightScale(150 / 2) - widthScale(30),
    alignSelf: 'center',
  },
  image: {
    flex: 1,
  },
  imageWrapper: {
    width: '100%',
    alignItems: 'center', // 이미지를 중앙 정렬
  },
  image1: {
    width: '100%', // 가로를 부모 뷰에 맞춤
    height: undefined,
    aspectRatio: 1500 / 1221, // 이미지의 가로 세로 비율 설정
  },
  image2: {
    width: '100%', // 가로를 부모 뷰에 맞춤
    height: undefined,
    aspectRatio: 1501 / 3329, // 이미지의 가로 세로 비율 설정
  },
  image3: {
    width: '100%', // 가로를 부모 뷰에 맞춤
    height: undefined,
    aspectRatio: 1500 / 2253, // 이미지의 가로 세로 비율 설정
  },
});
