import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const Reset = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M16.519 9.347h4.5m0 0v-4.5m0 4.5L17.83 6.169a8.25 8.25 0 1 0 0 11.662"
      stroke={props.stroke || '#6F6F6F'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(Reset);
