import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const List = (props: SvgProps) => (
  <Svg
    width={25}
    height={25}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M9.469 6.5h11.25m-11.25 6h11.25m-11.25 6h11.25m-16.5-12h1.5m-1.5 6h1.5m-1.5 6h1.5"
      stroke="#242424"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(List);
