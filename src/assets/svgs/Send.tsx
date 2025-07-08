import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const Send = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="m10.397 13.603 4.237-4.237m5.082-6L2.24 8.288a.75.75 0 0 0-.113 1.406l8.025 3.797a.725.725 0 0 1 .356.356l3.797 8.025a.75.75 0 0 0 1.407-.113l4.921-17.475a.74.74 0 0 0-.918-.918Z"
      stroke="#333"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(Send);
