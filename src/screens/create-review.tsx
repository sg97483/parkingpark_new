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
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import Spinner from '~components/spinner';
import {PADDING} from '~constants/constant';
import {EMIT_EVENT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ImageProps} from '~constants/types';
import {RootStackScreenProps} from '~navigators/stack';
import {
  useCreateBBSWithImageMutation,
  useCreateTextReviewMutation,
} from '~services/parkingServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

const CreateReview = memo((props: RootStackScreenProps<'CreateReview'>) => {
  const {navigation, route} = props;
  const imagePickerRef = useRef<ImagePickerModalRefs>(null);

  const [createTextReview] = useCreateTextReviewMutation();
  const [createBBSWithImage] = useCreateBBSWithImageMutation();

  const parkingData = route?.params?.parkingData;

  const userToken = useAppSelector(state => state?.userReducer?.userToken);
  const codeRegion = useAppSelector(state => state?.weatherReducer?.codeRegion);

  const [rating, setRating] = useState<number>(5);
  const [subject, setSubject] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [image, setImage] = useState<ImageProps | null>(null);

  const handleSave = () => {
    if (!parkingData?.id) {
      showMessage({
        message: '잘못된 경로의 접근입니다.',
      });
      return;
    }

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

    if (image?.uri) {
      Spinner.show();
      createBBSWithImage({
        photo: image,
        city: parkingData?.city,
        memberId: userToken?.id,
        memberPwd: userToken?.password,
        parkingLotId: parkingData?.id,
        state: parkingData?.state,
        subject: subject,
        text: details,
        _eval: `${rating}.0`,
      })
        .unwrap()
        .then(res => {
          if (res === '200') {
            navigation.goBack();
            DeviceEventEmitter.emit(EMIT_EVENT.ADD_REVIEW);
            Spinner.hide();
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
      Spinner.show();
      createTextReview({
        memberId: userToken?.id,
        memberPwd: userToken?.password,
        parkingLotId: parkingData?.id,
        city: codeRegion?.city || '',
        state: codeRegion?.state || '',
        subject: subject,
        text: details,
        _eval: `${rating}.0`,
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
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <FixedContainer>
        <CustomHeader text="후기쓰기" />
        <KeyboardAvoidingView style={styles.container}>
          {/* Rating */}
          <HStack>
            {Array.from({length: 5}).map((_, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setRating(index + 1);
                  }}
                  key={index}>
                  <Icon
                    name="star"
                    size={widthScale(30)}
                    color={index + 1 <= rating ? colors.yellow : colors.darkGray}
                  />
                </TouchableOpacity>
              );
            })}
          </HStack>

          {/* The subject */}
          <TextInput
            placeholder="제목을 입력해 주세요."
            style={styles.inputWrapper}
            value={subject}
            onChangeText={setSubject}
            placeholderTextColor={colors.grayText}
          />

          {/* Details */}
          <TextInput
            placeholder="내용을 입력해 주세요."
            multiline={true}
            style={[
              styles.inputWrapper,
              {
                minHeight: heightScale(200),
                textAlignVertical: 'top',
                maxHeight: heightScale(200),
              },
            ]}
            value={details}
            onChangeText={setDetails}
            placeholderTextColor={colors.grayText}
          />

          {/* Image */}
          <HStack style={{marginTop: PADDING}}>
            <TouchableOpacity onPress={() => imagePickerRef?.current?.show()}>
              <HStack style={styles.cameraWrapper}>
                <Icon name="camera" size={widthScale(20)} color={colors.white} />
                <CustomText string="사진 첨부하기" color={colors.white} />
              </HStack>
            </TouchableOpacity>
            <View style={styles.imageWrapper}>
              {image?.uri ? <Image source={{uri: image?.uri}} style={styles.image} /> : null}
            </View>
          </HStack>

          {/* Button */}
          <HStack style={styles.buttonContainer}>
            {/* Save */}
            <TouchableOpacity
              onPress={handleSave}
              style={[
                styles.buttonWrapper,
                {
                  backgroundColor: colors.blue,
                  marginRight: PADDING / 2,
                },
              ]}>
              <HStack>
                <Icon name="check-circle-outline" size={widthScale(18)} color={colors.white} />
                <CustomText string="저장" color={colors.white} textStyle={styles.buttonText} />
              </HStack>
            </TouchableOpacity>
            {/* Cancel */}
            <TouchableOpacity
              style={[
                styles.buttonWrapper,
                {
                  backgroundColor: colors.darkGray,
                },
              ]}
              onPress={() => navigation.goBack()}>
              <HStack>
                <Icon name="cancel" size={widthScale(18)} color={colors.white} />
                <CustomText string="취소" color={colors.white} textStyle={styles.buttonText} />
              </HStack>
            </TouchableOpacity>
          </HStack>
        </KeyboardAvoidingView>

        {/* Image Picker */}
        <ImagePickerModal
          ref={imagePickerRef}
          onImage={res => {
            setImage(res);
            imagePickerRef?.current?.hide();
          }}
        />
      </FixedContainer>
    </TouchableWithoutFeedback>
  );
});

export default CreateReview;

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
    flex: 1,
  },
  inputWrapper: {
    backgroundColor: colors.gray,
    padding: PADDING,
    marginTop: PADDING,
    fontFamily: FONT_FAMILY.REGULAR,
  },
  cameraWrapper: {
    backgroundColor: colors.red,
    height: heightScale(40),
    paddingHorizontal: PADDING,
    borderRadius: widthScale(5),
  },
  imageWrapper: {
    width: heightScale(40),
    height: heightScale(40),
    borderWidth: widthScale(0.5),
    borderColor: colors.gray,
    marginLeft: PADDING,
  },
  image: {
    width: heightScale(40),
    height: heightScale(40),
  },
  buttonContainer: {
    marginTop: 'auto',
    justifyContent: 'flex-end',
  },
  buttonWrapper: {
    height: heightScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: PADDING,
    borderRadius: widthScale(5),
  },
  buttonText: {
    marginLeft: widthScale(5),
  },
});
