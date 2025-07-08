import * as React from 'react';
import Svg, {Path, Rect, SvgProps} from 'react-native-svg';
import {colors} from '~styles/colors';

const BoxChecked = (props: SvgProps) => (
  <Svg
    width={25}
    height={25}
    viewBox={'0 0 25 25'}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect x={3.291} y={3.733} width={18} height={18} rx={2} fill={props.stroke || colors.primary} />
    <Path
      d={'M16.957 9.4 L10.29 16.067 L7.624 13.4'}
      stroke="#fff"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(BoxChecked);
