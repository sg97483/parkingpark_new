import React, {memo, useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Checkbox from '~components/checkbox';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import Spinner from '~components/spinner';
import {PADDING} from '~constants/constant';
import {EMIT_EVENT, FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import {strings} from '~constants/strings';
import {ImageProps} from '~constants/types';
import {RootStackScreenProps} from '~navigators/stack';
import {
  useCreateBBSNoticeMutation,
  useCreateBBSWithImageMutation,
  useCreateTextReviewMutation,
} from '~services/parkingServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

const CreateBBS = memo((props: RootStackScreenProps<'CreateBBS'>) => {
  const {navigation} = props;
  const imagePickerModalRef = useRef<ImagePickerModalRefs>(null);

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const codeRegion = useAppSelector(state => state?.weatherReducer?.codeRegion);

  const [subject, setSubject] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [image, setImage] = useState<ImageProps | null>(null);
  const [isCreateNotice, setIsCreateNotice] = useState<boolean>(false);

  const [createTextBBS] = useCreateTextReviewMutation();
  const [createBBSWithImage] = useCreateBBSWithImageMutation();
  const [createBBSNotice] = useCreateBBSNoticeMutation();

  const handleSubmitBBS = () => {
    if (!subject) {
      showMessage({
        message: '제목을 입력해 주세요.',
      });
      return;
    }

    if (!details) {
      showMessage({
        message: '내용을 입력해 주세요.',
      });
      return;
    }
    Spinner.show();

    if (isCreateNotice) {
      createBBSNotice({
        memberId: userToken?.id,
        memberPwd: userToken?.password,
        photo: image,
        subject: subject,
        text: details,
      })
        .unwrap()
        .then(res => {
          if (res === '200') {
            DeviceEventEmitter.emit(EMIT_EVENT.ADD_REVIEW);
            navigation.goBack();
          } else {
            showMessage({
              message: strings?.general_text?.please_try_again,
            });
          }
        })
        .finally(() => {
          Spinner.hide();
        });
    } else {
      if (image?.uri) {
        createBBSWithImage({
          memberId: userToken?.id,
          memberPwd: userToken?.password,
          subject: subject,
          text: details,
          city: codeRegion?.city,
          state: codeRegion?.state,
          photo: image,
        })
          .unwrap()
          .then(res => {
            if (res === '200') {
              navigation.goBack();
              DeviceEventEmitter.emit(EMIT_EVENT.ADD_REVIEW);
            } else {
              showMessage({
                message: strings?.general_text?.please_try_again,
              });
            }
          })
          .finally(() => {
            Spinner.hide();
          });
      } else {
        createTextBBS({
          memberId: userToken?.id,
          memberPwd: userToken?.password,
          subject: subject,
          text: details,
          city: codeRegion?.city,
          state: codeRegion?.state,
        })
          .unwrap()
          .then(res => {
            if (res === '200') {
              navigation.goBack();
              DeviceEventEmitter.emit(EMIT_EVENT.ADD_REVIEW);
            } else {
              showMessage({
                message: strings?.general_text?.please_try_again,
              });
            }
          })
          .finally(() => {
            Spinner.hide();
          });
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <FixedContainer>
        <CustomHeader text="글쓰기" />
        <KeyboardAvoidingView style={styles.container}>
          <HStack>
            <View style={{flex: 1}}>
              <TextInput
                style={styles.input}
                placeholder="제목을 입력해 주세요."
                value={subject}
                onChangeText={setSubject}
                placeholderTextColor={colors.grayText}
              />
            </View>
            {userToken?.adminYN === IS_ACTIVE.YES ? (
              <TouchableOpacity
                onPress={() => {
                  setIsCreateNotice(!isCreateNotice);
                }}
                style={{marginLeft: widthScale(10)}}>
                <HStack>
                  <Checkbox
                    isChecked={isCreateNotice}
                    onPress={() => {
                      setIsCreateNotice(!isCreateNotice);
                    }}
                  />
                  <CustomText string=" 공지글" />
                </HStack>
              </TouchableOpacity>
            ) : null}
          </HStack>

          <TextInput
            style={[styles.input, styles.multilineInput]}
            multiline
            placeholder="내용을 입력해 주세요."
            value={details}
            onChangeText={setDetails}
            placeholderTextColor={colors.grayText}
          />

          <HStack style={styles.pickImageWrapper}>
            <TouchableOpacity onPress={() => imagePickerModalRef?.current?.show()}>
              <HStack style={styles.pickImageButtonWrapper}>
                <Icon name="camera" color={colors.white} size={widthScale(20)} />
                <CustomText
                  string="사진첨부하기"
                  color={colors.white}
                  textStyle={{marginLeft: widthScale(5)}}
                />
              </HStack>
            </TouchableOpacity>

            <View style={styles.imageWrapper}>
              {image ? <Image style={styles.image} source={{uri: image?.uri}} /> : null}
            </View>
          </HStack>
          <Divider />

          <HStack style={styles.buttonGroupWrapper}>
            <TouchableOpacity>
              <HStack style={styles.buttonWrapper}>
                <Icon
                  name="menu"
                  size={widthScale(15)}
                  color={colors.white}
                  style={{marginRight: 5}}
                />
                <CustomText string="목록" color={colors.white} />
              </HStack>
            </TouchableOpacity>
            <HStack>
              <TouchableOpacity>
                <HStack style={styles.buttonWrapper}>
                  <Icon
                    name="reload"
                    size={widthScale(15)}
                    color={colors.white}
                    style={{marginRight: 5}}
                  />
                  <CustomText string="취소" color={colors.white} />
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmitBBS} style={{marginLeft: widthScale(5)}}>
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
                  <CustomText string="저장" color={colors.white} />
                </HStack>
              </TouchableOpacity>
            </HStack>
          </HStack>
        </KeyboardAvoidingView>

        <ImagePickerModal
          ref={imagePickerModalRef}
          onImage={res => {
            setImage(res);
            setTimeout(() => {
              imagePickerModalRef?.current?.hide();
            }, 500);
          }}
        />
      </FixedContainer>
    </TouchableWithoutFeedback>
  );
});

export default CreateBBS;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: PADDING,
  },
  input: {
    backgroundColor: `${colors.gray}50`,
    padding: PADDING / 2,
    marginBottom: PADDING,
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: 14,
  },
  multilineInput: {
    minHeight: heightScale(250),
    textAlignVertical: 'top',
  },
  pickImageWrapper: {
    marginBottom: PADDING,
  },
  pickImageButtonWrapper: {
    backgroundColor: colors.red,
    height: heightScale(40),
    paddingHorizontal: PADDING / 2,
    borderRadius: widthScale(5),
  },
  imageWrapper: {
    borderWidth: 1,
    height: heightScale(40),
    aspectRatio: 1,
    overflow: 'hidden',
    marginLeft: PADDING,
    borderColor: colors.gray,
  },
  image: {
    height: heightScale(40),
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
