import React from 'react';
import {Path, Svg, SvgProps} from 'react-native-svg';

const Coin = (props: SvgProps) => {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M10 8c0 3.314-1.567 6-3.5 6M10 8c0-3.314-1.567-6-3.5-6M10 8h3m-6.5 6C4.567 14 3 11.314 3 8s1.567-6 3.5-6m0 12h3c1.931 0 3.5-2.688 3.5-6M6.5 2h3C11.431 2 13 4.688 13 8M9.106 4h3m-3 8h3"
        stroke="#242424"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Coin;
