import React from 'react';
import {StyleSheet, View} from 'react-native';
import CustomText from '~components/custom-text';
import RadioButton from '~components/radio-button';
import {PADDING} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ccbCheckList} from '~constants/types';
import {widthScale} from '~styles/scaling-utils';
import {fontSize} from '~styles/typography';

const REQUEST_TYPE = [
  {
    mTemp: strings.request_change_and_cancel_add.request_cancel,
    mParkId: 70020,
  },
  {
    mTemp: strings.request_change_and_cancel_add.request_cancel_payment,
    mParkId: 70021,
  },
  {
    mTemp: strings.request_change_and_cancel_add.request_change_car_number,
    mParkId: 70022,
  },
  {
    mTemp: strings.request_change_and_cancel_add.request_change_time_booking,
    mParkId: 70023,
  },
];

interface IProps {
  selectedType: ccbCheckList;
  setSelectedType: (value: ccbCheckList) => void;
}

const RequestChangeAddType = ({selectedType, setSelectedType}: IProps) => {
  return (
    <View>
      <CustomText
        string={strings.request_change_and_cancel_add.type_request}
        family={FONT_FAMILY.BOLD}
      />
      <View style={{paddingHorizontal: widthScale(10)}}>
        {REQUEST_TYPE.map((item, index) => {
          return (
            <RadioButton
              key={index}
              text={item.mTemp}
              isFocus={selectedType.mParkId === item.mParkId}
              onPress={() => setSelectedType(item)}
              textStyle={styles.radioTitle}
              radioStyle={styles.radioButtonStyle}
              style={{marginTop: PADDING}}
            />
          );
        })}
      </View>
    </View>
  );
};

export default RequestChangeAddType;

const styles = StyleSheet.create({
  radioTitle: {
    fontSize: fontSize(16),
  },
  radioButtonStyle: {
    width: widthScale(24),
    height: widthScale(24),
  },
});
