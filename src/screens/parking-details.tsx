import BottomSheet from '@gorhom/bottom-sheet';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  DeviceEventEmitter,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {NaverMapView, NaverMapMarkerOverlay} from '@mj-studio/react-native-naver-map';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IMAGES} from '~/assets/images-path';
import {Icons} from '~/assets/svgs';
import NavigationSelectionModal, {
  NavigationSelectionModalRefs,
} from '~components/commons/navigation-selection';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import LimitPopup, {LimitPopupRefs} from '~components/parking-details/limit-popup';
import ParkingEval from '~components/parking-details/parking-eval';
import ParkingInfoTab from '~components/parking-details/parking-info-tab';
import ParkingShareModal, {
  ParkingShareModalRefs,
} from '~components/parking-details/parking-share-modal';
import ParkingStreetView, {
  ParkingStreetViewRefs,
} from '~components/parking-details/parking-streetview-modal';
import ParkingVideo, {ParkingVideoRefs} from '~components/parking-details/parking-video-modal';
import QuickAction from '~components/parking-details/quick-actions';
import SpecialInfoModal, {
  SpecialInfoModalRefs,
} from '~components/parking-details/special-info-modal';
import CurationPopup, {CurationPopupRefs} from '~components/reservation/curation-popup';
import {PADDING, PADDING_HEIGHT} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import {strings} from '~constants/strings';
import {ParkingEvalProps, ParkingProps} from '~constants/types';
import {useCheckRoute} from '~hooks/carpoolHook';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetMyDriverRoadQuery, useGetMyRiderRoadQuery} from '~services/carpoolServices';
import {
  useAddFavoriteParkingMutation,
  useGetFavoriteParkingParkListQuery,
  useLazyGetParkingLimitQuery,
  useGetParkingCarPoolInfoQuery,
  useParkingDetailsQuery,
  useRemoveFavoriteParkingMutation,
  useRequestConnectedCarInfoQuery,
} from '~services/parkingServices';
import {useGetCreditCardListQuery} from '~services/paymentCardServices';
import {useCheckAuthDriverAndPassengerMutation} from '~services/userServices';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, heightScale1, widthScale, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {checkNotificationPermission} from '~utils/checkNotificationPermission';
import {handleCallHotLine} from '~utils/common';
import {getMarker} from '~utils/getMarker';

const ParkingDetails = memo((props: RootStackScreenProps<'ParkingDetails'>) => {
  const {navigation, route} = props;
  const parkingID = route?.params?.id;
  const handleGoBackDriverWayToWork = route?.params?.handleGoBackDriverWayToWork;

  const isFocus = useIsFocused();
  const dispatch = useAppDispatch();
  const {userToken, user: userInfo, userID, CMemberID} = userHook();
  const routes = navigation.getState().routes;
  const [getParkingLimit] = useLazyGetParkingLimitQuery();
  const {data: listFavoriteParking, refetch: refetchFavoriteParkingList} =
    useGetFavoriteParkingParkListQuery(
      {
        memberId: userID as number,
      },
      {
        skip: !userID,
      },
    );
  const {data: passengerDataRoad} = useGetMyRiderRoadQuery(
    {
      memberId: userID as number,
      id: CMemberID as number,
    },
    {
      skip: !userID || !CMemberID, // 👈 userID 또는 CMemberID가 없으면 요청을 건너뜁니다.
    },
  );

  const {data: driverDataRoad} = useGetMyDriverRoadQuery(
    {
      memberId: userID as number,
      id: CMemberID as number,
    },
    {
      skip: !userID || !CMemberID, // 👈 userID 또는 CMemberID가 없으면 요청을 건너뜁니다.
    },
  );
  const [addFavoriteParking] = useAddFavoriteParkingMutation();
  const [removeFavoriteParking] = useRemoveFavoriteParkingMutation();

  const isFavoriteParking = useMemo(
    () => listFavoriteParking?.find(item => item?.parkId === parkingID)?.favStatus === 'Y',
    [listFavoriteParking, parkingID],
  );

  const {data: getParkingCarPoolInfo, isLoading} = useGetParkingCarPoolInfoQuery({
    parkingLotId: parkingID,
  });

  const specialInfoRef = useRef<SpecialInfoModalRefs>(null);
  const parkingStreetViewRef = useRef<ParkingStreetViewRefs>(null);
  const parkingShareRef = useRef<ParkingShareModalRefs>(null);
  const parkingFindWayRef = useRef<NavigationSelectionModalRefs>(null);
  const parkingVideoRef = useRef<ParkingVideoRefs>(null);
  const limitPopupRef = useRef<LimitPopupRefs>(null);
  const curationRef = useRef<CurationPopupRefs>(null);

  let isConnectedHyundai: boolean = false;

  let isConnectedKia: boolean = false;

  let isConnectedGenesis: boolean = false;

  const {data: connectedCarInfo} = useRequestConnectedCarInfoQuery(
    {
      memberId: userToken?.id,
    },
    {
      skip: !userToken?.id,
    },
  );

  useEffect(() => {
    if (userInfo?.carCompany) {
      if (
        userInfo?.carCompany === '현대' ||
        userInfo?.carCompany === '기아' ||
        userInfo?.carCompany === '제네시스'
      ) {
        if (connectedCarInfo) {
          connectedCarInfo?.forEach(item => {
            if (item?.connectedCompany === userInfo?.carCompany) {
              if (userInfo?.carCompany === '현대') {
                isConnectedHyundai = true;
              }
              if (userInfo?.carCompany === '기아') {
                isConnectedKia = true;
              }
              if (userInfo?.carCompany === '제네시스') {
                isConnectedGenesis = true;
              }
            }
          });
        }
      }
    }
  }, [userInfo?.carCompany, connectedCarInfo]);

  const handleBack = () => {
    if (handleGoBackDriverWayToWork) {
      handleGoBackDriverWayToWork();
      return true;
    }

    if (
      routes.some(
        item =>
          item.name === ROUTE_KEY.DriverWayToWork4 ||
          item.name === ROUTE_KEY.CarPoolWayToWorkRegistration,
      )
    ) {
      navigation.replace(ROUTE_KEY.CarpoolCalendar);
      return true;
    } else {
      navigation.goBack();
      return true;
    }
  };

  useEffect(() => {
    const back = BackHandler.addEventListener('hardwareBackPress', handleBack);

    return () => back.remove();
  }, []);

  // Get parking limit notice
  const {data: dataCard, refetch} = useGetCreditCardListQuery({
    memberId: userToken?.id,
    memberPwd: userToken?.password,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  useEffect(() => {
    if (userToken?.id && userToken?.password) {
      getParkingLimit({
        parkingLotId: parkingID,
      })
        .unwrap()
        .then(res => {
          console.log('🚀 ~ file: parking-details.tsx:134 ~ .then ~ res', res);
          if (
            !res?.textField ||
            (!res?.large &&
              !res?.little &&
              !res?.medium &&
              !res?.semiMedium &&
              !res?.small &&
              !res?.sports &&
              !res?.suv &&
              !res.textField)
          ) {
            return;
          }
          limitPopupRef.current?.show(res);
        });
    }
  }, [userToken, parkingID]);

  const {data} = useParkingDetailsQuery(
    {id: parkingID},
    {
      skip: !parkingID,
    },
  );

  const markerStyleInfo = useMemo(() => {
    if (!data) {
      return null;
    }
    return getMarker(data.icon, data.charge || 0, data.onedayTicketCost || 0, data.category);
  }, [data]);

  const handleOpenSpecialInfo = () => {
    if (data) {
      const images: string[] = [
        data?.image1,
        data?.image2,
        data?.image3,
        data?.image4,
        data?.image5,
      ];
      const message = data?.issue_text;
      const blogURL =
        data?.themeParkingYN === 'N' || !data?.themeParkingYN
          ? 'https://blog.naver.com/parkingpark0413'
          : data?.themeParkingYN;

      specialInfoRef?.current?.show(images, message, blogURL);
    }
  };

  const handeReservation = () => {
    if (!userToken?.id || !userToken?.password) {
      navigation.navigate(ROUTE_KEY.Login);
      showMessage({
        message: strings?.general_text?.login_first,
      });
      return;
    }

    if (dataCard?.length === 0) {
      const function_ = () => {
        navigation.replace(ROUTE_KEY.Reservation, {
          parkingLot: data as ParkingProps,
        });
      };

      navigation.navigate(ROUTE_KEY.CardRegistration, {
        functionReservation: function_,
      });

      return;
    } else {
      if (data?.ticketPartnerYN === IS_ACTIVE.NO) {
        showMessage({
          message: '파킹박 제휴 주차장이 아닙니다.',
        });
        return;
      } else if (data?.ticketPartnerYN === IS_ACTIVE.YES || data?.category === '공유주차장') {
        if (data?.limitedNumber < 1) {
          curationRef?.current?.show(
            '현재 주차장 판매중지',
            '해당 주차장은 현재 주차장 사정으로 이용 불가하신 주차장입니다. 다른 주차장을 이용하시길 바랍니다.',
            data?.id,
          );
        } else {
          navigation.navigate(ROUTE_KEY.Reservation, {
            parkingLot: data as ParkingProps,
          });
        }
      } else {
        showMessage({
          message: '파킹박 제휴 주차장이 아닙니다.',
        });
      }
    }
  };

  const [dataEval, setDataEval] = useState<string | number>(0);

  const handleLogin = () => {
    //navigation.navigate(ROUTE_KEY.CarpoolRequestPark, { parkingID: parkingID });
    navigation.navigate(ROUTE_KEY.CarpoolTabDriver as any);
    //console.log('🚀 ~ file: parking-details.tsx:134 ~ .then ~ res', res);
    //navigation.navigate(ROUTE_KEY.CarpoolRequestPark, {parkingID, parkingData: data!});
    console.log('parkId toss', parkingID);
  };

  const [checkAuthDriverAndPassenger] = useCheckAuthDriverAndPassengerMutation();

  const isModeSelect = useMemo(() => {
    return (!passengerDataRoad?.startPlaceOut &&
      !passengerDataRoad?.startPlaceIn &&
      !passengerDataRoad?.endPlaceOut &&
      !passengerDataRoad?.endPlaceIn) ||
      (!driverDataRoad?.startPlaceIn &&
        !driverDataRoad?.startPlaceOut &&
        !driverDataRoad?.endPlaceIn &&
        !driverDataRoad?.endPlaceOut)
      ? true
      : false;
  }, [passengerDataRoad, driverDataRoad]);

  const haveRoadDriver = useMemo(() => {
    return driverDataRoad &&
      driverDataRoad?.startPlaceIn?.length > 0 &&
      driverDataRoad?.startPlaceOut?.length > 0 &&
      driverDataRoad?.endPlaceIn?.length > 0 &&
      driverDataRoad?.endPlaceOut?.length > 0
      ? true
      : false;
  }, [driverDataRoad]);

  const haveRoadPassenger = useMemo(() => {
    return (passengerDataRoad?.startPlaceIn?.length as number) > 0 &&
      (passengerDataRoad?.startPlaceOut?.length as number) > 0 &&
      (passengerDataRoad?.endPlaceIn?.length as number) > 0 &&
      (passengerDataRoad?.endPlaceOut?.length as number) > 0
      ? true
      : false;
  }, [passengerDataRoad]);

  const {carpoolMode, driverRoad, isAgreeTerms, isRegisterRoute, isRegisteredBusinessCard} =
    useCheckRoute();

  const isFirstTimeApproval = useAppSelector(state => state?.carpoolReducer?.isFirstTimeApproval);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleLogin2 = () => {
    if (!userToken?.id || !userToken?.password) {
      navigation.navigate(ROUTE_KEY.Login);
      showMessage({message: strings?.general_text?.login_first});
      return;
    }

    checkAuthDriverAndPassenger({
      id: CMemberID,
      memberId: userID,
    })
      .unwrap()
      .then(returnedAuthValue => {
        if (isModeSelect && !haveRoadDriver && !haveRoadPassenger) {
          navigation.navigate(ROUTE_KEY.CarpoolModeSelect);
          return;
        }

        if (!isAgreeTerms) {
          navigation.navigate(ROUTE_KEY.DiverAgreeActivity, {
            isPassenger: carpoolMode === 'PASSENGER',
          });
          return;
        }

        if (carpoolMode === 'PASSENGER') {
          if (!isRegisteredBusinessCard && !isRegisterRoute) {
            navigation.navigate(ROUTE_KEY.BusinessCardAndVaccineRegistration, {
              isDriver: false,
            });
            return;
          }

          if (returnedAuthValue?.authDriver === 'Y' && isFirstTimeApproval && !haveRoadPassenger) {
            navigation.navigate(ROUTE_KEY.DriverCompleteApproval);
            return;
          }

          if (returnedAuthValue?.authDriver === 'C' && haveRoadDriver && !haveRoadPassenger) {
            navigation.navigate(ROUTE_KEY.DriverWaitingApproved);
            return;
          }
          if (returnedAuthValue?.authDriver === 'R' && haveRoadDriver && !haveRoadPassenger) {
            navigation.navigate(ROUTE_KEY.DriverRejectApproval);
            return;
          }

          if (!isRegisterRoute) {
            navigation.navigate(ROUTE_KEY.DriverCommunicationRegistration, {
              isPassenger: true,
            });
            return;
          }
        }

        if (carpoolMode === 'DRIVER') {
          if (returnedAuthValue?.authDriver === 'R') {
            navigation.navigate(ROUTE_KEY.DriverRejectApproval);
            return;
          }

          if (returnedAuthValue?.authDriver === 'C') {
            navigation.navigate(ROUTE_KEY.DriverWaitingApproved);
            return;
          }

          if (
            (returnedAuthValue.authDriver === 'Y' && !haveRoadDriver) ||
            (isFirstTimeApproval && returnedAuthValue?.authDriver !== 'N')
          ) {
            navigation.navigate(ROUTE_KEY.DriverCompleteApproval);
            return;
          }

          if (returnedAuthValue?.authDriver === 'N') {
            navigation.navigate(ROUTE_KEY.DriverRegister);
            return;
          }
        }

        bottomSheetRef?.current?.collapse();
        navigation.navigate(ROUTE_KEY.CarpoolTabDriver as any);
        //navigation.navigate(ROUTE_KEY.DriverHome);
      });
  };

  const totalDataEval = (LIST_PARKING_EVAL: ParkingEvalProps[]) => {
    if (LIST_PARKING_EVAL?.length) {
      let total = 0;
      for (let i = 0; i < LIST_PARKING_EVAL.length; i++) {
        let _star = parseFloat(LIST_PARKING_EVAL[i].eval) || 0;
        total += _star > 5 ? 5 : _star;
      }
      return (total / LIST_PARKING_EVAL.length).toFixed(0);
    }
    return 0;
  };

  useEffect(() => {
    const emit = DeviceEventEmitter.addListener(EMIT_EVENT.DATA_EVAL, data =>
      setDataEval(totalDataEval(data)),
    );
    return () => emit.remove();
  }, []);

  const onPressStar = () => {
    if (!userID) {
      navigation.navigate(ROUTE_KEY.Login);
      showMessage({
        message: strings.general_text.login_first,
      });
      return;
    }

    if (isFavoriteParking) {
      removeFavoriteParking({
        memberId: userID as number,
        parkId: parkingID as number,
      })
        .unwrap()
        .then(res => {
          console.log('🚀 ~ file: parking-details.tsx:312 ~ onPressStar ~ res:', res);
          console.log('🚀 ~ file: parking-details.tsx:312 ~ onPressStar ~ res:', res);
          if (res !== '200') {
            showMessage({
              message: strings.general_text?.please_try_again,
            });
            return;
          }
          refetchFavoriteParkingList();
        });
    } else {
      addFavoriteParking({
        memberId: userID as number,
        parkId: parkingID as number,
      })
        .unwrap()
        .then(res => {
          if (res !== '200') {
            showMessage({
              message: strings.general_text?.please_try_again,
            });
            return;
          }
          refetchFavoriteParkingList();
          showMessage({message: '즐겨찾기에 등록 되었습니다'});
        });
    }
  };

  const onPressEvalList = () => {
    if (!userToken?.id || !userToken?.password) {
      navigation.navigate(ROUTE_KEY.Login);
      return;
    }
    navigation.navigate(ROUTE_KEY.EvalList, {parkingID, parkingData: data!});
  };

  return (
    <FixedContainer>
      <CustomHeader
        text={data?.category || '민영'}
        rightContent={
          <TouchableOpacity onPress={onPressStar}>
            {isFavoriteParking ? <Icons.StarFill width={25} height={24} /> : <Icons.Star />}
          </TouchableOpacity>
        }
        onPressBack={handleBack}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Quick view in map */}
        <View>
          <HStack style={styles.parkingNameWrapper}>
            <View style={{flex: 1}}>
              <CustomText
                string={`${data?.brand ? `${data?.brand} ` : ''}${data?.garageName as string}`}
                color={colors.white}
                family={FONT_FAMILY.SEMI_BOLD}
                textStyle={{
                  marginBottom: heightScale(3),
                }}
                numberOfLines={1}
              />
              <CustomText
                string={`${data?.state || ''} ${data?.city || ''} ${data?.addressOld || ''}`}
                color={colors.white}
                size={FONT.CAPTION_2}
                numberOfLines={1}
              />
            </View>
            <TouchableOpacity onPress={onPressEvalList} style={styles.ratingWrapper}>
              <CustomText
                string={`이용평점 (${dataEval || 0})`}
                color={colors.white}
                size={FONT.CAPTION_2}
                family={FONT_FAMILY.SEMI_BOLD}
              />
              <HStack>
                {Array.from({length: 5}).map((_, index) => (
                  <Icon
                    name="star"
                    key={`star-${index}`}
                    color={index >= (Number(dataEval) || 0) ? colors.gray : colors.yellow}
                  />
                ))}
              </HStack>
            </TouchableOpacity>
          </HStack>
          {data?.lat && data?.lng ? (
            <NaverMapView
              initialCamera={{
                latitude: data.lat,
                longitude: data.lng,
                zoom: 16,
              }}
              isShowZoomControls={false}
              isShowLocationButton={false}
              isShowScaleBar={false}
              isShowCompass={false}
              style={styles.mapWrapper}>
              {isFocus && markerStyleInfo && (
                <NaverMapMarkerOverlay
                  latitude={data.lat}
                  longitude={data.lng}
                  image={markerStyleInfo.source}
                  width={markerStyleInfo.width}
                  height={markerStyleInfo.height}
                  caption={markerStyleInfo.caption}
                />
              )}
            </NaverMapView>
          ) : (
            <View style={styles.mapWrapper}>
              <ActivityIndicator color={colors.red} />
            </View>
          )}
        </View>

        {/* Function buttons */}
        <QuickAction
          containerStyle={styles.quickAction}
          onPhonePress={async () => {
            if (data?.pnum) {
              handleCallHotLine(data?.pnum);
            } else {
              showMessage({
                message: '전화번호가 등록되어 있지 않습니다.',
              });
            }
          }}
          onSharePress={() => {
            parkingShareRef?.current?.show();
          }}
          onAlarmPress={() => {
            checkNotificationPermission()
              .then(() => {
                navigation.navigate(ROUTE_KEY.ParkingAlarmMenu);
              })
              .catch(() => {
                Alert.alert('', '앱알림에 접근 권한을 필요합니다. 설정으로 이동하시겠습니까?', [
                  {
                    text: '설정',
                    onPress: () => Linking.openSettings(),
                  },
                  {
                    text: '취소',
                    onPress: () => {},
                  },
                ]);
              });
          }}
          onGuidePress={() => {
            parkingFindWayRef?.current?.show();
          }}
          onParkingVideoPress={() => {
            parkingVideoRef?.current?.show();
          }}
          onStreetViewPress={() => {
            if (data?.lat && data?.lng) {
              parkingStreetViewRef?.current?.show({
                lat: data?.lat,
                long: data?.lng,
              });
            }
          }}
        />

        <Pressable onPress={getParkingCarPoolInfo?.avgPrice ? handleLogin : handleLogin2}>
          <HStack style={styles.carpoolInfoWrapper}>
            {getParkingCarPoolInfo && (
              <Image
                source={
                  getParkingCarPoolInfo.sumNumber && parseInt(getParkingCarPoolInfo.sumNumber) > 0
                    ? IMAGES.icon_park_info2
                    : IMAGES.icon_park_info3
                }
                style={{
                  width: widthScale1(50),
                  height: heightScale1(50),
                  marginLeft: widthScale(13),
                }}
                resizeMode="contain"
              />
            )}

            <View
              style={[
                styles.infoWrapperStyle,
                {
                  marginLeft: widthScale(14),
                  marginRight: widthScale(12),
                  marginBottom: widthScale(10),
                  marginTop: heightScale(10),
                },
              ]}>
              {getParkingCarPoolInfo && (
                <CustomText
                  forDriveMe
                  size={FONT.CAPTION_2}
                  string={
                    parseInt(getParkingCarPoolInfo.sumNumber) > 0
                      ? `${getParkingCarPoolInfo.sumNumber.toLocaleString()}명의 카풀 탑승객이 기다리고 있어요!`
                      : '제휴 주차장을 목적지로 카풀을 등록해보세요!'
                  }
                  family={FONT_FAMILY.MEDIUM}
                  color={colors.grayText}
                />
              )}

              <CustomText
                forDriveMe
                string={
                  getParkingCarPoolInfo?.avgPrice
                    ? '지금 카풀 예약 완료하면\n' +
                      getParkingCarPoolInfo.avgPrice.toLocaleString() +
                      '원 부가수익 창출 가능!'
                    : '카풀로 한달 평균 최대 300,000원\n부가수익 창출하고 주차비 고민 끝!'
                }
                size={FONT.CAPTION}
                family={FONT_FAMILY.SEMI_BOLD}
              />
            </View>

            <View style={{marginRight: widthScale(20)}}>
              <Icons.ChevronRight width={widthScale1(16)} height={widthScale1(16)} />
            </View>
          </HStack>
        </Pressable>

        {/* Parking info tab */}
        <ParkingInfoTab data={data as ParkingProps} />

        {data?.ticketPartnerYN !== IS_ACTIVE.NO && (
          <CustomText
            string="하단 [주차권 구매] 에서 더 많은 주차권을 확인하실 수 있습니다."
            size={FONT.CAPTION}
            family={FONT_FAMILY.BOLD}
            color={colors.primary}
            textStyle={{
              paddingHorizontal: PADDING / 2,
              paddingTop: PADDING,
            }}
          />
        )}

        <CustomText
          string="주차요금,운영시간,할인정보는 개별 주차장의 운영방침에 따라 수시로 달라질 수 있으며, 상단의 정보는 참고용으로 운영업체 및 파킹박앱에서는 이에 대한 책임을 지지 않습니다."
          color={colors.darkGray}
          textStyle={{
            paddingBottom: PADDING,
            paddingTop: PADDING,
            paddingHorizontal: PADDING / 2,
          }}
        />

        <View style={styles.bannerWrapper}>
          <Image source={IMAGES.profile_banner} style={styles.banner} resizeMode="stretch" />
        </View>

        {/* Review */}
        <ParkingEval parkingData={data as ParkingProps} />

        {/* Request edit parking lot info */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(ROUTE_KEY.RequestEditParking, {
              id: parkingID,
              garageName: data?.garageName as string,
            })
          }
          style={styles.requestEditWrapper}>
          <CustomText
            string="주차장 정보수정 요청하기!!"
            color={colors.red}
            size={FONT.SUB_HEAD}
            family={FONT_FAMILY.SEMI_BOLD}
          />
        </TouchableOpacity>
      </ScrollView>

      {/* Reservation buttons */}

      {data?.ticketPartnerYN !== IS_ACTIVE.NO && (
        <HStack pointerEvents="box-none" style={styles.buttonGroupWrapper}>
          {/* Special info */}
          <TouchableOpacity onPress={handleOpenSpecialInfo} style={styles.specialButtonWrapper}>
            <CustomText
              string={'(필독)특이사항보기'}
              size={FONT.CAPTION}
              family={FONT_FAMILY.SEMI_BOLD}
              color={colors.white}
            />
          </TouchableOpacity>
          {/* Reservation */}
          <TouchableOpacity onPress={handeReservation} style={styles.reservationWrapper}>
            <CustomText
              string="주차권 구매"
              color={colors.white}
              size={FONT.BODY}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </TouchableOpacity>
        </HStack>
      )}

      {/* Special info */}
      <SpecialInfoModal ref={specialInfoRef} />

      {/* Street View */}
      <ParkingStreetView
        ref={parkingStreetViewRef}
        cordinate={{
          lat: data?.lat as number,
          long: data?.lng as number,
        }}
      />

      {/* Share parking */}
      <ParkingShareModal
        ref={parkingShareRef}
        parkignID={data?.id as number}
        garagePrice={data?.onedayTicketCost || 0}
        garageName={data?.garageName || ''}
        item={data as ParkingProps}
      />

      {/* Parking find way modal */}
      <NavigationSelectionModal
        arriveAdressName={`${data?.state} ${data?.city} ${data?.addressNew || data?.addressOld}`}
        arriveCoord={{
          lat: data?.lat,
          long: data?.lng,
        }}
        ref={parkingFindWayRef}
      />
      {/* <ParkingFindWayModal
        ref={parkingFindWayRef}
        isConnectedGenesis={isConnectedGenesis}
        isConnectedHyundai={isConnectedHyundai}
        isConnectedKia={isConnectedKia}
        parkingLot={data as ParkingProps}
      /> */}

      {/* Parking video */}
      <ParkingVideo ref={parkingVideoRef} />

      {/* Limit popup */}
      <LimitPopup ref={limitPopupRef} />

      {/* Curation popup */}
      <CurationPopup ref={curationRef} />
    </FixedContainer>
  );
});

export default ParkingDetails;

const styles = StyleSheet.create({
  mapWrapper: {
    width: '100%',
    height: heightScale(300),
    justifyContent: 'center',
    alignItems: 'center',
  },
  parkingNameWrapper: {
    position: 'absolute',
    zIndex: 999,
    backgroundColor: `${colors.darkGray}95`,
    width: '100%',
    padding: PADDING / 2,
  },
  ratingWrapper: {
    alignItems: 'center',
  },

  buttonGroupWrapper: {
    paddingVertical: heightScale(5),
    justifyContent: 'space-between',
    paddingHorizontal: PADDING / 2,
  },
  specialButtonWrapper: {
    backgroundColor: colors.darkRed,
    flex: 1,
    minHeight: heightScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: widthScale(10),
    borderRadius: widthScale(10),
  },
  reservationWrapper: {
    backgroundColor: colors.primary,
    flex: 1,
    minHeight: heightScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: widthScale(10),
  },
  bannerWrapper: {
    marginHorizontal: PADDING / 2,
    marginBottom: PADDING,
  },
  carpoolInfoWrapper: {
    paddingVertical: heightScale(5),
    backgroundColor: '#F5F5F5',
    flex: 1,
    borderRadius: widthScale(8),
    marginHorizontal: PADDING / 2,
    marginBottom: PADDING,
    marginTop: heightScale(20), // 상단 여백 값
    marginLeft: widthScale(13),
    marginRight: widthScale(13),
  },
  banner: {
    height: widthScale(85),
    width: '100%',
  },
  requestEditWrapper: {
    height: heightScale(50),
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.red,
    borderWidth: 1,
    marginVertical: PADDING / 2,
  },
  quickAction: {
    borderTopStartRadius: widthScale(20),
    borderTopEndRadius: widthScale(20),
    backgroundColor: colors.white,
    marginTop: -PADDING_HEIGHT,
  },
  infoWrapperStyle: {
    flex: 1,
    gap: heightScale1(2),
  },
  nicknameTextStyle: {
    fontFamily: FONT_FAMILY.MEDIUM,
    color: colors.menuTextColor,
    fontSize: fontSize1(16),
    lineHeight: heightScale1(22),
  },
});
