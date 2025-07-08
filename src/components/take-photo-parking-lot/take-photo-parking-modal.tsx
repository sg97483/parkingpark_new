import {useKeyboard} from '@react-native-community/hooks';
import moment from 'moment';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import Button from '~components/button';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import {height, IS_IOS, width} from '~constants/constant';
import {strings} from '~constants/strings';
import {ImageProps, PhotoOfParkingProps} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {formatKoreanDate} from '~utils/format';

export interface TakePhotoParkingModalRefs {
  show: (image: ImageProps) => void;
}

interface IProps {
  handleAddImage: (image: PhotoOfParkingProps) => void;
}

const TakePhotoParkingModal = forwardRef(({handleAddImage}: IProps, ref) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [image, setImage] = useState<ImageProps | null>(null);
  const [imageTitle, setImageTitle] = useState<string>('');

  const keyboard = useKeyboard();

  const show = (photo: ImageProps) => {
    setImage(photo);
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
    setImage(null);
    setImageTitle(''); // 모달 숨길 때 이미지 제목도 초기화
  };

  useImperativeHandle(
    ref,
    () => ({
      show,
    }),
    [],
  );

  const onSubmit = () => {
    let img: PhotoOfParkingProps = {
      name: imageTitle,
      uri: image?.uri,
      date: formatKoreanDate(moment()),
    };
    handleAddImage(img);
    hide();
  };

  return (
    <Modal
      isVisible={isVisible}
      avoidKeyboard={true}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onBackButtonPress={hide}
      onBackdropPress={hide}
      useNativeDriver
      useNativeDriverForBackdrop
      customBackdrop={
        <TouchableWithoutFeedback onPress={hide}>
          <View style={{backgroundColor: 'black', ...Dimensions.get('screen')}} />
        </TouchableWithoutFeedback>
      }
      style={styles.modalStyle}>
      {/* 👇 이 부분이 수정되었습니다. (그림자를 담당하는 View로 감싸기) */}
      <View style={styles.shadowContainer}>
        <View style={styles.contentWrapper}>
          {/* Image */}
          <View style={styles.imageContainer}>
            <Image source={{uri: image?.uri}} style={styles.image} resizeMode="cover" />
          </View>

          {/* Footer */}
          <View
            style={[
              styles.footer,
              {
                // 키보드가 올라올 때 iOS와 Android 간의 높이 차이 및 기본 여백 고려
                marginBottom: keyboard.keyboardShown
                  ? keyboard.keyboardHeight - heightScale(IS_IOS ? 40 : 20) // 키보드 높이에서 일부 값을 빼서 조정
                  : 0,
              },
            ]}>
            <Divider style={{height: heightScale(16)}} />

            {/* input */}
            <View style={styles.inputContainer}>
              <CustomText
                string={strings.take_photo_parking_modal.enter_parking_location}
                textStyle={styles.inputTitle}
                color={colors.heavyGray}
              />
              <TextInput
                value={imageTitle}
                onChangeText={setImageTitle}
                style={styles.inputStyle}
                placeholder={strings.take_photo_parking_modal.place_holder_text_input}
                placeholderTextColor={colors.gray}
                multiline
              />
            </View>

            {/* submit button */}
            <View style={styles.buttonWrapper}>
              <Button
                text={strings.take_photo_parking_modal.confirm_submit_photo}
                onPress={onSubmit}
                color={colors.pink}
                textColor={colors.white}
                style={styles.button}
                borderColor={'transparent'}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
});

export default TakePhotoParkingModal;

const styles = StyleSheet.create({
  modalStyle: {
    // 기존 container 스타일에서 Modal 자체에 적용될 스타일로 변경
    margin: 0,
    justifyContent: 'center', // 컨텐츠를 화면 중앙으로 (필요에 따라 조정)
    alignItems: 'center', // 컨텐츠를 화면 중앙으로 (필요에 따라 조정)
  },
  // 그림자를 담당하는 외부 컨테이너
  shadowContainer: {
    width: width * 0.85,
    height: height * 0.9,
    alignSelf: 'center',
    shadowColor: `${colors.gray}90`,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3, // 표준적인 그림자 투명도 값으로 조정
    shadowRadius: 5.62,
    elevation: 8,
    // borderRadius: heightScale(10), // 그림자가 borderRadius를 따르도록 추가 (선택사항)
  },
  // 실제 내용을 담는 내부 컨테이너
  contentWrapper: {
    flex: 1, // shadowContainer를 꽉 채우도록
    backgroundColor: colors.white,
    overflow: 'hidden',
    borderRadius: heightScale(10), // 내용이 둥근 모서리를 따르도록
  },
  image: {
    width: '100%',
    height: '100%',
  },
  footer: {
    // height는 내용에 따라 유동적으로 변경될 수 있으므로 minHeight 또는 제거 고려
    // height: heightScale(240),
  },
  imageContainer: {
    flex: 1,
  },
  // textTitle 스타일은 현재 사용되지 않음
  // textTitle: {
  //   flexDirection: 'column',
  //   alignItems: 'flex-start',
  // },
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: heightScale(20), // 버튼 하단 여백 추가
  },
  button: {
    width: widthScale(150),
  },
  inputStyle: {
    width: '95%',
    minHeight: heightScale(40), // 한 줄일 때 너무 작아지지 않도록
    maxHeight: heightScale(100), // 여러 줄일 때 너무 커지지 않도록
    borderBottomWidth: 1,
    borderBottomColor: `${colors.darkGray}80`,
    paddingHorizontal: widthScale(10),
    paddingVertical: heightScale(5), // 패딩 추가
    marginTop: heightScale(12),
    color: colors.black,
    textAlignVertical: 'top', // multiline 사용시 텍스트 상단 정렬
  },
  inputTitle: {
    marginLeft: widthScale(12),
  },
  inputContainer: {
    paddingVertical: heightScale(20),
  },
});
