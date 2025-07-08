import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const Position = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M3.506 4.463 9 20.334c.234.685 1.21.666 1.425-.028l2.212-7.181a.704.704 0 0 1 .497-.488l7.172-2.212c.694-.216.713-1.19.028-1.425L4.463 3.506a.75.75 0 0 0-.957.957Z"
      stroke="#242424"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default React.memo(Position);
