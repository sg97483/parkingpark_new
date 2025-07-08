import moment from 'moment';
import React, {memo} from 'react';
import {Alert, DeviceEventEmitter, StyleSheet, TouchableOpacity, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import Spinner from '~components/spinner';
import {PADDING} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import {strings} from '~constants/strings';
import {RootStackScreenProps} from '~navigators/stack';
import {useDeleteValetMainNoticeMutation} from '~services/valetParkingServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

const ValetMainNoticeDetail = memo((props: RootStackScreenProps<'ValetMainNoticeDetail'>) => {
  const {navigation, route} = props;
  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const item = route?.params?.item;

  const [deleteValetMainNotice] = useDeleteValetMainNoticeMutation();

  const handleDelete = () => {
    Alert.alert('', '삭제 하시겠습니까?', [
      {
        text: strings?.general_text?.agree,
        onPress: () => {
          Spinner.show();
          deleteValetMainNotice({
            id: item?.id,
            memberId: userToken?.id,
            memberPwd: userToken?.password,
          })
            .unwrap()
            .then(res => {
              if (res === '200') {
                navigation.canGoBack() && navigation.goBack();
                DeviceEventEmitter.emit(EMIT_EVENT.VALET_MAIN_NOTICE);
              } else {
                showMessage({
                  message: strings?.general_text?.please_try_again,
                });
              }
            })
            .finally(() => {
              Spinner.hide();
            });
        },
      },
      {
        text: strings?.general_text?.cancel,
        style: 'cancel',
      },
    ]);
  };

  return (
    <FixedContainer>
      <CustomHeader text="" />
      <HStack style={styles.container}>
        <View style={styles.iconWrapper}>
          <Icon name="bullhorn-variant-outline" size={widthScale(20)} color={colors.red} />
        </View>
        <View style={{flex: 1}}>
          <CustomText string={item?.subject} numberOfLines={1} family={FONT_FAMILY.BOLD} />

          <CustomText
            string={`${moment(item?.regdate * 1000).format('MM.DD HH:mm')}`}
            size={FONT.CAPTION_2}
            color={colors.darkGray}
            textStyle={{marginTop: heightScale(5)}}
          />
        </View>
      </HStack>
      <Divider />
      <View style={styles.content}>
        <CustomText
          string={item?.text}
          textStyle={{
            marginVertical: heightScale(5),
          }}
        />
      </View>

      <Divider />

      <HStack style={styles.buttonGroup}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goToListButton}>
          <CustomText
            string={strings?.general_text?.list}
            color={colors.darkGray}
            size={FONT.CAPTION}
          />
        </TouchableOpacity>

        {userToken?.adminYN === IS_ACTIVE.YES ? (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButtonWrapper}>
            <HStack>
              <Icon name="close" color={colors.white} />
              <CustomText
                string={` ${strings?.general_text?.delete}`}
                color={colors.white}
                size={FONT.CAPTION}
              />
            </HStack>
          </TouchableOpacity>
        ) : null}
      </HStack>
    </FixedContainer>
  );
});

export default ValetMainNoticeDetail;

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
    alignItems: 'flex-start',
  },
  iconWrapper: {
    borderWidth: 1,
    borderRadius: 999,
    width: widthScale(35),
    height: widthScale(35),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: widthScale(15),
    borderColor: colors.red,
  },
  content: {
    padding: PADDING,
  },
  buttonGroup: {
    padding: PADDING,
    justifyContent: 'space-between',
  },
  deleteButtonWrapper: {
    backgroundColor: colors.blue,
    minHeight: heightScale(30),
    paddingHorizontal: PADDING / 2,
    justifyContent: 'center',
    borderRadius: widthScale(5),
  },
  goToListButton: {
    backgroundColor: colors.gray,
    minHeight: heightScale(30),
    paddingHorizontal: PADDING / 2,
    justifyContent: 'center',
    borderRadius: widthScale(5),
  },
});
