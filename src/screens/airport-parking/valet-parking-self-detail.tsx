import {Image, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo, useRef, useState} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import HStack from '~components/h-stack';
import CustomText from '~components/custom-text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import {PADDING} from '~constants/constant';
import {FONT, FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import {ROUTE_KEY} from '~navigators/router';
import {useAppSelector} from '~store/storeHooks';
import {showMessage} from 'react-native-flash-message';
import {strings} from '~constants/strings';
import {useParkingDetailsQuery} from '~services/parkingServices';
import UsageHistoryMenuText from '~components/usage-history.tsx/usage-history-menu-text';
import ViewParkingLocationModal, {
  ViewParkingLocationModalRefs,
} from '~components/monthly-parking-direct/view-parking-location-modal';

const ValetParkingSelfDetail = memo((props: RootStackScreenProps<'ValetParkingSelfDetail'>) => {
  const {navigation, route} = props;
  const parkingID = route?.params?.parkingID;
  const title = route?.params?.title;

  const viewParkingLocationRef = useRef<ViewParkingLocationModalRefs>(null);

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

  const handleGoToQuestion = () => {
    // if (!userToken?.id || !userToken?.password) {
    //   navigation.navigate(ROUTE_KEY.Login);
    //   showMessage({
    //     message: strings?.general_text?.login_first,
    //   });
    //   return;
    // }
    if (data?.id) {
      navigation.navigate(ROUTE_KEY.ValetQnaBbsList, {
        parkingID: data?.id,
      });
    }
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

  {
    /*const handleSubmit = () => {
      if (!userToken?.id || !userToken?.password) {
        navigation.navigate(ROUTE_KEY.Login);
        showMessage({
          message: strings?.general_text?.login_first,
        });
        return;
      }

      if (data) {
        navigation.navigate(ROUTE_KEY.ValetParkingSelfReservation1, {
          parkingLot: data,
        });
      }
    };*/
  }

  const handleSubmit = () => {
    showMessage({
      message:
        '해당 주차장 연박불가로 이용불가합니다. \n당일이용만 가능하며 메인화면 주차장검색후 이용가능',
      type: 'warning',
    });
  };

  const getSelfIntro = () => {
    switch (parkingID) {
      case 70004:
        return '* 공항철도 운서역 바로 앞 2분 거리, 실내주차장 입니다.\n- 주차 후 공항철도를 타고, 제 1여객 터미널(2정거장 이동, 8분, 900원) 및 제 2여객 터미널(3정거장 이동, 14분, 1500원)로 이동이 가능합니다.\n- 운서역 기준 공항행 첫차 시간은 오전 5시41분, 서울행 막차는 0시4분(디지털미디어시티행) 입니다.';
      case 70005:
        return "* 인천국제공항 제1여객 터미널까지, 파라다이스 시티역 자기부상열차로 가실 수 있습니다.\n파라다이스 시티역까지는 도보 3분! 순환버스도 이용가능하지만,\n공항순환 셔틀버스를 무료로 이용하실 수 있습니다.\n인천공항 제1여객 터미널 3층 8번, '제2여객 터미널 4~5번 출구 앞에서 7~10분 간격으로 운행되고 있습니다.\n1 터미널 ( 4:57 - 23:51 ) ,2 터미널 ( 4:34 - 23:28 )\n두 번째 공항 청사 정거장에서 하차하신 후 미니스톱 건물 뒤쪽으로 도보 2분 거리입니다.";
      case 70006:
        return "* 주차 후 '5호선 마곡역' 5분거리! 전철타고 김포공항역까지 1정거장\n- 택시앱을 이용해서, 택시타고 공항으로 편리하게 이동하세요~\n: 국제선 2.3km (3,300원 / 8분 거리)\n: 국내선 3.1km (4,000원 / 10분 거리)\n- 김포공항 이용시 저렴하게 주차~ 연박 최장 20일까지 가능 ^^";
      case 70007:
        return "* 주차 후 '5호선 마곡역' 5분거리! 전철타고 김포공항역까지 1정거장\n- 택시앱을 이용해서, 택시타고 공항으로 편리하게 이동하세요~\n: 국제선 2.3km (3,300원 / 8분 거리)\n: 국내선 3.1km (4,000원 / 10분 거리)\n- 김포공항 이용시 저렴하게 주차~ 연박 최장 20일까지 가능 ^^";
      case 70008:
        return '등록된 차량번호로 자동 입출차가 가능합니다.\n결제전 차량번호를 다시 한번 확인부탁드리며,\n출차가 안될 시 차단기 옆에있는 인터폰으로 파킹박앱 결제내역을 말씀하시면 출차가 가능합니다.';
      case 70009:
        return '등록된 차량번호로 자동 입출차가 가능합니다.\n결제전 차량번호를 다시 한번 확인부탁드리며,\n출차가 안될 시 차단기 옆에있는 인터폰으로 파킹박앱 결제내역을 말씀하시면 출차가 가능합니다.';
      case 70010:
        return '* 인천공항 이용객 꿀팁 : 해당 주차장 주차후 지하철(9호선,공항철도) 이용시 고속도로 톨게이트비 13,200원을 절약 할수있습니다.\n출차시 차단기가 열리지 않으면 차단기 옆에 정산기의 호출버튼을 누르신 후 파킹박에서 결제했다고 말씀하시면 출차가 가능합니다';
      case 70011:
        return '[날짜별 구매시 연박가능] 출차시 현장근무자분께 파킹박에서 결제했다고 말씀하시고 출차하시면 됩니다.\n\n1. 공항중학교 정문에서 버스 승차가능(5분이내),  출국장 바로앞 하차\n2.공항중학교 앞 5호선 송정역에서 김포공항까지 1정거장\n3. 택시탑승시 공항까지 약 5분';
      default:
        return '* 주차장 보험 가입\n*시설 허가증\n* 사업자 등록증';
    }
  };

  const getOnedayTicketCost = () => {
    let strType = '';
    if (parkingID == 70002) {
      strType = '실외';
    } else {
      strType = '실내';
    }
    return (strType += ' (1일  / ' + data?.chargeOneDay + '원)');
  };

  return (
    <FixedContainer>
      <CustomHeader
        text={title ? title : '발렛파킹 주차장 예약'}
        rightContent={
          <>
            {userToken?.adminYN === IS_ACTIVE.YES ? (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(ROUTE_KEY.ValetPaymentHistoryAdmin, {
                    parkId: parkingID,
                  })
                }>
                <CustomText
                  string={'관리자\n모드'}
                  size={FONT.CAPTION_2}
                  textStyle={{
                    textAlign: 'center',
                  }}
                  family={FONT_FAMILY.SEMI_BOLD}
                />
              </TouchableOpacity>
            ) : null}
          </>
        }
      />

      <View style={styles.container}>
        {data ? (
          <ScrollView>
            <UsageHistoryMenuText
              title="주차장명"
              content={
                <View style={{width: '100%', paddingHorizontal: PADDING / 1.5}}>
                  <CustomText
                    string={data?.garageName || ''}
                    color={colors.blue}
                    size={FONT.CAPTION}
                  />
                </View>
              }
            />
            <UsageHistoryMenuText
              title="주소"
              content={
                <View
                  style={{
                    width: '100%',
                    paddingHorizontal: PADDING / 1.5,
                  }}>
                  <HStack>
                    <View style={{flex: 1}}>
                      <CustomText string={data?.addressNew} size={FONT.CAPTION} />
                    </View>
                    <TouchableOpacity
                      onPress={() => viewParkingLocationRef?.current?.show(data?.addressNew)}>
                      <CustomText
                        string="위치보기"
                        size={FONT.CAPTION}
                        color={colors.blue}
                        textStyle={{
                          textDecorationLine: 'underline',
                        }}
                      />
                    </TouchableOpacity>
                  </HStack>
                </View>
              }
            />
            {parkingID === 70001 || parkingID === 70002 || parkingID === 70003 ? null : (
              <UsageHistoryMenuText
                title="인허가사항"
                content={
                  <View
                    style={{
                      width: '100%',
                      paddingVertical: PADDING / 3,
                      paddingHorizontal: PADDING / 1.5,
                    }}>
                    <CustomText string={getSelfIntro()} size={FONT.CAPTION} />
                  </View>
                }
                isLastIndex
              />
            )}

            <UsageHistoryMenuText
              title={'전화번호\n(파킹박)'}
              content={
                <View
                  style={{
                    width: '100%',
                    paddingVertical: PADDING / 3,
                    paddingHorizontal: PADDING / 1.5,
                  }}>
                  <CustomText string={'010-5949-0981'} size={FONT.CAPTION} />
                </View>
              }
            />
            <UsageHistoryMenuText
              title={parkingID === 70003 ? '가격 및\n이용안내' : '금액'}
              content={
                <HStack
                  style={{
                    paddingVertical: PADDING / 3,
                    paddingHorizontal: PADDING / 1.5,
                  }}>
                  <View style={{flex: 1}}>
                    <CustomText string={getOnedayTicketCost()} size={FONT.CAPTION} />
                  </View>
                </HStack>
              }
              isLastIndex
            />
            {/* Images */}
            <View style={styles.imageViewWrapper}>
              {imageIndex === 1 && data?.image1 && (
                <Image
                  source={{
                    uri: data?.image1,
                  }}
                  style={styles.image}
                  resizeMode="contain"
                />
              )}
              {imageIndex === 2 && data?.image2 && (
                <Image
                  source={{
                    uri: data?.image2,
                  }}
                  style={styles.image}
                  resizeMode="contain"
                />
              )}
              {imageIndex === 3 && data?.image3 && (
                <Image
                  source={{
                    uri: data?.image3,
                  }}
                  style={styles.image}
                  resizeMode="contain"
                />
              )}
              {imageIndex === 4 && data?.image4 && (
                <Image
                  source={{
                    uri: data?.image4,
                  }}
                  style={styles.image}
                  resizeMode="contain"
                />
              )}
              {imageIndex === 5 && data?.image5 && (
                <Image
                  source={{
                    uri: data?.image5,
                  }}
                  style={styles.image}
                  resizeMode="contain"
                />
              )}
              <TouchableOpacity onPress={handlePreviousImage} style={styles.leftIcon}>
                <Icon name="chevron-left" size={widthScale(40)} color={colors.darkGray} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNextImage} style={styles.rightIcon}>
                <Icon name="chevron-right" size={widthScale(40)} color={colors.darkGray} />
              </TouchableOpacity>
            </View>
            <CustomText
              string={`${imageIndex}/5`}
              textStyle={{
                textAlign: 'center',
                paddingTop: PADDING / 2,
              }}
            />
          </ScrollView>
        ) : null}

        {/* Submit */}
        {data ? (
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <CustomText string="예약하기" color={colors.white} />
          </TouchableOpacity>
        ) : null}

        {/* Bottom Menu */}
        <HStack style={styles.bottomMenuWrapper}>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTE_KEY.ValetMainNotice)}
            style={styles.button}>
            <Icon
              name="volume-high"
              size={widthScale(30)}
              color={colors.heavyGray}
              style={styles.icon}
            />
            <CustomText
              string="공지사항"
              size={FONT.CAPTION}
              family={FONT_FAMILY.SEMI_BOLD}
              color={colors.heavyGray}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGoToQuestion} style={styles.button}>
            <Icon
              name="message-question-outline"
              size={widthScale(30)}
              color={colors.heavyGray}
              style={styles.icon}
            />
            <CustomText
              string="문의게시판"
              size={FONT.CAPTION}
              family={FONT_FAMILY.SEMI_BOLD}
              color={colors.heavyGray}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGoToUsageHistory} style={styles.button}>
            <Icon
              name="clipboard-check-outline"
              size={widthScale(30)}
              color={colors.heavyGray}
              style={styles.icon}
            />
            <CustomText
              string="예약확인"
              size={FONT.CAPTION}
              family={FONT_FAMILY.SEMI_BOLD}
              color={colors.heavyGray}
            />
          </TouchableOpacity>
        </HStack>
      </View>

      {/* Quick view location */}
      <ViewParkingLocationModal ref={viewParkingLocationRef} />
    </FixedContainer>
  );
});

export default ValetParkingSelfDetail;

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
});
