import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Button from '~components/button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import CheckboxBorder from '~components/service-terms-and-conditions/checkbox-border';
import ItemCheckTerm from '~components/service-terms-and-conditions/item-check-term';
import {PADDING} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1 as heightScale, widthScale1 as widthScale} from '~styles/scaling-utils';

const ServiceTermsAndConditions = (props: RootStackScreenProps<'ServiceTermsAndConditions'>) => {
  const {navigation} = props;

  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);
  const [check4, setCheck4] = useState(false);

  const onPressRegister = () => {
    navigation.navigate(ROUTE_KEY.BusinessCardAndVaccineRegistration);
  };

  const onPressTermsAndConditions = () => {
    navigation.navigate(ROUTE_KEY.TermsAndConditions, {
      func: (check: boolean) => {
        setCheck1(check);
      },
    });
  };

  const onPressPrivacyPolicy = () => {
    navigation.navigate(ROUTE_KEY.PrivacyPolicy, {
      func: (check: boolean) => {
        setCheck2(check);
      },
    });
  };

  const onPressLocationBasedTermsOfUse = () => {
    navigation.navigate(ROUTE_KEY.LocationBasedTermsOfUse, {
      func: (check: boolean) => {
        setCheck3(check);
      },
    });
  };

  const onPressAgreeToSubscribeToCarpool = () => {
    navigation.navigate(ROUTE_KEY.AgreeToSubscribeToCarpool, {
      func: (check: boolean) => {
        setCheck4(check);
      },
    });
  };

  return (
    <FixedContainer>
      <CustomHeader text={strings.service_terms_and_conditions.title} />

      <ScrollView style={styles.view}>
        <CustomText
          size={FONT.TITLE_3}
          family={FONT_FAMILY.SEMI_BOLD}
          string={strings.service_terms_and_conditions.content}
          textStyle={styles.textTitle}
        />

        <CheckboxBorder
          disable
          text={strings.service_terms_and_conditions.check1}
          isChecked={check1 && check2 && check3}
        />

        <View style={styles.viewItem}>
          <ItemCheckTerm
            disable={check1}
            text={strings.service_terms_and_conditions.item1}
            style={styles.item1}
            isChecked={check1}
            onPress={onPressTermsAndConditions}
          />
          <ItemCheckTerm
            disable={check2}
            onPress={onPressPrivacyPolicy}
            text={strings.service_terms_and_conditions.item2}
            isChecked={check2}
          />
          <ItemCheckTerm
            disable={check3}
            text={strings.service_terms_and_conditions.item3}
            style={styles.item3}
            isChecked={check3}
            onPress={onPressLocationBasedTermsOfUse}
          />
        </View>

        <CheckboxBorder
          isChecked={check4}
          disable
          text={strings.service_terms_and_conditions.check2}
        />
        <View style={styles.viewItem2}>
          <ItemCheckTerm
            disable={check4}
            onPress={onPressAgreeToSubscribeToCarpool}
            text={strings.service_terms_and_conditions.item4}
            style={styles.item3}
            isChecked={check4}
          />
        </View>

        <View style={styles.viewPolicy}>
          <CustomText
            textStyle={styles.textPolicy}
            color={colors.grayText}
            string={strings.service_terms_and_conditions.policy.title}
          />
          {strings.service_terms_and_conditions.policy.content.map(item => (
            <View style={{flexDirection: 'row'}} key={item.content}>
              <CustomText textStyle={styles.textPolicy} color={colors.grayText} string={' • '} />
              <CustomText
                textStyle={styles.textPolicy}
                color={colors.grayText}
                string={`${item.title} : ${item.content}`}
              />
            </View>
          ))}
        </View>
        <Button
          style={styles.button}
          onPress={onPressRegister}
          text={strings.service_terms_and_conditions.button}
        />
      </ScrollView>
    </FixedContainer>
  );
};

export default ServiceTermsAndConditions;
const styles = StyleSheet.create({
  view: {
    paddingHorizontal: PADDING,
  },
  textTitle: {
    marginVertical: PADDING,
  },
  item1: {
    marginTop: heightScale(20),
    marginBottom: heightScale(10),
  },
  item3: {
    marginTop: heightScale(10),
  },
  viewItem: {
    paddingHorizontal: widthScale(10),
    marginBottom: heightScale(30),
  },
  viewItem2: {
    marginVertical: heightScale(20),
    paddingHorizontal: widthScale(10),
  },
  viewPolicy: {
    backgroundColor: colors.policy,
    paddingVertical: heightScale(16),
    paddingHorizontal: PADDING,
    borderRadius: 5,
  },
  textPolicy: {
    lineHeight: heightScale(22),
  },
  button: {
    borderRadius: widthScale(10),
    marginTop: heightScale(30),
    height: heightScale(55),
  },
});
