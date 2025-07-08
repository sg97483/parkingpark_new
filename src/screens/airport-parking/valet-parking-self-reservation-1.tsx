import {
  DeviceEventEmitter,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useState} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import UsageHistoryMenuText from '~components/usage-history.tsx/usage-history-menu-text';
import CustomText from '~components/custom-text';
import {colors} from '~styles/colors';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {useAppSelector} from '~store/storeHooks';
import {PADDING} from '~constants/constant';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {ROUTE_KEY} from '~navigators/router';
import HStack from '~components/h-stack';
import {strings} from '~constants/strings';
import {showMessage} from 'react-native-flash-message';
import {useEditUserInfoMutation} from '~services/userServices';
import Spinner from '~components/spinner';
import NextPreviousButtons from '~components/valet-parking-reservation/next-previous-buttons';

const ValetParkingSelfReservation1 = memo(
  (props: RootStackScreenProps<'ValetParkingSelfReservation1'>) => {
    const {navigation, route} = props;

    const parkingLot = route?.params?.parkingLot;
    const userInfo = useAppSelector(state => state?.userReducer?.user);

    const userToken = useAppSelector(state => state?.userReducer?.userToken);

    const [editUserInfo] = useEditUserInfoMutation();

    const [carNumber, setCarNumber] = useState<string>(userInfo?.carNumber || '');
    const [carModel, setCarModel] = useState<string>(userInfo?.carModel || '');
    const [carColor, setCarColor] = useState<string>(userInfo?.carColor || '');
    const [userPhone, setUserPhone] = useState<string>(userInfo?.pnum || '');
    const [accompanyingVihicle1, setAccompanyingVihicle1] = useState<string>(
      userInfo?.partnerCarList?.split(',')[0] || '',
    );
    const [accompanyingVihicle2, setAccompanyingVihicle2] = useState<string>(
      userInfo?.partnerCarList?.split(',')[1] || '',
    );
    const [accompanyingVihicle3, setAccompanyingVihicle3] = useState<string>(
      userInfo?.partnerCarList?.split(',')[2] || '',
    );
    const [otherRequests, setOtherRequests] = useState<string>('');

    const handleNext = () => {
      if (!carNumber) {
        showMessage({
          message: '차량번호를 입력해 주십시오.',
        });
        return;
      }
      if (!carModel) {
        showMessage({
          message: '차량기종을 입력해 주십시오.',
        });
        return;
      }
      if (!carColor) {
        showMessage({
          message: '차량색상을 입력해 주십시오.',
        });
        return;
      }
      if (!userPhone) {
        showMessage({
          message: '연락처를 입력해 주십시오.',
        });
        return;
      }

      Spinner.show();
      editUserInfo({
        userID: userToken?.id,
        userPassword: userToken?.password,
        carNumber: carNumber,
        carModel: carModel,
        carColor: carColor,
        phone: userPhone,
      })
        .unwrap()
        .then(res => {
          if (res === '200') {
            DeviceEventEmitter.emit(EMIT_EVENT.UPDATED_USER);
            showMessage({
              message: '차량정보 및 연락처가 등록되었습니다.',
            });
            navigation.navigate(ROUTE_KEY.ValetParkingSelfReservation2, {
              parkingLot: parkingLot,
              agCarNumber: carNumber,
              requirements: otherRequests,
            });
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

    const handleUpdatePartnerCarList = () => {
      Spinner.show();
      let partnerCarList = `${accompanyingVihicle1},${accompanyingVihicle2},${accompanyingVihicle3}`;

      editUserInfo({
        userID: userToken?.id,
        userPassword: userToken?.password,
        partnerCarList: partnerCarList,
      })
        .unwrap()
        .then(res => {
          if (res === '200') {
            DeviceEventEmitter.emit(EMIT_EVENT.UPDATED_USER);
            showMessage({
              message: '차량정보 및 연락처가 등록되었습니다.',
            });
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
        <CustomHeader text="1단계. 고객정보" />

        <ScrollView>
          <UsageHistoryMenuText
            title="주차장명"
            content={
              <CustomText
                string={parkingLot?.garageName}
                color={colors.blue}
                size={FONT.CAPTION}
                family={FONT_FAMILY.SEMI_BOLD}
              />
            }
          />
          <UsageHistoryMenuText
            title="차량번호"
            content={
              <TextInput
                value={carNumber}
                onChangeText={setCarNumber}
                maxLength={8}
                style={styles.input}
              />
            }
          />
          <UsageHistoryMenuText
            title="차량기종"
            content={
              <TextInput
                value={carModel}
                onChangeText={setCarModel}
                maxLength={20}
                style={styles.input}
              />
            }
          />
          <UsageHistoryMenuText
            title="차량색상"
            content={
              <TextInput
                value={carColor}
                onChangeText={setCarColor}
                maxLength={20}
                style={styles.input}
              />
            }
          />
          <UsageHistoryMenuText
            title="연락처"
            content={
              <TextInput
                value={userPhone}
                onChangeText={setUserPhone}
                maxLength={11}
                style={styles.input}
              />
            }
          />
          <UsageHistoryMenuText
            title={'결제카드등록\n(필수)'}
            titleColor={colors.red}
            content={
              <TouchableOpacity
                style={{
                  width: '100%',
                  paddingHorizontal: PADDING / 1.5,
                }}
                onPress={() => navigation.navigate(ROUTE_KEY.PaymentInfomation)}>
                <CustomText
                  string="결제카드등록바로가기"
                  size={FONT.CAPTION}
                  textStyle={{
                    textDecorationLine: 'underline',
                  }}
                />
              </TouchableOpacity>
            }
          />
          {/* Accompanying vehicle */}
          <UsageHistoryMenuText
            title="동행차량"
            content={
              <View>
                <HStack style={styles.inputWrapper}>
                  <View style={{flex: 1}}>
                    <TextInput
                      style={styles.input}
                      value={accompanyingVihicle1}
                      onChangeText={setAccompanyingVihicle1}
                      maxLength={8}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={handleUpdatePartnerCarList}
                    style={styles.registrationButton}>
                    <CustomText string="등록" family={FONT_FAMILY.SEMI_BOLD} />
                  </TouchableOpacity>
                </HStack>
                <HStack
                  style={[
                    styles.inputWrapper,
                    {
                      marginTop: heightScale(5),
                    },
                  ]}>
                  <View style={{flex: 1}}>
                    <TextInput
                      style={styles.input}
                      value={accompanyingVihicle2}
                      onChangeText={setAccompanyingVihicle2}
                      maxLength={8}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={handleUpdatePartnerCarList}
                    style={styles.registrationButton}>
                    <CustomText string="등록" family={FONT_FAMILY.SEMI_BOLD} />
                  </TouchableOpacity>
                </HStack>
                <HStack
                  style={[
                    styles.inputWrapper,
                    {
                      marginTop: heightScale(5),
                    },
                  ]}>
                  <View style={{flex: 1}}>
                    <TextInput
                      style={styles.input}
                      value={accompanyingVihicle3}
                      onChangeText={setAccompanyingVihicle3}
                      maxLength={8}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={handleUpdatePartnerCarList}
                    style={styles.registrationButton}>
                    <CustomText string="등록" family={FONT_FAMILY.SEMI_BOLD} />
                  </TouchableOpacity>
                </HStack>
              </View>
            }
          />
          {/* Other requests */}
          <UsageHistoryMenuText
            title="기타요청사항"
            content={
              <TextInput
                value={otherRequests}
                onChangeText={setOtherRequests}
                style={styles.input}
              />
            }
            isLastIndex
          />

          {/* Next page / go back */}
          <NextPreviousButtons onNextPress={handleNext} />
        </ScrollView>
      </FixedContainer>
    );
  },
);

export default ValetParkingSelfReservation1;

const styles = StyleSheet.create({
  input: {
    width: '100%',
    paddingHorizontal: PADDING / 1.5,
    borderWidth: 1,
    borderColor: colors.gray,
    minHeight: heightScale(35),
  },
  inputWrapper: {
    width: '100%',
  },
  registrationButton: {
    width: widthScale(50),
    borderWidth: 1,
    borderColor: colors.darkGray,
    height: heightScale(35),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: widthScale(5),
    borderRadius: widthScale(5),
  },
  dotWrapper: {
    width: widthScale(18),
    height: widthScale(18),
    borderWidth: 1,
    borderRadius: 999,
    borderColor: colors.darkGray,
    marginRight: widthScale(5),
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  dot: {
    width: widthScale(12),
    height: widthScale(12),
    borderRadius: 999,
  },
});
