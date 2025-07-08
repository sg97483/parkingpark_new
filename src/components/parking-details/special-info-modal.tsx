import React, {forwardRef, useCallback, useImperativeHandle, useState} from 'react';
import {Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import Carousel from 'react-native-reanimated-carousel';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import {PADDING, width} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

interface Props {}

export interface SpecialInfoModalRefs {
  show: (images: string[], message: string, blogURL: string) => void;
  hide: () => void;
}

const SpecialInfoModal = forwardRef((props: Props, ref) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [blogURL, setBlogURL] = useState<string>('');

  const show = (images: string[], message: string, blogURL: string) => {
    let imageList = images?.filter(img => img !== '');
    setIsVisible(true);
    setImages(imageList);
    setMessage(message);
    setBlogURL(blogURL);
  };

  const hide = () => {
    setIsVisible(false);
  };

  useImperativeHandle(
    ref,
    () => ({
      show,
      hide,
    }),
    [],
  );

  const renderImage = useCallback(({item}: {item: string}) => {
    return <FastImage source={{uri: item}} style={styles.imageWrapper} resizeMode="contain" />;
  }, []);

  return (
    <Modal
      useNativeDriver={true}
      isVisible={isVisible}
      onBackButtonPress={hide}
      onBackdropPress={hide}>
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.red, colors.orange]}
          style={styles.linearGradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <CustomText
            string="주차장 특이사항"
            color={colors.white}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.BODY}
          />
        </LinearGradient>
        {images?.length > 0 ? (
          <Carousel
            loop
            width={width * 0.85}
            height={heightScale(200)}
            autoPlay={true}
            data={images}
            scrollAnimationDuration={1000}
            onSnapToItem={index => console.log('current index:', index)}
            renderItem={renderImage}
            style={{
              backgroundColor: colors.white,
              marginTop: heightScale(15),
            }}
          />
        ) : (
          <View
            style={{
              width: width * 0.85,
              height: heightScale(200),
              backgroundColor: colors.card,
            }}
          />
        )}

        <TouchableOpacity
          onPress={() => {
            Linking.openURL(blogURL);
          }}
          style={styles.viewParkingButtonWrapper}>
          <CustomText
            string={'주차장 상세이용정보\n(블로그) 보기'}
            color={colors.white}
            family={FONT_FAMILY.SEMI_BOLD}
            textStyle={{
              textAlign: 'center',
            }}
          />
        </TouchableOpacity>
        <Divider />

        <View style={styles.content}>
          <CustomText string={message} family={FONT_FAMILY.BOLD} />
        </View>

        <Divider />
        <TouchableOpacity onPress={hide} style={styles.closeButtonWrapper}>
          <CustomText string="확인" color={colors.red} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
});

export default SpecialInfoModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    width: width * 0.85,
    alignSelf: 'center',
  },
  linearGradient: {
    height: heightScale(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  imageWrapper: {
    width: width * 0.85,
    height: heightScale(200),
  },
  viewParkingButtonWrapper: {
    minHeight: heightScale(45),
    backgroundColor: colors.green,
    width: width * 0.5,
    borderRadius: widthScale(5),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: PADDING,
  },
  content: {
    padding: PADDING,
  },
  closeButtonWrapper: {
    minHeight: heightScale(45),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
