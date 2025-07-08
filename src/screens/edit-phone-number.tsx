import React, {useCallback, useState} from 'react';
import {DeviceEventEmitter, StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import CustomButton from '~components/commons/custom-button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import Spinner from '~components/spinner';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useEditUserInfoMutation} from '~services/userServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1} from '~styles/scaling-utils';

const EditPhoneNumber = (props: RootStackScreenProps<'EditPhoneNumber'>) => {
  const {navigation} = props;

  const {user} = userHook();

  const [editUser, {isLoading}] = useEditUserInfoMutation();

  const [newPhone, setNewPhone] = useState<string>('');

  const handleVerifyPhoneOrChangeNumber = useCallback(() => {
    if (newPhone) {
      Spinner.show();
      editUser({
        phone: newPhone,
      })
        .unwrap()
        .then(res => {
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
        })
        .finally(() => {
          Spinner.hide();
        });
    } else {
      navigation.navigate(ROUTE_KEY.VerifyPhoneNumber, {
        onReturn(phone: string) {
          setNewPhone(phone);
        },
      });
    }
  }, [newPhone, navigation]);

  return (
    <FixedContainer>
      <CustomHeader text="휴대폰 번호 수정" />

      <PaddingHorizontalWrapper>
        <CustomText
          size={FONT.CAPTION_8}
          string={'아래 인증하기 버튼을 눌러\n변경할 휴대폰 번호를 인증해주세요.'}
          family={FONT_FAMILY.SEMI_BOLD}
          textStyle={styles.headerTextStyle}
          forDriveMe
          lineHeight={heightScale1(28)}
        />
        <CustomText
          color={colors.black}
          string="휴대폰 번호"
          forDriveMe
          family={FONT_FAMILY.MEDIUM}
          lineHeight={heightScale1(20)}
        />

        <View style={styles.phoneWrapperStyle}>
          <CustomText
            string={newPhone ? newPhone : (user?.pnum ?? '')}
            color={newPhone ? colors.menuTextColor : colors.disableButton}
            forDriveMe
            family={FONT_FAMILY.MEDIUM}
            lineHeight={heightScale1(20)}
          />
        </View>
      </PaddingHorizontalWrapper>

      <CustomButton
        type="PRIMARY"
        text={newPhone ? '변경하기' : '인증하기'}
        buttonStyle={styles.submitButtonStyle}
        onPress={handleVerifyPhoneOrChangeNumber}
        buttonHeight={58}
        isLoading={isLoading}
      />
    </FixedContainer>
  );
};

export default EditPhoneNumber;

const styles = StyleSheet.create({
  headerTextStyle: {
    marginVertical: PADDING1,
  },
  phoneWrapperStyle: {
    marginTop: heightScale1(10),
    borderWidth: 1,
    borderRadius: scale1(8),
    minHeight: heightScale1(48),
    justifyContent: 'center',
    paddingHorizontal: PADDING1,
    borderColor: colors.disableButton,
  },
  submitButtonStyle: {
    marginHorizontal: PADDING1,
    marginTop: 'auto',
    marginBottom: PADDING1 / 2,
  },
});
