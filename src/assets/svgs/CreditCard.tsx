import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const CreditCard = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M15.75 15.75H18.75M11.25 15.75H12.75M2.25 9.08435H21.75M3 5.25H21C21.4142 5.25 21.75 5.58579 21.75 6V18C21.75 18.4142 21.4142 18.75 21 18.75H3C2.58579 18.75 2.25 18.4142 2.25 18V6C2.25 5.58579 2.58579 5.25 3 5.25Z"
      stroke="#242424"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default React.memo(CreditCard);
