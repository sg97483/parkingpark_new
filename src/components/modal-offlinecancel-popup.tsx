import {Modal, Pressable, StyleSheet, View} from 'react-native';
import React, {forwardRef, useCallback, useState} from 'react';
import {colors} from '~styles/colors';
import {widthScale, heightScale, heightScale1, widthScale1, scale1} from '~styles/scaling-utils';
import CustomText from './custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import PaddingHorizontalWrapper from './padding-horizontal-wrapper';
import CustomButton from './commons/custom-button';
import HStack from './h-stack';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackScreensParams} from '~navigators/stack';
import {ROUTE_KEY} from '~navigators/router';

const ModalOfflineCancelPopup = forwardRef((props, ref) => {
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackScreensParams>>();

  React.useImperativeHandle(ref, () => ({
    show,
    hide,
  }));
  const show = useCallback(() => setShowModal(true), []);
  const hide = useCallback(() => setShowModal(false), []);

  const handleCancelRequest = () => {
    hide();
    navigation.navigate(ROUTE_KEY.ParkingRequestNoticeOffline);
  };

  return (
    <Modal
      animationType={'fade'}
      visible={showModal}
      onRequestClose={hide}
      hardwareAccelerated
      onDismiss={hide}
      transparent
      style={styles.view}>
      <Pressable onPress={hide} style={styles.viewContent}>
        {/* 👇 이 부분이 수정되었습니다. (그림자를 위한 Wrapper View 추가) */}
        <View style={styles.modalCardShadow}>
          <Pressable style={styles.viewContent1}>
            <PaddingHorizontalWrapper forDriveMe style={styles.paddingHorizontal}>
              <View style={styles.centeredTextWrapper}>
                <CustomText
                  string="아래의 경우 현장결제"
                  forDriveMe
                  family={FONT_FAMILY.SEMI_BOLD}
                  size={FONT.BODY}
                  lineHeight={heightScale1(30)}
                  color={colors.black}
                />
                <CustomText
                  string="취소 요청이 불가합니다."
                  forDriveMe
                  family={FONT_FAMILY.SEMI_BOLD}
                  size={FONT.BODY}
                  lineHeight={heightScale1(20)}
                  color={colors.black}
                />
              </View>
            </PaddingHorizontalWrapper>

            <PaddingHorizontalWrapper forDriveMe style={styles.paddingHorizontal}>
              <View style={styles.termsTextStyle}>
                <CustomText
                  forDriveMe
                  string="• 입차후 주차권을 구매한 경우"
                  color={colors.lineCancel}
                  lineHeight={heightScale1(20)}
                />
                <CustomText
                  forDriveMe
                  string="• 주차장 특이사항을 숙지하지 않아서 문제가"
                  color={colors.lineCancel}
                  lineHeight={heightScale1(20)}
                />
                <CustomText
                  forDriveMe
                  string="   발생한 경우"
                  color={colors.lineCancel}
                  lineHeight={heightScale1(20)}
                />
                <CustomText
                  forDriveMe
                  string="• 주차권 이용시간을 초과하여 사용한 경우"
                  color={colors.lineCancel}
                  lineHeight={heightScale1(20)}
                />
                <CustomText
                  forDriveMe
                  string="• 차량번호 오류 및 입차일 오류"
                  color={colors.lineCancel}
                  lineHeight={heightScale1(20)}
                />
                <CustomText
                  forDriveMe
                  string="• 다른 주차장에 주차한 경우"
                  color={colors.lineCancel}
                  lineHeight={heightScale1(20)}
                />
                <CustomText
                  forDriveMe
                  string="• 연박이 불가능한 주차장에서 연박을"
                  color={colors.lineCancel}
                  lineHeight={heightScale1(20)}
                />
                <CustomText
                  forDriveMe
                  string="   진행한경우"
                  color={colors.lineCancel}
                  lineHeight={heightScale1(20)}
                />
              </View>
            </PaddingHorizontalWrapper>

            <HStack style={styles.footerStyle}>
              <CustomButton
                buttonStyle={{
                  flex: 1,
                }}
                type="TERTIARY"
                text="닫기"
                buttonHeight={58}
                onPress={hide}
                outLine
              />
              <CustomButton
                buttonStyle={{
                  flex: 1,
                }}
                text="취소요청"
                buttonHeight={58}
                onPress={handleCancelRequest}
              />
            </HStack>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
});

export default ModalOfflineCancelPopup;

const styles = StyleSheet.create({
  // 모달 카드 자체에 그림자 효과를 주기 위한 스타일
  modalCardShadow: {
    shadowColor: colors.black,
    shadowRadius: 10,
    shadowOpacity: 0.15,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  // 모달의 메인 컨텐츠 영역
  viewContent1: {
    width: widthScale(320),
    backgroundColor: colors.white,
    borderRadius: widthScale(8),
    paddingTop: heightScale(10), // paddingBottom -> paddingTop으로 변경
    overflow: 'hidden', // 그림자 밖으로 내용이 튀어나가지 않도록 설정
  },
  // 모달 전체를 감싸는 배경 및 중앙 정렬
  viewContent: {
    padding: widthScale(20),
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modal 컴포넌트 자체에 적용되는 스타일 (필요시 사용)
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  // 나머지 필요한 스타일들
  footerStyle: {
    marginTop: heightScale1(20),
    gap: widthScale1(10),
    marginHorizontal: 20,
    marginBottom: heightScale1(20),
  },
  termsTextStyle: {
    backgroundColor: colors.white,
    paddingVertical: heightScale1(13),
    borderRadius: scale1(4),
  },
  centeredTextWrapper: {
    alignItems: 'center',
    marginTop: heightScale1(20),
  },
  paddingHorizontal: {
    paddingHorizontal: widthScale(20),
  },
});
