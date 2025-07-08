import {useKeyboard} from '@react-native-community/hooks';
import React, {memo, useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import MenuTitleInput from '~components/menu-title-input';
import Spinner from '~components/spinner';
import {PADDING, width} from '~constants/constant';
import {EMIT_EVENT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ImageProps} from '~constants/types';
import {RootStackScreenProps} from '~navigators/stack';
import {
  useCreateMonthlyParkingDirectMutation,
  useUploadMonthlyParkingDirectImagesMutation,
} from '~services/monthlyParkingDirectServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

const MonthlyParkingDirectRegistration = memo(
  (props: RootStackScreenProps<'MonthlyParkingDirectRegistration'>) => {
    const {navigation} = props;

    const userToken = useAppSelector(state => state?.userReducer?.userToken);

    // Refs
    const representativePhotoRef = useRef<ImagePickerModalRefs>(null);
    const accessPhotoRef = useRef<ImagePickerModalRefs>(null);
    const parkingSpace1PhotoRef = useRef<ImagePickerModalRefs>(null);
    const parkingSpace2PhotoRef = useRef<ImagePickerModalRefs>(null);

    const [parkingAddress, setParkingAddress] = useState<string>('');
    const [registrationTitle, setRegistrationTitle] = useState<string>('');
    const [parkingLotName, setParkingLotName] = useState<string>('');
    const [salePrice, setSalePrice] = useState<string>('');
    const [numberOfParkingSpaces, setNumberOfParkingSpaces] = useState<string>('');
    const [operatingTime, setOperatingTime] = useState<string>('');
    const [salesDay, setSalesDay] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [uniqueness, setUniqueness] = useState<string>('');
    const [image1, setImage1] = useState<ImageProps | null>(null);
    const [image2, setImage2] = useState<ImageProps | null>(null);
    const [image3, setImage3] = useState<ImageProps | null>(null);
    const [image4, setImage4] = useState<ImageProps | null>(null);

    const [createMonthlyParkingDurect] = useCreateMonthlyParkingDirectMutation();
    const [uploadMonthlyParkingDiretcImages] = useUploadMonthlyParkingDirectImagesMutation();

    const handleSubmit = () => {
      if (!parkingAddress) {
        showMessage({
          message: strings?.monthly_parking_direct_registration?.please_inter_address,
        });
        return;
      }
      if (!registrationTitle) {
        showMessage({
          message: strings?.monthly_parking_direct_registration?.please_enter_the_subject,
        });
        return;
      }
      if (!parkingLotName) {
        showMessage({
          message: strings?.monthly_parking_direct_registration?.please_enter_parking_lot_name,
        });
        return;
      }
      if (!salePrice) {
        showMessage({
          message: strings?.monthly_parking_direct_registration?.please_enter_sales_amount,
        });
        return;
      }
      if (!numberOfParkingSpaces) {
        showMessage({
          message:
            strings?.monthly_parking_direct_registration?.please_enter_number_of_parking_spaces,
        });
        return;
      }
      if (!operatingTime) {
        showMessage({
          message: strings?.monthly_parking_direct_registration?.please_enter_operating_time,
        });
        return;
      }
      if (!phoneNumber) {
        showMessage({
          message: strings?.monthly_parking_direct_registration?.please_enter_phone_number,
        });
        return;
      }
      if (!image1 && !image2 && !image3 && !image4) {
        showMessage({
          message: strings?.monthly_parking_direct_registration?.choose_at_least_1_photo,
        });
        return;
      }

      const body = {
        s_garageAddress: parkingAddress,
        s_subject: registrationTitle,
        s_garageName: parkingLotName,
        s_garagePay: salePrice,
        s_rSpace: numberOfParkingSpaces,
        s_gtime: operatingTime,
        s_gday: salesDay,
        s_garageInfo: uniqueness,
        pnum: phoneNumber,
        s_memberId: userToken?.id,
      };

      Spinner.show();

      createMonthlyParkingDurect(body)
        .unwrap()
        .then(async res => {
          console.log('🚀 ~ file: monthly-parking-direct-registration.tsx:151 ~ .then ~ res:', res);
          if (res?.bbsId && res?.statusCode === '200') {
            await uploadMonthlyParkingDiretcImages({
              BBSID: res.bbsId,
              carImage1: image1,
              carImage2: image2,
              carImage3: image3,
              carImage4: image4,
              userID: userToken?.id,
            });
            DeviceEventEmitter.emit(EMIT_EVENT.MONTHLY_PARKING_DIRECT);
            navigation.goBack();
          } else {
            showMessage({
              message: strings?.general_text?.please_try_again,
            });
          }
        })
        .finally(() => {
          Spinner.hide();
        });
    };

    return (
      <FixedContainer>
        <CustomHeader
          text={
            strings?.monthly_parking_direct_registration?.parking_direct_transaction_registration
          }
        />
        <KeyboardAvoidingView style={styles.container}>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            {/* Parking address */}
            <MenuTitleInput
              title={strings?.monthly_parking_direct_registration?.parking_lot_address}
              placeholder={
                strings?.monthly_parking_direct_registration
                  ?.address_input_by_direct_input_or_button
              }
              value={parkingAddress}
              onChangeText={setParkingAddress}
            />
            {/* Registration title */}
            <MenuTitleInput
              title="등록 제목"
              placeholder="예) 서초역 해당주소 지정면 월주차거래해요"
              value={registrationTitle}
              onChangeText={setRegistrationTitle}
            />
            {/* Parking lot name */}
            <MenuTitleInput
              title={strings?.monthly_parking_direct_registration?.parking_lot_name}
              placeholder={strings?.monthly_parking_direct_registration?.parking_lot_name}
              value={parkingLotName}
              onChangeText={setParkingLotName}
            />
            {/* Sale price */}
            <MenuTitleInput
              title={strings?.monthly_parking_direct_registration?.sale_price}
              placeholder={strings?.monthly_parking_direct_registration?.sale_price}
              keyboardType="numeric"
              value={salePrice}
              onChangeText={setSalePrice}
            />
            {/* Number of parking spaces */}
            <MenuTitleInput
              title={strings?.monthly_parking_direct_registration?.number_of_parking_spaces}
              placeholder={strings?.monthly_parking_direct_registration?.number_of_parking_spaces}
              keyboardType="numeric"
              value={numberOfParkingSpaces}
              onChangeText={setNumberOfParkingSpaces}
            />
            {/* Operating time */}
            <MenuTitleInput
              title={strings?.monthly_parking_direct_registration?.operating_time}
              placeholder="예) 9시 ~ 18시"
              value={operatingTime}
              onChangeText={setOperatingTime}
            />
            {/* Sales day */}
            <MenuTitleInput
              title={strings?.monthly_parking_direct_registration?.sales_day}
              placeholder="예) 평일주말, 평일, 주말, 월 ~ 수, 월수금, 금 ~ 일"
              value={salesDay}
              onChangeText={setSalesDay}
            />
            {/* Phone number */}
            <MenuTitleInput
              title={strings?.general_text?.phone_number}
              placeholder="예) 01012341234"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            {/* Uniqueness */}
            <MenuTitleInput
              title={strings?.monthly_parking_direct_details?.uniqueness}
              placeholder="예) 제약사항 등 이용방법 표기"
              value={uniqueness}
              onChangeText={setUniqueness}
            />

            <View style={styles.imageWrapper}>
              <CustomText
                string={strings?.monthly_parking_direct_registration?.parking_lot_photo}
                family={FONT_FAMILY.SEMI_BOLD}
              />

              <HStack>
                {/* Representative photo */}
                <View style={styles.buttonWrapper}>
                  <TouchableOpacity
                    onPress={() => representativePhotoRef?.current?.show()}
                    style={styles.plusIconWrapper}>
                    {image1?.uri ? (
                      <Image
                        source={{uri: image1?.uri}}
                        style={[
                          styles.plusIconWrapper,
                          {
                            marginBottom: 0,
                          },
                        ]}
                      />
                    ) : (
                      <Icon name="plus" size={widthScale(25)} color={colors.gray} />
                    )}
                  </TouchableOpacity>
                  <CustomText
                    string={strings?.monthly_parking_direct_details?.representative_photo}
                    family={FONT_FAMILY.SEMI_BOLD}
                  />
                </View>
                {/* Access photo */}
                <View style={styles.buttonWrapper}>
                  <TouchableOpacity
                    onPress={() => accessPhotoRef?.current?.show()}
                    style={styles.plusIconWrapper}>
                    {image2?.uri ? (
                      <Image
                        source={{uri: image2?.uri}}
                        style={[
                          styles.plusIconWrapper,
                          {
                            marginBottom: 0,
                          },
                        ]}
                      />
                    ) : (
                      <Icon name="plus" size={widthScale(25)} color={colors.gray} />
                    )}
                  </TouchableOpacity>
                  <CustomText
                    string={strings?.monthly_parking_direct_details?.access}
                    family={FONT_FAMILY.SEMI_BOLD}
                  />
                </View>
                {/* Parking space 1 photo */}
                <View style={styles.buttonWrapper}>
                  <TouchableOpacity
                    onPress={() => parkingSpace1PhotoRef?.current?.show()}
                    style={styles.plusIconWrapper}>
                    {image3?.uri ? (
                      <Image
                        source={{uri: image3?.uri}}
                        style={[
                          styles.plusIconWrapper,
                          {
                            marginBottom: 0,
                          },
                        ]}
                      />
                    ) : (
                      <Icon name="plus" size={widthScale(25)} color={colors.gray} />
                    )}
                  </TouchableOpacity>
                  <CustomText
                    string={strings?.monthly_parking_direct_details?.parking_space_1}
                    family={FONT_FAMILY.SEMI_BOLD}
                  />
                </View>
                {/* Parking space 2 photo */}
                <View style={styles.buttonWrapper}>
                  <TouchableOpacity
                    onPress={() => parkingSpace2PhotoRef?.current?.show()}
                    style={styles.plusIconWrapper}>
                    {image4?.uri ? (
                      <Image
                        source={{uri: image4?.uri}}
                        style={[
                          styles.plusIconWrapper,
                          {
                            marginBottom: 0,
                          },
                        ]}
                      />
                    ) : (
                      <Icon name="plus" size={widthScale(25)} color={colors.gray} />
                    )}
                  </TouchableOpacity>
                  <CustomText
                    string={strings?.monthly_parking_direct_details?.parking_space_2}
                    family={FONT_FAMILY.SEMI_BOLD}
                  />
                </View>
              </HStack>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              style={[
                styles.saveButtonWrapper,
                {
                  marginTop: useKeyboard().keyboardShown ? PADDING : 'auto',
                },
              ]}>
              <CustomText
                string={strings?.general_text?.save}
                color={colors.red}
                family={FONT_FAMILY.SEMI_BOLD}
              />
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Representative photo image picker */}
        <ImagePickerModal ref={representativePhotoRef} onImage={setImage1} />
        {/* Access photo image picker */}
        <ImagePickerModal ref={accessPhotoRef} onImage={setImage2} />
        {/* Parking space 1 photo image picker */}
        <ImagePickerModal ref={parkingSpace1PhotoRef} onImage={setImage3} />
        {/* Parking space 2 photo image picker */}
        <ImagePickerModal ref={parkingSpace2PhotoRef} onImage={setImage4} />
      </FixedContainer>
    );
  },
);

export default MonthlyParkingDirectRegistration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: PADDING,
  },
  imageWrapper: {
    marginTop: PADDING,
  },
  buttonWrapper: {
    width: (width - PADDING * 2 - widthScale(16)) / 4,
    marginHorizontal: widthScale(2),
    alignItems: 'center',
    marginTop: PADDING / 2,
  },
  plusIconWrapper: {
    borderWidth: widthScale(1),
    width: '100%',
    aspectRatio: 1,
    borderRadius: widthScale(10),
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.gray,
    marginBottom: PADDING / 2,
  },
  saveButtonWrapper: {
    bottom: PADDING / 2,
    height: heightScale(45),
    borderWidth: widthScale(2),
    width: widthScale(150),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    alignSelf: 'center',
    borderColor: colors.red,
  },
});
