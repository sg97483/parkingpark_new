import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const ChevronRight = (props: SvgProps) => (
  <Svg width={24} height={25} viewBox="0 0 24 25" fill="none" {...props}>
    <Path
      d="m9 5 7.5 7.5L9 20"
      stroke={props.stroke || '#242424'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(ChevronRight);
