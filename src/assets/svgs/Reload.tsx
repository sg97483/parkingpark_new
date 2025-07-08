import React, {memo} from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const Reload = memo((props: SvgProps) => {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M16.52 9.347h4.5m0 0v-4.5m0 4.5-3.188-3.178a8.25 8.25 0 1 0 0 11.662"
        stroke="#6F6F6F"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

export default Reload;
