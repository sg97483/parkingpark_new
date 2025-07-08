import React, {forwardRef, Ref, useCallback, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {colors} from '~styles/colors';
import {widthScale} from '~styles/scaling-utils';
import {ChooseYearModalRefObject} from './modal-choose-year';

interface Props {
  onConfirm?: (date: Date) => void;
  maximumDate?: number;
}

const ModalTimePicker = forwardRef(
  ({onConfirm, maximumDate}: Props, ref: Ref<ChooseYearModalRefObject>) => {
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
          title={'입차일'}
          theme={'light'}
          onConfirm={onConfirmDate}
          modal
          open={showModal}
          mode={'date'}
          minimumDate={new Date()}
          locale={'ko'}
          date={new Date()}
          cancelText={'취소'}
          confirmText={'확인'}
          onCancel={hide}
          maximumDate={
            maximumDate
              ? new Date(new Date().getTime() + maximumDate * 24 * 60 * 60 * 1000)
              : undefined
          }
        />
      </View>
    );
  },
);
export default ModalTimePicker;

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
