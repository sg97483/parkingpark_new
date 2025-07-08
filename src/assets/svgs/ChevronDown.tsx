import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const ChevronDown = (props: SvgProps) => (
  <Svg width={17} height={17} viewBox="0 0 17 17" fill="none" {...props}>
    <Path
      d="m13.55 6.917-4.97 5.029-5.03-4.971"
      stroke={props.stroke || '#242424'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(ChevronDown);
