import * as React from 'react';
import Svg, {SvgProps, Rect, Path} from 'react-native-svg';

const BoxCheckedCircle = (props: SvgProps) => (
  <Svg
    width={25}
    height={25}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect x={3.291} y={3.678} width={18} height={18} rx={9} fill="#EC4444" />
    <Path
      d="M16.957 9.345 10.29 16.01l-2.666-2.666"
      stroke="#fff"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default React.memo(BoxCheckedCircle);
