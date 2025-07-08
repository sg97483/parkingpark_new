import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';
import {widthScale} from '~styles/scaling-utils';

const MagnifyingGlass = (props: SvgProps) => (
  <Svg width={widthScale(24)} height={widthScale(24)} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.4438 16.4438L21.0001 21.0001M18.75 10.875C18.75 15.2242 15.2242 18.75 10.875 18.75C6.52576 18.75 3 15.2242 3 10.875C3 6.52576 6.52576 3 10.875 3C15.2242 3 18.75 6.52576 18.75 10.875Z"
      stroke="#242424"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default React.memo(MagnifyingGlass);
