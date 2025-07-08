import {Image, ImageBackground, ScrollView, StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {PADDING, width} from '~constants/constant';
import {IMAGES} from '~/assets/images-path';
import CustomText from '~components/custom-text';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import {FONT_FAMILY} from '~constants/enum';
import FastImage from 'react-native-fast-image';

interface Props {
  data: string[];
}

const EventPopupMainPage: React.FC<Props> = memo(props => {
  const {data} = props;

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        style={[styles.imgBGWrapper, {marginTop: PADDING / 2}]}
        resizeMode="contain"
        source={IMAGES.event_popup_main_top}>
        <CustomText
          string={data[0]}
          color={colors.white}
          family={FONT_FAMILY.BOLD}
          textStyle={styles.imgText}
        />
      </ImageBackground>

      <ImageBackground
        style={styles.imgBGWrapper}
        resizeMode="contain"
        source={IMAGES.event_popup_main_top}>
        <CustomText
          string={data[1]}
          color={colors.white}
          family={FONT_FAMILY.BOLD}
          textStyle={styles.imgText}
        />
      </ImageBackground>

      <Image
        source={IMAGES.event_popup_main_alarm_one}
        resizeMode="contain"
        style={styles.alertOne}
      />

      <View style={styles.alertWrapper}>
        <CustomText string={data[2]} color={colors.darkGray} />
      </View>
      <View style={styles.alertWrapper}>
        <CustomText string={data[3]} color={colors.darkGray} />
      </View>

      <Image
        source={IMAGES.event_popup_main_alarm_two}
        resizeMode="contain"
        style={styles.alertTwo}
      />

      <View style={styles.alertWrapper}>
        <CustomText string={data[4]} color={colors.darkGray} />
      </View>
      {/* Content */}
      <Image
        source={{uri: data[5]}}
        style={styles.imageWrapper}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.alertWrapper}>
        <CustomText string={data[6]} color={colors.darkGray} />
      </View>

      <Image
        source={{uri: data[7]}}
        style={styles.imageWrapper}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.alertWrapper}>
        <CustomText string={data[8]} color={colors.darkGray} />
      </View>

      <Image
        source={{uri: data[9]}}
        style={styles.imageWrapper}
        resizeMode={FastImage.resizeMode.contain}
      />
    </ScrollView>
  );
});

export default EventPopupMainPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width * 0.8,
    paddingHorizontal: PADDING,
  },
  imgBGWrapper: {
    height: heightScale(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgText: {
    marginTop: -heightScale(5),
  },
  alertOne: {
    height: heightScale(74 / 3),
    width: widthScale(462 / 3),
  },
  alertTwo: {
    height: heightScale(74 / 3),
    width: widthScale(498 / 3),
  },
  alertWrapper: {
    borderWidth: widthScale(1),
    height: heightScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: widthScale(5),
    borderColor: colors.gray,
    marginBottom: PADDING / 2,
  },
  imageWrapper: {
    width: '100%',
    height: heightScale(300),
    borderWidth: 1,
    marginBottom: PADDING / 2,
  },
});
