import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const CarpoolFill = (props: SvgProps) => (
  <Svg width={25} height={24} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M1.667 11.25h21m-1.5 6v2.25a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1-.75-.75v-2.25m3.75 0h-18m18 0v-6l-2.803-6.3a.75.75 0 0 0-.685-.45H6.654a.75.75 0 0 0-.684.45l-2.803 6.3v6m3.75 0v2.25a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1-.75-.75v-2.25m3-3h1.5m9 0h1.5"
      stroke="#333"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path fill="#333" d="M3.167 11.249h18v6h-18z" />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.167 13.5a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Zm10.5 0a.75.75 0 0 0 0 1.5h1.5a.75.75 0 1 0 0-1.5h-1.5Z"
      fill="#fff"
    />
  </Svg>
);

export default React.memo(CarpoolFill);
