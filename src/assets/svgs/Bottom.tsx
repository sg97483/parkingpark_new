import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';
import {widthScale} from '~styles/scaling-utils';

const Bottom = (props: SvgProps & any) => (
  <Svg
    width={widthScale(24)}
    height={widthScale(24)}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M19.5 9.88672L12 17.3867L4.5 9.88672"
      stroke="#242424"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default React.memo(Bottom);
