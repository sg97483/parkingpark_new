import {Image, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import {ICONS} from '~/assets/images-path';
import {heightScale, widthScale} from '~styles/scaling-utils';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import SettingInsurance from '~components/setting-insurance';
import Button from '~components/button';
import {RootStackScreenProps} from '~navigators/stack';
import {strings} from '~constants/strings';
import {ROUTE_KEY} from '~navigators/router';
import {useAppSelector} from '~store/storeHooks';
import {useLazyReadMyDriverQuery, useReadMyProfileMutation} from '~services/userServices';
import Spinner from '~components/spinner';

const CarSetting = (props: RootStackScreenProps<'CarSetting'>) => {
  const {navigation, route} = props;
  const userToken = useAppSelector(state => state?.userReducer?.userToken);
  const [readMyDriver] = useLazyReadMyDriverQuery();
  const [readMyProfile] = useReadMyProfileMutation();

  const [carNum, setCarNum] = useState('');
  const [carModal, setCarModal] = useState('');
  const [carColor, setCarColor] = useState('');
  const [carYear, setCarYear] = useState('');

  const [insurance, setInsurance] = useState(false);
  const [driversLicense, setDriversLicense] = useState(false);
  const [desiredStyle, setDesiredStyle] = useState(false);
  const [account, setAccount] = useState(false);
  const [informationRegistration, setInformationRegistration] = useState(false);
  const [cardRegistration, setCardRegistration] = useState(false);
  const [authTxt, setAuthTxt] = useState('');
  const [isApproved, setApproved] = useState(false);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    try {
      getData();
    } catch (error) {
      navigation.goBack();
      Spinner.hide();
    }
  }, []);

  const getData = async () => {
    Spinner.show();
    const myProfile = await readMyProfile({
      id: userToken?.id + '',
      pwd: userToken.password,
    }).unwrap();
    setCarNum(myProfile.carNumber);
    setCarModal(myProfile.carModel);
    setCarColor(myProfile.carColor);
    setCarYear(myProfile.carYear);

    const myDriver = await readMyDriver({
      memberId: userToken?.id + '',
    }).unwrap();

    setInsurance(myDriver.authYN == 'N' && `${myDriver.insurEndDate}` != 'null');
    setDriversLicense(myDriver.authYN == 'N' && `${myDriver.licenseNum}` != 'null');
    setDesiredStyle(myDriver.authYN == 'N' && `${myDriver.style}` != 'null');
    setAccount(myDriver.authYN == 'N' && `${myDriver.bankNum}` != 'null');
    setInformationRegistration(`${myDriver.carImageUrl}` != 'null');
    setCardRegistration(
      `${myDriver.licenseImageUrl}` != 'null' && `${myDriver.insurImageUrl}` != 'null',
    );
    if (myDriver.authYN == 'Y') {
      setApproved(true);
      setAuthTxt('* 드라이버 승인이 완료되었습니다.');
    }
    if (myDriver.authYN == 'R') {
      setAuthTxt('* 입력정보 불충분 및 기타사유로 승인이 거절되었습니다.');
    }
    setDisable(
      !myProfile.carNumber ||
        !myDriver.licenseNum ||
        !myDriver.insurCompany ||
        !myDriver.style ||
        !myDriver.bankNum,
    );

    Spinner.hide();
  };

  const onPressInsuranceInformation = () => {
    navigation.navigate(ROUTE_KEY.RegisterCarInsuranceInformation);
  };
  const onPressDriversLicenseInformation = () => {
    navigation.navigate(ROUTE_KEY.ActivitySettingLicense);
  };
  const onPressDesiredStyleInformation = () => {};
  const onPressAccountInformation = () => {};
  const onPressInformationRegistration = () => {};
  const onPressCardRegistration = () => {};

  const onPressSubmit = () => {};

  return (
    <FixedContainer>
      <CustomHeader text={strings.car_setting.title} />
      <ScrollView showsVerticalScrollIndicator={false} style={{marginHorizontal: 30}}>
        <View style={styles.container}>
          <View style={styles.carUpdateBtn}>
            <CustomText
              string="차량 정보"
              family={FONT_FAMILY.BOLD}
              color={colors.grayText}
              textStyle={styles.carInfoText}
            />
            <Image style={styles.image} source={ICONS.btn_round_checked} />
          </View>
          <View style={styles.carInfoContainer}>
            <View style={styles.carInfoItem}>
              <CustomText string="차량번호" textStyle={styles.carInfoText} />
              <CustomText string={carNum} textStyle={styles.carInfoText} color={colors.blackGray} />
            </View>
            <View style={styles.carInfoItem}>
              <CustomText string="차량모델" textStyle={styles.carInfoText} />
              <CustomText
                string={carModal}
                textStyle={styles.carInfoText}
                color={colors.blackGray}
              />
            </View>
            <View style={styles.carInfoItem}>
              <CustomText string="차량색상" textStyle={styles.carInfoText} />
              <CustomText
                string={carColor}
                textStyle={styles.carInfoText}
                color={colors.blackGray}
              />
            </View>
            <View style={styles.carInfoItem}>
              <CustomText string="차량연식" textStyle={styles.carInfoText} />
              <CustomText
                string={carYear}
                textStyle={styles.carInfoText}
                color={colors.blackGray}
              />
            </View>
            <CustomText
              size={FONT.CAPTION_2}
              color={colors.red1}
              family={FONT_FAMILY.SEMI_BOLD}
              string="위의 차량정보등록은 필수이며 해당차량(렌트,카셰어"
            />
            <View style={{height: heightScale(3)}} />
            <CustomText
              size={FONT.CAPTION_2}
              color={colors.red1}
              family={FONT_FAMILY.SEMI_BOLD}
              string="어링,연식10년이상,경차)은 이용 및 승인불가"
            />
          </View>
        </View>
        <SettingInsurance
          isApproved={isApproved}
          onPress={onPressInsuranceInformation}
          title={'보험 정보'}
          isCheck={insurance}
        />
        <SettingInsurance
          isApproved={isApproved}
          onPress={onPressDriversLicenseInformation}
          title={'운전면허 정보'}
          isCheck={driversLicense}
        />
        <SettingInsurance
          isApproved={isApproved}
          onPress={onPressDesiredStyleInformation}
          title={'원하는 스타일 정보'}
          isCheck={desiredStyle}
        />
        <SettingInsurance
          isApproved={isApproved}
          onPress={onPressAccountInformation}
          title={'계좌 정보'}
          isCheck={account}
        />
        <SettingInsurance
          isApproved={isApproved}
          onPress={onPressInformationRegistration}
          title={'차량정보 등록'}
          isCheck={informationRegistration}
        />
        <SettingInsurance
          isApproved={isApproved}
          onPress={onPressCardRegistration}
          title={'백신접종,명함 등록'}
          isCheck={cardRegistration}
        />
        {!!authTxt && (
          <CustomText size={FONT.BODY} string={authTxt} textStyle={styles.textBottom} />
        )}
      </ScrollView>

      <Button onPress={onPressSubmit} text={'완료'} disable={disable} />
    </FixedContainer>
  );
};

export default CarSetting;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 15,
    borderColor: '#E8473F',
    borderRadius: 10,
    padding: 20,
    borderWidth: widthScale(1.5),
  },
  carUpdateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  image: {
    width: widthScale(25),
    height: widthScale(25),
    backgroundColor: '#fff',
    borderRadius: 12.5,
    marginLeft: 'auto',
  },
  carInfoText: {
    marginLeft: 10,
  },
  carInfoContainer: {
    marginTop: 20,
  },
  carInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightScale(14),
  },
  carInfoLabel: {
    color: '#333',
    fontSize: 16,
    padding: 10,
    flex: 1,
  },
  textBottom: {
    textAlign: 'center',
    borderBottomColor: colors.black,
    marginBottom: heightScale(10),
    borderBottomWidth: widthScale(1.5),
    width: widthScale(300),
    alignSelf: 'center',
    marginTop: heightScale(10),
  },
});
