import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const Plus = (props: SvgProps) => (
  <Svg width={25} height={25} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M4.25 12.8867H20.75M12.5 4.63672V21.1367"
      stroke={props.stroke || '#242424'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(Plus);
