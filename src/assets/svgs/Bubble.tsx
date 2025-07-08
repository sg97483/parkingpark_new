import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';
import {widthScale} from '~styles/scaling-utils';

const Bubble = (props: SvgProps) => (
  <Svg width={widthScale(24)} height={widthScale(24)} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M8.634 16.49a6.742 6.742 0 0 0 9.806 3.563l2.335.665a.563.563 0 0 0 .694-.694l-.666-2.334a6.74 6.74 0 0 0-5.438-10.181m-12.168 5.68a6.76 6.76 0 1 1 2.362 2.363l-2.334.666a.564.564 0 0 1-.694-.694l.666-2.334Z"
      stroke="#242424"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(Bubble);
