import React, {forwardRef, Ref, useCallback, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {colors} from '~styles/colors';
import {widthScale} from '~styles/scaling-utils';
import {ChooseYearModalRefObject} from './modal-choose-year';

interface Props {
  onConfirm?: (date: Date) => void;
}
const ModalDateTimePicker = forwardRef(({onConfirm}: Props, ref: Ref<ChooseYearModalRefObject>) => {
  const [showModal, setShowModal] = useState(false);

  React.useImperativeHandle(ref, () => ({
    show,
    hide,
  }));
  const show = useCallback(() => setShowModal(true), []);
  const hide = useCallback(() => setShowModal(false), []);

  const onConfirmDate = (e: Date) => {
    hide();
    onConfirm?.(e);
  };

  return (
    <View style={styles.viewContent}>
      <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
      <DatePicker
        minuteInterval={10}
        title={'입차시간'}
        theme={'light'}
        onConfirm={onConfirmDate}
        modal
        open={showModal}
        mode={'time'}
        // minimumDate={new Date()}
        locale={'ko'}
        date={new Date()}
        cancelText={'취소'}
        confirmText={'확인'}
        onCancel={hide}
      />
    </View>
  );
});

export default ModalDateTimePicker;

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
    justifyContent: 'center',
    alignItems: 'center',
  },
});
