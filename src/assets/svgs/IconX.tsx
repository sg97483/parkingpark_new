import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const IconX = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M18.75 5.25L5.25 18.75M18.75 18.75L5.25 5.25"
      stroke={props.stroke || '#242424'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(IconX);
