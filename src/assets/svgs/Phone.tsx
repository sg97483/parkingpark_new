import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const Phone = (props: SvgProps) => (
  <Svg
    width={24}
    height={25}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M8.672 12.155a7.837 7.837 0 0 0 3.656 3.647.749.749 0 0 0 .74-.056l2.345-1.566a.74.74 0 0 1 .712-.066L20.512 16a.74.74 0 0 1 .45.778 4.5 4.5 0 0 1-4.462 3.928A12.75 12.75 0 0 1 3.75 7.955a4.5 4.5 0 0 1 3.928-4.463.74.74 0 0 1 .778.45l1.885 4.397a.75.75 0 0 1-.057.703L8.72 11.424a.75.75 0 0 0-.047.73Z"
      stroke="#101828"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default Phone;
