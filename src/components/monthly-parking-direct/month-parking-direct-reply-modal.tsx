import {
  ActivityIndicator,
  Alert,
  DeviceEventEmitter,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import HStack from '~components/h-stack';
import CustomText from '~components/custom-text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {PADDING} from '~constants/constant';
import {EMIT_EVENT, FONT_FAMILY} from '~constants/enum';
import {useAppSelector} from '~store/storeHooks';
import {strings} from '~constants/strings';
import {useCreateMonthShareBBSReplyMutation} from '~services/monthlyParkingDirectServices';

export interface MonthlyParkingDirectReplyRefs {
  show: (id: number, memberNick: string) => void;
}

const MonthlyParkingDirectReplyModal = forwardRef((_, ref) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [commentID, setCommentID] = useState<number | null>(null);
  const [memberNick, setMemberNick] = useState<string>('');
  const [replyContent, setReplyContent] = useState<string>('');
  const inputRef = useRef<TextInput>(null);

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const [createMonthShareBBSReply, {isLoading}] = useCreateMonthShareBBSReplyMutation();

  const show = (id: number, memberNick: string) => {
    setCommentID(id);
    setMemberNick(memberNick);
    setIsVisible(true);
    setReplyContent('');

    setTimeout(() => {
      inputRef?.current?.focus();
    }, 500);
  };

  const hide = () => {
    setIsVisible(false);
  };

  const handleSave = () => {
    if (!replyContent) {
      Alert.alert('', strings?.monthly_parking_direct_reply_modal?.please_enter_your_comment);
      return;
    }

    createMonthShareBBSReply({
      BBSID: commentID as number,
      memberID: userToken?.id,
      memberPass: userToken?.password,
      text: replyContent,
    })
      .unwrap()
      .then(res => {
        if (res === '200') {
          hide();
          DeviceEventEmitter.emit(EMIT_EVENT.MONTHLY_PARKING_DIRECT);
        } else {
          Alert.alert('', strings?.general_text?.please_try_again);
        }
      });
  };

  useImperativeHandle(
    ref,
    () => ({
      show,
    }),
    [],
  );

  return (
    <ReactNativeModal style={styles.container} isVisible={isVisible} useNativeDriver>
      <View style={styles.content}>
        <HStack style={styles.headerWrapper}>
          <CustomText
            string={strings?.monthly_parking_direct_reply_modal?.write_a_comment}
            family={FONT_FAMILY.BOLD}
            color={colors.white}
          />
          <TouchableOpacity onPress={hide}>
            <Icon name="close" size={widthScale(25)} color={colors.white} />
          </TouchableOpacity>
        </HStack>
        <HStack
          style={[
            styles.menuWrapper,
            {
              backgroundColor: `${colors.gray}90`,
            },
          ]}>
          <View style={styles.titleWrapper}>
            <CustomText
              string={strings?.monthly_parking_direct_reply_modal?.name}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </View>
          <CustomText string={memberNick} />
        </HStack>
        <HStack style={styles.menuWrapper}>
          <View style={styles.titleWrapper}>
            <CustomText
              string={strings?.monthly_parking_direct_reply_modal?.write_a_comment}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </View>
          <TextInput
            placeholder={strings?.monthly_parking_direct_reply_modal?.write_a_comment}
            value={replyContent}
            onChangeText={setReplyContent}
            style={styles.textInput}
            ref={inputRef}
            placeholderTextColor={colors.grayText}
          />
        </HStack>
        <TouchableOpacity onPress={handleSave} style={styles.saveButtonWrapper}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <CustomText
              string={strings?.general_text?.confirm}
              family={FONT_FAMILY.SEMI_BOLD}
              color={colors.white}
            />
          )}
        </TouchableOpacity>
      </View>
    </ReactNativeModal>
  );
});

export default MonthlyParkingDirectReplyModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    backgroundColor: colors.white,
  },
  headerWrapper: {
    height: heightScale(45),
    backgroundColor: colors.red,
    paddingHorizontal: PADDING,
    justifyContent: 'space-between',
  },
  menuWrapper: {
    minHeight: heightScale(55),
    paddingHorizontal: PADDING,
  },
  titleWrapper: {
    width: widthScale(85),
  },
  textInput: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: 14,
    flex: 1,
  },
  saveButtonWrapper: {
    minHeight: heightScale(45),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkGray,
  },
});
