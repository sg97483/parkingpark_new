import React, {useMemo, useRef, useState} from 'react';
import {DeviceEventEmitter, KeyboardAvoidingView, ScrollView, StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import CustomButton from '~components/commons/custom-button';
import CustomTextArea from '~components/commons/custom-text-area';
import ImageSelector from '~components/commons/image-selector';
import SelectBox from '~components/commons/select-box';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import ParkingQuestionNoticeSubjectSelector, {
  ParkingQuestionNoticeSubjectSelectorRefs,
} from '~components/parking-question-notice-board/parking-question-notice-subject-selector';
import {IS_IOS, PADDING1} from '~constants/constant';
import {REPORT_QNA_LIST} from '~constants/data';
import {EMIT_EVENT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ImageProps, ReportTypeModel} from '~constants/types';
import {userHook} from '~hooks/userHook';
import {RootStackScreenProps} from '~navigators/stack';
import {useValetQnaBbsCreateMutation} from '~services/parkingServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

const ParkingRequestNoticeAdd = (props: RootStackScreenProps<'ParkingRequestNoticeAdd'>) => {
  const {navigation} = props;

  const imagePickerRef = useRef<ImagePickerModalRefs>(null);
  const subjectSelectorRef = useRef<ParkingQuestionNoticeSubjectSelectorRefs>(null);
  const {userToken} = userHook();
  const [createQnaBbs, {isLoading}] = useValetQnaBbsCreateMutation();

  const [subject, setSubject] = useState<ReportTypeModel>(REPORT_QNA_LIST[0]);
  const [text, setText] = useState<string>('');
  const [photo, setPhoto] = useState<ImageProps | null>(null);

  const onSubmit = () => {
    if (!subject) {
      showMessage({
        message: strings.add_parking_request_notice.please_enter_title,
      });
      return;
    }
    if (!text) {
      showMessage({
        message: strings.add_parking_request_notice.please_enter_title,
      });
      return;
    }

    createQnaBbs({
      memberId: userToken?.id,
      memberPwd: userToken?.password,
      subject: subject?.title,
      text,
      photo,
      parkingLotId: subject?.value,
    })
      .unwrap()
      .then(res => {
        if (res === '200') {
          DeviceEventEmitter.emit(EMIT_EVENT.RELOAD_QNA_BBS);
          navigation.goBack();
        } else {
          showMessage({
            message: strings?.general_text?.please_try_again,
          });
        }
      });
  };

  const getTermsText = useMemo(() => {
    switch (subject?.title) {
      case '취소':
        return '• 취소의 경우 글의 작성 시간과 예약시간을 비교해 처리합니다.';
      case '현장결제취소':
        return '• 현장결제취소의 경우 승인번호가 기재된 현장 결제 영수증을 필히 첨부해주세요. 확인 후 추가적인 문자 안내가 진행됩니다.';
      case '차량번호변경':
        return '• 차량번호 변경의 경우 변경원하시는 차량번호를 입력해주세요.';
      case '입차시간변경':
        return '• 입차시간 변경의 경우 변경 원하시는 입차시간을 입력해주세요.';
      default:
        return '';
    }
  }, [subject?.title]);

  const isSubmitButtonDisabled = useMemo(() => {
    if (subject?.title === '현장결제취소') {
      return text?.trim()?.length === 0 || !photo;
    }
    return text?.trim()?.length === 0;
  }, [subject?.title, text, photo]);

  return (
    <FixedContainer>
      <CustomHeader text="주차 문의하기" />

      <KeyboardAvoidingView behavior={IS_IOS ? 'padding' : undefined} style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <PaddingHorizontalWrapper forDriveMe>
            <SelectBox
              onPress={() => {
                subjectSelectorRef?.current?.show(subject);
              }}
              title="상세문의내역"
              value={subject?.title}
            />
          </PaddingHorizontalWrapper>

          <PaddingHorizontalWrapper forDriveMe>
            {getTermsText && (
              <View style={styles.termsTextStyle}>
                <CustomText
                  forDriveMe
                  string={getTermsText}
                  color={colors.lineCancel}
                  lineHeight={heightScale1(20)}
                />
              </View>
            )}
          </PaddingHorizontalWrapper>

          <PaddingHorizontalWrapper forDriveMe>
            <CustomTextArea
              title="상세문의내용"
              placeholder="상세한 문의 내용을 입력해주세요."
              value={text}
              onChangeText={setText}
              maxLength={250}
            />
          </PaddingHorizontalWrapper>

          <PaddingHorizontalWrapper forDriveMe>
            <CustomText
              string="사진첨부 (현장결제취소관련 문의시 필수)"
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
              imageURI={photo}
              onImage={setPhoto}
              onRemovePress={() => setPhoto(null)}
            />
          </PaddingHorizontalWrapper>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomButton
        onPress={onSubmit}
        text="등록하기"
        type="PRIMARY"
        buttonStyle={styles.submitButtonStyle}
        buttonHeight={59}
        disabled={isSubmitButtonDisabled}
        isLoading={isLoading}
      />

      <ImagePickerModal ref={imagePickerRef} onImage={setPhoto} />

      <ParkingQuestionNoticeSubjectSelector ref={subjectSelectorRef} onItemPress={setSubject} />
    </FixedContainer>
  );
};

export default ParkingRequestNoticeAdd;

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingTop: PADDING1,
    gap: PADDING1,
  },
  menuWrapperStyle: {
    marginBottom: PADDING1,
  },
  inputWrapper: {
    padding: PADDING1,
    borderWidth: 1,
    borderRadius: scale1(8),
    marginVertical: heightScale1(10),
    borderColor: colors.disableButton,
    height: heightScale1(110),
  },
  inputStyle: {
    fontSize: fontSize1(14),
    fontFamily: FONT_FAMILY.REGULAR,
  },
  imageWrapperStyle: {
    width: widthScale1(80),
    aspectRatio: 1,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale1(4),
    borderColor: colors.disableButton,
  },
  submitButtonStyle: {
    borderRadius: scale1(8),
    marginVertical: PADDING1 / 2,
    marginHorizontal: PADDING1,
  },
  removeButtonStyle: {
    width: widthScale1(20),
    height: widthScale1(20),
    borderRadius: 999,
    backgroundColor: colors.gray30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: scale1(2),
    right: scale1(2),
  },
  termsTextStyle: {
    backgroundColor: colors.policy,
    paddingHorizontal: PADDING1,
    paddingVertical: heightScale1(16),
    borderRadius: scale1(4),
  },
});
