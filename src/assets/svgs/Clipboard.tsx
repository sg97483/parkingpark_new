import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';
import {widthScale} from '~styles/scaling-utils';

const Clipboard = (props: SvgProps) => (
  <Svg width={widthScale(24)} height={widthScale(24)} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M9.833 14.25h6m-6-3h6m0-7.5h3.75a.75.75 0 0 1 .75.75v15.75a.75.75 0 0 1-.75.75h-13.5a.75.75 0 0 1-.75-.75V4.5a.75.75 0 0 1 .75-.75h3.75m-.75 3V6a3.75 3.75 0 0 1 7.5 0v.75h-7.5Z"
      stroke="#242424"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(Clipboard);
