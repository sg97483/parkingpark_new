import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const Bell = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M9 18v.75a3 3 0 1 0 6 0V18M5.269 9.75A6.74 6.74 0 0 1 12.047 3c3.712.028 6.684 3.113 6.684 6.834v.666c0 3.356.703 5.306 1.322 6.375A.75.75 0 0 1 19.406 18H4.594a.75.75 0 0 1-.647-1.125c.619-1.069 1.322-3.019 1.322-6.375v-.75Z"
      stroke="#242424"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(Bell);
