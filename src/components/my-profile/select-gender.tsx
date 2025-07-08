import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import HStack from '~components/h-stack';
import {FONT_FAMILY, GENDER} from '~constants/enum';
import {fontSize} from '~styles/typography';
import {scale} from '~styles/scaling-utils';
import {PADDING, WIDTH} from '~constants/constant';
import {colors} from '~styles/colors';

interface SelectGenderProps {
  gender: GENDER;
  onChange: (val: GENDER) => void;
}

const SelectGender = (props: SelectGenderProps) => {
  const {gender, onChange} = props;
  const btnStyleMale = useMemo(() => {
    return [
      styles.button,
      gender === GENDER.MALE ? styles.selectedButton : styles.noneSelectButton,
    ];
  }, [gender]);

  const btnStyleFemale = useMemo(() => {
    return [
      styles.button,
      gender !== GENDER.MALE ? styles.selectedButton : styles.noneSelectButton,
    ];
  }, [gender]);
  const textMale = useMemo(() => {
    return [styles.textButton, gender === GENDER.MALE ? styles.textSelect : styles.textNoneSelect];
  }, [gender]);

  const textFemale = useMemo(() => {
    return [styles.textButton, gender !== GENDER.MALE ? styles.textSelect : styles.textNoneSelect];
  }, [gender]);

  const clickMale = useCallback(() => {
    onChange(GENDER.MALE);
  }, []);
  const clickFemale = useCallback(() => {
    onChange(GENDER.FEMALE);
  }, []);

  return (
    <HStack>
      <TouchableOpacity style={btnStyleMale} onPress={clickMale}>
        <Text style={textMale}>여성</Text>
      </TouchableOpacity>
      <View style={{width: scale(10)}} />
      <TouchableOpacity style={btnStyleFemale} onPress={clickFemale}>
        <Text style={textFemale}>남성</Text>
      </TouchableOpacity>
    </HStack>
  );
};

export default React.memo(SelectGender);

const styles = StyleSheet.create({
  textButton: {
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    fontSize: fontSize(15),
    paddingVertical: scale(13),
  },
  button: {
    width: scale((WIDTH - PADDING - PADDING - 10) / 2),
    alignItems: 'center',
    borderRadius: scale(8),
  },
  selectedButton: {
    backgroundColor: colors.primary,
  },
  noneSelectButton: {
    borderWidth: scale(1),
    borderColor: colors.disableButton,
  },
  textSelect: {
    color: colors.white,
  },
  textNoneSelect: {
    color: colors.lineCancel,
  },
});
