import moment from 'moment';
import React, {forwardRef, memo, useImperativeHandle, useMemo, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {FONT_FAMILY} from '~constants/enum';
import {NoticeEventProps} from '~constants/types';
import {cacheEventNoticeToday} from '~reducers/eventNoticeReducer';
import {useAppDispatch} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import Indicator from './indicator';

export interface EventPopupRefs {
  show: (data: NoticeEventProps) => void;
  hide: () => void;
}

const EventPopup = forwardRef((_, ref) => {
  const dispatch = useAppDispatch();

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [data, setData] = useState<NoticeEventProps | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const text = data?.text?.replace(/\r\n/g, '').split('///');
  const images = useMemo(() => {
    if (text) {
      return [text[5], text[7], text[9]];
    } else {
      return [];
    }
  }, [text]);

  useImperativeHandle(
    ref,
    () => ({
      show,
      hide,
    }),
    [],
  );

  const show = (value: NoticeEventProps) => {
    setData(value);
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
    setData(null);
  };

  const handleHideTody = () => {
    dispatch(
      cacheEventNoticeToday({
        show: false,
        date: moment().valueOf(),
      }),
    );
    hide();
  };

  return (
    <Modal style={styles.modalStyle} isVisible={isVisible} useNativeDriver={true}>
      <View>
        <HStack style={styles.headerStyle}>
          {new Array(images?.length ?? 0).fill('').map((_, index) => (
            <Indicator key={index} currentIndex={currentIndex} index={index} />
          ))}
        </HStack>

        <View
          style={{
            width: widthScale1(335),
            height: widthScale1(335),
          }}>
          <ScrollView
            style={{
              width: widthScale1(335),
              height: widthScale1(335),
              flexShrink: 1,
            }}
            onMomentumScrollEnd={e => {
              setCurrentIndex(Math.round(e?.nativeEvent?.contentOffset?.x / widthScale1(335)));
            }}
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}>
            {images?.map((imageURL, index) => {
              return (
                <FastImage
                  key={index.toString()}
                  source={{
                    uri: imageURL,
                  }}
                  style={styles.imageStyle}
                  resizeMode="cover"
                />
              );
            })}
          </ScrollView>
        </View>

        <HStack style={styles.footerStyle}>
          <Pressable onPress={handleHideTody} style={styles.buttonWrapperStyle}>
            <CustomText
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              color={colors.white}
              string="24시간 보지 않기"
            />
          </Pressable>
          <View style={styles.dividerStyle} />
          <Pressable onPress={hide} style={styles.buttonWrapperStyle}>
            <CustomText string="닫기" forDriveMe family={FONT_FAMILY.MEDIUM} color={colors.white} />
          </Pressable>
        </HStack>
      </View>
    </Modal>
  );
});

export default memo(EventPopup);

const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: widthScale1(335),
    aspectRatio: 1,
    borderRadius: scale1(12),
  },
  dividerStyle: {
    width: widthScale1(0.5),
    height: heightScale1(14),
    backgroundColor: colors.white,
  },
  footerStyle: {
    marginTop: heightScale1(10),
    minHeight: heightScale1(40),
  },
  buttonWrapperStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerStyle: {
    marginBottom: heightScale1(10),
    gap: widthScale1(7),
    justifyContent: 'flex-end',
  },
});
