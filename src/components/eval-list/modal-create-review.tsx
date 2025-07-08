import React, {forwardRef, memo, Ref, useCallback, useState} from 'react';
import {Modal, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import CustomText from '~components/custom-text';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ChooseStar from './choose-star';
import {PADDING} from '~constants/constant';
import Button from '~components/button';

export interface ModalCreateReviewRef {
  show: () => void;
  hide: () => void;
}
interface Props {
  onPressReview: (numberStar: number, textReview: string) => void;
}

const ModalCreateReview = forwardRef(({onPressReview}: Props, ref: Ref<ModalCreateReviewRef>) => {
  const [showModal, setShowModal] = useState(false);

  React.useImperativeHandle(ref, () => ({
    show,
    hide,
  }));
  const show = useCallback(() => {
    setNumberStar(5);
    setShowModal(true);
  }, []);
  const hide = useCallback(() => setShowModal(false), []);

  const [numberStar, setNumberStar] = useState(5);
  const [textReview, setTextReview] = useState('');

  return (
    <Modal
      animationType={'fade'}
      visible={showModal}
      onRequestClose={hide}
      hardwareAccelerated
      onDismiss={hide}
      transparent
      style={styles.view}>
      <View style={styles.viewContent}>
        <View style={{backgroundColor: colors.white}}>
          <View style={styles.viewHeader}>
            <TouchableOpacity onPress={hide}>
              <Icon name="chevron-left" size={widthScale(30)} color={colors.redButton} />
            </TouchableOpacity>
            <CustomText
              string="주차장 평점등록 해주세요 ^^"
              color={colors.redButton}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </View>
          <ChooseStar onPressChooseStar={setNumberStar} star={numberStar} />
          <View style={[styles.viewInput, styles.shadowColor]}>
            <TextInput
              onChangeText={setTextReview}
              value={textReview}
              style={{
                flex: 1,
                padding: widthScale(10),
              }}
              placeholder={
                '주차장 이용 후 다음분들을 위해서 주차요금 및 편의성 평가를 부탁드리겠습니다.'
              }
              placeholderTextColor={colors.grayText}
            />
          </View>
          <View style={styles.viewBottom}>
            <Button
              onPress={() => onPressReview(numberStar, textReview)}
              text="저장하기"
              textColor={colors.redButton}
              borderColor={colors.redButton}
              style={styles.button}
            />
            <Button
              onPress={hide}
              text="취소하기"
              textColor={colors.darkBlue}
              borderColor={colors.darkBlue}
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
});

export default memo(ModalCreateReview);

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  viewContent: {
    padding: widthScale(30),
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: widthScale(50),
    justifyContent: 'center',
  },
  viewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightScale(20),
  },
  shadowColor: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  viewInput: {
    margin: PADDING,
    borderRadius: widthScale(5),
    backgroundColor: colors.white,
    height: heightScale(100),
  },
  viewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: widthScale(12),
    marginBottom: heightScale(20),
  },
  button: {
    borderRadius: heightScale(60),
    width: widthScale(130),
    backgroundColor: colors.white,
  },
});
