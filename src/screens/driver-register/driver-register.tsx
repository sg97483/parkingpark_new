import React, {useCallback, useEffect, useMemo} from 'react';
import {DeviceEventEmitter, ScrollView, StyleSheet, View} from 'react-native';
import CustomButton from '~components/commons/custom-button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import CarCardRegister from '~components/driver-register/car-card-register';
import CarImageRegister from '~components/driver-register/car-image-register';
import CarInformation from '~components/driver-register/car-information-register';
import CarStyleRegister from '~components/driver-register/car-style-register';
import CarRegisterGuide from '~components/driver-register/car-register-guide';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import Spinner from '~components/spinner';
import {PADDING1} from '~constants/constant';
import {DRIVER_STATUS_REGISTRATION, EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheIsInitialAddNewCar} from '~reducers/userReducer';
import {useReadMyCarpoolInfoQuery} from '~services/carpoolServices';
import {useUpdateDriverAuthMutation} from '~services/userServices';
import {useAppDispatch} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import CarQuickRegister from '~components/driver-register/car-quick-register';

const DriverRegister = (props: RootStackScreenProps<'DriverRegister'>) => {
  const text = strings.driver_register;
  const {navigation} = props;
  const dispatch = useAppDispatch();
  const {userID, myDriverInfo, user} = userHook();
  const {data: dataCarpool, refetch} = useReadMyCarpoolInfoQuery({memberId: userID as number});

  const isPendingCarInfo = useMemo(
    () => (user?.carModel && user?.carYear && user?.carNumber ? true : false),
    [user],
  );

  useEffect(() => {
    if (!isPendingCarInfo) {
      dispatch(cacheIsInitialAddNewCar(true));
    }
  }, []);

  // refetch data carpool
  useEffect(() => {
    const reloadDataCarpool = DeviceEventEmitter.addListener(
      EMIT_EVENT.REFETCH_DATA_CARPOOL,
      () => {
        refetch();
      },
    );
    return () => reloadDataCarpool.remove();
  }, []);

  const [updateDriverAuth] = useUpdateDriverAuthMutation();

  // handle update status register
  const handleUpdateDriverAuth = () => {
    Spinner.show();

    updateDriverAuth({authYN: 'C', memberId: userID?.toString()})
      .unwrap()
      .then(() => {})
      .finally(() => {
        Spinner.hide();
        navigation.navigate(ROUTE_KEY.DriverWaitingApproved);
      });
  };

  // render status PENDING - APPROVED - REJECTED
  const renderStatus = (status: DRIVER_STATUS_REGISTRATION) => {
    switch (status) {
      case DRIVER_STATUS_REGISTRATION.APPROVED:
        return (
          <CustomText
            string={text.approved}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_6}
            color={colors.heavyGray}
            lineHeight={fontSize1(20)}
            forDriveMe
          />
        );
      case DRIVER_STATUS_REGISTRATION.REJECTED:
        return (
          <CustomText
            string={text.rejected}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_6}
            color={colors.rejectText}
            lineHeight={fontSize1(20)}
            forDriveMe
          />
        );
      case DRIVER_STATUS_REGISTRATION.PENDING:
        return (
          <CustomText
            string={text.complete_register}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_6}
            color={colors.heavyGray}
            forDriveMe
            lineHeight={fontSize1(20)}
          />
        );
      default:
        return;
    }
  };

  // list style
  const onStyles = (str: string) => {
    switch (str) {
      case 'A':
        return 0;
      case 'B':
        return 1;
      case 'C':
        return 2;
      case 'D':
        return 3;
      default:
        return 4;
    }
  };

  const listStyle = useCallback(() => {
    let number = [];
    let arr = myDriverInfo?.style as string;

    for (let index = 0; index < (arr.length as number); index++) {
      const str = onStyles(arr[index]);
      number.push(str);
    }

    const sGender = strings.driver_register.gender_data[number[0]];
    const sDrive = strings.driver_register.style_into_car_data[number[1]];
    const sGoPlane = strings.driver_register.go_plane_data[number[2]];
    const sRoutineDriver = strings.driver_register.routine_driver_data[number[3]];
    const arrStyle = [sGender, sDrive, sGoPlane, sRoutineDriver];

    return arrStyle;
  }, [myDriverInfo]);

  const isPendingPayment = useMemo(
    () =>
      (myDriverInfo?.bankName &&
        myDriverInfo?.bankNum &&
        myDriverInfo?.pName &&
        myDriverInfo?.bankImageUrl &&
        myDriverInfo?.calYN === 'M') ||
      myDriverInfo?.calYN === 'C'
        ? true
        : false,
    [myDriverInfo],
  );

  const isPendingLicense = useMemo(
    () =>
      myDriverInfo?.licenseEndDate &&
      myDriverInfo?.licenseNum &&
      myDriverInfo?.licenseAuthNum &&
      myDriverInfo?.licenseKind &&
      myDriverInfo?.licenseImageUrl &&
      myDriverInfo?.profileImageUrl
        ? true
        : false,
    [myDriverInfo],
  );

  const isPendingCarImage = useMemo(
    () =>
      myDriverInfo?.carImageUrl &&
      myDriverInfo?.carImageUrl2 &&
      myDriverInfo?.carImageUrl3 &&
      myDriverInfo?.carImageUrl4
        ? true
        : false,
    [myDriverInfo],
  );
  const isPendingInsurance = useMemo(
    () =>
      myDriverInfo?.insurCompany &&
      myDriverInfo?.insurEndDate &&
      myDriverInfo?.insurImageUrl &&
      myDriverInfo?.insurPersonalAmt &&
      myDriverInfo?.insurPropertyAmt &&
      myDriverInfo?.insurDriverYN
        ? true
        : false,
    [myDriverInfo],
  );

  const isPendingBcVc = useMemo(
    () =>
      !!myDriverInfo?.bcImageUrl &&
      !!dataCarpool?.coAddress &&
      !!dataCarpool?.coName &&
      !!dataCarpool?.job &&
      !!dataCarpool?.jobType,
    [myDriverInfo, dataCarpool],
  );

  // handle status
  const handleRenderStatus = (auth: any, isRegister: boolean) => {
    if (!auth && !isRegister) {
      return DRIVER_STATUS_REGISTRATION.NOT_COMPLETE;
    }

    switch (auth) {
      case 'R':
        return DRIVER_STATUS_REGISTRATION.REJECTED;
      case 'Y':
        return DRIVER_STATUS_REGISTRATION.APPROVED;
      default:
        return DRIVER_STATUS_REGISTRATION.PENDING;
    }
  };

  const isPendingFavorite = useMemo(() => (myDriverInfo?.style ? true : false), [myDriverInfo]);

  const isPendingRegister = useMemo(
    () =>
      isPendingBcVc ||
      isPendingCarImage ||
      isPendingCarInfo ||
      isPendingInsurance ||
      isPendingLicense ||
      isPendingPayment ||
      isPendingFavorite,
    [
      isPendingBcVc,
      isPendingCarImage,
      isPendingFavorite,
      isPendingCarInfo,
      isPendingInsurance,
      isPendingLicense,
      isPendingPayment,
    ],
  );

  return (
    <FixedContainer>
      <CustomHeader text={text.driver_information_register} />

      <ScrollView
        contentContainerStyle={{backgroundColor: colors.gray3}}
        showsVerticalScrollIndicator={false}>
        <PaddingHorizontalWrapper
          containerStyles={{
            paddingBottom: heightScale1(25),
          }}
          forDriveMe>
          {/* quick 등록 */}

          {myDriverInfo?.insurAuthYN === 'N' &&
          myDriverInfo?.carAuthYN === 'N' &&
          myDriverInfo?.calAuthYN === 'N' &&
          myDriverInfo?.vcAuthYN === 'N' &&
          myDriverInfo?.licenseAuthYN === 'N' ? (
            <CarQuickRegister
              onPress={() => navigation.navigate(ROUTE_KEY.CarPhotoRegistration)}
              statusText={renderStatus(
                handleRenderStatus(myDriverInfo?.carAuthYN, isPendingCarImage),
              )}
              status={handleRenderStatus(myDriverInfo?.carAuthYN, isPendingCarImage)}
              isPending={isPendingCarImage}
              driverInfo={myDriverInfo}
            />
          ) : null}

          {/* car information */}
          <CarInformation
            onPress={() => navigation.navigate(ROUTE_KEY.VehicleRegistration)}
            statusText={renderStatus(handleRenderStatus(myDriverInfo?.carAuthYN, isPendingCarInfo))}
            status={handleRenderStatus(myDriverInfo?.carAuthYN, isPendingCarInfo)}
            isPending={isPendingCarInfo}
          />

          {/* car images */}
          <CarImageRegister
            onPress={() => navigation.navigate(ROUTE_KEY.CarPhotoRegistration)}
            statusText={renderStatus(
              handleRenderStatus(myDriverInfo?.carAuthYN, isPendingCarImage),
            )}
            status={handleRenderStatus(myDriverInfo?.carAuthYN, isPendingCarImage)}
            isPending={isPendingCarImage}
            driverInfo={myDriverInfo}
          />

          {/* car methods */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            {/* license */}
            <CarCardRegister
              title={text.vehicle_license}
              content={text.please_sign_up_vehicle_license}
              onPress={() => navigation.navigate(ROUTE_KEY.DriverLicenseRegistration)}
              containerStyle={{width: '48%'}}
              status={handleRenderStatus(myDriverInfo?.licenseAuthYN, isPendingLicense)}
              statusText={renderStatus(
                handleRenderStatus(myDriverInfo?.licenseAuthYN, isPendingLicense),
              )}
              isPending={isPendingLicense}
            />

            {/* insurance */}
            <CarCardRegister
              title={text.insurance_infor}
              content={text.please_sign_up_insurance_infor}
              onPress={() => navigation.navigate(ROUTE_KEY.DriverInsuranceRegistration)}
              containerStyle={{width: '48%'}}
              status={handleRenderStatus(myDriverInfo?.insurAuthYN, isPendingInsurance)}
              statusText={renderStatus(
                handleRenderStatus(myDriverInfo?.insurAuthYN, isPendingInsurance),
              )}
              isPending={isPendingInsurance}
            />

            {/* payment */}
            <CarCardRegister
              title={text.choose_payment}
              content={text.please_choose_payment_when_drive_and_sign_up}
              onPress={() => navigation.navigate(ROUTE_KEY.DriverPaymentRegistration)}
              containerStyle={{width: '48%'}}
              status={handleRenderStatus(myDriverInfo?.calAuthYN, isPendingPayment)}
              statusText={renderStatus(
                handleRenderStatus(myDriverInfo?.calAuthYN, isPendingPayment),
              )}
              isPending={isPendingPayment}
            />

            {/* vaccine & business card  */}
            <CarCardRegister
              title={text.register_vacxin_and_business_card}
              content={text.please_sign_up_vacxin_certification_and_card}
              onPress={() =>
                navigation.navigate(ROUTE_KEY.BusinessCardAndVaccineRegistration, {isDriver: true})
              }
              containerStyle={{width: '48%'}}
              status={handleRenderStatus(myDriverInfo?.vcAuthYN, isPendingBcVc)}
              statusText={renderStatus(handleRenderStatus(myDriverInfo?.vcAuthYN, isPendingBcVc))}
              isPending={isPendingBcVc}
            />
          </View>

          {/* car style */}
          <CarStyleRegister
            title={text.style_you_want}
            content={text.please_sign_up_style_you_want}
            onPress={() => navigation.navigate(ROUTE_KEY.DriverFavoriteRegistration)}
            statusText={renderStatus(DRIVER_STATUS_REGISTRATION.PENDING)}
            status={DRIVER_STATUS_REGISTRATION.PENDING}
            isPending={isPendingFavorite}
            favoriteList={isPendingFavorite ? listStyle() : ['']}
          />

          {myDriverInfo?.insurAuthYN === 'Y' &&
          myDriverInfo?.carAuthYN === 'Y' &&
          myDriverInfo?.calAuthYN === 'Y' &&
          myDriverInfo?.vcAuthYN === 'Y' &&
          myDriverInfo?.licenseAuthYN === 'Y' ? (
            <CarRegisterGuide content={text.style_register_guide} />
          ) : null}
        </PaddingHorizontalWrapper>
      </ScrollView>

      {!(
        myDriverInfo?.insurAuthYN === 'Y' &&
        myDriverInfo?.carAuthYN === 'Y' &&
        myDriverInfo?.calAuthYN === 'Y' &&
        myDriverInfo?.vcAuthYN === 'Y' &&
        myDriverInfo?.licenseAuthYN === 'Y'
      ) && (
        <CustomButton
          type="PRIMARY"
          text={isPendingRegister ? '승인요청' : '저장하기'}
          onPress={handleUpdateDriverAuth}
          buttonHeight={58}
          buttonStyle={styles.buttonStyle}
          disabled={
            isPendingCarImage &&
            isPendingCarInfo &&
            isPendingInsurance &&
            isPendingLicense &&
            isPendingPayment &&
            isPendingBcVc &&
            !!myDriverInfo?.style
              ? false
              : true
          }
        />
      )}
    </FixedContainer>
  );
};

export default DriverRegister;

const styles = StyleSheet.create({
  buttonStyle: {
    marginHorizontal: PADDING1,
    marginBottom: PADDING1 / 2,
    marginTop: heightScale1(10),
  },
});
