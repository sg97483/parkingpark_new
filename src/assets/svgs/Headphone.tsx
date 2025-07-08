import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const Headphone = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M21.14 12h-3a1.5 1.5 0 0 0-1.5 1.5v3.75a1.5 1.5 0 0 0 1.5 1.5h1.5a1.5 1.5 0 0 0 1.5-1.5m0-5.25v5.25m0-5.25a8.998 8.998 0 0 0-9.074-9A9 9 0 0 0 3 12m18.14 5.25v2.25a3 3 0 0 1-3 3h-5.39M3 12v5.25a1.5 1.5 0 0 0 1.5 1.5H6a1.5 1.5 0 0 0 1.5-1.5V13.5A1.5 1.5 0 0 0 6 12H3Z"
      stroke={props.stroke || '#242424'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(Headphone);
