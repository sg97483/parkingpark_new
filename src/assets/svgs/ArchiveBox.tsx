import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const ArchiveBox = (props: SvgProps) => (
  <Svg
    width={24}
    height={25}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M3.75 7.205v12.75a.75.75 0 0 0 .75.75h15a.75.75 0 0 0 .75-.75V7.205m-16.5 0 1.5-3h13.5l1.5 3m-16.5 0h16.5M8.822 14.527 12 17.705m0 0 3.178-3.178M12 17.705v-7.5"
      stroke="#101828"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ArchiveBox;
