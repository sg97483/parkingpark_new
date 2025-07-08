import * as React from 'react';
import Svg, {SvgProps, Rect, Circle, Path} from 'react-native-svg';

const NonProfile = (props: SvgProps) => (
  <Svg
    width={60}
    height={60}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect width={60} height={60} rx={30} fill="#DFDFDF" />
    <Circle cx={30} cy={22.83} r={7.063} fill="#A5A5A5" />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M26.515 31.748a9 9 0 0 0-9 9v3.485h24.97v-3.484a9 9 0 0 0-9-9h-6.97Z"
      fill="#A5A5A5"
    />
  </Svg>
);

export default NonProfile;
