import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import Button from '~components/button';
import {PADDING} from '~constants/constant';
import {strings} from '~constants/strings';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

interface IProps {
  text: string;
  onPress: () => void;
  onChangeText: (text: string) => void;
}

const ValetQnaBbsDetailReply: React.FC<IProps> = ({text, onPress, onChangeText}: IProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        style={styles.textInput}
        placeholder={strings.parking_request_notice_board_detail.write_comment}
        textAlignVertical="top"
        onChangeText={onChangeText}
        placeholderTextColor={colors.grayText}
      />

      <Button
        text={strings.parking_request_notice_board_detail.submit_comment}
        onPress={onPress}
        borderColor={colors.gray}
        color={colors.white}
        style={styles.button}
        textColor={colors.black}
      />
    </View>
  );
};

export default ValetQnaBbsDetailReply;

const styles = StyleSheet.create({
  container: {
    padding: PADDING / 2,
    backgroundColor: `${colors.gray}50`,
  },
  textInput: {
    backgroundColor: colors.white,
    minHeight: heightScale(80),
    padding: PADDING / 2,
  },
  button: {
    width: widthScale(80),
    borderRadius: widthScale(5),
    alignSelf: 'flex-end',
    marginTop: PADDING / 2,
    minHeight: heightScale(40),
  },
});
