import {getMessaging} from '@react-native-firebase/messaging';
import {uniqBy} from 'lodash';
import React, {memo, useEffect, useState} from 'react';
import {
  Alert,
  BackHandler,
  Image,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNFS from 'react-native-fs';
import RNBootSplash from 'react-native-bootsplash';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import {FONT_FAMILY} from '~constants/enum';
import {IS_ANDROID} from '~constants/constant';
import {IS_ACTIVE} from '~constants/enum';
import {ParkingMapProps} from '~constants/types';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheUserCordinate} from '~reducers/coordinateReducer';
import {cacheDatabaseVersion} from '~reducers/termAndContionReducer';
import {cacheFCMToken} from '~reducers/userReducer';
import API from '~services/api';
import Realm from 'realm';
import {FirebaseUserSchema, ParkingSchema} from '~schemas/parking-schema';
import {
  useLazyGetDbMetaQuery,
  useLazyGetDbPagedQuery,
  useGetDatabaseVersionQuery,
  useGetVersionInfoQuery,
  useUpdateUserFCMTokenMutation,
} from '~services/userServices';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {requestNotificationPermissions} from '~utils/checkNotificationPermission';
import {getMyLocation, requestLocationPermisstion} from '~utils/getMyLocation';

const Splash = memo((props: RootStackScreenProps<'Splash'>) => {
  const {navigation} = props;
  const dispatch = useAppDispatch();
  const isFirstRun = useAppSelector(state => state?.termAndConditionReducer?.isFirstRun);
  const currentDatabaseVersion = useAppSelector(
    state => state?.termAndConditionReducer?.databaseVersion,
  );
  const myFCMToken = useAppSelector(state => state?.userReducer?.FCMToken);
  const {data: databaseVersion} = useGetDatabaseVersionQuery();
  const {data: versionInfo} = useGetVersionInfoQuery();

  const [updateUserFCMToken] = useUpdateUserFCMTokenMutation();
  const {userID} = userHook();
  const idChatRoom = useAppSelector(state => state.chatReducer.idChatRoom);

  const APP_STORE_URL = 'https://apps.apple.com/kr/app/id1129098766';
  const PLAY_STORE_URL = 'market://details?id=kr.wisemobile.parking';
  const ENABLE_PAGED_DB_SYNC = true;
  const DB_PAGE_SIZE = 10000;

  const [syncProgress, setSyncProgress] = useState(0);
  const [syncDownloaded, setSyncDownloaded] = useState(0);
  const [syncTotal, setSyncTotal] = useState(0);
  const [isSyncingDb, setIsSyncingDb] = useState(false);

  const [getDbMeta] = useLazyGetDbMetaQuery();
  const [getDbPaged] = useLazyGetDbPagedQuery();

  const checkAndUpdateVersion = async () => {
    if (!versionInfo) {
      return false;
    }
    try {
      const versionName = DeviceInfo.getVersion().replace(/\./g, '');
      const requiredVersion =
        Platform.OS === 'ios'
          ? String(versionInfo?.requiredVersionCode)
          : String(versionInfo?.versionCode);

      if (requiredVersion === '0') {
        console.log(`[Splash] ${Platform.OS} 강제 업데이트가 비활성화되었습니다.`);
        return false;
      }

      if (versionName !== requiredVersion) {
        Alert.alert(
          versionInfo?.title || '업데이트 필요',
          versionInfo?.text || '새로운 버전이 있습니다. 스토어로 이동합니다.',
          [
            {
              text: '확인',
              onPress: () => {
                Linking.openURL(Platform.OS === 'ios' ? APP_STORE_URL : PLAY_STORE_URL);
                BackHandler.exitApp();
              },
            },
          ],
          {cancelable: false},
        );
        return true;
      }
    } catch (error) {
      console.log('[Splash] 버전 검증 중 오류:', error);
    }
    return false;
  };

  const toParkingData = (items: any[]): ParkingMapProps[] =>
    uniqBy(
      items.filter((item: any) => typeof item === 'object' && 'id' in item) as ParkingMapProps[],
      'id',
    );

  const writeParkingBatch = (realm: Realm, parkingData: ParkingMapProps[]) => {
    realm.write(() => {
      parkingData?.forEach(item => {
        if (item?.garageName && item?.lat && item?.lng) {
          const existingParking = realm.objectForPrimaryKey('Parking', item.id);
          if (existingParking) {
            (Object.keys(item) as (keyof ParkingMapProps)[]).forEach(key => {
              if (key !== 'id') {
                existingParking[key] = item[key];
              }
            });
          } else {
            realm.create('Parking', {
              appVersion: item.appVersion,
              id: item.id,
              category: item.category,
              brand: item.brand,
              themeParking: item.themeParking,
              lat: item.lat,
              lng: item.lng,
              coslat: item.coslat,
              coslng: item.coslng,
              sinlat: item.sinlat,
              sinlng: item.sinlng,
              state: item.state,
              city: item.city,
              garageName: item.garageName,
              addressNew: item.addressNew,
              addressOld: item.addressOld,
              icon: item.icon,
              charge: item.charge,
              chargeOneDay: item.chargeOneDay,
              first30: item.first30,
              creditCardYN: item.creditCardYN,
              satFreeYN: item.satFreeYN,
              sunFreeYN: item.sunFreeYN,
              free30YN: item.free30YN,
              ticketPartnerYN: item.ticketPartnerYN,
              parkIntro: item.parkIntro,
              onedayTicketCost: item.onedayTicketCost,
              paylank: item.paylank,
              limitedNumber: item.limitedNumber,
              keyword: item.keyword,
              monthYN: item.monthYN,
              weekdayYN: item.weekdayYN || IS_ACTIVE.NO,
              weekendYN: item.weekendYN || IS_ACTIVE.NO,
              nightYN: item.nightYN || IS_ACTIVE.NO,
              weekdayTimeYN: item.weekdayTimeYN || IS_ACTIVE.NO,
              weekendTimeYN: item.weekendTimeYN || IS_ACTIVE.NO,
              dinnerYN: item.dinnerYN || IS_ACTIVE.NO,
              conNightYN: item.conNightYN || IS_ACTIVE.NO,
            });
          }
        }
      });
    });
  };

  const syncDataWithLegacyAPI = async (realm: Realm) => {
    const endpoint = isFirstRun ? '/db/get' : '/db/getFiltered';
    const response = await API.get(`${endpoint}?startIndex=0&limitSize=0`);
    const parkingData = toParkingData(response.data || []);
    writeParkingBatch(realm, parkingData);
    setSyncDownloaded(parkingData.length);
    setSyncTotal(parkingData.length);
    setSyncProgress(100);
  };

  const syncDataWithPagedAPI = async (realm: Realm) => {
    const type = isFirstRun ? 'all' : 'filtered';
    const meta = await getDbMeta().unwrap();
    const total = Number(type === 'all' ? meta?.total || 0 : meta?.filteredTotal || 0);
    // NOTE: 페이지 루프마다 console.log를 많이 남기면 디버그에서 체감 다운로드 시간이 늘 수 있어
    // 성능 측정을 방해하지 않도록 로그는 최소화합니다.
    const DB_PAGED_LOGS = false; // 필요 시에만 true로 바꿔서 확인하세요.
    const DB_PAGED_LOG_PAGE_SAMPLES = true; // true면 첫 페이지/마지막 페이지만 로그 남김
    const UI_UPDATE_INTERVAL_MS = 250;

    let pageIndex = 0;
    let lastUiUpdateAt = 0;
    const syncStartedAt = Date.now();

    if (DB_PAGED_LOGS) {
      console.log(
        `[Splash][Paged] start sync type=${type}, DB_PAGE_SIZE=${DB_PAGE_SIZE}, total=${total}`,
      );
    }
    setSyncTotal(total);

    if (total === 0) {
      setSyncDownloaded(0);
      setSyncProgress(100);
      return;
    }

    let downloaded = 0;
    let startIndex = 0;
    let hasNext = true;

    while (hasNext) {
      const pageRequestStartedAt = Date.now();
      const page = await getDbPaged({
        startIndex,
        limitSize: DB_PAGE_SIZE,
        type,
      }).unwrap();
      const pageResponseMs = Date.now() - pageRequestStartedAt;

      const parkingData = toParkingData(page?.items || []);
      if (parkingData.length > 0) {
        const writeStartedAt = Date.now();
        writeParkingBatch(realm, parkingData);
        // writeMs 로그는 디버그 성능 영향이 있을 수 있어 최소화합니다.
        const realmWriteMs = Date.now() - writeStartedAt;
        if (DB_PAGED_LOGS && (!DB_PAGED_LOG_PAGE_SAMPLES || pageIndex === 0 || !page?.hasNext)) {
          console.log(
            `[Splash][Paged] realm write items=${parkingData.length}, writeMs=${realmWriteMs}`,
          );
        }
      }

      downloaded += parkingData.length;
      const nextProgress = Math.min(100, Math.floor((downloaded / total) * 100));
      const now = Date.now();
      const shouldUiUpdate = now - lastUiUpdateAt >= UI_UPDATE_INTERVAL_MS || nextProgress === 100;
      if (shouldUiUpdate) {
        setSyncDownloaded(downloaded);
        setSyncProgress(nextProgress);
        lastUiUpdateAt = now;
      }

      const pageMeta = page as any;
      const requestedLimitSize = Number(pageMeta?.requestedLimitSize || 0);
      const appliedLimitSize = Number(pageMeta?.appliedLimitSize || 0);
      const limitSizeMax = Number(pageMeta?.limitSizeMax || 0);
      if (
        DB_PAGED_LOGS &&
        (!DB_PAGED_LOG_PAGE_SAMPLES || pageIndex === 0 || !page?.hasNext)
      ) {
        console.log(
          `[Splash][Paged] responseMs=${pageResponseMs}, limitSize=${page?.limitSize}, requestedLimitSize=${requestedLimitSize}, appliedLimitSize=${appliedLimitSize}, limitSizeMax=${limitSizeMax}, hasNext=${Boolean(
            page?.hasNext,
          )}, nextStartIndex=${Number(page?.nextStartIndex || 0)}, items=${parkingData.length}, downloaded=${downloaded}/${total}`,
        );
      }

      hasNext = Boolean(page?.hasNext);
      if (!hasNext) {
        // 마지막 페이지만 UI를 확정값으로 한 번 더 반영합니다.
        setSyncDownloaded(downloaded);
        setSyncProgress(Math.min(100, Math.floor((downloaded / total) * 100)));
        break;
      }

      const nextStartIndex = Number(page?.nextStartIndex || 0);
      startIndex = nextStartIndex > startIndex ? nextStartIndex : startIndex + parkingData.length;
      pageIndex += 1;
    }

    // 페이지 루프 외에 “총 소요시간” 1줄만 남겨서 A/B 비교를 쉽게 합니다.
    console.log(
      `[Splash][Paged] DONE type=${type} DB_PAGE_SIZE=${DB_PAGE_SIZE} totalMs=${Date.now() - syncStartedAt} pagesFetched=${pageIndex + 1} downloaded=${downloaded}/${total}`,
    );
  };

  const getData = async () => {
    try {
      const path = IS_ANDROID
        ? RNFS.DocumentDirectoryPath + '/image_term.png'
        : RNFS.TemporaryDirectoryPath + '/image_term.png';
      await RNFS.writeFile(path, '', 'utf8');

      const realm = await Realm.open({
        schema: [ParkingSchema, FirebaseUserSchema],
      });
      const data = realm.objects('Parking');

      if (!databaseVersion) {
        return;
      }

      if (data?.length > 0 && currentDatabaseVersion === databaseVersion) {
        console.log('[Splash] 데이터가 최신 버전입니다. 메인 화면으로 이동합니다.');
        navigateToNextScreen();
        return;
      }

      console.log('[Splash] 새로운 데이터가 필요합니다. 다운로드를 시작합니다.');
      setIsSyncingDb(true);
      setSyncProgress(0);
      setSyncDownloaded(0);
      setSyncTotal(0);

      try {
        if (ENABLE_PAGED_DB_SYNC) {
          await syncDataWithPagedAPI(realm);
        } else {
          await syncDataWithLegacyAPI(realm);
        }
      } catch (pagedError) {
        console.log('[Splash] Paged sync 실패, legacy API로 fallback:', pagedError);
        await syncDataWithLegacyAPI(realm);
      }

      console.log('[Splash] 데이터 저장 완료. 현재 Parking 데이터 수:', realm.objects('Parking').length);
      dispatch(cacheDatabaseVersion(databaseVersion));
      navigateToNextScreen();
    } catch (error) {
      console.log('[Splash] getData 처리 중 심각한 오류:', error);
      Alert.alert('오류', '데이터를 처리하는 중 문제가 발생했습니다. 앱을 다시 시작해주세요.');
    } finally {
      setIsSyncingDb(false);
    }
  };

  const navigateToNextScreen = () => {
    setTimeout(() => {
      if (isFirstRun) {
        navigation.navigate(ROUTE_KEY.TutorialSlider);
      } else {
        if (!idChatRoom) {
          navigation.replace(ROUTE_KEY.ParkingParkHome);
        }
      }
      // listenerDeepLink(); // 👈 이 줄을 완전히 삭제합니다.
    }, 2000);
  };

  // 위치 권한 재시도 함수 (실수로 거부했을 때 한 번 더 안내 후 재요청)
  // - requestLocationPermisstion 자체가 idempotent (이미 granted면 즉시 resolve)
  // - useEffect가 deps 변경으로 재실행되어도 재호출되지만 프롬프트가 중복으로 뜨지는 않음
  const ensureLocationPermission = async (attempt = 0): Promise<boolean> => {
    try {
      await requestLocationPermisstion();
      return true;
    } catch (_err) {
      if (attempt === 0) {
        return new Promise<boolean>(resolve => {
          Alert.alert(
            '위치 권한이 필요합니다',
            '파킹박은 현재 위치를 기반으로 주변 주차장을 찾아줍니다.\n위치 권한을 허용해 주세요.',
            [
              {
                text: '허용하기',
                onPress: async () => {
                  const granted = await ensureLocationPermission(attempt + 1);
                  resolve(granted);
                },
              },
            ],
            {cancelable: false},
          );
        });
      }
      return false;
    }
  };

  // 🚩 [이전 버전과 동일한 단일 useEffect 구조] 아래 한 가지만 추가되었습니다.
  //   - 위치 권한 거부 시 한 번 더 자동 재요청 (ensureLocationPermission)
  //
  // 이전엔 가드(hasRequestedPermissionsRef)를 써서 권한을 1회만 실행하도록 했으나,
  // deps 변경으로 useEffect가 재실행될 때 가드만 true면 권한 블록을 스킵하고
  // 바로 DB 로딩 → 네비게이션이 되어버려, 첫 번째 실행에서 사용자가 알림 프롬프트에
  // 응답하는 동안 "위치 프롬프트가 뜨지도 못한 채 화면 전환"되는 레이스가 생겼습니다.
  // 이전 버전처럼 권한 함수들을 매 재실행마다 호출해도, 이미 granted면 즉시 반환되어
  // idempotent 하게 동작하므로 안전합니다.
  useEffect(() => {
    const initApp = async () => {
      try {
        // --- 1. 위치 권한 (재시도 포함) ---
        const locationGranted = await ensureLocationPermission();
        if (locationGranted) {
          try {
            const location = await getMyLocation();
            if (location) {
              dispatch(cacheUserCordinate(location));
            }
          } catch (geoError) {
            console.log('[Splash] getMyLocation failed:', geoError);
          }
        }

        // --- 2. 알림 권한 & FCM 토큰 ---
        try {
          if (!myFCMToken && !DeviceInfo.isEmulatorSync()) {
            await requestNotificationPermissions();
            const token = await getMessaging().getToken();
            if (token) {
              dispatch(cacheFCMToken(token));
              if (userID) {
                await updateUserFCMToken({fcmToken: token, memberId: String(userID)});
              }
            }
          }
        } catch (permissionError) {
          console.log('[Splash] Notification permission was denied or failed:', permissionError);
        }

        // --- 3. 버전/데이터 확인 전 스플래시 숨기기 ---
        RNBootSplash.hide();

        // --- 4. 버전 체크 및 데이터 로딩 ---
        if (!databaseVersion || !versionInfo) {
          return;
        }

        const shouldBlock = await checkAndUpdateVersion();
        if (shouldBlock) {
          return;
        }

        await getData();
      } catch (error) {
        console.error('[Splash] 앱 초기화 중 심각한 오류 발생:', error);
        RNBootSplash.hide();
        Alert.alert(
          '앱 실행 오류',
          '앱을 시작하는 중 문제가 발생했습니다. 앱을 다시 시작해주세요.',
          [{text: '확인', onPress: () => BackHandler.exitApp()}],
        );
      }
    };

    initApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [databaseVersion, versionInfo, myFCMToken, userID]);

  // 💡 FCM 토큰 갱신 리스너만 담당하는 새로운 useEffect 훅 추가
  useEffect(() => {
    if (userID) {
      // 로그인 상태일 때만 리스너를 설정
      const onTokenRefreshListener = getMessaging().onTokenRefresh(async token => {
        console.log('FCM Token was refreshed:', token);
        dispatch(cacheFCMToken(token));
        await updateUserFCMToken({fcmToken: token, memberId: String(userID)});
      });

      return () => onTokenRefreshListener(); // 리스너 정리
    }
  }, [userID]); // userID가 변경될 때마다 실행

  return (
    <FixedContainer edges={['left', 'right']} style={styles.container}>
      <StatusBar translucent backgroundColor={colors.transparent} />
      <Image
        source={require('~icons/icon_app_transparent.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      {isSyncingDb ? (
        <View style={styles.syncOverlay}>
          <CustomText
            string={
              isFirstRun
                ? '주차장 정보를 다운로드 중입니다.\n(최초 실행 시에만 전체 데이터를 받습니다.)'
                : '주차장 정보를 업데이트 중입니다.'
            }
            color={colors.white}
            family={FONT_FAMILY.SEMI_BOLD}
          />
          <CustomText
            string={`${syncProgress}% (${syncDownloaded}/${syncTotal || 0})`}
            color={colors.white}
            textStyle={styles.progressText}
          />
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, {width: `${syncProgress}%`}]} />
          </View>
        </View>
      ) : null}
    </FixedContainer>
  );
});

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  syncOverlay: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 140,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  progressText: {
    marginTop: 6,
  },
  progressBarTrack: {
    marginTop: 10,
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ff4d6d',
  },
});
