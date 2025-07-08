import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const Share = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M20.25 9.375V3.75m0 0h-5.625m5.625 0L13.5 10.5m3.75 3v6a.75.75 0 0 1-.75.75h-12a.75.75 0 0 1-.75-.75v-12a.75.75 0 0 1 .75-.75h6"
      stroke="#101828"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default Share;
