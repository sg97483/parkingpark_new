import * as React from 'react';
import Svg, {Rect, G, Path, Defs, ClipPath, SvgProps} from 'react-native-svg';
import {heightScale, widthScale} from '~styles/scaling-utils';

const LocalParking = (props: SvgProps) => (
  <Svg width={widthScale(20)} height={heightScale(21)} viewBox="0 0 20 21" fill="none" {...props}>
    <Rect y={0.5} width={20} height={20} rx={4} fill="#EC4444" />
    <G clipPath="url(#a)">
      <Path
        d="M10.395 6H8c-.55 0-1 .45-1 1v7c0 .55.45 1 1 1s1-.45 1-1v-2h1.5a3.003 3.003 0 0 0 2.975-3.395C13.28 7.095 11.92 6 10.395 6Zm.205 4H9V8h1.6c.55 0 1 .45 1 1s-.45 1-1 1Z"
        fill="#fff"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M4 4.5h12v12H4z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default React.memo(LocalParking);
