import React, {Ref, forwardRef, useImperativeHandle, useState} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {TicketPriceModel} from '~screens/carpool/carpool-route-registration';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import CustomButton from './commons/custom-button';
import CustomText from './custom-text';
import HStack from './h-stack';
import PaddingHorizontalWrapper from './padding-horizontal-wrapper';
import {fontSize1} from '~styles/typography';

interface Props {
  onConfirm: () => void;
  title?: string;
  content?: string;
  textConfirmButton?: string;
  textCancelButton?: string;
  ticketBox?: TicketPriceModel;
  hideContentText?: boolean;
  hideCancelButton?: boolean;
}

export interface ModalConfirmRefs {
  show: () => void;
  hide: () => void;
}

const ModalConfirm = forwardRef((props: Props, ref: Ref<any>) => {
  const {
    onConfirm,
    title = '정말 나가시겠습니까?',
    content = '입력된 내용은 저장되지 않습니다.',
    textCancelButton = strings.driver_register.cancel,
    textConfirmButton = strings.driver_register.check,
    ticketBox,
    hideContentText,
    hideCancelButton,
  } = props;
  const [showModal, setShowModal] = useState<boolean>(false);

  const show = () => {
    setShowModal(true);
  };
  const hide = () => {
    setShowModal(false);
  };
  useImperativeHandle(ref, () => ({show, hide}), []);

  return (
    <Modal
      statusBarTranslucent
      visible={showModal}
      animationType={'fade'}
      onRequestClose={hide}
      hardwareAccelerated
      onDismiss={hide}
      transparent
      style={styles.view}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <PaddingHorizontalWrapper
            forDriveMe
            containerStyles={{
              paddingVertical: PADDING1,
              alignItems: 'center',
            }}>
            <CustomText
              string={title}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.BODY}
              color={colors.menuTextColor}
              textStyle={{textAlign: 'center'}}
              forDriveMe
              lineHeight={fontSize1(25)}
            />

            {/* TICKET BOX */}

            {ticketBox ? (
              <View style={styles.boxTicket}>
                <CustomText
                  string={ticketBox?.title}
                  size={FONT.CAPTION_6}
                  color={colors.menuTextColor}
                  lineHeight={fontSize1(20)}
                  forDriveMe
                />
                <HStack style={{justifyContent: 'space-between', marginTop: heightScale1(6)}}>
                  <CustomText
                    string={ticketBox?.ticket}
                    family={FONT_FAMILY.REGULAR}
                    size={FONT.CAPTION_6}
                    color={colors.grayText}
                    lineHeight={fontSize1(20)}
                    forDriveMe
                  />
                  <CustomText
                    string={ticketBox?.price}
                    family={FONT_FAMILY.SEMI_BOLD}
                    size={FONT.CAPTION_6}
                    color={colors.menuTextColor}
                    lineHeight={fontSize1(20)}
                    forDriveMe
                  />
                </HStack>
              </View>
            ) : null}

            {hideContentText ? null : (
              <CustomText
                string={content}
                family={FONT_FAMILY.REGULAR}
                size={FONT.CAPTION_6}
                color={colors.menuTextColor}
                textStyle={content ? {paddingTop: heightScale1(10), textAlign: 'center'} : {}}
                forDriveMe
                lineHeight={fontSize1(20)}
              />
            )}

            <HStack
              style={{
                marginTop: heightScale1(30),
                gap: widthScale1(10),
              }}>
              {hideCancelButton ? null : (
                <CustomButton
                  type="TERTIARY"
                  text={textCancelButton}
                  onPress={hide}
                  buttonHeight={58}
                  buttonStyle={styles.buttonStyle}
                />
              )}

              <CustomButton
                type="PRIMARY"
                text={textConfirmButton}
                onPress={() => {
                  hide();
                  onConfirm();
                }}
                buttonHeight={58}
                buttonStyle={styles.buttonStyle}
              />
            </HStack>
          </PaddingHorizontalWrapper>
        </View>
      </View>
    </Modal>
  );
});

export default ModalConfirm;

const styles = StyleSheet.create({
  view: {},
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0,0.5)',
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: widthScale1(8),
    width: '85%',
  },
  btnCancel: {
    backgroundColor: colors.policy,
    borderColor: colors.policy,
    paddingVertical: heightScale1(18),
    borderRadius: widthScale1(8),
    flex: 1,
    marginRight: widthScale1(10),
  },
  boxTicket: {
    marginTop: heightScale1(20),
    marginBottom: heightScale1(6),
    padding: widthScale1(14),
    borderRadius: widthScale1(8),
    backgroundColor: colors.policy,
    width: '100%',
  },
  buttonStyle: {
    flex: 1,
  },
});
