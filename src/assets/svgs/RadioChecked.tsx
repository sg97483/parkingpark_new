import * as React from 'react';
import Svg, {SvgProps, Rect} from 'react-native-svg';
import {colors} from '~styles/colors';

const RadioChecked = (props: SvgProps) => (
  <Svg
    width={24}
    height={25}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect
      x={5}
      y={5.948}
      width={14}
      height={14}
      rx={7}
      stroke={props.stroke || colors.primary}
      strokeWidth={6}
    />
  </Svg>
);
export default React.memo(RadioChecked);
