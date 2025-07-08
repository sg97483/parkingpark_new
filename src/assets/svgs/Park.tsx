import * as React from 'react';
import Svg, {Rect, G, Path, Defs, ClipPath, SvgProps} from 'react-native-svg';
import {widthScale} from '~styles/scaling-utils';

const Park = (props: SvgProps) => (
  <Svg
    width={widthScale(20)}
    height={widthScale(20)}
    viewBox="0 0 20 21"
    fill="none"
    // xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect y={0.5} width={20} height={20} rx={4} fill="#EC4444" />
    <G clipPath="url(#clip0_346_5878)">
      <Path
        d="M10.395 6H8C7.45 6 7 6.45 7 7V14C7 14.55 7.45 15 8 15C8.55 15 9 14.55 9 14V12H10.5C12.285 12 13.71 10.435 13.475 8.605C13.28 7.095 11.92 6 10.395 6ZM10.6 10H9V8H10.6C11.15 8 11.6 8.45 11.6 9C11.6 9.55 11.15 10 10.6 10Z"
        fill="white"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_346_5878">
        <Rect width={12} height={12} fill="white" transform="translate(4 4.5)" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default React.memo(Park);
