import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {FONT_FAMILY, GENDER} from '~constants/enum';
import {fontSize} from '~styles/typography';
import {colors} from '~styles/colors';
import {heightScale, scale, widthScale} from '~styles/scaling-utils';
import {useAppSelector} from '~store/storeHooks';
import {getImageURL} from '~utils/getImageURL';
import {Image} from 'react-native';
import {IMAGES} from '~/assets/images-path';
import {Icons} from '~/assets/svgs';
import CustomInput from '~components/custom-input';
import {PADDING} from '~constants/constant';
import SelectGender from '~components/my-profile/select-gender';

const EditPersonalInformation = () => {
  const userData = useAppSelector(state => state.userReducer.user);
  const [gender, setGender] = React.useState<GENDER>(GENDER.MALE);
  const [nickname, setNickname] = React.useState('');
  const [age, setAge] = React.useState('');

  const onPressSave = () => {
    // TODO: handle logic save new user info
    console.log('func: EditPersonalInformation onPressSave nothing');
  };

  return (
    <FixedContainer>
      <CustomHeader
        text="프로필수정"
        rightContent={
          <TouchableOpacity style={styles.headerRightButton} onPress={onPressSave}>
            <View style={styles.wrapTextRightContent}>
              <Text style={styles.textHeaderRight}>저장</Text>
            </View>
          </TouchableOpacity>
        }
      />

      {/* avatar */}
      <View style={styles.wrapAvt}>
        {userData ? (
          userData?.photoId ? (
            <Image
              source={{
                uri: getImageURL(Number(userData?.photoId), true),
              }}
              style={styles.profileFace}
            />
          ) : (
            <Image source={IMAGES.profile_face} style={styles.profileFace} />
          )
        ) : null}
        <View style={styles.iconUpdateWrapper}>
          <Icons.Camera stroke={colors.grayText} customWidth={24} customHeight={24} />
        </View>
      </View>
      <View style={styles.wrapper}>
        {/* nick name */}
        <CustomInput
          inputStyle={styles.wrapTitleInput}
          title="닉네임"
          value={nickname}
          onChangeText={setNickname}
          textInputStyle={styles.textInput}
        />

        {/* select gender */}
        <View style={styles.wrapTitleInput}>
          <Text style={styles.textTitle}>성별</Text>
          <SelectGender
            gender={gender}
            onChange={vel => {
              console.log(vel);
              setGender(vel);
            }}
          />
        </View>

        {/* age */}
        <CustomInput
          inputStyle={styles.wrapTitleInput}
          title="나이"
          value={age}
          onChangeText={setAge}
          textInputStyle={styles.textInput}
          keyBoardType="numeric"
        />
      </View>
    </FixedContainer>
  );
};

export default EditPersonalInformation;

const styles = StyleSheet.create({
  headerRightButton: {
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    marginRight: scale(4),
  },
  wrapTextRightContent: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lineCancel,
  },
  textHeaderRight: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: fontSize(14),
    color: colors.lineCancel,
  },
  profileFace: {
    width: widthScale(70),
    height: widthScale(70),
    borderRadius: 999,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  iconUpdateWrapper: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: colors.policy,
    width: scale(24),
    height: scale(24),
    borderRadius: 999,
    borderWidth: scale(2),
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapAvt: {
    alignSelf: 'center',
    width: widthScale(70),
    marginTop: heightScale(20),
  },
  textInput: {
    borderColor: colors.disableButton,
  },
  wrapper: {
    paddingHorizontal: PADDING,
  },
  wrapTitleInput: {
    marginTop: heightScale(30),
  },
  textTitle: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: fontSize(14),
    color: colors.black,
    marginBottom: scale(10),
  },
});
