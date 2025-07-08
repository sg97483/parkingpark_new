import React, {forwardRef, useImperativeHandle, useState} from 'react';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {DATE_PICKER_MODE} from '~constants/enum';
import {colors} from '~styles/colors';

interface Props {
  onSelect: (value: number) => void;
  mode?: DATE_PICKER_MODE;
}

export interface DateTimePickerRefs {
  show: () => void;
}

const DateTimePicker = forwardRef((props: Props, ref) => {
  const {onSelect, mode = DATE_PICKER_MODE.DATETIME} = props;
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState<boolean>(false);

  const show = () => {
    setOpen(true);
  };

  useImperativeHandle(
    ref,
    () => ({
      show,
    }),
    [],
  );

  return (
    <DatePicker
      modal
      open={open}
      date={date}
      locale={'ko'}
      cancelText={'취소'}
      confirmText={'확인'}
      title={'날짜 입력'}
      onConfirm={date => {
        setOpen(false);
        setDate(date);
        onSelect && onSelect(moment(date).valueOf());
      }}
      onCancel={() => {
        setOpen(false);
      }}
      mode={mode}
      textColor={colors.black}
    />
  );
});

export default DateTimePicker;
