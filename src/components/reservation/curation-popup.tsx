import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import {colors} from '~styles/colors';
import {PADDING, width} from '~constants/constant';
import CustomText from '~components/custom-text';
import {FONT_FAMILY} from '~constants/enum';
import {useRequestGetParkLinkInfoQuery} from '~services/reservationServices';
import {useAppSelector} from '~store/storeHooks';
import CurationItem from './curation-item';
import {UseRootStackNavigation} from '~navigators/stack';
import {useNavigation} from '@react-navigation/native';
import {ROUTE_KEY} from '~navigators/router';

export interface CurationPopupRefs {
  show: (title: string, body: string, parkingID: number) => void;
}

const CurationPopup = forwardRef((_, ref) => {
  const userToken = useAppSelector(state => state?.userReducer?.userToken);
  const navigation: UseRootStackNavigation = useNavigation();

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [parkingID, setParkingID] = useState<number | null>(null);

  const {data} = useRequestGetParkLinkInfoQuery(
    {
      memberId: userToken?.id,
      memberPwd: userToken?.password,
      parkingLotId: parkingID as number,
    },
    {
      skip: !parkingID,
    },
  );

  const show = (title: string, body: string, parkingID: number) => {
    setTitle(title);
    setBody(body);
    setParkingID(parkingID);
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
  };

  useImperativeHandle(
    ref,
    () => ({
      show,
    }),
    [],
  );

  return (
    <ReactNativeModal
      onBackButtonPress={hide}
      onBackdropPress={hide}
      isVisible={isVisible}
      useNativeDriver>
      <View style={styles.container}>
        <CustomText string={title} family={FONT_FAMILY.BOLD} color={colors.red} />

        <CustomText
          string={body}
          textStyle={{
            textAlign: 'center',
            marginVertical: PADDING,
          }}
        />

        {data?.gExp1 ? (
          <CustomText
            string="다른 조건을 가진 주차장 둘러보기"
            color={colors.blue}
            textStyle={{
              marginBottom: PADDING,
            }}
          />
        ) : null}

        {data?.gExp1 && data?.gId1 && data?.gMoney1 && data?.gName1 ? (
          <CurationItem
            parkingExp={data?.gExp1}
            parkingMoney={data?.gMoney1}
            parkingName={data?.gName1}
            onItemPress={() => {
              hide();
              navigation.navigate(ROUTE_KEY.ParkingDetails, {
                id: Number(data?.gId1),
              });
            }}
          />
        ) : null}

        {data?.gExp2 && data?.gId2 && data?.gMoney2 && data?.gName2 ? (
          <CurationItem
            parkingExp={data?.gExp2}
            parkingMoney={data?.gMoney2}
            parkingName={data?.gName2}
            onItemPress={() => {
              hide();
              navigation.navigate(ROUTE_KEY.ParkingDetails, {
                id: Number(data?.gId2),
              });
            }}
          />
        ) : null}

        {data?.gExp3 && data?.gId3 && data?.gMoney3 && data?.gName3 ? (
          <CurationItem
            parkingExp={data?.gExp3}
            parkingMoney={data?.gMoney3}
            parkingName={data?.gName3}
            onItemPress={() => {
              hide();
              navigation.navigate(ROUTE_KEY.ParkingDetails, {
                id: Number(data?.gId3),
              });
            }}
          />
        ) : null}

        <TouchableOpacity
          style={{
            marginTop: PADDING / 2,
          }}
          onPress={hide}>
          <CustomText string="확인" color={colors.red} />
        </TouchableOpacity>
      </View>
    </ReactNativeModal>
  );
});

export default CurationPopup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    width: width * 0.75,
    alignSelf: 'center',
    alignItems: 'center',
    padding: PADDING,
  },
});
