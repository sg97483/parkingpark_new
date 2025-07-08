import React, {useMemo, useRef, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import CustomButton from '~components/commons/custom-button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import CheckboxBorder from '~components/service-terms-and-conditions/checkbox-border';
import ItemCheckTerm from '~components/service-terms-and-conditions/item-check-term';
import Spinner from '~components/spinner';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheMyDriverInfo} from '~reducers/userReducer';
import {useCreateDriverMutation} from '~services/carpoolServices';
import {
  useCreateDriverImageMutation,
  useCreateDrivingRoadMutation,
  useCreateRidingRoadMutation,
  useLazyReadMyDriverQuery,
  useUpdateCMemberMutation,
  useUpdateDriverMutation,
} from '~services/userServices';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {InsuranceProps} from './carpool-insurance-rider';

const DiverAgreeActivity = (props: RootStackScreenProps<'DiverAgreeActivity'>) => {
  const {navigation, route} = props;

  const isPassenger = route.params?.isPassenger;

  const dispatch = useAppDispatch();

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const dataInsurance = useRef<InsuranceProps>({
    accept: {'1': false, '2': false, '3': false},
    jumin1: '',
    jumin2: '',
    realname: '',
  });

  const [termsDetail, setTermsDetail] = useState(false);
  const [privacyDetail, setPrivacyDetail] = useState(false);
  const [locationDetail, setLocationDetail] = useState(false);
  const [insuranceAgree, setInsuranceAgree] = useState(false);

  const [readMyDriver] = useLazyReadMyDriverQuery();
  const [createRidingRoad] = useCreateRidingRoadMutation();

  const [createDrivingRoad] = useCreateDrivingRoadMutation();
  const [createDriverImage] = useCreateDriverImageMutation();
  const [updateCMember] = useUpdateCMemberMutation();
  const [createDriver] = useCreateDriverMutation();
  const [updateDriver] = useUpdateDriverMutation();

  const isAllTermsConditions = useMemo(
    () => termsDetail && privacyDetail && locationDetail,
    [termsDetail, privacyDetail, locationDetail],
  );

  const disableButton = useMemo(
    () => termsDetail && privacyDetail && locationDetail && insuranceAgree,
    [termsDetail, privacyDetail, locationDetail, insuranceAgree],
  );

  const onPressCheckAllCarpool = () => {
    if (isAllTermsConditions) {
      setTermsDetail(false);
      setPrivacyDetail(false);
      setLocationDetail(false);
    } else {
      setTermsDetail(true);
      setPrivacyDetail(true);
      setLocationDetail(true);
    }
  };

  const onPressTermsCondition = (carpool: number) => {
    try {
      switch (carpool) {
        case 1:
          return navigation.navigate(ROUTE_KEY.CarpoolTermsDetail, {
            acceptCarpool: () => acceptCarpool(1),
            disagreeCarpool: () => setTermsDetail(false),
            isChecked: termsDetail,
          });
        case 2:
          return navigation.navigate(ROUTE_KEY.CarpoolPrivacyDetail, {
            acceptCarpool: () => acceptCarpool(2),
            disagreeCarpool: () => setPrivacyDetail(false),
            isChecked: privacyDetail,
          });
        case 3:
          return navigation.navigate(ROUTE_KEY.CarpoolLocationDetail, {
            acceptCarpool: () => acceptCarpool(3),
            disagreeCarpool: () => setLocationDetail(false),
            isChecked: locationDetail,
          });
        case 4:
          return navigation.navigate(ROUTE_KEY.CarpoolInsuranceRider, {
            acceptCarpool: data => acceptCarpool(4, data),
            disagreeCarpool: data => {
              setInsuranceAgree(false);
              dataInsurance.current = data;
            },
            data: dataInsurance.current,
          });
      }
    } catch (error) {}
  };

  const acceptCarpool = (carpool: number, data4?: InsuranceProps) => {
    switch (carpool) {
      case 1:
        return setTermsDetail(true);
      case 2:
        return setPrivacyDetail(true);
      case 3:
        return setLocationDetail(true);
      case 4:
        if (data4) {
          dataInsurance.current = data4;
        }
        return setInsuranceAgree(true);
    }
  };

  const onPressButton = () => {
    Spinner.show();
    createDriver({memberId: userToken.id!, termsYN: 'N'})
      .unwrap()
      .then(async () => {
        await updateDriver({memberId: userToken.id?.toString()});
        await updateCMember({memberId: userToken.id?.toString(), termsYN: 'Y'});

        const myDriver = await readMyDriver({memberId: userToken.id?.toString()}).unwrap();
        const idDriver = myDriver?.id?.toString();

        dispatch(cacheMyDriverInfo(myDriver));

        await createRidingRoad({c_memberId: idDriver}).unwrap();
        await createDrivingRoad({c_memberId: idDriver}).unwrap();

        const driverImage = await createDriverImage({c_memberId: idDriver}).unwrap();
        if (driverImage?.statusCode == '200') {
          if (isPassenger) {
            navigation.replace(ROUTE_KEY.BusinessCardAndVaccineRegistration, {
              isDriver: false,
            });
          } else {
            navigation.replace(ROUTE_KEY.DriverRegister);
          }
        }
      })
      .finally(() => Spinner.hide());
  };

  return (
    <FixedContainer>
      <CustomHeader
        text={isPassenger ? '약관동의' : '탑승객 약관 동의'}
        headerTextStyle={styles.textHeader}
      />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: heightScale1(30),
        }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.viewPolicy}>
          <CustomText
            forDriveMe
            size={FONT.CAPTION_9}
            family={FONT_FAMILY.SEMI_BOLD}
            string={strings.service_terms_and_conditions.content}
            textStyle={styles.textTitle}
            lineHeight={heightScale1(31)}
          />
          <CheckboxBorder
            onPress={onPressCheckAllCarpool}
            text={'약관 전체 동의'}
            isChecked={isAllTermsConditions}
            style={{marginBottom: PADDING1}}
          />

          <View style={{gap: heightScale1(10)}}>
            <ItemCheckTerm
              text={'[필수]  태워줘 서비스 이용약관'}
              isChecked={termsDetail}
              onPress={() => onPressTermsCondition(1)}
            />
            <ItemCheckTerm
              text={'[필수]  개인정보 처리방침'}
              isChecked={privacyDetail}
              onPress={() => onPressTermsCondition(2)}
            />
            <ItemCheckTerm
              text={'[필수]  위치기반 이용 약관'}
              isChecked={locationDetail}
              onPress={() => onPressTermsCondition(3)}
            />
          </View>
        </View>

        <CheckboxBorder
          style={styles.buttonAgree2}
          onPress={() => onPressTermsCondition(4)}
          text={'(무료)태워줘-카풀 안심보험 가입동의'}
          isChecked={insuranceAgree}
        />

        <View style={styles.viewPolicy2}>
          <ItemCheckTerm
            text={'[필수]  "태워줘" 카풀안심보험 안내'}
            isChecked={insuranceAgree}
            onPress={() => onPressTermsCondition(4)}
          />

          <View style={styles.viewPolicy1}>
            <CustomText
              forDriveMe
              color={colors.grayText}
              string={strings.service_terms_and_conditions.policy.title}
            />
            {strings.service_terms_and_conditions.policy.content.map(item => (
              <View style={{flexDirection: 'row'}} key={item.content}>
                <CustomText
                  forDriveMe
                  color={colors.grayText}
                  string={` • ${item.title} : ${item.content}`}
                  family={FONT_FAMILY.MEDIUM}
                  lineHeight={heightScale1(20)}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <PaddingHorizontalWrapper
        containerStyles={{marginBottom: PADDING1 / 2, marginTop: heightScale1(10)}}
        forDriveMe>
        <CustomButton
          onPress={onPressButton}
          text={'확인'}
          type="PRIMARY"
          disabled={!disableButton}
          buttonHeight={58}
        />
      </PaddingHorizontalWrapper>
    </FixedContainer>
  );
};

export default DiverAgreeActivity;

const styles = StyleSheet.create({
  textHeader: {
    textAlign: 'center',
  },
  buttonAgree: {
    marginHorizontal: widthScale1(30),
    marginTop: heightScale1(20),
  },
  buttonAgree2: {
    marginHorizontal: PADDING1,
    marginTop: heightScale1(30),
    marginBottom: PADDING1,
  },
  viewPolicy: {
    marginHorizontal: widthScale1(20),
  },
  viewPolicy2: {
    marginHorizontal: widthScale1(20),
  },
  textContent: {
    marginVertical: heightScale1(2.5),
    lineHeight: heightScale1(18),
  },
  text: {
    marginHorizontal: -widthScale1(30),
    marginTop: heightScale1(10),
  },
  textTitle: {
    marginVertical: PADDING1,
  },
  viewPolicy1: {
    backgroundColor: colors.policy,
    paddingVertical: heightScale1(16),
    paddingHorizontal: PADDING1,
    borderRadius: 5,
    marginTop: heightScale1(19),
  },
});
