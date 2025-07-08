import React, {useCallback, useMemo} from 'react';
import {DeviceEventEmitter, ScrollView, StyleSheet, Text, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import SettingSwitch from '~components/setting/setting-switch';
import Spinner from '~components/spinner';
import {EMIT_EVENT, FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheAllowChatNoti, cacheAllowServiceNoti} from '~reducers/termAndContionReducer';
import {useUpdateAgreementMutation} from '~services/userServices';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, heightScale1, scale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {dayjs} from '~utils/dayjsUtil';

const Setting = (props: RootStackScreenProps<'Setting'>) => {
  const {navigation} = props;

  const dispatch = useAppDispatch();
  const {user, userID} = userHook();
  const allowChatNoti = useAppSelector(state => state?.termAndConditionReducer?.allowChatNoti);
  const allowServiceNoti = useAppSelector(
    state => state?.termAndConditionReducer?.allowServiceNoti,
  );

  const [updateAgreement] = useUpdateAgreementMutation();

  const agreeMarketingSMS = useMemo(
    (): IS_ACTIVE => user?.agreeMarketingSmsYN || IS_ACTIVE.NO,
    [user?.agreeMarketingSmsYN],
  );
  const agreeMarketingMail = useMemo(
    (): IS_ACTIVE => user?.agreeMarketingMailYN || IS_ACTIVE.NO,
    [user?.agreeMarketingMailYN],
  );

  const switchNewChat = () => {
    dispatch(cacheAllowChatNoti(!allowChatNoti));
  };

  const switchActivity = () => {
    dispatch(cacheAllowServiceNoti(!allowServiceNoti));
  };

  const switchMarketing = useCallback(() => {
    Spinner.show();
    updateAgreement({
      agreeMarketingMail: agreeMarketingMail === IS_ACTIVE.YES ? IS_ACTIVE.NO : IS_ACTIVE.YES,
      agreeMarketingSMS: agreeMarketingSMS,
      userID: userID,
    })
      .unwrap()
      .then(res => {
        if (res === '200') {
          DeviceEventEmitter.emit(EMIT_EVENT.UPDATED_USER);
          showMessage({
            message:
              agreeMarketingMail === IS_ACTIVE.YES
                ? `${dayjs().format(
                    'YYYY년 MM월 DD일\n파킹박 마케팅 정보 수신 동의를 철회 했어요.',
                  )}`
                : `${dayjs().format('YYYY년 MM월 DD일\n파킹박 마케팅 정보수신에 동의했어요.')}`,
          });
        } else {
          showMessage({
            message: 'Error',
          });
        }
      })
      .catch(error => {
        console.log('🚀 ~ file: preferences.tsx:73 ~ handleSubmit ~ error', error);
      })
      .finally(() => {
        Spinner.hide();
      });
  }, [agreeMarketingMail, agreeMarketingSMS, userID]);

  const switchSMSService = useCallback(() => {
    Spinner.show();
    updateAgreement({
      agreeMarketingMail: agreeMarketingMail,
      agreeMarketingSMS: agreeMarketingSMS === IS_ACTIVE.YES ? IS_ACTIVE.NO : IS_ACTIVE.YES,
      userID: userID,
    })
      .unwrap()
      .then(res => {
        if (res === '200') {
          DeviceEventEmitter.emit(EMIT_EVENT.UPDATED_USER);
          showMessage({
            message:
              agreeMarketingSMS === IS_ACTIVE.YES
                ? `${dayjs().format(
                    'YYYY년 MM월 DD일\n파킹박 마케팅 정보 수신 동의를 철회 했어요.',
                  )}`
                : `${dayjs().format('YYYY년 MM월 DD일\n파킹박 마케팅 정보수신에 동의했어요.')}`,
          });
        } else {
          showMessage({
            message: 'Error',
          });
        }
      })
      .catch(error => {
        console.log('🚀 ~ file: preferences.tsx:73 ~ handleSubmit ~ error', error);
      })
      .finally(() => {
        Spinner.hide();
      });
  }, [agreeMarketingMail, agreeMarketingSMS, userID]);

  const clickUsersBlockedManagement = () => {
    navigation.navigate(ROUTE_KEY.BlockUser);
  };

  return (
    <FixedContainer>
      <CustomHeader text="설정" />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.menuText}>푸쉬 알림</Text>

        <View style={{gap: heightScale1(30)}}>
          {/* Notification sounds when a new chat is sent */}
          <SettingSwitch
            title="채팅 알림"
            subTitle="새로운 채팅이 전송될시 알림 울림"
            onPress={switchNewChat}
            isOn={allowChatNoti}
          />

          {/* Notification when service activity occurs within the app */}
          <SettingSwitch
            title="활동 알림"
            subTitle="앱내에서의 활동 발생시 알림"
            onPress={switchActivity}
            isOn={allowServiceNoti === undefined ? true : allowServiceNoti}
          />

          {/* Receiving marketing push for parking park service*/}
          <SettingSwitch
            title="마케팅 알림"
            subTitle="파킹박 서비스의 마케팅 푸쉬 알림"
            onPress={switchMarketing}
            isOn={agreeMarketingMail === 'Y'}
          />
        </View>

        <View style={{height: heightScale(50)}} />

        {/* SMS noti */}
        <Text style={styles.menuText}>SMS알림</Text>
        <SettingSwitch
          title="마케팅 알림"
          subTitle="파킹박 서비스의 마케팅 SMS 수신"
          onPress={switchSMSService}
          isOn={agreeMarketingSMS === 'Y' ? true : false}
        />

        <View style={{height: heightScale(50)}} />

        {/* Block users */}
        <Text style={styles.menuText}>사용자 설정</Text>
        <SettingSwitch
          title="차단 사용자 관리"
          subTitle="카풀 서비스에서 차단한 사용자 목록 관리"
          hideButton={true}
          onPress={clickUsersBlockedManagement}
        />
      </ScrollView>
    </FixedContainer>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    padding: scale1(20),
  },
  menuText: {
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    fontSize: fontSize1(16),
    color: colors.titleNotice,
    marginBottom: scale1(20),
  },

  textContent: {
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    fontSize: fontSize1(14),
    color: colors.titleNotice,
    marginTop: heightScale1(20),
  },
});
