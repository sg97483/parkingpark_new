import {DrawerActions, useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Alert, FlatList, Image, Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {ICONS} from '~/assets/images-path';
import Divider from '~components/divider';
import SocialNetwork from '~components/drawer/social-network';
import FixedContainer from '~components/fixed-container';
import ImageMenu from '~components/image-menu';
import {PADDING, PADDING_HEIGHT} from '~constants/constant';
import {strings} from '~constants/strings';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useGetListCouponQuery} from '~services/couponServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {checkNotificationPermission} from '~utils/checkNotificationPermission';
import DrawerFooter from './drawer-footer';
import ResourcesInfo from './resources-info';
import UserInfo from './user-info';

const DrawerContent: React.FC = memo(() => {
  const navigation = useNavigation<UseRootStackNavigation>();

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const {data: couponData} = useGetListCouponQuery({
    id: userToken?.id,
    pass: userToken?.password,
  });

  const drawerContent = [
    {
      name: strings.drawer.carpool,
      icon: ICONS.carpool,
      onPress: () => {
        if (!userToken?.id || !userToken?.password) {
          navigation.navigate(ROUTE_KEY.Login);
          showMessage({
            message: strings?.general_text?.login_first,
          });
          return;
        }
        navigation.navigate(ROUTE_KEY.CarpoolTab as any);
      },
    },
    {
      name: strings.drawer.airport,
      icon: ICONS.airport,
      onPress: () => navigation.navigate(ROUTE_KEY.AirportParking),
    },
    {
      name: strings.drawer.monthly_direct,
      icon: ICONS.monthly_direct,
      onPress: () => navigation.navigate(ROUTE_KEY.MonthlyParkingDirectMain),
    },
    {
      name: strings.drawer.valet_parking,
      icon: ICONS.valet_parking,
      onPress: () => navigation.navigate(ROUTE_KEY.ValetParkingAtIncheon),
    },
    {
      name: strings.drawer.parking_share,
      icon: ICONS.parking_share,
      onPress: () => {
        if (!userToken?.id || !userToken?.password) {
          navigation.navigate(ROUTE_KEY.Login);
          showMessage({
            message: strings?.general_text?.login_first,
          });
          return;
        }
        navigation.navigate(ROUTE_KEY.RegisterParkingShared);
      },
    },
    {
      name: strings.drawer.favorite,
      icon: ICONS.favorite,
      onPress: () => navigation.navigate(ROUTE_KEY.Favorites),
    },
    {
      name: strings.drawer.parking_alarm,
      icon: ICONS.parking_alarm,
      onPress: () => {
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
      },
    },
    {
      name: strings.drawer.take_parking_photo,
      icon: ICONS.take_parking_photo,
      onPress: () => {
        navigation.navigate(ROUTE_KEY.TakePhotoParkingLot);
      },
    },
    {
      name: strings.drawer.user_guide,
      icon: ICONS.user_guide,
      onPress: () => {
        navigation.navigate(ROUTE_KEY.TutorialSlider, {fromHome: true});
      },
    },
    {
      name: strings.drawer.contact_us,
      icon: ICONS.contact_us,
      onPress: () => navigation.navigate(ROUTE_KEY.ContactUs),
    },
    {
      name: strings.drawer.event_banner,
      icon: ICONS.contact_us,
      onPress: () => navigation.navigate(ROUTE_KEY.EventBanner),
    },
    {
      name: strings.drawer.event_game,
      icon: ICONS.user_guide,
      onPress: () => navigation.navigate(ROUTE_KEY.EventGame),
    },
  ];

  const renderItem = ({item, index}: {item: any; index: number}) => {
    return (
      <ImageMenu
        children={item?.children}
        key={index}
        disabled={item?.disabled}
        icon={item.icon}
        name={item.name}
        iconStyle={{
          tintColor: index === 1 ? undefined : colors.red,
        }}
        onPress={item?.onPress as any}
      />
    );
  };

  const renderHeaderDrawer = () => {
    return (
      <View>
        <UserInfo />

        <ResourcesInfo couponData={couponData || []} />

        <Divider style={{marginBottom: PADDING / 2}} />
      </View>
    );
  };

  const renderFooterDrawer = () => {
    return (
      <View>
        <Divider style={{marginTop: PADDING / 2}} />

        <DrawerFooter />

        <SocialNetwork />
      </View>
    );
  };

  return (
    <FixedContainer edges={['top']} style={{paddingHorizontal: PADDING / 2}}>
      <TouchableOpacity
        onPress={() => {
          navigation.dispatch(DrawerActions.closeDrawer());
        }}
        style={styles.closeButton}>
        <Image source={ICONS.close} style={styles.closeIconInner} />
      </TouchableOpacity>

      <FlatList
        numColumns={2}
        data={drawerContent}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeaderDrawer}
        ListFooterComponent={renderFooterDrawer}
        contentContainerStyle={{paddingBottom: PADDING_HEIGHT / 2}}
      />
    </FixedContainer>
  );
});

export default DrawerContent;

const styles = StyleSheet.create({
  closeButton: {
    alignSelf: 'flex-end',
    marginTop: PADDING_HEIGHT / 2,
    marginBottom: heightScale(5),
    marginRight: PADDING / 2,
  },
  closeIconInner: {
    width: widthScale(20),
    height: heightScale(20),
    tintColor: colors.black,
  },
  content: {
    marginTop: PADDING / 2,
  },
});
