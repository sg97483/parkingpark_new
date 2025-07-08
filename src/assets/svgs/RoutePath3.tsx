import React from 'react';
import Svg, {Circle, Line, SvgProps} from 'react-native-svg';

const RoutePath3 = (props: SvgProps) => {
  return (
    <Svg
      width={9}
      height={38}
      viewBox="0 0 9 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Circle cx={4.5} cy={5} r={4} fill="white" stroke="#333333" />
      <Circle cx={4.5} cy={33} r={4.5} fill="#333333" />
      <Line x1={4.49805} y1={9} x2={4.49805} y2={28.5} stroke="#333333" />
    </Svg>
  );
};

export default RoutePath3;
