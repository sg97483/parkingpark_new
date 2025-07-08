import React, {memo, useMemo, useRef, useState} from 'react';
import {DeviceEventEmitter, Pressable, StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Icons} from '~/assets/svgs';
import Avatar from '~components/commons/avatar';
import CustomInput from '~components/commons/custom-input';
import LineButton from '~components/commons/line-button';
import CustomHeader from '~components/custom-header';
import GenderSelector from '~components/edit-user-info/gender-selector';
import FixedContainer from '~components/fixed-container';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import Spinner from '~components/spinner';
import {PADDING} from '~constants/constant';
import {GENDER} from '~constants/enum';
import {strings} from '~constants/strings';
import {ImageProps} from '~constants/types';
import {userHook} from '~hooks/userHook';
import {RootStackScreenProps} from '~navigators/stack';
import {useEditUserInfoMutation} from '~services/userServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {getImageURL} from '~utils/getImageURL';

const EditUserInfo = memo((props: RootStackScreenProps<'EditUserInfo'>) => {
  const {navigation} = props;
  const imagePickerRef = useRef<ImagePickerModalRefs>(null);

  const {user: userData, userToken} = userHook();

  const [editUser, {isLoading}] = useEditUserInfoMutation();

  const photoID = useMemo(() => userData?.photoId, [userData?.photoId]);

  const [nickname, setNickname] = useState<string>(userData?.nic ? userData?.nic : '');
  const [age, setAge] = useState<string>(userData?.age ? `${userData?.age}` : '');
  const [gender, setGender] = useState<GENDER>(userData?.gender ? userData?.gender : GENDER.MALE);
  const [imagePath, setImagePath] = useState<ImageProps | null>(null);

  const handleUpdateUser = () => {
    if (!nickname || !gender || !age) {
      showMessage({message: '필수 항목을 빠뜨리지 말고 모두 기입해 주세요.'});
      return;
    }

    const body = {
      photo: imagePath,
      age: age || null,
      gender: gender,
      nickname: nickname,
      userID: userToken?.id,
      userPassword: userToken?.password,
    };

    Spinner.show();
    editUser(body as any)
      .unwrap()
      .then(res => {
        if (res === '200') {
          navigation.goBack();
          DeviceEventEmitter.emit('UPDATED_USER');
        } else if (res === '503') {
          showMessage({
            message: '이미 사용중인 이름(닉네임) 입니다. 이름이 중복일시 닉네임으로 입력바랍니다.',
          });
        } else {
          showMessage({
            message: strings.general_text.please_try_again,
          });
        }
      })
      .catch(error => {
        console.log('🚀 ~ file: edit-user-info.tsx:86 ~ handleUpdateUser ~ error', error);
      })
      .finally(() => {
        Spinner.hide();
      });
  };

  return (
    <FixedContainer>
      <CustomHeader
        text="프로필수정"
        rightContent={<LineButton text="저장" onPress={handleUpdateUser} />}
      />

      <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} style={styles.container}>
        {/* Avatar */}
        <View style={styles.profileImageWrapper}>
          <Avatar
            size={70}
            uri={imagePath ? imagePath?.uri : photoID ? getImageURL(Number(photoID), false) : ''}
          />

          <Pressable
            hitSlop={20}
            onPress={() => {
              imagePickerRef?.current?.show();
            }}
            style={styles.upImageButtonWrapper}>
            <Icons.Camera stroke={colors.grayText} width={16} height={16} />
          </Pressable>
        </View>

        {/* Nickname */}
        <View style={styles.menuWrapper}>
          <CustomInput
            title="닉네임"
            placeholder="닉네임"
            value={nickname}
            onChangeText={setNickname}
            maxLength={15}
          />
        </View>

        {/* Gender */}
        <View style={styles.menuWrapper}>
          <GenderSelector selectedGender={gender} onGenderPress={setGender} />
        </View>

        {/* Age */}
        <View style={styles.menuWrapper}>
          <CustomInput
            title="나이"
            placeholder="나이"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            maxLength={3}
          />
        </View>
      </KeyboardAwareScrollView>

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

export default EditUserInfo;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: PADDING,
    paddingTop: PADDING,
  },
  profileImageWrapper: {
    width: widthScale1(90),
    alignSelf: 'center',
  },
  profileImage: {
    width: widthScale1(90),
    height: widthScale1(90),
    alignSelf: 'center',
    borderRadius: 999,
  },
  upImageButtonWrapper: {
    backgroundColor: colors.policy,
    width: widthScale1(24),
    height: widthScale1(24),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderWidth: scale1(2),
    borderColor: colors.white,
  },
  menuWrapper: {
    marginTop: heightScale1(30),
    gap: heightScale1(10),
  },
  buttonStyle: {
    flex: 1,
    borderRadius: scale1(8),
  },
});
