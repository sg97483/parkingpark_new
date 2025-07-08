import React, {useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '~components/commons/custom-button';
import CustomCheckbox from '~components/commons/custom-checkbox';
import CustomTextArea from '~components/commons/custom-text-area';
import ImageSelector from '~components/commons/image-selector';
import PageButton from '~components/commons/page-button';
import SelectBox from '~components/commons/select-box';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import SelectReportTypeModal, {
  SelectReportTypeModalRefs,
} from '~components/select-report-type-modal';
import {IS_IOS, PADDING1} from '~constants/constant';
import {FONT_FAMILY, REPORT_TYPE} from '~constants/enum';
import {ImageProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useBlockUserMutation, useReportUserMutation} from '~services/carpoolServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {REPORT_DRIVER_DATA} from './report-driver-step-1';
import {userHook} from '~hooks/userHook';
import HStack from '~components/h-stack';

const ReportDriverStep2 = (props: RootStackScreenProps<'ReportDriverStep2'>) => {
  const {navigation, route} = props;
  const {reportType, routeID, driverID} = route?.params;
  const selectTypeRef = useRef<SelectReportTypeModalRefs>(null);
  const {myDriverInfo, userToken} = userHook();

  const paymentAccountNumber = useMemo(() => myDriverInfo?.bankNum, [myDriverInfo?.bankNum]);
  const paymentBankName = useMemo(() => myDriverInfo?.bankName, [myDriverInfo?.bankName]);
  const paymentOwnerName = useMemo(() => myDriverInfo?.pName, [myDriverInfo?.pName]);
  const isRegisterdCard = useMemo(
    () => paymentAccountNumber !== '' && paymentBankName !== '' && paymentOwnerName !== '',
    [paymentAccountNumber, paymentBankName, paymentOwnerName],
  );

  const [createReportDriver, {isLoading}] = useReportUserMutation();
  const [blockDriver] = useBlockUserMutation();

  const [selectedType, setSelectedType] = useState<REPORT_TYPE>(
    reportType || REPORT_TYPE.NOT_APPEAR_AT_CARPOOL,
  );
  const [reportDetail, setReportDetail] = useState<string>('');
  const [image, setImage] = useState<ImageProps | null>();
  const [isBlockUser, setIsBlockUser] = useState<boolean>(false);

  const cancellationReason = useMemo((): string => {
    switch (selectedType) {
      case REPORT_TYPE.NOT_APPEAR_AT_CARPOOL:
        return '드라이버님이 카풀 약속 장소에 나타나지 않으셨나요?\n\n카풀 서비스 당일 드라이버 귀책 사유로 인해서 운행이 취소가 된 경우 탑승객의 결제금액은 자동으로 환불 처리되며, 운행이 취소가 되어 손해를 보신 부분에 대해 실손 보상 차원에서 결제하신 금액의 2배를 드라이버를 통해 탑승객에게 지급될수 있도록 처리합니다.\n\n해당 노쇼로 인한 신고하기는 운행 당일로 부터 7일이내로만 접수 가능합니다. 해당 보상 지급의 경우 신고 접수후 평일 영업일 기준 10일 이내로 처리됩니다.';
      case REPORT_TYPE.CARPOOL_VEHICLE_IS_DIFFERENT:
        return '드라이버의 차량이 등록된 정보와 다른가요?\n\n서비스내 승인된 차량과 다른 차량으로 카풀을 운행할경우 서비스 이용 제제를 받을수 있습니다.\n\n파킹박고객센터에서 확인후 신고하기가 접수되면 해당드라이버에게는 1회의 경고 조치가 진행되며 3회 이상 누적시 태워줘 서비스 이용이 제한됩니다.';
      case REPORT_TYPE.UNPLEASANT_CONVERSATION:
        return '어떤 상황에서든 카풀운행중 비하/조롱/모욕/반말 등 상대방을 불쾌하게 만드는 언행을 하면 서비스 이용 제제를 받을수 있습니다.\n\n파킹박고객센터에서 확인후 신고하기가 접수되면 해당드라이버에게는 1회의 경고 조치가 진행되며 3회 이상 누적시 태워줘 서비스 이용이 제한됩니다.';
      case REPORT_TYPE.ADDITIONAL_PAYMENT_REQUEST:
        return '카풀 운행에 대해 태워줘 채팅 밖에서 거래를 요구하는 경우 서비스 이용 제제를 받을수 있습니다.\n\n파킹박 고객센터로 신고해주시면 서비스내에서 할수 있는 모든 조치를 취해 최대한 도움을 드리겠습니다.\n\n파킹박고객센터에서 확인후 신고하기가 접수되면 해당드라이버에게는 1회의 경고 조치가 진행되며 3회 이상 누적시 태워줘 서비스 이용이 제한됩니다.';
      case REPORT_TYPE.ACCIDENT_OCCURRED:
        return '카풀 운행중 차량사고 및 접촉사고가 발생하셨나요?\n\n차량사고 발생에 대한 신고접수는 실질적인 차량사고 접수를 진행하는게 아닌 사실 확인을 위한 용도로만 쓰여짐을 안내드립니다.\n\n신고 접수해주시면 서비스내에서 할수 있는 모든 조치를 취해 최대한 도움을 드리겠습니다. 실제 사고 보험 접수는 차량에 가입된 보험사로 접수하셔야합니다.';
      case REPORT_TYPE.OTHER:
        return '앞의 신고 항목에서 적당한 사유를 찾지 못하셔나요?.\n\n아래에 신고내용을 작성해주세요.\n파킹박에서 확인후 신고해주신 내용을 바탕으로\n신고처리가 진행됩니다.\n추후 정기적으로 검토하여 심고항목 개선에 활요됩니다.';
      default:
        return '';
    }
  }, [selectedType]);

  const handleSubmit = async () => {
    const body = {
      gubun: 'REPORT_DRIVER',
      rdId: routeID as number,
      subject: REPORT_DRIVER_DATA.find(item => item?.value === selectedType)?.title,
      text: reportDetail.trim(),
      photo: image,
      memberId: userToken?.id as number,
      memberPwd: userToken?.password as string,
      bankName: paymentBankName as string,
      bankNum: paymentAccountNumber as string,
      pName: paymentOwnerName as string,
    };

    if (isBlockUser) {
      await blockDriver({
        blockMId: driverID,
        memberId: userToken?.id as number,
      });
    }

    createReportDriver(body as any)
      .unwrap()
      .then(res => {
        console.log('🚀 ~ handleSubmit ~ res:', res);

        if (res !== '200') {
          showMessage({
            message: '오류가 발생했습니다. 다시 확인해 주세요.',
          });
          return;
        } else {
          showMessage({
            message: '드라이버 신고가 완료되었습니다.',
          });
          navigation.navigate(ROUTE_KEY.ParkingParkHome, {
            selectedTab: 1,
          });
        }
      });
  };

  return (
    <FixedContainer>
      <CustomHeader text="신고하기" />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        extraScrollHeight={110}
        contentContainerStyle={styles.containerStyle}>
        <SelectBox
          title="상세신고내역"
          value={REPORT_DRIVER_DATA.find(item => item?.value === selectedType)?.title}
          placeholderText=""
          onPress={() => selectTypeRef?.current?.show(selectedType)}
        />

        {/* Cancellation reason */}
        <View style={styles.cancellationReasonWrapper}>
          <CustomText
            forDriveMe
            lineHeight={heightScale1(20)}
            color={colors.grayText2}
            string={cancellationReason}
          />
        </View>

        {selectedType === REPORT_TYPE.NOT_APPEAR_AT_CARPOOL ? (
          <View style={styles.insuranceButtonStyle}>
            {isRegisterdCard && (
              <View
                style={{
                  marginBottom: heightScale1(10),
                  gap: heightScale1(10),
                }}>
                <CustomText
                  forDriveMe
                  family={FONT_FAMILY.MEDIUM}
                  color={colors.black}
                  string="계좌정보등록"
                />
                <HStack>
                  <CustomText
                    forDriveMe
                    family={FONT_FAMILY.MEDIUM}
                    color={colors.grayText}
                    textStyle={{
                      minWidth: widthScale1(69),
                    }}
                    string="계좌번호 "
                  />
                  <CustomText
                    color={colors.black}
                    forDriveMe
                    string={`${paymentBankName} ${paymentAccountNumber}`}
                  />
                </HStack>
                <HStack>
                  <CustomText
                    forDriveMe
                    family={FONT_FAMILY.MEDIUM}
                    color={colors.grayText}
                    textStyle={{
                      minWidth: widthScale1(69),
                    }}
                    string="예금주 "
                  />
                  <CustomText color={colors.black} forDriveMe string={paymentOwnerName ?? ''} />
                </HStack>
              </View>
            )}
            <PageButton
              text={
                isRegisterdCard
                  ? '정산 계좌 정보 변경'
                  : '실손 보상 받으실 계좌정보를 등록해주세요.'
              }
              onPress={() => {
                navigation.navigate(ROUTE_KEY.PaymentRegistration);
              }}
            />
          </View>
        ) : null}

        {/* Report detail */}
        <CustomTextArea
          title="상세신고내용"
          value={reportDetail}
          onChangeText={setReportDetail}
          placeholder="상세한 신고 내용을 입력해주세요."
        />

        {/* Image */}
        <View style={{marginBottom: PADDING1}}>
          <CustomText
            string="사진첨부"
            forDriveMe
            family={FONT_FAMILY.MEDIUM}
            lineHeight={heightScale1(20)}
            color={colors.black}
          />
          <CustomText
            string="사진첨부가 필요한 경우 사진을 함께 첨부 해주세요."
            forDriveMe
            color={colors.lineCancel}
            family={FONT_FAMILY.MEDIUM}
            textStyle={{
              marginBottom: heightScale1(10),
              marginTop: heightScale1(4),
            }}
            lineHeight={heightScale1(20)}
          />

          <ImageSelector
            imageURI={image as ImageProps}
            mode="ADD"
            onImage={setImage}
            onRemovePress={() => {
              setImage(null);
            }}
          />
        </View>

        {/* Block user */}
        {selectedType === REPORT_TYPE.UNPLEASANT_CONVERSATION ||
        selectedType === REPORT_TYPE.ADDITIONAL_PAYMENT_REQUEST ? (
          <CustomText
            string="해당 내용으로 신고하면 서로의 계정이 차단되며 더이상 상대방과 카풀을 진행할수 없습니다."
            color={colors.grayText}
            forDriveMe
            lineHeight={heightScale1(20)}
          />
        ) : (
          <CustomCheckbox
            isChecked={isBlockUser}
            onPress={() => setIsBlockUser(!isBlockUser)}
            text="이 드라이버 차단하기"
          />
        )}

        <CustomText
          textStyle={{
            marginVertical: heightScale1(20),
          }}
          color={colors.grayText}
          string="(‘내정보 > 환경설정 > 차단 사용자 관리’에서 차단을 취소 할수 있습니다.)"
          forDriveMe
          lineHeight={heightScale1(20)}
        />
      </KeyboardAwareScrollView>

      <CustomButton
        buttonStyle={styles.submitButtonWrapperStyle}
        text="신고하기"
        buttonHeight={59}
        onPress={handleSubmit}
        disabled={
          !cancellationReason ||
          reportDetail.trim()?.length === 0 ||
          (selectedType === REPORT_TYPE.NOT_APPEAR_AT_CARPOOL &&
            (!paymentAccountNumber || !paymentBankName || !paymentOwnerName))
        }
        isLoading={isLoading}
      />

      <SelectReportTypeModal
        ref={selectTypeRef}
        type="REPORT_DRIVER"
        onSelectedType={setSelectedType}
      />
    </FixedContainer>
  );
};

export default ReportDriverStep2;

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: PADDING1,
    paddingTop: heightScale1(20),
  },
  submitButtonWrapperStyle: {
    marginHorizontal: PADDING1,
    marginBottom: PADDING1 / 2,
    marginTop: heightScale1(10),
  },
  cancellationReasonWrapper: {
    backgroundColor: colors.policy,
    padding: PADDING1,
    borderRadius: scale1(8),
    marginBottom: heightScale1(20),
    marginTop: heightScale1(10),
  },
  insuranceButtonStyle: {
    marginBottom: heightScale1(20),
  },
  inputStyle: {
    height: heightScale1(110),
    padding: PADDING1,
    borderWidth: 1,
    borderRadius: scale1(8),
    borderColor: colors.disableButton,
    paddingTop: IS_IOS ? PADDING1 : undefined,
    fontSize: fontSize1(15),
    fontFamily: FONT_FAMILY.REGULAR,
    marginTop: heightScale1(10),
  },
  imageWrapper: {
    marginBottom: heightScale1(20),
  },
  addImageButton: {
    width: widthScale1(80),
    height: widthScale1(80),
    borderWidth: 1,
    borderRadius: scale1(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.grayCheckBox,
  },
  imageStyle: {
    width: widthScale1(80),
    height: widthScale1(80),
    borderRadius: scale1(8),
    marginLeft: widthScale1(4),
  },
  closeButton: {
    width: widthScale1(24),
    height: widthScale1(24),
    position: 'absolute',
    backgroundColor: `${colors.heavyGray}70`,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    right: widthScale1(5),
    top: widthScale1(5),
  },
});
