import * as React from 'react';
import Svg, {Circle, Path, SvgProps} from 'react-native-svg';

const RoutePath = (props: SvgProps) => (
  <Svg width={9} height={45} viewBox="0 0 9 45" fill="none" {...props}>
    <Circle cx={4.5} cy={5} r={4} fill="#fff" stroke="#333" />
    <Circle cx={4.5} cy={40.5} r={4.5} fill="#333" />
    <Path stroke="#333" d="M4.498 9v27" />
  </Svg>
);

export default React.memo(RoutePath);
