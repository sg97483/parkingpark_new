import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const Answer = (props: SvgProps) => (
  <Svg
    width={25}
    height={25}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M9.666 10.55h6m-6 3h6M7.98 18.922l-3.084 2.587a.75.75 0 0 1-1.228-.572V6.05a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-.75.75H8.325l-.347.122Z"
      stroke="#101828"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default Answer;
