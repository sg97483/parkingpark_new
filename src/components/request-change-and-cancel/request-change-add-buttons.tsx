import React from 'react';
import {StyleSheet, View} from 'react-native';
import Button from '~components/button';
import {PADDING} from '~constants/constant';
import {strings} from '~constants/strings';
import {widthScale} from '~styles/scaling-utils';

interface IProps {
  disable?: boolean;
  handleSubmit: () => void;
}

const RequestChangeAddButtons = (props: IProps) => {
  const {disable = false, handleSubmit} = props;
  return (
    <View style={styles.buttonWrapper}>
      {/* <HStack style={styles.buttonWrapper}>
        <TouchableOpacity onPress={handleBack}>
          <Image
            source={ICONS.btn_review_list}
            style={styles.button}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <HStack>
          <TouchableOpacity onPress={handleSubmit}>
            <Image
              source={ICONS.btn_review_save_off}
              style={styles.button}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCancel}>
            <Image
              source={ICONS.btn_review_cancel}
              style={styles.button}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </HStack>
      </HStack> */}
      <Button
        disable={disable}
        text={strings.request_change_and_cancel_add.register}
        style={styles.button}
        onPress={handleSubmit}
      />
    </View>
  );
};

export default RequestChangeAddButtons;

const styles = StyleSheet.create({
  button: {
    borderRadius: widthScale(10),
  },
  buttonWrapper: {
    marginHorizontal: PADDING,
    marginTop: PADDING / 2,
  },
});
