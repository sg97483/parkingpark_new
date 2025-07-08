import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const Check = (props: SvgProps) => (
  <Svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="m13.5 4.5-7 7L3 8"
      stroke={props.stroke || '#EC4444'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(Check);
