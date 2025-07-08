import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

const Wallet = (props: SvgProps) => (
  <Svg
    width={widthScale1(24)}
    height={heightScale1(24)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M3 11.25h5.325a.74.74 0 0 1 .731.6 3.01 3.01 0 0 0 5.888 0 .74.74 0 0 1 .731-.6H21m-18-3h18m-16.5-3h15a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5V6.75a1.5 1.5 0 0 1 1.5-1.5Z"
      stroke="#101828"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default React.memo(Wallet);
