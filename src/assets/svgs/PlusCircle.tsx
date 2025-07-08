import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const PlusCircle = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M8.25 12h7.5M12 8.25v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      stroke={props.stroke || '#242424'}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);

export default PlusCircle;
