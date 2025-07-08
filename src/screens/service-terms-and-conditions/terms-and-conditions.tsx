import React, {useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import Button from '~components/button';
import CustomCheckbox from '~components/custom-checkbox';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import {PADDING} from '~constants/constant';
import {FONT} from '~constants/enum';
import {strings} from '~constants/strings';
import {RootStackScreenProps} from '~navigators/stack';
import {heightScale1 as heightScale, widthScale1 as widthScale} from '~styles/scaling-utils';

const TermsAndConditions = (props: RootStackScreenProps<'TermsAndConditions'>) => {
  const {navigation, route} = props;

  const func = route.params.func;
  const [check, setCheck] = useState(false);

  const onPressConfirm = () => {
    func?.(true);
    navigation.goBack();
  };

  return (
    <FixedContainer>
      <CustomHeader text={strings.terms_and_conditions.title} />
      <ScrollView style={styles.view}>
        <CustomText
          size={FONT.CAPTION}
          textStyle={styles.text}
          string={strings.terms_and_conditions.content}
        />
        <CustomCheckbox
          isChecked={check}
          onPress={() => setCheck(!check)}
          text={strings.terms_and_conditions.checkbox}
        />
        <Button
          disable={!check}
          style={styles.button}
          onPress={onPressConfirm}
          text={strings.terms_and_conditions.button}
        />
      </ScrollView>
    </FixedContainer>
  );
};

export default TermsAndConditions;
const styles = StyleSheet.create({
  view: {
    paddingHorizontal: PADDING,
  },
  text: {
    lineHeight: heightScale(20),
    marginTop: PADDING,
  },
  button: {
    borderRadius: widthScale(10),
    marginTop: heightScale(20),
    height: heightScale(55),
    marginBottom: heightScale(10),
  },
});
