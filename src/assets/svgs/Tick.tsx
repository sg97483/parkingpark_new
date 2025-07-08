import React, {memo} from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const Tick = memo((props: SvgProps) => {
  return (
    <Svg
      width={17}
      height={17}
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="m14 4.996-7 7-3.5-3.5"
        stroke="#0073CB"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

export default Tick;
