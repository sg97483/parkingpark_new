import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useRef, useState} from 'react';
import {Image, ImageSourcePropType, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {IMAGES} from '~/assets/images-path';
import ConnectedCarPopup, {RefObject} from '~components/connected-car-popup';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import TextValue from '~components/vehicle-number/text-value';
import {URL_GENESIS, URL_HYUNDAI, URL_KID} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useLazyRequestConnectedCarInfoQuery} from '~services/parkingServices';
import {useAppSelector} from '~store/storeHooks';
import {heightScale, widthScale} from '~styles/scaling-utils';

const VehicleNumber = (props: RootStackScreenProps<'VehicleNumber'>) => {
  const {navigation} = props;

  const user = useAppSelector(state => state?.userReducer?.user);
  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const connectedCarPopupRef = useRef<RefObject>(null);

  const [connectedCarBtnDisable, setConnectedCarBtnDisable] = useState<boolean>(false);

  const [requestConnectedCarInfo] = useLazyRequestConnectedCarInfoQuery();

  useFocusEffect(
    useCallback(() => {
      if (!userToken?.id || !userToken?.password) {
        navigation.navigate(ROUTE_KEY.Login);
      } else {
        requestConnectedCarInfo({
          memberId: userToken?.id,
        })
          .unwrap()
          .then(res => {
            let mConnectedCarInfo: any;
            res?.forEach(item => {
              if (item?.connectedCompany === user?.carCompany) {
                mConnectedCarInfo = item;
                return;
              }
            });
            let isConnected = mConnectedCarInfo?.isConnected;
            let isAgree = mConnectedCarInfo?.isAgree;

            if (isConnected && isAgree) {
              setConnectedCarBtnDisable(true);
            }
          });
      }
    }, []),
  );

  const onPressDetailHyundai = () => {
    const mmid = userToken.id;
    let url = '';
    let request = 0;
    if (user?.carCompany === '현대') {
      url = URL_HYUNDAI + mmid;
      request = 100;
    } else if (user?.carCompany === '기아') {
      url = URL_KID + mmid;
      request = 101;
    } else if (user?.carCompany === '제네시스') {
      url = URL_GENESIS + mmid;
      request = 102;
    }
    connectedCarPopupRef.current?.setDataProps(url, request);
  };

  const getConnectedCarCompany = (): {
    imageSource: ImageSourcePropType;
    title: string;
  } | null => {
    switch (user?.carCompany) {
      case strings?.vehicle_number?.hyundai:
        return {
          imageSource: IMAGES.hyundai_logo,
          title: strings?.vehicle_number?.hyundai,
        };
      case strings?.vehicle_number?.kia:
        return {
          imageSource: IMAGES.kia_logo,
          title: strings?.vehicle_number?.kia,
        };
      case strings?.vehicle_number?.genesis:
        return {
          imageSource: IMAGES.genesis_logo,
          title: strings?.vehicle_number?.genesis,
        };
      default:
        return null;
    }
  };

  return (
    <FixedContainer>
      <CustomHeader text={strings.vehicle_number.title} />
      <TextValue textTitle={strings.vehicle_number.title1} textValue={user?.carNumber} />
      <TextValue textTitle={strings.vehicle_number.title2} textValue={user?.carModel} />
      <TextValue textTitle={strings.vehicle_number.title3} textValue={user?.carColor} />
      <TextValue textTitle={strings.vehicle_number.title4} textValue={user?.carYear} />
      <TextValue textTitle={strings.vehicle_number.title5} textValue={user?.carCompany} />

      {getConnectedCarCompany() ? (
        <TextValue
          textTitle={strings.vehicle_number.title7}
          valueComponent={
            <TouchableOpacity onPress={onPressDetailHyundai} style={styles.viewButtonHyundai}>
              <Image
                source={getConnectedCarCompany()?.imageSource}
                style={styles.imgLogo}
                resizeMode={FastImage.resizeMode.contain}
              />
              <CustomText
                string={getConnectedCarCompany()?.title || ''}
                family={FONT_FAMILY.BOLD}
                size={FONT.CAPTION_4}
              />
            </TouchableOpacity>
          }
        />
      ) : null}

      <TextValue
        textTitle={strings.vehicle_number.title6}
        onPressNext={() => {
          navigation.navigate(ROUTE_KEY.VehicleNumberManagement);
        }}
      />
      <ConnectedCarPopup ref={connectedCarPopupRef} />
    </FixedContainer>
  );
};

export default VehicleNumber;

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    marginLeft: -widthScale(40),
  },
  viewButtonHyundai: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgLogo: {
    width: widthScale(50),
    height: heightScale(30),
  },
});
