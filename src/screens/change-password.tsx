import React, {useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import CustomButton from '~components/commons/custom-button';
import CustomInput from '~components/commons/custom-input';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import Spinner from '~components/spinner';
import {PADDING1} from '~constants/constant';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheUserToken} from '~reducers/userReducer';
import {useChangeUserPasswordMutation} from '~services/userServices';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {encrypt} from '~utils/encrypt';

const ChangePassword = (props: RootStackScreenProps<'ChangePassword'>) => {
  const {navigation} = props;

  const [changeUserPassword, {isLoading}] = useChangeUserPasswordMutation();

  const [passCurrent, setPassCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [rePass, setRePass] = useState('');

  const userToken = useAppSelector(state => state?.userReducer?.userToken);
  const dispatch = useAppDispatch();

  const onPressUpdate = async () => {
    if (!passCurrent) {
      showMessage({message: '기존 비밀번호를 입력해 주세요'});
      return;
    }
    if (!newPass) {
      showMessage({message: '신규 비밀번호를 입력해 주세요'});
      return;
    }
    if (newPass.trim().length < 8) {
      showMessage({message: '신규 비밀번호는 8자 이상 입력해 주셔야 합니다'});
      return;
    }
    if (newPass !== rePass) {
      showMessage({message: '비밀번호가 일치하지 않습니다'});
      return;
    }

    Spinner.show();
    changeUserPassword({
      id: userToken?.id,
      newPassword: encrypt(newPass),
      oldPassword: encrypt(passCurrent),
    })
      .unwrap()
      .then(res => {
        if (res === '200') {
          dispatch(
            cacheUserToken({
              ...userToken,
              password: encrypt(newPass),
            }),
          );
          showMessage({message: '비밀번호가 변경 되었습니다'});
          navigation.goBack();
        } else {
          showMessage({message: '기존 비밀번호를 잘못 입력하셨습니다'});
        }
      })
      .finally(() => {
        Spinner.hide();
      });
  };

  return (
    <FixedContainer>
      <CustomHeader text="비밀번호 변경" />

      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={styles.containerStyle}
        scrollEnabled={false}>
        <CustomInput
          title="기존 비밀번호"
          onChangeText={setPassCurrent}
          value={passCurrent}
          placeholder={'기존 비밀번호를 입력해주세요.'}
          secureTextEntry
        />

        <CustomInput
          value={newPass}
          onChangeText={setNewPass}
          title={'신규 비밀번호'}
          placeholder={'변경할 비밀번호를 입력해주세요.'}
          secureTextEntry
        />

        <CustomInput
          value={rePass}
          onChangeText={setRePass}
          title={'비밀번호 확인'}
          placeholder={'변경할 비밀번호를 확인해주세요.'}
          secureTextEntry
        />
      </ScrollView>

      <HStack style={styles.viewButton}>
        <CustomButton
          type="TERTIARY"
          buttonHeight={58}
          text="취소하기"
          outLine
          onPress={navigation.goBack}
          buttonStyle={styles.buttonStyle}
        />

        <CustomButton
          buttonHeight={58}
          text="변경하기"
          onPress={onPressUpdate}
          buttonStyle={styles.buttonStyle}
          disabled={!passCurrent || !newPass || !rePass}
          isLoading={isLoading}
        />
      </HStack>
    </FixedContainer>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: PADDING1,
    paddingTop: PADDING1,
    gap: heightScale1(30),
  },
  viewButton: {
    marginTop: heightScale1(10),
    marginBottom: PADDING1 / 2,
    marginHorizontal: PADDING1,
    gap: widthScale1(10),
  },
  buttonStyle: {
    flex: 1,
  },
});
