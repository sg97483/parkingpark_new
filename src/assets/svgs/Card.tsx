import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const Card = (props: SvgProps) => (
  <Svg
    width={22}
    height={16}
    viewBox="0 0 22 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M14.303 11.75H17.303M9.80298 11.75H11.303M0.802979 5.08435H20.303M1.55298 1.25H19.553C19.9672 1.25 20.303 1.58579 20.303 2V14C20.303 14.4142 19.9672 14.75 19.553 14.75H1.55298C1.13876 14.75 0.802979 14.4142 0.802979 14V2C0.802979 1.58579 1.13876 1.25 1.55298 1.25Z"
      stroke="#242424"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(Card);
