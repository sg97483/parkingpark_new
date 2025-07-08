import React, {memo, useState} from 'react';
import {Image, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import {IMAGES} from '~/assets/images-path';
import CustomButton from '~components/commons/custom-button';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1, WIDTH} from '~constants/constant';
import {strings} from '~constants/strings';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

const TutorialSlider = memo((props: RootStackScreenProps<'TutorialSlider'>) => {
  const {navigation, route} = props;

  const fromHome = route?.params?.fromHome;
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleNext = () => {
    if (fromHome) {
      navigation.goBack();
    } else {
      navigation.navigate(ROUTE_KEY.PermissionActivity);
    }
  };

  return (
    <FixedContainer>
      <StatusBar translucent backgroundColor={colors.transparent} />

      <View style={{flex: 1}}>
        <ScrollView
          onMomentumScrollEnd={e => {
            setCurrentIndex(e?.nativeEvent?.contentOffset?.x / WIDTH);
          }}
          bounces={false}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled>
          <View style={styles.imageWrapperStyle}>
            <Image resizeMode="contain" style={styles.image} source={IMAGES.tutorial_1_slider} />
          </View>

          <View style={styles.imageWrapperStyle}>
            <Image resizeMode="contain" style={styles.image} source={IMAGES.tutorial_2_slider} />
          </View>

          <View style={styles.imageWrapperStyle}>
            <Image resizeMode="contain" style={styles.image} source={IMAGES.tutorial_3_slider} />
          </View>

          <View style={styles.imageWrapperStyle}>
            <Image resizeMode="contain" style={styles.image} source={IMAGES.tutorial_4_slider} />
          </View>

          <View style={styles.imageWrapperStyle}>
            <Image resizeMode="contain" style={styles.image} source={IMAGES.tutorial_5_slider} />
          </View>
        </ScrollView>

        <View style={styles.indicatorStyle}>
          <HStack
            style={{
              gap: widthScale1(7),
            }}>
            {new Array(5).fill('').map((_, index) => {
              return (
                <View
                  key={index}
                  style={[
                    styles.dotStyle,
                    {
                      backgroundColor: currentIndex === index ? colors.heavyGray : colors.gray,
                    },
                  ]}
                />
              );
            })}
          </HStack>
        </View>
      </View>

      <PaddingHorizontalWrapper forDriveMe>
        <CustomButton
          buttonStyle={{
            marginBottom: PADDING1 / 2,
          }}
          buttonHeight={58}
          text={strings.tutorial_button}
          onPress={handleNext}
        />
      </PaddingHorizontalWrapper>
    </FixedContainer>
  );
});

export default TutorialSlider;

const styles = StyleSheet.create({
  image: {
    width: widthScale1(260),
    height: heightScale1(538),
    alignSelf: 'center',
  },
  imageWrapperStyle: {
    width: WIDTH,
    flex: 1,
    justifyContent: 'center',
  },
  dotStyle: {
    width: widthScale1(7),
    height: widthScale1(7),
    borderRadius: 999,
  },
  indicatorStyle: {
    position: 'absolute',
    zIndex: 999,
    bottom: heightScale1(50),
    alignItems: 'center',
    left: 0,
    right: 0,
  },
});
