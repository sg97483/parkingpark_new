import * as React from 'react';
import Svg, {Rect, SvgProps} from 'react-native-svg';

const BoxCheckDefault = (props: SvgProps) => (
  <Svg
    width={25}
    height={25}
    viewBox={'0 0 25 25'}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect
      x={4.457}
      y={4.483}
      width={16.5}
      height={16.5}
      rx={1.25}
      strokeWidth={1.5}
      stroke={props.stroke || '#DFDFDF'}
    />
  </Svg>
);
export default React.memo(BoxCheckDefault);
