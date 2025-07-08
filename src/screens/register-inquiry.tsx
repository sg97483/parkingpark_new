import React, {useRef, useState} from 'react';
import {Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import Button from '~components/button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import ChooseInquiryDetail from '~components/register-inquiry/choose-inquiry-detail';
import {RefModal} from '~components/report-an-accident/popup-success-report';
import ButtonChooseBottom from '~components/way-to-work-registration/button-choose-bottom';
import {PADDING} from '~constants/constant';
import {strings} from '~constants/strings';
import {ImageProps} from '~constants/types';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {generateRandomId} from '~utils/encrypt';

const text = strings.register_inquiry;

const RegisterInquiry = (props: RootStackScreenProps<'RegisterInquiry'>) => {
  const {navigation} = props;

  const chooseInquiryDetailRef = useRef<RefModal>(null);
  const imagePickerRef = useRef<ImagePickerModalRefs>(null);

  const [typeInquiry, setTypeInquiry] = useState(text.inquiry[0]);
  const [image, setImage] = useState<ImageProps[]>([]);

  return (
    <FixedContainer>
      <CustomHeader text="문의하기" />
      <ScrollView style={styles.view}>
        <View style={styles.viewContent}>
          <CustomText string="상세신고내욕" />
          <ButtonChooseBottom
            onPress={() => chooseInquiryDetailRef.current?.show()}
            style={{marginTop: heightScale(10)}}
            text={typeInquiry}
            borderColor={colors.black}
          />
        </View>
        <View style={styles.viewContent}>
          <CustomText string="상세문의내용" />
          <View style={styles.viewInput}>
            <TextInput
              maxLength={50}
              placeholder="상세한 문의 내용을 입력해주세요."
              style={{flex: 1}}
              multiline
            />
          </View>
          <CustomText
            color={colors.disableButton}
            textStyle={{textAlign: 'right', margin: widthScale(5)}}
            string={'0/50'}
          />
        </View>
        <View style={styles.viewContent}>
          <CustomText string="사진첨부" />
          <CustomText
            textStyle={{marginTop: heightScale(4)}}
            string="사진첨부가 필요한 경우 사진을 함꼐 첨부 해주세요."
            color={colors.lineCancel}
          />
          <View style={{marginTop: heightScale(10)}}>
            <TouchableOpacity
              onPress={() => imagePickerRef.current?.show()}
              style={styles.imageCamera}>
              <Icons.Camera />
              <CustomText
                string={`${image?.length}/10`}
                textStyle={{marginTop: heightScale(4)}}
                color={colors.lineInput}
              />
            </TouchableOpacity>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal>
              {image?.map((item, i) => (
                <View style={styles.itemImage} key={generateRandomId()}>
                  <Image style={styles.image} source={{uri: item.uri}} />
                  <TouchableOpacity
                    onPress={() => {
                      const newImage = [...image];
                      newImage.splice(i, 1);
                      setImage(newImage);
                    }}
                    style={styles.buttonDelete}>
                    <Icons.IconX width={widthScale(16)} height={widthScale(16)} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
        <View style={styles.viewPolicy}>
          <View style={{flexDirection: 'row'}}>
            <CustomText color={colors.lineCancel} string=" • " />
            <CustomText
              textStyle={{flex: 1}}
              color={colors.lineCancel}
              string="취소의 경우 글의 작성 시간과 예약시간을 비교해 처리합니다."
            />
          </View>
          <View style={{flexDirection: 'row', marginVertical: heightScale(10)}}>
            <CustomText color={colors.lineCancel} string=" • " />
            <CustomText
              textStyle={{flex: 1}}
              color={colors.lineCancel}
              string="현장결제취소의 경우 현장 결제 영수증을 필히 첨부해주세요. 확인 후 추가적인 문자 안내가 진행됩니다."
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <CustomText color={colors.lineCancel} string=" • " />
            <CustomText
              textStyle={{flex: 1}}
              color={colors.lineCancel}
              string="차량번호 변경의 경우 변경원하시는 차량번호를 입력해주세요."
            />
          </View>
        </View>
        <Button onPress={() => {}} text="등록하기" style={styles.button} />
      </ScrollView>
      <ChooseInquiryDetail
        onChoose={setTypeInquiry}
        itemChoose={typeInquiry}
        ref={chooseInquiryDetailRef}
      />
      <ImagePickerModal ref={imagePickerRef} onImage={img => setImage([...image, img])} />
    </FixedContainer>
  );
};

export default RegisterInquiry;
const styles = StyleSheet.create({
  view: {
    paddingHorizontal: PADDING,
    marginTop: heightScale(20),
  },
  viewContent: {
    marginTop: heightScale(20),
  },
  viewInput: {
    padding: widthScale(15),
    height: heightScale(110),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.disableButton,
    marginTop: heightScale(10),
  },
  imageCamera: {
    width: widthScale(80),
    height: widthScale(80),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grayCheckBox,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: widthScale(10),
  },
  itemImage: {
    width: widthScale(80),
    height: widthScale(80),
    borderRadius: 8,
    marginRight: widthScale(10),
  },
  image: {width: widthScale(80), height: widthScale(80), borderRadius: 8},
  buttonDelete: {
    position: 'absolute',
    zIndex: 100,
    width: widthScale(24),
    height: widthScale(24),
    backgroundColor: colors.gray30,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    right: 0,
    margin: widthScale(2),
  },
  viewPolicy: {
    paddingHorizontal: PADDING,
    paddingVertical: heightScale(16),
    backgroundColor: colors.policy,
    borderRadius: 5,
    marginTop: heightScale(20),
  },
  button: {
    height: heightScale(55),
    borderRadius: 10,
    marginTop: heightScale(30),
  },
});
