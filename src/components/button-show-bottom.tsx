import React, {useState} from 'react';
import {
  Animated,
  LayoutAnimation,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import CustomText from './custom-text';
import {ICONS} from '~/assets/images-path';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {PADDING} from '~constants/constant';
import {colors} from '~styles/colors';

interface Props {
  viewBottom: React.ReactElement;
  title: React.ReactNode;
  content: string;
  style?: StyleProp<ViewStyle>;
  isShow?: boolean;
}

const ButtonShowBottom = ({viewBottom, title, content, style, isShow}: Props) => {
  const [isShowBottom, setIsShowBottom] = useState(true);
  const rotateAnim = useState(new Animated.Value(0))[0];

  const rotateArrow = () => {
    setIsShowBottom(!isShowBottom);
    Animated.timing(rotateAnim, {
      toValue: isShowBottom ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const interpolatedRotateAnimation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.view1}>
      <TouchableOpacity style={[styles.view, style]} onPress={rotateArrow}>
        <View>
          {/* ✅ 수정된 부분 시작 */}
          {typeof title === 'string' ? (
            <CustomText string={title} family={FONT_FAMILY.SEMI_BOLD} size={FONT.TITLE_3} />
          ) : (
            title
          )}
          {/* ✅ 수정된 부분 끝 */}
          <CustomText
            string={content}
            family={FONT_FAMILY.REGULAR}
            size={FONT.SUB_HEAD}
            textStyle={{marginTop: heightScale(10)}}
          />
        </View>
        <Animated.Image
          source={ICONS.img_reservation_arrow_up}
          style={[
            styles.img,
            {
              transform: [{rotate: interpolatedRotateAnimation}],
              tintColor: isShowBottom ? colors.black : colors.redSwitch,
            },
          ]}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
      {isShowBottom && viewBottom}
    </View>
  );
};

export default ButtonShowBottom;

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  img: {
    width: widthScale(15),
    height: widthScale(15),
  },
  view1: {
    marginHorizontal: PADDING,
  },
});
