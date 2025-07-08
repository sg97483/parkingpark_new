import {
  DeviceEventEmitter,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useRef, useState} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {PADDING, width} from '~constants/constant';
import {useAppSelector} from '~store/storeHooks';
import {IMAGES} from '~/assets/images-path';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '~styles/colors';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY, GENDER, IS_ACTIVE} from '~constants/enum';
import Divider from '~components/divider';
import MenuInput from '~components/user-edit-info/menu-input';
import MenuItem from '~components/user-profile/menu-item';
import HStack from '~components/h-stack';
import Checkbox from '~components/checkbox';
import {showMessage} from 'react-native-flash-message';
import {useEditUserInfoMutation} from '~services/userServices';
import {ROUTE_KEY} from '~navigators/router';
import {ImageProps} from '~constants/types';
import {getImageURL} from '~utils/getImageURL';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import {strings} from '~constants/strings';

const EditUserInfoOld = memo((props: RootStackScreenProps<'EditUserInfoOld'>) => {
  const {navigation} = props;
  const imagePickerRef = useRef<ImagePickerModalRefs>(null);

  const userData = useAppSelector(state => state?.userReducer?.user);
  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const [editUser] = useEditUserInfoMutation();

  const [photoID, setPhotoID] = useState<string>(userData?.photoId ? userData?.photoId : '');
  const [nickname, setNickname] = useState<string>(userData?.nic ? userData?.nic : '');
  const [age, setAge] = useState<string>(userData?.age ? `${userData?.age}` : '');
  const [gender, setGender] = useState<GENDER>(userData?.gender ? userData?.gender : GENDER.MALE);
  const [phone, setPhone] = useState<string>(userData?.pnum ? userData?.pnum : '');
  const [agreeMarketing, setAgreeMarketing] = useState<IS_ACTIVE>(
    userData?.agreeMarketingMailYN !== null && userData?.agreeMarketingSmsYN == IS_ACTIVE.YES
      ? IS_ACTIVE.YES
      : IS_ACTIVE.NO,
  );
  const [agreeHappyCall, setAgreeHappyCall] = useState<IS_ACTIVE>(
    userData?.agreeHappyCallYN ? userData?.agreeHappyCallYN : IS_ACTIVE.NO,
  );
  const [imagePath, setImagePath] = useState<ImageProps | null>(null);

  const handleUpdateUser = () => {
    if (!nickname) {
      showMessage({
        message: '이름을 입력해 주세요.',
      });
    }

    const body = {
      photo: imagePath,
      age: age || null,
      gender: gender,
      nickname: nickname,
      phone: phone,
      userID: userToken?.id,
      userPassword: userToken?.password,
      agreeHappyCall: agreeHappyCall,
      agreeMarketingMail: agreeMarketing,
      agreeMarketingSMS: agreeMarketing,
    };

    editUser(body as any)
      .unwrap()
      .then(res => {
        console.log('🚀 ~ file: edit-user-info.tsx:82 ~ .then ~ res', res);
        if (res === '200') {
          navigation.goBack();
          DeviceEventEmitter.emit('UPDATED_USER');
        } else {
          showMessage({
            message: strings.general_text.please_try_again,
          });
        }
      })
      .catch(error => {
        console.log('🚀 ~ file: edit-user-info.tsx:86 ~ handleUpdateUser ~ error', error);
      });
  };

  const onPressChangePassword = () => {
    navigation.navigate(ROUTE_KEY.ChangePassword);
  };

  return (
    <FixedContainer>
      <CustomHeader text="개인정보 수정" />

      <ScrollView style={styles.container}>
        {/* Avatar */}
        <View style={styles.profileImageWrapper}>
          {imagePath ? (
            <Image source={{uri: imagePath?.uri}} style={styles.profileImage} />
          ) : (
            <Image
              source={
                photoID
                  ? {
                      uri: getImageURL(Number(photoID), false),
                    }
                  : IMAGES.profile_face
              }
              style={styles.profileImage}
            />
          )}

          <TouchableOpacity
            onPress={() => {
              imagePickerRef?.current?.show();
            }}
            style={styles.upImageButtonWrapper}>
            <Icon name="camera" size={widthScale(15)} color={colors.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.infoWrapper}>
          <CustomText
            string={userData?.nic as string}
            size={FONT.BODY}
            family={FONT_FAMILY.SEMI_BOLD}
          />
          <CustomText
            string={`(${userData?.email})`}
            color={colors.darkGray}
            textStyle={{
              marginVertical: heightScale(5),
            }}
          />
          <CustomText string={userData?.pnum as string} color={colors.darkGray} />
        </View>

        <Divider />

        {/* Nickname */}
        <MenuInput
          title="닉네임"
          placeholder="닉네임"
          value={nickname}
          onChangeText={setNickname}
          placeholderTextColor={colors.grayText}
        />
        {/* Age */}
        <MenuInput
          title="나이"
          placeholder="나이"
          isNumPad
          value={age}
          onChangeText={setAge}
          placeholderTextColor={colors.grayText}
        />
        {/* Gender */}
        <HStack style={styles.genderWrapper}>
          <CustomText string="성별" family={FONT_FAMILY.SEMI_BOLD} />

          <HStack style={styles.genderContent}>
            {/* Male */}
            <TouchableOpacity
              style={{marginRight: widthScale(10)}}
              onPress={() => setGender(GENDER.MALE)}>
              <HStack>
                <Icon
                  name={
                    gender === GENDER?.MALE ? 'circle-slice-8' : 'checkbox-blank-circle-outline'
                  }
                  size={widthScale(20)}
                  color={colors.red}
                />
                <CustomText string="남자" textStyle={styles.genderText} />
              </HStack>
            </TouchableOpacity>

            {/* Female */}
            <TouchableOpacity onPress={() => setGender(GENDER.FEMALE)}>
              <HStack>
                <Icon
                  name={
                    gender === GENDER?.FEMALE ? 'circle-slice-8' : 'checkbox-blank-circle-outline'
                  }
                  size={widthScale(20)}
                  color={colors.red}
                />
                <CustomText string="여자" textStyle={styles.genderText} />
              </HStack>
            </TouchableOpacity>
          </HStack>
        </HStack>
        {/* Phone */}
        <MenuInput
          title="휴대폰 번호"
          placeholder="휴대폰 번호"
          isNumPad
          value={phone}
          onChangeText={setPhone}
          placeholderTextColor={colors.grayText}
        />
        {/* Change password */}
        <MenuItem title="비밀번호 변경" onPress={onPressChangePassword} />

        <HStack style={styles.checkboxWrapper}>
          {/* Consent to receive marketing SMS */}
          <HStack style={{marginRight: widthScale(15)}}>
            <Checkbox
              isChecked={agreeMarketing === IS_ACTIVE.YES}
              onPress={() => {
                if (agreeMarketing === IS_ACTIVE.NO) {
                  setAgreeMarketing(IS_ACTIVE.YES);
                } else {
                  setAgreeMarketing(IS_ACTIVE.NO);
                }
              }}
              checkedColor={colors.white}
              checkBackground={agreeMarketing === IS_ACTIVE.YES ? colors.red : colors.white}
            />
            <CustomText
              string="마케팅 SMS 수신 동의"
              size={FONT.CAPTION_2}
              textStyle={styles.checkboxText}
            />
          </HStack>
          {/* Agree to receive Happy Call */}
          <HStack>
            <Checkbox
              isChecked={agreeHappyCall === IS_ACTIVE.YES}
              onPress={() => {
                if (agreeHappyCall === IS_ACTIVE.NO) {
                  setAgreeHappyCall(IS_ACTIVE.YES);
                } else {
                  setAgreeHappyCall(IS_ACTIVE.NO);
                }
              }}
              checkedColor={colors.white}
              checkBackground={agreeHappyCall === IS_ACTIVE.YES ? colors.red : colors.white}
            />
            <CustomText
              string="해피콜 수신 동의"
              size={FONT.CAPTION_2}
              textStyle={styles.checkboxText}
            />
          </HStack>
        </HStack>
      </ScrollView>

      {/* Save */}
      <TouchableOpacity onPress={handleUpdateUser} style={styles.saveWrapper}>
        <CustomText string="저장하기" family={FONT_FAMILY.SEMI_BOLD} color={colors.red} />
      </TouchableOpacity>

      {/* Image picker */}
      <ImagePickerModal
        ref={imagePickerRef}
        onImage={value => {
          setImagePath(value);
        }}
      />
    </FixedContainer>
  );
});

export default EditUserInfoOld;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: PADDING,
  },
  profileImageWrapper: {
    width: widthScale(90),
    alignSelf: 'center',
  },
  profileImage: {
    width: widthScale(90),
    height: widthScale(90),
    alignSelf: 'center',
    borderRadius: 999,
  },
  upImageButtonWrapper: {
    backgroundColor: colors.red,
    width: widthScale(25),
    height: widthScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  infoWrapper: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: PADDING,
  },
  genderWrapper: {
    marginLeft: PADDING,
    minHeight: heightScale(50),
  },
  genderContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  genderText: {
    marginLeft: widthScale(5),
  },
  checkboxWrapper: {
    marginLeft: PADDING,
    minHeight: heightScale(50),
  },
  checkboxText: {
    marginLeft: widthScale(5),
  },
  saveWrapper: {
    height: heightScale(45),
    width: width * 0.65,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: widthScale(1),
    borderColor: colors.red,
    marginVertical: heightScale(5),
  },
});
