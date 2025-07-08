import * as React from 'react';
import Svg, {SvgProps, Rect} from 'react-native-svg';

const RadioDefault = (props: SvgProps) => (
  <Svg
    width={24}
    height={25}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect
      x={2.75}
      y={3.698}
      width={18.5}
      height={18.5}
      rx={9.25}
      stroke="#DFDFDF"
      strokeWidth={1.5}
    />
  </Svg>
);
export default React.memo(RadioDefault);
