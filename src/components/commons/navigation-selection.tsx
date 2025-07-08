import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {forwardRef, useCallback, useImperativeHandle, useRef} from 'react';
import {Linking, Pressable, StyleSheet, NativeModules, Alert} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomBackdrop from '~components/custom-backdrop';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {IS_ANDROID, PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {showLocation} from 'react-native-map-link';

const {MyNavigationModule} = NativeModules;

export interface NavigationSelectionModalRefs {
  show: () => void;
}

interface Props {
  arriveAdressName: string;
  arriveCoord: {
    lat: number | undefined;
    long: number | undefined;
  };
}

const NavigationSelectionModal = forwardRef((props: Props, ref) => {
  const {arriveAdressName, arriveCoord} = props;
  const {lat, long} = arriveCoord;
  const modalRef = useRef<BottomSheetModal>(null);
  const {user: userInfo, myLocation} = userHook();

  const show = useCallback(() => {
    modalRef?.current?.present();
  }, []);

  const hide = useCallback(() => {
    modalRef?.current?.close();
  }, []);

  useImperativeHandle(ref, () => ({show}), []);

  const handleHyundaiNavigation = async () => {
    const url = `mbluelink://sendtocar?lat=${lat}&lon=${long}&address=${arriveAdressName}`;

    const canOpenHyundai = await Linking.canOpenURL(url);

    if (canOpenHyundai) {
      Linking.openURL(url);
    } else {
      const installLink = IS_ANDROID
        ? 'https://play.google.com/store/apps/details?id=com.velox.hkmc_tm1k&hl=vi&gl=US'
        : 'https://apps.apple.com/kr/app/현대-블루링크/id517617572';
      Linking.openURL(installLink);
    }
  };

  const handleKiaNavigation = async () => {
    const url = `muvo://sendtocar?lat=${lat}&lon=${long}&address=${arriveAdressName}`;

    const canOpenKia = await Linking.canOpenURL(url);
    console.log(
      '🚀 ~ file: navigation-selection.tsx:66 ~ handleKiaNavigation ~ canOpenKia:',
      canOpenKia,
    );

    if (canOpenKia) {
      Linking.openURL(url);
    } else {
      const installLink = IS_ANDROID
        ? 'https://play.google.com/store/apps/details?id=com.ubivelox.uvophone&hl=vi&gl=US'
        : 'https://apps.apple.com/in/app/kia-connect/id1476228232';
      Linking.openURL(installLink);
    }
  };

  const handleGenesisNavigation = async () => {
    const url = `mgenesis://sendtocar?lat=${lat}&lon=${long}&address=${arriveAdressName}`;

    const canOpenGenesis = await Linking.canOpenURL(url);

    if (canOpenGenesis) {
      Linking.openURL(url);
    } else {
      const installLink = IS_ANDROID
        ? 'https://play.google.com/store/apps/details?id=com.obigo.genesis&hl=vi&gl=US'
        : 'https://apps.apple.com/kr/app/제네시스-커넥티드-서비스/id1272422144';
      Linking.openURL(installLink);
    }
  };

  const handleTMapNavigation = () => {
    // props로 받은 목적지 좌표와 이름을 사용합니다.
    const {lat, long} = arriveCoord;
    const destinationName = arriveAdressName;

    // 목적지 좌표가 유효한지 먼저 확인합니다.
    if (lat === undefined || long === undefined) {
      Alert.alert('좌표 오류', '목적지 좌표가 올바르지 않습니다.');
      return;
    }

    showLocation({
      latitude: lat,
      longitude: long,
      title: destinationName,
      app: 'tmap', // 다른 앱을 묻지 않고 바로 T-map 실행
    }).catch(error => {
      // T-map 실행에 실패했거나 앱이 설치되지 않은 경우
      Alert.alert('T-map 실행 오류', 'T-map 앱이 설치되어 있는지 확인해주세요.');
      console.error(error);
    });
  };

  const handleAtlanNavigation = () => {
    if (IS_ANDROID) {
      MyNavigationModule.isAppInstall('kr.mappers.AtlanSmart').then((isInstalled: boolean) => {
        if (isInstalled) {
          MyNavigationModule.navigationWithAtlan(arriveAdressName, lat, long);
        } else {
          const installLink = IS_ANDROID
            ? 'https://play.google.com/store/apps/details?id=kr.mappers.AtlanSmart'
            : 'https://apps.apple.com/us/app/kakaomap-korea-no-1-map/id304608425';
          Linking.openURL(installLink);
        }
      });
    }
  };

  const handleMappyNavigation = async () => {
    const url = `http://hmns.kr/?M-latitude=${lat}&longitude=${long}&from=kr.wisemobile.parking&auth=WPA9-R135-P115-1940`;

    const canOpenMappy = await Linking.canOpenURL(url);

    if (canOpenMappy) {
      Linking.openURL(url);
    } else {
      const installLink = IS_ANDROID
        ? 'https://play.google.com/store/apps/details?id=com.mnsoft.mappyobn&hl=vi&gl=US'
        : 'https://apps.apple.com/kr/app/맵피-내비게이션/id907415760';
      Linking.openURL(installLink);
    }
  };

  const handleKakaoNavigation = async () => {
    const urlKakao = `kakaomap://route?sp=${myLocation?.lat},${myLocation?.long}&ep=${lat},${long}&by=CAR`;
    const isOpenableKakao = await Linking.canOpenURL(urlKakao);

    if (isOpenableKakao) {
      Linking.openURL(urlKakao);
    } else {
      const installLink = IS_ANDROID
        ? 'https://play.google.com/store/apps/details?id=net.daum.android.map'
        : 'https://apps.apple.com/us/app/kakaomap-korea-no-1-map/id304608425';
      Linking.openURL(installLink);
    }
  };

  const handleNaviNavigation = async () => {
    const oneNaviURL = `ollehnavi://ollehnavi.kt.com/navigation.req?method=routeguide&start=(${myLocation?.lat}, ${myLocation?.long})&end=(${lat}, ${long})`;
    const isOpenableOneNavi = await Linking.canOpenURL(oneNaviURL);

    if (isOpenableOneNavi) {
      Linking.openURL(oneNaviURL);
    } else {
      const installLink = IS_ANDROID
        ? 'https://play.google.com/store/apps/details?id=kt.navi&hl=vi&gl=US'
        : 'https://apps.apple.com/us/app/원내비-for-everyone/id390369834';
      Linking.openURL(installLink);
    }
  };

  return (
    <BottomSheetModal
      ref={modalRef}
      backdropComponent={props => <CustomBackdrop {...props} onPressBackdrop={hide} />}
      enableDynamicSizing
      handleComponent={() => null}
      enablePanDownToClose
      index={0}>
      <BottomSheetView style={styles.containerStyle}>
        <CustomText
          forDriveMe
          size={FONT.CAPTION_7}
          family={FONT_FAMILY.SEMI_BOLD}
          string="네비게이션을 선택해주세요."
          textStyle={styles.headerTextStyle}
        />

        <BottomSheetView style={styles.contentContainerStyle}>
          {/*{userInfo?.carCompany === '현대' ? (
            <Pressable onPress={handleHyundaiNavigation}>
              <HStack style={styles.menuStyle}>
                <Icons.Huyndai />
                <CustomText
                  textStyle={styles.menuTextStyle}
                  string="목적지전송 (현대 커넥티드카연동)"
                />
              </HStack>
            </Pressable>
          ) : null}

          {userInfo?.carCompany === '기아' ? (
            <Pressable onPress={handleKiaNavigation}>
              <HStack style={styles.menuStyle}>
                <Icons.KIA />
                <CustomText
                  textStyle={styles.menuTextStyle}
                  string="목적지전송 (기아 커넥티드카연동)"
                />
              </HStack>
            </Pressable>
          ) : null}

          {userInfo?.carCompany === '제네시스' ? (
            <Pressable onPress={handleGenesisNavigation}>
              <HStack style={styles.menuStyle}>
                <Icons.Genesis />
                <CustomText
                  textStyle={styles.menuTextStyle}
                  string="목적지전송 (제네시스 커넥티드카연동)"
                />
              </HStack>
            </Pressable>
          ) : null}*/}

          <Pressable onPress={handleTMapNavigation}>
            <HStack style={styles.menuStyle}>
              <Icons.TMap />
              <CustomText textStyle={styles.menuTextStyle} string="티맵" />
            </HStack>
          </Pressable>

          <Pressable onPress={handleKakaoNavigation}>
            <HStack style={styles.menuStyle}>
              <Icons.KakaoNav />
              <CustomText textStyle={styles.menuTextStyle} string="카카오내비" />
            </HStack>
          </Pressable>

          <Pressable onPress={handleMappyNavigation}>
            <HStack style={styles.menuStyle}>
              <Icons.Mappy />
              <CustomText textStyle={styles.menuTextStyle} string="맵피" />
            </HStack>
          </Pressable>

          <Pressable onPress={handleNaviNavigation}>
            <HStack style={styles.menuStyle}>
              <Icons.Wonnaebi />
              <CustomText textStyle={styles.menuTextStyle} string="원내비" />
            </HStack>
          </Pressable>

          <Pressable onPress={handleAtlanNavigation}>
            <HStack style={styles.menuStyle}>
              <Icons.Atlan3D />
              <CustomText textStyle={styles.menuTextStyle} string="아틀란 3D" />
            </HStack>
          </Pressable>
        </BottomSheetView>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default NavigationSelectionModal;

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: PADDING1,
    paddingTop: PADDING1,
    paddingBottom: heightScale1(80),
    minHeight: heightScale1(400),
  },
  headerTextStyle: {
    textAlign: 'center',
    marginBottom: heightScale1(35),
  },
  contentContainerStyle: {
    gap: heightScale1(28),
    paddingBottom: heightScale1(120),
  },
  menuStyle: {
    gap: widthScale1(10),
  },
  menuTextStyle: {
    fontSize: fontSize1(16),
    fontFamily: FONT_FAMILY.MEDIUM,
    color: colors.black,
  },
});
