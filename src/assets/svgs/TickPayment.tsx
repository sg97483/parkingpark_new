import * as React from 'react';
import Svg, {Path, Rect, SvgProps} from 'react-native-svg';

const TickPayment = (props: SvgProps) => (
  <Svg width={46} height={46} viewBox={'0 0 46 46'} fill="none" {...props}>
    <Rect width={46} height={46} rx={23} fill="#EC4444" />
    <Path
      d="M33.3125 16.4375L20.1875 29.5625L13.625 23"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default React.memo(TickPayment);
