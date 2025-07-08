import {useKeyboard} from '@react-native-community/hooks';
import {useNavigation} from '@react-navigation/native';
import React, {memo, useState} from 'react';
import {
  DeviceEventEmitter,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import ParkingQuestionNoticeUploadPhoto from '~components/parking-question-notice-board/parking-question-notice-upload-photo';
import ParkingRequestNoticeFooter from '~components/parking-question-notice-board/parking-request-notice-footer';
import Spinner from '~components/spinner';
import {IS_IOS, PADDING, height} from '~constants/constant';
import {EMIT_EVENT} from '~constants/enum';
import {strings} from '~constants/strings';
import {ImageProps} from '~constants/types';
import {RootStackScreenProps, UseRootStackNavigation} from '~navigators/stack';
import {useCreateValetMainNoticeMutation} from '~services/valetParkingServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

const ValetMainNoticeCreate = memo((props: RootStackScreenProps<'ValetMainNoticeCreate'>) => {
  const navigation: UseRootStackNavigation = useNavigation();
  const userToken = useAppSelector(state => state?.userReducer?.userToken);
  const [createValetMainNotice] = useCreateValetMainNoticeMutation();

  const [subject, setSubject] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [photo, setPhoto] = useState<ImageProps | null>(null);

  const keyboard = useKeyboard();

  const handleSubmit = () => {
    if (!subject) {
      showMessage({
        message: strings.add_parking_request_notice.please_enter_title,
      });
      return;
    }
    if (!text) {
      showMessage({
        message: strings.add_parking_request_notice.please_enter_info_detail,
      });
      return;
    }

    const body = {
      memberId: userToken?.id,
      memberPwd: userToken?.password,
      subject,
      text,
      photo: photo as ImageProps,
    };
    Spinner.show();
    createValetMainNotice(body)
      .unwrap()
      .then(res => {
        Spinner.hide();
        if (res === '200') {
          navigation.goBack();
          DeviceEventEmitter.emit(EMIT_EVENT.VALET_MAIN_NOTICE);
        } else {
          showMessage({
            message: strings?.general_text?.please_try_again,
          });
        }
      });
  };

  const handleCancel = () => {
    setSubject('');
    setText('');
    setPhoto(null);
  };

  return (
    <FixedContainer>
      <CustomHeader text={strings.add_parking_request_notice.write} />

      <KeyboardAvoidingView behavior={IS_IOS ? 'padding' : undefined}>
        <ScrollView
          style={[
            styles.content,
            {
              marginBottom: keyboard.keyboardShown ? PADDING * 2 : PADDING / 2,
            },
          ]}
          contentContainerStyle={{
            flexGrow: 1,
          }}>
          <View
            style={{
              marginBottom: keyboard.keyboardShown ? PADDING * 2 : PADDING / 2,
            }}>
            {/* title */}
            <TextInput
              value={subject}
              onChangeText={setSubject}
              placeholder={strings.add_parking_request_notice.please_enter_title}
              placeholderTextColor={colors.darkGray}
              style={styles.inputTitle}
              multiline
            />

            {/* info detail */}
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={strings.add_parking_request_notice.please_enter_info_detail}
              placeholderTextColor={colors.darkGray}
              style={styles.inputInfoDetail}
              textAlignVertical={'top'}
              multiline
            />

            {/* upload photo */}
            <ParkingQuestionNoticeUploadPhoto
              photo={photo}
              onRemove={() => setPhoto(null)}
              onSelect={setPhoto}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* footer */}
      <ParkingRequestNoticeFooter
        handleBack={() => navigation.goBack()}
        containerStyle={styles.footer}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
      />
    </FixedContainer>
  );
});

export default ValetMainNoticeCreate;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: PADDING / 2,
  },
  inputTitle: {
    backgroundColor: `${colors.gray}80`,
    minHeight: heightScale(50),
    color: colors.black,
    width: '60%',
    paddingHorizontal: widthScale(10),
  },
  inputInfoDetail: {
    backgroundColor: `${colors.gray}80`,
    height: height * 0.65,
    color: colors.black,
    width: '100%',
    paddingHorizontal: widthScale(10),
    marginTop: heightScale(10),
  },
  button: {
    width: widthScale(80),
    marginTop: heightScale(12),
    borderRadius: widthScale(5),
  },
  footer: {},
});
