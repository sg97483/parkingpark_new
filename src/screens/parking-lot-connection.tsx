import {Image, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {RootStackScreenProps} from '~navigators/stack';
import {useAppSelector} from '~store/storeHooks';
import {RootState} from '~store/store';
import {ROUTE_KEY} from '~navigators/router';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {IMAGES, ICONS} from '~/assets/images-path';
import FixedContainer from '~components/fixed-container';
import {URL_CARPOOL_GUIDE} from '~constants/constant';
import {useReadMyCMemberMutation} from '~services/userServices';
import Spinner from '~components/spinner';

const ParkingLotConnection = (props: RootStackScreenProps<'ParkingLotConnection'>) => {
  const {navigation, route} = props;
  const userToken = useAppSelector((state: RootState) => state?.userReducer?.userToken);

  const [readMyCMember] = useReadMyCMemberMutation();

  const onPressApplyForPassengers = () => {
    if (userToken?.id && userToken?.password) {
      Spinner.show();
      readMyCMember({
        memberId: userToken?.id?.toString()!,
      })
        .unwrap()
        .then(res => {
          if (res) {
            if (res?.memberId == userToken?.id && res?.termsYN == 'Y') {
              // intent.putExtra("event", false)
              // intent.putExtra("getid", cMemberId.text.toString())
              // intent.putExtra("bcImageUrl", cBcImageUrl.text.toString())
              // intent.putExtra("vaccineImageUrl", cVaccineImageUrl.text.toString())

              navigation.replace(ROUTE_KEY.SettingPassengerActivity);
            } else {
              navigation.replace(ROUTE_KEY.DiverAgreeActivity);
            }
          } else {
            navigation.replace(ROUTE_KEY.DiverAgreeActivity);
          }
          Spinner.hide();
        });
    }
  };

  const onPressPartnerList = async () => {
    const supported = await Linking.canOpenURL(URL_CARPOOL_GUIDE);
    if (supported) {
      await Linking.openURL(URL_CARPOOL_GUIDE);
    }
  };
  const onPressSetting = () => {
    navigation.replace(ROUTE_KEY.CarSetting);
  };

  return (
    <FixedContainer>
      <View style={styles.container}>
        <FastImage source={IMAGES.driver_event_image16} style={styles.backgroundImage} />

        <TouchableOpacity style={styles.exitButton} onPress={navigation.goBack}>
          <Image source={ICONS.btn_exit_gray} resizeMode={FastImage.resizeMode.contain} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onPressPartnerList} style={styles.guidButton}>
          <Image
            style={{
              width: widthScale(200),
              height: heightScale(50),
            }}
            source={IMAGES.btn_guid}
            resizeMode={FastImage.resizeMode.contain}
          />
        </TouchableOpacity>

        <View style={styles.buttonsContainer}>
          <Text style={styles.cMemberId} />
          <Text style={styles.cVaccineImageUrl} />
          <Text style={styles.cBcImageUrl} />

          <TouchableOpacity onPress={onPressApplyForPassengers} style={styles.applyButton}>
            <Text style={styles.applyButtonText}>탑승객 신청하기</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onPressSetting} style={styles.driverButton}>
            <Text style={styles.driverButtonText}>드라이버 신청하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </FixedContainer>
  );
};

export default ParkingLotConnection;

const styles = StyleSheet.create({
  img: {
    flex: 1,
    backgroundColor: colors.black,
  },
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  exitButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  exitButtonImage: {
    width: 20,
    height: 20,
  },
  guidButton: {
    position: 'absolute',
    top: heightScale(436),
    right: widthScale(104),
    width: widthScale(200),
    height: heightScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: heightScale(10),
  },
  guidButtonText: {
    fontSize: heightScale(16),
    color: colors.white,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  cMemberId: {
    display: 'none',
  },
  cVaccineImageUrl: {
    display: 'none',
  },
  cBcImageUrl: {
    display: 'none',
  },
  applyButton: {
    flex: 1,
    height: heightScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 3,
  },
  applyButtonText: {
    fontSize: heightScale(17),
    color: colors.redButton,
  },
  driverButton: {
    flex: 1,
    height: heightScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.redButton,
    padding: 3,
  },
  driverButtonText: {
    fontSize: heightScale(17),
    color: colors.white,
  },
});
