import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';
import {widthScale} from '~styles/scaling-utils';

const Lock = (props: SvgProps) => (
  <Svg
    width={widthScale(16)}
    height={widthScale(16)}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M8 10C8.69036 10 9.25 9.44036 9.25 8.75C9.25 8.05964 8.69036 7.5 8 7.5C7.30964 7.5 6.75 8.05964 6.75 8.75C6.75 9.44036 7.30964 10 8 10ZM8 10V11.5M5.75 5.5V3.25C5.75 2.65326 5.98705 2.08097 6.40901 1.65901C6.83097 1.23705 7.40326 1 8 1C8.59674 1 9.16903 1.23705 9.59099 1.65901C10.0129 2.08097 10.25 2.65326 10.25 3.25V5.5M3 5.5H13C13.2761 5.5 13.5 5.72386 13.5 6V13C13.5 13.2761 13.2761 13.5 13 13.5H3C2.72386 13.5 2.5 13.2761 2.5 13V6C2.5 5.72386 2.72386 5.5 3 5.5Z"
      stroke="#C1C1C1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default React.memo(Lock);
