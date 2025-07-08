import * as React from 'react';
import Svg, {SvgProps, Circle} from 'react-native-svg';

const Dot = (props: SvgProps) => (
  <Svg
    width={3}
    height={3}
    viewBox="0 0 3 3"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Circle cx={1.5} cy={1.5} r={1.5} fill={props.fill || '#242424'} />
  </Svg>
);

export default Dot;
