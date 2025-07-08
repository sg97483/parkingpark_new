import React, {memo} from 'react';
import {Image, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {ICONS} from '~/assets/images-path';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import HStack from '~components/h-stack';
import {PADDING_HEIGHT} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {heightScale, widthScale} from '~styles/scaling-utils';

interface Props {
  containerStyle?: ViewStyle;
  onPhonePress: () => void;
  onSharePress: () => void;
  onAlarmPress: () => void;
  onGuidePress: () => void;
  onParkingVideoPress: () => void;
  onStreetViewPress: () => void;
}

const QuickAction: React.FC<Props> = memo(props => {
  const {
    containerStyle,
    onAlarmPress,
    onGuidePress,
    onParkingVideoPress,
    onPhonePress,
    onSharePress,
    onStreetViewPress,
  } = props;

  return (
    <View style={containerStyle}>
      <HStack style={styles.container}>
        <TouchableOpacity onPress={onPhonePress} style={styles.buttonWrapper}>
          <Image source={ICONS.call_add} style={styles.icon} />

          <CustomText
            string="전 화"
            size={FONT.CAPTION_2}
            family={FONT_FAMILY.SEMI_BOLD}
            textStyle={styles.iconText}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onSharePress} style={styles.buttonWrapper}>
          <Image source={ICONS.share} style={styles.icon} />

          <CustomText
            string="주차장공유"
            size={FONT.CAPTION_2}
            family={FONT_FAMILY.SEMI_BOLD}
            textStyle={styles.iconText}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onAlarmPress} style={styles.buttonWrapper}>
          <Image source={ICONS.timer} style={styles.icon} />

          <CustomText
            string="주차알람"
            size={FONT.CAPTION_2}
            family={FONT_FAMILY.SEMI_BOLD}
            textStyle={styles.iconText}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onGuidePress} style={styles.buttonWrapper}>
          <Image source={ICONS.routing} style={styles.icon} />

          <CustomText
            string="길찾기"
            size={FONT.CAPTION_2}
            family={FONT_FAMILY.SEMI_BOLD}
            textStyle={styles.iconText}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onParkingVideoPress} style={styles.buttonWrapper}>
          <Image source={ICONS.youtube_outline} style={styles.icon} />

          <CustomText
            string="주차영상"
            size={FONT.CAPTION_2}
            family={FONT_FAMILY.SEMI_BOLD}
            textStyle={styles.iconText}
          />
        </TouchableOpacity>

        {/*<TouchableOpacity onPress={onStreetViewPress} style={styles.buttonWrapper}>
          <Image source={ICONS.map} style={styles.icon} />
          <CustomText
            string="거리뷰"
            size={FONT.CAPTION_2}
            family={FONT_FAMILY.SEMI_BOLD}
            textStyle={styles.iconText}
          />
  </TouchableOpacity>*/}
      </HStack>
      <Divider style={{marginTop: heightScale(8)}} />
    </View>
  );
});

export default QuickAction;

const styles = StyleSheet.create({
  container: {
    paddingTop: heightScale(12),
    paddingBottom: PADDING_HEIGHT / 2,
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    marginTop: heightScale(5),
  },
  icon: {
    width: widthScale(30),
    height: widthScale(30),
  },
});
