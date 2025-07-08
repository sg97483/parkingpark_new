import * as React from 'react';
import Svg, {Circle, Path, SvgProps} from 'react-native-svg';

const RoutePath2 = (props: SvgProps) => (
  <Svg
    width={9}
    height={79}
    viewBox="0 0 9 79"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Circle cx={4.5} cy={4.5} r={4} fill="#fff" stroke="#333" />
    <Circle cx={4.5} cy={74.5} r={4.5} fill="#333" />
    <Path stroke="#333" d="M4.518 47v23.5m0-61.5v19.493" />
    <Path stroke="#333" strokeDasharray="2 2" d="M4.518 28.492v20" />
  </Svg>
);

export default React.memo(RoutePath2);
