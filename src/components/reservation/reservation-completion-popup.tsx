import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {StyleSheet, View, Image, Modal, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CustomText from '~components/custom-text';
import CustomButton from '~components/commons/custom-button';
import LineButton from '~components/commons/line-button';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {colors} from '~styles/colors';
import {PADDING, PADDING1} from '~constants/constant';
import {heightScale, heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {IMAGES} from '~/assets/images-path';
import HStack from '~components/h-stack';

interface Props {
  onChargePromoPress: () => void;
  onDriverPromoPress: () => void;
  onRulletBannerPress: () => void; // <-- 이 부분 추가!
  onClose: () => void;
}

export interface ReservationCompletionRefs {
  show: () => void;
}

const ReservationCompletionPopup = forwardRef((props: Props, ref) => {
  const {onChargePromoPress, onDriverPromoPress, onRulletBannerPress, onClose} = props;
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);

  const show = () => {
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
  };

  useImperativeHandle(ref, () => ({show}), []);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={() => {
        hide();
        onClose && onClose();
      }}>
      <FixedContainer>
        <CustomHeader
          hideBack
          rightContent={
            <LineButton
              text="닫기"
              onPress={() => {
                hide();
                onClose && onClose();
              }}
            />
          }
        />

        <View style={styles.container}>
          {/*<Image
            source={{ uri: 'YOUR_IMAGE_URL_HERE' }}
            style={{ height: heightScale1(120), width: widthScale1(190), resizeMode: 'contain' }}
        />*/}

          <View style={{gap: heightScale1(10), alignItems: 'center'}}>
            <Image
              source={IMAGES.payendicon}
              style={{
                height: heightScale1(46),
                width: widthScale1(46),
                resizeMode: 'contain',
                marginBottom: 30,
              }}
            />
            <CustomText
              forDriveMe
              string="주차권 결제가 완료되었습니다."
              family={FONT_FAMILY.SEMI_BOLD}
              color={colors.menuTextColor}
              size={FONT.CAPTION_9}
              textStyle={{textAlign: 'center', marginVertical: 0}}
              lineHeight={30}
            />
            <CustomText
              forDriveMe
              string={'실 결제금액의 1% 적립 완료!\n주차할때마다 쌓이는 적립금 혜택'}
              textStyle={{textAlign: 'center', marginBottom: 0}}
              family={FONT_FAMILY.MEDIUM}
              color={colors.lineCancel}
              size={FONT.CAPTION_7}
              lineHeight={25}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            hide();
            onDriverPromoPress && onDriverPromoPress();
          }}>
          <HStack style={styles.wrapSessionUser1}>
            <View style={styles.infoWrapperStyle}>
              <CustomText
                forDriveMe
                color={colors.grayText2}
                size={FONT.CAPTION_6}
                family={FONT_FAMILY.MEDIUM}
                string={'출퇴근 카풀하고 주차장 무료로 이용하세요!'}
              />
              <HStack>
                <CustomText
                  forDriveMe
                  color={colors.grayText2}
                  size={FONT.CAPTION_6}
                  family={FONT_FAMILY.MEDIUM}
                  string={'지금 드라이버 등록시 '}
                />
                <CustomText
                  forDriveMe
                  color={colors.redSwitch}
                  size={FONT.CAPTION_6}
                  family={FONT_FAMILY.SEMI_BOLD}
                  string={'적립금 3,000원'}
                />
                <CustomText
                  forDriveMe
                  color={colors.grayText2}
                  size={FONT.CAPTION_6}
                  family={FONT_FAMILY.MEDIUM}
                  string={' 지급!'}
                />
                {/*<Text style={{fontSize: scale1(12), color: colors.grayText}}>{' 지급 '}</Text>*/}
              </HStack>
            </View>
            <Image
              source={IMAGES.ChevronRight}
              style={{width: 16, height: 16, resizeMode: 'contain'}} // 이미지 크기와 비율 조정 방식을 설정합니다.
            />
          </HStack>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            hide();
            onChargePromoPress && onChargePromoPress();
          }}>
          <HStack style={styles.wrapSessionUser2}>
            <View style={styles.infoWrapperStyle}>
              <CustomText
                forDriveMe
                color={colors.grayText2}
                size={FONT.CAPTION_6}
                family={FONT_FAMILY.MEDIUM}
                string={'파킹박 충전금 충전하고'}
              />
              <HStack>
                <CustomText
                  forDriveMe
                  color={colors.grayText2}
                  size={FONT.CAPTION_6}
                  family={FONT_FAMILY.MEDIUM}
                  string={'추가 충전금'}
                />
                <CustomText
                  forDriveMe
                  color={colors.redSwitch}
                  size={FONT.CAPTION_6}
                  family={FONT_FAMILY.SEMI_BOLD}
                  string={' 3% 혜택'}
                />
                <CustomText
                  forDriveMe
                  color={colors.grayText2}
                  size={FONT.CAPTION_6}
                  family={FONT_FAMILY.MEDIUM}
                  string={' 받아보세요!'}
                />
                {/*<Text style={{fontSize: scale1(12), color: colors.grayText}}>{' 지급 '}</Text>*/}
              </HStack>
            </View>
            <Image
              source={IMAGES.ChevronRight}
              style={{width: 16, height: 16, resizeMode: 'contain'}} // 이미지 크기와 비율 조정 방식을 설정합니다.
            />
          </HStack>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            hide();
            onRulletBannerPress && onRulletBannerPress();
          }}>
          <HStack style={styles.wrapSessionUser2}>
            <View style={styles.infoWrapperStyle}>
              <CustomText
                forDriveMe
                color={colors.grayText2}
                size={FONT.CAPTION_6}
                family={FONT_FAMILY.MEDIUM}
                string={'매일 룰렛 돌리고 적립금 받기!'}
              />
              <HStack>
                <CustomText
                  forDriveMe
                  color={colors.grayText2}
                  size={FONT.CAPTION_6}
                  family={FONT_FAMILY.MEDIUM}
                  string={'지금 '}
                />
                <CustomText
                  forDriveMe
                  color={colors.redSwitch}
                  size={FONT.CAPTION_6}
                  family={FONT_FAMILY.SEMI_BOLD}
                  string={'이벤트 참여'}
                />
                <CustomText
                  forDriveMe
                  color={colors.grayText2}
                  size={FONT.CAPTION_6}
                  family={FONT_FAMILY.MEDIUM}
                  string={' 하세요!'}
                />
              </HStack>
            </View>
            <Image
              source={IMAGES.ChevronRight}
              style={{width: 16, height: 16, resizeMode: 'contain'}}
            />
          </HStack>
        </TouchableOpacity>

        <PaddingHorizontalWrapper containerStyles={{marginTop: 30, marginBottom: 42}}>
          <CustomButton
            text="확인"
            textSize={FONT.CAPTION_7}
            onPress={() => {
              hide();
              onClose && onClose();
            }}
            buttonHeight={58}
          />
        </PaddingHorizontalWrapper>
      </FixedContainer>
    </Modal>
  );
});

export default ReservationCompletionPopup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: PADDING,
    gap: heightScale1(30),
  },
  boxWrapperStyle: {
    borderRadius: scale1(4),
    backgroundColor: colors.gray9,
    marginTop: heightScale(20),
    marginBottom: heightScale(10),
    paddingVertical: heightScale1(16),
    paddingHorizontal: widthScale1(20), // 좌우 여백 추가
  },
  wrapSessionUser1: {
    marginHorizontal: PADDING1,
    padding: widthScale1(20),
    backgroundColor: colors.policy,
    borderRadius: scale1(8),
    marginBottom: heightScale1(10),
    gap: widthScale1(16),
    marginTop: 30, // 상단 여백 30 추가
  },
  wrapSessionUser2: {
    marginHorizontal: PADDING1,
    padding: widthScale1(20),
    backgroundColor: colors.policy,
    borderRadius: scale1(8),
    marginBottom: heightScale1(10),
    gap: widthScale1(16),
    marginTop: 10, // 상단 여백 30 추가
  },
  infoWrapperStyle: {
    flex: 1,
    gap: heightScale1(0),
  },
});
