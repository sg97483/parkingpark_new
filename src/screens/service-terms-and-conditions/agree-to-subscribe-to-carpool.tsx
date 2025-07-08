import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Button from '~components/button';
import CustomCheckbox from '~components/custom-checkbox';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import KeyBoardInputView from '~components/key-board-input-view';
import InputRegistrationNumber from '~components/service-terms-and-conditions/input-registration-number';
import {PADDING} from '~constants/constant';
import {FONT} from '~constants/enum';
import {strings} from '~constants/strings';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1 as heightScale, widthScale1 as widthScale} from '~styles/scaling-utils';

const AgreeToSubscribeToCarpool = (props: RootStackScreenProps<'AgreeToSubscribeToCarpool'>) => {
  const {navigation, route} = props;
  const func = route.params?.func;

  const [iAgree1, setIAgree1] = useState(false);
  const [iAgree2, setIAgree2] = useState(false);

  const onPressDone = () => {
    func?.(true);
    navigation.goBack();
  };

  return (
    <FixedContainer>
      <CustomHeader text={strings.agree_to_subscribe_to_carpool.title} />
      <KeyBoardInputView>
        <ScrollView style={styles.view}>
          <CustomText
            size={FONT.CAPTION}
            textStyle={styles.text}
            color={colors.grayText2}
            string={strings.agree_to_subscribe_to_carpool.text1}
          />
          <CustomText
            size={FONT.CAPTION}
            color={colors.grayText2}
            textStyle={styles.text}
            string={strings.agree_to_subscribe_to_carpool.text2}
          />

          <CustomCheckbox
            onPress={() => setIAgree1(!iAgree1)}
            isChecked={iAgree1}
            colorTextNotCheck={colors.grayText}
            text={strings.agree_to_subscribe_to_carpool.agree}
            style={styles.checkbox}
          />

          <CustomText
            size={FONT.CAPTION}
            color={colors.grayText2}
            string={strings.agree_to_subscribe_to_carpool.text3}
          />

          <CustomCheckbox
            onPress={() => setIAgree2(!iAgree2)}
            isChecked={iAgree2}
            colorTextNotCheck={colors.grayText}
            text={strings.agree_to_subscribe_to_carpool.agree}
            style={styles.checkbox}
          />

          <CustomText
            size={FONT.CAPTION}
            color={colors.grayText2}
            textStyle={styles.text}
            string={strings.agree_to_subscribe_to_carpool.text4}
          />

          <View style={styles.viewBottom}>
            <CustomText
              color={colors.grayText2}
              textStyle={styles.textBottom}
              string={'2024년 00월 00일'}
            />
            <View style={styles.viewContentBottom}>
              <View style={styles.viewInput}>
                <CustomText
                  color={colors.grayText2}
                  string={strings.agree_to_subscribe_to_carpool.resident_registration_number}
                />
                <InputRegistrationNumber
                  placeholder={strings.agree_to_subscribe_to_carpool.placeholder}
                  placeholderTextColor={colors.grayText}
                />
                <CustomText color={colors.grayText2} string={' - '} />
                <InputRegistrationNumber
                  placeholder={strings.agree_to_subscribe_to_carpool.placeholder}
                  placeholderTextColor={colors.grayText}
                />
              </View>
              <View style={styles.viewInput}>
                <CustomText
                  color={colors.grayText2}
                  string={strings.agree_to_subscribe_to_carpool.principle}
                />
                <InputRegistrationNumber
                  placeholder={strings.agree_to_subscribe_to_carpool.placeholderName}
                  placeholderTextColor={colors.grayText}
                />
                <CustomText
                  color={colors.grayText2}
                  string={strings.agree_to_subscribe_to_carpool.name}
                />
              </View>
            </View>
          </View>

          <Button
            disable={!iAgree1 || !iAgree2}
            style={styles.button}
            onPress={onPressDone}
            text={strings.agree_to_subscribe_to_carpool.button}
          />
        </ScrollView>
      </KeyBoardInputView>
    </FixedContainer>
  );
};

export default AgreeToSubscribeToCarpool;
const styles = StyleSheet.create({
  view: {paddingHorizontal: PADDING},
  text: {lineHeight: heightScale(20), marginTop: PADDING},
  checkbox: {marginVertical: heightScale(20)},
  viewBottom: {
    marginTop: heightScale(40),
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  textBottom: {marginBottom: heightScale(15)},
  viewInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightScale(20),
  },
  button: {
    borderRadius: widthScale(10),
    marginTop: heightScale(30),
    height: heightScale(55),
    marginBottom: heightScale(10),
  },
  viewContentBottom: {alignItems: 'flex-end'},
});
