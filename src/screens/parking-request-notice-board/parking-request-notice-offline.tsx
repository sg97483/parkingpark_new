import React, {useRef, useState} from 'react';
import {DeviceEventEmitter, KeyboardAvoidingView, ScrollView, StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import CustomButton from '~components/commons/custom-button';
import CustomTextArea from '~components/commons/custom-text-area';
import ImageSelector2 from '~components/commons/image-selector2';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {IS_IOS, PADDING1} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ImageProps} from '~constants/types';
import {userHook} from '~hooks/userHook';
import {RootStackScreenProps} from '~navigators/stack';
import {useValetQnaBbsCreateMutation} from '~services/parkingServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1} from '~styles/scaling-utils';

const ParkingRequestNoticeOffline = (
  props: RootStackScreenProps<'ParkingRequestNoticeOffline'>,
) => {
  const {navigation} = props;

  const imagePickerRef = useRef<ImagePickerModalRefs>(null);
  const {userToken} = userHook();
  const [createQnaBbs, {isLoading}] = useValetQnaBbsCreateMutation();

  const [text, setText] = useState<string>('');
  const [photo, setPhoto] = useState<ImageProps | null>(null);

  const onSubmit = () => {
    if (!text) {
      showMessage({
        message: strings.add_parking_request_notice.please_enter_title,
      });
      return;
    }
    if (!photo) {
      showMessage({
        message: '현장 결제 영수증을 첨부해주세요.',
      });
      return;
    }

    createQnaBbs({
      memberId: userToken?.id,
      memberPwd: userToken?.password,
      subject: '현장결제취소',
      text,
      photo,
      parkingLotId: 70021, // 적절한 주차장 ID를 여기에 넣으세요
    })
      .unwrap()
      .then(res => {
        if (res === '200') {
          showMessage({
            message: '취소 요청 접수하였습니다. 접수내용은 고객센터 문의하기 내에 확인 가능합니다.',
          });

          DeviceEventEmitter.emit(EMIT_EVENT.RELOAD_QNA_BBS);
          navigation.goBack();
        } else {
          showMessage({
            message: strings?.general_text?.please_try_again,
          });
        }
      });
  };

  const isSubmitButtonDisabled = text.trim().length === 0 || !photo;

  return (
    <FixedContainer>
      <CustomHeader text="현장결제 취소 요청" />

      <KeyboardAvoidingView behavior={IS_IOS ? 'padding' : undefined} style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <PaddingHorizontalWrapper forDriveMe>
            <CustomText
              string="현장결제 영수증 등록"
              forDriveMe
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.BODY}
              lineHeight={heightScale1(20)}
              color={colors.black}
            />

            <ImageSelector2
              imageURI={photo}
              onImage={setPhoto}
              onRemovePress={() => setPhoto(null)}
            />
          </PaddingHorizontalWrapper>

          <PaddingHorizontalWrapper forDriveMe>
            <View style={styles.termsTextStyle}>
              <CustomText
                forDriveMe
                string="• 현장 결제일 및 금액, 카드승인번호가 확인 가능한 영수증을 첨부해주세요."
                color={colors.lineCancel}
                lineHeight={heightScale1(20)}
              />
            </View>
          </PaddingHorizontalWrapper>

          <PaddingHorizontalWrapper forDriveMe>
            <CustomTextArea
              title="상세 요청내용"
              placeholder="상세한 현장결제 취소 요청 내용을 입력해주세요."
              value={text}
              onChangeText={setText}
              maxLength={250}
            />
          </PaddingHorizontalWrapper>

          <PaddingHorizontalWrapper forDriveMe>
            <View style={styles.termsTextStyle}>
              <CustomText
                forDriveMe
                string="• 접수시점으로 영업일 기준 최대 10일 정도 소요되는점 참고 부탁드립니다. 최종 안내는 문자 안내 예정입니다."
                color={colors.lineCancel}
                lineHeight={heightScale1(20)}
              />
            </View>
          </PaddingHorizontalWrapper>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomButton
        onPress={onSubmit}
        text="취소 요청 접수하기"
        type="PRIMARY"
        buttonStyle={styles.submitButtonStyle}
        buttonHeight={59}
        disabled={isSubmitButtonDisabled}
        isLoading={isLoading}
      />

      <ImagePickerModal ref={imagePickerRef} onImage={setPhoto} />
    </FixedContainer>
  );
};

export default ParkingRequestNoticeOffline;

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingTop: PADDING1,
    gap: PADDING1,
  },
  termsTextStyle: {
    backgroundColor: colors.policy,
    paddingHorizontal: PADDING1,
    paddingVertical: heightScale1(13),
    borderRadius: scale1(4),
  },
  submitButtonStyle: {
    borderRadius: scale1(8),
    marginVertical: PADDING1 / 2,
    marginHorizontal: PADDING1,
  },
});
