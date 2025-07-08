import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const IconsRight = (props: SvgProps) => (
  <Svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    // xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M6 3L11 8L6 13"
      stroke={props?.stroke || '#8B8B8B'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default React.memo(IconsRight);
