import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import React, {memo, useState} from 'react';
import {colors} from '~styles/colors';
import {PADDING} from '~constants/constant';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {FONT_FAMILY} from '~constants/enum';
import CustomText from '~components/custom-text';
import {useAppSelector} from '~store/storeHooks';
import {UseRootStackNavigation} from '~navigators/stack';
import {useNavigation} from '@react-navigation/native';
import {ROUTE_KEY} from '~navigators/router';
import {showMessage} from 'react-native-flash-message';
import {strings} from '~constants/strings';
import {useReplyNoticeMutation} from '~services/noticeServices';
import Spinner from '~components/spinner';

interface Props {
  BBSID: number | string;
  onReplySuccess: () => void;
}

const BBSNoticeReplyInput: React.FC<Props> = memo(props => {
  const {BBSID, onReplySuccess} = props;
  const navigation: UseRootStackNavigation = useNavigation();
  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const [text, setText] = useState<string>('');

  const [replyNotice] = useReplyNoticeMutation();

  const handleReplyNotice = () => {
    if (!userToken?.id || !userToken?.password) {
      navigation.navigate(ROUTE_KEY.Login);
      showMessage({
        message: strings?.general_text?.login_first,
      });
      return;
    }
    if (!text) {
      showMessage({
        message: '댓글을 입력해 주세요.',
      });
      return;
    }
    Spinner.show();
    replyNotice({
      memberId: userToken?.id,
      memberPwd: userToken?.password,
      noticeId: BBSID as number,
      text: text,
    })
      .unwrap()
      .then(res => {
        if (res === '200') {
          onReplySuccess && onReplySuccess();
          setText('');
        } else {
          showMessage({
            message: strings?.general_text?.please_try_again,
          });
        }
      })
      .finally(() => {
        Spinner.hide();
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputViewWrapper}>
        <TextInput
          placeholder="댓글쓰기"
          multiline={true}
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholderTextColor={colors.grayText}
        />
      </View>
      <TouchableOpacity onPress={handleReplyNotice} style={styles.submitWrapper}>
        <CustomText string="전송" color={colors.darkGray} family={FONT_FAMILY.SEMI_BOLD} />
      </TouchableOpacity>
    </View>
  );
});

export default BBSNoticeReplyInput;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray,
    padding: PADDING / 2,
  },
  inputViewWrapper: {
    backgroundColor: colors.white,
  },
  input: {
    height: heightScale(100),
    textAlignVertical: 'top',
    padding: PADDING / 3,
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: 16,
  },
  submitWrapper: {
    backgroundColor: colors.white,
    width: widthScale(70),
    minHeight: heightScale(35),
    marginTop: PADDING / 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: widthScale(5),
    alignSelf: 'flex-end',
  },
});
