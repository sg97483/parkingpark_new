import React, {useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {showMessage} from 'react-native-flash-message';
import {Icons} from '~/assets/svgs';
import CustomButton from '~components/commons/custom-button';
import CustomInput from '~components/commons/custom-input';
import CustomTextArea from '~components/commons/custom-text-area';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {IS_IOS, PADDING1} from '~constants/constant';
import {EMIT_EVENT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ImageProps} from '~constants/types';
import {userHook} from '~hooks/userHook';
import {RootStackScreenProps} from '~navigators/stack';
import {useValetQnaBbsCreateMutation} from '~services/parkingServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

const CarpoolRequestQNA = (props: RootStackScreenProps<'CarpoolRequestQNA'>) => {
  const {navigation, route} = props;
  const mode = route?.params?.mode;

  const imagePickerRef = useRef<ImagePickerModalRefs>(null);
  const [createQnaBbs, {isLoading}] = useValetQnaBbsCreateMutation();
  const {userToken} = userHook();

  const [subject, setSubject] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [photo, setPhoto] = useState<ImageProps | null>(null);

  const onSubmit = () => {
    Keyboard.dismiss();
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
      subject: subject,
      text,
      photo,
      parkingLotId: mode === 'DRIVER' ? 70031 : 70032,
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

  return (
    <FixedContainer>
      <CustomHeader text={mode === 'DRIVER' ? '드라이버 문의하기' : '탑승객 문의하기'} />

      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={IS_IOS ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.containerStyle}>
          <CustomInput
            value={subject}
            onChangeText={setSubject}
            maxLength={20}
            title="문의내용"
            placeholder="문의할 내용의 제목을 입력해주세요."
          />

          <CustomTextArea
            title="상세문의내용"
            placeholder="상세한 문의 내용을 입력해주세요."
            value={text}
            onChangeText={setText}
            maxLength={250}
          />

          <View style={styles.menuSectionStyle}>
            <View>
              <CustomText forDriveMe string="사진첨부" />
              <CustomText
                forDriveMe
                string="사진첨부가 필요한 경우 사진을 함꼐 첨부 해주세요."
                color={colors.lineCancel}
                textStyle={{
                  marginTop: heightScale1(4),
                }}
              />
            </View>
            {photo ? (
              <View style={styles.imageWrapperStyle}>
                <FastImage
                  source={{
                    uri: photo?.uri,
                  }}
                  style={styles.imageWrapperStyle}
                />
                <Pressable
                  onPress={() => setPhoto(null)}
                  hitSlop={40}
                  style={styles.removeButtonStyle}>
                  <Icons.IconX
                    width={widthScale1(16)}
                    height={widthScale1(16)}
                    stroke={colors.white}
                  />
                </Pressable>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  imagePickerRef?.current?.show();
                }}
                style={styles.imageWrapperStyle}>
                <Icons.Camera stroke={colors.disableButton} />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        <PaddingHorizontalWrapper forDriveMe>
          <CustomButton
            onPress={onSubmit}
            text="등록하기"
            buttonStyle={styles.submitButtonStyle}
            disabled={subject?.trim()?.length === 0 || text?.trim()?.length === 0}
            buttonHeight={58}
            isLoading={isLoading}
          />
        </PaddingHorizontalWrapper>
      </KeyboardAvoidingView>

      <ImagePickerModal ref={imagePickerRef} onImage={setPhoto} />
    </FixedContainer>
  );
};

export default CarpoolRequestQNA;

const styles = StyleSheet.create({
  containerStyle: {
    padding: PADDING1,
    gap: PADDING1,
  },
  subjectStyle: {
    minHeight: heightScale1(48),
    borderWidth: 1,
    borderRadius: scale1(8),
    paddingHorizontal: widthScale1(16),
    borderColor: colors.disableButton,
    fontSize: fontSize1(14),
    fontFamily: FONT_FAMILY.REGULAR,
  },
  menuSectionStyle: {
    gap: heightScale1(10),
  },
  contentViewStyle: {
    borderWidth: 1,
    borderRadius: scale1(8),
    paddingHorizontal: widthScale1(16),
    paddingVertical: heightScale1(15),
    borderColor: colors.disableButton,
  },
  contentInputStyle: {
    minHeight: heightScale1(80),
    fontSize: fontSize1(14),
    fontFamily: FONT_FAMILY.REGULAR,
    maxHeight: heightScale1(150),
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
    marginBottom: PADDING1 / 2,
    marginTop: heightScale1(10),
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
});
