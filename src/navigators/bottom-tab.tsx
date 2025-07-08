import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '@react-native-firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  query,
  where,
  onSnapshot,
} from '@react-native-firebase/firestore';
import {BottomTabBarProps, createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {asyncComponent} from 'react-async-component';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ICONS} from '~/assets/images-path';
import Divider from '~components/divider';
import LoadingComponent from '~components/loading-component';
import {FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {cacheListChatData} from '~reducers/carpoolReducer';
import {cacheBottomTabHeight} from '~reducers/termAndContionReducer';
import {cacheMyDriverInfo, changeCarpoolMode} from '~reducers/userReducer';
import {
  useGetMyDriverRoadQuery,
  useGetMyRiderRoadQuery,
  useReadMyCarpoolInfoQuery,
} from '~services/carpoolServices';
import {getRealm} from '~services/realm';
import {
  useCheckAuthDriverAndPassengerMutation,
  useFirebaseTokenUpdateMutation,
  useLazyReadMyDriverQuery,
} from '~services/userServices';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {dayjs} from '~utils/dayjsUtil';
import {ROUTE_KEY} from './router';
import {RootStackScreenProps} from './stack';
import {skipToken} from '@reduxjs/toolkit/query';

const Tab = createBottomTabNavigator();
const auth = getAuth();
const db = getFirestore();

const AsyncPassengerHome = asyncComponent({
  resolve: () =>
    new Promise<any>(resolve => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          return resolve(import('../screens/drive-me-home/passenger-home'));
        }, 500);
      });
    }),
  LoadingComponent: () => {
    return <LoadingComponent />;
  },
});

const AsyncDriverHome = asyncComponent({
  resolve: () =>
    new Promise<any>(resolve => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          return resolve(import('../screens/drive-me-home/driver-home'));
        }, 500);
      });
    }),
  LoadingComponent: () => {
    return <LoadingComponent />;
  },
});

const AsyncParkingParkHome = asyncComponent({
  resolve: () =>
    new Promise<any>(resolve => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          return resolve(import('./drawer'));
        }, 500);
      });
    }),
  LoadingComponent: () => {
    return <LoadingComponent />;
  },
});

const AsyncMyProfile = asyncComponent({
  resolve: () =>
    new Promise<any>(resolve => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          return resolve(import('../screens/my-profile/my-profile'));
        }, 500);
      });
    }),
  LoadingComponent: () => {
    return <LoadingComponent />;
  },
});

// MyBottomTab에 readMyDriver 함수도 prop으로 전달합니다.
interface CustomBottomTabProps extends BottomTabBarProps {
  carpoolMode: 'PASSENGER' | 'DRIVER';
  readMyDriver: any; // 드라이버 탭 클릭 시 호출하기 위해 추가
}

const MyBottomTab = ({
  state,
  descriptors,
  navigation,
  carpoolMode,
  readMyDriver,
}: CustomBottomTabProps) => {
  const {userToken, userID, CMemberID} = userHook();
  const CMemberInfo = useAppSelector(state => state?.userReducer?.myDriverInfo);
  const my_uid = auth.currentUser?.uid;
  const isFirstTimeApproval = useAppSelector(state => state?.carpoolReducer?.isFirstTimeApproval);
  const [listUsers, setListUsers] = useState<any>([]);

  const dispatch = useAppDispatch();

  // ★★ 쿼리 클릭 시 실행을 위한 state 추가 ★★
  const [shouldFetchPassenger, setShouldFetchPassenger] = useState(false);
  const [shouldFetchDriver, setShouldFetchDriver] = useState(false);

  // useGetMyRiderRoadQuery: passengerRoad는 탭 클릭(shouldFetchPassenger === true) 시에만 실행
  const {
    data: passengerRoad,
    refetch: refetchPassengerRoad,
    isUninitialized: isFetchingPassengerRoad,
  } = useGetMyRiderRoadQuery(
    {
      memberId: userID as number,
      id: CMemberID as number,
    },
    {
      skip: !CMemberID || !userID || carpoolMode !== 'PASSENGER' || !shouldFetchPassenger,
      refetchOnFocus: false,
    },
  );

  // useGetMyDriverRoadQuery: driverRoad는 탭 클릭(shouldFetchDriver === true) 시에만 실행
  const {
    data: driverRoad,
    refetch: refetchDriverRoad,
    isUninitialized: isFetchingDriverRoad,
  } = useGetMyDriverRoadQuery(
    {
      memberId: userID as number,
      id: CMemberID as number,
    },
    {
      skip: !CMemberID || !userID || carpoolMode !== 'DRIVER' || !shouldFetchDriver,
      refetchOnFocus: false,
    },
  );

  const [checkAuthDriverAndPassenger, {isLoading}] = useCheckAuthDriverAndPassengerMutation();

  // 기존 자동 실행 useFocusEffect 제거
  /*
  useFocusEffect(
    useCallback(() => {
      if (carpoolMode === 'PASSENGER' && !isFetchingPassengerRoad) {
        refetchPassengerRoad();
      }
      if (carpoolMode === 'DRIVER' && !isFetchingDriverRoad) {
        refetchDriverRoad();
      }
    }, [carpoolMode, isFetchingDriverRoad, isFetchingPassengerRoad]),
  );
  */

  const {data: businessCardInfo} = useReadMyCarpoolInfoQuery(
    userID ? {memberId: userID!} : skipToken, // userID가 없을 경우 호출하지 않음
  );

  const isRegisteredBusinessCard = useMemo(() => {
    if (
      businessCardInfo?.coAddress &&
      businessCardInfo?.coName &&
      businessCardInfo?.job &&
      businessCardInfo?.jobType
    ) {
      return true;
    } else {
      return false;
    }
  }, [businessCardInfo]);

  const getTitle = useCallback((title: string) => {
    switch (title) {
      case ROUTE_KEY.ParkingParkTab:
        return '주차';

      case ROUTE_KEY.CarpoolTab:
        return '카풀(탑승객)';

      case ROUTE_KEY.CarpoolTabDriver:
        return '카풀(운전자)';

      case ROUTE_KEY.MyProfileTab:
        return '메뉴';
      default:
        return '';
    }
  }, []);

  const renderTabBarIcon = (focused: boolean, title: string) => {
    const getIcon = () => {
      switch (title) {
        case ROUTE_KEY.ParkingParkTab:
          if (focused) {
            return <Image source={ICONS.ticket_fill} style={styles.iconStyle} />;
          }
          return <Image source={ICONS.ticket_outline} style={styles.iconStyle} />;

        case ROUTE_KEY.CarpoolTab:
          if (focused) {
            return <Image source={ICONS.carpoolrider_fill} style={styles.iconStyle} />;
          }
          return <Image source={ICONS.carpoolrider_outline} style={styles.iconStyle} />;

        case ROUTE_KEY.CarpoolTabDriver:
          if (focused) {
            return <Image source={ICONS.carpooldriver_fill} style={styles.iconStyle} />;
          }
          return <Image source={ICONS.carpooldriver_outline} style={styles.iconStyle} />;

        case ROUTE_KEY.MyProfileTab:
          if (focused) {
            return <Image source={ICONS.menu_fill} style={styles.iconStyle} />;
          }
          return <Image source={ICONS.menu_outline} style={styles.iconStyle} />;
        default:
          break;
      }
    };

    return (
      <View style={styles.iconWrapperStyle}>
        {getIcon()}
        <Text
          style={[
            styles.tabLabelStyle,
            {
              color: focused ? colors.heavyGray : colors.grayText,
            },
          ]}>
          {getTitle(title)}
        </Text>
      </View>
    );
  };

  const isFirstTimeRegister = useMemo((): boolean => {
    return driverRoad || passengerRoad || CMemberInfo ? false : true;
  }, [driverRoad, passengerRoad, CMemberInfo]);

  const isModeSelect = useMemo(() => {
    return (!passengerRoad?.startPlaceOut &&
      !passengerRoad?.startPlaceIn &&
      !passengerRoad?.endPlaceOut &&
      !passengerRoad?.endPlaceIn) ||
      (!driverRoad?.startPlaceIn &&
        !driverRoad?.startPlaceOut &&
        !driverRoad?.endPlaceIn &&
        !driverRoad?.endPlaceOut)
      ? true
      : false;
  }, [driverRoad, passengerRoad]);

  const isAgreeTerms = useMemo(() => {
    return CMemberInfo?.termsYN === IS_ACTIVE.YES;
  }, [CMemberInfo?.termsYN]);

  const [isRegisterdRoute, setIsRegisterdRoute] = useState(false);

  useEffect(() => {
    console.log('carpoolMode:', carpoolMode);

    if (carpoolMode === 'PASSENGER' && passengerRoad) {
      const startPlaceInValid = passengerRoad.startPlaceIn?.length > 0;
      const startPlaceOutValid = passengerRoad.startPlaceOut?.length > 0;
      const endPlaceInValid = passengerRoad.endPlaceIn?.length > 0;
      const endPlaceOutValid = passengerRoad.endPlaceOut?.length > 0;

      setIsRegisterdRoute(
        startPlaceInValid && startPlaceOutValid && endPlaceInValid && endPlaceOutValid,
      );
      return;
    }

    if (carpoolMode === 'DRIVER' && driverRoad) {
      const startPlaceInValid = driverRoad.startPlaceIn?.length > 0 || false;
      const startPlaceOutValid = driverRoad.startPlaceOut?.length > 0 || false;
      const endPlaceInValid = driverRoad.endPlaceIn?.length > 0 || false;
      const endPlaceOutValid = driverRoad.endPlaceOut?.length > 0 || false;

      setIsRegisterdRoute(
        startPlaceInValid && startPlaceOutValid && endPlaceInValid && endPlaceOutValid,
      );
      return;
    }

    setIsRegisterdRoute(false);
  }, [carpoolMode, driverRoad, passengerRoad]);

  useEffect(() => {
    console.log('isRegisterdRoute updated:', isRegisterdRoute);
  }, [isRegisterdRoute]);

  const haveRoadDriver = useMemo(() => {
    return driverRoad &&
      driverRoad?.startPlaceIn?.length > 0 &&
      driverRoad?.startPlaceOut?.length > 0 &&
      driverRoad?.endPlaceIn?.length > 0 &&
      driverRoad?.endPlaceOut?.length > 0
      ? true
      : false;
  }, [driverRoad]);

  const haveRoadPassenger = useMemo(() => {
    return (passengerRoad?.startPlaceIn?.length as number) > 0 &&
      (passengerRoad?.startPlaceOut?.length as number) > 0 &&
      (passengerRoad?.endPlaceIn?.length as number) > 0 &&
      (passengerRoad?.endPlaceOut?.length as number) > 0
      ? true
      : false;
  }, [passengerRoad]);

  const handleGoToCarpool = useCallback(
    async (route: any, mode: 'PASSENGER' | 'DRIVER') => {
      if (!userToken?.id || !userToken?.password) {
        navigation.navigate(ROUTE_KEY.Login);
        showMessage({
          message: strings?.general_text?.login_first,
        });
        return;
      }

      await checkAuthDriverAndPassenger({
        memberId: userID,
        id: CMemberID,
      })
        .unwrap()
        .then(auth => {
          console.log('🚀 ~ MyBottomTab ~ auth:', auth);

          // isRegisterdRoute 값을 직접 계산
          let isRouteRegistered = false;
          if (mode === 'PASSENGER' && passengerRoad) {
            const startPlaceInValid = passengerRoad.startPlaceIn?.length > 0;
            const startPlaceOutValid = passengerRoad.startPlaceOut?.length > 0;
            const endPlaceInValid = passengerRoad.endPlaceIn?.length > 0;
            const endPlaceOutValid = passengerRoad.endPlaceOut?.length > 0;

            isRouteRegistered =
              startPlaceInValid && startPlaceOutValid && endPlaceInValid && endPlaceOutValid;
          } else if (mode === 'DRIVER' && driverRoad) {
            const startPlaceInValid = driverRoad.startPlaceIn?.length > 0 || false;
            const startPlaceOutValid = driverRoad.startPlaceOut?.length > 0 || false;
            const endPlaceInValid = driverRoad.endPlaceIn?.length > 0 || false;
            const endPlaceOutValid = driverRoad.endPlaceOut?.length > 0 || false;

            isRouteRegistered =
              startPlaceInValid && startPlaceOutValid && endPlaceInValid && endPlaceOutValid;
          }

          console.log('isRouteRegistered:', isRouteRegistered);
          console.log('isRegisterdRoute:', isRegisterdRoute);
          console.log('auth.authDriver:', auth.authDriver);
          console.log('isFirstTimeApproval:', isFirstTimeApproval);
          console.log('haveRoadPassenger:', haveRoadPassenger);
          console.log('haveRoadDriver:', haveRoadDriver);

          if (!isAgreeTerms) {
            navigation.navigate(ROUTE_KEY.DiverAgreeActivity, {
              isPassenger: mode === 'PASSENGER',
            });
            return;
          }

          if (mode === 'PASSENGER') {
            if (!isRegisteredBusinessCard && !isRouteRegistered) {
              navigation.navigate(ROUTE_KEY.BusinessCardAndVaccineRegistration, {
                isDriver: false,
              });
              return;
            }

            if (auth?.authDriver === 'C' && !haveRoadPassenger) {
              navigation.navigate(ROUTE_KEY.DriverWaitingApproved);
              return;
            }
            if (auth?.authDriver === 'R' && haveRoadDriver && !haveRoadPassenger) {
              navigation.navigate(ROUTE_KEY.DriverRejectApproval);
              return;
            }

            if (!isRouteRegistered) {
              navigation.navigate(ROUTE_KEY.DriverCommunicationRegistration, {
                isPassenger: true,
              });
              return;
            }
          }

          if (mode === 'DRIVER') {
            if (auth.authDriver === 'Y' && !isFirstTimeApproval) {
              dispatch(changeCarpoolMode('DRIVER'));
              navigation.navigate(route.name, route.params);
              console.log('isFirstTimeApproval_log2:', isFirstTimeApproval);
              return;
            }

            if (auth?.authDriver === 'C') {
              navigation.navigate(ROUTE_KEY.DriverWaitingApproved);
              return;
            }

            if (auth?.authDriver === 'N') {
              navigation.navigate(ROUTE_KEY.DriverRegister);
              return;
            }

            if (auth?.authDriver === 'R') {
              navigation.navigate(ROUTE_KEY.DriverRejectApproval);
              return;
            }
          }

          navigation.navigate(route.name, route.params);
        });
    },
    [
      userToken,
      isFirstTimeRegister,
      isRegisterdRoute,
      isRegisteredBusinessCard,
      isAgreeTerms,
      driverRoad,
      navigation,
      passengerRoad,
    ],
  );

  const getData = async () => {
    const realm = await getRealm();
    const response = realm.objects('FirebaseUser');
    setListUsers(response);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // Firestore settings는 v22부터는 일반적으로 별도로 호출하지 않아도 됨
    // 하지만 꼭 필요하다면 아래와 같이 사용할 수 있습니다.
    // db.settings({ persistence: false });

    // 쿼리 정의
    const roomsQuery = query(collection(db, 'rooms'), where(`users.${my_uid}`, '>=', 0));

    // 실시간 리스너 등록
    const unsubscribe = onSnapshot(roomsQuery, snapshot => {
      let temptList: any[] = [];
      snapshot.forEach(item => {
        const users = item.data()?.users;
        if (my_uid && my_uid in users) {
          temptList.push({
            id: item.id,
            ...item.data(),
          });
        }
      });

      const newList =
        carpoolMode === 'PASSENGER'
          ? temptList.filter(item => item?.passengerID === userID)
          : temptList.filter(item => item?.driverID === userID);

      let unreadTotal = 0;

      const listChatRooms = newList
        .sort((a, b) => {
          const timeA = dayjs
            .unix(a?.timestamp?.seconds)
            .add(a?.timestamp?.nanoseconds / 1e9, 'second')
            .valueOf(); // ms 단위 timestamp

          const timeB = dayjs
            .unix(b?.timestamp?.seconds)
            .add(b?.timestamp?.nanoseconds / 1e9, 'second')
            .valueOf(); // ms 단위 timestamp

          return timeB - timeA;
        })

        .map(item => {
          let unreadMsg = 0;
          let title = '';
          let photo = '';
          let userid = '';

          for (const key in item?.users) {
            if (my_uid === key) {
              const unread = Number(item?.users[key]);
              unreadTotal += unread;
              unreadMsg = unread;
              break;
            }
          }

          if (Object.keys(item?.users)?.length === 2) {
            for (const key in item?.users) {
              if (my_uid === key) {
                continue;
              }
              const userModel = listUsers?.find((it: any) => it?.uid === key);
              title = userModel?.usernm || '';
              userid = userModel?.userid || '';
              photo = userModel?.userphoto || '';
            }
          } else {
            title = item?.title || '';
          }

          const otherUID = Object.keys(item?.users).find((it: any) => it !== my_uid);

          return {
            roomID: item.id,
            lastDatetime: item.lastDatetime,
            lastMsg: item.msgtype === '1' ? '이미지' : item.msgtype === '2' ? '파일' : item.msg,
            userCount: Object.keys(item.users)?.length,
            uid: item.uid,
            unreadCount: unreadMsg,
            userid: userid,
            photo: photo,
            title: title,
            passengerID: item.passengerID || 0,
            driverID: item.driverID || 0,
            resId: item.resId || 0,
            isRequestedBy: item.isRequestedBy,
            cDayId: item.cDayId ? item.cDayId : null,
            otherUID: otherUID,
            temptRoute: item.temptRoute,
            routeRegisterByPassengerID: item.routeRegisterByPassengerID ?? null,
            isCancelRequest: item.isCancelRequest ?? false,
          };
        });

      dispatch(
        cacheListChatData({
          data: listChatRooms,
          isFetching: false,
          unreadTotal: unreadTotal,
        }),
      );
    });

    // cleanup
    return () => unsubscribe();
  }, [carpoolMode, my_uid, listUsers]);

  return (
    <SafeAreaView
      onLayout={({
        nativeEvent: {
          layout: {height},
        },
      }) => {
        if (height > 0) {
          dispatch(cacheBottomTabHeight(height));
        }
      }}
      style={{backgroundColor: 'white'}}
      edges={['bottom']}>
      <Divider />
      <View style={{flexDirection: 'row', backgroundColor: 'white'}}>
        {state.routes.map((route: any, index: number) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              if (index === 1) {
                // PASSENGER 탭 클릭 시: 쿼리 실행 플래그 설정
                setShouldFetchPassenger(true);
                dispatch(changeCarpoolMode('PASSENGER'));
                handleGoToCarpool(route, 'PASSENGER');
              } else if (index === 2) {
                // DRIVER 탭 클릭 시: 쿼리 실행 플래그 설정 및 readMyDriver 호출 (클릭 시 실행)
                setShouldFetchDriver(true);
                dispatch(changeCarpoolMode('DRIVER'));
                if (readMyDriver && userID) {
                  readMyDriver({memberId: userID.toString()})
                    .unwrap()
                    .then((res: any) => {
                      dispatch(cacheMyDriverInfo(res));
                    })
                    .catch((error: any) => {
                      console.error('readMyDriver error:', error);
                    });
                }
                handleGoToCarpool(route, 'DRIVER');
              } else {
                navigation.navigate(route.name, route.params);
              }
            }
          };

          return (
            <TouchableOpacity
              activeOpacity={1}
              key={index.toString()}
              onPress={onPress}
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              {renderTabBarIcon(isFocused, label)}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const BottomTab = (props: RootStackScreenProps<'ParkingParkHome'>) => {
  const {route, navigation} = props;
  const selectedTab = route?.params?.selectedTab;
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(state => state?.userReducer?.user);
  const FCMToken = useAppSelector(state => state?.userReducer?.FCMToken);
  const carpoolMode = useAppSelector(state => state?.userReducer?.carpoolMode);

  const [updateFirebaseToken] = useFirebaseTokenUpdateMutation();
  const [readMyDriver] = useLazyReadMyDriverQuery();

  useEffect(() => {
    if (selectedTab) {
      switch (selectedTab) {
        case 1:
          navigation.navigate(ROUTE_KEY.ParkingParkTab as any);
          break;
        case 2:
          navigation.navigate(ROUTE_KEY.CarpoolTab as any);
          break;
        case 3:
          navigation.navigate(ROUTE_KEY.CarpoolTabDriver as any);
          break;
        case 4:
          navigation.navigate(ROUTE_KEY.MyProfileTab as any);
          break;

        default:
          break;
      }
    }
  }, [navigation, selectedTab]);

  const initialRouteName = useMemo(() => {
    switch (selectedTab) {
      case 1:
        return ROUTE_KEY.ParkingParkTab;
      case 2:
        return ROUTE_KEY.CarpoolTab;
      case 3:
        return ROUTE_KEY.CarpoolTabDriver;
      case 4:
        return ROUTE_KEY.MyProfileTab;
      default:
        return ROUTE_KEY.ParkingParkTab;
    }
  }, [selectedTab]);

  useEffect(() => {
    if (userInfo) {
      signInWithEmailAndPassword(auth, userInfo?.email, '123456')
        .then(async value => {
          const uid = value?.user?.uid;
          await setDoc(doc(collection(db, 'users'), uid), {
            uid: uid,
            userid: userInfo?.email,
            usernm: userInfo?.nic,
            token: FCMToken,
          });
        })
        .catch(error => {
          if (error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found') {
            createUserWithEmailAndPassword(auth, userInfo?.email, '123456').then(async value => {
              const uid = value?.user?.uid;
              await setDoc(doc(collection(db, 'users'), uid), {
                uid: uid,
                userid: userInfo?.email,
                usernm: userInfo?.nic,
                token: FCMToken,
              });
              await updateFirebaseToken({
                deviceToken: uid,
                email: userInfo?.email,
              });
            });
          }
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }
          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }
          console.log(error);
        });
    }
  }, [userInfo?.email, userInfo?.nic, FCMToken]);

  // ★★ 기존 자동 실행 useFocusEffect (readMyDriver) 제거 ★★
  /*
  useFocusEffect(
    useCallback(() => {
      if (userInfo?.id) {
        readMyDriver({
          memberId: userInfo?.id.toString(),
        })
          .unwrap()
          .then((res: any) => {
            dispatch(cacheMyDriverInfo(res));
          });
      }
    }, [userInfo?.id, cacheMyDriverInfo]),
  );
  */

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        lazy: true,
        tabBarStyle: {
          borderTopWidth: 0,
        },
      }}
      tabBar={props => (
        <MyBottomTab {...props} carpoolMode={carpoolMode} readMyDriver={readMyDriver} />
      )}
      initialRouteName={initialRouteName}>
      <Tab.Screen name={ROUTE_KEY.ParkingParkTab} component={AsyncParkingParkHome} />
      <Tab.Screen name={ROUTE_KEY.CarpoolTab} component={AsyncPassengerHome} />

      <Tab.Screen name={ROUTE_KEY.CarpoolTabDriver} component={AsyncDriverHome} />

      <Tab.Screen name={ROUTE_KEY.MyProfileTab} component={AsyncMyProfile} />
    </Tab.Navigator>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  iconWrapperStyle: {
    alignItems: 'center',
    marginTop: heightScale1(10),
    marginBottom: heightScale1(5),
  },
  tabLabelStyle: {
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    fontSize: fontSize1(11),
    marginTop: heightScale1(4),
  },
  iconStyle: {
    width: widthScale1(24),
    height: widthScale1(24),
  },
});
