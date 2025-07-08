import React, {memo} from 'react';
import {View} from 'react-native';
import {colors} from '~styles/colors';
import {widthScale1} from '~styles/scaling-utils';

interface Props {
  insetNumber?: number;
}

const Spacer: React.FC<Props> = memo(props => {
  const {insetNumber} = props;

  return (
    <View
      style={{
        width: insetNumber || widthScale1(10),
        backgroundColor: colors.transparent,
      }}
    />
  );
});

export default Spacer;
