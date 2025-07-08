import * as React from 'react';
import Svg, {Rect, SvgProps} from 'react-native-svg';
import {widthScale} from '~styles/scaling-utils';

const Radio = (props: SvgProps) => (
  <Svg width={widthScale(24)} height={widthScale(24)} viewBox="0 0 24 24" fill="none" {...props}>
    <Rect x={5} y={5} width={14} height={14} rx={7} stroke="#EC4444" strokeWidth={6} />
  </Svg>
);
export default React.memo(Radio);
