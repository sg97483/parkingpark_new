import {getAuth, signOut} from '@react-native-firebase/auth';
import {getFirestore, collection, onSnapshot} from '@react-native-firebase/firestore';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {memo, useEffect, useRef} from 'react';
import {BackHandler, DeviceEventEmitter, ToastAndroid, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import MyTnkAdsModule, {AdsCode} from '~/my-tnk-ads';
import ConsentPopup, {ConsentPopupRefs} from '~components/home/consent-popup';
import EventPopup, {EventPopupRefs} from '~components/home/event-popup/event-popup';
import ParkingFilterPopupNew, {ParkingFilterRefs} from '~components/home/parking-filter-popup-new';
import {WeatherModalRefObject} from '~components/modal-weather';
import CustomHomeHeader from '~components/new-home/custom-home-header';
import MapView from '~components/new-home/map-view';
import {PopupSearchRef} from '~components/new-home/popup-search';
import Spinner from '~components/spinner';
import {EMIT_EVENT} from '~constants/enum';
import {CordinateProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {clearCarpoolReducarData} from '~reducers/carpoolReducer';
import {clearChatReducer} from '~reducers/chatReducer';
import {clearParkingData} from '~reducers/parkingReducer';
import {clearRecentData} from '~reducers/searchRecentLocationsReducer';
import {cacheCarpoolAlarmList} from '~reducers/termAndContionReducer';
import {changeCarpoolMode, clearUserData} from '~reducers/userReducer';
import {cacheCodeRegion} from '~reducers/weatherReducer';
import {carpoolServices} from '~services/carpoolServices';
import {couponServices} from '~services/couponServices';
import {driverServices} from '~services/driverServices';
import {monthlyParkingDirectServices} from '~services/monthlyParkingDirectServices';
import {naverMapServices} from '~services/naverMapServices';
import {notiServices} from '~services/notiServices';
import {noticeServices, useLazyGetNoticeEventQuery} from '~services/noticeServices';
import {parkingServices} from '~services/parkingServices';
import {passengerServices} from '~services/passengerServices';
import {paymentCardServices} from '~services/paymentCardServices';
import {getCodeRegionRealm, getRealm, initCodeRegionRealm} from '~services/realm';
import {reservationServices} from '~services/reservationServices';
import {usageHistoryServices} from '~services/usageHistoryServices';
import {userServices} from '~services/userServices';
import {valetParkingServices} from '~services/valetParkingServices';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';

let exitApp = 0;

const Home = memo(() => {
  const navigation: UseRootStackNavigation = useNavigation();
  const dispatch = useAppDispatch();
  const [getNoticeEvent] = useLazyGetNoticeEventQuery();

  const userCordinate = useAppSelector(state => state?.coordinateReducer?.userCordinate);

  const eventPopupRef = useRef<EventPopupRefs>(null);
  const consentPopupRef = useRef<ConsentPopupRefs>(null);
  const parkingFilterRef = useRef<ParkingFilterRefs>(null);
  const popupSearchRef = useRef<PopupSearchRef>(null);
  const weatherModalRef = useRef<WeatherModalRefObject>(null);
  const isFocused = useIsFocused();

  const isAgreeTerms = useAppSelector(state => state?.termAndConditionReducer?.isAgreeTerms);

  useEffect(() => {
    const backAction = () => {
      const stackHistory: {key: string; type: string}[] =
        (navigation?.getState()?.history as {key: string; type: string}[]) || [];
      if (exitApp === 1) {
        BackHandler.exitApp();
        return false;
      } else if (
        !navigation?.canGoBack() &&
        stackHistory &&
        stackHistory?.length === 1 &&
        stackHistory?.[0]?.key?.split('Home')?.length > 1
      ) {
        MyTnkAdsModule.exitDialogTnkAdOpen().then(res => {
          if (__DEV__) {
            ToastAndroid.showWithGravity(`Code ne: ${res}`, ToastAndroid.LONG, ToastAndroid.CENTER);
          }

          if (res === AdsCode.CLOSE_EXIT) {
            BackHandler.exitApp();
            return true;
          } else if (res === AdsCode.CLOSE_SIMPLE) {
            return true;
          } else {
            if (exitApp === 0) {
              exitApp = 1;
              showMessage({
                message: '뒤로 버튼을 한번 더 누르시면 종료됩니다.',
              });
            }
            setTimeout(() => {
              exitApp = 0;
            }, 2000);
            return true;
          }
        });

        return true;
      }
      return false;
    };
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, [navigation]);

  // Logout listener
  useEffect(() => {
    const logoutListener = DeviceEventEmitter.addListener(EMIT_EVENT.LOGOUT, () => {
      dispatch(clearRecentData());
      dispatch(clearChatReducer());
      dispatch(clearUserData());
      dispatch(clearParkingData());
      dispatch(clearCarpoolReducarData());
      dispatch(parkingServices.util.resetApiState());
      dispatch(userServices.util.resetApiState());
      dispatch(noticeServices.util.resetApiState());
      dispatch(monthlyParkingDirectServices.util.resetApiState());
      dispatch(couponServices.util.resetApiState());
      dispatch(paymentCardServices.util.resetApiState());
      dispatch(paymentCardServices.util.resetApiState());
      dispatch(valetParkingServices.util.resetApiState());
      dispatch(usageHistoryServices.util.resetApiState());
      dispatch(reservationServices.util.resetApiState());
      dispatch(carpoolServices.util.resetApiState());
      dispatch(notiServices.util.resetApiState());
      dispatch(passengerServices.util.resetApiState());
      dispatch(driverServices.util.resetApiState());
      dispatch(naverMapServices.util.resetApiState());
      dispatch(changeCarpoolMode('PASSENGER'));
      dispatch(cacheCarpoolAlarmList([]));
      signOut(getAuth());
      showMessage({
        message: '로그아웃 되었습니다.',
      });
      navigation?.reset({
        index: 0,
        routes: [{name: ROUTE_KEY.ParkingParkHome}],
      });
      Spinner.hide();
    });

    return () => {
      logoutListener.remove();
    };
  }, []);

  // Get notice event
  const isShowEventNotiveToday = useAppSelector(state => state?.eventNoticeReducer?.getNoticeToday);

  const getTodayNoticeEvent = () => {
    if (
      isShowEventNotiveToday?.show ||
      (moment(isShowEventNotiveToday?.date).format('YYYYMMDD') !== moment().format('YYYYMMDD') &&
        isFocused)
    ) {
      getNoticeEvent()
        .unwrap()
        .then(res => {
          setTimeout(() => {
            eventPopupRef?.current?.show(res);
          }, 1000);
        });
    } else {
      return;
    }
  };

  useEffect(() => {
    if (!isAgreeTerms) {
      setTimeout(() => {
        consentPopupRef?.current?.show();
      }, 500);
    } else {
      if (isShowEventNotiveToday) {
        setTimeout(() => {
          getTodayNoticeEvent();
        }, 2000);
      }
    }
  }, [isAgreeTerms, isShowEventNotiveToday]);

  useEffect(() => {
    const loadCodeRegion = async () => {
      await initCodeRegionRealm(userCordinate as CordinateProps);

      const realm = await getCodeRegionRealm();

      const filteredResults = realm
        .objects('CodeRegion')
        .filtered('city != ""')
        .sorted('distance', true);

      const result: Record<string, string | number>[] = filteredResults.slice(0, 1) as any;

      if (result[0]) {
        dispatch(cacheCodeRegion(result[0] as any));

        // 날씨 데이터를 가져오는 코드 주석 처리
        /*
        fetch(http://oapi.wisemobile.co.kr/iOS_Data/DFS_${result[0]?.code}.dat)
          .then(response => response.text())
          .then(result => {
            const str = result as string;
            const obj: {[key: string]: string} = {};

            const lines = str.trim().split('\n');
            lines.forEach((line: string) => {
              const matches = line.match(/^\$(\w+)\s+=\s+'([\p{L}\p{M}\p{N}\p{P}\p{S}\p{Z}]+)';$/u);
              if (matches) {
                const [, variable, value] = matches;
                obj[variable] = value;
              }
            });

            dispatch(cacheWeatherData(obj));
          })
          .catch(error => console.log('error', error));
           */
      }
    };
    loadCodeRegion();
  }, []);

  useEffect(() => {
    const loadData = () => {
      // 실시간 리스너 (onSnapshot)으로 변경
      onSnapshot(
        collection(getFirestore(), 'users'),
        async (
          firestoreData: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
        ) => {
          if (!firestoreData || !firestoreData.docs) {
            console.log('Firestore 데이터가 null이거나 문서가 없습니다.');
            return;
          }

          if (!firestoreData.metadata.hasPendingWrites) {
            try {
              const realm = await getRealm();
              const currentUsersData = realm.objects('FirebaseUser');

              realm.write(() => {
                currentUsersData?.forEach((item: any) => {
                  const objectToDelete = realm.objectForPrimaryKey('FirebaseUser', item?.uid);
                  if (objectToDelete) {
                    realm.delete(objectToDelete);
                  }
                });
              });

              realm.write(() => {
                // 타입 지정!
                const newList = firestoreData.docs.filter(
                  (
                    doc: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
                  ) => doc.data()?.uid,
                );
                newList?.forEach(
                  (
                    item: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
                  ) => {
                    if (item?.data()?.uid) {
                      realm.create('FirebaseUser', {
                        uid: item?.data()?.uid,
                        testdataset: item?.data()?.testdataset || 0,
                        token: item?.data()?.token || '',
                        userid: item?.data()?.userid || '',
                        usermsg: item?.data()?.usermsg || '',
                        usernm: item?.data()?.usernm || '',
                        userphoto: item?.data()?.userphoto || '',
                      });
                    }
                  },
                );
              });
            } catch (error) {
              console.log('Thuan ~ file: home.tsx:257 ~ loadData ~ error:', error);
            }
          }
        },
      );
    };

    loadData();
  }, []);

  return (
    <View style={{flex: 1}}>
      <CustomHomeHeader
        onFilterPress={() => parkingFilterRef?.current?.show()}
        onReservationSimplePress={() => navigation.navigate(ROUTE_KEY.ReservationSimple)}
        onWeatherPress={() => {
          weatherModalRef?.current?.show();
        }}
        onSearch={text => navigation.navigate(ROUTE_KEY.PopupNewSearch, {text})}
      />

      {/* Map */}
      <MapView />

      {/* Event popup */}
      <EventPopup ref={eventPopupRef} />

      {/* Consent popup */}
      <ConsentPopup ref={consentPopupRef} />

      {/* Parking Filter */}
      <ParkingFilterPopupNew ref={parkingFilterRef} />

      {/* Search Popup */}

      {/*<PopupNewSearch />*/}

      {/* Weather popup */}
      {/*<ModalWeather ref={weatherModalRef} /> */}
    </View>
  );
});

export default Home;
