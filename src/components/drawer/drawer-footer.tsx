import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Image, Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ICONS} from '~/assets/images-path';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING, PADDING_HEIGHT} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {handleCallHotLine} from '~utils/common';

interface Props {}

const DrawerFooter: React.FC<Props> = memo(props => {
  const navigation: UseRootStackNavigation = useNavigation();

  const onPressCall = () => {
    handleCallHotLine('02-707-3371');
  };

  const onPressKaKao = () => {
    const installLink =
      'https://pf.kakao.com/_Sxdjxij/chat?app_key=22c4bfa018700f7d700c5043dbd77e58&kakao_agent=sdk%2F2.3.0%20sdk_type%2Fkotlin%20os%2Fandroid-26%20lang%2Fen-US%20origin%2FLZIfRkYVD1PUdPkDQlEHYjeXdTs%3D%20device%2FSM-G935S%20android_pkg%2Fkr.wisemobile.parking%20app_ver%2F5.850&api_ver=1.0';
    Linking.canOpenURL(installLink)
      .then(supported => {
        if (supported) {
          return Linking.openURL(installLink);
        } else {
          console.log('KakaoTalk is not installed');
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  return (
    <View style={{marginTop: PADDING}}>
      <TouchableOpacity onPress={onPressCall}>
        <View style={styles.content}>
          <Image source={ICONS.local_phone} style={styles.icon} resizeMode="contain" />

          <View style={{marginLeft: PADDING / 2}}>
            <HStack>
              <CustomText string="02-707-3371" color={colors.red} family={FONT_FAMILY.SEMI_BOLD} />
              <CustomText
                string="고객센터"
                size={FONT.CAPTION}
                color={colors.grayText}
                textStyle={{marginLeft: widthScale(5)}}
              />
            </HStack>
            <CustomText
              string="평일 오전 9시 ~ 오후 6시"
              size={FONT.CAPTION}
              color={colors.grayText}
              textStyle={{marginTop: PADDING / 2}}
            />
            <CustomText
              string="주말 오전 10시 ~ 오후 3시"
              size={FONT.CAPTION}
              color={colors.grayText}
              textStyle={{marginTop: PADDING / 2}}
            />
          </View>
        </View>
      </TouchableOpacity>

      <HStack style={styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate(ROUTE_KEY.FAQ)}>
          <HStack style={{alignItems: 'center'}}>
            <Image source={ICONS.live_help} style={styles.icon} />
            <CustomText
              string="자주묻는질문"
              size={FONT.CAPTION}
              color={colors.grayText}
              textStyle={{marginLeft: widthScale(5)}}
            />
          </HStack>
        </TouchableOpacity>

        <TouchableOpacity onPress={onPressKaKao}>
          <HStack style={{alignItems: 'center'}}>
            <Image source={ICONS.chat_bubble_outline} style={styles.icon} />
            <CustomText
              string="카카오톡채널"
              size={FONT.CAPTION}
              color={colors.grayText}
              textStyle={{marginLeft: widthScale(5)}}
            />
          </HStack>
        </TouchableOpacity>
      </HStack>
    </View>
  );
});

export default DrawerFooter;

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: widthScale(30),
    height: heightScale(30),
  },
  icon25: {
    width: widthScale(25),
    height: heightScale(25),
  },
  row: {justifyContent: 'space-around', marginTop: PADDING_HEIGHT},
});
