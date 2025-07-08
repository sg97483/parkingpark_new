import React from 'react';
import {Path, Svg, SvgProps} from 'react-native-svg';

const BlueCheck = (props: SvgProps) => {
  return (
    <Svg
      width={17}
      height={16}
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M14 4.5L7 11.5L3.5 8"
        stroke="#0073CB"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default BlueCheck;
