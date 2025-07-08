import * as React from 'react';
import Svg, {SvgProps, Rect} from 'react-native-svg';

const BoxCheckCircleDefault = (props: SvgProps) => (
  <Svg
    width={25}
    height={25}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect
      x={4.457}
      y={4.428}
      width={16.5}
      height={16.5}
      rx={8.25}
      stroke={props.stroke || '#DFDFDF'}
      strokeWidth={1.5}
    />
  </Svg>
);
export default React.memo(BoxCheckCircleDefault);
