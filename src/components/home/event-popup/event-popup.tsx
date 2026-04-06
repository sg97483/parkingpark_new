import moment from 'moment';
import React, {forwardRef, memo, useImperativeHandle, useMemo, useState} from 'react';
import {DeviceEventEmitter, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {EMIT_EVENT, FONT_FAMILY} from '~constants/enum';
import {NoticeEventProps, ParkingMapProps} from '~constants/types';
import {cacheEventNoticeToday} from '~reducers/eventNoticeReducer';
import {useAppDispatch} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import Indicator from './indicator';
import {getRealm} from '~services/realm';

export interface EventPopupRefs {
  show: (data: NoticeEventProps) => void;
  hide: () => void;
}

interface Props {
  onLocationPress?: (lat: number, lng: number) => void;
}

const EventPopup = forwardRef((props: Props, ref) => {
  const {onLocationPress} = props;
  const dispatch = useAppDispatch();

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [data, setData] = useState<NoticeEventProps | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const text = data?.text?.replace(/\r\n/g, '').split('///');
  const images = useMemo(() => {
    if (text) {
      return [text[5], text[7], text[9]].filter(img => img && img.trim().length > 0);
    } else {
      return [];
    }
  }, [text]);

  const coordinates = useMemo(() => {
    if (text) {
      // 인덱스 10, 11, 12에 있는 좌표 문자열 또는 주차장 ID 추출
      return [text[10], text[11], text[12]].map(coordStr => {
        if (!coordStr || coordStr.trim().length === 0) {
          return null;
        }
        
        const trimmed = coordStr.trim();
        
        // "숫자,숫자" 형식이면 좌표로 판단
        if (trimmed.includes(',')) {
          const [lat, lng] = trimmed.split(',').map(Number);
          if (!isNaN(lat) && !isNaN(lng)) {
            return {type: 'coord', lat, lng};
          }
        }
        
        // 숫자만 있으면 주차장 ID로 판단
        const parkId = Number(trimmed);
        if (!isNaN(parkId) && parkId > 0) {
          return {type: 'parkId', id: parkId};
        }
        
        return null;
      });
    }
    return [];
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
    setIsMinimized(false);
  };

  const hide = () => {
    setIsVisible(false);
    setIsMinimized(false);
    setData(null);
    setCurrentIndex(0);
  };

  const minimize = () => {
    setIsVisible(false);
    setIsMinimized(true);
  };

  const maximize = () => {
    setIsVisible(true);
    setIsMinimized(false);
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

  const handleImagePress = async (index: number) => {
    const targetData = coordinates[index];
    if (!targetData) {
      return;
    }

    // 좌표인 경우: 단순 지도 이동만 (상세 정보 없음)
    if (targetData.type === 'coord' && onLocationPress) {
      onLocationPress(targetData.lat, targetData.lng);
      minimize(); // 팝업을 닫지 않고 축소
      return;
    }

    // 주차장 ID인 경우: Realm에서 조회 후 마커 클릭한 것처럼 상세 정보 표시
    if (targetData.type === 'parkId') {
      try {
        const realm = await getRealm();
        const parking = realm
          .objects<ParkingMapProps>('Parking')
          .filtered(`id == ${targetData.id} AND (creditCardYN != 'A' OR creditCardYN == null)`)[0];

        if (parking && parking.lat && parking.lng) {
          // ✅ PING_ON_MAP 이벤트를 발생시켜 마커를 클릭한 것과 동일한 효과 (하단 상세 정보 표시)
          DeviceEventEmitter.emit(EMIT_EVENT.PING_ON_MAP, parking);
          minimize(); // 팝업을 닫지 않고 축소
        } else {
          console.log(`[EventPopup] 주차장 ID ${targetData.id}를 찾을 수 없거나 creditCardYN='A'입니다.`);
        }
      } catch (error) {
        console.error('[EventPopup] Realm 조회 중 오류:', error);
      }
    }
  };

  return (
    <>
      {/* 축소된 상태: 우측에 작은 팝업 미리보기 */}
      {isMinimized && images[currentIndex] && (
        <Pressable onPress={maximize} style={styles.minimizedButton}>
          <FastImage
            source={{uri: images[currentIndex]}}
            style={styles.minimizedImage}
            resizeMode="cover"
          />
          <View style={styles.minimizedBadge}>
            <CustomText
              string={`${currentIndex + 1}/${images.length}`}
              style={{fontSize: 10, color: colors.white}}
            />
          </View>
        </Pressable>
      )}

      {/* 확대된 상태: 전체 팝업 */}
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
                  <Pressable key={index.toString()} onPress={() => handleImagePress(index)}>
                    <FastImage
                      source={{
                        uri: imageURL,
                      }}
                      style={styles.imageStyle}
                      resizeMode="cover"
                    />
                  </Pressable>
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
    </>
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
  minimizedButton: {
    position: 'absolute',
    top: heightScale1(120),
    right: widthScale1(16),
    width: widthScale1(80),
    height: widthScale1(80),
    borderRadius: scale1(12),
    backgroundColor: colors.white,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 999,
  },
  minimizedImage: {
    width: '100%',
    height: '100%',
  },
  minimizedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: widthScale1(6),
    paddingVertical: heightScale1(2),
    borderTopLeftRadius: scale1(6),
  },
});
