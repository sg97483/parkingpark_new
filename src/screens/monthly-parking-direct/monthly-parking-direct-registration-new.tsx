import {DeviceEventEmitter, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useMemo, useRef, useState} from 'react';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {strings} from '~constants/strings';
import {ICONS} from '~/assets/images-path';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import CustomText from '~components/custom-text';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {IS_IOS, PADDING} from '~constants/constant';
import {RootStackScreenProps} from '~navigators/stack';
import {ImageProps} from '~constants/types';
import TextInputTitlePlaceholder from '~components/textinput-title-placeholder';
import {
  useCreateMonthlyParkingDirectMutation,
  useUploadMonthlyParkingDirectImagesMutation,
} from '~services/monthlyParkingDirectServices';
import {useKeyboard} from '@react-native-community/hooks';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import {showMessage} from 'react-native-flash-message';
import Spinner from '~components/spinner';
import {useAppSelector} from '~store/storeHooks';

const MonthlyParkingDirectRegistration = (
  props: RootStackScreenProps<'MonthlyParkingDirectRegistration'>,
) => {
  const {navigation, route} = props;

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const imageRef = useRef<ImagePickerModalRefs>(null);
  const [createMonthlyParkingDurect] = useCreateMonthlyParkingDirectMutation();
  const [uploadMonthlyParkingDiretcImages] = useUploadMonthlyParkingDirectImagesMutation();

  const [images, setImages] = useState<ImageProps[]>([]);
  const [parkingAddress, setParkingAddress] = useState<string>('');
  const [registrationTitle, setRegistrationTitle] = useState<string>('');
  const [parkingLotName, setParkingLotName] = useState<string>('');
  const [salePrice, setSalePrice] = useState<string>('');
  const [numberOfParkingSpaces, setNumberOfParkingSpaces] = useState<string>('');
  const [operatingTime, setOperatingTime] = useState<string>('');
  const [salesDay, setSalesDay] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [uniqueness, setUniqueness] = useState<string>('');

  const lengthPhoto = useMemo(() => (images ? `${images.length}/4` : '0/4'), [images]);

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
        if (res?.bbsId && res?.statusCode === '200') {
          await uploadMonthlyParkingDiretcImages({
            BBSID: res.bbsId,
            carImage1: images![0] || null,
            carImage2: images![1] || null,
            carImage3: images![2] || null,
            carImage4: images![3] || null,
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
        text={strings?.monthly_parking_direct_registration?.parking_direct_transaction_registration}
      />
      <View style={{padding: PADDING, flex: 1}}>
        <View style={{flexDirection: 'row'}}>
          {!(images?.length === 4) && (
            <TouchableOpacity onPress={() => imageRef.current?.show()} style={styles.buttonPhoto}>
              <Image source={ICONS.add_a_photo} style={styles.photoIcon} />
              <CustomText string={lengthPhoto} color={colors.grayText} size={FONT.CAPTION_4} />
            </TouchableOpacity>
          )}

          {images?.map((item, index) => (
            <View>
              <TouchableOpacity
                onPress={() => {
                  const newData = [];
                  for (let i = 0; i < images.length; i++) {
                    if (!(index == i)) {
                      newData.push(images[i]);
                    }
                  }
                  setImages(newData);
                }}
                style={styles.iconX}>
                <Image
                  resizeMode="contain"
                  source={ICONS.btn_exit_gray}
                  style={{width: widthScale(8), height: widthScale(8)}}
                />
              </TouchableOpacity>
              <Image
                key={JSON.stringify(item)}
                source={{
                  uri: item?.uri,
                }}
                style={[
                  styles.buttonPhoto,
                  {
                    marginHorizontal: widthScale(5),
                  },
                ]}
                resizeMode="cover"
              />
            </View>
          ))}
        </View>

        <TextInputTitlePlaceholder
          onChangeText={setRegistrationTitle}
          value={registrationTitle}
          title={'제목'}
          placeholder={'원'}
        />
        <TextInputTitlePlaceholder
          title={'판매금액'}
          value={salePrice}
          onChangeText={setSalePrice}
        />
        <TextInputTitlePlaceholder
          title={'주차장주소'}
          value={parkingAddress}
          onChangeText={setParkingAddress}
        />
        <TextInputTitlePlaceholder
          title={'주차면수'}
          placeholder={'대'}
          value={numberOfParkingSpaces}
          onChangeText={setNumberOfParkingSpaces}
        />
        <TextInputTitlePlaceholder
          title={'운영시간'}
          placeholder={'예) 9시~18시'}
          value={operatingTime}
          onChangeText={setOperatingTime}
        />
        <TextInputTitlePlaceholder
          title={'판매요일'}
          placeholder={'예 ) 평일주말, 평일,주말, 월~수 등'}
          value={salesDay}
          onChangeText={setSalesDay}
        />
        <TextInputTitlePlaceholder
          title={'전화번호'}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <TextInputTitlePlaceholder
          title={'특이사함'}
          placeholder={'예 ) 평일주말, 평일,주말, 월~수 등'}
          value={uniqueness}
          onChangeText={setUniqueness}
        />

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
      </View>
      <ImagePickerModal
        ref={imageRef}
        onImage={img => {
          if (img) {
            img.uri = IS_IOS ? img.uri.replace('file://', '') : img.uri;
            const newData = [...images, img];
            setImages(newData);
          }
        }}
      />
    </FixedContainer>
  );
};

export default MonthlyParkingDirectRegistration;
const styles = StyleSheet.create({
  buttonPhoto: {
    width: widthScale(55),
    height: widthScale(55),
    justifyContent: 'center',
    backgroundColor: colors.gray,
    alignItems: 'center',
    borderRadius: widthScale(5),
    marginVertical: heightScale(10),
  },
  photoIcon: {
    width: widthScale(20),
    height: widthScale(20),
    marginBottom: heightScale(2),
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
  iconX: {
    position: 'absolute',
    zIndex: 10,
    backgroundColor: colors.white,
    right: 0,
    top: 5,
    padding: widthScale(2),
    borderRadius: 100,
  },
});
