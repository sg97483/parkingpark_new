import React, {useRef, useState, useEffect} from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  Animated,
  Image,
  Easing,
  Modal,
  ActivityIndicator,
  Dimensions,
  Platform,
  Linking,
} from 'react-native';
import axios from 'axios';
import dayjs from 'dayjs';
import WebView from 'react-native-webview';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import {strings} from '~constants/strings';
import Divider from '~components/divider';
import {IMAGES} from '~/assets/images-path';
// 리덕스 훅
import {useNavigation} from '@react-navigation/native'; // 추가
import {userHook} from '~hooks/userHook';
import {showMessage} from 'react-native-flash-message'; // 👈 [추가]
import {ROUTE_KEY} from '~navigators/router'; // 👈 [추가]

import {request, PERMISSIONS, RESULTS} from 'react-native-permissions'; // permissions 라이브러리 추가

//import DeviceInfo from 'react-native-device-info';
import AdvertisingId from '@sparkfabrik/react-native-idfa-aaid';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REWARD_OFFSET = -30;
const screenWidth = Dimensions.get('window').width;
const REWARD_TIMES = ['00:00', '12:00', '18:00'];

const rewards = [
  {label: '100원', centerAngle: 270 + REWARD_OFFSET, x: 70, y: 205, probability: 0.2},
  {label: '30원', centerAngle: 330 + REWARD_OFFSET, x: 75, y: 125, probability: 1.0},
  {label: '20원', centerAngle: 210 + REWARD_OFFSET, x: 155, y: 255, probability: 3.0},
  {label: '10원', centerAngle: 150 + REWARD_OFFSET, x: 235, y: 210, probability: 10.0},
  {label: '5원', centerAngle: 30 + REWARD_OFFSET, x: 155, y: 80, probability: 30.0},
  {label: '1원', centerAngle: 90 + REWARD_OFFSET, x: 235, y: 125, probability: 55.8},
];

const EventGame = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [rewardText, setRewardText] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [usedTimes, setUsedTimes] = useState<string[]>([]); // ✅ 수정됨
  const [canPlay, setCanPlay] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [selectedReward, setSelectedReward] = useState<{label: string} | null>(null); // ✅ 수정됨

  const {userToken, user: userInfo} = userHook();

  const [adModalVisible, setAdModalVisible] = useState(false);
  const [pendingRoulette, setPendingRoulette] = useState(false);

  const todayStr = dayjs().format('YYYY-MM-DD');
  const STORAGE_KEY = `eventgame-used-times-${todayStr}`;

  // 1. 타입 먼저 선언
  type AdProduct = {
    productName: string;
    productPrice: number;
    productImage: string;
    landingUrl: string;
    isRocket: boolean;
    productId: number;
    impressionUrl: string;
  };

  // 2. useState에 타입 명시
  const [adProduct, setAdProduct] = useState<AdProduct | null>(null);
  const [adLoading, setAdLoading] = useState(false);

  const [showAdConfirmBtn, setShowAdConfirmBtn] = useState(true);

  const fetchAdProduct = async () => {
    setAdLoading(true);
    try {
      let adid: string | null = '';

      // iOS 14+인 경우, 앱 추적 투명성(ATT) 권한 요청
      if (Platform.OS === 'ios') {
        const result = await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
        if (result === RESULTS.GRANTED) {
          // 권한이 허용된 경우에만 광고 ID 수집
          const advertisingInfo = await AdvertisingId.getAdvertisingInfo();
          console.log(advertisingInfo.id); // 광고ID 출력
          adid = advertisingInfo.id; // id 속성에 직접 접근
        } else {
          console.log('iOS App Tracking Transparency permission denied');
          // 권한 거부 시 예외 처리 (예: 광고 없이 진행)
        }
      } else {
        // Android에서 광고 ID 수집
        const advertisingInfo = await AdvertisingId.getAdvertisingInfo();
        console.log(advertisingInfo.id); // 광고ID 출력
        adid = advertisingInfo.id; // id 속성에 직접 접근
      }

      // 광고 ID가 성공적으로 수집된 경우에만 API 호출
      if (adid) {
        const url = `https://ad.planbplus.co.kr/adReco/?adid=3069&subid=wiseparking01&di=${adid}&size=300x250`;
        console.log('Requesting Ad URL:', url); // URL 로그 확인

        const res = await axios.get(url);

        if (res.data?.Code === '0' && res.data.data && res.data.data.length > 0) {
          setAdProduct(res.data.data[0]);
          console.log('adProduct:', res.data.data[0]); // ✅ 여기!
          console.log('adProduct.productImage:', res.data.data[0].productImage); // 👉 그리고 이 줄 추가!
          // 상품 노출 트래킹(impressionUrl)
          if (res.data.data[0].impressionUrl) {
            fetch(res.data.data[0].impressionUrl);
          }
        } else {
          setAdProduct(null);
        }
      } else {
        setAdProduct(null);
        console.log('광고 ID를 가져올 수 없습니다.');
      }
    } catch (e) {
      setAdProduct(null);
      console.log('광고 상품 로딩 에러:', e);
    }
    setAdLoading(false);
  };

  // 1. 불러오기
  useEffect(() => {
    // 진입시 userInfo?.id 로그
    console.log('🟢 EventGame 페이지 진입 userInfo?.id:', userInfo?.id);

    const loadUsedTimes = async () => {
      try {
        if (userInfo?.id === 773) {
          // 773이면 무조건 초기화
          console.log('⚠️ 773 계정이므로 usedTimes 초기화!');
          setUsedTimes([]);
          await AsyncStorage.removeItem(STORAGE_KEY); // 저장값도 삭제(선택사항)
        } else {
          // 그 외에는 기존대로 로드
          const saved = await AsyncStorage.getItem(STORAGE_KEY);
          if (saved) {
            setUsedTimes(JSON.parse(saved));
          } else {
            setUsedTimes([]);
          }
        }
      } catch (e) {
        console.log('usedTimes 불러오기 에러:', e);
      }
    };
    loadUsedTimes();
  }, [userInfo?.id]);

  // 2. 값이 바뀔 때 저장
  useEffect(() => {
    const saveUsedTimes = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(usedTimes));
      } catch (e) {
        console.log('usedTimes 저장 에러:', e);
      }
    };
    saveUsedTimes();
  }, [usedTimes]);

  useEffect(() => {
    fetchAdProduct();
  }, []);

  useEffect(() => {
    if (adModalVisible) {
      setShowAdConfirmBtn(false); // 모달이 열릴 때 항상 버튼 숨김
    }
  }, [adModalVisible]);

  const getRandomReward = () => {
    const rand = Math.random() * 100;
    let acc = 0;
    for (const reward of rewards) {
      acc += reward.probability;
      if (rand <= acc) {
        return reward;
      }
    }
    return rewards[rewards.length - 1];
  };

  function getNextTimeMessage() {
    const now = dayjs();
    const todayStr = now.format('YYYY-MM-DD');
    const availableTimes = REWARD_TIMES.filter(time => {
      const timeMoment = dayjs(`${todayStr} ${time}`);
      return now.isBefore(timeMoment) && !usedTimes.includes(time);
    });
    if (availableTimes.length > 0) {
      return `다음 참여 기회는 오늘 ${availableTimes[0]}부터 가능합니다.`;
    }
    // 오늘 남은 타임 없음
    return `오늘의 참여가 모두 완료되었습니다.\n내일 ${REWARD_TIMES[0]}부터 다시 도전하세요!`;
  }

  const handleRoulette = async () => {
    if (usedTimes.length === 0) {
      playRoulette();
    } else {
      setAdLoading(true);
      await fetchAdProduct(); // 이제 정상 동작!
      setAdLoading(false);
      setAdModalVisible(true);
      setPendingRoulette(true);
    }
  };

  // 광고 모달에서 "상품 누르고 다녀오기" 누르면
  const handleAdConfirm = () => {
    setAdModalVisible(false);
    if (pendingRoulette) {
      setPendingRoulette(false);
      // 실제 룰렛 진행
      playRoulette();
    }
  };

  const checkPlayAvailability = () => {
    const now = dayjs();
    const todayStr = now.format('YYYY-MM-DD');
    const available = REWARD_TIMES.some(time => {
      const timeMoment = dayjs(`${todayStr} ${time}`);
      return now.isAfter(timeMoment) && !usedTimes.includes(time);
    });
    setCanPlay(available);
  };

  const getAvailableCount = () => {
    const now = dayjs();
    const todayStr = now.format('YYYY-MM-DD');
    return REWARD_TIMES.filter(time => {
      const timeMoment = dayjs(`${todayStr} ${time}`);
      return now.isAfter(timeMoment) && !usedTimes.includes(time);
    }).length;
  };

  useEffect(() => {
    checkPlayAvailability();
    const interval = setInterval(() => {
      checkPlayAvailability();
    }, 10000); // 매 10초마다 검사
    return () => clearInterval(interval);
  }, [usedTimes]);

  const navigation = useNavigation(); // 추가

  const playRoulette = () => {
    if (!userToken?.id || !userToken?.password) {
      navigation.navigate(ROUTE_KEY.Login as never); // as never 타입 단언이 필요할 수 있습니다.
      showMessage({
        message: '로그인이 필요한 서비스입니다.', // strings.general_text.login_first 와 동일한 역할
      });
      return;
    }

    const now = dayjs();
    const todayStr = now.format('YYYY-MM-DD');
    const currentSlot = REWARD_TIMES.find(time => {
      const timeMoment = dayjs(`${todayStr} ${time}`);
      return now.isAfter(timeMoment) && !usedTimes.includes(time);
    });

    if (!currentSlot) {
      return;
    }

    const selectedReward = getRandomReward();
    const fullSpins = 5;
    const toValue = 360 * fullSpins + (360 - selectedReward.centerAngle);

    Animated.timing(rotateAnim, {
      toValue,
      duration: 4000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setRewardText(`당첨: ${selectedReward.label}`);
      setSelectedReward(selectedReward); // ✅ 여기 추가
      setModalVisible(true);
      rotateAnim.setValue(toValue % 360);
      setUsedTimes(prev => [...prev, currentSlot]);
    });
  };

  const closeModal = () => setModalVisible(false);

  // 광고 모달 부분(광고 영역, 상품명, 가격, 버튼)
  <Modal
    visible={adModalVisible}
    transparent
    animationType="fade"
    onRequestClose={() => setAdModalVisible(false)}>
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
      }}>
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 24,
          alignItems: 'center',
          width: '85%',
        }}>
        <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 12}}>
          쿠팡 5초동안 다녀오고{'\n'}룰렛 1회권 받기
        </Text>
        <Text style={{fontSize: 16, marginBottom: 8, color: '#18a150'}}>
          👇 상품 누르고 다녀오기 👇
        </Text>

        <View style={{alignItems: 'center', marginBottom: 16}}>
          {adLoading ? (
            <ActivityIndicator size="large" />
          ) : adProduct ? (
            <>
              {/* === 광고 이미지 === */}
              <Image
                source={
                  adProduct.productImage
                    ? {uri: adProduct.productImage}
                    : require('~/assets/icons/icon_app.png') // 실제 기본이미지 경로로!
                }
                style={{
                  width: 180,
                  height: 100,
                  borderRadius: 12,
                  marginBottom: 8,
                  backgroundColor: '#eee',
                }}
                resizeMode="cover"
                onError={e => {
                  console.log('광고 이미지 로드 에러:', e.nativeEvent);
                }}
              />
              {/* 이미지 URL도 같이 보여주기 (테스트용) */}
              <Text style={{fontSize: 11, color: '#888', marginBottom: 8, maxWidth: 180}}>
                {adProduct.productImage}
              </Text>
              <Text style={{fontSize: 14, fontWeight: 'bold', textAlign: 'center'}}>
                {adProduct.productName}
              </Text>
              <Text style={{fontSize: 14, color: '#18a150', textAlign: 'center'}}>
                {Number(adProduct.productPrice).toLocaleString()}원 {adProduct.isRocket ? '🚀' : ''}
              </Text>
            </>
          ) : (
            <Text style={{color: '#888'}}>광고 상품 정보를 불러오지 못했습니다.</Text>
          )}
        </View>

        <Text style={{fontSize: 12, color: '#888', marginBottom: 18, textAlign: 'center'}}>
          해당 광고영역은 쿠팡파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
        </Text>
        <Pressable
          onPress={handleAdConfirm}
          style={{
            backgroundColor: '#19b950',
            padding: 12,
            borderRadius: 8,
            minWidth: 120,
            alignItems: 'center',
          }}>
          <Text style={{color: '#fff', fontSize: 16}}>쿠팡 다녀와서 룰렛 1회권 받기</Text>
        </Pressable>
      </View>
    </View>
  </Modal>;

  return (
    <FixedContainer>
      <CustomHeader text={strings.drawer.event_game} />
      <View style={styles.contentWrapper}>
        {/* 남은 횟수 안내 */}
        <Text
          style={{
            fontSize: 18,
            color: '#4CAF50',
            fontWeight: 'bold',
            marginBottom: 5,
            textAlign: 'center',
          }}>
          오늘의 룰렛 가능 시간: {REWARD_TIMES.map(t => t.slice(0, 2) + '시').join(', ')}
        </Text>

        <Text
          style={{
            fontSize: 11,
            color: '#888',
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'center',
          }}>
          (예: 오늘 하루 미참여 시 현시간이 19시라면 바로 3회 연속 가능)
        </Text>

        <View style={styles.rouletteContainer}>
          <Animated.View
            style={{
              width: 330,
              height: 330,
              justifyContent: 'center',
              alignItems: 'center',
              transform: [
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            }}>
            <Image source={IMAGES.roulet_bg} style={styles.rouletteImage} />
            {rewards.map((reward, index) => (
              <View
                key={index}
                style={[styles.rewardWrapper, {left: reward.x - 20, top: reward.y - 12}]}>
                <Text style={styles.rewardLabel}>{reward.label}</Text>
              </View>
            ))}
          </Animated.View>
          <Image source={IMAGES.roulet_arrow} style={styles.arrow} />
        </View>

        {/* 🔽 안내 문구: canPlay가 false일 때만 표시 */}
        {!canPlay && (
          <Text
            style={{
              color: '#666',
              fontSize: 14,
              marginBottom: 10,
              textAlign: 'center',
              paddingHorizontal: 20,
            }}>
            당첨된 적립금은 바로 사용가능하며 실시간 확인이 되지않을시 앱 재시작 후 확인 가능합니다.
          </Text>
        )}

        {/* 안내 문구 삽입 */}
        <Text
          style={{
            fontSize: 15,
            color: '#333',
            marginBottom: 8,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          하루 최대 3번 룰렛을 돌릴 수 있습니다.
        </Text>

        <Pressable
          onPress={handleRoulette}
          disabled={!canPlay}
          style={[styles.button, {width: screenWidth - 60}, !canPlay && styles.buttonDisabled]}>
          <Text style={styles.buttonText}>
            {canPlay
              ? usedTimes.length === 0
                ? '룰렛 돌리고 적립금 받기'
                : '쿠팡 다녀와서 룰렛 돌리기'
              : getNextTimeMessage()}
          </Text>
        </Pressable>

        <Divider style={styles.divider} />

        {/* 광고 모달 */}
        <Modal
          visible={adModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setAdModalVisible(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 24,
                alignItems: 'center',
                width: '85%',
              }}>
              <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 12}}>
                쿠팡 5초동안 다녀오고{'\n'}룰렛 1회권 받기
              </Text>
              <Text style={{fontSize: 16, marginBottom: 8, color: '#18a150'}}>
                👇 상품 누르고 다녀오기 👇
              </Text>

              <Text style={{fontSize: 12, color: '#888', marginBottom: 18, textAlign: 'center'}}>
                해당 광고영역은 쿠팡파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를
                제공받습니다.
              </Text>

              <View style={{marginTop: 5, alignItems: 'center', marginBottom: 15}}>
                <Pressable
                  onPress={() => {
                    if (adProduct && adProduct.landingUrl) {
                      // 광고 landingUrl로 이동 (쿠팡 상품)
                      setShowAdConfirmBtn(false); // 버튼 숨김
                      Linking.openURL(adProduct.landingUrl);

                      setTimeout(() => setShowAdConfirmBtn(true), 5000);
                    }
                  }}
                  style={{alignItems: 'center'}}>
                  <Image
                    source={
                      adProduct && adProduct.productImage
                        ? {uri: adProduct.productImage}
                        : require('~/assets/icons/icon_app.png') // 실제 경로 주의
                    }
                    style={{
                      width: 200,
                      height: 200,
                      borderRadius: 12,
                      marginBottom: 8,
                      backgroundColor: '#eee',
                      borderWidth: 2, // 두께 (예: 2)
                      borderColor: '#19b950', // 색상 (예: 녹색)
                    }}
                    resizeMode="cover"
                    onError={e => {
                      console.log('광고 이미지 로드 에러:', e.nativeEvent);
                    }}
                  />
                </Pressable>
              </View>

              {showAdConfirmBtn && (
                <Pressable
                  onPress={handleAdConfirm}
                  style={{
                    backgroundColor: '#19b950',
                    padding: 12,
                    borderRadius: 8,
                    minWidth: 120,
                    alignItems: 'center',
                    marginTop: 8, // 위에 약간 간격 주고 싶으면 추가
                  }}>
                  <Text style={{color: '#fff', fontSize: 16}}>룰렛돌리고 적립금받기</Text>
                </Pressable>
              )}
            </View>
          </View>
        </Modal>

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>🎉 축하합니다!</Text>
              <Text style={styles.modalRewardText}>{rewardText}</Text>
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  setShowWebView(true);
                }}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>확인</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {showWebView && selectedReward?.label && (
          <View style={{width: 0, height: 0}}>
            {(() => {
              const point = selectedReward.label.replace('원', '');
              const url = `http://cafe.wisemobile.kr/imobile/pay_lite/rulletPointInsert.php?mmid=${userInfo?.id}&point=${point}`;
              console.log('✅ WebView URI:', url); // 🔍 로그 출력
              return (
                <WebView
                  source={{uri: url}}
                  onLoadEnd={() => setShowWebView(false)}
                  style={{width: 0, height: 0}}
                />
              );
            })()}
          </View>
        )}
      </View>
    </FixedContainer>
  );
};

export default EventGame;

const styles = StyleSheet.create({
  contentWrapper: {flex: 1, alignItems: 'center', paddingTop: 20},
  rouletteContainer: {
    width: 400,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  rouletteImage: {width: 400, height: 400, position: 'absolute'},
  rewardWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 24,
  },
  rewardLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  arrow: {
    width: 60,
    height: 60,
    position: 'absolute',
    top: 20,
    zIndex: 10,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    marginTop: 20,
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#9E9E9E',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  divider: {marginVertical: 30},
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {fontSize: 22, fontWeight: 'bold', marginBottom: 10},
  modalRewardText: {fontSize: 20, color: '#f44336', marginBottom: 20},
  modalButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  modalButtonText: {color: '#fff', fontSize: 16},

  pointSummaryWrapper: {
    marginTop: 16,
    marginBottom: 8,
    alignItems: 'center',
  },

  pointLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },

  pointValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});
