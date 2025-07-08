import * as React from 'react';
import Svg, {Rect, SvgProps} from 'react-native-svg';
import {widthScale} from '~styles/scaling-utils';

const RadioNoCheck = (props: SvgProps) => (
  <Svg width={widthScale(24)} height={widthScale(24)} viewBox="0 0 24 24" fill="none" {...props}>
    <Rect
      x={2.75}
      y={2.75}
      width={18.5}
      height={18.5}
      rx={9.25}
      stroke="#DFDFDF"
      strokeWidth={1.5}
    />
  </Svg>
);
export default React.memo(RadioNoCheck);
