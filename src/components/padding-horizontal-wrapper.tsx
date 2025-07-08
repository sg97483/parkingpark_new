import React, {ReactNode, memo} from 'react';
import {StyleProp, View, ViewProps, ViewStyle} from 'react-native';
import {PADDING, PADDING1} from '~constants/constant';

interface Props {
  children: ReactNode;
  containerStyles?: StyleProp<ViewStyle>;
  forDriveMe?: boolean;
}

const PaddingHorizontalWrapper: React.FC<Props & ViewProps> = memo(props => {
  const {children, containerStyles, forDriveMe, ...rest} = props;

  return (
    <View
      style={[
        {
          paddingHorizontal: forDriveMe ? PADDING1 : PADDING,
        },
        containerStyles,
      ]}
      {...rest}>
      {children}
    </View>
  );
});

export default PaddingHorizontalWrapper;
