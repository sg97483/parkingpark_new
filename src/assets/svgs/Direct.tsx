import React from 'react';
import {Path, Svg} from 'react-native-svg';
import {SvgProps} from 'react-native-svg';
import {heightScale, widthScale} from '~styles/scaling-utils';

const Direct = (props: SvgProps) => {
  return (
    <Svg
      width={widthScale(20)}
      height={heightScale(20)}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M1.50727 2.45961L7.00102 18.3315C7.2354 19.0159 8.2104 18.9971 8.42602 18.3034L10.6385 11.1221C10.6719 11.0047 10.7353 10.898 10.8224 10.8126C10.9095 10.7271 11.0174 10.6658 11.1354 10.6346L18.3073 8.42211C19.001 8.20649 19.0198 7.23149 18.3354 6.99711L2.46352 1.50336C2.33017 1.4565 2.18628 1.44827 2.04845 1.47963C1.91062 1.51099 1.78446 1.58066 1.68451 1.68061C1.58456 1.78056 1.51489 1.90672 1.48353 2.04455C1.45217 2.18238 1.4604 2.32626 1.50727 2.45961Z"
        stroke="#242424"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Direct;
