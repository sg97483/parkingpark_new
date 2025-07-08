import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import Button from '~components/button';
import Divider from '~components/divider';
import HStack from '~components/h-stack';
import {PADDING} from '~constants/constant';
import {strings} from '~constants/strings';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

interface IProps {
  isDisableSubmit?: boolean;
  handleBack: () => void;
  handleCancel: () => void;
  handleSubmit: () => void;
  containerStyle?: ViewStyle;
}

const ParkingRequestNoticeFooter = (props: IProps) => {
  const {handleBack, handleCancel, handleSubmit, containerStyle, isDisableSubmit = false} = props;
  return (
    <View style={containerStyle}>
      <Divider />
      <HStack
        style={{
          justifyContent: 'space-between',
          paddingHorizontal: PADDING / 2,
        }}>
        <Button
          text={strings.add_parking_request_notice.back_to_list}
          style={styles.button}
          color={colors.transparent}
          borderColor={colors.gray}
          textColor={colors.heavyGray}
          onPress={handleBack}
        />

        <HStack>
          <Button
            text={strings.add_parking_request_notice.cancel}
            style={styles.button}
            color={colors.transparent}
            borderColor={colors.gray}
            textColor={colors.heavyGray}
            onPress={handleCancel}
          />
          <Button
            disable={isDisableSubmit}
            text={strings.add_parking_request_notice.done}
            style={[styles.button, {marginLeft: widthScale(10)}]}
            color={colors.transparent}
            borderColor={colors.gray}
            textColor={colors.heavyGray}
            onPress={handleSubmit}
          />
        </HStack>
      </HStack>
    </View>
  );
};

export default ParkingRequestNoticeFooter;

const styles = StyleSheet.create({
  button: {
    width: widthScale(80),
    marginTop: heightScale(12),
    borderRadius: widthScale(5),
  },
});
