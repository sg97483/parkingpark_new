import React from 'react';
import {Path, Svg} from 'react-native-svg';
import {SvgProps} from 'react-native-svg';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

const MinusCircle = (props: SvgProps) => {
  return (
    <Svg
      width={widthScale1(24)}
      height={heightScale1(24)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M8.25 12H15.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke={props.stroke || '#242424'}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default MinusCircle;
