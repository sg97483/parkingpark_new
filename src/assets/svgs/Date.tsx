import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';
import {widthScale} from '~styles/scaling-utils';

const Date = (props: SvgProps) => (
  <Svg width={widthScale(25)} height={widthScale(25)} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M17 2.25V5.25M8 2.25V5.25M4.25 8.25H20.75M5 3.75H20C20.4142 3.75 20.75 4.08579 20.75 4.5V19.5C20.75 19.9142 20.4142 20.25 20 20.25H5C4.58579 20.25 4.25 19.9142 4.25 19.5V4.5C4.25 4.08579 4.58579 3.75 5 3.75Z"
      stroke="#242424"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default React.memo(Date);
