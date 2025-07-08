import * as React from 'react';
import Svg, {SvgProps, G, Path, Defs, ClipPath} from 'react-native-svg';

const Facebook = (props: SvgProps) => (
  <Svg
    width={33}
    height={32}
    viewBox="0 0 33 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <G clipPath="url(#a)">
      <Path
        d="M32.125 16c0-8.837-7.163-16-16-16s-16 7.163-16 16c0 7.986 5.85 14.605 13.5 15.806V20.625H9.562V16h4.063v-3.525c0-4.01 2.389-6.225 6.043-6.225 1.75 0 3.582.313 3.582.313V10.5h-2.017c-1.988 0-2.608 1.233-2.608 2.5v3h4.438l-.71 4.625h-3.728v11.18c7.65-1.2 13.5-7.82 13.5-15.805Z"
        fill="#1877F2"
      />
      <Path
        d="m22.353 20.625.71-4.625h-4.438v-3c0-1.265.62-2.5 2.608-2.5h2.017V6.562s-1.83-.312-3.582-.312c-3.654 0-6.043 2.215-6.043 6.225V16H9.562v4.625h4.063v11.18c1.657.26 3.343.26 5 0v-11.18h3.728Z"
        fill="#fff"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M.125 0h32v32h-32z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default Facebook;
