import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const UserSwitch = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 15a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Zm0 0a6.749 6.749 0 0 0-6.019 3.694M12 15a6.75 6.75 0 0 1 6.019 3.694M18.75 12 21 14.25m0 0L23.25 12M21 14.25V12A9 9 0 0 0 4.435 7.116M.75 12 3 9.75m0 0L5.25 12M3 9.75V12a9 9 0 0 0 16.566 4.884"
      stroke={props.stroke || '#242424'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(UserSwitch);
