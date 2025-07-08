import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const Marker = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M5.25 21.75h13.5M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm4.5 0c0 6.75-7.5 12-7.5 12s-7.5-5.25-7.5-12a7.5 7.5 0 0 1 15 0Z"
      stroke="#101828"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(Marker);
