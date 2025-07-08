import {DeviceEventEmitter, Image, ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import {strings} from '~constants/strings';
import {widthScale} from '~styles/scaling-utils';
import TitleTextInputVehicle from '~components/vehicle-number/title-textinput-vehicle';
import {colors} from '~styles/colors';
import {useSelector} from 'react-redux';
import {RootState} from '~store/store';
import {ICONS} from '~/assets/images-path';
import FastImage from 'react-native-fast-image';
import Button from '~components/button';
import CustomText from '~components/custom-text';
import {EMIT_EVENT, FONT, FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import ButtonBorder from '~components/button-border';
import {RootStackScreenProps} from '~navigators/stack';
import {ROUTE_KEY} from '~navigators/router';
import {showMessage} from 'react-native-flash-message';
import {useEGiveMoneyYNMutation, useUpdateCarUserMutation} from '~services/userServices';
import {sleep} from '~utils/index';
import Spinner from '~components/spinner';
import {isValidCarNumber} from '~utils/isValidCarNumber';

const VehicleNumberManagement = (props: RootStackScreenProps<'VehicleNumberManagement'>) => {
  const user = useSelector((state: RootState) => state.userReducer.user);
  const userToken = useSelector((state: RootState) => state.userReducer.userToken);
  const {navigation, route} = props;
  const [carNumber, setCarNumber] = useState(user?.carNumber || '');
  const [carModel, setCarModel] = useState(user?.carModel || '');
  const [carColor, setCarColor] = useState(user?.carColor || '');
  const [carYear, setCarYear] = useState(user?.carYear || '');
  const [carCompany, setCarCompany] = useState(user?.carCompany || '');

  const [updateCarUser] = useUpdateCarUserMutation();
  const [eGiveMoneyYN] = useEGiveMoneyYNMutation();

  const onPressRegistration = () => {
    navigation.navigate(ROUTE_KEY.VehicleNumberAdd);
  };

  const onPressSubmitEdit = async () => {
    if (!carNumber) {
      showMessage({message: '올바른 차량번호를 입력해 주세요'});
      return;
    }
    if (!isValidCarNumber(carNumber)) {
      showMessage({message: '올바른 차량번호를 입력해 주세요'});
      return;
    }

    Spinner.show();
    if (
      user?.giveMoneyYN == IS_ACTIVE.NO &&
      carNumber.length != 0 &&
      carModel.length != 0 &&
      carColor.length != 0
    ) {
      await eGiveMoneyYN({
        id: userToken?.id?.toString(),
        pwd: userToken.password,
        mpoint: user.mpoint,
      });
    }
    updateCarUser({
      id: userToken.id,
      pwd: userToken.password,
      carNumber,
      carModel,
      carColor,
      carYear,
      carCompany,
    })
      .unwrap()
      .then(async () => {
        DeviceEventEmitter.emit(EMIT_EVENT.UPDATED_USER);
        DeviceEventEmitter.emit(EMIT_EVENT.PAYMENT_CARD);
        await sleep(200);
        navigation.goBack();
      })
      .finally(() => Spinner.hide());
  };

  return (
    <FixedContainer>
      <CustomHeader text={strings.vehicle_number_manage.title} />
      <ScrollView style={styles.viewContent}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={ICONS.btn_radio_round_checked}
              style={styles.imgIcon}
              resizeMode={FastImage.resizeMode.contain}
            />
            <CustomText
              string={`등록번호:${(user?.carNumber == 'null' ? '' : user?.carNumber) || ''}`}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.TITLE_3}
            />
          </View>
          <ButtonBorder text="차량추가" onPress={onPressRegistration} />
        </View>

        <TitleTextInputVehicle
          underlineColor={colors.red}
          onChangeText={setCarNumber}
          placeholder={'직접입력해주세요'}
          title={'차량번호 입력'}
          value={carNumber}
        />
        <TitleTextInputVehicle
          onChangeText={setCarModel}
          placeholder={'직접 입력해주세요'}
          title={'차량모델 입력'}
          value={carModel}
        />
        <TitleTextInputVehicle
          onChangeText={setCarColor}
          placeholder={'직접 입력해주세요'}
          title={'차량색상 입력'}
          value={carColor}
        />
        <TitleTextInputVehicle
          onChangeText={setCarYear}
          placeholder={'직접 입력해주세요.(선택)'}
          title={'차량연식 입력'}
          value={carYear}
        />
        <TitleTextInputVehicle
          onChangeText={setCarCompany}
          placeholder={'커넥티드카 연동시 필수'}
          title={'제조사(브랜드)'}
          value={carCompany}
        />
        <View style={{padding: widthScale(20)}}>
          <CustomText
            color={colors.grayText}
            size={FONT.CAPTION_4}
            family={FONT_FAMILY.REGULAR}
            string={
              '*차량번호 7자리 혹은 8자리를 정확히 입력해 주세요.\n 주차권 적용에 어려움이 있습니다.'
            }
          />
        </View>

        <Button
          onPress={onPressSubmitEdit}
          text={'등록하기'}
          textColor={colors.red}
          borderColor={colors.red}
          style={{
            borderRadius: widthScale(20),
            marginHorizontal: widthScale(35),
            backgroundColor: colors.white,
          }}
        />
      </ScrollView>
    </FixedContainer>
  );
};

export default VehicleNumberManagement;

const styles = StyleSheet.create({
  imgIcon: {
    width: widthScale(28),
    height: widthScale(28),
    marginRight: widthScale(15),
  },
  viewContent: {
    padding: widthScale(18),
  },
});
