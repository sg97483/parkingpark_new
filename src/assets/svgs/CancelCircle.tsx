import React, {memo} from 'react';
import Svg, {Path, Rect, SvgProps} from 'react-native-svg';

const CancelCircle = memo((props: SvgProps) => {
  return (
    <Svg
      width={14}
      height={15}
      viewBox="0 0 14 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Rect y={0.495728} width={14} height={14} rx={7} fill="#DFDFDF" />
      <Path
        d="M9.8125 4.68323L4.1875 10.3082M9.8125 10.3082L4.1875 4.68323"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

export default CancelCircle;
