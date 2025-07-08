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
import {EMIT_EVENT, FONT, FONT_FAMILY, TERMINAL_SELECT} from '~constants/enum';
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

const ValetParkingReservation1 = memo((props: RootStackScreenProps<'ValetParkingReservation1'>) => {
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
  const [otherRequests, setOtherRequests] = useState<string>('');
  const [selectedTerminal, setSelectedTerminal] = useState<TERMINAL_SELECT>(
    TERMINAL_SELECT.VALET_ONE,
  );

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
          navigation.navigate(ROUTE_KEY.ValetParkingReservation2, {
            parkingLot: parkingLot,
            agCarNumber: carNumber,
            valetSel: selectedTerminal,
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
    let partnerCarList = `${accompanyingVihicle1},${accompanyingVihicle2}`;

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
        {/*<UsageHistoryMenuText
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
            </View>
          }
        />*/}
        {/* Other requests */}
        <UsageHistoryMenuText
          title="기타요청사항"
          content={
            <TextInput value={otherRequests} onChangeText={setOtherRequests} style={styles.input} />
          }
        />
        {/* Select terminal */}
        <UsageHistoryMenuText
          title={'터미널(항공)\n선택'}
          titleColor={colors.red}
          content={
            <View style={styles.inputWrapper}>
              <TouchableOpacity onPress={() => setSelectedTerminal(TERMINAL_SELECT.VALET_ONE)}>
                <HStack>
                  <View style={styles.dotWrapper}>
                    <View
                      style={[
                        styles.dot,
                        {
                          backgroundColor:
                            selectedTerminal === TERMINAL_SELECT.VALET_ONE
                              ? colors.blue
                              : colors.transparent,
                        },
                      ]}
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <CustomText string="제1여객 터미널" family={FONT_FAMILY.SEMI_BOLD} />
                    <CustomText
                      string="(아시아나항공 및 기타 외국 항공사와 저가 항공사)"
                      size={FONT.CAPTION_3}
                      color={colors.darkGray}
                      textStyle={{
                        paddingTop: heightScale(5),
                      }}
                    />
                  </View>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedTerminal(TERMINAL_SELECT.VALET_TWO)}>
                <HStack style={{marginTop: PADDING / 2}}>
                  <View style={styles.dotWrapper}>
                    <View
                      style={[
                        styles.dot,
                        {
                          backgroundColor:
                            selectedTerminal === TERMINAL_SELECT.VALET_TWO
                              ? colors.blue
                              : colors.transparent,
                        },
                      ]}
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <CustomText string="제2여객 터미널" family={FONT_FAMILY.SEMI_BOLD} />
                    <CustomText
                      string="(대한항공, 델타항공, 에어프랑스, KLM 네덜란드항공, 가루다항공, 샤먼항공, 아에로멕시코, 아에로플로트, 알이탈리아, 중화항공, 체코항공)"
                      size={FONT.CAPTION_3}
                      color={colors.darkGray}
                      textStyle={{
                        paddingTop: heightScale(5),
                      }}
                    />
                  </View>
                </HStack>
              </TouchableOpacity>
            </View>
          }
        />
        {/* Checklist before reservation */}
        <UsageHistoryMenuText
          title="예약 전 확인사항(필독)"
          content={
            <CustomText
              size={FONT.CAPTION}
              family={FONT_FAMILY.SEMI_BOLD}
              color={colors.blue}
              textStyle={{
                paddingVertical: PADDING,
              }}
              // string={`1. 터미널 선택(이용)에 따라 이용금액 및 추가 대행료가 부과될수 있습니다. \n2. 발렛파킹 예약시 이시간에도 결제는 가능하나 00:00(자정) ~ 05:00(새벽), 당일 예약 새벽 5시부터~오전 8시. 해당시간에는 발렛파킹이용은 불가능하오니 참고부탁드립니다. (** 전일 예약은 상관없습니다.) \n3. 필독, 최근 인천공항 3층 출국장 주.정차 단속 상황상 '발렛파킹 인수인계' 위치가 '인천공항 업무지구단지' 근처로 달라졌습니다, 공항 이마트점 입니다, 기사님과 전화통화를 통해 정확한 위치 안내를 받으시면 됩니다. 양해를 부탁드립니다.`}
              string={
                '1. 최소 출발 4일전에 예약해주셔야 발렛파킹서비스 이용이 가능합니다. \n\n2. 발렛파킹 예약시 이시간에도 결제는 가능하나 00:00(자정) ~ 05:00(새벽), 당일 예약 새벽 5시부터~오전 8시. 해당시간에는 발렛파킹이용은 불가능하오니 참고부탁드립니다. \n\n3. 필독, 최근 인천공항 3층 출국장 주.정차 단속 상황상 발렛파킹 인수인계 위치가 달라질 수 있습니다, 그리고 필히 공항 도착 30분전에 기사님께 전화주셔서 발렛안내를 받으시면 됩니다.'
              }
            />
          }
          isLastIndex
        />

        {/* Next page / go back */}
        <NextPreviousButtons onNextPress={handleNext} />
      </ScrollView>
    </FixedContainer>
  );
});

export default ValetParkingReservation1;

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
