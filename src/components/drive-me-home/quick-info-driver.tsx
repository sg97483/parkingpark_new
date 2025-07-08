import {BottomSheetModal, BottomSheetView, useBottomSheetModal} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import React, {forwardRef, useCallback, useImperativeHandle, useRef, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PageButton from '~components/commons/page-button';
import CustomBackdrop from '~components/custom-backdrop';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {IS_ANDROID, PADDING1} from '~constants/constant';
import {DriverRoadDayModel} from '~model/driver-model';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import QuickInfoDriverItem from './quick-info-driver-item';
import {showMessage} from 'react-native-flash-message';

export interface QuickDriverInfoRefs {
  show: (listRoute: DriverRoadDayModel[]) => void;
}

const QuickDriverInfo = forwardRef((_, ref) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const navigation = useNavigation<UseRootStackNavigation>();
  const insets = useSafeAreaInsets();
  const {height} = Dimensions.get('window');
  const {dismissAll: closeAllModal} = useBottomSheetModal();

  const [selectedDriver, setSelectedDriver] = useState<DriverRoadDayModel[]>([]);

  const show = useCallback((listRoute: DriverRoadDayModel[]) => {
    setSelectedDriver(listRoute);
    bottomSheetRef?.current?.present();
  }, []);

  const hide = useCallback(() => {
    closeAllModal();
    setSelectedDriver([]);
    bottomSheetRef?.current?.close();
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      show,
      hide,
    }),
    [show, hide],
  );

  const renderBackdrop = useCallback(
    (props: any) => <CustomBackdrop {...props} onPressBackdrop={hide} />,
    [],
  );

  const renderItem = useCallback(
    ({item}: {item: DriverRoadDayModel}) => {
      return (
        <QuickInfoDriverItem
          item={item}
          onPress={() => {
            console.log('item ne', item?.endPlace);
            if (item?.endPlace) {
              hide();
              navigation.navigate(ROUTE_KEY.RouteRequestRegistrationDetail, {
                routeInfo: item,
              });
            } else {
              hide();
              showMessage({
                message: '유효하지 않은 경로입니다. 다른 경로를 요청해주세요.',
              });
            }
          }}
        />
      );
    },
    [navigation],
  );

  return (
    <BottomSheetModal
      backdropComponent={renderBackdrop}
      ref={bottomSheetRef}
      enablePanDownToClose
      enableDynamicSizing
      handleComponent={() => null}
      index={0}
      maxDynamicContentSize={IS_ANDROID ? height - PADDING1 : height - insets.top - PADDING1}>
      <BottomSheetView>
        <View style={styles.handleIndicatorStyle} />

        {selectedDriver?.length > 1 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              gap: heightScale1(30),
              paddingBottom: IS_ANDROID ? PADDING1 / 2 : insets.bottom + PADDING1 / 2,
            }}
            data={selectedDriver}
            renderItem={renderItem}
            ListFooterComponent={() => (
              <PaddingHorizontalWrapper
                forDriveMe
                containerStyles={
                  selectedDriver?.length > 3 ? {marginBottom: heightScale1(30)} : {}
                }>
                <PageButton
                  text="대표 경로 확인하고 원하는 날짜 운행 요청하기"
                  onPress={() => {
                    hide();
                    navigation.navigate(ROUTE_KEY.RepresentativeRouteOfDriver, {
                      driverID: selectedDriver[0]?.memberId
                        ? selectedDriver[0]?.memberId
                        : selectedDriver[0]?.c_memberId,
                    });
                  }}
                />
              </PaddingHorizontalWrapper>
            )}
          />
        ) : (
          <View
            style={{
              marginBottom: IS_ANDROID ? PADDING1 / 2 : insets.bottom + PADDING1 / 2,
            }}>
            <QuickInfoDriverItem
              item={selectedDriver[0]}
              onPress={() => {
                if (selectedDriver[0]?.endPlace) {
                  hide();
                  navigation.navigate(ROUTE_KEY.RouteRequestRegistrationDetail, {
                    routeInfo: selectedDriver[0],
                  });
                } else {
                  hide();
                  showMessage({
                    message: '유효하지 않은 경로입니다. 다른 경로를 요청해주세요.',
                  });
                }
              }}
            />
            {selectedDriver[0]?.selectDay ? (
              <PaddingHorizontalWrapper containerStyles={{marginTop: heightScale1(30)}} forDriveMe>
                <PageButton
                  text="대표 경로 확인하고 원하는 날짜 운행 요청하기"
                  onPress={() => {
                    hide();
                    navigation.navigate(ROUTE_KEY.RepresentativeRouteOfDriver, {
                      driverID: selectedDriver[0]?.memberId
                        ? selectedDriver[0]?.memberId
                        : selectedDriver[0]?.c_memberId,
                    });
                  }}
                />
              </PaddingHorizontalWrapper>
            ) : null}
          </View>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default React.memo(QuickDriverInfo);

const styles = StyleSheet.create({
  favoriteButton: {
    marginLeft: 'auto',
  },
  handleIndicatorStyle: {
    width: widthScale1(40),
    height: heightScale1(5),
    alignSelf: 'center',
    marginTop: heightScale1(10),
    marginBottom: heightScale1(16),
    borderRadius: 999,
    backgroundColor: colors.disableButton,
    // paddingBottom: 20,
  },
});
