import React, {forwardRef, memo, Ref, useCallback, useImperativeHandle, useState} from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomText from '~components/custom-text';
import {DATA_INSURANCE_COMPANY} from '~constants/data';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

export interface RefChooseDriverInsurance {
  show: () => void;
  hide: () => void;
}

interface Props {
  chooseItem: (text: string) => void;
}

const ModalChooseDriverInsurance = forwardRef(
  ({chooseItem}: Props, ref: Ref<RefChooseDriverInsurance>) => {
    const [showModal, setShowModal] = useState(false);
    const [text, setText] = useState('');

    useImperativeHandle(ref, () => ({
      show,
      hide,
    }));
    const show = useCallback(() => setShowModal(true), []);
    const hide = useCallback(() => setShowModal(false), []);
    const onPressOK = () => {
      chooseItem(text);
      hide();
    };

    const renderItem = ({item, index}: {item: string; index: number}) => (
      <>
        {index == DATA_INSURANCE_COMPANY.length - 1 ? (
          <View style={styles.footerComponent}>
            <CustomText string="보험사 : " size={FONT.TITLE_3} />
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="선택 및 직접입력"
              style={styles.textInput}
              placeholderTextColor={colors.grayText}
            />
          </View>
        ) : (
          <TouchableOpacity onPress={() => setText(item)} style={styles.item}>
            <CustomText
              string={item}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.TITLE_3}
              color={text == item ? colors.red : colors.grayText}
            />
          </TouchableOpacity>
        )}
      </>
    );

    return (
      <Modal
        animationType={'fade'}
        visible={showModal}
        onRequestClose={hide}
        onDismiss={hide}
        transparent
        style={styles.view}>
        <StatusBar backgroundColor={colors.black} barStyle={'dark-content'} />
        <Pressable onPress={hide} style={styles.viewContent}>
          <FlatList
            keyExtractor={item => JSON.stringify(item)}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={false}
            renderItem={renderItem}
            data={DATA_INSURANCE_COMPANY}
            contentContainerStyle={styles.flatList}
            ListFooterComponent={
              <View style={styles.viewBottom}>
                <TouchableOpacity onPress={hide} style={styles.viewButton}>
                  <CustomText string="취소" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressOK} style={styles.viewButton}>
                  <CustomText string="확인" />
                </TouchableOpacity>
              </View>
            }
          />
        </Pressable>
      </Modal>
    );
  },
);

export default memo(ModalChooseDriverInsurance);

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  viewContent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: widthScale(50),
    overflow: 'hidden',
    paddingBottom: widthScale(30),
  },
  flatList: {
    backgroundColor: colors.white,
    borderRadius: widthScale(20),
    paddingTop: heightScale(20),
    paddingBottom: heightScale(20),
    marginTop: heightScale(20),
  },
  item: {
    paddingHorizontal: widthScale(25),
    justifyContent: 'center',
    paddingVertical: heightScale(15),
  },
  footerComponent: {
    marginHorizontal: widthScale(25),
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    fontSize: widthScale(18),
  },
  viewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: heightScale(10),
  },
  viewButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
