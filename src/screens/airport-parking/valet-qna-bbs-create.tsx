import React, {memo, useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import Spinner from '~components/spinner';
import {HEIGHT, PADDING, PADDING_HEIGHT} from '~constants/constant';
import {EMIT_EVENT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ImageProps} from '~constants/types';
import {RootStackScreenProps} from '~navigators/stack';
import {useValetQnaBbsCreateMutation} from '~services/parkingServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

const ValetQnaBbsCreate = memo((props: RootStackScreenProps<'ValetQnaBbsCreate'>) => {
  const {route, navigation} = props;

  const parkID = route?.params?.parkID;

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const imagePickerModalRef = useRef<ImagePickerModalRefs>(null);

  const [createQnaBbs] = useValetQnaBbsCreateMutation();

  const [subject, setSubject] = useState<string>('');

  const [text, setText] = useState<string>('');

  const [photo, setPhoto] = useState<ImageProps | null>(null);

  const handleSubmit = () => {
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

    Spinner.show();
    const body = {
      memberId: userToken?.id,
      memberPwd: userToken?.password,
      subject: encodeURIComponent(subject),
      text: encodeURIComponent(text),
      photo,
      parkingLotId: parkID,
    };
    createQnaBbs(body)
      .unwrap()
      .then(res => {
        Spinner.hide();
        if (res === '200') {
          navigation.goBack();
          DeviceEventEmitter.emit(EMIT_EVENT.CHANGE_QNA_BBS_REPLY_LIST);
        } else {
          showMessage({
            message: strings?.general_text?.please_try_again,
          });
          return;
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
      <CustomHeader text={strings.valet_qna_bbs_create.header} />

      <KeyboardAvoidingView style={styles.container}>
        <ScrollView style={{marginBottom: PADDING}} showsVerticalScrollIndicator={false}>
          <TextInput
            style={[styles.input, {width: '70%'}]}
            placeholder={strings.valet_qna_bbs_create.place_holder_title}
            value={subject}
            onChangeText={setSubject}
            placeholderTextColor={colors.grayText}
          />
          <TextInput
            style={[styles.input, styles.multilineInput]}
            multiline
            placeholder={strings.valet_qna_bbs_create.place_holder_info_detail}
            value={text}
            onChangeText={setText}
            placeholderTextColor={colors.grayText}
          />

          <HStack style={styles.pickImageWrapper}>
            <TouchableOpacity onPress={() => imagePickerModalRef?.current?.show()}>
              <HStack style={styles.pickImageButtonWrapper}>
                <Icon name="camera" color={colors.white} size={widthScale(20)} />
                <CustomText
                  string={strings.general_text.upload_photo}
                  color={colors.white}
                  textStyle={{marginLeft: widthScale(5)}}
                />
              </HStack>
            </TouchableOpacity>

            <View style={styles.imageWrapper}>
              {photo ? <Image style={styles.image} source={{uri: photo?.uri}} /> : null}
            </View>
          </HStack>
          <Divider />

          <HStack style={styles.buttonGroupWrapper}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <HStack style={styles.buttonWrapper}>
                <Icon
                  name="menu"
                  size={widthScale(15)}
                  color={colors.white}
                  style={{marginRight: 5}}
                />
                <CustomText string={strings.general_text.list} color={colors.white} />
              </HStack>
            </TouchableOpacity>

            <HStack>
              <TouchableOpacity onPress={handleCancel}>
                <HStack style={styles.buttonWrapper}>
                  <Icon
                    name="reload"
                    size={widthScale(15)}
                    color={colors.white}
                    style={{marginRight: 5}}
                  />
                  <CustomText string={strings.general_text.revoke} color={colors.white} />
                </HStack>
              </TouchableOpacity>

              <TouchableOpacity style={{marginLeft: widthScale(5)}} onPress={handleSubmit}>
                <HStack
                  style={[
                    styles.buttonWrapper,
                    {
                      backgroundColor: colors.blue,
                    },
                  ]}>
                  <Icon
                    name="download-outline"
                    size={widthScale(15)}
                    color={colors.white}
                    style={{marginRight: 5}}
                  />
                  <CustomText string={strings.general_text.storage} color={colors.white} />
                </HStack>
              </TouchableOpacity>
            </HStack>
          </HStack>
        </ScrollView>
      </KeyboardAvoidingView>

      <ImagePickerModal ref={imagePickerModalRef} onImage={setPhoto} />
    </FixedContainer>
  );
});

export default ValetQnaBbsCreate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: PADDING,
  },
  input: {
    backgroundColor: `${colors.gray}50`,
    padding: PADDING / 2,
    marginBottom: PADDING / 2,
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: 14,
  },
  multilineInput: {
    minHeight: HEIGHT * 0.5,
    textAlignVertical: 'top',
  },
  pickImageWrapper: {
    marginBottom: PADDING,
    marginTop: PADDING_HEIGHT / 2,
  },
  pickImageButtonWrapper: {
    backgroundColor: colors.red,
    height: heightScale(40),
    paddingHorizontal: PADDING / 2,
    borderRadius: widthScale(5),
  },
  imageWrapper: {
    borderWidth: 1,
    height: heightScale(50),
    aspectRatio: 1,
    overflow: 'hidden',
    marginLeft: PADDING,
    borderColor: colors.gray,
  },
  image: {
    height: heightScale(50),
    aspectRatio: 1,
  },
  buttonGroupWrapper: {
    justifyContent: 'space-between',
    marginTop: PADDING,
  },
  buttonWrapper: {
    backgroundColor: colors.darkGray,
    minHeight: heightScale(35),
    paddingHorizontal: PADDING / 2,
    borderRadius: widthScale(5),
  },
});
