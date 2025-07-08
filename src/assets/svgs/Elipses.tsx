import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const Elipses = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 13.125a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Zm0-6a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Zm0 12a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z"
      fill="#242424"
    />
  </Svg>
);

export default Elipses;
